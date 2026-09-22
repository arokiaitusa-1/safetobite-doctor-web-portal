/* ============================================================
   Safe2Bite Doctor Web Portal — Patient Quick View Module
   ============================================================ */

const PatientQuickView = (() => {

  let panelEl    = null;
  let overlayEl  = null;
  let isOpen     = false;
  let currentId  = null;

  /* -----------------------------------------------
     Initialize
  ----------------------------------------------- */
  function init() {
    panelEl   = document.getElementById('patient-quickview');
    overlayEl = document.getElementById('overlay');

    if (!panelEl) return;

    // Close button
    const closeBtn = document.getElementById('qv-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', close);

    // View full profile button
    const fullBtn = document.getElementById('qv-view-full-btn');
    if (fullBtn) {
      fullBtn.addEventListener('click', () => {
        if (currentId) {
          const targetId = currentId;
          close();
          if (typeof Patients !== 'undefined' && Patients.viewPatient) {
            Patients.viewPatient(targetId);
          } else {
            Sidebar.navigateTo('patients');
          }
        }
      });
    }

    // Message button
    const msgBtn = document.getElementById('qv-message-btn');
    if (msgBtn) {
      msgBtn.addEventListener('click', () => {
        if (currentId) {
          const targetId = currentId;
          close();
          if (typeof Patients !== 'undefined' && Patients.messagePatient) {
            Patients.messagePatient(targetId);
          } else {
            Sidebar.navigateTo('messages');
          }
        }
      });
    }

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  /* -----------------------------------------------
     Open panel with patient data
  ----------------------------------------------- */
  function open(patientId) {
    const data = Safe2BiteData.getPatientQuickView(patientId);
    if (!data) {
      console.warn(`[PatientQuickView] No data for patient: ${patientId}`);
      return;
    }

    currentId = patientId;
    render(data);

    panelEl.classList.add('open');
    isOpen = true;

    // Show overlay on tablet
    if (window.innerWidth <= 768 && overlayEl) {
      overlayEl.classList.add('active');
      overlayEl.onclick = close;
    }

    // Trap focus
    panelEl.querySelector('#qv-close-btn')?.focus();
  }

  /* -----------------------------------------------
     Close panel
  ----------------------------------------------- */
  function close() {
    panelEl.classList.remove('open');
    isOpen = false;
    currentId = null;
    if (overlayEl) {
      overlayEl.classList.remove('active');
      overlayEl.onclick = null;
    }
  }

  /* -----------------------------------------------
     Render patient data into panel
  ----------------------------------------------- */
  function render(data) {
    // Avatar + name
    const avatarEl = document.getElementById('qv-patient-avatar');
    const nameEl   = document.getElementById('qv-patient-name');
    const idEl     = document.getElementById('qv-patient-id');
    const treatEl  = document.getElementById('qv-treatment-badge');

    if (avatarEl) {
      avatarEl.textContent = data.initials;
      avatarEl.className = `qv-patient-avatar avatar-color-${data.avatarColor}`;
    }
    if (nameEl)  nameEl.textContent = data.name;
    if (idEl)    idEl.innerHTML     = `${data.id} &middot; Age ${data.age}`;
    if (treatEl) treatEl.innerHTML  = `
      <span class="badge badge-active">
        ${Icons.render('treatment', { size: 11, className: 'icon' })}
        ${data.treatmentLabel}
      </span>`;

    // Status grid
    const statusGrid = document.getElementById('qv-status-grid');
    if (statusGrid) {
      statusGrid.innerHTML = `
        <div class="qv-status-item">
          <div class="qv-status-label">Assessment</div>
          <div class="qv-status-value">
            <span class="badge ${data.todayAssessmentStatusClass}">${data.todayAssessmentStatus}</span>
          </div>
        </div>
        <div class="qv-status-item">
          <div class="qv-status-label">Today's Dose</div>
          <div class="qv-status-value">
            <span class="badge ${data.todayDoseStatusClass}">${data.todayDoseStatus}</span>
          </div>
        </div>
        <div class="qv-status-item">
          <div class="qv-status-label">Latest Reaction</div>
          <div class="qv-status-value">
            <span class="badge ${data.latestReactionStatusClass}">${data.latestReactionStatus}</span>
          </div>
        </div>
        <div class="qv-status-item">
          <div class="qv-status-label">Latest Illness</div>
          <div class="qv-status-value">
            <span class="badge ${data.latestIllnessStatusClass}">${data.latestIllnessStatus}</span>
          </div>
        </div>`;
    }

    // Next dose
    const nextDoseEl = document.getElementById('qv-next-dose');
    if (nextDoseEl) {
      nextDoseEl.innerHTML = `
        <div class="qv-status-item" style="width:100%">
          <div class="qv-status-label">Next Scheduled Dose</div>
          <div class="qv-status-value" style="font-size:var(--font-size-sm); color:var(--color-text-primary)">
            ${Icons.render('clock', { size: 13, className: 'icon' })}
            ${data.nextScheduledDose}
          </div>
        </div>`;
    }

    // Last activity
    const lastActEl = document.getElementById('qv-last-activity');
    if (lastActEl) {
      lastActEl.innerHTML = `
        <div class="qv-status-item" style="width:100%">
          <div class="qv-status-label">Last Activity</div>
          <div class="qv-status-value" style="font-size:var(--font-size-sm); color:var(--color-text-primary)">
            ${Icons.render('clock', { size: 13, className: 'icon' })}
            ${data.lastActivity}
          </div>
        </div>`;
    }

    // Alerts
    const alertListEl = document.getElementById('qv-alert-list');
    if (alertListEl) {
      if (data.alerts && data.alerts.length > 0) {
        alertListEl.innerHTML = data.alerts.map(a => `
          <div class="qv-alert-item ${a.type}">
            ${Icons.render(a.icon, { size: 14, className: 'icon' })}
            <span>${a.text}</span>
          </div>`).join('');
      } else {
        alertListEl.innerHTML = `
          <div class="qv-alert-item alert-green">
            ${Icons.render('check-circle', { size: 14, className: 'icon' })}
            <span>No active alerts for this patient</span>
          </div>`;
      }
    }
  }

  /* -----------------------------------------------
     Public API
  ----------------------------------------------- */
  return { init, open, close };

})();
