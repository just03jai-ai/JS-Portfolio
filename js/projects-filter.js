/* Filters: everything is visible at rest; buttons narrow the view. */
(function () {
  var btns = Array.prototype.slice.call(document.querySelectorAll('.fbtn'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.pcard[data-cat]'));
  var feat = document.querySelector('.feat');
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
  function apply(f) {
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === f)); });
    cards.forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    feat.hidden = !(f === 'all' || f === 'enterprise' || f === 'mobile');
    groups.forEach(function (g) {
      var any = g.querySelector('.pcard:not([hidden])');
      var head = g.querySelector('.grp'); if (head) head.hidden = !any;
    });
    document.getElementById('empty').hidden = cards.some(function (c) { return !c.hidden; });
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter); }); });
})();
