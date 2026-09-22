/* ==========================================================================
   SAFE2BITE DOCTOR / CLINICAL WEB PORTAL
   PASS 7 — MESSAGES & CLINICAL COMMUNICATION CONTROLLER
   ========================================================================== */

(function () {
  'use strict';

  var currentFilter = 'all';
  var searchQuery = '';
  var activeConversationId = null;

  var Messages = {
    init: function () {
      this.bindEvents();
      this.renderFilterBadges();
      this.renderThreadList();
      
      // Select first conversation by default if available
      if (Safe2BiteData.conversations && Safe2BiteData.conversations.length > 0) {
        this.selectConversation(Safe2BiteData.conversations[0].id);
      }
    },

    bindEvents: function () {
      var self = this;

      // Filter tabs
      var filterTabs = document.querySelectorAll('.msg-tab-btn');
      filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          filterTabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          currentFilter = tab.getAttribute('data-filter') || 'all';
          self.renderThreadList();
        });
      });

      // Search input
      var searchInput = document.getElementById('msg-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', function (e) {
          searchQuery = (e.target.value || '').trim().toLowerCase();
          self.renderThreadList();
        });
      }

      // Composer Send button
      var sendBtn = document.getElementById('msg-send-btn');
      var composerInput = document.getElementById('msg-composer-textarea');
      if (sendBtn && composerInput) {
        sendBtn.addEventListener('click', function () {
          self.sendMessage();
        });

        composerInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            self.sendMessage();
          }
        });
      }

      // Quick templates
      var quickChips = document.querySelectorAll('.quick-template-chip');
      quickChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var text = chip.getAttribute('data-text') || chip.textContent.trim();
          if (composerInput) {
            composerInput.value = text;
            composerInput.focus();
          }
        });
      });

      // New Message modal triggers
      var newMsgBtn = document.getElementById('btn-new-message');
      var newMsgModal = document.getElementById('modal-new-message');
      var closeNewMsgBtn = document.getElementById('btn-close-new-msg');
      var cancelNewMsgBtn = document.getElementById('btn-cancel-new-msg');
      var sendNewMsgForm = document.getElementById('form-new-message');

      if (newMsgBtn && newMsgModal) {
        newMsgBtn.addEventListener('click', function () {
          self.populateNewMessageRecipients();
          newMsgModal.classList.add('active');
        });
      }

      var closeModal = function () {
        if (newMsgModal) newMsgModal.classList.remove('active');
      };

      if (closeNewMsgBtn) closeNewMsgBtn.addEventListener('click', closeModal);
      if (cancelNewMsgBtn) cancelNewMsgBtn.addEventListener('click', closeModal);

      if (sendNewMsgForm) {
        sendNewMsgForm.addEventListener('submit', function (e) {
          e.preventDefault();
          self.handleCreateNewMessage();
        });
      }
    },

    renderFilterBadges: function () {
      var convos = Safe2BiteData.conversations || [];
      var unreadCount = convos.filter(function (c) { return c.unreadCount > 0; }).length;
      var patientsCount = convos.filter(function (c) { return c.type === 'patient'; }).length;
      var teamCount = convos.filter(function (c) { return c.type === 'care_team'; }).length;
      var needsResponseCount = convos.filter(function (c) { return c.needsResponse; }).length;

      var badgeAll = document.getElementById('badge-msg-all');
      var badgeUnread = document.getElementById('badge-msg-unread');
      var badgePatients = document.getElementById('badge-msg-patients');
      var badgeTeam = document.getElementById('badge-msg-careteam');
      var badgeNeedsResp = document.getElementById('badge-msg-needsresponse');

      if (badgeAll) badgeAll.textContent = convos.length;
      if (badgeUnread) badgeUnread.textContent = unreadCount;
      if (badgePatients) badgePatients.textContent = patientsCount;
      if (badgeTeam) badgeTeam.textContent = teamCount;
      if (badgeNeedsResp) badgeNeedsResp.textContent = needsResponseCount;
    },

    getFilteredConversations: function () {
      var convos = Safe2BiteData.conversations || [];
      return convos.filter(function (c) {
        // Tab filter
        if (currentFilter === 'unread' && c.unreadCount === 0) return false;
        if (currentFilter === 'patient' && c.type !== 'patient') return false;
        if (currentFilter === 'care_team' && c.type !== 'care_team') return false;
        if (currentFilter === 'needs_response' && !c.needsResponse) return false;

        // Search query
        if (searchQuery) {
          var name = (c.participantName || '').toLowerCase();
          var pName = (c.patientName || '').toLowerCase();
          var pId = (c.patientId || '').toLowerCase();
          var role = (c.participantRole || '').toLowerCase();
          var lastMsg = (c.lastMessageSnippet || '').toLowerCase();
          var match = name.indexOf(searchQuery) !== -1 ||
                      pName.indexOf(searchQuery) !== -1 ||
                      pId.indexOf(searchQuery) !== -1 ||
                      role.indexOf(searchQuery) !== -1 ||
                      lastMsg.indexOf(searchQuery) !== -1;
          if (!match) return false;
        }

        return true;
      });
    },

    renderThreadList: function () {
      var listContainer = document.getElementById('messages-threads-container');
      if (!listContainer) return;

      var convos = this.getFilteredConversations();

      if (convos.length === 0) {
        listContainer.innerHTML = [
          '<div class="messages-empty-list">',
            Icons.render('messageSquare', { size: 32 }),
            '<p>No conversations found</p>',
          '</div>'
        ].join('');
        return;
      }

      var html = '';
      var self = this;

      convos.forEach(function (c) {
        var isActive = c.id === activeConversationId;
        var isUnread = c.unreadCount > 0;
        var avatarInitials = c.participantName.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('').toUpperCase();
        var typeClass = c.type === 'care_team' ? 'care_team' : 'patient';
        var typeLabel = c.type === 'care_team' ? 'Care Team' : 'Patient';

        var urgentBadge = c.needsResponse ? '<span class="msg-thread-tag urgent">Action Req</span>' : '';

        html += [
          '<li class="msg-thread-item ' + (isActive ? 'active' : '') + ' ' + (isUnread ? 'unread' : '') + '" data-id="' + c.id + '">',
            '<div class="msg-thread-avatar ' + typeClass + '">',
              avatarInitials,
              isUnread ? '<span class="unread-indicator-dot"></span>' : '',
            '</div>',
            '<div class="msg-thread-content">',
              '<div class="msg-thread-header">',
                '<span class="msg-thread-name">' + c.participantName + '</span>',
                '<span class="msg-thread-time">' + c.lastMessageTime + '</span>',
              '</div>',
              '<div class="msg-thread-meta">',
                '<span class="msg-thread-tag ' + typeClass + '">' + typeLabel + '</span>',
                urgentBadge,
                c.patientName && c.type === 'patient' ? '<span class="msg-thread-patient-detail">' + c.patientName + ' (' + c.patientId + ')</span>' : '',
              '</div>',
              '<div class="msg-thread-snippet">' + c.lastMessageSnippet + '</div>',
            '</div>',
          '</li>'
        ].join('');
      });

      listContainer.innerHTML = html;

      // Attach click handlers to items
      var items = listContainer.querySelectorAll('.msg-thread-item');
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          var id = item.getAttribute('data-id');
          self.selectConversation(id);
        });
      });
    },

    selectConversation: function (id) {
      activeConversationId = id;
      var convo = (Safe2BiteData.conversations || []).find(function (c) { return c.id === id; });
      if (!convo) return;

      // Mark as read
      if (convo.unreadCount > 0) {
        convo.unreadCount = 0;
        this.renderFilterBadges();
      }

      this.renderThreadList();
      this.renderActiveConversation(convo);
    },

    renderActiveConversation: function (convo) {
      var viewContainer = document.getElementById('active-conversation-pane');
      if (!viewContainer) return;

      var avatarInitials = convo.participantName.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('').toUpperCase();
      var typeClass = convo.type === 'care_team' ? 'care_team' : 'patient';

      // Patient profile button
      var profileBtnHtml = '';
      if (convo.patientId) {
        profileBtnHtml = [
          '<button class="btn-profile-link" id="msg-view-profile-btn" data-patient-id="' + convo.patientId + '">',
            Icons.render('user', { size: 14 }),
            '<span>View Patient Profile</span>',
          '</button>'
        ].join('');
      }

      // Patient banner if applicable
      var patientBannerHtml = '';
      if (convo.type === 'patient' && convo.patientProtocol) {
        patientBannerHtml = [
          '<div class="conversation-patient-banner">',
            '<div class="patient-banner-items">',
              '<span class="patient-banner-item">',
                Icons.render('clipboard', { size: 14 }),
                '<strong>Patient:</strong> ' + convo.patientName + ' (' + convo.patientId + ')',
              '</span>',
              '<span class="patient-banner-item">',
                Icons.render('activity', { size: 14 }),
                '<strong>Protocol:</strong> ' + convo.patientProtocol + ' &bull; ' + (convo.patientPhase || 'Active'),
              '</span>',
              convo.currentDose ? '<span class="patient-banner-item"><strong>Current Dose:</strong> ' + convo.currentDose + '</span>' : '',
            '</div>',
          '</div>'
        ].join('');
      }

      // Stream messages
      var streamHtml = '';
      var messages = convo.messages || [];
      var lastDate = '';

      messages.forEach(function (m) {
        // Date divider if date changed
        var msgDate = m.timestamp.split(',')[0] || 'Today';
        if (msgDate !== lastDate) {
          streamHtml += [
            '<div class="messages-date-divider">',
              '<span class="messages-date-text">' + msgDate + '</span>',
            '</div>'
          ].join('');
          lastDate = msgDate;
        }

        var isInbound = m.isInbound;
        var rowClass = isInbound ? 'inbound' : 'outbound';
        var senderRoleClass = m.senderRole || (isInbound ? 'patient' : 'doctor');
        var bubbleAvatar = m.sender.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('').toUpperCase();

        var attachmentHtml = '';
        if (m.attachment) {
          attachmentHtml = [
            '<div class="msg-bubble-attachment">',
              Icons.render('fileText', { size: 13 }),
              '<span>' + m.attachment + '</span>',
            '</div>'
          ].join('');
        }

        streamHtml += [
          '<div class="msg-bubble-row ' + rowClass + '">',
            '<div class="msg-bubble-avatar ' + senderRoleClass + '">' + bubbleAvatar + '</div>',
            '<div class="msg-bubble-body">',
              '<div class="msg-bubble-meta">',
                '<span class="msg-bubble-sender">' + m.sender + '</span>',
                '<span class="msg-bubble-time">' + m.timestamp + '</span>',
              '</div>',
              '<div class="msg-bubble-content">',
                m.content,
                attachmentHtml,
              '</div>',
            '</div>',
          '</div>'
        ].join('');
      });

      var fullHtml = [
        '<div class="conversation-header">',
          '<div class="conversation-participant-info">',
            '<div class="conversation-avatar ' + typeClass + '">' + avatarInitials + '</div>',
            '<div class="conversation-details">',
              '<div class="conversation-name-row">',
                '<h3 class="conversation-title">' + convo.participantName + '</h3>',
              '</div>',
              '<div class="conversation-subtext">',
                '<span>' + convo.participantRole + '</span>',
                '<span>&bull;</span>',
                '<span>' + (convo.type === 'care_team' ? 'Care Team Channel' : 'Patient Message Channel') + '</span>',
              '</div>',
            '</div>',
          '</div>',
          '<div class="conversation-header-actions">',
            profileBtnHtml,
          '</div>',
        '</div>',
        patientBannerHtml,
        '<div class="messages-stream-container" id="messages-stream-list">',
          streamHtml,
        '</div>',
        '<div class="messages-composer-area">',
          '<div class="composer-toolbar-top">',
            '<div class="composer-quick-templates">',
              '<button type="button" class="quick-template-chip" data-text="Dose confirmed. Please continue with your current routine.">Confirm Dose</button>',
              '<button type="button" class="quick-template-chip" data-text="Please hold today\'s dose and monitor symptoms closely. We will call you.">Hold Dose / Monitor</button>',
              '<button type="button" class="quick-template-chip" data-text="Let\'s schedule an in-clinic escalation check for this week.">Schedule Clinic Check</button>',
              '<button type="button" class="quick-template-chip" data-text="Lab results reviewed. Parameters look good to proceed.">Lab Results Good</button>',
            '</div>',
          '</div>',
          '<div class="composer-input-wrapper">',
            '<textarea class="composer-textarea" id="msg-composer-textarea" placeholder="Type a secure clinical message... (Enter to send, Shift+Enter for new line)" rows="1"></textarea>',
            '<div class="composer-actions-right">',
              '<button type="button" class="composer-btn-icon" title="Attach document or lab report" id="btn-msg-attach">',
                Icons.render('paperclip', { size: 16 }),
              '</button>',
              '<button type="button" class="composer-btn-send" id="msg-send-btn">',
                Icons.render('send', { size: 14 }),
                '<span>Send</span>',
              '</button>',
            '</div>',
          '</div>',
          '<div class="composer-status-hint">',
            '<span>Encrypted &bull; HIPAA Compliant Care Team Channel</span>',
            '<span>Shift + Enter for new line</span>',
          '</div>',
        '</div>'
      ].join('');

      viewContainer.innerHTML = fullHtml;

      // Scroll stream to bottom
      var streamList = document.getElementById('messages-stream-list');
      if (streamList) {
        streamList.scrollTop = streamList.scrollHeight;
      }

      // Re-bind composer and profile buttons
      var self = this;
      var newSendBtn = document.getElementById('msg-send-btn');
      var newComposerInput = document.getElementById('msg-composer-textarea');
      var profileBtn = document.getElementById('msg-view-profile-btn');
      var attachBtn = document.getElementById('btn-msg-attach');

      if (newSendBtn && newComposerInput) {
        newSendBtn.addEventListener('click', function () {
          self.sendMessage();
        });

        newComposerInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            self.sendMessage();
          }
        });
      }

      if (profileBtn) {
        profileBtn.addEventListener('click', function () {
          var pId = profileBtn.getAttribute('data-patient-id');
          if (window.PatientOverview && window.PatientOverview.openPatient) {
            window.PatientOverview.openPatient(pId);
          } else if (window.App && window.App.navigateTo) {
            window.App.navigateTo('patient-overview');
          }
        });
      }

      if (attachBtn) {
        attachBtn.addEventListener('click', function () {
          if (window.App && window.App.showNotification) {
            window.App.showNotification('File attachment dialog simulated. Attached: clinical-notes.pdf', 'info');
          }
        });
      }

      // Quick template chip listeners
      var chips = viewContainer.querySelectorAll('.quick-template-chip');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var text = chip.getAttribute('data-text');
          if (newComposerInput) {
            newComposerInput.value = text;
            newComposerInput.focus();
          }
        });
      });
    },

    sendMessage: function () {
      var composerInput = document.getElementById('msg-composer-textarea');
      if (!composerInput) return;

      var text = (composerInput.value || '').trim();
      if (!text) return;

      var convo = (Safe2BiteData.conversations || []).find(function (c) { return c.id === activeConversationId; });
      if (!convo) return;

      var newMsg = {
        id: 'msg-' + Date.now(),
        sender: 'Dr. Sarah Chen',
        senderRole: 'doctor',
        timestamp: 'Just now',
        content: text,
        isInbound: false
      };

      if (!convo.messages) convo.messages = [];
      convo.messages.push(newMsg);
      convo.lastMessageSnippet = 'Dr. Sarah Chen: ' + text;
      convo.lastMessageTime = 'Just now';
      convo.needsResponse = false; // Mark responded

      composerInput.value = '';

      this.renderThreadList();
      this.renderActiveConversation(convo);

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Message sent securely', 'success');
      }
    },

    openConversationForPatient: function (patientId) {
      if (!patientId) return;

      // Look for existing conversation with this patientId
      var convo = (Safe2BiteData.conversations || []).find(function (c) {
        return c.patientId === patientId;
      });

      if (!convo) {
        // Find patient in patients list to dynamically build a thread
        var patient = (Safe2BiteData.patients || []).find(function (p) {
          return p.id === patientId;
        });

        if (patient) {
          var newThread = {
            id: 'conv-' + (Safe2BiteData.conversations.length + 1),
            type: 'patient',
            participantName: patient.parentName || patient.name,
            participantRole: patient.parentName ? 'Mother of ' + patient.name : 'Patient',
            patientId: patient.id,
            patientName: patient.name,
            patientProtocol: patient.protocol || 'Allergen OIT',
            patientPhase: patient.phase || 'Phase 1',
            currentDose: patient.currentDose || 'Initial',
            lastMessageTime: 'Just now',
            lastMessageSnippet: 'New clinical communication initiated.',
            unreadCount: 0,
            needsResponse: false,
            messages: [
              {
                id: 'msg-' + Date.now(),
                sender: 'System Notice',
                senderRole: 'care_team',
                timestamp: 'Today',
                content: 'Secure clinical channel opened for ' + patient.name + ' (' + patient.id + ').',
                isInbound: true
              }
            ]
          };

          Safe2BiteData.conversations.unshift(newThread);
          convo = newThread;
        }
      }

      // Switch to Messages view
      if (window.App && window.App.navigateTo) {
        window.App.navigateTo('messages');
      }

      if (convo) {
        this.selectConversation(convo.id);
      }
    },

    populateNewMessageRecipients: function () {
      var select = document.getElementById('new-msg-recipient-select');
      if (!select) return;

      var html = '<option value="" disabled selected>-- Select a Patient or Care Team Member --</option>';

      html += '<optgroup label="Patients / Families">';
      (Safe2BiteData.patients || []).forEach(function (p) {
        html += '<option value="patient:' + p.id + '">' + p.name + ' (' + p.id + ') — ' + p.allergen + ' OIT</option>';
      });
      html += '</optgroup>';

      html += '<optgroup label="Care Team Members">';
      html += '<option value="team:elena">Nurse Elena Rostova (Lead Clinical Nurse)</option>';
      html += '<option value="team:michael">Dr. Michael Lee (Pediatric Allergist)</option>';
      html += '<option value="team:triage">Clinic Urgent Triage Desk</option>';
      html += '</optgroup>';

      select.innerHTML = html;
    },

    handleCreateNewMessage: function () {
      var select = document.getElementById('new-msg-recipient-select');
      var bodyInput = document.getElementById('new-msg-body');
      var modal = document.getElementById('modal-new-message');

      if (!select || !bodyInput) return;

      var recipientVal = select.value;
      var text = (bodyInput.value || '').trim();

      if (!recipientVal || !text) {
        if (window.App && window.App.showNotification) {
          window.App.showNotification('Please select a recipient and enter a message', 'error');
        }
        return;
      }

      var parts = recipientVal.split(':');
      var type = parts[0];
      var id = parts[1];

      if (type === 'patient') {
        this.openConversationForPatient(id);
        // Find current and send message
        var convo = (Safe2BiteData.conversations || []).find(function (c) { return c.patientId === id; });
        if (convo) {
          convo.messages.push({
            id: 'msg-' + Date.now(),
            sender: 'Dr. Sarah Chen',
            senderRole: 'doctor',
            timestamp: 'Just now',
            content: text,
            isInbound: false
          });
          convo.lastMessageSnippet = 'Dr. Sarah Chen: ' + text;
          convo.lastMessageTime = 'Just now';
          this.renderThreadList();
          this.renderActiveConversation(convo);
        }
      } else {
        // Care team
        var teamThread = (Safe2BiteData.conversations || []).find(function (c) { return c.type === 'care_team'; });
        if (teamThread) {
          teamThread.messages.push({
            id: 'msg-' + Date.now(),
            sender: 'Dr. Sarah Chen',
            senderRole: 'doctor',
            timestamp: 'Just now',
            content: text,
            isInbound: false
          });
          this.selectConversation(teamThread.id);
        }
      }

      bodyInput.value = '';
      if (modal) modal.classList.remove('active');

      if (window.App && window.App.showNotification) {
        window.App.showNotification('Conversation created and message dispatched', 'success');
      }
    }
  };

  window.Messages = Messages;
})();
