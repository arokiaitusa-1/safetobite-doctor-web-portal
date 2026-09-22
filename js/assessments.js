/* ============================================================
   Safe2Bite Doctor Web Portal — Assessments Module
   Cross-patient assessment directory and review workflow.
   Data sourced from Safe2BiteData (sample-data.js).
   ============================================================ */

const Assessments = (() => {

  /* -----------------------------------------------
     State
  ----------------------------------------------- */
  let _records = [];
  let _filtered = [];
  let _searchTerm = '';
  let _filterStatus = 'all';
  let _filterDate   = 'all';
  let _sortCol = 'date';
  let _sortDir = 'desc';

  /* -----------------------------------------------
     Build flat assessment records from patient data
  ----------------------------------------------- */
  function buildRecords() {
    const patients = Safe2BiteData.getPatients ? Safe2BiteData.getPatients() : (Safe2BiteData.patients || []);
    const rows = [];

    const mockAssessments = [
      // Detailed named assessments for the demo panel
      { patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 17, 2026', time: '9:30 AM', type: 'Daily Pre-Dose Health Check', wellness: 'Feeling Well', symptoms: 'None reported', status: 'completed', statusLabel: 'Completed', careTeam: 'Dr. Sarah Chen' },
      { patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 17, 2026', time: '4:15 PM', type: 'Daily Pre-Dose Health Check', wellness: 'Tired after reaction', symptoms: 'Mild urticaria on neck', status: 'requires_review', statusLabel: 'Requires Review', careTeam: 'Dr. Sarah Chen' },
      { patientId: 'SB-00126', patient: 'Liam Okafor', initials: 'LO', avatarColor: 1, protocol: 'Tree Nut OIT — Phase 1', date: 'Sep 17, 2026', time: 'Overdue', type: 'Daily Pre-Dose Health Check', wellness: 'Not submitted', symptoms: 'Unknown', status: 'not_submitted', statusLabel: 'Not Submitted', careTeam: 'Dr. Sarah Chen' },
      { patientId: 'SB-00127', patient: 'Sophia Nguyen', initials: 'SN', avatarColor: 5, protocol: 'Egg OIT — Phase 2', date: 'Sep 17, 2026', time: '8:15 AM', type: 'Illness Assessment', wellness: 'Mild fever & congestion', symptoms: '99.8°F, runny nose, fatigue', status: 'pending_review', statusLabel: 'Pending Review', careTeam: 'Nurse Elena Rostova' },
      { patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 16, 2026', time: '9:20 AM', type: 'Daily Pre-Dose Health Check', wellness: 'Feeling Well', symptoms: 'None', status: 'completed', statusLabel: 'Completed', careTeam: 'Dr. Sarah Chen' },
      { patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 16, 2026', time: '3:50 PM', type: 'Daily Pre-Dose Health Check', wellness: 'Feeling Well', symptoms: 'None', status: 'completed', statusLabel: 'Completed', careTeam: 'Dr. Sarah Chen' },
    ];

    // Augment with patients from directory (generates generic records for patients with assessments)
    patients.slice(0, 16).forEach((p, i) => {
      const exists = mockAssessments.some(a => a.patientId === p.id);
      if (!exists && p.assessmentStatus) {
        const d = new Date('2026-09-17');
        d.setDate(d.getDate() - (i % 4));
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        rows.push({
          patientId: p.id,
          patient: p.name,
          initials: p.initials,
          avatarColor: p.avatarColor || 0,
          protocol: p.treatmentLabel || 'OIT Protocol',
          date: dateStr,
          time: (p.assessmentStatus === 'completed') ? '8:30 AM' : (p.assessmentStatus === 'pending' ? 'Pending' : 'Overdue'),
          type: 'Daily Pre-Dose Health Check',
          wellness: p.assessmentStatus === 'completed' ? 'Feeling Well' : (p.assessmentStatus === 'pending' ? 'Awaiting Submission' : 'Not Submitted'),
          symptoms: p.assessmentStatus === 'completed' ? 'None reported' : 'Unknown',
          status: p.assessmentStatus || 'not_submitted',
          statusLabel: p.assessmentStatusLabel || 'Not Submitted',
          careTeam: p.careTeamLabel || 'Dr. Sarah Chen'
        });
      }
    });

    _records = [...mockAssessments, ...rows];
    return _records;
  }

  /* -----------------------------------------------
     Filter & sort
  ----------------------------------------------- */
  function applyFilters() {
    let data = [..._records];

    if (_searchTerm) {
      const q = _searchTerm.toLowerCase();
      data = data.filter(r =>
        r.patient.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.protocol.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.symptoms.toLowerCase().includes(q)
      );
    }

    if (_filterStatus !== 'all') {
      data = data.filter(r => r.status === _filterStatus);
    }

    if (_filterDate !== 'all') {
      const today = 'Sep 17, 2026';
      const yesterday = 'Sep 16, 2026';
      if (_filterDate === 'today')     data = data.filter(r => r.date === today);
      if (_filterDate === 'yesterday') data = data.filter(r => r.date === yesterday);
    }

    // Sort
    data.sort((a, b) => {
      let va = a[_sortCol] || '';
      let vb = b[_sortCol] || '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return _sortDir === 'asc' ? -1 : 1;
      if (va > vb) return _sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    _filtered = data;
    return data;
  }

  /* -----------------------------------------------
     Status badge helper
  ----------------------------------------------- */
  function statusBadge(status, label) {
    const map = {
      completed:       'asmt-badge-completed',
      requires_review: 'asmt-badge-review',
      pending_review:  'asmt-badge-review',
      pending:         'asmt-badge-pending',
      not_submitted:   'asmt-badge-missing',
    };
    const cls = map[status] || 'asmt-badge-pending';
    return `<span class="asmt-badge ${cls}">${label}</span>`;
  }

  /* -----------------------------------------------
     Render
  ----------------------------------------------- */
  function render() {
    buildRecords();
    applyFilters();
    renderTable();
    renderCounters();
  }

  function renderTable() {
    const tbody = document.getElementById('assessments-table-body');
    if (!tbody) return;

    if (_filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);">No assessments match your search or filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = _filtered.map(r => {
      const avatarColors = ['#0ea5e9','#14b8a6','#8b5cf6','#f59e0b','#ef4444','#10b981','#f97316','#6366f1'];
      const bgColor = avatarColors[r.avatarColor % avatarColors.length];
      return `
        <tr class="asmt-table-row" data-patient-id="${r.patientId}">
          <td>
            <div class="asmt-patient-cell">
              <div class="asmt-avatar" style="background:${bgColor}">${r.initials}</div>
              <div class="asmt-patient-info">
                <div class="asmt-patient-name">${r.patient}</div>
                <div class="asmt-patient-sub">${r.patientId}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="asmt-type-label">${r.type}</div>
          </td>
          <td>
            <div class="asmt-date-cell">
              <span class="asmt-date">${r.date}</span>
              <span class="asmt-time">${r.time}</span>
            </div>
          </td>
          <td>
            <div class="asmt-wellness-cell">${r.wellness}</div>
            <div class="asmt-symptoms">${r.symptoms}</div>
          </td>
          <td>${statusBadge(r.status, r.statusLabel)}</td>
          <td><span class="asmt-careteam">${r.careTeam}</span></td>
          <td style="text-align:right">
            <button type="button" class="asmt-action-btn" onclick="Patients.viewPatient('${r.patientId}', 'assessments')">
              ${r.status === 'requires_review' || r.status === 'pending_review' ? 'Review' : 'View'}
            </button>
          </td>
        </tr>`;
    }).join('');

    // Row click → patient profile
    tbody.querySelectorAll('.asmt-table-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const pid = row.dataset.patientId;
        if (pid && typeof PatientOverview !== 'undefined') {
          PatientOverview.loadPatient(pid, true);
        }
      });
    });
  }

  function renderCounters() {
    const total    = _records.length;
    const completed = _records.filter(r => r.status === 'completed').length;
    const review   = _records.filter(r => r.status === 'requires_review' || r.status === 'pending_review').length;
    const missing  = _records.filter(r => r.status === 'not_submitted').length;

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('asmt-count-total', total);
    el('asmt-count-completed', completed);
    el('asmt-count-review', review);
    el('asmt-count-missing', missing);
    el('asmt-results-label', `Showing ${_filtered.length} of ${total} assessments`);
  }

  /* -----------------------------------------------
     Wire filters
  ----------------------------------------------- */
  function wireFilters() {
    const searchEl = document.getElementById('asmt-search-input');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        _searchTerm = searchEl.value.trim();
        applyFilters();
        renderTable();
        renderCounters();
      });
    }

    const statusEl = document.getElementById('asmt-filter-status');
    if (statusEl) {
      statusEl.addEventListener('change', () => {
        _filterStatus = statusEl.value;
        applyFilters();
        renderTable();
        renderCounters();
      });
    }

    const dateEl = document.getElementById('asmt-filter-date');
    if (dateEl) {
      dateEl.addEventListener('change', () => {
        _filterDate = dateEl.value;
        applyFilters();
        renderTable();
        renderCounters();
      });
    }

    const clearEl = document.getElementById('asmt-clear-filters');
    if (clearEl) {
      clearEl.addEventListener('click', resetFilters);
    }
  }

  function resetFilters() {
    _searchTerm = '';
    _filterStatus = 'all';
    _filterDate = 'all';
    const s = document.getElementById('asmt-search-input');   if (s) s.value = '';
    const fs = document.getElementById('asmt-filter-status'); if (fs) fs.value = 'all';
    const fd = document.getElementById('asmt-filter-date');   if (fd) fd.value = 'all';
    applyFilters();
    renderTable();
    renderCounters();
  }

  /* -----------------------------------------------
     Init
  ----------------------------------------------- */
  function init() {
    wireFilters();
    render();
  }

  return { init, render, resetFilters };

})();
