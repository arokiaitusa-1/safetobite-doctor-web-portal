/* ============================================================
   Safe2Bite Doctor Web Portal — Pass 4: Patient Clinical Overview Controller
   ============================================================ */

const PatientOverview = (() => {

  // Module State
  let currentPatientId = null;
  let currentData = null;
  let activeTab = 'overview';

  /* --------------------------------------------------
     Initialize Module
  -------------------------------------------------- */
  function init() {
    bindGlobalEvents();
    // Pre-load default reference patient without switching active page away from dashboard
    if (!currentPatientId) {
      loadPatient('SB-00124', false);
    }
    console.info('[Safe2Bite] Patient Clinical Overview Module initialized');
  }

  /* --------------------------------------------------
     Bind Global Events
  -------------------------------------------------- */
  function bindGlobalEvents() {
    // Back to patients list
    const backBtn = document.getElementById('profile-back-to-patients');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        Sidebar.navigateTo('patients');
      });
    }

    // Secondary profile tabs
    const tabBtns = document.querySelectorAll('.overview-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      });
    });

    // More dropdown toggle
    const moreBtn = document.getElementById('btn-patient-more');
    const moreDropdown = document.getElementById('patient-more-dropdown');
    if (moreBtn && moreDropdown) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = moreDropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          moreDropdown.classList.add('open');
          moreBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      closeAllDropdowns();
    });

    // Message action button
    const msgBtn = document.getElementById('profile-btn-message');
    if (msgBtn) {
      msgBtn.addEventListener('click', () => {
        if (currentPatientId && typeof Messages !== 'undefined' && Messages.openConversationForPatient) {
          Messages.openConversationForPatient(currentPatientId);
        } else {
          Sidebar.navigateTo('messages');
        }
      });
    }

    // Header More Dropdown Action Items
    const itemTimeline = document.getElementById('menu-item-timeline');
    if (itemTimeline) {
      itemTimeline.addEventListener('click', () => {
        closeAllDropdowns();
        switchTab('timeline');
      });
    }

    const itemInfo = document.getElementById('menu-item-info');
    if (itemInfo) {
      itemInfo.addEventListener('click', () => {
        closeAllDropdowns();
        openModal('patient-info-modal');
      });
    }

    const itemPerms = document.getElementById('menu-item-perms');
    if (itemPerms) {
      itemPerms.addEventListener('click', () => {
        closeAllDropdowns();
        openModal('patient-perms-modal');
      });
    }

    const itemExport = document.getElementById('menu-item-export');
    if (itemExport) {
      itemExport.addEventListener('click', () => {
        closeAllDropdowns();
        alert(`[Safe2Bite Prototype] Clinical Summary for ${currentData ? currentData.name : 'Patient'} exported to PDF audit record.`);
      });
    }

    // Modal close buttons
    document.querySelectorAll('.overview-modal-close, .btn-modal-dismiss').forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.overview-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeAllModals();
      });
    });

    // ESC key closes modals & dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        closeAllModals();
      }
    });
  }

  function closeAllDropdowns() {
    const moreDropdown = document.getElementById('patient-more-dropdown');
    const moreBtn = document.getElementById('btn-patient-more');
    if (moreDropdown) moreDropdown.classList.remove('open');
    if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
  }

  function openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.overview-modal-backdrop').forEach(m => {
      m.classList.remove('open');
    });
  }

  /* --------------------------------------------------
     Load Patient Clinical Overview
  -------------------------------------------------- */
  function loadPatient(patientId, shouldNavigate = true) {
    const data = Safe2BiteData.getPatientClinicalOverview(patientId);

    if (!data) {
      console.error(`[PatientOverview] Patient not found: ${patientId}`);
      showErrorState("Patient record not found in clinical database.");
      return;
    }

    if (!data.authorized) {
      console.warn(`[PatientOverview] Unauthorized access attempt: ${patientId}`);
      showUnauthorizedState();
      return;
    }

    currentPatientId = patientId;
    currentData = data;

    // Reset active tab to 'overview'
    switchTab('overview');

    // Populate Persistent Header
    renderHeader(data);

    // Populate Attention Banner
    renderAttentionBanner(data);

    // Populate Today's Clinical Status (5 Cards)
    renderTodayStatus(data);

    // Populate Summary Cards Grid
    renderSummaryCards(data);

    // Populate Sub-tab views
    renderSubTabs(data);

    // Populate Modal Content
    populateModals(data);

    // Navigate to profile view in shell if requested
    if (shouldNavigate) {
      Sidebar.navigateTo('patient-profile');

      // Scroll container to top
      const pageContent = document.getElementById('page-content');
      if (pageContent) pageContent.scrollTop = 0;
    }
  }

  /* --------------------------------------------------
     Switch Profile Sub-Tab
  -------------------------------------------------- */
  function switchTab(tabName) {
    activeTab = tabName;

    // Update Tab Buttons
    const tabBtns = document.querySelectorAll('.overview-tab-btn');
    tabBtns.forEach(btn => {
      const isTarget = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Update Tab Panes
    const panes = document.querySelectorAll('.overview-tab-pane');
    panes.forEach(pane => {
      const isTarget = pane.id === `tab-pane-${tabName}`;
      pane.classList.toggle('active', isTarget);
    });

    // Pass 5: If switching to Treatment tab, render comprehensive Treatment management inside tab-pane-treatment
    if (tabName === 'treatment' && typeof Treatment !== 'undefined') {
      Treatment.openPatientTreatment(currentPatientId, 'tab-pane-treatment');
    }
  }

  /* --------------------------------------------------
     Render Persistent Identity Header
  -------------------------------------------------- */
  function renderHeader(data) {
    // Avatar
    const avatarEl = document.getElementById('overview-patient-avatar');
    if (avatarEl) {
      avatarEl.textContent = data.initials;
      avatarEl.className = `patient-identity-avatar avatar-color-${data.avatarColor}`;
    }

    // Name & ID
    const nameEl = document.getElementById('overview-patient-name');
    if (nameEl) nameEl.textContent = data.name;

    const idEl = document.getElementById('overview-patient-id');
    if (idEl) idEl.textContent = data.id;

    // Treatment Status Badge
    const treatBadgeEl = document.getElementById('overview-treatment-badge');
    if (treatBadgeEl) {
      treatBadgeEl.className = `s2b-badge ${data.treatment.statusClass}`;
      treatBadgeEl.innerHTML = `
        ${Icons.render(data.treatment.status === 'active' ? 'check' : (data.treatment.status === 'paused' ? 'pause-circle' : 'alert-triangle'), { size: 11, className: 'icon' })}
        ${data.treatment.statusLabel}
      `;
    }

    // Meta row
    const ageEl = document.getElementById('overview-patient-age');
    if (ageEl) ageEl.textContent = `Age ${data.age}`;

    const dobEl = document.getElementById('overview-patient-dob');
    if (dobEl) dobEl.textContent = `DOB: ${data.dob}`;

    const protocolEl = document.getElementById('overview-patient-protocol');
    if (protocolEl) protocolEl.textContent = `${data.treatment.protocol} — ${data.treatment.phase}`;

    const docEl = document.getElementById('overview-patient-doctor');
    if (docEl) docEl.textContent = data.assignedDoctor.name;

    const caregiverEl = document.getElementById('overview-patient-caregiver');
    if (caregiverEl) {
      caregiverEl.textContent = `Caregiver: ${data.caregiver.name} (${data.caregiver.relationship.split('/')[0].trim()})`;
    }
  }

  /* --------------------------------------------------
     Render Attention Banner
  -------------------------------------------------- */
  function renderAttentionBanner(data) {
    const banner = document.getElementById('overview-attention-banner');
    if (!banner) return;

    // Pass 6: Check for active alert in Safe2BiteData.alerts for this patient
    let activeAlert = null;
    if (typeof Safe2BiteData !== 'undefined' && Array.isArray(Safe2BiteData.alerts)) {
      activeAlert = Safe2BiteData.alerts.find(a => a.patientId === currentPatientId && ['new', 'open', 'under-review'].includes(a.status));
    }

    if (activeAlert) {
      banner.className = 'overview-attention-banner';
      banner.innerHTML = `
        <div class="attention-banner-left">
          <div class="attention-icon-wrap" aria-hidden="true">
            ${Icons.render('alert-triangle', { size: 22, className: 'icon' })}
          </div>
          <div class="attention-content">
            <div class="attention-badge-row">
              <span class="badge-severity badge-severity-${activeAlert.severity}">${activeAlert.severityLabel.toUpperCase()} PRIORITY</span>
              <span class="badge-status badge-status-${activeAlert.status}">${activeAlert.statusLabel}</span>
              <span class="mini-timeline-time">${activeAlert.occurredLabel}</span>
            </div>
            <h2 class="attention-title">${activeAlert.typeLabel}: ${activeAlert.summary}</h2>
            <p class="attention-detail">${activeAlert.eventDetails && activeAlert.eventDetails.patientNotes ? activeAlert.eventDetails.patientNotes : activeAlert.summary}</p>
          </div>
        </div>
        <div class="attention-banner-right" style="display:flex; gap:8px; align-items:center">
          <button type="button" class="btn-attention-action" id="btn-patient-review-alert" style="background:var(--color-primary); color:#ffffff; border-color:transparent">
            ${Icons.render('eye', { size: 14, className: 'icon' })}
            Review Alert
          </button>
        </div>
      `;

      const reviewBtn = banner.querySelector('#btn-patient-review-alert');
      if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
          if (typeof Alerts !== 'undefined') {
            Alerts.openAlertDetail(activeAlert.id);
          }
        });
      }
    } else if (data.alerts && data.alerts.length > 0) {
      const alert = data.alerts[0];
      banner.className = 'overview-attention-banner';
      banner.innerHTML = `
        <div class="attention-banner-left">
          <div class="attention-icon-wrap" aria-hidden="true">
            ${Icons.render('alert-triangle', { size: 22, className: 'icon' })}
          </div>
          <div class="attention-content">
            <div class="attention-badge-row">
              <span class="s2b-badge badge-alert-attention">ATTENTION REQUIRED</span>
              <span class="mini-timeline-time">${alert.time}</span>
            </div>
            <h2 class="attention-title">${alert.title}</h2>
            <p class="attention-detail">${alert.detail}</p>
          </div>
        </div>
        <div class="attention-banner-right">
          <button type="button" class="btn-attention-action" id="btn-resolve-alert" data-target-tab="${alert.actionType}">
            ${Icons.render('eye', { size: 14, className: 'icon' })}
            ${alert.actionText}
          </button>
        </div>
      `;

      const actionBtn = banner.querySelector('#btn-resolve-alert');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          const targetTab = actionBtn.dataset.targetTab;
          if (targetTab) switchTab(targetTab);
        });
      }
    } else {
      // Clean state: "No current alerts"
      banner.className = 'overview-attention-banner is-clean';
      banner.innerHTML = `
        <div class="attention-banner-left">
          <div class="attention-icon-wrap" aria-hidden="true">
            ${Icons.render('shield-check', { size: 22, className: 'icon' })}
          </div>
          <div class="attention-content">
            <div class="attention-badge-row">
              <span class="s2b-badge badge-alert-none">NO CURRENT ALERTS</span>
            </div>
            <h2 class="attention-title">No Active Attention Items</h2>
            <p class="attention-detail">All scheduled assessments and doses are within normal protocol limits. No adverse reactions recorded.</p>
          </div>
        </div>
        <div class="attention-banner-right">
          <span class="s2b-badge badge-alert-none" style="padding:4px 10px">Clinical Status Normal</span>
        </div>
      `;
    }
  }

  /* --------------------------------------------------
     Render Today's Clinical Status (5 Cards)
  -------------------------------------------------- */
  function renderTodayStatus(data) {
    const grid = document.getElementById('today-status-grid');
    if (!grid) return;

    const ts = data.todayStatus;

    grid.innerHTML = `
      <!-- 1. Health Assessment -->
      <div class="today-status-card" role="region" aria-label="Health Assessment Status">
        <div class="today-card-top">
          <span class="today-card-label">Health Assessment</span>
          <span class="s2b-badge ${ts.assessment.class}">
            ${Icons.render(ts.assessment.icon, { size: 11, className: 'icon' })}
            ${ts.assessment.label}
          </span>
        </div>
        <div class="today-card-value">${ts.assessment.wellness}</div>
        <div class="today-card-sub">${ts.assessment.time}</div>
      </div>

      <!-- 2. Today's Dose -->
      <div class="today-status-card" role="region" aria-label="Today's Dose Status">
        <div class="today-card-top">
          <span class="today-card-label">Today's Dose</span>
          <span class="s2b-badge ${ts.dose.class}">
            ${Icons.render(ts.dose.icon, { size: 11, className: 'icon' })}
            ${ts.dose.label}
          </span>
        </div>
        <div class="today-card-value">${ts.dose.doseValue}</div>
        <div class="today-card-sub">${ts.dose.recordedTime !== '—' ? `Recorded: ${ts.dose.recordedTime}` : `Scheduled: ${ts.dose.scheduledTime}`}</div>
      </div>

      <!-- 3. Reaction -->
      <div class="today-status-card" role="region" aria-label="Reaction Status">
        <div class="today-card-top">
          <span class="today-card-label">Reaction</span>
          <span class="s2b-badge ${ts.reaction.class}">
            ${Icons.render(ts.reaction.icon, { size: 11, className: 'icon' })}
            ${ts.reaction.label}
          </span>
        </div>
        <div class="today-card-value">${ts.reaction.hasReaction ? 'Symptoms Logged' : 'None Reported'}</div>
        <div class="today-card-sub">${ts.reaction.hasReaction ? ts.reaction.time : 'Past 30 days clear'}</div>
      </div>

      <!-- 4. Illness -->
      <div class="today-status-card" role="region" aria-label="Illness Status">
        <div class="today-card-top">
          <span class="today-card-label">Illness</span>
          <span class="s2b-badge ${ts.illness.class}">
            ${Icons.render(ts.illness.icon, { size: 11, className: 'icon' })}
            ${ts.illness.label}
          </span>
        </div>
        <div class="today-card-value">${ts.illness.hasIllness ? 'Illness Active' : 'None Reported'}</div>
        <div class="today-card-sub">${ts.illness.hasIllness ? (ts.illness.doseHold ? 'Dose hold active' : 'Monitoring') : 'Afebrile & healthy'}</div>
      </div>

      <!-- 5. Food Intake -->
      <div class="today-status-card" role="region" aria-label="Food Intake Status">
        <div class="today-card-top">
          <span class="today-card-label">Food Intake</span>
          <span class="s2b-badge ${ts.foodIntake.class}">
            ${Icons.render(ts.foodIntake.icon, { size: 11, className: 'icon' })}
            ${ts.foodIntake.label}
          </span>
        </div>
        <div class="today-card-value">${ts.foodIntake.meal}</div>
        <div class="today-card-sub">${ts.foodIntake.time}</div>
      </div>
    `;
  }

  /* --------------------------------------------------
     Render Clinical Summary Cards
  -------------------------------------------------- */
  function renderSummaryCards(data) {
    const t = data.treatment;
    const ts = data.todayStatus;

    // 1. Current Treatment Summary
    const treatCard = document.getElementById('card-treatment-summary');
    if (treatCard) {
      treatCard.innerHTML = `
        <div class="overview-card-header">
          <div class="card-title-group">
            <div class="card-title-icon">${Icons.render('treatment', { size: 16, className: 'icon' })}</div>
            <h3 class="card-title">Current Treatment Summary</h3>
          </div>
          <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('treatment')">
            View Treatment Plan &rarr;
          </button>
        </div>
        <div class="overview-card-body">
          <div class="treatment-metrics-grid">
            <div class="metric-box">
              <span class="metric-label">Treatment Status</span>
              <div class="metric-value" style="display:flex;align-items:center;gap:6px">
                <span class="s2b-badge ${t.statusClass}">
                  ${Icons.render('check-circle', { size: 11, className: 'icon' })}
                  ${t.statusLabel}
                </span>
              </div>
              <span class="metric-sub">Protocol: ${t.protocol}</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Treatment Phase</span>
              <span class="metric-value" style="font-size:15px;color:var(--color-primary)">${t.phase}</span>
              <span class="metric-sub">Adherence: ${t.adherenceRate}</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Current Dose</span>
              <span class="metric-value">${t.currentDose}</span>
              <span class="metric-sub">Clinician configured</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Target Maintenance</span>
              <span class="metric-value">${t.targetDose}</span>
              <span class="metric-sub">Goal protocol dose</span>
            </div>
          </div>
          <div class="treatment-safety-disclaimer">
            ${Icons.render('shield-check', { size: 14, className: 'icon' })}
            <span>Healthcare Safety Notice: Dosage parameters and schedules are clinician-controlled. The system does not recommend or calculate dosages.</span>
          </div>
        </div>
        <div class="overview-card-footer">
          <span>Next Scheduled: <strong>${t.nextDoseTime}</strong></span>
          <span>Updated: ${t.lastUpdated}</span>
        </div>
      `;
    }

    // 2. Today's Dose Card
    const doseCard = document.getElementById('card-dose-summary');
    if (doseCard) {
      doseCard.innerHTML = `
        <div class="overview-card-header">
          <div class="card-title-group">
            <div class="card-title-icon">${Icons.render('doses', { size: 16, className: 'icon' })}</div>
            <h3 class="card-title">Today's Dose Details</h3>
          </div>
          <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('doses')">
            Dose History &rarr;
          </button>
        </div>
        <div class="overview-card-body">
          <div class="dose-detail-row">
            <div class="dose-field">
              <span class="dose-field-label">Scheduled Time</span>
              <span class="dose-field-val">${ts.dose.scheduledTime}</span>
            </div>
            <div class="dose-field">
              <span class="dose-field-label">Status</span>
              <span class="s2b-badge ${ts.dose.class}" style="width:fit-content">
                ${Icons.render(ts.dose.icon, { size: 11, className: 'icon' })}
                ${ts.dose.label}
              </span>
            </div>
            <div class="dose-field">
              <span class="dose-field-label">Recorded Time</span>
              <span class="dose-field-val">${ts.dose.recordedTime}</span>
            </div>
            <div class="dose-field">
              <span class="dose-field-label">Administered Dose</span>
              <span class="dose-field-val" style="color:var(--color-primary)">${ts.dose.doseValue}</span>
            </div>
          </div>
          <div style="font-size:var(--font-size-xs); color:var(--color-text-secondary); display:flex; align-items:center; gap:6px;">
            ${Icons.render('user-check', { size: 13, className: 'icon' })}
            <span>Verification: ${ts.dose.verifiedBy}</span>
          </div>
        </div>
      `;
    }

    // 3. Health Assessment Summary
    const assessCard = document.getElementById('card-assessment-summary');
    if (assessCard) {
      assessCard.innerHTML = `
        <div class="overview-card-header">
          <div class="card-title-group">
            <div class="card-title-icon">${Icons.render('assessments', { size: 16, className: 'icon' })}</div>
            <h3 class="card-title">Health Assessment</h3>
          </div>
          <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('assessments')">
            View Assessment &rarr;
          </button>
        </div>
        <div class="overview-card-body">
          <div class="assessment-detail-box">
            <div class="assessment-meta-row">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="wellness-badge-pill">
                  ${Icons.render('check-circle', { size: 12, className: 'icon' })}
                  Wellness: ${ts.assessment.wellness}
                </span>
                <span class="s2b-badge ${ts.assessment.class}">${ts.assessment.label}</span>
              </div>
              <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">${ts.assessment.time}</span>
            </div>
            <div class="clinical-field-group">
              <div class="clinical-field">
                <span class="clinical-field-title">Symptoms Reported</span>
                <span class="clinical-field-text">${ts.assessment.symptoms}</span>
              </div>
              <div class="clinical-field">
                <span class="clinical-field-title">Reported Severity</span>
                <span class="clinical-field-text">${ts.assessment.severity}</span>
              </div>
            </div>
            <blockquote class="assessment-notes-quote">
              "${ts.assessment.notes}"
            </blockquote>
          </div>
        </div>
      `;
    }

    // 4. Recent Reactions Summary
    const reactCard = document.getElementById('card-reaction-summary');
    if (reactCard) {
      if (ts.reaction.hasReaction) {
        reactCard.innerHTML = `
          <div class="overview-card-header">
            <div class="card-title-group">
              <div class="card-title-icon" style="background:#FEE2E2;color:var(--color-status-red)">
                ${Icons.render('alert-triangle', { size: 16, className: 'icon' })}
              </div>
              <h3 class="card-title">Recent Reaction Report</h3>
            </div>
            <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('reactions')">
              Reaction Details &rarr;
            </button>
          </div>
          <div class="overview-card-body">
            <div class="clinical-item-card">
              <div class="clinical-item-header">
                <span class="s2b-badge badge-alert-attention">
                  ${Icons.render('alert-triangle', { size: 11, className: 'icon' })}
                  ${ts.reaction.reviewStatus}
                </span>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">${ts.reaction.time}</span>
              </div>
              <div class="clinical-field-group">
                <div class="clinical-field">
                  <span class="clinical-field-title">Reported Symptoms</span>
                  <span class="clinical-field-text" style="font-weight:var(--font-weight-semibold);color:#991B1B">${ts.reaction.symptoms}</span>
                </div>
                <div class="clinical-field">
                  <span class="clinical-field-title">Recorded Severity</span>
                  <span class="clinical-field-text">${ts.reaction.severity}</span>
                </div>
              </div>
              <div class="clinical-field">
                <span class="clinical-field-title">Emergency Action Taken</span>
                <span class="clinical-field-text">${ts.reaction.actionTaken}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        reactCard.innerHTML = `
          <div class="overview-card-header">
            <div class="card-title-group">
              <div class="card-title-icon">${Icons.render('reactions', { size: 16, className: 'icon' })}</div>
              <h3 class="card-title">Recent Reactions</h3>
            </div>
            <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('reactions')">
              View Log &rarr;
            </button>
          </div>
          <div class="overview-card-body" style="padding:var(--space-6); text-align:center; align-items:center;">
            <div class="attention-icon-wrap" style="background:#F0FDF4;color:var(--color-status-green);border-color:#BBF7D0;margin-bottom:8px">
              ${Icons.render('shield-check', { size: 20, className: 'icon' })}
            </div>
            <div style="font-weight:var(--font-weight-semibold);font-size:var(--font-size-sm);color:var(--color-text-primary)">No reactions reported</div>
            <div style="font-size:var(--font-size-xs);color:var(--color-text-muted)">No acute or adverse events reported in the last 30 days.</div>
          </div>
        `;
      }
    }

    // 5. Recent Illness Summary
    const illnessCard = document.getElementById('card-illness-summary');
    if (illnessCard) {
      if (ts.illness.hasIllness) {
        illnessCard.innerHTML = `
          <div class="overview-card-header">
            <div class="card-title-group">
              <div class="card-title-icon" style="background:#FEF3C7;color:#B45309">
                ${Icons.render('thermometer', { size: 16, className: 'icon' })}
              </div>
              <h3 class="card-title">Recent Illness Report</h3>
            </div>
            <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('illness')">
              View Illness &rarr;
            </button>
          </div>
          <div class="overview-card-body">
            <div class="clinical-item-card">
              <div class="clinical-item-header">
                <span class="s2b-badge badge-treat-paused">
                  ${Icons.render('pause-circle', { size: 11, className: 'icon' })}
                  Dose Hold Active
                </span>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">${ts.illness.date}</span>
              </div>
              <div class="clinical-field">
                <span class="clinical-field-title">Reported Symptoms</span>
                <span class="clinical-field-text">${ts.illness.symptoms}</span>
              </div>
              <div class="clinical-field">
                <span class="clinical-field-title">Clinical Notes</span>
                <span class="clinical-field-text">${ts.illness.notes}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        illnessCard.innerHTML = `
          <div class="overview-card-header">
            <div class="card-title-group">
              <div class="card-title-icon">${Icons.render('illness', { size: 16, className: 'icon' })}</div>
              <h3 class="card-title">Recent Illness</h3>
            </div>
            <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('illness')">
              View Log &rarr;
            </button>
          </div>
          <div class="overview-card-body" style="padding:var(--space-6); text-align:center; align-items:center;">
            <div class="attention-icon-wrap" style="background:#F8FAFC;color:var(--color-text-muted);border-color:var(--color-border);margin-bottom:8px">
              ${Icons.render('shield-check', { size: 20, className: 'icon' })}
            </div>
            <div style="font-weight:var(--font-weight-semibold);font-size:var(--font-size-sm);color:var(--color-text-primary)">No illness reports</div>
            <div style="font-size:var(--font-size-xs);color:var(--color-text-muted)">Patient has no reported infectious illness or fever records.</div>
          </div>
        `;
      }
    }

    // 6. Food Intake Summary
    const foodCard = document.getElementById('card-food-summary');
    if (foodCard) {
      if (ts.foodIntake.hasIntake) {
        foodCard.innerHTML = `
          <div class="overview-card-header">
            <div class="card-title-group">
              <div class="card-title-icon">${Icons.render('food-intake', { size: 16, className: 'icon' })}</div>
              <h3 class="card-title">Recent Food Intake</h3>
            </div>
            <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('food-intake')">
              View Food Intake &rarr;
            </button>
          </div>
          <div class="overview-card-body">
            <div class="food-entry-box">
              <div class="food-entry-top">
                <span class="food-meal-badge">${ts.foodIntake.meal}</span>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">${ts.foodIntake.time}</span>
              </div>
              <p class="food-entry-desc">${ts.foodIntake.description}</p>
              <p class="food-entry-notes">${ts.foodIntake.notes}</p>
            </div>
            <div style="font-size:11px;color:var(--color-text-muted);display:flex;align-items:center;gap:6px">
              ${Icons.render('info', { size: 12, className: 'icon' })}
              <span>Dietary tracking entry only; not autonomously linked to reaction status.</span>
            </div>
          </div>
        `;
      } else {
        foodCard.innerHTML = `
          <div class="overview-card-header">
            <div class="card-title-group">
              <div class="card-title-icon">${Icons.render('food-intake', { size: 16, className: 'icon' })}</div>
              <h3 class="card-title">Recent Food Intake</h3>
            </div>
            <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('food-intake')">
              View Log &rarr;
            </button>
          </div>
          <div class="overview-card-body" style="padding:var(--space-6); text-align:center; align-items:center;">
            <div style="font-weight:var(--font-weight-semibold);font-size:var(--font-size-sm);color:var(--color-text-primary)">No recent food intake recorded</div>
            <div style="font-size:var(--font-size-xs);color:var(--color-text-muted)">No meal entries submitted for the current reporting window.</div>
          </div>
        `;
      }
    }

    // 7. Upcoming Doses
    const upcomingCard = document.getElementById('card-upcoming-doses');
    if (upcomingCard) {
      upcomingCard.innerHTML = `
        <div class="overview-card-header">
          <div class="card-title-group">
            <div class="card-title-icon">${Icons.render('clock', { size: 16, className: 'icon' })}</div>
            <h3 class="card-title">Upcoming Doses</h3>
          </div>
          <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('doses')">
            Schedule &rarr;
          </button>
        </div>
        <div class="overview-card-body">
          <div class="upcoming-doses-list">
            ${data.upcomingDoses.map(d => `
              <div class="upcoming-dose-row">
                <div class="upcoming-dose-left">
                  <div class="upcoming-dose-time-box">
                    <span class="upcoming-dose-date">${d.date}</span>
                    <span class="upcoming-dose-time">${d.time}</span>
                  </div>
                  <span class="upcoming-dose-val">${d.doseValue}</span>
                </div>
                <span class="s2b-badge ${d.statusClass}">${d.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 8. Recent Activity (Mini Timeline)
    const activityCard = document.getElementById('card-recent-activity');
    if (activityCard) {
      activityCard.innerHTML = `
        <div class="overview-card-header">
          <div class="card-title-group">
            <div class="card-title-icon">${Icons.render('calendar', { size: 16, className: 'icon' })}</div>
            <h3 class="card-title">Recent Activity</h3>
          </div>
          <button type="button" class="card-header-action-btn" onclick="PatientOverview.switchTab('timeline')">
            Full Timeline &rarr;
          </button>
        </div>
        <div class="overview-card-body">
          <div class="mini-timeline-list">
            ${data.recentActivity.slice(0, 5).map(act => `
              <div class="mini-timeline-item">
                <div class="mini-timeline-dot"></div>
                <div class="mini-timeline-header">
                  <span class="mini-timeline-title">${act.title}</span>
                  <span class="mini-timeline-time">${act.date} · ${act.time}</span>
                </div>
                <span class="mini-timeline-desc">${act.detail}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 9. Demographics & Quick Actions Card
    const infoCard = document.getElementById('card-patient-info');
    if (infoCard) {
      infoCard.innerHTML = `
        <div class="overview-card-header">
          <div class="card-title-group">
            <div class="card-title-icon">${Icons.render('user', { size: 16, className: 'icon' })}</div>
            <h3 class="card-title">Patient &amp; Care Team</h3>
          </div>
          <button type="button" class="card-header-action-btn" onclick="PatientOverview.openModal('patient-info-modal')">
            Full Info &rarr;
          </button>
        </div>
        <div class="overview-card-body">
          <div class="patient-info-list">
            <div class="patient-info-item">
              <span class="info-item-label">Full Name</span>
              <span class="info-item-value">${data.name}</span>
            </div>
            <div class="patient-info-item">
              <span class="info-item-label">Patient ID</span>
              <span class="patient-identity-id-badge">${data.id}</span>
            </div>
            <div class="patient-info-item">
              <span class="info-item-label">Birth Date / Age</span>
              <span class="info-item-value">${data.dob} (${data.age} yrs)</span>
            </div>
            <div class="patient-info-item">
              <span class="info-item-label">Caregiver / Parent</span>
              <span class="info-item-value" style="color:var(--color-primary)">${data.caregiver.name}</span>
            </div>
            <div class="patient-info-item">
              <span class="info-item-label">Relationship</span>
              <span class="info-item-value">${data.caregiver.relationship}</span>
            </div>
            <div class="patient-info-item">
              <span class="info-item-label">Assigned Doctor</span>
              <span class="info-item-value">${data.assignedDoctor.name}</span>
            </div>
            <div class="patient-info-item">
              <span class="info-item-label">Clinic Location</span>
              <span class="info-item-value">${data.clinic}</span>
            </div>
          </div>

          <div class="quick-actions-bar">
            <button type="button" class="btn-quick-action" onclick="Sidebar.navigateTo('messages')">
              <span class="btn-quick-action-left">
                ${Icons.render('messages', { size: 14, className: 'icon' })}
                Message Patient / Caregiver
              </span>
              ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
            </button>
            <button type="button" class="btn-quick-action" onclick="PatientOverview.switchTab('treatment')">
              <span class="btn-quick-action-left">
                ${Icons.render('treatment', { size: 14, className: 'icon' })}
                View Treatment Protocol
              </span>
              ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
            </button>
            <button type="button" class="btn-quick-action" onclick="PatientOverview.switchTab('assessments')">
              <span class="btn-quick-action-left">
                ${Icons.render('assessments', { size: 14, className: 'icon' })}
                Review Health Assessments
              </span>
              ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
            </button>
            <button type="button" class="btn-quick-action" onclick="PatientOverview.switchTab('doses')">
              <span class="btn-quick-action-left">
                ${Icons.render('doses', { size: 14, className: 'icon' })}
                View Dose History
              </span>
              ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
            </button>
            <button type="button" class="btn-quick-action" onclick="PatientOverview.switchTab('timeline')">
              <span class="btn-quick-action-left">
                ${Icons.render('calendar', { size: 14, className: 'icon' })}
                View Clinical Timeline
              </span>
              ${Icons.render('chevron-right', { size: 12, className: 'icon' })}
            </button>
          </div>
        </div>
      `;
    }
  }

  /* --------------------------------------------------
     Render Secondary Sub-Tabs Content
  -------------------------------------------------- */
  function renderSubTabs(data) {
    // 1. Assessments Tab Pane
    const paneAssess = document.getElementById('tab-pane-assessments');
    if (paneAssess) {
      paneAssess.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Patient Health &amp; Illness Assessments</h2>
              <p class="subtab-subtitle">Daily pre-dose symptom checks and caregiver illness reports for ${data.name} (${data.id}).</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          <table class="subtab-records-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Assessment Type</th>
                <th>Reported Wellness</th>
                <th>Symptoms</th>
                <th>Review Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Today, 9:30 AM</strong></td>
                <td>Pre-Dose Health Check</td>
                <td><span class="wellness-badge-pill">${data.todayStatus.assessment.wellness}</span></td>
                <td>${data.todayStatus.assessment.symptoms}</td>
                <td><span class="s2b-badge ${data.todayStatus.assessment.class}">${data.todayStatus.assessment.label}</span></td>
              </tr>
              <tr>
                <td>Yesterday, 9:15 AM</td>
                <td>Pre-Dose Health Check</td>
                <td><span class="wellness-badge-pill">Feeling Well</span></td>
                <td>None reported</td>
                <td><span class="s2b-badge badge-assess-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Sep 15, 2026</td>
                <td>Pre-Dose Health Check</td>
                <td><span class="wellness-badge-pill">Feeling Well</span></td>
                <td>None reported</td>
                <td><span class="s2b-badge badge-assess-completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
          <div class="subtab-pass5-note">
            ${Icons.render('info', { size: 14, className: 'icon' })}
            <span>Full historical assessment filtering, caregiver question triage, and review workflow are linked for detailed management in future clinical passes.</span>
          </div>
        </div>
      `;
    }

    // 2. Doses Tab Pane
    const paneDoses = document.getElementById('tab-pane-doses');
    if (paneDoses) {
      paneDoses.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Dose Records &amp; Protocol Compliance</h2>
              <p class="subtab-subtitle">Administration history and scheduled cycles for ${data.treatment.protocol} (${data.treatment.phase}).</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          <div class="treatment-metrics-grid" style="margin-bottom:var(--space-2)">
            <div class="metric-box">
              <span class="metric-label">Protocol Adherence Rate</span>
              <span class="metric-value" style="color:var(--color-status-green)">${data.treatment.adherenceRate}</span>
              <span class="metric-sub">Last 30 days recorded</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Current Prescribed Dose</span>
              <span class="metric-value">${data.treatment.currentDose}</span>
              <span class="metric-sub">Clinician authorized</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Next Scheduled Dose</span>
              <span class="metric-value" style="font-size:15px">${data.treatment.nextDoseTime}</span>
              <span class="metric-sub">Caregiver morning cycle</span>
            </div>
          </div>
          <table class="subtab-records-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Dose Allergen Value</th>
                <th>Scheduled Time</th>
                <th>Status</th>
                <th>Recorded Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Today</strong></td>
                <td><strong>${data.todayStatus.dose.doseValue}</strong></td>
                <td>${data.todayStatus.dose.scheduledTime}</td>
                <td><span class="s2b-badge ${data.todayStatus.dose.class}">${data.todayStatus.dose.label}</span></td>
                <td>${data.todayStatus.dose.verifiedBy}</td>
              </tr>
              <tr>
                <td>Yesterday</td>
                <td>${data.treatment.currentDose}</td>
                <td>8:00 AM</td>
                <td><span class="s2b-badge badge-dose-taken">Taken</span></td>
                <td>Caregiver App Verification</td>
              </tr>
              <tr>
                <td>Sep 15, 2026</td>
                <td>${data.treatment.currentDose}</td>
                <td>8:00 AM</td>
                <td><span class="s2b-badge badge-dose-taken">Taken</span></td>
                <td>Caregiver App Verification</td>
              </tr>
            </tbody>
          </table>
          <div class="subtab-pass5-note">
            ${Icons.render('shield-check', { size: 14, className: 'icon' })}
            <span><strong>PASS 5 PREVIEW:</strong> Clinician-controlled dosage adjustments, escalation plans, in-clinic challenge scheduling, and dosage audit trail will be fully managed in Pass 5.</span>
          </div>
        </div>
      `;
    }

    // 3. Reactions Tab Pane
    const paneReactions = document.getElementById('tab-pane-reactions');
    if (paneReactions) {
      paneReactions.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Reported Reaction History</h2>
              <p class="subtab-subtitle">Patient-reported reactions, emergency medication logs, and clinical review status.</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          ${data.todayStatus.reaction.hasReaction ? `
            <div class="overview-attention-banner" style="margin-bottom:var(--space-3)">
              <div class="attention-banner-left">
                <div class="attention-icon-wrap">${Icons.render('alert-triangle', { size: 20, className: 'icon' })}</div>
                <div class="attention-content">
                  <h3 class="attention-title">Active Reaction Report · ${data.todayStatus.reaction.time}</h3>
                  <p class="attention-detail">${data.todayStatus.reaction.symptoms} — Severity: ${data.todayStatus.reaction.severity}</p>
                </div>
              </div>
              <span class="s2b-badge badge-alert-attention">${data.todayStatus.reaction.reviewStatus}</span>
            </div>
          ` : `
            <div style="padding:var(--space-8);text-align:center;">
              <div class="attention-icon-wrap" style="background:#F0FDF4;color:var(--color-status-green);border-color:#BBF7D0;margin:0 auto var(--space-3)">
                ${Icons.render('shield-check', { size: 24, className: 'icon' })}
              </div>
              <h3 style="font-size:var(--font-size-base);color:var(--color-text-primary);margin:0 0 4px">Zero Adverse Reactions Logged</h3>
              <p style="font-size:var(--font-size-sm);color:var(--color-text-secondary);margin:0">No allergic or systemic reactions have been reported for ${data.name}.</p>
            </div>
          `}
          <div class="subtab-pass5-note">
            ${Icons.render('info', { size: 14, className: 'icon' })}
            <span>Reaction grading is clinician-verified. The system does not diagnose reactions or autonomously determine emergency action plans.</span>
          </div>
        </div>
      `;
    }

    // 4. Illness Tab Pane
    const paneIllness = document.getElementById('tab-pane-illness');
    if (paneIllness) {
      paneIllness.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Illness Reports &amp; Dose Hold Protocol</h2>
              <p class="subtab-subtitle">Infectious illness tracking, fever history, and temporary protocol pauses.</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          ${data.todayStatus.illness.hasIllness ? `
            <div class="overview-attention-banner" style="background:#FFFBEB;border-color:#FDE68A;margin-bottom:var(--space-3)">
              <div class="attention-banner-left">
                <div class="attention-icon-wrap" style="background:#FEF3C7;color:#B45309;border-color:#FDE68A">
                  ${Icons.render('thermometer', { size: 20, className: 'icon' })}
                </div>
                <div class="attention-content">
                  <h3 class="attention-title" style="color:#92400E">Active Illness Hold: ${data.todayStatus.illness.symptoms}</h3>
                  <p class="attention-detail" style="color:#78350F">${data.todayStatus.illness.notes}</p>
                </div>
              </div>
              <span class="s2b-badge badge-treat-paused">Hold Active</span>
            </div>
          ` : `
            <div style="padding:var(--space-8);text-align:center;">
              <div class="attention-icon-wrap" style="background:#F8FAFC;color:var(--color-text-muted);border-color:var(--color-border);margin:0 auto var(--space-3)">
                ${Icons.render('shield-check', { size: 24, className: 'icon' })}
              </div>
              <h3 style="font-size:var(--font-size-base);color:var(--color-text-primary);margin:0 0 4px">No Active Illness Reports</h3>
              <p style="font-size:var(--font-size-sm);color:var(--color-text-secondary);margin:0">Patient is currently cleared with no reported fever, gastroenteritis, or acute infections.</p>
            </div>
          `}
          <div class="subtab-pass5-note">
            ${Icons.render('info', { size: 14, className: 'icon' })}
            <span>Safe2Bite Protocol: Doses are held during febrile illness until the patient is 24 hours afebrile without antipyretics.</span>
          </div>
        </div>
      `;
    }

    // 5. Food Intake Tab Pane
    const paneFood = document.getElementById('tab-pane-food-intake');
    if (paneFood) {
      paneFood.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Caregiver Food Intake Logs</h2>
              <p class="subtab-subtitle">Daily dietary entries recorded to track meals in relation to OIT dose timing.</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          <table class="subtab-records-table">
            <thead>
              <tr>
                <th>Meal Category</th>
                <th>Time Logged</th>
                <th>Food Description</th>
                <th>Timing vs Dose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="food-meal-badge">${data.todayStatus.foodIntake.meal}</span></td>
                <td><strong>${data.todayStatus.foodIntake.time}</strong></td>
                <td>${data.todayStatus.foodIntake.description}</td>
                <td>${data.todayStatus.foodIntake.notes}</td>
              </tr>
              <tr>
                <td><span class="food-meal-badge">Dinner</span></td>
                <td>Yesterday · 7:15 PM</td>
                <td>Baked salmon with quinoa and steamed green beans</td>
                <td>Consumed 1 hour prior to evening dose</td>
              </tr>
            </tbody>
          </table>
          <div class="subtab-pass5-note">
            ${Icons.render('info', { size: 14, className: 'icon' })}
            <span>Dietary logs are caregiver-reported observations. The system never infers allergy triggers or causation automatically.</span>
          </div>
        </div>
      `;
    }

    // 6. Treatment Tab Pane
    const paneTreat = document.getElementById('tab-pane-treatment');
    if (paneTreat) {
      paneTreat.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Treatment Protocol &amp; Escalation Plan</h2>
              <p class="subtab-subtitle">Prescribed immunotherapy schedule, authorized dosage stages, and target maintenance goals.</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          <div class="treatment-metrics-grid">
            <div class="metric-box">
              <span class="metric-label">Protocol Name</span>
              <span class="metric-value" style="font-size:16px;color:var(--color-primary)">${data.treatment.protocol}</span>
              <span class="metric-sub">Oral Immunotherapy</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Current Phase</span>
              <span class="metric-value" style="font-size:16px">${data.treatment.phase}</span>
              <span class="metric-sub">Dose Escalation</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Current Prescribed Dose</span>
              <span class="metric-value">${data.treatment.currentDose}</span>
              <span class="metric-sub">Daily oral dose</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">Target Maintenance</span>
              <span class="metric-value">${data.treatment.targetDose}</span>
              <span class="metric-sub">Long-term protective goal</span>
            </div>
          </div>
          <div class="subtab-pass5-note" style="background:#EFF6FF;border-color:#93C5FD">
            ${Icons.render('shield-check', { size: 16, className: 'icon' })}
            <span><strong>PASS 5 SCOPE:</strong> Authorized dosage modifications, escalation titration schedules, dose confirmations, and signed clinician audit trails are explicitly scheduled for PASS 5: TREATMENT &amp; DOSAGE MANAGEMENT.</span>
          </div>
        </div>
      `;
    }

    // 7. Timeline Tab Pane
    const paneTimeline = document.getElementById('tab-pane-timeline');
    if (paneTimeline) {
      paneTimeline.innerHTML = `
        <div class="subtab-content-card">
          <div class="subtab-header-banner">
            <div class="subtab-title-group">
              <h2 class="subtab-title">Complete Clinical Timeline</h2>
              <p class="subtab-subtitle">Unified chronological event ledger spanning assessments, doses, reactions, illness holds, messages, and appointments.</p>
            </div>
            <button type="button" class="btn-filter-apply" onclick="PatientOverview.switchTab('overview')">
              &larr; Return to Overview
            </button>
          </div>
          <div class="mini-timeline-list" style="padding-left:32px">
            ${data.recentActivity.map(act => `
              <div class="mini-timeline-item" style="padding-bottom:var(--space-5)">
                <div class="mini-timeline-dot" style="width:14px;height:14px;left:-23px"></div>
                <div class="mini-timeline-header">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="mini-timeline-title" style="font-size:var(--font-size-sm)">${act.title}</span>
                    <span class="s2b-badge ${act.statusClass}">${act.status}</span>
                  </div>
                  <span class="mini-timeline-time">${act.date} · ${act.time}</span>
                </div>
                <span class="mini-timeline-desc" style="font-size:var(--font-size-sm)">${act.detail}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  /* --------------------------------------------------
     Populate Modals
  -------------------------------------------------- */
  function populateModals(data) {
    // Patient Info Modal
    const infoBody = document.getElementById('modal-patient-info-body');
    if (infoBody) {
      infoBody.innerHTML = `
        <div class="patient-info-list">
          <div class="patient-info-item">
            <span class="info-item-label">Full Name</span>
            <span class="info-item-value">${data.name}</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Patient Record ID</span>
            <span class="patient-identity-id-badge">${data.id}</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Birth Date (DOB)</span>
            <span class="info-item-value">${data.dob}</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Age / Gender</span>
            <span class="info-item-value">${data.age} years · ${data.gender}</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Primary Caregiver / Parent</span>
            <span class="info-item-value">${data.caregiver.name} (${data.caregiver.relationship})</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Caregiver Phone</span>
            <span class="info-item-value">${data.caregiver.phone}</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Caregiver Email</span>
            <span class="info-item-value">${data.caregiver.email}</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Assigned Physician</span>
            <span class="info-item-value">${data.assignedDoctor.name} (${data.assignedDoctor.role})</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Clinical Care Center</span>
            <span class="info-item-value">${data.clinic}</span>
          </div>
        </div>
      `;
    }

    // Permissions Modal
    const permsBody = document.getElementById('modal-patient-perms-body');
    if (permsBody) {
      permsBody.innerHTML = `
        <p style="font-size:var(--font-size-sm);color:var(--color-text-secondary);margin:0">
          Access control verification for patient record <strong>${data.id}</strong>:
        </p>
        <div class="patient-info-list" style="margin-top:var(--space-3)">
          <div class="patient-info-item">
            <span class="info-item-label">Attending Physician</span>
            <span class="s2b-badge badge-treat-active">Authorized (Full Care)</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Care Team Role</span>
            <span class="s2b-badge badge-treat-active">Read &amp; Review Access</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">Caregiver Mobile Link</span>
            <span class="s2b-badge badge-treat-active">Connected (${data.caregiver.name})</span>
          </div>
          <div class="patient-info-item">
            <span class="info-item-label">HIPAA Security Standard</span>
            <span class="s2b-badge badge-alert-none">Compliant &amp; Encrypted</span>
          </div>
        </div>
      `;
    }
  }

  /* --------------------------------------------------
     Error & Unauthorized States
  -------------------------------------------------- */
  function showUnauthorizedState() {
    alert("[Safe2Bite Access Control] You do not have clinical authorization to view this patient record.");
    Sidebar.navigateTo('patients');
  }

  function showErrorState(msg) {
    alert(`[Safe2Bite Error] ${msg}`);
    Sidebar.navigateTo('patients');
  }

  /* --------------------------------------------------
     Public API
  -------------------------------------------------- */
  return {
    init,
    loadPatient,
    openPatient: loadPatient,
    switchTab,
    openModal,
    closeAllModals,
    getCurrentPatientId: () => currentPatientId
  };

})();
