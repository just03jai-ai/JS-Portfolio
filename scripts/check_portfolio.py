"""Check this no-build portfolio using only the Python standard library.

HTML validation covers the site's document contract, not full HTML conformance.
External services and browser interactions remain covered by the QA report.
"""

import argparse
from collections import Counter
from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
import shutil
import tempfile
from threading import Thread
from urllib.parse import unquote, urlsplit
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]
LEGACY_ROUTES = {
    "cv.html": "pages/cv.html",
    "experience.html": "pages/experience.html",
    "projects.html": "pages/projects.html",
    "farmart-app.html": "case-studies/farmart-app.html",
    "farmart-pro.html": "case-studies/farmart-pro.html",
    "farmart-os.html": "case-studies/farmart-os.html",
}


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.tags = Counter()
        self.ids = []
        self.references = []
        self.canonicals = []
        self.redirects = []
        self.fallbacks = []
        self.has_doctype = False
        self.has_charset = False
        self.title = []
        self.in_title = False
        self.feed(path.read_text(encoding="utf-8"))
        self.close()

    def handle_decl(self, declaration):
        self.has_doctype |= declaration.lower() == "doctype html"

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        require(len(attrs) == len(attributes), f"{self.path}: duplicate attributes")
        self.tags[tag] += 1
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for key in ("href", "src"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if tag == "meta" and attrs.get("charset", "").lower() in ("utf-8", "utf8"):
            self.has_charset = True
        if tag == "title":
            self.in_title = True
        if tag == "link" and "canonical" in attrs.get("rel", "").split():
            self.canonicals.append(attrs.get("href"))
        if tag == "script" and attrs.get("src") == "js/legacy-redirect.js":
            self.redirects.append(attrs.get("data-target"))
        if tag == "a" and attrs.get("id") == "redirect-link":
            self.fallbacks.append(attrs.get("href"))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def documents():
    paths = sorted(ROOT.glob("*.html"))
    paths += sorted(ROOT.glob("pages/*.html"))
    paths += sorted(ROOT.glob("case-studies/*.html"))
    require((ROOT / "index.html") in paths, "Missing homepage")
    return {path.resolve(): Document(path) for path in paths}


def check_html(docs):
    for path, doc in docs.items():
        require(doc.has_doctype, f"{path}: missing HTML doctype")
        require(doc.has_charset, f"{path}: missing UTF-8 charset")
        for tag in ("html", "head", "body", "title"):
            require(doc.tags[tag] == 1, f"{path}: expected exactly one {tag}")
        require("".join(doc.title).strip(), f"{path}: empty title")
        require(len(doc.ids) == len(set(doc.ids)), f"{path}: duplicate IDs")
    for old, target in LEGACY_ROUTES.items():
        doc = docs.get((ROOT / old).resolve())
        require(doc is not None, f"Missing compatibility document: {old}")
        require((ROOT / target).resolve() in docs, f"Missing destination: {target}")
        require(target not in LEGACY_ROUTES, f"Redirect loop: {old}")
        require(doc.canonicals == [target], f"{old}: incorrect canonical")
        require(doc.redirects == [target], f"{old}: incorrect redirect target")
        require(doc.fallbacks == [target], f"{old}: incorrect fallback")
    print(f"HTML document contract: {len(docs)} pages and six legacy routes passed")


def local_target(source, reference):
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        return None
    target = ((ROOT / unquote(parsed.path).lstrip("/")) if parsed.path.startswith("/")
              else source.parent / unquote(parsed.path)) if parsed.path else source
    target = target.resolve()
    require(target.is_relative_to(ROOT), f"{source}: path escapes site: {reference}")
    require(target.is_file(), f"{source}: missing resource: {reference}")
    return target, unquote(parsed.fragment)


def check_links(docs):
    resources = set(docs)
    count = 0
    for source, doc in docs.items():
        for reference in doc.references:
            resolved = local_target(source, reference)
            if resolved is None:
                continue
            target, fragment = resolved
            if target.suffix == ".html" and fragment:
                require(target in docs and fragment in docs[target].ids,
                        f"{source}: missing fragment: {reference}")
            resources.add(target)
            count += 1
    for source in ROOT.glob("css/*.css"):
        for match in re.finditer(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)",
                                 source.read_text(encoding="utf-8")):
            reference = match.group(1).strip()
            if not reference.startswith("#"):
                resolved = local_target(source, reference)
                if resolved:
                    resources.add(resolved[0])
    # The CV is opened by JavaScript rather than by an HTML href.
    pdf = ROOT / "assets/cv/Jai_Singh_CV.pdf"
    require(pdf.is_file() and pdf.read_bytes().startswith(b"%PDF-"), "Missing/invalid CV PDF")
    resources.add(pdf.resolve())
    print(f"Link check: {count} local HTML references; {len(resources)} unique resources passed")
    return resources


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def check_build(resources):
    # There is no compiler: stage the static files as served by GitHub Pages.
    with tempfile.TemporaryDirectory(prefix="portfolio-check-") as temporary:
        stage = Path(temporary)
        site = stage / "JS-Portfolio"
        site.mkdir()
        for folder in ("assets", "css", "js", "pages", "case-studies"):
            shutil.copytree(ROOT / folder, site / folder,
                            ignore=shutil.ignore_patterns(".DS_Store"))
        for source in ROOT.glob("*.html"):
            shutil.copy2(source, site / source.name)
        handler = partial(QuietHandler, directory=str(stage))
        with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
            thread = Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                for resource in sorted(resources):
                    relative = resource.relative_to(ROOT).as_posix()
                    url = f"http://127.0.0.1:{server.server_port}/JS-Portfolio/{relative}"
                    with urlopen(url, timeout=10) as response:
                        require(response.status == 200, f"HTTP failure: {relative}")
                        require(response.read() == resource.read_bytes(),
                                f"Staged resource differs: {relative}")
            finally:
                server.shutdown()
                thread.join()
        print(f"Static build: {len(resources)} staged resources served unchanged under /JS-Portfolio/")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phase", choices=("html", "links", "build"))
    phase = parser.parse_args().phase
    docs = documents()
    if phase == "html":
        check_html(docs)
    else:
        resources = check_links(docs)
        if phase == "build":
            check_build(resources)
