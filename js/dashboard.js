/* ============================================================
   Safe2Bite Doctor Web Portal — Dashboard Renderer
   ============================================================ */

const Dashboard = (() => {

  /* -----------------------------------------------
     Initialize
  ----------------------------------------------- */
  function init() {
    renderSummaryCards();
    renderAttentionQueue();
    renderActivityFeed();
    renderUpcomingDoses();
    renderRecentMessages();
    renderUpcomingAppointments();
    renderWelcome();
  }

  /* -----------------------------------------------
     Welcome section
  ----------------------------------------------- */
  function renderWelcome() {
    const doc = Safe2BiteData.currentDoctor;
    const greetingEl = document.getElementById('welcome-greeting');
    if (greetingEl) {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
      else if (hour >= 17) greeting = 'Good evening';
      greetingEl.textContent = `${greeting}, ${doc.displayName}`;
    }

    const dateEl = document.getElementById('welcome-date');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }

    // Quick stats
    const s = Safe2BiteData.summary;
    setInnerText('welcome-stat-attention', s.patientsRequiringAttention);
    setInnerText('welcome-stat-alerts', s.openAlerts);
    setInnerText('welcome-stat-doses', s.upcomingDosesToday);
  }

  /* -----------------------------------------------
     Summary Cards
  ----------------------------------------------- */
  function renderSummaryCards() {
    const s = Safe2BiteData.summary;
    setInnerText('stat-total-patients',  s.totalActivePatients);
    setInnerText('stat-attention',       s.patientsRequiringAttention);
    setInnerText('stat-open-alerts',     s.openAlerts);
    setInnerText('stat-unread-messages', s.unreadMessages);
  }

  /* -----------------------------------------------
     Patients Requiring Attention Table
  ----------------------------------------------- */
  function renderAttentionQueue() {
    const container = document.getElementById('attention-queue-body');
    if (!container) return;

    const queue = Safe2BiteData.attentionQueue;

    // Update count badge
    const countEl = document.getElementById('attention-queue-count');
    if (countEl) {
      countEl.textContent = queue.length;
      countEl.className = `dashboard-block-count ${queue.length > 0 ? 'count-red' : ''}`;
    }

    if (queue.length === 0) {
      container.innerHTML = `
        <div class="empty-state empty-good">
          <div class="empty-state-icon">
            ${Icons.render('check-circle', { size: 24, className: 'icon' })}
          </div>
          <div class="empty-state-title">No patients require attention</div>
          <div class="empty-state-description">All patients are on track today.</div>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="table-wrapper">
        <table class="clinical-table" aria-label="Patients requiring attention">
          <thead>
            <tr>
              <th scope="col">Patient</th>
              <th scope="col">Alert / Issue</th>
              <th scope="col">Status</th>
              <th scope="col">Last Activity</th>
              <th scope="col"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            ${queue.map(p => renderAttentionRow(p)).join('')}
          </tbody>
        </table>
      </div>`;

    // Bind patient name clicks
    container.querySelectorAll('[data-patient-id]').forEach(el => {
      el.addEventListener('click', () => {
        PatientQuickView.open(el.dataset.patientId);
      });
    });

    // Pass 6: Bind Review action buttons to open Alert Detail Drawer
    container.querySelectorAll('.btn-dashboard-review').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const patientId = btn.dataset.patientId;
        if (typeof Alerts !== 'undefined' && typeof Safe2BiteData !== 'undefined' && Array.isArray(Safe2BiteData.alerts)) {
          const matchingAlert = Safe2BiteData.alerts.find(a => a.patientId === patientId);
          if (matchingAlert) {
            Alerts.openAlertDetail(matchingAlert.id);
            return;
          }
        }
        PatientQuickView.open(patientId);
      });
    });
  }

  function renderAttentionRow(p) {
    const alertIconMap = {
      'reaction-reported':  { icon: 'reactions',    cls: 'alert-icon-red' },
      'missed-dose':        { icon: 'doses',         cls: 'alert-icon-red' },
      'assessment-review':  { icon: 'assessments',   cls: 'alert-icon-amber' },
      'patient-message':    { icon: 'messages',      cls: 'alert-icon-blue' },
      'dose-not-taken':     { icon: 'doses',         cls: 'alert-icon-amber' },
      'new-assessment':     { icon: 'assessments',   cls: 'alert-icon-blue' },
    };
    const alertInfo = alertIconMap[p.alertType] || { icon: 'alert-triangle', cls: 'alert-icon-amber' };

    const statusBadgeMap = {
      'attention': 'badge-attention',
      'review':    'badge-review',
    };
    const badgeCls = statusBadgeMap[p.status] || 'badge-neutral';

    return `
      <tr>
        <td>
          <div class="patient-cell">
            <div class="avatar avatar-md avatar-color-${p.avatarColor}" aria-hidden="true">${p.initials}</div>
            <div class="patient-cell-info">
              <div class="patient-cell-name" 
                   data-patient-id="${p.id}" 
                   role="button" 
                   tabindex="0"
                   aria-label="View ${p.name} quick summary">${p.name}</div>
              <div class="patient-cell-id">${p.id}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="alert-cell">
            <div class="alert-cell-type">
              <span class="${alertInfo.cls}">${Icons.render(alertInfo.icon, { size: 14, className: 'icon' })}</span>
              ${p.alertLabel}
            </div>
            <div class="alert-cell-detail">${p.alertDetail}</div>
          </div>
        </td>
        <td>
          <span class="badge ${badgeCls}">
            ${Icons.render(p.status === 'attention' ? 'alert-triangle' : 'info', { size: 12, className: 'icon' })}
            ${p.statusLabel}
          </span>
        </td>
        <td>
          <div class="last-activity-cell">
            <div class="last-activity-time">${p.lastActivityLabel}</div>
            <div class="last-activity-label">${p.treatmentLabel}</div>
          </div>
        </td>
        <td>
          <div class="action-cell">
            <button class="btn btn-secondary btn-sm btn-dashboard-review" 
                    data-patient-id="${p.id}"
                    aria-label="Review ${p.name}">
              ${Icons.render('eye', { size: 13, className: 'icon' })} Review
            </button>
          </div>
        </td>
      </tr>`;
  }

  /* -----------------------------------------------
     Today's Activity Feed
  ----------------------------------------------- */
  function renderActivityFeed() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    const feed = Safe2BiteData.activityFeed;

    if (feed.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.render('clock', { size: 24, className: 'icon' })}</div>
          <div class="empty-state-title">No activity today</div>
          <div class="empty-state-description">Patient activity will appear here as it is recorded.</div>
        </div>`;
      return;
    }

    const activityIconMap = {
      'reaction-reported': { icon: 'reactions',   color: 'bg-red' },
      'illness-assessment':{ icon: 'assessments', color: 'bg-amber' },
      'message':           { icon: 'messages',    color: 'bg-blue' },
      'dose-not-taken':    { icon: 'doses',       color: 'bg-amber' },
      'health-assessment': { icon: 'assessments', color: 'bg-purple' },
      'dose-recorded':     { icon: 'doses',       color: 'bg-green' },
      'food-intake':       { icon: 'food-intake', color: 'bg-teal' },
    };

    container.innerHTML = feed.map(item => {
      const info = activityIconMap[item.activityType] || { icon: 'clock', color: 'bg-gray' };
      return `
        <div class="activity-item" 
             data-patient-id="${item.patientId}" 
             role="button" tabindex="0"
             aria-label="${item.patientName}: ${item.activityLabel}">
          <div class="activity-icon-wrap ${info.color}">
            ${Icons.render(info.icon, { size: 15, className: 'icon' })}
          </div>
          <div class="activity-content">
            <div class="activity-patient">${item.patientName}</div>
            <div class="activity-type">${item.activityLabel}</div>
          </div>
          <div class="activity-time">${item.timeLabel}</div>
        </div>`;
    }).join('');

    // Bind clicks
    container.querySelectorAll('[data-patient-id]').forEach(el => {
      el.addEventListener('click', () => PatientQuickView.open(el.dataset.patientId));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') PatientQuickView.open(el.dataset.patientId);
      });
    });
  }

  /* -----------------------------------------------
     Upcoming Doses
  ----------------------------------------------- */
  function renderUpcomingDoses() {
    const container = document.getElementById('upcoming-doses-list');
    if (!container) return;

    const doses = Safe2BiteData.upcomingDoses;

    if (doses.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.render('doses', { size: 24, className: 'icon' })}</div>
          <div class="empty-state-title">No upcoming doses</div>
          <div class="empty-state-description">No doses are scheduled for the near future.</div>
        </div>`;
      return;
    }

    const statusMap = {
      'scheduled': 'badge-scheduled',
      'missed':    'badge-missed',
      'held':      'badge-amber',
      'taken':     'badge-taken',
    };

    container.innerHTML = doses.map(dose => `
      <div class="dose-item" 
           data-patient-id="${dose.patientId}" 
           role="button" tabindex="0"
           aria-label="${dose.patientName}: ${dose.treatmentLabel}">
        <div class="dose-time-block">
          <div class="dose-time-hour">${dose.scheduledTimeLabel.includes('Tomorrow') ? 'TMR' : dose.scheduledTimeLabel.split(':')[0]}</div>
          <div class="dose-time-label">${dose.scheduledTimeLabel.includes('Tomorrow') ? '' : (parseInt(dose.scheduledTimeLabel) >= 12 ? 'PM' : 'AM')}</div>
        </div>
        <div class="avatar avatar-sm avatar-color-${dose.avatarColor}" aria-hidden="true">${dose.initials}</div>
        <div class="dose-patient">
          <div class="dose-patient-name">${dose.patientName}</div>
          <div class="dose-label">${dose.treatmentLabel} &middot; ${dose.doseLevelLabel}</div>
        </div>
        <span class="badge ${statusMap[dose.status] || 'badge-neutral'}">
          ${dose.statusLabel}
        </span>
      </div>`).join('');

    container.querySelectorAll('[data-patient-id]').forEach(el => {
      el.addEventListener('click', () => PatientQuickView.open(el.dataset.patientId));
    });
  }

  /* -----------------------------------------------
     Recent Messages
  ----------------------------------------------- */
  function renderRecentMessages() {
    const container = document.getElementById('recent-messages-list');
    if (!container) return;

    const rawMsgs = Safe2BiteData.recentMessages || (Safe2BiteData.conversations ? Safe2BiteData.conversations.map((c, i) => {
      const pName = c.patientName || c.participantName || 'Patient';
      const inits = c.initials || pName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const avColor = (c.avatarColor !== undefined) ? c.avatarColor : (i % 8);
      const prev = c.lastMessageSnippet || (c.lastMessage ? c.lastMessage.text : '');
      const time = c.lastMessageTime || (c.lastMessage ? c.lastMessage.timeLabel : 'Recently');
      return {
        patientId: c.patientId,
        patientName: pName,
        initials: inits,
        avatarColor: avColor,
        preview: prev,
        timeLabel: time,
        unread: (c.unreadCount > 0) || !!c.unread,
        senderNote: c.participantRole || (c.caregiver ? `(${c.caregiver})` : '')
      };
    }) : []);

    const msgs = rawMsgs || [];

    if (msgs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.render('messages', { size: 24, className: 'icon' })}</div>
          <div class="empty-state-title">No recent messages</div>
          <div class="empty-state-description">Patient messages will appear here.</div>
        </div>`;
      return;
    }

    container.innerHTML = msgs.map(msg => `
      <div class="message-item ${msg.unread ? 'unread' : ''}" 
           data-patient-id="${msg.patientId}" 
           role="button" tabindex="0"
           aria-label="Message from ${msg.patientName}${msg.unread ? ' — unread' : ''}">
        <div class="avatar avatar-sm avatar-color-${msg.avatarColor}" aria-hidden="true">${msg.initials}</div>
        <div class="message-item-content">
          <div class="message-item-top">
            <div class="message-item-sender">
              ${msg.patientName}${msg.senderNote ? ` <span style="font-weight:400;color:var(--color-text-muted);font-size:11px">${msg.senderNote}</span>` : ''}
            </div>
            <div class="message-item-time">${msg.timeLabel}</div>
          </div>
          <div class="message-item-preview">${msg.preview}</div>
        </div>
        ${msg.unread ? '<div class="message-unread-indicator"><div class="unread-dot" aria-label="Unread"></div></div>' : ''}
      </div>`).join('');

    container.querySelectorAll('[data-patient-id]').forEach(el => {
      el.addEventListener('click', () => {
        if (typeof Messages !== 'undefined' && Messages.openConversationForPatient) {
          Messages.openConversationForPatient(el.dataset.patientId);
        } else {
          PatientQuickView.open(el.dataset.patientId);
        }
      });
    });
  }

  /* -----------------------------------------------
     Upcoming Appointments
  ----------------------------------------------- */
  function renderUpcomingAppointments() {
    const container = document.getElementById('upcoming-appointments-list');
    if (!container) return;

    const appts = Safe2BiteData.upcomingAppointments;

    if (appts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.render('appointments', { size: 24, className: 'icon' })}</div>
          <div class="empty-state-title">No upcoming appointments</div>
          <div class="empty-state-description">Your upcoming appointment schedule will appear here.</div>
        </div>`;
      return;
    }

    const statusMap = {
      'confirmed': 'badge-green',
      'pending':   'badge-amber',
      'cancelled': 'badge-red',
    };

    container.innerHTML = appts.map(apt => `
      <div class="appointment-item" 
           data-patient-id="${apt.patientId}" 
           data-appt-id="${apt.id}"
           role="button" tabindex="0"
           aria-label="${apt.patientName}: ${apt.appointmentType} on ${apt.dateTimeLabel}">
        <div class="appointment-date-block">
          <div class="appointment-date-day">${apt.dateDay}</div>
          <div class="appointment-date-mon">${apt.dateMonth}</div>
        </div>
        <div class="avatar avatar-sm avatar-color-${apt.avatarColor}" aria-hidden="true">${apt.initials}</div>
        <div class="appointment-info">
          <div class="appointment-patient">${apt.patientName}</div>
          <div class="appointment-type">${apt.appointmentType}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
          <div class="appointment-time">${apt.time}</div>
          <span class="badge ${statusMap[apt.status] || 'badge-neutral'}">${apt.statusLabel}</span>
        </div>
      </div>`).join('');

    container.querySelectorAll('.appointment-item').forEach(el => {
      el.addEventListener('click', () => {
        if (typeof Appointments !== 'undefined' && Appointments.openAppointmentDetail) {
          Sidebar.navigateTo('appointments');
          setTimeout(() => {
            Appointments.openAppointmentDetail(el.dataset.apptId);
          }, 100);
        } else {
          PatientQuickView.open(el.dataset.patientId);
        }
      });
    });
  }

  /* -----------------------------------------------
     Utility
  ----------------------------------------------- */
  function setInnerText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  return { init };

})();
