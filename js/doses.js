/* ============================================================
   Safe2Bite Doctor Web Portal — Doses Module
   Cross-patient dose schedule and history directory.
   Data sourced from Safe2BiteData (sample-data.js).
   ============================================================ */

const Doses = (() => {

  let _records = [];
  let _filtered = [];
  let _searchTerm = '';
  let _filterStatus = 'all';
  let _filterDate   = 'all';
  let _activeTab    = 'all'; // all | today | upcoming | history

  /* -----------------------------------------------
     Build flat dose records
  ----------------------------------------------- */
  function buildRecords() {
    // Use the centralized upcomingDoses + generate historical records
    const upcoming = Safe2BiteData.upcomingDoses || [];
    const patients  = Safe2BiteData.getPatients ? Safe2BiteData.getPatients() : (Safe2BiteData.patients || []);

    const mockDoses = [
      // Today — taken
      { id: 'D-001', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '12 mg Peanut Protein', doseNum: '#84', date: 'Sep 17, 2026', time: '8:05 AM', scheduledTime: '8:00 AM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      { id: 'D-002', patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '20 mg Peanut Protein', doseNum: '#74', date: 'Sep 17, 2026', time: '4:20 PM', scheduledTime: '4:00 PM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      { id: 'D-003', patientId: 'SB-00126', patient: 'Liam Okafor', initials: 'LO', avatarColor: 1, protocol: 'Tree Nut OIT', phase: 'Phase 1', dose: '6 mg Walnut Protein', doseNum: '#14', date: 'Sep 17, 2026', time: '—', scheduledTime: '8:00 AM', status: 'missed', statusLabel: 'Missed', verifiedBy: '—' },
      { id: 'D-004', patientId: 'SB-00127', patient: 'Sophia Nguyen', initials: 'SN', avatarColor: 5, protocol: 'Egg OIT', phase: 'Phase 2', dose: '15 mg Egg White Protein', doseNum: '#41', date: 'Sep 17, 2026', time: '—', scheduledTime: '8:00 AM', status: 'not_taken', statusLabel: 'On Hold', verifiedBy: 'Illness Hold' },
      { id: 'D-005', patientId: 'PT-20455', patient: 'Marcus Williams', initials: 'MW', avatarColor: 3, protocol: 'Dairy OIT', phase: 'Maintenance', dose: '200 mg Milk Protein', doseNum: '#312', date: 'Sep 17, 2026', time: '7:45 AM', scheduledTime: '7:30 AM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Patient Self-Report' },
      { id: 'D-006', patientId: 'PT-20412', patient: 'Liam Patel', initials: 'LP', avatarColor: 4, protocol: 'Cashew OIT', phase: 'Phase 1', dose: '8 mg Cashew Protein', doseNum: '#21', date: 'Sep 17, 2026', time: '—', scheduledTime: '7:00 AM', status: 'not_taken', statusLabel: 'Not Taken', verifiedBy: '—' },
      { id: 'D-007', patientId: 'PT-20312', patient: 'Ava Thompson', initials: 'AT', avatarColor: 4, protocol: 'Wheat OIT', phase: 'Phase 2', dose: '15 mg Wheat Protein', doseNum: '#32', date: 'Sep 17, 2026', time: '—', scheduledTime: '12:00 PM', status: 'not_taken', statusLabel: 'Not Taken', verifiedBy: 'Declined — Nausea' },
      { id: 'D-008', patientId: 'PT-20488', patient: 'Noah Patel', initials: 'NP', avatarColor: 7, protocol: 'Tree Nut OIT', phase: 'Phase 2', dose: '12 mg Walnut Protein', doseNum: '#56', date: 'Sep 17, 2026', time: '8:10 AM', scheduledTime: '8:00 AM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      // Yesterday
      { id: 'D-009', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '12 mg Peanut Protein', doseNum: '#83', date: 'Sep 16, 2026', time: '8:02 AM', scheduledTime: '8:00 AM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      { id: 'D-010', patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '20 mg Peanut Protein', doseNum: '#73', date: 'Sep 16, 2026', time: '4:10 PM', scheduledTime: '4:00 PM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      { id: 'D-011', patientId: 'SB-00126', patient: 'Liam Okafor', initials: 'LO', avatarColor: 1, protocol: 'Tree Nut OIT', phase: 'Phase 1', dose: '6 mg Walnut Protein', doseNum: '#13', date: 'Sep 16, 2026', time: '—', scheduledTime: '8:00 AM', status: 'missed', statusLabel: 'Missed', verifiedBy: '—' },
      { id: 'D-012', patientId: 'PT-20312', patient: 'Ava Thompson', initials: 'AT', avatarColor: 4, protocol: 'Wheat OIT', phase: 'Phase 2', dose: '15 mg Wheat Protein', doseNum: '#31', date: 'Sep 16, 2026', time: '—', scheduledTime: '12:00 PM', status: 'not_taken', statusLabel: 'Not Taken', verifiedBy: 'Declined — Nausea' },
      // Sep 15
      { id: 'D-013', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '12 mg Peanut Protein', doseNum: '#82', date: 'Sep 15, 2026', time: '8:08 AM', scheduledTime: '8:00 AM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      { id: 'D-014', patientId: 'SB-00127', patient: 'Sophia Nguyen', initials: 'SN', avatarColor: 5, protocol: 'Egg OIT', phase: 'Phase 2', dose: '15 mg Egg White Protein', doseNum: '#40', date: 'Sep 15, 2026', time: '8:05 AM', scheduledTime: '8:00 AM', status: 'taken', statusLabel: 'Taken', verifiedBy: 'Caregiver App' },
      // Upcoming
      { id: 'D-U01', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '12 mg Peanut Protein', doseNum: '#85', date: 'Sep 18, 2026', time: '—', scheduledTime: '8:00 AM', status: 'upcoming', statusLabel: 'Scheduled', verifiedBy: '—' },
      { id: 'D-U02', patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT', phase: 'Phase 3', dose: '20 mg Peanut Protein', doseNum: '#75', date: 'Sep 18, 2026', time: '—', scheduledTime: '8:30 AM', status: 'upcoming', statusLabel: 'Pending Review', verifiedBy: '—' },
      { id: 'D-U03', patientId: 'PT-20455', patient: 'Marcus Williams', initials: 'MW', avatarColor: 3, protocol: 'Dairy OIT', phase: 'Maintenance', dose: '200 mg Milk Protein', doseNum: '#313', date: 'Sep 18, 2026', time: '—', scheduledTime: '7:30 AM', status: 'upcoming', statusLabel: 'Scheduled', verifiedBy: '—' },
      { id: 'D-U04', patientId: 'PT-20488', patient: 'Noah Patel', initials: 'NP', avatarColor: 7, protocol: 'Tree Nut OIT', phase: 'Phase 2', dose: '12 mg Walnut Protein', doseNum: '#57', date: 'Sep 18, 2026', time: '—', scheduledTime: '8:00 AM', status: 'upcoming', statusLabel: 'Scheduled', verifiedBy: '—' },
    ];

    // Pad from patient directory to fill directory
    const existingIds = new Set(mockDoses.map(d => d.patientId));
    patients.filter(p => !existingIds.has(p.id)).slice(0, 12).forEach((p, i) => {
      const d = new Date('2026-09-17');
      d.setDate(d.getDate() - (i % 5));
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const status = p.doseStatus || 'taken';
      mockDoses.push({
        id: `D-GEN-${p.id}`,
        patientId: p.id,
        patient: p.name,
        initials: p.initials,
        avatarColor: p.avatarColor || 0,
        protocol: (p.treatmentLabel || 'OIT Protocol').split('—')[0].trim(),
        phase: (p.treatmentLabel || '— Phase 1').split('—')[1]?.trim() || 'Phase 1',
        dose: '10 mg Allergen Protein',
        doseNum: '#' + (50 + i),
        date: dateStr,
        time: status === 'taken' ? '8:10 AM' : '—',
        scheduledTime: '8:00 AM',
        status,
        statusLabel: p.doseStatusLabel || 'Taken',
        verifiedBy: status === 'taken' ? 'Caregiver App' : '—'
      });
    });

    _records = mockDoses;
  }

  /* -----------------------------------------------
     Filter & sort
  ----------------------------------------------- */
  function applyFilters() {
    let data = [..._records];

    if (_activeTab === 'today')    data = data.filter(r => r.date === 'Sep 17, 2026');
    if (_activeTab === 'upcoming') data = data.filter(r => r.status === 'upcoming');
    if (_activeTab === 'history')  data = data.filter(r => r.status !== 'upcoming' && r.date !== 'Sep 17, 2026');

    if (_searchTerm) {
      const q = _searchTerm.toLowerCase();
      data = data.filter(r =>
        r.patient.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.protocol.toLowerCase().includes(q) ||
        r.dose.toLowerCase().includes(q) ||
        r.doseNum.toLowerCase().includes(q)
      );
    }

    if (_filterStatus !== 'all') {
      data = data.filter(r => r.status === _filterStatus);
    }

    _filtered = data;
  }

  /* -----------------------------------------------
     Badge helper
  ----------------------------------------------- */
  function statusBadge(status, label) {
    const map = {
      taken:       'dose-badge-taken',
      missed:      'dose-badge-missed',
      not_taken:   'dose-badge-not-taken',
      upcoming:    'dose-badge-upcoming',
    };
    const cls = map[status] || 'dose-badge-upcoming';
    return `<span class="dose-badge ${cls}">${label}</span>`;
  }

  /* -----------------------------------------------
     Render
  ----------------------------------------------- */
  function render() {
    buildRecords();
    applyFilters();
    renderKPIs();
    renderTable();
    renderCountLabel();
  }

  function renderKPIs() {
    const todayRecs  = _records.filter(r => r.date === 'Sep 17, 2026');
    const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    el('dose-kpi-taken',    todayRecs.filter(r => r.status === 'taken').length);
    el('dose-kpi-missed',   todayRecs.filter(r => r.status === 'missed').length);
    el('dose-kpi-not-taken',todayRecs.filter(r => r.status === 'not_taken').length);
    el('dose-kpi-upcoming', _records.filter(r => r.status === 'upcoming').length);
  }

  function renderTable() {
    const tbody = document.getElementById('doses-table-body');
    if (!tbody) return;

    if (_filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);">No dose records match your filters.</td></tr>`;
      return;
    }

    const avatarColors = ['#0ea5e9','#14b8a6','#8b5cf6','#f59e0b','#ef4444','#10b981','#f97316','#6366f1'];

    tbody.innerHTML = _filtered.map(r => {
      const bg = avatarColors[r.avatarColor % avatarColors.length];
      return `
        <tr class="dose-table-row" data-patient-id="${r.patientId}">
          <td>
            <div class="asmt-patient-cell">
              <div class="asmt-avatar" style="background:${bg}">${r.initials}</div>
              <div class="asmt-patient-info">
                <div class="asmt-patient-name">${r.patient}</div>
                <div class="asmt-patient-sub">${r.patientId}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="asmt-type-label">${r.dose}</div>
            <div class="asmt-patient-sub">${r.doseNum}</div>
          </td>
          <td><div class="asmt-date-cell"><span class="asmt-date">${r.date}</span></div></td>
          <td>
            <div class="asmt-date-cell">
              <span class="asmt-date">Sched: ${r.scheduledTime}</span>
              <span class="asmt-time">${r.time !== '—' ? 'Taken: ' + r.time : '—'}</span>
            </div>
          </td>
          <td>${statusBadge(r.status, r.statusLabel)}</td>
          <td><span class="asmt-wellness-cell">${r.protocol}</span><span class="asmt-patient-sub"> ${r.phase}</span></td>
          <td style="text-align:right">
            <button type="button" class="asmt-action-btn" onclick="Patients.viewPatient('${r.patientId}', 'doses')">View</button>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('.dose-table-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const pid = row.dataset.patientId;
        if (pid && typeof PatientOverview !== 'undefined') {
          PatientOverview.loadPatient(pid, true);
        }
      });
    });
  }

  function renderCountLabel() {
    const el = document.getElementById('doses-results-label');
    if (el) el.textContent = `Showing ${_filtered.length} of ${_records.length} dose records`;
  }

  /* -----------------------------------------------
     Wire controls
  ----------------------------------------------- */
  function wireControls() {
    // Tab buttons
    document.querySelectorAll('[data-dose-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-dose-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _activeTab = btn.dataset.doseTab;
        applyFilters();
        renderTable();
        renderCountLabel();
      });
    });

    const searchEl = document.getElementById('doses-search-input');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        _searchTerm = searchEl.value.trim();
        applyFilters(); renderTable(); renderCountLabel();
      });
    }

    const statusEl = document.getElementById('doses-filter-status');
    if (statusEl) {
      statusEl.addEventListener('change', () => {
        _filterStatus = statusEl.value;
        applyFilters(); renderTable(); renderCountLabel();
      });
    }

    const clearEl = document.getElementById('doses-clear-filters');
    if (clearEl) {
      clearEl.addEventListener('click', resetFilters);
    }
  }

  function resetFilters() {
    _searchTerm = ''; _filterStatus = 'all'; _activeTab = 'all';
    const s = document.getElementById('doses-search-input');   if (s) s.value = '';
    const f = document.getElementById('doses-filter-status');  if (f) f.value = 'all';
    document.querySelectorAll('[data-dose-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.doseTab === 'all');
    });
    applyFilters(); renderTable(); renderCountLabel();
  }

  function init() {
    wireControls();
    render();
  }

  return { init, render, resetFilters };

})();
