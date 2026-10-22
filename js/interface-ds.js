/* Local component examples; state stays on this page. */
(function () {
  'use strict';
  var demo = document.querySelector('.palette-demo');
  var paletteStatus = document.querySelector('[data-palette-status]');
  var palettes = {
    brand: ['#3478f6', '#cedfff', '#2c68d7'],
    mono: ['#50545d', '#e8e9e9', '#373b43'],
    error: ['#ed4545', '#ffe0e0', '#bd2e2e'],
    success: ['#159447', '#d9f1df', '#0d7b31'],
    warning: ['#c47a0a', '#ffedc4', '#8c5500']
  };
  function applyPalette(name) {
    var colors = palettes[name];
    demo.dataset.palette = name;
    demo.style.setProperty('--demo-solid', colors[0]);
    demo.style.setProperty('--demo-tonal', colors[1]);
    demo.style.setProperty('--demo-text', colors[2]);
    demo.querySelectorAll('[data-palette-choice]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === name));
    });
    if (demo.dataset.theme === 'dark') {
      demo.style.setProperty('--demo-tonal', 'color-mix(in srgb, ' + colors[0] + ' 24%, #1c1e22)');
      demo.style.setProperty('--demo-text', 'color-mix(in srgb, ' + colors[0] + ' 55%, white)');
    }
    paletteStatus.textContent = name + ' palette, ' + (demo.dataset.theme === 'dark' ? 'dark' : 'light') + ' theme.';
  }
  demo.querySelectorAll('[data-palette-choice]').forEach(function (button) {
    button.addEventListener('click', function () { applyPalette(button.dataset.paletteChoice); });
  });
  demo.querySelector('[data-demo-dark]').addEventListener('change', function (event) {
    demo.dataset.theme = event.target.checked ? 'dark' : 'light';
    applyPalette(demo.dataset.palette);
  });
  demo.querySelector('[data-approve]').addEventListener('click', function (event) {
    var button = event.currentTarget;
    var approved = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(approved));
    button.querySelector('span').textContent = approved ? 'Approved' : 'Approve';
    paletteStatus.textContent = approved ? 'Sample approved.' : 'Sample approval cleared.';
  });
  demo.querySelectorAll('[data-sample-action]').forEach(function (button) {
    button.addEventListener('click', function () { paletteStatus.textContent = button.dataset.sampleAction; });
  });

  var libraryStatus = document.querySelector('[data-library-status]');
  var menu = document.getElementById('sample-menu');
  document.querySelector('.more-button').addEventListener('click', function (event) {
    menu.hidden = !menu.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!menu.hidden));
  });
  menu.querySelectorAll('[data-menu-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      libraryStatus.textContent = button.dataset.menuAction + ' selected in the component example.';
    });
  });

  var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var durations = ['4h 49m', '3h 12m', '3h 24m', '1h 2m', '15m'];
  var tooltip = document.querySelector('.chart-tooltip');
  function showChartDay(index) { tooltip.textContent = dayNames[index] + ' · ' + durations[index]; }
  document.querySelectorAll('[data-chart-day]').forEach(function (button) {
    ['mouseenter', 'focus', 'click'].forEach(function (eventName) {
      button.addEventListener(eventName, function () { showChartDay(Number(button.dataset.chartDay)); });
    });
  });
  document.querySelector('.donut').addEventListener('pointermove', function (event) {
    var rect = event.currentTarget.getBoundingClientRect();
    var angle = (Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2) + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    var fraction = angle / (2 * Math.PI);
    var stops = [289 / 762, 481 / 762, 685 / 762, 747 / 762, 1];
    showChartDay(stops.findIndex(function (stop) { return fraction <= stop; }));
  });

  var year = 2024;
  var month = 3;
  var selected = new Date(year, month, 15);
  var days = document.querySelector('.calendar-days');
  var heading = document.querySelector('[data-calendar-month]');
  function dateLabel(date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  function sameDate(a, b) { return a && b && a.toDateString() === b.toDateString(); }
  function renderCalendar() {
    heading.textContent = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    days.replaceChildren();
    var offset = new Date(year, month, 1).getDay();
    var count = Math.ceil((offset + new Date(year, month + 1, 0).getDate()) / 7) * 7;
    for (var i = 0; i < count; i++) {
      var date = new Date(year, month, i - offset + 1);
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = date.getDate();
      button.dataset.date = [date.getFullYear(), date.getMonth(), date.getDate()].join('/');
      button.setAttribute('aria-label', dateLabel(date));
      button.setAttribute('aria-pressed', String(Boolean(sameDate(date, selected))));
      if (date.getMonth() !== month) button.classList.add('outside');
      if (sameDate(date, new Date(2024, 3, 3))) {
        var marker = document.createElement('img');
        marker.src = '../assets/interface-ds/today.svg';
        marker.alt = '';
        marker.className = 'calendar-today-marker';
        button.appendChild(marker);
      }
      days.appendChild(button);
    }
  }
  function chooseDate(date) {
    selected = date;
    year = date.getFullYear();
    month = date.getMonth();
    renderCalendar();
    var focused = days.querySelector('[aria-pressed="true"]');
    if (focused) focused.focus({ preventScroll: true });
    libraryStatus.textContent = dateLabel(date) + ' selected.';
  }
  function buttonDate(button) {
    var parts = button.dataset.date.split('/').map(Number);
    return new Date(parts[0], parts[1], parts[2]);
  }
  days.addEventListener('click', function (event) {
    var button = event.target.closest('[data-date]');
    if (button) chooseDate(buttonDate(button));
  });
  days.addEventListener('keydown', function (event) {
    var movement = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (!movement || !event.target.dataset.date) return;
    event.preventDefault();
    var date = buttonDate(event.target);
    date.setDate(date.getDate() + movement);
    chooseDate(date);
  });
  document.querySelectorAll('[data-month-step]').forEach(function (button) {
    button.addEventListener('click', function () {
      var next = new Date(year, month + Number(button.dataset.monthStep), 1);
      year = next.getFullYear(); month = next.getMonth(); renderCalendar();
    });
  });
  document.querySelectorAll('[data-date-offset]').forEach(function (button) {
    button.addEventListener('click', function () {
      var date = new Date();
      date.setDate(date.getDate() + Number(button.dataset.dateOffset));
      chooseDate(date);
    });
  });
  document.querySelector('[data-date-remove]').addEventListener('click', function () {
    selected = null; renderCalendar(); libraryStatus.textContent = 'Date removed.';
  });
  document.querySelector('[data-date-done]').addEventListener('click', function () {
    libraryStatus.textContent = selected ? 'Date confirmed: ' + dateLabel(selected) + '.' : 'Choose a date first.';
  });
  document.querySelector('[data-add-reminder]').addEventListener('click', function (event) {
    var input = event.currentTarget.nextElementSibling;
    input.hidden = false; input.focus();
  });
  renderCalendar();
})();
