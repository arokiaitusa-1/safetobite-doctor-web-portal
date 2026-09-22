/* ==========================================================================
   SAFE2BITE DOCTOR / CLINICAL WEB PORTAL
   PASS 8 — EDUCATION CONTROLLER & CLINICAL LIBRARY
   ========================================================================== */

(function () {
  'use strict';

  var searchQuery = '';
  var filterCategory = 'all';
  var filterAudience = 'all';
  var filterStatus = 'all';
  var selectedArticleId = null;

  var Education = {
    init: function () {
      this.bindEvents();
      this.render();
    },

    bindEvents: function () {
      var self = this;

      // Search
      var searchInput = document.getElementById('edu-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', function (e) {
          searchQuery = (e.target.value || '').trim().toLowerCase();
          self.render();
        });
      }

      // Filter selects
      var catSelect = document.getElementById('edu-filter-category');
      if (catSelect) {
        catSelect.addEventListener('change', function (e) {
          filterCategory = e.target.value;
          self.render();
        });
      }

      var audSelect = document.getElementById('edu-filter-audience');
      if (audSelect) {
        audSelect.addEventListener('change', function (e) {
          filterAudience = e.target.value;
          self.render();
        });
      }

      var statSelect = document.getElementById('edu-filter-status');
      if (statSelect) {
        statSelect.addEventListener('change', function (e) {
          filterStatus = e.target.value;
          self.render();
        });
      }

      // Reader Modal
      var modalDetail = document.getElementById('modal-education-detail');
      var btnCloseDetail = document.getElementById('btn-close-edu-detail');
      var btnDismissDetail = document.getElementById('btn-dismiss-edu-detail');

      var closeDetailModal = function () {
        if (modalDetail) modalDetail.classList.remove('active');
      };

      if (btnCloseDetail) btnCloseDetail.addEventListener('click', closeDetailModal);
      if (btnDismissDetail) btnDismissDetail.addEventListener('click', closeDetailModal);

      // Reader Edit action
      var btnEditFromReader = document.getElementById('btn-edu-edit-from-reader');
      if (btnEditFromReader) {
        btnEditFromReader.addEventListener('click', function () {
          closeDetailModal();
          self.openEditor(selectedArticleId);
        });
      }

      // Editor Modal
      var btnAddResource = document.getElementById('btn-add-education-resource');
      var modalEditor = document.getElementById('modal-education-editor');
      var btnCloseEditor = document.getElementById('btn-close-edu-editor');
      var btnCancelEditor = document.getElementById('btn-cancel-edu-editor');
      var formEditor = document.getElementById('form-education-editor');

      if (btnAddResource) {
        btnAddResource.addEventListener('click', function () {
          self.openEditor(null);
        });
      }

      var closeEditorModal = function () {
        if (modalEditor) modalEditor.classList.remove('active');
      };

      if (btnCloseEditor) btnCloseEditor.addEventListener('click', closeEditorModal);
      if (btnCancelEditor) btnCancelEditor.addEventListener('click', closeEditorModal);

      if (formEditor) {
        formEditor.addEventListener('submit', function (e) {
          e.preventDefault();
          self.handleSaveResource('published');
        });
      }

      var btnSaveDraft = document.getElementById('btn-edu-save-draft');
      if (btnSaveDraft) {
        btnSaveDraft.addEventListener('click', function () {
          self.handleSaveResource('draft');
        });
      }
    },

    getFilteredResources: function () {
      var list = Safe2BiteData.education || [];

      return list.filter(function (item) {
        // Category filter
        if (filterCategory !== 'all' && item.category !== filterCategory) {
          return false;
        }

        // Audience filter
        if (filterAudience !== 'all' && item.audience !== filterAudience) {
          return false;
        }

        // Status filter
        if (filterStatus !== 'all' && item.status !== filterStatus) {
          return false;
        }

        // Search query
        if (searchQuery) {
          var title = (item.title || '').toLowerCase();
          var summary = (item.summary || '').toLowerCase();
          var cat = (item.category || '').toLowerCase();
          var content = (item.content || '').toLowerCase();
          var match = title.indexOf(searchQuery) !== -1 ||
                      summary.indexOf(searchQuery) !== -1 ||
                      cat.indexOf(searchQuery) !== -1 ||
                      content.indexOf(searchQuery) !== -1;
          if (!match) return false;
        }

        return true;
      });
    },

    render: function () {
      var grid = document.getElementById('education-cards-grid');
      var emptyState = document.getElementById('education-empty-state');
      var counterText = document.getElementById('edu-results-count');

      if (!grid) return;

      var items = this.getFilteredResources();

      if (counterText) {
        counterText.textContent = 'Showing ' + items.length + ' educational resource' + (items.length === 1 ? '' : 's');
      }

      if (items.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }

      grid.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';

      var html = '';
      var self = this;

      items.forEach(function (item) {
        var audClass = item.audience.toLowerCase().replace(' ', '-');
        var statusClass = item.status;

        html += [
          '<div class="edu-resource-card" data-id="' + item.id + '">',
            '<div class="edu-card-top">',
              '<div class="edu-card-meta-row">',
                '<span class="edu-category-tag">' + item.category + '</span>',
                '<span class="edu-status-badge ' + statusClass + '">' + item.status + '</span>',
              '</div>',
              '<h3 class="edu-card-title">' + item.title + '</h3>',
              '<p class="edu-card-summary">' + item.summary + '</p>',
            '</div>',
            '<div class="edu-card-bottom">',
              '<span class="edu-audience-badge ' + audClass + '">',
                'Audience: <strong>' + item.audience + '</strong>',
              '</span>',
              '<span>' + item.lastUpdated + '</span>',
            '</div>',
          '</div>'
        ].join('');
      });

      grid.innerHTML = html;

      // Bind card clicks to open reader
      grid.querySelectorAll('.edu-resource-card').forEach(function (card) {
        card.addEventListener('click', function () {
          var id = card.getAttribute('data-id');
          self.openDetailReader(id);
        });
      });
    },

    openDetailReader: function (id) {
      selectedArticleId = id;
      var item = (Safe2BiteData.education || []).find(function (e) { return e.id === id; });
      if (!item) return;

      var modal = document.getElementById('modal-education-detail');
      var titleEl = document.getElementById('edu-reader-title');
      var catEl = document.getElementById('edu-reader-category');
      var audEl = document.getElementById('edu-reader-audience');
      var statusEl = document.getElementById('edu-reader-status');
      var authorEl = document.getElementById('edu-reader-author');
      var dateEl = document.getElementById('edu-reader-date');
      var contentEl = document.getElementById('edu-reader-content');

      if (titleEl) titleEl.textContent = item.title;
      if (catEl) catEl.textContent = item.category;
      if (audEl) audEl.textContent = 'Audience: ' + item.audience;
      if (statusEl) {
        statusEl.className = 'edu-status-badge ' + item.status;
        statusEl.textContent = item.status;
      }
      if (authorEl) authorEl.textContent = 'Author: ' + (item.updatedBy || 'Dr. Sarah Chen');
      if (dateEl) dateEl.textContent = item.lastUpdated;
      if (contentEl) contentEl.textContent = item.content;

      if (modal) modal.classList.add('active');
    },

    openEditor: function (id) {
      var modal = document.getElementById('modal-education-editor');
      var modalTitle = document.getElementById('edu-editor-modal-title');
      var inputTitle = document.getElementById('edu-edit-title');
      var selectCat = document.getElementById('edu-edit-category');
      var selectAud = document.getElementById('edu-edit-audience');
      var textareaContent = document.getElementById('edu-edit-content');

      if (!modal) return;

      if (id) {
        var item = (Safe2BiteData.education || []).find(function (e) { return e.id === id; });
        if (item) {
          if (modalTitle) modalTitle.textContent = 'Edit Educational Resource';
          if (inputTitle) inputTitle.value = item.title;
          if (selectCat) selectCat.value = item.category;
          if (selectAud) selectAud.value = item.audience;
          if (textareaContent) textareaContent.value = item.content;
          selectedArticleId = id;
        }
      } else {
        if (modalTitle) modalTitle.textContent = 'Create Clinician-Approved Resource';
        if (inputTitle) inputTitle.value = '';
        if (selectCat) selectCat.selectedIndex = 0;
        if (selectAud) selectAud.selectedIndex = 0;
        if (textareaContent) textareaContent.value = '';
        selectedArticleId = null;
      }

      modal.classList.add('active');
    },

    handleSaveResource: function (statusToSet) {
      var inputTitle = document.getElementById('edu-edit-title');
      var selectCat = document.getElementById('edu-edit-category');
      var selectAud = document.getElementById('edu-edit-audience');
      var textareaContent = document.getElementById('edu-edit-content');
      var modal = document.getElementById('modal-education-editor');

      if (!inputTitle || !textareaContent) return;

      var title = (inputTitle.value || '').trim();
      var category = selectCat ? selectCat.value : 'Daily Dosing';
      var audience = selectAud ? selectAud.value : 'Both';
      var content = (textareaContent.value || '').trim();

      if (!title || !content) {
        if (window.App && window.App.showNotification) {
          window.App.showNotification('Please provide both a title and resource content', 'error');
        }
        return;
      }

      if (selectedArticleId) {
        var existing = (Safe2BiteData.education || []).find(function (e) { return e.id === selectedArticleId; });
        if (existing) {
          existing.title = title;
          existing.category = category;
          existing.audience = audience;
          existing.content = content;
          existing.status = statusToSet;
          existing.lastUpdated = 'Today, Just now';
          existing.updatedBy = 'Dr. Sarah Chen';
          existing.summary = content.slice(0, 95) + '...';
        }
      } else {
        var newResource = {
          id: 'edu-' + Date.now(),
          title: title,
          category: category,
          audience: audience,
          status: statusToSet,
          lastUpdated: 'Today, Just now',
          updatedBy: 'Dr. Sarah Chen',
          summary: content.slice(0, 95) + '...',
          content: content
        };
        Safe2BiteData.education.unshift(newResource);
      }

      if (modal) modal.classList.remove('active');
      this.render();

      if (window.App && window.App.showNotification) {
        var actionLabel = statusToSet === 'published' ? 'published and accessible' : 'saved as draft';
        window.App.showNotification('Educational resource ' + actionLabel, 'success');
      }
    }
  };

  window.Education = Education;
})();
