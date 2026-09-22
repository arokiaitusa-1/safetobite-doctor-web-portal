/* ==========================================================================
   SAFE2BITE DOCTOR / CLINICAL WEB PORTAL
   PASS 7 — APPOINTMENTS CONTROLLER & DRAWER WORKFLOW
   ========================================================================== */

(function () {
  'use strict';

  var currentSearch = '';
  var statusFilter = 'all';
  var clinicianFilter = 'all';
  var typeFilter = 'all';
  var dateFilter = 'all';
  var selectedApptId = null;

  var Appointments = {
    init: function () {
      this.bindEvents();
      this.renderMetrics();
      this.renderTable();
    },

    bindEvents: function () {
      var self = this;

      // Search input
      var searchInput = document.getElementById('appt-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', function (e) {
          currentSearch = (e.target.value || '').trim().toLowerCase();
          self.renderTable();
        });
      }

      // Filter selects
      var statusSelect = document.getElementById('appt-filter-status');
      if (statusSelect) {
        statusSelect.addEventListener('change', function (e) {
          statusFilter = e.target.value;
          self.renderTable();
        });
      }

      var clinicianSelect = document.getElementById('appt-filter-clinician');
      if (clinicianSelect) {
        clinicianSelect.addEventListener('change', function (e) {
          clinicianFilter = e.target.value;
          self.renderTable();
        });
      }

      var typeSelect = document.getElementById('appt-filter-type');
      if (typeSelect) {
        typeSelect.addEventListener('change', function (e) {
          typeFilter = e.target.value;
          self.renderTable();
        });
      }

      var dateSelect = document.getElementById('appt-filter-date');
      if (dateSelect) {
        dateSelect.addEventListener('change', function (e) {
          dateFilter = e.target.value;
          self.renderTable();
        });
      }

      // Drawer close buttons
      var drawerBackdrop = document.getElementById('drawer-appointment-detail');
      var drawerCloseBtn = document.getElementById('btn-drawer-close');
      if (drawerCloseBtn && drawerBackdrop) {
        drawerCloseBtn.addEventListener('click', function () {
          drawerBackdrop.classList.remove('open');
        });
      }

      if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', function (e) {
          if (e.target === drawerBackdrop) {
            drawerBackdrop.classList.remove('open');
          }
        });
      }

      // Drawer action buttons
      var btnAddNote = document.getElementById('btn-drawer-save-note');
      if (btnAddNote) {
        btnAddNote.addEventListener('click', function () {
          self.handleSaveNote();
        });
      }

      var btnToggleReschedule = document.getElementById('btn-drawer-toggle-reschedule');
      var rescheduleBox = document.getElementById('drawer-reschedule-box');
      if (btnToggleReschedule && rescheduleBox) {
        btnToggleReschedule.addEventListener('click', function () {
          rescheduleBox.classList.toggle('hidden');
        });
      }

      var btnConfirmReschedule = document.getElementById('btn-confirm-reschedule');
      if (btnConfirmReschedule) {
        btnConfirmReschedule.addEventListener('click', function () {
          self.handleReschedule();
        });
      }

      // Cancel appointment modal
      var cancelModal = document.getElementById('modal-cancel-appointment');
      var btnCloseCancelModal = document.getElementById('btn-close-cancel-modal');
      var btnDismissCancelModal = document.getElementById('btn-dismiss-cancel-modal');
      var btnConfirmCancelAppt = document.getElementById('btn-confirm-cancel-appt');

      var closeCancelModal = function () {
        if (cancelModal) cancelModal.classList.remove('active');
      };

      if (btnCloseCancelModal) btnCloseCancelModal.addEventListener('click', closeCancelModal);
      if (btnDismissCancelModal) btnDismissCancelModal.addEventListener('click', closeCancelModal);

      if (btnConfirmCancelAppt) {
        btnConfirmCancelAppt.addEventListener('click', function () {
          self.handleCancelAppointment();
        });
      }

      // Schedule New Appointment button
      var btnNewAppt = document.getElementById('btn-schedule-new-appt');
      if (btnNewAppt) {
        btnNewAppt.addEventListener('click', function () {
          if (window.App && window.App.showNotification) {
            window.App.showNotification('Appointment booking schedule wizard simulated', 'info');
          }
        });
      }
    },

    renderMetrics: function () {
      var appts = Safe2BiteData.allAppointments || [];
      var todayCount = appts.filter(function (a) { return a.date === 'Today, Oct 14'; }).length;
      var upcomingCount = appts.filter(function (a) { return a.status === 'confirmed' || a.status === 'scheduled'; }).length;
      var completedCount = appts.filter(function (a) { return a.status === 'completed'; }).length;
      var cancelledCount = appts.filter(function (a) { return a.status === 'cancelled'; }).length;

      var elToday = document.getElementById('metric-appt-today');
      var elUpcoming = document.getElementById('metric-appt-upcoming');
      var elCompleted = document.getElementById('metric-appt-completed');
      var elCancelled = document.getElementById('metric-appt-cancelled');

      if (elToday) elToday.textContent = todayCount;
      if (elUpcoming) elUpcoming.textContent = upcomingCount;
      if (elCompleted) elCompleted.textContent = completedCount;
      if (elCancelled) elCancelled.textContent = cancelledCount;
    },

    getFilteredAppointments: function () {
      var appts = Safe2BiteData.allAppointments || [];
      return appts.filter(function (a) {
        // Status filter
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;

        // Clinician filter
        if (clinicianFilter !== 'all' && a.clinician !== clinicianFilter) return false;

        // Type filter
        if (typeFilter === 'in_person' && a.isVirtual) return false;
        if (typeFilter === 'virtual' && !a.isVirtual) return false;

        // Date filter
        if (dateFilter === 'today' && a.date !== 'Today, Oct 14') return false;
        if (dateFilter === 'upcoming' && (a.status === 'completed' || a.status === 'cancelled')) return false;

        // Search query
        if (currentSearch) {
          var name = (a.patientName || '').toLowerCase();
          var id = (a.patientId || '').toLowerCase();
          var clinician = (a.clinician || '').toLowerCase();
          var type = (a.type || '').toLowerCase();
          var reason = (a.reason || '').toLowerCase();
          var loc = (a.location || '').toLowerCase();
          var match = name.indexOf(currentSearch) !== -1 ||
                      id.indexOf(currentSearch) !== -1 ||
                      clinician.indexOf(currentSearch) !== -1 ||
                      type.indexOf(currentSearch) !== -1 ||
                      reason.indexOf(currentSearch) !== -1 ||
                      loc.indexOf(currentSearch) !== -1;
          if (!match) return false;
        }

        return true;
      });
    },

    renderTable: function () {
      var tableBody = document.getElementById('appt-table-body');
      var resultsCountEl = document.getElementById('appt-results-count');
      if (!tableBody) return;

      var appts = this.getFilteredAppointments();

      if (resultsCountEl) {
        resultsCountEl.textContent = 'Showing ' + appts.length + ' appointment' + (appts.length === 1 ? '' : 's');
      }

      if (appts.length === 0) {
        tableBody.innerHTML = [
          '<tr>',
            '<td colspan="7" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">',
              Icons.render('calendar', { size: 32 }),
              '<p style="margin: 0.5rem 0 0 0;">No appointments match your filters</p>',
            '</td>',
          '</tr>'
        ].join('');
        return;
      }

      var html = '';
      var self = this;

      appts.forEach(function (a) {
        var avatarInitials = a.patientName.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('').toUpperCase();
        var statusClass = a.status || 'scheduled';
        var statusLabel = (a.status || 'scheduled').replace('-', ' ').toUpperCase();

        var typeBadgeClass = a.isVirtual ? 'virtual' : 'in-person';
        var typeIcon = a.isVirtual ? Icons.render('video', { size: 12 }) : Icons.render('mapPin', { size: 12 });

        html += [
          '<tr data-id="' + a.id + '">',
            '<td data-label="Patient">',
              '<div class="appt-patient-cell">',
                '<div class="appt-avatar-sm">' + avatarInitials + '</div>',
                '<div>',
                  '<span class="appt-patient-name">' + a.patientName + '</span>',
                  '<span class="appt-patient-id">' + a.patientId + '</span>',
                '</div>',
              '</div>',
            '</td>',
            '<td data-label="Date & Time">',
              '<div><strong>' + a.date + '</strong></div>',
              '<div style="font-size: 0.75rem; color: #64748b;">' + a.time + ' (' + a.duration + ')</div>',
            '</td>',
            '<td data-label="Type">',
              '<div><strong>' + a.type + '</strong></div>',
              '<span class="appt-type-badge ' + typeBadgeClass + '">' + typeIcon + ' ' + (a.isVirtual ? 'Virtual' : 'In-Clinic') + '</span>',
            '</td>',
            '<td data-label="Clinician">',
              '<div>' + a.clinician + '</div>',
              '<div style="font-size: 0.72rem; color: #64748b;">' + a.location + '</div>',
            '</td>',
            '<td data-label="Status">',
              '<span class="appt-badge ' + statusClass + '">' + statusLabel + '</span>',
            '</td>',
            '<td data-label="Protocol Context">',
              '<div style="font-size: 0.78rem; font-weight: 600;">' + (a.protocol || 'Allergen OIT') + '</div>',
              '<div style="font-size: 0.72rem; color: #64748b;">' + (a.currentDose ? 'Dose: ' + a.currentDose : 'Initial intake') + '</div>',
            '</td>',
            '<td data-label="Actions">',
              '<div class="appt-actions-cell">',
                '<button class="appt-btn-action primary btn-view-appt" data-id="' + a.id + '">',
                  '<span>View</span>',
                '</button>',
                '<button class="appt-btn-action btn-reschedule-appt" data-id="' + a.id + '">',
                  '<span>Reschedule</span>',
                '</button>',
                a.status !== 'cancelled' ? [
                  '<button class="appt-btn-icon-only btn-cancel-appt" data-id="' + a.id + '" title="Cancel appointment">',
                    Icons.render('x', { size: 14 }),
                  '</button>'
                ].join('') : '',
              '</div>',
            '</td>',
          '</tr>'
        ].join('');
      });

      tableBody.innerHTML = html;

      // Bind action clicks
      tableBody.querySelectorAll('.btn-view-appt').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = btn.getAttribute('data-id');
          self.openAppointmentDetail(id);
        });
      });

      tableBody.querySelectorAll('.btn-reschedule-appt').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = btn.getAttribute('data-id');
          self.openAppointmentDetail(id);
          var rescheduleBox = document.getElementById('drawer-reschedule-box');
          if (rescheduleBox) rescheduleBox.classList.remove('hidden');
        });
      });

      tableBody.querySelectorAll('.btn-cancel-appt').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = btn.getAttribute('data-id');
          self.promptCancelAppointment(id);
        });
      });

      // Row click opens details
      tableBody.querySelectorAll('tr').forEach(function (row) {
        row.addEventListener('click', function () {
          var id = row.getAttribute('data-id');
          if (id) self.openAppointmentDetail(id);
        });
      });
    },

    openAppointmentDetail: function (apptId) {
      if (!apptId) return;
      selectedApptId = apptId;

      var appt = (Safe2BiteData.allAppointments || []).find(function (a) { return a.id === apptId; });
      if (!appt) return;

      var drawer = document.getElementById('drawer-appointment-detail');
      if (!drawer) return;

      // Populate Drawer Elements
      var titleEl = document.getElementById('drawer-appt-title');
      var statusBadgeEl = document.getElementById('drawer-appt-status-badge');
      if (titleEl) titleEl.textContent = appt.type;

      if (statusBadgeEl) {
        statusBadgeEl.className = 'appt-badge ' + appt.status;
        statusBadgeEl.textContent = (appt.status || 'scheduled').replace('-', ' ').toUpperCase();
      }

      // Patient Info Card
      var patientAvatar = document.getElementById('drawer-patient-avatar');
      var patientName = document.getElementById('drawer-patient-name');
      var patientMeta = document.getElementById('drawer-patient-meta');
      var btnViewPatient = document.getElementById('drawer-btn-view-patient');

      var initials = appt.patientName.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('').toUpperCase();
      if (patientAvatar) patientAvatar.textContent = initials;
      if (patientName) patientName.textContent = appt.patientName;
      if (patientMeta) patientMeta.textContent = appt.patientId + ' • ' + (appt.protocol || 'OIT Protocol') + ' • ' + (appt.currentDose || 'Initial');

      if (btnViewPatient) {
        btnViewPatient.onclick = function () {
          drawer.classList.remove('open');
          if (window.PatientOverview && window.PatientOverview.openPatient) {
            window.PatientOverview.openPatient(appt.patientId);
          } else if (window.App && window.App.navigateTo) {
            window.App.navigateTo('patient-overview');
          }
        };
      }

      // Grid items
      var dtDate = document.getElementById('drawer-item-date');
      var dtTime = document.getElementById('drawer-item-time');
      var dtClinician = document.getElementById('drawer-item-clinician');
      var dtLocation = document.getElementById('drawer-item-location');
      var dtReason = document.getElementById('drawer-item-reason');
      var dtProtocol = document.getElementById('drawer-item-protocol');

      if (dtDate) dtDate.textContent = appt.date;
      if (dtTime) dtTime.textContent = appt.time + ' (' + appt.duration + ')';
      if (dtClinician) dtClinician.textContent = appt.clinician;
      if (dtLocation) dtLocation.textContent = appt.location + (appt.isVirtual ? ' (Telehealth Link Sent)' : '');
      if (dtReason) dtReason.textContent = appt.reason;
      if (dtProtocol) dtProtocol.textContent = (appt.protocol || 'Allergen Protocol') + ' — Current: ' + (appt.currentDose || 'None');

      // Notes list
      this.renderDrawerNotes(appt);

      // Reschedule form reset
      var rescheduleBox = document.getElementById('drawer-reschedule-box');
      if (rescheduleBox) rescheduleBox.classList.add('hidden');

      // Message patient button in drawer
      var btnMsgPatient = document.getElementById('drawer-btn-message-patient');
      if (btnMsgPatient) {
        btnMsgPatient.onclick = function () {
          drawer.classList.remove('open');
          if (window.Messages && window.Messages.openConversationForPatient) {
            window.Messages.openConversationForPatient(appt.patientId);
          }
        };
      }

      // Cancel button in drawer
      var btnDrawerCancel = document.getElementById('drawer-btn-cancel-appt');
      if (btnDrawerCancel) {
        btnDrawerCancel.onclick = function () {
          self.promptCancelAppointment(appt.id);
        };
      }

      drawer.classList.add('open');
    },

    renderDrawerNotes: function (appt) {
      var notesList = document.getElementById('drawer-notes-list');
      if (!notesList) return;

      var notes = appt.clinicalNotes || [];
      if (notes.length === 0) {
        notesList.innerHTML = '<p style="font-size: 0.775rem; color: #94a3b8; margin: 0;">No clinical notes recorded yet.</p>';
        return;
      }

      var html = '';
      notes.forEach(function (n) {
        html += [
          '<div class="drawer-note-item">',
            '<div class="drawer-note-meta">' + (n.author || 'Dr. Sarah Chen') + ' &bull; ' + (n.date || 'Today') + '</div>',
            '<div>' + n.note + '</div>',
          '</div>'
        ].join('');
      });

      notesList.innerHTML = html;
    },

    handleSaveNote: function () {
      var textarea = document.getElementById('drawer-note-input');
      if (!textarea) return;

      var text = (textarea.value || '').trim();
      if (!text) {
        if (window.App && window.App.showNotification) {
          window.App.showNotification('Please enter a clinical note before saving', 'error');
        }
        return;
      }

      var appt = (Safe2BiteData.allAppointments || []).find(function (a) { return a.id === selectedApptId; });
      if (!appt) return;

      if (!appt.clinicalNotes) appt.clinicalNotes = [];
      appt.clinicalNotes.push({
        author: 'Dr. Sarah Chen',
        date: 'Today, Just now',
        note: text
      });

      textarea.value = '';
      this.renderDrawerNotes(appt);

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Clinical note added to appointment file', 'success');
      }
    },

    handleReschedule: function () {
      var dateInput = document.getElementById('reschedule-date-input');
      var timeInput = document.getElementById('reschedule-time-input');
      if (!dateInput || !timeInput) return;

      var newDate = dateInput.value;
      var newTime = timeInput.value;

      if (!newDate || !newTime) {
        if (window.App && window.App.showNotification) {
          window.App.showNotification('Please choose both a new date and time', 'error');
        }
        return;
      }

      var appt = (Safe2BiteData.allAppointments || []).find(function (a) { return a.id === selectedApptId; });
      if (!appt) return;

      appt.date = newDate;
      appt.time = newTime;
      appt.status = 'confirmed';

      if (!appt.clinicalNotes) appt.clinicalNotes = [];
      appt.clinicalNotes.push({
        author: 'Dr. Sarah Chen',
        date: 'Today, Just now',
        note: 'Appointment rescheduled to ' + newDate + ' at ' + newTime + '.'
      });

      // Update UI
      var rescheduleBox = document.getElementById('drawer-reschedule-box');
      if (rescheduleBox) rescheduleBox.classList.add('hidden');

      this.renderMetrics();
      this.renderTable();
      this.openAppointmentDetail(appt.id);

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Appointment successfully rescheduled', 'success');
      }
    },

    promptCancelAppointment: function (apptId) {
      selectedApptId = apptId;
      var appt = (Safe2BiteData.allAppointments || []).find(function (a) { return a.id === apptId; });
      if (!appt) return;

      var cancelModal = document.getElementById('modal-cancel-appointment');
      var nameEl = document.getElementById('cancel-modal-patient-name');
      var typeEl = document.getElementById('cancel-modal-appt-info');

      if (nameEl) nameEl.textContent = appt.patientName + ' (' + appt.patientId + ')';
      if (typeEl) typeEl.textContent = appt.type + ' • ' + appt.date + ' at ' + appt.time;

      if (cancelModal) cancelModal.classList.add('active');
    },

    handleCancelAppointment: function () {
      var reasonSelect = document.getElementById('cancel-modal-reason');
      var cancelModal = document.getElementById('modal-cancel-appointment');
      var drawer = document.getElementById('drawer-appointment-detail');

      var appt = (Safe2BiteData.allAppointments || []).find(function (a) { return a.id === selectedApptId; });
      if (!appt) return;

      var reason = reasonSelect ? reasonSelect.value : 'Patient requested cancellation';

      appt.status = 'cancelled';
      if (!appt.clinicalNotes) appt.clinicalNotes = [];
      appt.clinicalNotes.push({
        author: 'Dr. Sarah Chen',
        date: 'Today, Just now',
        note: 'Appointment cancelled. Reason: ' + reason
      });

      if (cancelModal) cancelModal.classList.remove('active');
      if (drawer) drawer.classList.remove('open');

      this.renderMetrics();
      this.renderTable();

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Appointment marked as cancelled', 'info');
      }
    }
  };

  window.Appointments = Appointments;
})();
