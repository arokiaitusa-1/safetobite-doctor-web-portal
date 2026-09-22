/* ============================================================
   Safe2Bite Doctor Web Portal — App Initialization
   ============================================================ */

const App = (() => {

  /* -----------------------------------------------
     Boot sequence
  ----------------------------------------------- */
  function init() {
    // --- Pass 2: Auth guard ---
    // Redirect to login if no valid session exists
    if (typeof Auth !== 'undefined' && !Auth.isAuthenticated()) {
      Auth.redirectToLogin();
      return;
    }

    // Populate header/sidebar with session data
    if (typeof Auth !== 'undefined') {
      const session = Auth.getSession();
      if (session) {
        // Override sample-data doctor with authenticated session values
        Safe2BiteData.currentDoctor.displayName = session.displayName;
        Safe2BiteData.currentDoctor.initials    = session.initials;
        Safe2BiteData.currentDoctor.role        = session.role;
        Safe2BiteData.currentDoctor.clinic      = session.clinic;
        Safe2BiteData.currentDoctor.avatarColor = session.avatarColor;
      }
    }

    function safeInit(name, fn) {
      try {
        fn();
      } catch (err) {
        console.error(`[App.init] Module "${name}" failed to initialize:`, err);
        const errDiv = document.createElement('div');
        errDiv.className = 'module-init-error';
        errDiv.setAttribute('data-module', name);
        errDiv.textContent = `[Init Error in ${name}]: ${err.message} \n ${err.stack || ''}`;
        document.body.appendChild(errDiv);
      }
    }

    // Initialize all modules in dependency order
    safeInit('Sidebar', () => Sidebar.init());
    safeInit('Notifications', () => Notifications.init());
    safeInit('Search', () => Search.init());
    safeInit('ProfileMenu', () => ProfileMenu.init());
    safeInit('PatientQuickView', () => PatientQuickView.init());
    safeInit('Dashboard', () => Dashboard.init());
    if (typeof Patients !== 'undefined') {
      safeInit('Patients', () => Patients.init());
    }
    if (typeof PatientOverview !== 'undefined') {
      safeInit('PatientOverview', () => PatientOverview.init());
    }
    if (typeof Treatment !== 'undefined') {
      safeInit('Treatment', () => Treatment.init());
    }
    if (typeof Alerts !== 'undefined') {
      safeInit('Alerts', () => Alerts.init());
    }
    if (typeof Assessments !== 'undefined') {
      safeInit('Assessments', () => Assessments.init());
    }
    if (typeof Doses !== 'undefined') {
      safeInit('Doses', () => Doses.init());
    }
    if (typeof Reactions !== 'undefined') {
      safeInit('Reactions', () => Reactions.init());
    }
    if (typeof Illness !== 'undefined') {
      safeInit('Illness', () => Illness.init());
    }
    if (typeof FoodIntake !== 'undefined') {
      safeInit('FoodIntake', () => FoodIntake.init());
    }
    if (typeof Messages !== 'undefined') {
      safeInit('Messages', () => Messages.init());
    }
    if (typeof Appointments !== 'undefined') {
      safeInit('Appointments', () => Appointments.init());
    }
    if (typeof Reports !== 'undefined') {
      safeInit('Reports', () => Reports.init());
    }
    if (typeof Education !== 'undefined') {
      safeInit('Education', () => Education.init());
    }
    if (typeof Settings !== 'undefined') {
      safeInit('Settings', () => Settings.init());
    }

    // Set active page from URL query/hash or default to dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || (window.location.hash ? window.location.hash.replace('#', '') : 'dashboard');
    const initialPatient = urlParams.get('patientId') || 'SB-00124';

    if (initialPage === 'patient-profile' && typeof PatientOverview !== 'undefined') {
      PatientOverview.loadPatient(initialPatient, true);
    } else {
      Sidebar.navigateTo(initialPage);
      const openDose = urlParams.get('openDose');
      if (openDose && typeof Treatment !== 'undefined') {
        setTimeout(() => Treatment.openDoseDetail(openDose), 150);
      }
      const openAlert = urlParams.get('openAlert');
      if (openAlert && typeof Alerts !== 'undefined') {
        setTimeout(() => Alerts.openAlertDetail(openAlert), 150);
      }
      const openConversation = urlParams.get('openConversation');
      if (openConversation && typeof Messages !== 'undefined') {
        setTimeout(() => Messages.openConversationForPatient(openConversation), 150);
      }
      const openAppointment = urlParams.get('openAppointment');
      if (openAppointment && typeof Appointments !== 'undefined') {
        setTimeout(() => Appointments.openAppointmentDetail(openAppointment), 150);
      }
    }

    // Logo error fallback
    handleLogoFallback();

    // Set current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    console.info('[Safe2Bite] Doctor Portal initialized — Pass 8 Reports, Education & Settings layers active');
  }

  /* -----------------------------------------------
     Toast Notification Helper
  ----------------------------------------------- */
  function showNotification(message, type) {
    type = type || 'info';
    let container = document.getElementById('toast-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-notification-container';
      container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#059669' : (type === 'error' ? '#dc2626' : '#0284c7');
    toast.style.cssText = 'background:' + bg + ';color:#ffffff;padding:0.75rem 1.25rem;border-radius:8px;font-size:0.825rem;font-weight:600;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);display:flex;align-items:center;gap:0.5rem;pointer-events:auto;transition:opacity 0.25s ease;opacity:0;';
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 3200);
  }

  function navigateTo(page) {
    if (typeof Sidebar !== 'undefined' && Sidebar.navigateTo) {
      Sidebar.navigateTo(page);
    }
  }

  /* -----------------------------------------------
     Logo fallback
  ----------------------------------------------- */
  function handleLogoFallback() {
    const logoImg = document.getElementById('sidebar-logo-img');
    if (!logoImg) return;

    logoImg.addEventListener('error', () => {
      logoImg.classList.add('error');
      logoImg.style.display = 'none';
      const fallback = document.getElementById('sidebar-logo-fallback');
      if (fallback) fallback.style.display = 'flex';
    });

    logoImg.addEventListener('load', () => {
      logoImg.classList.remove('error');
      const fallback = document.getElementById('sidebar-logo-fallback');
      if (fallback) fallback.style.display = 'none';
    });
  }

  return { init, navigateTo, showNotification };

})();

/* -----------------------------------------------
   Boot on DOM ready
----------------------------------------------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
