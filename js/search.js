/* ============================================================
   Safe2Bite Doctor Web Portal — Search Module
   ============================================================ */

const Search = (() => {

  let inputEl   = null;
  let dropdownEl = null;
  let isOpen    = false;
  let debounceTimer = null;
  let highlightIndex = -1;

  /* -----------------------------------------------
     Initialize
  ----------------------------------------------- */
  function init() {
    inputEl    = document.getElementById('global-search');
    dropdownEl = document.getElementById('search-dropdown');
    if (!inputEl || !dropdownEl) return;

    inputEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = inputEl.value.trim();
        if (q.length >= 1) {
          performSearch(q);
          openDropdown();
        } else {
          closeDropdown();
        }
      }, 160);
    });

    inputEl.addEventListener('focus', () => {
      const q = inputEl.value.trim();
      if (q.length >= 1) openDropdown();
    });

    inputEl.addEventListener('keydown', handleKeydown);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !dropdownEl.contains(e.target) && e.target !== inputEl) {
        closeDropdown();
      }
    });

    // Keyboard shortcut: / or Ctrl+K to focus
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputEl.focus();
        inputEl.select();
      }
    });
  }

  /* -----------------------------------------------
     Search logic (sample data)
     TODO: Replace with API call to /api/search?q={query}
  ----------------------------------------------- */
  function performSearch(query) {
    const q = query.toLowerCase();
    const data = Safe2BiteData.searchSamples;

    const matchedPatients = data.patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.treatment.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedAlerts = data.alerts.filter(a =>
      a.label.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
    ).slice(0, 3);

    renderResults({ query, patients: matchedPatients, alerts: matchedAlerts });
  }

  /* -----------------------------------------------
     Render results
  ----------------------------------------------- */
  function renderResults({ query, patients, alerts }) {
    const listEl = document.getElementById('search-results-list');
    const countEl = document.getElementById('search-result-count');
    const queryLabel = document.getElementById('search-query-label');

    if (!listEl) return;

    const total = patients.length + alerts.length;
    if (queryLabel) queryLabel.innerHTML = `Results for <strong>"${escHtml(query)}"</strong>`;
    if (countEl) countEl.textContent = `${total} result${total !== 1 ? 's' : ''}`;

    if (total === 0) {
      listEl.innerHTML = `
        <div class="search-no-results">
          ${Icons.render('search', { size: 32, className: 'icon' })}
          <div class="search-no-results-title">No results found</div>
          <div class="search-no-results-sub">Try searching by patient name, ID, or treatment</div>
        </div>`;
      return;
    }

    let html = '';

    if (patients.length > 0) {
      html += `<div class="search-group">
        <div class="search-group-label">Patients</div>`;
      html += patients.map(p => `
        <div class="search-result-item" data-type="patient" data-id="${p.id}" role="button" tabindex="0" aria-label="${p.name}">
          <div class="avatar avatar-sm avatar-color-${p.avatarColor}" aria-hidden="true">${p.initials}</div>
          <div class="search-result-body">
            <div class="search-result-title">${highlightQuery(p.name, query)}</div>
            <div class="search-result-sub">${p.id} &middot; ${p.treatment} &middot; Age ${p.age}</div>
          </div>
          <div class="search-result-meta">
            ${Icons.render('chevron-right', { size: 14, className: 'icon' })}
          </div>
        </div>`).join('');
      html += `</div>`;
    }

    if (patients.length > 0 && alerts.length > 0) {
      html += `<div class="search-group-divider"></div>`;
    }

    if (alerts.length > 0) {
      html += `<div class="search-group">
        <div class="search-group-label">Alerts</div>`;
      html += alerts.map(a => `
        <div class="search-result-item" data-type="alert" data-id="${a.id}" role="button" tabindex="0" aria-label="${a.label}">
          <div class="search-result-icon icon-alert">
            ${Icons.render('alerts', { size: 15, className: 'icon' })}
          </div>
          <div class="search-result-body">
            <div class="search-result-title">${highlightQuery(a.label, query)}</div>
            <div class="search-result-sub">${a.type}</div>
          </div>
        </div>`).join('');
      html += `</div>`;
    }

    listEl.innerHTML = html;

    // Bind click handlers
    listEl.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => handleResultClick(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') handleResultClick(item);
      });
    });
  }

  /* -----------------------------------------------
     Handle result click
  ----------------------------------------------- */
  function handleResultClick(item) {
    const type = item.dataset.type;
    const id   = item.dataset.id;
    closeDropdown();
    inputEl.value = '';

    if (type === 'patient') {
      if (typeof PatientQuickView !== 'undefined') {
        PatientQuickView.open(id);
      }
    } else if (type === 'alert') {
      Sidebar.navigateTo('alerts');
    }
  }

  /* -----------------------------------------------
     Keyboard navigation
  ----------------------------------------------- */
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeDropdown();
      inputEl.blur();
    }
  }

  /* -----------------------------------------------
     Highlight query in text
  ----------------------------------------------- */
  function highlightQuery(text, query) {
    const escaped = escHtml(text);
    const escapedQ = escHtml(query);
    if (!query) return escaped;
    const regex = new RegExp(`(${escapedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }

  /* -----------------------------------------------
     Open / Close
  ----------------------------------------------- */
  function openDropdown() {
    isOpen = true;
    dropdownEl.classList.add('open');
    if (typeof Notifications !== 'undefined') Notifications.close();
    if (typeof ProfileMenu !== 'undefined') ProfileMenu.close();
  }

  function closeDropdown() {
    isOpen = false;
    dropdownEl.classList.remove('open');
  }

  function close() { closeDropdown(); }

  /* -----------------------------------------------
     Utility
  ----------------------------------------------- */
  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { init, close };

})();
