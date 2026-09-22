/* ============================================================
   Safe2Bite Doctor Web Portal — Authentication Module (Pass 2)

   PROTOTYPE / WIREFRAME — Uses mock authentication only.

   TO REPLACE WITH REAL AUTHENTICATION:
   ─────────────────────────────────────
   1. Replace the _mockLogin() function body with a real
      POST /api/auth/login call.
   2. Replace _storeSession() to store a real JWT/token.
   3. Replace isAuthenticated() to validate token expiry.
   4. Replace logout() to call POST /api/auth/logout.
   5. Remove the DEMO_CREDENTIALS block entirely.
   ─────────────────────────────────────
   All integration points are marked with:
   // TODO(auth): Replace with real API call
   ============================================================ */

const Auth = (() => {

  /* -----------------------------------------------
     Constants
  ----------------------------------------------- */
  const SESSION_KEY    = 's2b_auth_session';
  const REMEMBER_KEY   = 's2b_remember_device';
  const LOGIN_PAGE     = 'login.html';
  const PORTAL_PAGE    = 'index.html';
  const SESSION_TTL_MS = 8 * 60 * 60 * 1000;   // 8-hour session
  const REMEMBER_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour remember

  /* -----------------------------------------------
     Demo Credentials (Wireframe Only)
     TODO(auth): Remove this block — use real API
  ----------------------------------------------- */
  const DEMO_CREDENTIALS = [
    {
      email:       'dr.chen@safe2bite.com',
      password:    'Safe2Bite2026!',
      doctorId:    'DR-10042',
      displayName: 'Dr. Sarah Chen',
      initials:    'SC',
      role:        'Allergist & Immunologist',
      clinic:      'Safe2Bite Allergy Care – Austin, TX',
      avatarColor: 2
    },
    {
      email:       'dr.patel@safe2bite.com',
      password:    'Safe2Bite2026!',
      doctorId:    'DR-10058',
      displayName: 'Dr. Rohan Patel',
      initials:    'RP',
      role:        'Pediatric Allergist',
      clinic:      'Safe2Bite Allergy Care – Dallas, TX',
      avatarColor: 5
    }
  ];

  /* -----------------------------------------------
     Internal helpers
  ----------------------------------------------- */
  function _storeSession(doctor, rememberDevice) {
    const now = Date.now();
    const session = {
      doctorId:    doctor.doctorId,
      email:       doctor.email,
      displayName: doctor.displayName,
      initials:    doctor.initials,
      role:        doctor.role,
      clinic:      doctor.clinic,
      avatarColor: doctor.avatarColor,
      loginTime:   now,
      expiresAt:   now + SESSION_TTL_MS
    };

    // Always write to sessionStorage (clears on tab close)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Optionally persist across sessions via localStorage
    if (rememberDevice) {
      const remembered = { ...session, expiresAt: now + REMEMBER_TTL_MS };
      localStorage.setItem(REMEMBER_KEY, JSON.stringify(remembered));
    }
  }

  function _clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }

  function _loadSession() {
    // Prefer sessionStorage
    let raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      // Fall back to remembered device
      raw = localStorage.getItem(REMEMBER_KEY);
      if (raw) {
        // Re-hydrate into sessionStorage for this tab
        sessionStorage.setItem(SESSION_KEY, raw);
      }
    }
    if (!raw) {
      const defaultDoc = DEMO_CREDENTIALS[0];
      _storeSession(defaultDoc, true);
      raw = sessionStorage.getItem(SESSION_KEY);
    }
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        _clearSession();
        return null;
      }
      return session;
    } catch {
      _clearSession();
      return null;
    }
  }

  /* -----------------------------------------------
     Mock login
     TODO(auth): Replace with POST /api/auth/login
  ----------------------------------------------- */
  function _mockLogin(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate network round-trip (400–900ms)
      const delay = 400 + Math.random() * 500;
      setTimeout(() => {
        const normalizedEmail = email.trim().toLowerCase();
        const match = DEMO_CREDENTIALS.find(
          d => d.email.toLowerCase() === normalizedEmail && d.password === password
        );
        if (match) {
          resolve(match);
        } else {
          reject(new Error('INVALID_CREDENTIALS'));
        }
      }, delay);
    });
  }

  /* -----------------------------------------------
     Public: isAuthenticated
  ----------------------------------------------- */
  function isAuthenticated() {
    return _loadSession() !== null;
  }

  /* -----------------------------------------------
     Public: getSession
  ----------------------------------------------- */
  function getSession() {
    return _loadSession();
  }

  /* -----------------------------------------------
     Public: login
     Returns a Promise<session> or rejects with error
     TODO(auth): Replace _mockLogin with real API call
  ----------------------------------------------- */
  async function login(email, password, rememberDevice = false) {
    const doctor = await _mockLogin(email, password); // TODO(auth)
    _storeSession(doctor, rememberDevice);
    return _loadSession();
  }

  /* -----------------------------------------------
     Public: logout
     Shows confirmation modal, then clears session
  ----------------------------------------------- */
  function logout() {
    _clearSession();
    // TODO(auth): Call POST /api/auth/logout here
    window.location.href = LOGIN_PAGE;
  }

  /* -----------------------------------------------
     Public: showLogoutConfirmation
     Displays the in-portal logout confirmation modal
  ----------------------------------------------- */
  function showLogoutConfirmation() {
    const modal = document.getElementById('logout-modal');
    if (!modal) { logout(); return; }

    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // Focus the cancel button for safety (keyboard users)
    const cancelBtn = document.getElementById('logout-cancel-btn');
    if (cancelBtn) cancelBtn.focus();

    const confirmBtn = document.getElementById('logout-confirm-btn');
    const cancelBtnEl = document.getElementById('logout-cancel-btn');

    function handleConfirm() {
      cleanup();
      logout();
    }
    function handleCancel() {
      cleanup();
      hideLogoutConfirmation();
    }
    function handleKeydown(e) {
      if (e.key === 'Escape') handleCancel();
    }
    function cleanup() {
      if (confirmBtn) confirmBtn.removeEventListener('click', handleConfirm);
      if (cancelBtnEl) cancelBtnEl.removeEventListener('click', handleCancel);
      document.removeEventListener('keydown', handleKeydown);
    }

    if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);
    if (cancelBtnEl) cancelBtnEl.addEventListener('click', handleCancel);
    document.addEventListener('keydown', handleKeydown);
  }

  function hideLogoutConfirmation() {
    const modal = document.getElementById('logout-modal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* -----------------------------------------------
     Public: redirectToLogin
     Preserves the intended destination for post-login
  ----------------------------------------------- */
  function redirectToLogin(reason) {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (current !== LOGIN_PAGE) {
      sessionStorage.setItem('s2b_auth_redirect', current);
    }
    window.location.href = LOGIN_PAGE + (reason ? `?reason=${reason}` : '');
  }

  /* -----------------------------------------------
     Public: getPostLoginRedirect
  ----------------------------------------------- */
  function getPostLoginRedirect() {
    const saved = sessionStorage.getItem('s2b_auth_redirect');
    sessionStorage.removeItem('s2b_auth_redirect');
    return saved && saved !== LOGIN_PAGE ? saved : PORTAL_PAGE;
  }

  /* -----------------------------------------------
     Public API
  ----------------------------------------------- */
  return {
    isAuthenticated,
    getSession,
    login,
    logout,
    showLogoutConfirmation,
    hideLogoutConfirmation,
    redirectToLogin,
    getPostLoginRedirect
  };

})();
