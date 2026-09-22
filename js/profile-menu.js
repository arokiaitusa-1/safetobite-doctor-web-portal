/* ============================================================
   Safe2Bite Doctor Web Portal — Profile Menu Module
   ============================================================ */

const ProfileMenu = (() => {

  let menuEl    = null;
  let triggerEl = null;
  let isOpen    = false;

  /* -----------------------------------------------
     Initialize
  ----------------------------------------------- */
  function init() {
    menuEl    = document.getElementById('profile-dropdown');
    triggerEl = document.getElementById('header-profile-btn');

    if (!menuEl || !triggerEl) return;

    // Populate doctor info
    renderHeader();

    // Toggle
    triggerEl.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !menuEl.contains(e.target) && e.target !== triggerEl) {
        close();
      }
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });

    // Menu item actions
    bindMenuActions();
  }

  /* -----------------------------------------------
     Render doctor info in header
  ----------------------------------------------- */
  function renderHeader() {
    const doc = Safe2BiteData.currentDoctor;

    // Header profile button
    const nameEl   = document.getElementById('header-profile-name');
    const roleEl   = document.getElementById('header-profile-role');
    const avatarEl = document.getElementById('header-profile-avatar');
    if (nameEl)   nameEl.textContent   = doc.displayName;
    if (roleEl)   roleEl.textContent   = doc.role;
    if (avatarEl) avatarEl.textContent = doc.initials;

    // Dropdown header
    const dropNameEl   = document.getElementById('profile-dropdown-name');
    const dropRoleEl   = document.getElementById('profile-dropdown-role');
    const dropClinicEl = document.getElementById('profile-dropdown-clinic-text');
    const dropAvatarEl = document.getElementById('profile-dropdown-avatar');
    if (dropNameEl)   dropNameEl.textContent   = doc.displayName;
    if (dropRoleEl)   dropRoleEl.textContent   = doc.role;
    if (dropClinicEl) dropClinicEl.textContent = doc.clinic;
    if (dropAvatarEl) dropAvatarEl.textContent = doc.initials;

    // Sidebar doctor strip
    const sidebarNameEl = document.getElementById('sidebar-doctor-name');
    const sidebarRoleEl = document.getElementById('sidebar-doctor-role');
    const sidebarAvatarEl = document.getElementById('sidebar-doctor-avatar');
    if (sidebarNameEl)   sidebarNameEl.textContent   = doc.displayName;
    if (sidebarRoleEl)   sidebarRoleEl.textContent   = doc.role;
    if (sidebarAvatarEl) sidebarAvatarEl.textContent = doc.initials;
  }

  /* -----------------------------------------------
     Bind menu item actions
  ----------------------------------------------- */
  function bindMenuActions() {
    // Profile
    const profileItem = document.getElementById('menu-profile');
    if (profileItem) {
      profileItem.addEventListener('click', () => {
        close();
        Sidebar.navigateTo('settings');
      });
    }

    // Settings
    const settingsItem = document.getElementById('menu-settings');
    if (settingsItem) {
      settingsItem.addEventListener('click', () => {
        close();
        Sidebar.navigateTo('settings');
      });
    }

    // Logout
    const logoutItem = document.getElementById('menu-logout');
    if (logoutItem) {
      logoutItem.addEventListener('click', () => {
        close();
        // Pass 2: Show confirmation modal, then redirect to login
        if (typeof Auth !== 'undefined') {
          Auth.showLogoutConfirmation();
        } else {
          window.location.href = 'login.html';
        }
      });
    }
  }

  /* -----------------------------------------------
     Open / Close / Toggle
  ----------------------------------------------- */
  function open() {
    isOpen = true;
    menuEl.classList.add('open');
    triggerEl.classList.add('active');
    triggerEl.setAttribute('aria-expanded', 'true');
    if (typeof Notifications !== 'undefined') Notifications.close();
    if (typeof Search !== 'undefined') Search.close();
  }

  function close() {
    isOpen = false;
    menuEl.classList.remove('open');
    triggerEl.classList.remove('active');
    triggerEl.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    if (isOpen) close(); else open();
  }

  return { init, open, close, toggle };

})();
