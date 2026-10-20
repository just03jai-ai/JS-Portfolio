/* Download CV: the viewer's download capability when available, else open the PDF.
   Shared by index.html and pages/experience.html. Each page sets
   window.CV_PDF_PATH (relative to that page's own location) before loading this file. */
(function () {
  var PDF = window.CV_PDF_PATH;
  var btns = Array.prototype.slice.call(document.querySelectorAll('[data-cv-download]'));
  var status = document.querySelector('.cv-status');
  var dl = null;
  function say(t) { if (status) status.textContent = t; }
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('downloads').then(function (d) { dl = d; }).catch(function () { dl = null; });
  }
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!dl) { window.open(PDF, '_blank', 'noopener'); return; }
      btn.disabled = true; say('Preparing PDF…');
      fetch(PDF).then(function (r) { if (!r.ok) throw new Error('fetch'); return r.blob(); })
        .then(function (blob) { return dl.save({ filename: 'Jai_Singh_CV.pdf', data: blob }); })
        .then(function () { say('Saved.'); })
        .catch(function (e) {
          var c = e && e.code;
          if (c === 'declined') say('');
          else if (c === 'rate_limited') say('A save prompt is already open.');
          else { say('Download isn’t available here. Opening the PDF instead.'); window.open(PDF, '_blank', 'noopener'); }
        })
        .then(function () { btn.disabled = false; });
    });
  });
})();
