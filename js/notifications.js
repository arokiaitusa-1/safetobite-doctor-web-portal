/* ============================================================
   Safe2Bite Doctor Web Portal — Notifications Module
   ============================================================ */

const Notifications = (() => {

  let panelEl = null;
  let triggerBtn = null;
  let isOpen = false;
  let notifications = [];

  /* -----------------------------------------------
     Initialize
  ----------------------------------------------- */
  function init() {
    panelEl    = document.getElementById('notifications-panel');
    triggerBtn = document.getElementById('btn-notifications');

    if (!panelEl || !triggerBtn) return;

    // Load data
    notifications = [...Safe2BiteData.notifications];

    // Render
    render();

    // Toggle panel
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    // Mark all read button
    const markAllBtn = document.getElementById('notif-mark-all-read');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', markAllRead);
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !panelEl.contains(e.target) && e.target !== triggerBtn) {
        close();
      }
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  /* -----------------------------------------------
     Render notifications
  ----------------------------------------------- */
  function render() {
    const listEl = document.getElementById('notif-list');
    if (!listEl) return;

    const unreadCount = notifications.filter(n => n.unread).length;

    // Update badge
    updateBadge(unreadCount);

    if (notifications.length === 0) {
      listEl.innerHTML = `
        <div class="notif-empty">
          ${Icons.render('bell', { size: 36, className: 'icon' })}
          <div class="notif-empty-title">No notifications</div>
          <div class="notif-empty-sub">You are all caught up.</div>
        </div>`;
      return;
    }

    listEl.innerHTML = notifications.map(n => renderItem(n)).join('');

    // Bind click handlers
    listEl.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.notifId;
        markRead(id);
        handleNotifClick(id);
      });
    });
  }

  /* -----------------------------------------------
     Render single notification item
  ----------------------------------------------- */
  function renderItem(notif) {
    const iconMap = {
      'reaction':     'reactions',
      'missed-dose':  'doses',
      'message':      'messages',
      'assessment':   'assessments',
      'appointment':  'appointments',
      'health-check': 'assessments',
      'treatment':    'treatment'
    };
    const iconName = iconMap[notif.type] || 'bell';

    return `
      <div class="notif-item ${notif.unread ? 'unread' : ''}" 
           data-notif-id="${notif.id}" 
           role="button" 
           tabindex="0"
           aria-label="${notif.title}">
        <div class="notif-icon ${notif.iconColor}">
          ${Icons.render(iconName, { size: 17, className: 'icon' })}
        </div>
        <div class="notif-content">
          <div class="notif-title">${notif.title}</div>
          <div class="notif-patient">${notif.patientName}</div>
          <div class="notif-time">${notif.timeLabel}</div>
        </div>
        ${notif.unread ? '<div class="notif-unread-dot" aria-hidden="true"></div>' : ''}
      </div>`;
  }

  /* -----------------------------------------------
     Update header badge
  ----------------------------------------------- */
  function updateBadge(count) {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
    // Panel count badge
    const countBadge = document.getElementById('notif-count-badge');
    if (countBadge) {
      countBadge.textContent = count;
      countBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  /* -----------------------------------------------
     Mark single notification as read
  ----------------------------------------------- */
  function markRead(id) {
    notifications = notifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    );
    render();
  }

  /* -----------------------------------------------
     Mark all as read
  ----------------------------------------------- */
  function markAllRead() {
    notifications = notifications.map(n => ({ ...n, unread: false }));
    render();
  }

  /* -----------------------------------------------
     Handle notification click → navigate to patient
  ----------------------------------------------- */
  function handleNotifClick(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif && notif.patientId) {
      close();
      // Pass 6: If this notification is an alert event, open Alert Detail Drawer
      if (typeof Alerts !== 'undefined' && typeof Safe2BiteData !== 'undefined' && Array.isArray(Safe2BiteData.alerts)) {
        const matchingAlert = Safe2BiteData.alerts.find(a => a.patientId === notif.patientId);
        if (matchingAlert) {
          Alerts.openAlertDetail(matchingAlert.id);
          return;
        }
      }
      // Fallback: Open patient quick view
      if (typeof PatientQuickView !== 'undefined') {
        PatientQuickView.open(notif.patientId);
      }
    }
  }

  /* -----------------------------------------------
     Open / Close
  ----------------------------------------------- */
  function open() {
    isOpen = true;
    panelEl.classList.add('open');
    triggerBtn.classList.add('active');
    triggerBtn.setAttribute('aria-expanded', 'true');
    // Close other panels
    if (typeof ProfileMenu !== 'undefined') ProfileMenu.close();
    if (typeof Search !== 'undefined') Search.close();
  }

  function close() {
    isOpen = false;
    panelEl.classList.remove('open');
    triggerBtn.classList.remove('active');
    triggerBtn.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    if (isOpen) close(); else open();
  }

  return { init, open, close, toggle, markAllRead };

})();
