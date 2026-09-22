/* ============================================================
   Safe2Bite Doctor Web Portal — Patients Directory Module (Pass 3)
   ============================================================ */

const Patients = (() => {

  // State
  let searchQuery = '';
  let filters = {
    treatmentStatus: 'all',
    activityStatus: 'all',
    alertStatus: 'all',
    careTeam: 'all'
  };
  let sortColumn = 'name';
  let sortDirection = 'asc'; // 'asc' | 'desc'
  let currentPage = 1;
  const pageSize = 25;
  const totalPanelCount = 128; // Display panel count for prototype wireframe

  let activePatientId = null;
  let searchDebounceTimer = null;

  /* --------------------------------------------------
     Initialize Module
  -------------------------------------------------- */
  function init() {
    bindEvents();
    render();
    console.info('[Safe2Bite] Patients Directory Module initialized');
  }

  /* --------------------------------------------------
     Bind Event Handlers
  -------------------------------------------------- */
  function bindEvents() {
    // Search input with realistic typing debounce & spinner
    const searchInput = document.getElementById('patient-search-input');
    const searchWrap  = document.getElementById('patient-search-wrap');
    const clearBtn    = document.getElementById('patient-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = query.trim() ? 'flex' : 'none';
        }

        if (searchWrap) searchWrap.classList.add('is-loading');

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          searchQuery = query.trim().toLowerCase();
          currentPage = 1;
          if (searchWrap) searchWrap.classList.remove('is-loading');
          render();
        }, 220);
      });

      // Clear search button
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          clearBtn.style.display = 'none';
          currentPage = 1;
          render();
          searchInput.focus();
        });
      }
    }

    // Filter selects
    const filterSelects = ['filter-treatment', 'filter-activity', 'filter-attention', 'filter-careteam'];
    filterSelects.forEach(id => {
      const select = document.getElementById(id);
      if (select) {
        select.addEventListener('change', () => {
          applyFiltersFromUI();
        });
      }
    });

    // Filter buttons
    const applyBtn = document.getElementById('btn-apply-filters');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applyFiltersFromUI();
      });
    }

    const clearFiltersBtn = document.getElementById('btn-clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
      });
    }

    // Column sort headers
    const sortHeaders = document.querySelectorAll('.sortable-th');
    sortHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (col) setSort(col);
      });
    });

    // Pagination buttons
    const prevBtn = document.getElementById('btn-page-prev');
    const nextBtn = document.getElementById('btn-page-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          render();
          scrollToTableTop();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const total = getFilteredData().length;
        const maxPage = Math.ceil(total / pageSize) || 1;
        if (currentPage < maxPage) {
          currentPage++;
          render();
          scrollToTableTop();
        }
      });
    }

    // Delegated click for patient row, view button, quick view button, message button
    const tableBody = document.getElementById('patients-table-body');
    if (tableBody) {
      tableBody.addEventListener('click', handleTableClick);
    }

    const cardList = document.getElementById('patients-card-list');
    if (cardList) {
      cardList.addEventListener('click', handleTableClick);
    }

    // Patient Profile Back Button
    const backBtn = document.getElementById('profile-back-to-patients');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        Sidebar.navigateTo('patients');
      });
    }
  }

  /* --------------------------------------------------
     Handle Click on Table or Mobile Cards
  -------------------------------------------------- */
  function handleTableClick(e) {
    // Quick View button
    const qvBtn = e.target.closest('[data-action="quickview"]');
    if (qvBtn) {
      e.stopPropagation();
      const id = qvBtn.dataset.id;
      if (id) openQuickView(id);
      return;
    }

    // Message button
    const msgBtn = e.target.closest('[data-action="message"]');
    if (msgBtn) {
      e.stopPropagation();
      const id = msgBtn.dataset.id;
      if (id) messagePatient(id);
      return;
    }

    // View Patient button or clicking on row
    const viewBtn = e.target.closest('[data-action="view-patient"]');
    const row = e.target.closest('[data-patient-id]');
    const targetId = (viewBtn && viewBtn.dataset.id) || (row && row.dataset.patientId);

    if (targetId) {
      viewPatient(targetId);
    }
  }

  /* --------------------------------------------------
     Apply Filters From UI
  -------------------------------------------------- */
  function applyFiltersFromUI() {
    const treat = document.getElementById('filter-treatment')?.value || 'all';
    const act   = document.getElementById('filter-activity')?.value || 'all';
    const att   = document.getElementById('filter-attention')?.value || 'all';
    const team  = document.getElementById('filter-careteam')?.value || 'all';

    filters.treatmentStatus = treat;
    filters.activityStatus  = act;
    filters.alertStatus     = att;
    filters.careTeam        = team;
    currentPage = 1;

    render();
  }

  /* --------------------------------------------------
     Reset Filters
  -------------------------------------------------- */
  function resetFilters() {
    filters = {
      treatmentStatus: 'all',
      activityStatus: 'all',
      alertStatus: 'all',
      careTeam: 'all'
    };

    const s1 = document.getElementById('filter-treatment');
    const s2 = document.getElementById('filter-activity');
    const s3 = document.getElementById('filter-attention');
    const s4 = document.getElementById('filter-careteam');
    if (s1) s1.value = 'all';
    if (s2) s2.value = 'all';
    if (s3) s3.value = 'all';
    if (s4) s4.value = 'all';

    const searchInput = document.getElementById('patient-search-input');
    const clearBtn = document.getElementById('patient-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    searchQuery = '';
    currentPage = 1;

    render();
  }

  /* --------------------------------------------------
     Sorting Logic
  -------------------------------------------------- */
  function setSort(col) {
    if (sortColumn === col) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = col;
      sortDirection = 'asc';
    }
    render();
  }

  function sortData(list) {
    return [...list].sort((a, b) => {
      let valA, valB;

      switch (sortColumn) {
        case 'id':
          valA = a.id;
          valB = b.id;
          break;
        case 'treatment':
          valA = a.treatmentStatusLabel;
          valB = b.treatmentStatusLabel;
          break;
        case 'dose':
          valA = a.doseStatus;
          valB = b.doseStatus;
          break;
        case 'assessment':
          valA = a.assessmentStatus;
          valB = b.assessmentStatus;
          break;
        case 'activity':
          valA = a.lastActivityTimestamp || a.lastActivity;
          valB = b.lastActivityTimestamp || b.lastActivity;
          break;
        case 'name':
        default:
          valA = a.lastName + ' ' + a.firstName;
          valB = b.lastName + b.firstName;
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /* --------------------------------------------------
     Filter Data
  -------------------------------------------------- */
  function getFilteredData() {
    const raw = Safe2BiteData.getPatients ? Safe2BiteData.getPatients() : [];

    return raw.filter(p => {
      // Search
      if (searchQuery) {
        const matchName = (p.name || '').toLowerCase().includes(searchQuery);
        const matchId   = (p.id || '').toLowerCase().includes(searchQuery);
        const matchProtocol = (p.treatmentLabel || '').toLowerCase().includes(searchQuery);
        if (!matchName && !matchId && !matchProtocol) return false;
      }

      // Treatment Status filter
      if (filters.treatmentStatus !== 'all') {
        if (p.treatmentStatus !== filters.treatmentStatus) return false;
      }

      // Activity filter
      if (filters.activityStatus !== 'all') {
        if (p.activityStatus !== filters.activityStatus) return false;
      }

      // Attention filter
      if (filters.alertStatus !== 'all') {
        if (filters.alertStatus === 'attention_required' && p.alertStatus !== 'attention_required') return false;
        if (filters.alertStatus === 'none' && p.alertStatus !== 'none') return false;
      }

      // Care Team filter
      if (filters.careTeam !== 'all') {
        if (p.careTeam !== filters.careTeam) return false;
      }

      return true;
    });
  }

  /* --------------------------------------------------
     Render Table & Mobile Cards
  -------------------------------------------------- */
  function render() {
    const filtered = getFilteredData();
    const sorted = sortData(filtered);

    // Update count badge
    const countBadge = document.getElementById('patient-count-badge');
    if (countBadge) {
      countBadge.textContent = `${totalPanelCount} Active Patients`;
    }

    // Active tags
    renderActiveFilterTags();

    // Table elements
    const tableWrap = document.getElementById('patients-table-card');
    const tableBody = document.getElementById('patients-table-body');
    const cardList  = document.getElementById('patients-card-list');
    const emptyState = document.getElementById('patients-empty-state');
    const errorState = document.getElementById('patients-error-state');

    if (errorState) errorState.style.display = 'none';

    // Check empty
    if (sorted.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (cardList) cardList.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      renderPagination(0, 1);
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Paginate (slice for current page)
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = sorted.slice(startIndex, startIndex + pageSize);

    // Update Sort Indicators
    updateSortHeaders();

    // Render Table Rows
    if (tableBody) {
      tableBody.innerHTML = paginatedItems.map(p => renderTableRow(p)).join('');
    }

    // Render Mobile Cards
    if (cardList) {
      cardList.innerHTML = paginatedItems.map(p => renderMobileCard(p)).join('');
    }

    // Render Pagination Controls
    renderPagination(sorted.length, currentPage);
  }

  /* --------------------------------------------------
     Render Table Row HTML
  -------------------------------------------------- */
  function renderTableRow(p) {
    return `
      <tr data-patient-id="${p.id}" tabindex="0" role="row" aria-label="Patient record for ${p.name}">
        <!-- Patient -->
        <td>
          <div class="patient-id-cell">
            <div class="patient-dir-avatar avatar-color-${p.avatarColor}" aria-hidden="true">
              ${p.initials}
            </div>
            <div class="patient-dir-name-wrap">
              <span class="patient-dir-name">${p.name}</span>
              <span class="patient-dir-sub">Age ${p.age} &middot; DOB: ${p.dobPlaceholder}</span>
            </div>
          </div>
        </td>

        <!-- Patient ID -->
        <td>
          <span class="patient-code-badge">${p.id}</span>
        </td>

        <!-- Treatment Status -->
        <td>
          <div class="treatment-dir-cell">
            ${renderTreatmentBadge(p)}
            <span class="treatment-dir-label">${p.treatmentLabel}</span>
          </div>
        </td>

        <!-- Today's Assessment -->
        <td>
          ${renderAssessmentBadge(p.assessmentStatus, p.assessmentStatusLabel)}
        </td>

        <!-- Today's Dose -->
        <td>
          ${renderDoseBadge(p.doseStatus, p.doseStatusLabel)}
        </td>

        <!-- Alerts -->
        <td>
          ${renderAlertBadge(p.alertStatus, p.alertDetail)}
        </td>

        <!-- Last Activity -->
        <td>
          <span style="font-size:var(--font-size-xs); color:var(--color-text-secondary); white-space:nowrap;">
            ${p.lastActivity}
          </span>
        </td>

        <!-- Actions -->
        <td>
          <div class="patient-action-btns">
            <button class="btn-view-patient" data-action="view-patient" data-id="${p.id}" aria-label="View Clinical Overview for ${p.name}">
              View Patient
              ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
            </button>
            <button class="btn-action-icon" data-action="quickview" data-id="${p.id}" title="Quick Summary" aria-label="Open quick summary for ${p.name}">
              ${Icons.render('eye', { size: 14, className: 'icon' })}
            </button>
            <button class="btn-action-icon" data-action="message" data-id="${p.id}" title="Message Patient" aria-label="Message ${p.name}">
              ${Icons.render('messages', { size: 14, className: 'icon' })}
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  /* --------------------------------------------------
     Render Mobile Card HTML (<= 768px)
  -------------------------------------------------- */
  function renderMobileCard(p) {
    return `
      <div class="patient-mobile-card" data-patient-id="${p.id}">
        <div class="patient-mobile-card-top">
          <div class="patient-id-cell">
            <div class="patient-dir-avatar avatar-color-${p.avatarColor}" aria-hidden="true">
              ${p.initials}
            </div>
            <div class="patient-dir-name-wrap">
              <span class="patient-dir-name">${p.name}</span>
              <span class="patient-dir-sub">${p.id} &middot; Age ${p.age}</span>
            </div>
          </div>
          ${renderTreatmentBadge(p)}
        </div>

        <div class="patient-mobile-card-grid">
          <div class="patient-mobile-field">
            <span class="mobile-field-label">Assessment</span>
            ${renderAssessmentBadge(p.assessmentStatus, p.assessmentStatusLabel)}
          </div>
          <div class="patient-mobile-field">
            <span class="mobile-field-label">Today's Dose</span>
            ${renderDoseBadge(p.doseStatus, p.doseStatusLabel)}
          </div>
          <div class="patient-mobile-field">
            <span class="mobile-field-label">Alerts</span>
            ${renderAlertBadge(p.alertStatus, p.alertDetail)}
          </div>
          <div class="patient-mobile-field">
            <span class="mobile-field-label">Last Activity</span>
            <span style="font-size:var(--font-size-xs); color:var(--color-text-secondary);">${p.lastActivity}</span>
          </div>
        </div>

        <div class="patient-mobile-card-actions">
          <button class="btn-action-icon" data-action="quickview" data-id="${p.id}" title="Quick Summary" aria-label="Open quick summary">
            ${Icons.render('eye', { size: 14, className: 'icon' })}
          </button>
          <button class="btn-action-icon" data-action="message" data-id="${p.id}" title="Message Patient" aria-label="Message patient">
            ${Icons.render('messages', { size: 14, className: 'icon' })}
          </button>
          <button class="btn-view-patient" data-action="view-patient" data-id="${p.id}">
            View Patient
            ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
          </button>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------
     Status Badge Helpers (Healthcare Safety Compliant)
     Strictly using icon + label + class, never color alone
  -------------------------------------------------- */
  function renderTreatmentBadge(p) {
    const map = {
      'active': { cls: 'badge-treat-active', icon: 'check', text: 'Active' },
      'paused': { cls: 'badge-treat-paused', icon: 'pause-circle', text: 'Paused' },
      'completed': { cls: 'badge-treat-completed', icon: 'star', text: 'Completed' },
      'needs_review': { cls: 'badge-treat-needs-review', icon: 'alert-triangle', text: 'Needs Review' }
    };
    const c = map[p.treatmentStatus] || { cls: 'badge-treat-active', icon: 'check', text: p.treatmentStatusLabel };
    return `
      <span class="s2b-badge ${c.cls}">
        ${Icons.render(c.icon, { size: 11, className: 'icon' })}
        ${c.text}
      </span>
    `;
  }

  function renderAssessmentBadge(status, label) {
    const map = {
      'completed': { cls: 'badge-assess-completed', icon: 'check-circle', text: 'Completed' },
      'pending': { cls: 'badge-assess-pending', icon: 'clock', text: 'Pending' },
      'not_submitted': { cls: 'badge-assess-not-submitted', icon: 'minus', text: 'Not Submitted' }
    };
    const c = map[status] || { cls: 'badge-assess-not-submitted', icon: 'minus', text: label || 'Not Submitted' };
    return `
      <span class="s2b-badge ${c.cls}">
        ${Icons.render(c.icon, { size: 11, className: 'icon' })}
        ${c.text}
      </span>
    `;
  }

  function renderDoseBadge(status, label) {
    const map = {
      'taken': { cls: 'badge-dose-taken', icon: 'check-circle', text: 'Taken' },
      'not_taken': { cls: 'badge-dose-not-taken', icon: 'minus', text: 'Not Taken' },
      'missed': { cls: 'badge-dose-missed', icon: 'alert-circle', text: 'Missed' },
      'upcoming': { cls: 'badge-dose-upcoming', icon: 'clock', text: 'Upcoming' }
    };
    const c = map[status] || { cls: 'badge-dose-not-taken', icon: 'minus', text: label || 'Not Taken' };
    return `
      <span class="s2b-badge ${c.cls}">
        ${Icons.render(c.icon, { size: 11, className: 'icon' })}
        ${c.text}
      </span>
    `;
  }

  function renderAlertBadge(status, detail) {
    if (status === 'attention_required') {
      return `
        <span class="s2b-badge badge-alert-attention" title="${detail || 'Clinical attention recommended'}">
          ${Icons.render('alert-triangle', { size: 11, className: 'icon' })}
          Attention Required
        </span>
      `;
    }
    return `
      <span class="s2b-badge badge-alert-none">
        ${Icons.render('shield-check', { size: 11, className: 'icon' })}
        No Current Alerts
      </span>
    `;
  }

  /* --------------------------------------------------
     Update Sort Headers Visual State
  -------------------------------------------------- */
  function updateSortHeaders() {
    const sortHeaders = document.querySelectorAll('.sortable-th');
    sortHeaders.forEach(th => {
      const col = th.dataset.sort;
      const isSorted = col === sortColumn;
      th.classList.toggle('is-sorted', isSorted);
      th.setAttribute('aria-sort', isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none');

      const iconSpan = th.querySelector('.th-sort-icon');
      if (iconSpan) {
        if (isSorted) {
          const iconName = sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
          iconSpan.innerHTML = Icons.render(iconName, { size: 12, className: 'icon' });
        } else {
          iconSpan.innerHTML = Icons.render('arrows-up-down', { size: 12, className: 'icon' });
        }
      }
    });
  }

  /* --------------------------------------------------
     Render Active Filter Tags
  -------------------------------------------------- */
  function renderActiveFilterTags() {
    const tagsContainer = document.getElementById('patients-active-tags');
    if (!tagsContainer) return;

    const tags = [];
    if (searchQuery) {
      tags.push({ key: 'search', label: `Search: "${searchQuery}"` });
    }
    if (filters.treatmentStatus !== 'all') {
      tags.push({ key: 'treatmentStatus', label: `Treatment: ${filters.treatmentStatus}` });
    }
    if (filters.activityStatus !== 'all') {
      tags.push({ key: 'activityStatus', label: `Activity: ${filters.activityStatus.replace('_', ' ')}` });
    }
    if (filters.alertStatus !== 'all') {
      tags.push({ key: 'alertStatus', label: `Alerts: ${filters.alertStatus.replace('_', ' ')}` });
    }
    if (filters.careTeam !== 'all') {
      tags.push({ key: 'careTeam', label: `Care Team: ${filters.careTeam === 'assigned_doctor' ? 'Dr. Sarah Chen' : 'Team Member'}` });
    }

    if (tags.length === 0) {
      tagsContainer.innerHTML = '';
      tagsContainer.style.display = 'none';
      return;
    }

    tagsContainer.style.display = 'flex';
    tagsContainer.innerHTML = tags.map(t => `
      <span class="active-tag-chip">
        ${t.label}
        <button class="active-tag-remove" data-remove-key="${t.key}" aria-label="Remove filter: ${t.label}">
          ${Icons.render('x', { size: 12, className: 'icon' })}
        </button>
      </span>
    `).join('') + `
      <button class="btn-filter-clear" id="btn-clear-all-chips" style="height:24px; padding:0 8px; font-size:11px;">
        Clear All
      </button>
    `;

    // Bind remove tag clicks
    tagsContainer.querySelectorAll('.active-tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.removeKey;
        if (k === 'search') {
          searchQuery = '';
          const inp = document.getElementById('patient-search-input');
          const clr = document.getElementById('patient-search-clear');
          if (inp) inp.value = '';
          if (clr) clr.style.display = 'none';
        } else if (k) {
          filters[k] = 'all';
          const sel = document.getElementById(`filter-${k.replace('Status', '').toLowerCase()}`);
          if (sel) sel.value = 'all';
        }
        currentPage = 1;
        render();
      });
    });

    const clearAllBtn = document.getElementById('btn-clear-all-chips');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', resetFilters);
    }
  }

  /* --------------------------------------------------
     Render Pagination Controls
  -------------------------------------------------- */
  function renderPagination(totalCount, page) {
    const infoEl = document.getElementById('pagination-info');
    const pagesWrap = document.getElementById('pagination-pages');
    const prevBtn = document.getElementById('btn-page-prev');
    const nextBtn = document.getElementById('btn-page-next');

    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalCount);

    if (infoEl) {
      infoEl.innerHTML = `Showing <strong>${startItem}–${endItem}</strong> of <strong>${totalPanelCount}</strong> patients`;
    }

    if (prevBtn) prevBtn.disabled = (page <= 1);
    if (nextBtn) nextBtn.disabled = (page >= totalPages);

    if (pagesWrap) {
      let html = '';
      for (let i = 1; i <= Math.min(totalPages, 6); i++) {
        html += `
          <button class="btn-page ${i === page ? 'active' : ''}" data-page="${i}" aria-label="Page ${i}" ${i === page ? 'aria-current="page"' : ''}>
            ${i}
          </button>
        `;
      }
      if (totalPages > 6) {
        html += `<span class="pagination-ellipsis">&hellip;</span>`;
        html += `
          <button class="btn-page ${totalPages === page ? 'active' : ''}" data-page="${totalPages}" aria-label="Page ${totalPages}">
            ${totalPages}
          </button>
        `;
      }
      pagesWrap.innerHTML = html;

      pagesWrap.querySelectorAll('.btn-page').forEach(b => {
        b.addEventListener('click', () => {
          const p = parseInt(b.dataset.page, 10);
          if (p && p !== currentPage) {
            currentPage = p;
            render();
            scrollToTableTop();
          }
        });
      });
    }
  }

  function scrollToTableTop() {
    const t = document.getElementById('patients-table-card');
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* --------------------------------------------------
     Quick View Interaction
  -------------------------------------------------- */
  function openQuickView(patientId) {
    if (typeof PatientQuickView !== 'undefined' && PatientQuickView.open) {
      PatientQuickView.open(patientId);
    }
  }

  /* --------------------------------------------------
     Message Action Interaction
  -------------------------------------------------- */
  function messagePatient(patientId) {
    console.info(`[Safe2Bite] Message action triggered for patient: ${patientId}`);
    Sidebar.navigateTo('messages');
  }

  /* --------------------------------------------------
     View Patient Profile Entry Point (Pass 4 Patient Clinical Overview)
  -------------------------------------------------- */
  function viewPatient(patientId) {
    const p = Safe2BiteData.getPatient ? Safe2BiteData.getPatient(patientId) : null;
    if (!p) {
      console.warn(`[Patients] Patient ${patientId} not found`);
      return;
    }

    activePatientId = patientId;

    // Route to Pass 4 Patient Clinical Overview controller if available
    if (typeof PatientOverview !== 'undefined' && PatientOverview.loadPatient) {
      PatientOverview.loadPatient(patientId);
      return;
    }

    // Fallback stub populator
    populateProfileEntry(p);
    Sidebar.navigateTo('patient-profile');
  }

  function populateProfileEntry(p) {
    // Avatar
    const av = document.getElementById('profile-patient-avatar');
    if (av) {
      av.textContent = p.initials;
      av.className = `profile-banner-avatar avatar-color-${p.avatarColor}`;
    }

    // Name & ID
    const nameEl = document.getElementById('profile-patient-name');
    if (nameEl) nameEl.textContent = p.name;

    const idEl = document.getElementById('profile-patient-id');
    if (idEl) idEl.textContent = p.id;

    // Meta details
    const ageEl = document.getElementById('profile-patient-age');
    if (ageEl) ageEl.textContent = `Age ${p.age}`;

    const dobEl = document.getElementById('profile-patient-dob');
    if (dobEl) dobEl.textContent = `DOB: ${p.dobPlaceholder}`;

    const treatBadgeEl = document.getElementById('profile-patient-treat-badge');
    if (treatBadgeEl) {
      treatBadgeEl.innerHTML = renderTreatmentBadge(p);
    }

    const treatLabelEl = document.getElementById('profile-patient-treat-label');
    if (treatLabelEl) treatLabelEl.textContent = p.treatmentLabel;

    const careTeamEl = document.getElementById('profile-patient-careteam');
    if (careTeamEl) careTeamEl.textContent = p.careTeamLabel;

    // Wire up profile message button
    const msgBtn = document.getElementById('profile-btn-message');
    if (msgBtn) {
      msgBtn.onclick = () => messagePatient(p.id);
    }
  }

  /* --------------------------------------------------
     Simulate Loading State (for prototype demonstration)
  -------------------------------------------------- */
  function simulateLoading() {
    const tableBody = document.getElementById('patients-table-body');
    if (!tableBody) return;

    let skeletonHtml = '';
    for (let i = 0; i < 6; i++) {
      skeletonHtml += `
        <tr class="skeleton-row">
          <td>
            <div style="display:flex;align-items:center;gap:12px">
              <div class="skeleton-box skeleton-avatar"></div>
              <div style="display:flex;flex-direction:column;gap:6px;flex:1">
                <div class="skeleton-box" style="width:120px"></div>
                <div class="skeleton-box" style="width:70px;height:10px"></div>
              </div>
            </div>
          </td>
          <td><div class="skeleton-box" style="width:65px"></div></td>
          <td><div class="skeleton-box" style="width:110px"></div></td>
          <td><div class="skeleton-box" style="width:85px"></div></td>
          <td><div class="skeleton-box" style="width:75px"></div></td>
          <td><div class="skeleton-box" style="width:100px"></div></td>
          <td><div class="skeleton-box" style="width:80px"></div></td>
          <td><div class="skeleton-box" style="width:90px"></div></td>
        </tr>
      `;
    }
    tableBody.innerHTML = skeletonHtml;

    setTimeout(() => {
      render();
    }, 450);
  }

  /* --------------------------------------------------
     Public API
  -------------------------------------------------- */
  return {
    init,
    render,
    setSort,
    viewPatient,
    openQuickView,
    messagePatient,
    resetFilters,
    simulateLoading
  };

})();
