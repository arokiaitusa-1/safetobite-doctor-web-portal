/* ============================================================
   Safe2Bite Doctor Web Portal — Sidebar Module
   ============================================================ */

const Sidebar = (() => {

  let sidebarEl = null;
  let isCollapsed = false;
  let isMobileOpen = false;
  const STORAGE_KEY = 's2b_sidebar_collapsed';
  const BREAKPOINT_TABLET = 768;
  const BREAKPOINT_LAPTOP = 1024;

  /* -----------------------------------------------
     Initialize
  ----------------------------------------------- */
  function init() {
    sidebarEl = document.getElementById('sidebar');
    if (!sidebarEl) return;

    // Restore collapse state from storage (desktop only)
    if (window.innerWidth > BREAKPOINT_LAPTOP) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        collapse(true);
      }
    }

    // Desktop collapse toggle
    const toggleBtn = document.getElementById('sidebar-collapse-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => toggleCollapse());
    }

    // Mobile sidebar toggle (hamburger in header)
    const mobileToggle = document.getElementById('header-sidebar-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => toggleMobile());
    }

    // Close sidebar on overlay click (mobile)
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.addEventListener('click', () => closeMobile());
    }

    // Set active nav link based on current page
    setActiveNavLink();

    // Handle resize
    window.addEventListener('resize', handleResize);
  }

  /* -----------------------------------------------
     Set active nav link
  ----------------------------------------------- */
  function setActiveNavLink() {
    const currentPage = document.body.dataset.page || 'dashboard';
    const navLinks = document.querySelectorAll('[data-nav]');

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
      if (link.dataset.nav === currentPage || (currentPage === 'patient-profile' && link.dataset.nav === 'patients')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* -----------------------------------------------
     Navigate to a page section
  ----------------------------------------------- */
  function navigateTo(page) {
    // Update body data attribute
    document.body.dataset.page = page;
    setActiveNavLink();

    // Show the correct page view
    const allViews = document.querySelectorAll('.page-view');
    allViews.forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${page}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Pass 5: If navigating to treatment, ensure General Treatment View is rendered
    if (page === 'treatment' && typeof Treatment !== 'undefined') {
      Treatment.renderGeneralView();
    }

    // Pass 6: If navigating to alerts, ensure Alerts view is refreshed
    if (page === 'alerts' && typeof Alerts !== 'undefined') {
      Alerts.refresh();
    }

    // New clinical directory modules
    if (page === 'assessments' && typeof Assessments !== 'undefined') {
      Assessments.render();
    }
    if (page === 'doses' && typeof Doses !== 'undefined') {
      Doses.render();
    }
    if (page === 'reactions' && typeof Reactions !== 'undefined') {
      Reactions.render();
    }
    if (page === 'illness' && typeof Illness !== 'undefined') {
      Illness.render();
    }
    if (page === 'food-intake' && typeof FoodIntake !== 'undefined') {
      FoodIntake.render();
    }

    // Pass 7: If navigating to messages or appointments, ensure views are refreshed
    if (page === 'messages' && typeof Messages !== 'undefined') {
      Messages.renderFilterBadges();
      Messages.renderThreadList();
    }
    if (page === 'appointments' && typeof Appointments !== 'undefined') {
      Appointments.renderMetrics();
      Appointments.renderTable();
    }

    // Pass 8: If navigating to reports, education, or settings, ensure views are refreshed
    if (page === 'reports' && typeof Reports !== 'undefined') {
      Reports.render();
    }
    if (page === 'education' && typeof Education !== 'undefined') {
      Education.render();
    }
    if (page === 'settings' && typeof Settings !== 'undefined') {
      Settings.render();
    }

    // Update header page title
    updateHeaderTitle(page);

    // On mobile, close sidebar after navigation
    if (window.innerWidth <= BREAKPOINT_TABLET) {
      closeMobile();
    }

    // Scroll to top
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.scrollTop = 0;
    }
  }

  /* -----------------------------------------------
     Update header title
  ----------------------------------------------- */
  const pageTitles = {
    'dashboard':    { name: 'Dashboard',      sub: 'Patient care overview' },
    'patients':     { name: 'Patients',       sub: 'Manage and monitor your patient panel' },
    'alerts':       { name: 'Alerts',         sub: 'Active alerts requiring attention' },
    'assessments':  { name: 'Assessments',    sub: 'Patient health and illness assessments' },
    'treatment':    { name: 'Treatment & Dosage Management', sub: 'Prescribed protocols, titration schedules & clinician audit trail' },
    'doses':        { name: 'Doses',          sub: 'Dose records and schedules' },
    'reactions':    { name: 'Reactions',      sub: 'Reported reactions and follow-ups' },
    'illness':      { name: 'Illness',        sub: 'Illness reports and holds' },
    'food-intake':  { name: 'Food Intake',    sub: 'Patient food intake logs' },
    'messages':     { name: 'Messages',       sub: 'Patient and caregiver messages' },
    'appointments': { name: 'Appointments',   sub: 'Upcoming and past appointments' },
    'reports':      { name: 'Reports',        sub: 'Clinical reports and analytics' },
    'education':    { name: 'Education',      sub: 'Patient education resources' },
    'settings':     { name: 'Settings',       sub: 'Portal settings and preferences' },
    'patient-profile': { name: 'Patient Clinical Overview', sub: 'Clinical monitoring & treatment history' },
  };

  function updateHeaderTitle(page) {
    const info = pageTitles[page] || { name: page, sub: '' };
    const nameEl = document.getElementById('header-page-name');
    const subEl  = document.getElementById('header-page-sub');
    if (nameEl) nameEl.textContent = info.name;
    if (subEl)  subEl.textContent  = info.sub;
  }

  /* -----------------------------------------------
     Collapse / Expand (desktop)
  ----------------------------------------------- */
  function collapse(silent = false) {
    isCollapsed = true;
    sidebarEl.classList.add('collapsed');
    sidebarEl.classList.remove('expanded');
    sidebarEl.setAttribute('aria-expanded', 'false');
    if (!silent) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }

  function expand(silent = false) {
    isCollapsed = false;
    sidebarEl.classList.remove('collapsed');
    sidebarEl.classList.add('expanded');
    sidebarEl.setAttribute('aria-expanded', 'true');
    if (!silent) {
      localStorage.setItem(STORAGE_KEY, 'false');
    }
  }

  function toggleCollapse() {
    if (isCollapsed) {
      expand();
    } else {
      collapse();
    }
  }

  /* -----------------------------------------------
     Mobile open / close
  ----------------------------------------------- */
  function openMobile() {
    isMobileOpen = true;
    sidebarEl.classList.add('mobile-open');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    isMobileOpen = false;
    sidebarEl.classList.remove('mobile-open');
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMobile() {
    if (isMobileOpen) {
      closeMobile();
    } else {
      openMobile();
    }
  }

  /* -----------------------------------------------
     Handle resize
  ----------------------------------------------- */
  function handleResize() {
    if (window.innerWidth > BREAKPOINT_TABLET && isMobileOpen) {
      closeMobile();
    }
  }

  /* -----------------------------------------------
     Public API
  ----------------------------------------------- */
  return { init, navigateTo, collapse, expand, toggleCollapse, openMobile, closeMobile };

})();
