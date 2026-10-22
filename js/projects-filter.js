/* Project focus and case-study availability are independent filters. */
(function () {
  'use strict';
  var focusButtons = Array.from(document.querySelectorAll('[data-filter]'));
  var statusButtons = Array.from(document.querySelectorAll('[data-status-filter]'));
  var cards = Array.from(document.querySelectorAll('.pcard[data-cat][data-status]'));
  var groups = Array.from(document.querySelectorAll('[data-group]'));
  var focus = 'all';
  var status = 'all';
  function matchesFocus(card, value) {
    return value === 'all' || card.dataset.cat.split(' ').includes(value);
  }
  function matchesStatus(card, value) {
    return value === 'all' || card.dataset.status === value;
  }
  function count(predicate) { return cards.filter(predicate).length; }
  function apply() {
    cards.forEach(function (card) {
      card.hidden = !(matchesFocus(card, focus) && matchesStatus(card, status));
    });
    focusButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === focus));
      button.querySelector('b').textContent = count(function (card) {
        return matchesFocus(card, button.dataset.filter) && matchesStatus(card, status);
      });
    });
    statusButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.statusFilter === status));
      button.querySelector('b').textContent = count(function (card) {
        return matchesFocus(card, focus) && matchesStatus(card, button.dataset.statusFilter);
      });
    });
    groups.forEach(function (group) {
      group.hidden = !group.querySelector('.pcard:not([hidden])');
    });
    var visible = count(function (card) { return !card.hidden; });
    document.getElementById('empty').hidden = visible !== 0;
    document.getElementById('project-results').textContent = 'Showing ' + visible + (visible === 1 ? ' project' : ' projects');
  }
  focusButtons.forEach(function (button) {
    button.addEventListener('click', function () { focus = button.dataset.filter; apply(); });
  });
  statusButtons.forEach(function (button) {
    button.addEventListener('click', function () { status = button.dataset.statusFilter; apply(); });
  });
  document.querySelector('.reset-filters').addEventListener('click', function () {
    focus = 'all'; status = 'all'; apply(); focusButtons[0].focus();
  });
  document.querySelectorAll('[data-project-count]').forEach(function (element) {
    element.textContent = count(function (card) { return matchesStatus(card, element.dataset.projectCount); });
  });
  apply();
})();
