/* ============================================================
   Safe2Bite Doctor Web Portal — Illness Module
   Cross-patient illness reports & dose-hold directory.
   Data sourced from Safe2BiteData (sample-data.js).
   ============================================================ */

const Illness = (() => {

  let _records = [];
  let _filtered = [];
  let _searchTerm   = '';
  let _filterStatus = 'all';
  let _filterHold   = 'all';

  /* -----------------------------------------------
     Build illness records
  ----------------------------------------------- */
  function buildRecords() {
    const alerts = Safe2BiteData.alerts || [];

    // Pull illness-type alerts
    const fromAlerts = alerts
      .filter(a => a.type === 'illness-report')
      .map(a => ({
        id: a.id,
        patientId: a.patientId,
        patient: a.patientName,
        initials: a.patientInitials,
        avatarColor: a.avatarColor,
        protocol: a.treatmentProtocol,
        reportedDate: a.occurredLabel,
        symptoms: (a.eventDetails?.reportedSymptoms || []).join(', ') || 'Illness reported',
        illnessStatus: a.eventDetails?.illnessStatus || '—',
        doseHeld: !!(a.eventDetails?.doseHeld),
        doseHeldLabel: a.eventDetails?.doseHeld || 'Unknown',
        status: a.status,
        statusLabel: a.statusLabel,
        severity: a.severity,
        severityLabel: a.severityLabel,
        careTeam: a.assignedTo,
        source: a.source
      }));

    // Additional curated records
    const additional = [
      {
        id: 'ILL-001', patientId: 'SB-00127', patient: 'Sophia Nguyen', initials: 'SN', avatarColor: 5,
        protocol: 'Egg OIT — Phase 2',
        reportedDate: 'Sep 17, 2026 · 8:15 AM',
        symptoms: 'Low-grade fever (99.8°F), runny nose, fatigue',
        illnessStatus: 'Active Illness — Dose Hold in Effect',
        doseHeld: true, doseHeldLabel: 'Morning dose withheld pending clinician review',
        status: 'under-review', statusLabel: 'Under Review',
        severity: 'medium', severityLabel: 'Medium',
        careTeam: 'Nurse Elena Rostova', source: 'Caregiver Portal'
      },
      {
        id: 'ILL-002', patientId: 'PT-20412', patient: 'Liam Patel', initials: 'LP', avatarColor: 4,
        protocol: 'Cashew OIT — Phase 1',
        reportedDate: 'Sep 17, 2026 · 7:45 AM',
        symptoms: 'Fever (101.4°F), vomiting once overnight, fatigue',
        illnessStatus: 'Active Illness — Treatment Hold Recommended',
        doseHeld: true, doseHeldLabel: 'Morning Dose #21 withheld by caregiver',
        status: 'new', statusLabel: 'New',
        severity: 'high', severityLabel: 'High',
        careTeam: 'Dr. Sarah Chen', source: 'Caregiver Portal'
      },
      {
        id: 'ILL-003', patientId: 'PT-20312', patient: 'Ava Thompson', initials: 'AT', avatarColor: 4,
        protocol: 'Wheat OIT — Phase 2',
        reportedDate: 'Sep 16, 2026 · 12:20 PM',
        symptoms: 'Stomach upset / mild nausea before dose',
        illnessStatus: 'Mild GI Upset — Dose Declined by Caregiver',
        doseHeld: true, doseHeldLabel: 'Dose #32 withheld by caregiver',
        status: 'open', statusLabel: 'Open',
        severity: 'medium', severityLabel: 'Medium',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
      {
        id: 'ILL-004', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0,
        protocol: 'Peanut OIT — Phase 3',
        reportedDate: 'Sep 01, 2026 · 7:00 AM',
        symptoms: 'Upper respiratory infection — moderate cold',
        illnessStatus: 'Resolved — Dose Schedule Resumed',
        doseHeld: false, doseHeldLabel: '2-day hold; cleared Sep 03',
        status: 'resolved', statusLabel: 'Resolved',
        severity: 'medium', severityLabel: 'Medium',
        careTeam: 'Dr. Sarah Chen', source: 'Caregiver Portal'
      },
      {
        id: 'ILL-005', patientId: 'PT-20488', patient: 'Noah Patel', initials: 'NP', avatarColor: 7,
        protocol: 'Tree Nut OIT — Phase 2',
        reportedDate: 'Aug 22, 2026 · 9:15 AM',
        symptoms: 'Seasonal allergies — rhinitis & mild congestion',
        illnessStatus: 'Resolved — Treated with Loratadine per plan',
        doseHeld: false, doseHeldLabel: 'No hold required — mild symptoms',
        status: 'resolved', statusLabel: 'Resolved',
        severity: 'low', severityLabel: 'Low',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
    ];

    const existingIds = new Set(fromAlerts.map(r => r.id));
    _records = [...fromAlerts, ...additional.filter(r => !existingIds.has(r.id))];
  }

  /* -----------------------------------------------
     Filter
  ----------------------------------------------- */
  function applyFilters() {
    let data = [..._records];

    if (_searchTerm) {
      const q = _searchTerm.toLowerCase();
      data = data.filter(r =>
        r.patient.toLowerCase().includes(q) ||
        (r.patientId || '').toLowerCase().includes(q) ||
        r.symptoms.toLowerCase().includes(q) ||
        r.protocol.toLowerCase().includes(q)
      );
    }
    if (_filterStatus !== 'all') data = data.filter(r => r.status === _filterStatus);
    if (_filterHold !== 'all')   data = data.filter(r => String(r.doseHeld) === _filterHold);

    _filtered = data;
  }

  /* -----------------------------------------------
     Badge helpers
  ----------------------------------------------- */
  function statusBadge(status, label) {
    const map = {
      new:           'ill-status-new',
      open:          'ill-status-open',
      'under-review':'ill-status-review',
      resolved:      'ill-status-resolved',
    };
    return `<span class="rxn-badge ${map[status] || 'ill-status-open'}">${label}</span>`;
  }

  function holdBadge(held) {
    if (held) return `<span class="rxn-badge rxn-sev-high">Dose On Hold</span>`;
    return `<span class="rxn-badge rxn-status-resolved">No Hold</span>`;
  }

  /* -----------------------------------------------
     Render
  ----------------------------------------------- */
  function render() {
    buildRecords();
    applyFilters();
    renderKPIs();
    renderTable();
  }

  function renderKPIs() {
    const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    el('ill-kpi-total',  _records.length);
    el('ill-kpi-active', _records.filter(r => r.status === 'new' || r.status === 'open' || r.status === 'under-review').length);
    el('ill-kpi-holds',  _records.filter(r => r.doseHeld).length);
    el('ill-kpi-resolved', _records.filter(r => r.status === 'resolved').length);
  }

  function renderTable() {
    const tbody = document.getElementById('illness-table-body');
    if (!tbody) return;

    if (_filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);">No illness records match your filters.</td></tr>`;
      return;
    }

    const avatarColors = ['#0ea5e9','#14b8a6','#8b5cf6','#f59e0b','#ef4444','#10b981','#f97316','#6366f1'];

    tbody.innerHTML = _filtered.map(r => {
      const bg = avatarColors[(r.avatarColor || 0) % avatarColors.length];
      return `
        <tr class="rxn-table-row" data-patient-id="${r.patientId || ''}">
          <td>
            <div class="asmt-patient-cell">
              <div class="asmt-avatar" style="background:${bg}">${r.initials}</div>
              <div class="asmt-patient-info">
                <div class="asmt-patient-name">${r.patient}</div>
                <div class="asmt-patient-sub">${r.patientId || ''}</div>
              </div>
            </div>
          </td>
          <td><div class="asmt-date-cell"><span class="asmt-date">${r.reportedDate}</span></div></td>
          <td>
            <div class="asmt-wellness-cell">${r.symptoms}</div>
            <div class="asmt-patient-sub">${r.illnessStatus}</div>
          </td>
          <td>${holdBadge(r.doseHeld)}</td>
          <td>${statusBadge(r.status, r.statusLabel)}</td>
          <td><span class="asmt-careteam">${r.careTeam}</span></td>
          <td style="text-align:right">
            <button type="button" class="asmt-action-btn" onclick="Patients.viewPatient('${r.patientId || ''}', 'illness')">
              ${r.status === 'new' || r.status === 'under-review' ? 'Review' : 'View'}
            </button>
          </td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('.rxn-table-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const pid = row.dataset.patientId;
        if (pid && typeof PatientOverview !== 'undefined') PatientOverview.loadPatient(pid, true);
      });
    });
  }

  /* -----------------------------------------------
     Wire controls
  ----------------------------------------------- */
  function wireControls() {
    const s = document.getElementById('ill-search-input');
    if (s) s.addEventListener('input', () => { _searchTerm = s.value.trim(); applyFilters(); renderTable(); renderKPIs(); });

    const fs = document.getElementById('ill-filter-status');
    if (fs) fs.addEventListener('change', () => { _filterStatus = fs.value; applyFilters(); renderTable(); renderKPIs(); });

    const fh = document.getElementById('ill-filter-hold');
    if (fh) fh.addEventListener('change', () => { _filterHold = fh.value; applyFilters(); renderTable(); renderKPIs(); });

    const c = document.getElementById('ill-clear-filters');
    if (c) c.addEventListener('click', resetFilters);
  }

  function resetFilters() {
    _searchTerm = ''; _filterStatus = 'all'; _filterHold = 'all';
    const s = document.getElementById('ill-search-input');   if (s) s.value = '';
    const fs = document.getElementById('ill-filter-status'); if (fs) fs.value = 'all';
    const fh = document.getElementById('ill-filter-hold');   if (fh) fh.value = 'all';
    applyFilters(); renderTable(); renderKPIs();
  }

  function init() {
    wireControls();
    render();
  }

  return { init, render, resetFilters };

})();
