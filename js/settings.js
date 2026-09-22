/* ==========================================================================
   SAFE2BITE DOCTOR / CLINICAL WEB PORTAL
   PASS 8 — SETTINGS CONTROLLER & CONFIGURATION
   ========================================================================== */

(function () {
  'use strict';

  var activeSection = 'account';
  var isDirty = false;
  var pendingSection = null;

  var Settings = {
    init: function () {
      this.bindEvents();
      this.render();
    },

    bindEvents: function () {
      var self = this;

      // Section navigation tabs
      var navBtns = document.querySelectorAll('.settings-nav-btn');
      navBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-section');
          if (target === activeSection) return;

          if (isDirty) {
            pendingSection = target;
            var modalUnsaved = document.getElementById('modal-unsaved-changes');
            if (modalUnsaved) modalUnsaved.classList.add('active');
          } else {
            self.switchSection(target);
          }
        });
      });

      // Unsaved changes modal actions
      var btnStay = document.getElementById('btn-unsaved-stay');
      var btnDiscard = document.getElementById('btn-unsaved-discard');
      var modalUnsaved = document.getElementById('modal-unsaved-changes');

      if (btnStay && modalUnsaved) {
        btnStay.addEventListener('click', function () {
          modalUnsaved.classList.remove('active');
          pendingSection = null;
        });
      }

      if (btnDiscard && modalUnsaved) {
        btnDiscard.addEventListener('click', function () {
          modalUnsaved.classList.remove('active');
          isDirty = false;
          if (pendingSection) {
            self.switchSection(pendingSection);
            pendingSection = null;
          }
        });
      }

      // Track dirty input changes
      document.querySelectorAll('#form-account-settings input').forEach(function (input) {
        input.addEventListener('input', function () {
          isDirty = true;
        });
      });

      // Account Save
      var formAccount = document.getElementById('form-account-settings');
      if (formAccount) {
        formAccount.addEventListener('submit', function (e) {
          e.preventDefault();
          self.handleSaveAccount();
        });
      }

      // Password Change
      var formPassword = document.getElementById('form-change-password');
      if (formPassword) {
        formPassword.addEventListener('submit', function (e) {
          e.preventDefault();
          self.handleChangePassword();
        });
      }

      // 2FA Modal
      var btnOpen2FA = document.getElementById('btn-configure-2fa');
      var modal2FA = document.getElementById('modal-2fa-setup');
      var btnClose2FA = document.getElementById('btn-close-2fa');
      var btnConfirm2FA = document.getElementById('btn-confirm-2fa');

      if (btnOpen2FA && modal2FA) {
        btnOpen2FA.addEventListener('click', function () {
          modal2FA.classList.add('active');
        });
      }

      var close2FAModal = function () {
        if (modal2FA) modal2FA.classList.remove('active');
      };

      if (btnClose2FA) btnClose2FA.addEventListener('click', close2FAModal);
      if (btnConfirm2FA) {
        btnConfirm2FA.addEventListener('click', function () {
          close2FAModal();
          if (window.App && window.App.showNotification) {
            window.App.showNotification('Two-Factor Authentication verified and active', 'success');
          }
        });
      }

      // Terminate other sessions
      var btnSignOutOther = document.getElementById('btn-sign-out-other-sessions');
      if (btnSignOutOther) {
        btnSignOutOther.addEventListener('click', function () {
          self.handleSignOutOtherSessions();
        });
      }

      // Notification toggle changes
      document.querySelectorAll('.notif-matrix-table input[type="checkbox"]').forEach(function (box) {
        box.addEventListener('change', function () {
          if (window.App && window.App.showNotification) {
            window.App.showNotification('Notification preferences saved', 'info');
          }
        });
      });
    },

    switchSection: function (sectionName) {
      activeSection = sectionName;

      // Update nav button active states
      document.querySelectorAll('.settings-nav-btn').forEach(function (btn) {
        if (btn.getAttribute('data-section') === sectionName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update visible section card
      document.querySelectorAll('.settings-section-card').forEach(function (panel) {
        if (panel.getAttribute('id') === 'settings-sec-' + sectionName) {
          panel.style.display = 'flex';
        } else {
          panel.style.display = 'none';
        }
      });
    },

    render: function () {
      this.switchSection(activeSection);
      this.populateAccountFields();
      this.renderNotificationMatrix();
      this.renderActiveSessions();
      this.renderCareTeam();
      this.renderAuditTrail();
    },

    populateAccountFields: function () {
      var acc = (Safe2BiteData.settings && Safe2BiteData.settings.account) || Safe2BiteData.currentDoctor;
      if (!acc) return;

      var nameInput = document.getElementById('acc-field-name');
      var titleInput = document.getElementById('acc-field-title');
      var emailInput = document.getElementById('acc-field-email');
      var phoneInput = document.getElementById('acc-field-phone');
      var clinicInput = document.getElementById('acc-field-clinic');
      var licenseInput = document.getElementById('acc-field-license');
      var npiInput = document.getElementById('acc-field-npi');

      if (nameInput) nameInput.value = acc.displayName || acc.name || 'Dr. Sarah Chen';
      if (titleInput) titleInput.value = acc.role || acc.title || 'Allergist & Immunologist';
      if (emailInput) emailInput.value = acc.email || 's.chen@safe2bite.com';
      if (phoneInput) phoneInput.value = acc.phone || '(512) 555-0192';
      if (clinicInput) clinicInput.value = acc.clinic || 'Safe2Bite Allergy Care – Austin, TX';
      if (licenseInput) licenseInput.value = acc.licenseNumber || 'TX-MD84920';
      if (npiInput) npiInput.value = acc.npi || '1982736450';
    },

    handleSaveAccount: function () {
      var statusEl = document.getElementById('acc-save-status');
      var nameInput = document.getElementById('acc-field-name');
      var phoneInput = document.getElementById('acc-field-phone');
      var clinicInput = document.getElementById('acc-field-clinic');

      if (statusEl) {
        statusEl.innerHTML = '<span>Saving...</span>';
      }

      setTimeout(function () {
        if (Safe2BiteData.currentDoctor) {
          if (nameInput && nameInput.value) Safe2BiteData.currentDoctor.displayName = nameInput.value;
          if (phoneInput && phoneInput.value) Safe2BiteData.currentDoctor.phone = phoneInput.value;
          if (clinicInput && clinicInput.value) Safe2BiteData.currentDoctor.clinic = clinicInput.value;
        }

        isDirty = false;
        if (statusEl) {
          statusEl.innerHTML = '<span class="save-status-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>Changes saved successfully</span>';
          setTimeout(function () { statusEl.innerHTML = ''; }, 3000);
        }

        if (window.App && window.App.showNotification) {
          window.App.showNotification('Account profile updated', 'success');
        }
      }, 400);
    },

    handleChangePassword: function () {
      var currPass = document.getElementById('pass-current');
      var newPass = document.getElementById('pass-new');
      var confirmPass = document.getElementById('pass-confirm');

      if (!currPass || !newPass || !confirmPass) return;

      var n = newPass.value;
      var c = confirmPass.value;

      if (!n || n.length < 8) {
        if (window.App && window.App.showNotification) {
          window.App.showNotification('New password must be at least 8 characters long', 'error');
        }
        return;
      }

      if (n !== c) {
        if (window.App && window.App.showNotification) {
          window.App.showNotification('New password and confirmation do not match', 'error');
        }
        return;
      }

      currPass.value = '';
      newPass.value = '';
      confirmPass.value = '';

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Password updated successfully', 'success');
      }
    },

    handleSignOutOtherSessions: function () {
      var list = document.getElementById('active-sessions-container');
      if (!list) return;

      // Keep only current session
      if (Safe2BiteData.settings && Safe2BiteData.settings.security) {
        Safe2BiteData.settings.security.activeSessions = Safe2BiteData.settings.security.activeSessions.filter(function (s) {
          return s.isCurrent;
        });
      }

      this.renderActiveSessions();

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Signed out from 2 remote devices', 'info');
      }
    },

    renderActiveSessions: function () {
      var list = document.getElementById('active-sessions-container');
      if (!list) return;

      var sessions = (Safe2BiteData.settings && Safe2BiteData.settings.security && Safe2BiteData.settings.security.activeSessions) || [];
      var html = '';

      sessions.forEach(function (s) {
        html += [
          '<div class="session-row">',
            '<div>',
              '<strong>' + s.device + '</strong>',
              (s.isCurrent ? ' <span style="font-size:0.7rem;font-weight:700;color:#059669;">(Active Now)</span>' : ''),
              '<div style="font-size:0.725rem;color:#64748b;">' + s.location + ' &bull; IP ' + s.ip + '</div>',
            '</div>',
            '<div>',
              (s.isCurrent ? '<span style="font-size:0.75rem;color:#059669;font-weight:600;">Current Session</span>' : '<span style="font-size:0.75rem;color:#94a3b8;">Active ' + s.lastActive + '</span>'),
            '</div>',
          '</div>'
        ].join('');
      });

      list.innerHTML = html;
    },

    renderNotificationMatrix: function () {
      var tbody = document.getElementById('notif-matrix-body');
      if (!tbody) return;

      var events = (Safe2BiteData.settings && Safe2BiteData.settings.notifications && Safe2BiteData.settings.notifications.events) || [];
      var html = '';

      events.forEach(function (ev) {
        var lockedBadge = ev.locked ? '<span class="badge-locked-safety"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:3px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Safety Mandatory</span>' : '';
        var disabledAttr = ev.locked ? 'disabled checked' : '';

        html += [
          '<tr>',
            '<td>',
              '<span class="notif-event-label">' + ev.label + lockedBadge + '</span>',
              '<span class="notif-event-desc">' + ev.desc + '</span>',
            '</td>',
            '<td style="text-align:center;">',
              '<label class="switch-toggle">',
                '<input type="checkbox" ' + (ev.inApp ? 'checked' : '') + ' ' + disabledAttr + '>',
                '<span class="switch-slider"></span>',
              '</label>',
            '</td>',
            '<td style="text-align:center;">',
              '<label class="switch-toggle">',
                '<input type="checkbox" ' + (ev.email ? 'checked' : '') + ' ' + disabledAttr + '>',
                '<span class="switch-slider"></span>',
              '</label>',
            '</td>',
            '<td style="text-align:center;">',
              '<label class="switch-toggle">',
                '<input type="checkbox" ' + (ev.push ? 'checked' : '') + ' ' + disabledAttr + '>',
                '<span class="switch-slider"></span>',
              '</label>',
            '</td>',
          '</tr>'
        ].join('');
      });

      tbody.innerHTML = html;
    },

    renderCareTeam: function () {
      var tbody = document.getElementById('care-team-table-body');
      if (!tbody) return;

      var members = (Safe2BiteData.settings && Safe2BiteData.settings.careTeamMembers) || [];
      var html = '';

      members.forEach(function (m) {
        html += [
          '<tr>',
            '<td><strong>' + m.name + '</strong></td>',
            '<td><span class="report-cat-tag" style="background:#e0f2fe;color:#0369a1;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.7rem;font-weight:600;">' + m.role + '</span></td>',
            '<td>' + m.permissions + '</td>',
            '<td>' + m.panelCount + ' active patients</td>',
            '<td><span class="appt-badge confirmed">' + m.status + '</span></td>',
          '</tr>'
        ].join('');
      });

      tbody.innerHTML = html;
    },

    renderAuditTrail: function () {
      var list = document.getElementById('audit-trail-list');
      if (!list) return;

      var entries = (Safe2BiteData.settings && Safe2BiteData.settings.auditTrail) || [];
      var html = '';

      entries.forEach(function (e) {
        html += [
          '<div class="audit-trail-item">',
            '<div class="audit-item-meta">' + e.time + '</div>',
            '<div>',
              '<strong>' + e.user + '</strong> — ' + e.action,
            '</div>',
          '</div>'
        ].join('');
      });

      list.innerHTML = html;
    }
  };

  window.Settings = Settings;
})();
