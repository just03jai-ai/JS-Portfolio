/* Download CV: uses the viewer's download capability; falls back to opening the PDF. */
(function () {
  var PDF = '../assets/cv/Jai_Singh_CV.pdf';
  var btn = document.getElementById('dl-btn');
  var status = document.getElementById('dl-status');
  var dl = null;
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('downloads').then(function (d) { dl = d; }).catch(function () { dl = null; });
  }
  btn.addEventListener('click', function () {
    if (!dl) { window.open(PDF, '_blank', 'noopener'); return; }
    btn.disabled = true; status.textContent = 'Preparing PDF…';
    fetch(PDF).then(function (r) { if (!r.ok) throw new Error('fetch'); return r.blob(); })
      .then(function (blob) { return dl.save({ filename: 'Jai_Singh_CV.pdf', data: blob }); })
      .then(function () { status.textContent = 'Saved.'; })
      .catch(function (e) {
        var c = e && e.code;
        if (c === 'declined') status.textContent = '';
        else if (c === 'rate_limited') status.textContent = 'A save prompt is already open.';
        else { status.textContent = 'Download isn’t available here. Opening the PDF instead.'; window.open(PDF, '_blank', 'noopener'); }
      })
      .then(function () { btn.disabled = false; });
  });
})();
