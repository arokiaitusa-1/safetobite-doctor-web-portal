/* ============================================================
   Safe2Bite Doctor Web Portal — Alerts & Clinical Monitoring Module
   Pass 6 Implementation
   IMPORTANT:
   - No automated medical decision-making or AI diagnoses
   - Displays clinician-configured urgency and recorded patient submissions
   - Strict audit trail and safety confirmations
   ============================================================ */

const Alerts = (() => {

  let alertsData = [];
  let currentSearchQuery = '';
  let selectedType = 'all';
  let selectedStatus = 'all';
  let selectedSeverity = 'all';
  let selectedDate = 'all';
  let selectedAssigned = 'all';
  let activeAlertId = null;
  let pendingModalAction = null; // { type: 'resolve'|'dismiss', alertId: string }

  /* -----------------------------------------------
     Initialize Alerts Module
  ----------------------------------------------- */
  function init() {
    // Clone alerts from sample-data
    if (typeof Safe2BiteData !== 'undefined' && Array.isArray(Safe2BiteData.alerts)) {
      alertsData = JSON.parse(JSON.stringify(Safe2BiteData.alerts));
    }

    bindDOMEvents();
    renderSummaryCards();
    renderAlertsTable();
    updateRealtimeIndicator();
    syncGlobalAlertCounts();

    console.info('[Safe2Bite] Alerts & Clinical Monitoring module initialized — Pass 6');
  }

  /* -----------------------------------------------
     Event Binding
  ----------------------------------------------- */
  function bindDOMEvents() {
    // Search input
    const searchInput = document.getElementById('alerts-search');
    const searchClear = document.getElementById('alerts-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.trim().toLowerCase();
        if (searchClear) {
          searchClear.style.display = currentSearchQuery ? 'flex' : 'none';
        }
        renderAlertsTable();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          currentSearchQuery = '';
          searchClear.style.display = 'none';
          searchInput.focus();
          renderAlertsTable();
        }
      });
    }

    // Filters
    const typeFilter = document.getElementById('filter-alert-type');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        selectedType = e.target.value;
        renderAlertsTable();
      });
    }

    const statusFilter = document.getElementById('filter-alert-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        selectedStatus = e.target.value;
        renderAlertsTable();
      });
    }

    const severityFilter = document.getElementById('filter-alert-severity');
    if (severityFilter) {
      severityFilter.addEventListener('change', (e) => {
        selectedSeverity = e.target.value;
        renderAlertsTable();
      });
    }

    const dateFilter = document.getElementById('filter-alert-date');
    if (dateFilter) {
      dateFilter.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        renderAlertsTable();
      });
    }

    const assignedFilter = document.getElementById('filter-alert-assigned');
    if (assignedFilter) {
      assignedFilter.addEventListener('change', (e) => {
        selectedAssigned = e.target.value;
        renderAlertsTable();
      });
    }

    // Clear Filters Button
    const clearBtn = document.getElementById('btn-alerts-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', resetFilters);
    }

    // Refresh button
    const refreshBtn = document.getElementById('btn-alerts-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', refresh);
    }

    // Drawer Close Buttons & Overlay
    const drawerBackdrop = document.getElementById('alerts-drawer-backdrop');
    const drawerCloseBtn = document.getElementById('btn-alerts-drawer-close');
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeAlertDetail);
    }
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeAlertDetail);
    }

    // Escape Key to close drawer or modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (pendingModalAction) {
          closeConfirmModal();
        } else if (activeAlertId) {
          closeAlertDetail();
        }
      }
    });

    // Confirmation Modal buttons
    const confirmCancelBtn = document.getElementById('btn-alert-confirm-cancel');
    const confirmExecBtn = document.getElementById('btn-alert-confirm-execute');
    if (confirmCancelBtn) {
      confirmCancelBtn.addEventListener('click', closeConfirmModal);
    }
    if (confirmExecBtn) {
      confirmExecBtn.addEventListener('click', executeConfirmAction);
    }
  }

  /* -----------------------------------------------
     Summary Cards Rendering & Quick Filtering
  ----------------------------------------------- */
  function renderSummaryCards() {
    const totalActive = alertsData.filter(a => ['new', 'open', 'under-review'].includes(a.status)).length;
    const newCount = alertsData.filter(a => a.status === 'new').length;
    const reviewCount = alertsData.filter(a => a.status === 'under-review').length;
    const resolvedCount = alertsData.filter(a => a.status === 'resolved').length;

    const elTotal = document.getElementById('stat-alerts-total');
    const elNew = document.getElementById('stat-alerts-new');
    const elReview = document.getElementById('stat-alerts-review');
    const elResolved = document.getElementById('stat-alerts-resolved');

    if (elTotal) elTotal.textContent = totalActive;
    if (elNew) elNew.textContent = newCount;
    if (elReview) elReview.textContent = reviewCount;
    if (elResolved) elResolved.textContent = resolvedCount;

    // Card click filtering
    setupSummaryCardClick('card-stat-total', 'all');
    setupSummaryCardClick('card-stat-new', 'new');
    setupSummaryCardClick('card-stat-review', 'under-review');
    setupSummaryCardClick('card-stat-resolved', 'resolved');
  }

  function setupSummaryCardClick(cardId, statusValue) {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.onclick = () => {
      const statusFilter = document.getElementById('filter-alert-status');
      if (statusFilter) {
        statusFilter.value = statusValue;
        selectedStatus = statusValue;
        renderAlertsTable();
      }
    };
  }

  /* -----------------------------------------------
     Filter & Search Logic
  ----------------------------------------------- */
  function getFilteredAlerts() {
    return alertsData.filter(alert => {
      // Search query
      if (currentSearchQuery) {
        const matchName = (alert.patientName || '').toLowerCase().includes(currentSearchQuery);
        const matchId = (alert.patientId || '').toLowerCase().includes(currentSearchQuery);
        const matchAlertId = (alert.id || '').toLowerCase().includes(currentSearchQuery);
        const matchType = (alert.typeLabel || '').toLowerCase().includes(currentSearchQuery);
        const matchSummary = (alert.summary || '').toLowerCase().includes(currentSearchQuery);
        if (!matchName && !matchId && !matchAlertId && !matchType && !matchSummary) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all') {
        if (alert.type !== selectedType) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (alert.status !== selectedStatus) return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all') {
        if (alert.severity !== selectedSeverity) return false;
      }

      // Date filter
      if (selectedDate !== 'all') {
        if (selectedDate === 'today' && alert.dateGroup !== 'today') return false;
        if (selectedDate === '7days' && !['today', 'yesterday'].includes(alert.dateGroup)) return false;
      }

      // Assigned To filter
      if (selectedAssigned !== 'all') {
        if (selectedAssigned === 'Unassigned') {
          if (alert.assignedTo !== 'Unassigned') return false;
        } else {
          if (alert.assignedTo !== selectedAssigned) return false;
        }
      }

      return true;
    });
  }

  /* -----------------------------------------------
     Render Alerts Table & Active Chips
  ----------------------------------------------- */
  function renderAlertsTable() {
    const filtered = getFilteredAlerts();
    const tbody = document.getElementById('alerts-table-body');
    const mobileList = document.getElementById('alerts-mobile-list');
    const countBadge = document.getElementById('alerts-count-badge');
    const emptyState = document.getElementById('alerts-empty-state');
    const tableWrapper = document.getElementById('alerts-table-wrapper');

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Alert${filtered.length === 1 ? '' : 's'}`;
    }

    renderActiveFilterChips();

    // Check if empty
    if (filtered.length === 0) {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (mobileList) mobileList.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'flex';
        const emptyDesc = emptyState.querySelector('.alerts-empty-desc');
        if (emptyDesc) {
          const isFiltering = currentSearchQuery || selectedType !== 'all' || selectedStatus !== 'all' || selectedSeverity !== 'all' || selectedDate !== 'all' || selectedAssigned !== 'all';
          emptyDesc.textContent = isFiltering
            ? 'No alerts match your search query or selected filters. Try clearing your filters.'
            : 'All monitored patient events are currently reviewed. No active items require attention.';
        }
      }
      return;
    }

    if (tableWrapper) tableWrapper.style.display = 'block';
    if (mobileList) mobileList.style.display = '';
    if (emptyState) emptyState.style.display = 'none';

    // Render Table Rows (Desktop)
    if (tbody) {
      tbody.innerHTML = filtered.map(alert => renderTableRow(alert)).join('');
      // Bind Review Buttons
      tbody.querySelectorAll('.btn-alert-review').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openAlertDetail(btn.dataset.alertId);
        });
      });
      // Bind Patient Name Links
      tbody.querySelectorAll('.alert-patient-name').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          openPatientProfile(el.dataset.patientId);
        });
      });
      // Bind Row Click
      tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          openAlertDetail(row.dataset.alertId);
        });
      });
    }

    // Render Mobile Cards (<=768px)
    if (mobileList) {
      mobileList.innerHTML = filtered.map(alert => renderMobileCard(alert)).join('');
      mobileList.querySelectorAll('.btn-alert-review').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openAlertDetail(btn.dataset.alertId);
        });
      });
      mobileList.querySelectorAll('.alert-mobile-card').forEach(card => {
        card.addEventListener('click', () => {
          openAlertDetail(card.dataset.alertId);
        });
      });
    }
  }

  /* -----------------------------------------------
     Row & Card HTML Generators
  ----------------------------------------------- */
  function renderTableRow(alert) {
    const isCritical = alert.severity === 'critical';
    const rowClass = isCritical ? 'alerts-row-critical' : (alert.severity === 'high' ? 'alerts-row-high' : '');
    const sevBadgeClass = `badge-severity badge-severity-${alert.severity}`;
    const statusBadgeClass = `badge-status badge-status-${alert.status}`;

    const iconMap = {
      'reaction-report': 'reactions',
      'missed-dose': 'doses',
      'dose-not-taken': 'doses',
      'illness-report': 'illness',
      'assessment-review': 'assessments',
      'patient-message': 'messages',
      'treatment-change': 'treatment',
      'appointment-item': 'appointments'
    };
    const iconName = iconMap[alert.type] || 'alert-triangle';

    return `
      <tr class="${rowClass}" data-alert-id="${alert.id}" style="cursor:pointer">
        <td>
          <div class="alert-patient-cell">
            <div class="avatar avatar-md avatar-color-${alert.avatarColor}" aria-hidden="true">${alert.patientInitials}</div>
            <div class="alert-patient-info">
              <span class="alert-patient-name" data-patient-id="${alert.patientId}" title="View Patient Profile">
                ${alert.patientName}
                ${Icons.render('external-link', { size: 12, className: 'icon' })}
              </span>
              <span class="alert-patient-meta">${alert.patientId} &middot; Age ${alert.patientAge}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="alert-type-badge-cell">
            <span class="alert-type-icon">
              ${Icons.render(iconName, { size: 16, className: 'icon' })}
            </span>
            <span>${alert.typeLabel}</span>
          </div>
        </td>
        <td>
          <div class="alert-summary-cell" title="${alert.summary}">
            ${alert.summary}
          </div>
        </td>
        <td>
          <span class="${sevBadgeClass}">
            ${alert.severity === 'critical' ? Icons.render('alert-triangle', { size: 12, className: 'icon' }) : ''}
            ${alert.severityLabel}
          </span>
        </td>
        <td>
          <span class="alert-occurred-cell">${alert.occurredLabel}</span>
        </td>
        <td>
          <span class="${statusBadgeClass}">
            <span class="badge-dot-indicator" style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>
            ${alert.statusLabel}
          </span>
        </td>
        <td>
          <div class="alert-assigned-cell">
            ${Icons.render('user', { size: 13, className: 'icon' })}
            <span>${alert.assignedTo}</span>
          </div>
        </td>
        <td style="text-align:right">
          <button type="button" class="btn-alert-review" data-alert-id="${alert.id}" aria-label="Review Alert ${alert.id}">
            ${Icons.render('eye', { size: 13, className: 'icon' })}
            Review
          </button>
        </td>
      </tr>
    `;
  }

  function renderMobileCard(alert) {
    const isCritical = alert.severity === 'critical';
    return `
      <div class="alert-mobile-card ${isCritical ? 'is-critical' : ''}" data-alert-id="${alert.id}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div class="alert-patient-cell">
            <div class="avatar avatar-md avatar-color-${alert.avatarColor}" aria-hidden="true">${alert.patientInitials}</div>
            <div class="alert-patient-info">
              <span class="alert-patient-name" data-patient-id="${alert.patientId}">${alert.patientName}</span>
              <span class="alert-patient-meta">${alert.patientId} &middot; Age ${alert.patientAge}</span>
            </div>
          </div>
          <span class="badge-severity badge-severity-${alert.severity}">${alert.severityLabel}</span>
        </div>
        <div style="font-weight:var(--font-weight-semibold); font-size:var(--font-size-sm); color:var(--color-text-primary); margin-top:4px">
          ${alert.typeLabel}: ${alert.summary}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:var(--font-size-xs); color:var(--color-text-secondary)">
          <span>${alert.occurredLabel}</span>
          <span class="badge-status badge-status-${alert.status}">${alert.statusLabel}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:8px; border-top:1px solid var(--color-border-subtle)">
          <span style="font-size:var(--font-size-xs); color:var(--color-text-muted)">Assigned: ${alert.assignedTo}</span>
          <button type="button" class="btn-alert-review" data-alert-id="${alert.id}">Review</button>
        </div>
      </div>
    `;
  }

  /* -----------------------------------------------
     Active Filter Chips
  ----------------------------------------------- */
  function renderActiveFilterChips() {
    const container = document.getElementById('alerts-active-chips');
    if (!container) return;

    const chips = [];

    if (currentSearchQuery) {
      chips.push({ label: `Search: "${currentSearchQuery}"`, clearFn: () => {
        currentSearchQuery = '';
        const el = document.getElementById('alerts-search');
        if (el) el.value = '';
        renderAlertsTable();
      }});
    }

    if (selectedType !== 'all') {
      const typeSelect = document.getElementById('filter-alert-type');
      const text = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : selectedType;
      chips.push({ label: `Type: ${text}`, clearFn: () => {
        selectedType = 'all';
        if (typeSelect) typeSelect.value = 'all';
        renderAlertsTable();
      }});
    }

    if (selectedStatus !== 'all') {
      const statusSelect = document.getElementById('filter-alert-status');
      const text = statusSelect ? statusSelect.options[statusSelect.selectedIndex].text : selectedStatus;
      chips.push({ label: `Status: ${text}`, clearFn: () => {
        selectedStatus = 'all';
        if (statusSelect) statusSelect.value = 'all';
        renderAlertsTable();
      }});
    }

    if (selectedSeverity !== 'all') {
      const sevSelect = document.getElementById('filter-alert-severity');
      const text = sevSelect ? sevSelect.options[sevSelect.selectedIndex].text : selectedSeverity;
      chips.push({ label: `Severity: ${text}`, clearFn: () => {
        selectedSeverity = 'all';
        if (sevSelect) sevSelect.value = 'all';
        renderAlertsTable();
      }});
    }

    if (selectedDate !== 'all') {
      const dateSelect = document.getElementById('filter-alert-date');
      const text = dateSelect ? dateSelect.options[dateSelect.selectedIndex].text : selectedDate;
      chips.push({ label: `Date: ${text}`, clearFn: () => {
        selectedDate = 'all';
        if (dateSelect) dateSelect.value = 'all';
        renderAlertsTable();
      }});
    }

    if (selectedAssigned !== 'all') {
      chips.push({ label: `Assigned: ${selectedAssigned}`, clearFn: () => {
        selectedAssigned = 'all';
        const el = document.getElementById('filter-alert-assigned');
        if (el) el.value = 'all';
        renderAlertsTable();
      }});
    }

    if (chips.length === 0) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = `
      <span class="alerts-chip-label">Active Filters:</span>
      ${chips.map((chip, idx) => `
        <span class="alerts-chip">
          ${chip.label}
          <button type="button" class="alerts-chip-remove" data-chip-idx="${idx}" aria-label="Remove filter">&times;</button>
        </span>
      `).join('')}
    `;

    container.querySelectorAll('.alerts-chip-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.chipIdx, 10);
        if (chips[idx] && typeof chips[idx].clearFn === 'function') {
          chips[idx].clearFn();
        }
      });
    });
  }

  function resetFilters() {
    currentSearchQuery = '';
    selectedType = 'all';
    selectedStatus = 'all';
    selectedSeverity = 'all';
    selectedDate = 'all';
    selectedAssigned = 'all';

    const searchInput = document.getElementById('alerts-search');
    if (searchInput) searchInput.value = '';
    const searchClear = document.getElementById('alerts-search-clear');
    if (searchClear) searchClear.style.display = 'none';

    ['filter-alert-type', 'filter-alert-status', 'filter-alert-severity', 'filter-alert-date', 'filter-alert-assigned'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
    });

    renderAlertsTable();
  }

  /* -----------------------------------------------
     Alert Detail Side Drawer (Slide-Over)
  ----------------------------------------------- */
  function openAlertDetail(alertId) {
    const alert = alertsData.find(a => a.id === alertId);
    if (!alert) return;

    activeAlertId = alertId;

    // Populate Drawer Header
    const idEl = document.getElementById('drawer-alert-id');
    const titleEl = document.getElementById('drawer-alert-title');
    const badgesEl = document.getElementById('drawer-alert-badges');

    if (idEl) idEl.textContent = `${alert.id} · ${alert.occurredLabel}`;
    if (titleEl) titleEl.textContent = `${alert.typeLabel}: ${alert.summary}`;
    if (badgesEl) {
      badgesEl.innerHTML = `
        <span class="badge-severity badge-severity-${alert.severity}">
          ${alert.severity === 'critical' ? Icons.render('alert-triangle', { size: 12, className: 'icon' }) : ''}
          ${alert.severityLabel} Priority
        </span>
        <span class="badge-status badge-status-${alert.status}">
          <span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>
          ${alert.statusLabel}
        </span>
      `;
    }

    // Populate Patient Context
    const patientAvatar = document.getElementById('drawer-patient-avatar');
    const patientName = document.getElementById('drawer-patient-name');
    const patientId = document.getElementById('drawer-patient-id');
    const patientProtocol = document.getElementById('drawer-patient-protocol');
    const patientCaregiver = document.getElementById('drawer-patient-caregiver');
    const patientCareTeam = document.getElementById('drawer-patient-careteam');
    const patientProfileBtn = document.getElementById('drawer-btn-view-profile');

    if (patientAvatar) {
      patientAvatar.textContent = alert.patientInitials;
      patientAvatar.className = `avatar avatar-lg avatar-color-${alert.avatarColor}`;
    }
    if (patientName) patientName.textContent = alert.patientName;
    if (patientId) patientId.textContent = `${alert.patientId} · Age ${alert.patientAge}`;
    if (patientProtocol) patientProtocol.textContent = alert.treatmentProtocol;
    if (patientCaregiver) patientCaregiver.textContent = alert.caregiver;
    if (patientCareTeam) patientCareTeam.textContent = alert.careTeam;

    if (patientProfileBtn) {
      patientProfileBtn.onclick = () => {
        openPatientProfile(alert.patientId);
      };
    }

    const contactBtns = document.querySelectorAll('.drawer-contact-bar .btn-drawer-contact');
    if (contactBtns && contactBtns.length > 0) {
      contactBtns[0].onclick = () => {
        closeAlertDetail();
        if (typeof Messages !== 'undefined' && Messages.openConversationForPatient) {
          Messages.openConversationForPatient(alert.patientId);
        } else {
          Sidebar.navigateTo('messages');
        }
      };
      if (contactBtns[1]) {
        contactBtns[1].onclick = () => {
          closeAlertDetail();
          Sidebar.navigateTo('messages');
        };
      }
    }

    // Populate Event Details
    renderDrawerEventDetails(alert);

    // Populate Clinical Record Quick Link
    const recordLinkBar = document.getElementById('drawer-record-link-bar');
    if (recordLinkBar && alert.clinicalRecordLink) {
      recordLinkBar.innerHTML = `
        <span style="font-size:var(--font-size-xs); color:var(--color-primary-dark)">Associated Record:</span>
        <button type="button" class="btn-drawer-record-link" id="btn-drawer-open-record">
          ${Icons.render('clipboard', { size: 14, className: 'icon' })}
          ${alert.clinicalRecordLink.label} &rarr;
        </button>
      `;
      const openRecBtn = document.getElementById('btn-drawer-open-record');
      if (openRecBtn) {
        openRecBtn.onclick = () => {
          openPatientProfile(alert.patientId, alert.clinicalRecordLink.tab);
        };
      }
    }

    // Status Flow Buttons
    renderDrawerStatusControls(alert);

    // Assignment Control
    renderDrawerAssignmentControl(alert);

    // Review Notes Feed & Add Note Form
    renderDrawerNotesFeed(alert);

    // Audit Timeline Feed
    renderDrawerTimeline(alert);

    // Open Drawer & Backdrop
    const backdrop = document.getElementById('alerts-drawer-backdrop');
    const drawer = document.getElementById('alerts-drawer');
    if (backdrop) backdrop.classList.add('is-open');
    if (drawer) drawer.classList.add('is-open');

    // Accessibility focus
    const closeBtn = document.getElementById('btn-alerts-drawer-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeAlertDetail() {
    activeAlertId = null;
    const backdrop = document.getElementById('alerts-drawer-backdrop');
    const drawer = document.getElementById('alerts-drawer');
    if (backdrop) backdrop.classList.remove('is-open');
    if (drawer) drawer.classList.remove('is-open');
  }

  /* -----------------------------------------------
     Drawer Event Details Renderer
  ----------------------------------------------- */
  function renderDrawerEventDetails(alert) {
    const container = document.getElementById('drawer-event-details-card');
    if (!container) return;

    const details = alert.eventDetails || {};
    let html = '';

    // Configured Urgency Basis banner
    html += `
      <div style="background:#f8fafc; border:1px solid var(--color-border-subtle); border-radius:var(--radius-md); padding:8px 12px; font-size:var(--font-size-xs); color:var(--color-text-secondary)">
        <strong style="color:var(--color-text-primary)">Configured Urgency Classification:</strong> ${alert.severityReason}
      </div>
    `;

    // Symptoms (for reactions / illness)
    if (details.reportedSymptoms && details.reportedSymptoms.length > 0) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Reported Symptoms:</div>
          <div class="drawer-symptom-chips">
            ${details.reportedSymptoms.map(sym => `
              <span class="drawer-symptom-chip">
                ${Icons.render('alert-circle', { size: 12, className: 'icon' })}
                ${sym}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Patient Selected Severity
    if (details.patientSelectedSeverity) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Patient/Caregiver Selected Severity:</div>
          <div class="drawer-event-value"><strong>${details.patientSelectedSeverity}</strong></div>
        </div>
      `;
    }

    // Associated Dose
    if (details.associatedDose) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Associated Scheduled Dose:</div>
          <div class="drawer-event-value">${details.associatedDose}</div>
        </div>
      `;
    }

    // Scheduled Dose (for missed / not taken)
    if (details.scheduledDose) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Scheduled Dose:</div>
          <div class="drawer-event-value"><strong>${details.scheduledDose}</strong> (${details.scheduledTime || ''})</div>
        </div>
      `;
    }

    // Dose Status / Reason
    if (details.patientReason) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Caregiver-Reported Reason:</div>
          <div class="drawer-event-value">${details.patientReason}</div>
        </div>
      `;
    }

    // Illness Status & Hold
    if (details.illnessStatus) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Illness Protocol Status:</div>
          <div class="drawer-event-value"><strong style="color:#b91c1c">${details.illnessStatus}</strong></div>
        </div>
      `;
    }
    if (details.doseHeld) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Dose Action:</div>
          <div class="drawer-event-value">${details.doseHeld}</div>
        </div>
      `;
    }

    // Assessment Questions & Answers
    if (details.submittedResponses && details.submittedResponses.length > 0) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">${details.assessmentType || 'Submitted Assessment Responses'}:</div>
          <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px">
            ${details.submittedResponses.map(r => `
              <div style="background:#f8fafc; padding:6px 10px; border-radius:var(--radius-sm); font-size:var(--font-size-xs); display:flex; justify-content:space-between">
                <span style="color:var(--color-text-secondary)">${r.question}</span>
                <strong style="color:var(--color-text-primary)">${r.answer}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Patient Message Content
    if (details.messageContent) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Subject: ${details.messageSubject || 'General Inquiry'}</div>
          <div class="drawer-notes-box">${details.messageContent}</div>
        </div>
      `;
    }

    // Treatment Change Details
    if (details.milestoneType) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Protocol Milestone:</div>
          <div class="drawer-event-value"><strong>${details.milestoneType}</strong> &mdash; ${details.consecutiveDays}</div>
          <div style="font-size:var(--font-size-xs); color:var(--color-text-secondary); margin-top:2px">${details.nextScheduledEscalation}</div>
        </div>
      `;
    }

    // Patient / Caregiver Submitted Notes
    if (details.patientNotes) {
      html += `
        <div class="drawer-event-row">
          <div class="drawer-event-label">Patient / Caregiver Submitted Notes:</div>
          <div class="drawer-notes-box">${details.patientNotes}</div>
        </div>
      `;
    }

    // Emergency Pathway Info
    if (details.emergencyCarePlanStep) {
      html += `
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:var(--radius-md); padding:8px 12px; font-size:var(--font-size-xs); color:#991b1b">
          <strong>Safe2Bite Emergency Pathway Status:</strong> ${details.emergencyCarePlanStep}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  /* -----------------------------------------------
     Drawer Status Progression Controls
  ----------------------------------------------- */
  function renderDrawerStatusControls(alert) {
    const container = document.getElementById('drawer-status-controls');
    if (!container) return;

    const isResolved = alert.status === 'resolved';
    const isDismissed = alert.status === 'dismissed';

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px">
        <span style="font-size:var(--font-size-xs); font-weight:var(--font-weight-semibold); color:var(--color-text-secondary)">Workflow Status:</span>
        <div class="drawer-status-flow">
          <button type="button" class="btn-status-flow ${alert.status === 'new' ? 'active' : ''}" data-new-status="new">
            New
          </button>
          <button type="button" class="btn-status-flow ${alert.status === 'open' ? 'active' : ''}" data-new-status="open">
            Open
          </button>
          <button type="button" class="btn-status-flow ${alert.status === 'under-review' ? 'active' : ''}" data-new-status="under-review">
            Under Review
          </button>
          <button type="button" class="btn-status-flow btn-resolve-trigger ${isResolved ? 'active' : ''}" data-action="resolve">
            ${Icons.render('check', { size: 12, className: 'icon' })}
            ${isResolved ? 'Resolved' : 'Resolve Alert'}
          </button>
          <button type="button" class="btn-status-flow ${isDismissed ? 'active' : ''}" data-action="dismiss">
            Dismiss
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-status-flow').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const newStatus = btn.dataset.newStatus;

        if (action === 'resolve') {
          openConfirmModal('resolve', alert.id);
        } else if (action === 'dismiss') {
          openConfirmModal('dismiss', alert.id);
        } else if (newStatus && newStatus !== alert.status) {
          updateAlertStatus(alert.id, newStatus);
        }
      });
    });
  }

  /* -----------------------------------------------
     Drawer Assignment Control
  ----------------------------------------------- */
  function renderDrawerAssignmentControl(alert) {
    const container = document.getElementById('drawer-assignment-control');
    if (!container) return;

    const careTeam = (Safe2BiteData && Safe2BiteData.careTeamList) || [
      { name: "Dr. Sarah Chen" },
      { name: "Nurse Elena Rostova" },
      { name: "Dr. Michael Lee" },
      { name: "Unassigned" }
    ];

    container.innerHTML = `
      <div class="drawer-assignment-row">
        <label for="drawer-assign-select" style="font-size:var(--font-size-xs); font-weight:var(--font-weight-semibold); color:var(--color-text-secondary)">
          Assigned Clinician:
        </label>
        <select id="drawer-assign-select" class="drawer-assignment-select" aria-label="Assign alert to care team member">
          ${careTeam.map(member => `
            <option value="${member.name}" ${alert.assignedTo === member.name ? 'selected' : ''}>
              ${member.name}
            </option>
          `).join('')}
        </select>
      </div>
    `;

    const selectEl = document.getElementById('drawer-assign-select');
    if (selectEl) {
      selectEl.addEventListener('change', (e) => {
        reassignAlert(alert.id, e.target.value);
      });
    }
  }

  /* -----------------------------------------------
     Drawer Review Notes Feed & Add Note
  ----------------------------------------------- */
  function renderDrawerNotesFeed(alert) {
    const container = document.getElementById('drawer-notes-section');
    if (!container) return;

    const notes = alert.notes || [];

    container.innerHTML = `
      <div class="drawer-section-title">
        ${Icons.render('message-square', { size: 14, className: 'icon' })}
        Clinical Review Notes (${notes.length})
      </div>
      <div class="drawer-notes-feed">
        ${notes.length === 0 ? `
          <div style="font-size:var(--font-size-xs); color:var(--color-text-muted); font-style:italic; padding:6px 0">
            No clinical review notes recorded yet.
          </div>
        ` : notes.map(n => `
          <div class="drawer-note-item">
            <div class="drawer-note-header">
              <span class="drawer-note-author">${n.author} &middot; <span style="color:var(--color-text-muted)">${n.role}</span></span>
              <span class="drawer-note-time">${n.time}</span>
            </div>
            <div class="drawer-note-text">${n.text}</div>
          </div>
        `).join('')}
      </div>
      <div class="drawer-note-form">
        <textarea id="drawer-note-input" class="drawer-note-textarea" placeholder="Add a clinical or follow-up note (e.g. parent contacted, dose hold advised)..." aria-label="Add a clinical review note"></textarea>
        <button type="button" class="btn-drawer-save-note" id="btn-drawer-save-note">Save Note</button>
      </div>
    `;

    const saveBtn = document.getElementById('btn-drawer-save-note');
    const inputEl = document.getElementById('drawer-note-input');
    if (saveBtn && inputEl) {
      saveBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (text) {
          addReviewNote(alert.id, text);
          inputEl.value = '';
        }
      });
    }
  }

  /* -----------------------------------------------
     Drawer Audit Timeline
  ----------------------------------------------- */
  function renderDrawerTimeline(alert) {
    const container = document.getElementById('drawer-timeline-section');
    if (!container) return;

    const timeline = alert.timeline || [];

    container.innerHTML = `
      <div class="drawer-section-title">
        ${Icons.render('clock', { size: 14, className: 'icon' })}
        Audit Trail &amp; Event Timeline
      </div>
      <div class="drawer-timeline-list">
        ${timeline.map(item => `
          <div class="drawer-timeline-item">
            <div class="drawer-timeline-dot"></div>
            <div class="drawer-timeline-content">
              <span class="drawer-timeline-action">${item.action}</span>
              <span class="drawer-timeline-meta">${item.time} &middot; User: ${item.user}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* -----------------------------------------------
     Clinical Workflow Actions (Status, Note, Assign)
  ----------------------------------------------- */
  function addReviewNote(alertId, text) {
    const alert = alertsData.find(a => a.id === alertId);
    if (!alert) return;

    const currentUser = (typeof Auth !== 'undefined' && Auth.getSession())
      ? Auth.getSession()
      : Safe2BiteData.currentDoctor;

    const newNote = {
      id: `NOTE-${Date.now()}`,
      author: currentUser.displayName || 'Dr. Sarah Chen',
      role: currentUser.role || 'Attending Allergist',
      time: 'Just now',
      text: text
    };

    if (!alert.notes) alert.notes = [];
    alert.notes.unshift(newNote);

    // Log to audit timeline
    if (!alert.timeline) alert.timeline = [];
    alert.timeline.unshift({
      time: 'Just now',
      user: currentUser.displayName || 'Dr. Sarah Chen',
      action: 'Clinical review note added'
    });

    // If alert was 'new', advance to 'under-review' automatically on note addition
    if (alert.status === 'new') {
      alert.status = 'under-review';
      alert.statusLabel = 'Under Review';
    }

    renderDrawerNotesFeed(alert);
    renderDrawerTimeline(alert);
    renderDrawerStatusControls(alert);
    renderSummaryCards();
    renderAlertsTable();
    syncGlobalAlertCounts();
  }

  function updateAlertStatus(alertId, newStatus) {
    const alert = alertsData.find(a => a.id === alertId);
    if (!alert) return;

    const statusLabels = {
      'new': 'New',
      'open': 'Open',
      'under-review': 'Under Review',
      'resolved': 'Resolved',
      'dismissed': 'Dismissed'
    };

    const oldStatusLabel = alert.statusLabel;
    alert.status = newStatus;
    alert.statusLabel = statusLabels[newStatus] || newStatus;

    const currentUser = (typeof Auth !== 'undefined' && Auth.getSession())
      ? Auth.getSession()
      : Safe2BiteData.currentDoctor;

    if (!alert.timeline) alert.timeline = [];
    alert.timeline.unshift({
      time: 'Just now',
      user: currentUser.displayName || 'Dr. Sarah Chen',
      action: `Status changed from ${oldStatusLabel} to ${alert.statusLabel}`
    });

    openAlertDetail(alertId);
    renderSummaryCards();
    renderAlertsTable();
    syncGlobalAlertCounts();
  }

  function reassignAlert(alertId, newAssignee) {
    const alert = alertsData.find(a => a.id === alertId);
    if (!alert) return;

    const oldAssignee = alert.assignedTo;
    alert.assignedTo = newAssignee;

    const currentUser = (typeof Auth !== 'undefined' && Auth.getSession())
      ? Auth.getSession()
      : Safe2BiteData.currentDoctor;

    if (!alert.timeline) alert.timeline = [];
    alert.timeline.unshift({
      time: 'Just now',
      user: currentUser.displayName || 'Dr. Sarah Chen',
      action: `Reassigned from ${oldAssignee} to ${newAssignee}`
    });

    renderDrawerTimeline(alert);
    renderAlertsTable();
  }

  /* -----------------------------------------------
     Safety Confirmation Dialog (Resolve / Dismiss)
  ----------------------------------------------- */
  function openConfirmModal(actionType, alertId) {
    pendingModalAction = { type: actionType, alertId: alertId };
    const backdrop = document.getElementById('alert-confirm-backdrop');
    const titleEl = document.getElementById('alert-confirm-title');
    const descEl = document.getElementById('alert-confirm-desc');
    const iconEl = document.getElementById('alert-confirm-icon');
    const execBtn = document.getElementById('btn-alert-confirm-execute');

    if (!backdrop) return;

    if (actionType === 'resolve') {
      if (titleEl) titleEl.textContent = 'Resolve Clinical Alert?';
      if (descEl) descEl.textContent = 'This will mark the event as clinically reviewed and completed. The patient record and audit trail will record this action.';
      if (iconEl) {
        iconEl.className = 'alert-confirm-icon icon-resolve';
        iconEl.innerHTML = Icons.render('check-circle', { size: 24, className: 'icon' });
      }
      if (execBtn) {
        execBtn.textContent = 'Resolve Alert';
        execBtn.className = 'btn-confirm-execute btn-resolve';
      }
    } else {
      if (titleEl) titleEl.textContent = 'Dismiss Alert?';
      if (descEl) descEl.textContent = 'Dismissing indicates this alert does not require further clinical intervention. Note: Dismissed does not mean medically resolved.';
      if (iconEl) {
        iconEl.className = 'alert-confirm-icon icon-dismiss';
        iconEl.innerHTML = Icons.render('x', { size: 24, className: 'icon' });
      }
      if (execBtn) {
        execBtn.textContent = 'Dismiss Alert';
        execBtn.className = 'btn-confirm-execute';
      }
    }

    backdrop.classList.add('is-open');
    if (execBtn) execBtn.focus();
  }

  function closeConfirmModal() {
    pendingModalAction = null;
    const backdrop = document.getElementById('alert-confirm-backdrop');
    if (backdrop) backdrop.classList.remove('is-open');
  }

  function executeConfirmAction() {
    if (!pendingModalAction) return;
    const { type, alertId } = pendingModalAction;
    closeConfirmModal();

    if (type === 'resolve') {
      updateAlertStatus(alertId, 'resolved');
    } else if (type === 'dismiss') {
      updateAlertStatus(alertId, 'dismissed');
    }
  }

  /* -----------------------------------------------
     Navigation Link to Patient Clinical Overview
  ----------------------------------------------- */
  function openPatientProfile(patientId, targetTab) {
    closeAlertDetail();
    if (typeof PatientOverview !== 'undefined') {
      PatientOverview.loadPatient(patientId, true);
      if (targetTab) {
        setTimeout(() => {
          if (typeof PatientOverview.switchTab === 'function') {
            PatientOverview.switchTab(targetTab);
          }
        }, 100);
      }
    } else if (typeof Sidebar !== 'undefined') {
      Sidebar.navigateTo('patients');
    }
  }

  /* -----------------------------------------------
     Near-Realtime Monitoring Simulation & Refresh
  ----------------------------------------------- */
  function refresh() {
    const btn = document.getElementById('btn-alerts-refresh');
    if (btn) btn.classList.add('is-refreshing');

    setTimeout(() => {
      if (btn) btn.classList.remove('is-refreshing');
      updateRealtimeIndicator();
      renderAlertsTable();
      renderSummaryCards();
      syncGlobalAlertCounts();
    }, 450);
  }

  function updateRealtimeIndicator() {
    const el = document.getElementById('alerts-last-updated-text');
    if (el) {
      el.textContent = 'Updated just now';
    }
  }

  /* -----------------------------------------------
     Synchronize Alert Counts Across Portal
  ----------------------------------------------- */
  function syncGlobalAlertCounts() {
    const activeCount = alertsData.filter(a => ['new', 'open', 'under-review'].includes(a.status)).length;

    // Sidebar badge
    const sidebarBadge = document.querySelector('#nav-alerts .nav-badge');
    if (sidebarBadge) {
      sidebarBadge.textContent = activeCount;
      sidebarBadge.setAttribute('aria-label', `${activeCount} open alerts`);
    }
    const navAlertsLink = document.getElementById('nav-alerts');
    if (navAlertsLink) {
      navAlertsLink.setAttribute('aria-label', `Alerts — ${activeCount} open`);
    }

    // Dashboard quick stats & summary cards if present
    const dashAlertsStat = document.getElementById('welcome-stat-alerts');
    if (dashAlertsStat) dashAlertsStat.textContent = activeCount;

    const dashStatOpen = document.getElementById('stat-open-alerts');
    if (dashStatOpen) dashStatOpen.textContent = activeCount;
  }

  /* -----------------------------------------------
     Public API
  ----------------------------------------------- */
  return {
    init,
    openAlertDetail,
    closeAlertDetail,
    updateAlertStatus,
    addReviewNote,
    reassignAlert,
    refresh,
    resetFilters,
    openPatientProfile
  };

})();
