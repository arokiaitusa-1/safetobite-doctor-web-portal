/* ============================================================
   Safe2Bite Doctor Web Portal — Reactions Module
   Cross-patient reaction reports directory.
   Data sourced from Safe2BiteData (sample-data.js).
   ============================================================ */

const Reactions = (() => {

  let _records = [];
  let _filtered = [];
  let _searchTerm   = '';
  let _filterStatus = 'all';
  let _filterSeverity = 'all';

  /* -----------------------------------------------
     Build reaction records from alerts + patient data
  ----------------------------------------------- */
  function buildRecords() {
    const alerts = Safe2BiteData.alerts || [];

    // Pull reaction-type alerts from the live alerts list
    const fromAlerts = alerts
      .filter(a => a.type === 'reaction-report')
      .map(a => ({
        id: a.id,
        patientId: a.patientId,
        patient: a.patientName,
        initials: a.patientInitials,
        avatarColor: a.avatarColor,
        protocol: a.treatmentProtocol,
        reportedDate: a.occurredLabel,
        symptoms: (a.eventDetails?.reportedSymptoms || []).join(', ') || 'Reaction reported',
        severity: a.severity,
        severityLabel: a.severityLabel,
        status: a.status,
        statusLabel: a.statusLabel,
        actionTaken: a.eventDetails?.emergencyCarePlanStep || '—',
        careTeam: a.assignedTo,
        source: a.source
      }));

    // Additional curated reaction records
    const additional = [
      {
        id: 'RXN-001', patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0,
        protocol: 'Peanut OIT — Phase 3',
        reportedDate: 'Sep 17, 2026 · 6:34 PM',
        symptoms: 'Mild localized hives on neck & upper chest',
        severity: 'high', severityLabel: 'High',
        status: 'under-review', statusLabel: 'Under Review',
        actionTaken: 'Oral Cetirizine 5 mg administered — resolved within 40 min',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
      {
        id: 'RXN-002', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0,
        protocol: 'Peanut OIT — Phase 3',
        reportedDate: 'Sep 09, 2026 · 10:30 AM',
        symptoms: 'No symptoms — routine cleared',
        severity: 'low', severityLabel: 'Low',
        status: 'resolved', statusLabel: 'Resolved',
        actionTaken: 'No action required',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
      {
        id: 'RXN-003', patientId: 'PT-20488', patient: 'Noah Patel', initials: 'NP', avatarColor: 7,
        protocol: 'Tree Nut OIT — Phase 2',
        reportedDate: 'Sep 14, 2026 · 2:10 PM',
        symptoms: 'Mild oral tingling after walnut dose',
        severity: 'medium', severityLabel: 'Medium',
        status: 'resolved', statusLabel: 'Resolved',
        actionTaken: 'Monitored at home — self-resolved within 20 minutes',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
      {
        id: 'RXN-004', patientId: 'PT-20395', patient: 'Marcus Vance', initials: 'MV', avatarColor: 2,
        protocol: 'Peanut OIT — Phase 2',
        reportedDate: 'Sep 17, 2026 · 9:12 AM',
        symptoms: 'Localized hives on torso and neck, mild lip itchiness',
        severity: 'critical', severityLabel: 'Critical',
        status: 'new', statusLabel: 'New',
        actionTaken: 'Antihistamine administered per emergency care plan (Step 1)',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
      {
        id: 'RXN-005', patientId: 'PT-20312', patient: 'Ava Thompson', initials: 'AT', avatarColor: 4,
        protocol: 'Wheat OIT — Phase 2',
        reportedDate: 'Sep 05, 2026 · 6:50 PM',
        symptoms: 'Mild abdominal discomfort 30 min post-dose',
        severity: 'medium', severityLabel: 'Medium',
        status: 'resolved', statusLabel: 'Resolved',
        actionTaken: 'Rest and hydration; resolved without medication',
        careTeam: 'Dr. Sarah Chen', source: 'Patient Mobile App'
      },
    ];

    // Merge — deduplicate by ID
    const existing = new Set(fromAlerts.map(r => r.id));
    const merged = [...fromAlerts, ...additional.filter(r => !existing.has(r.id))];
    _records = merged;
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
    if (_filterStatus !== 'all')   data = data.filter(r => r.status === _filterStatus);
    if (_filterSeverity !== 'all') data = data.filter(r => r.severity === _filterSeverity);

    _filtered = data;
  }

  /* -----------------------------------------------
     Badge helpers
  ----------------------------------------------- */
  function severityBadge(severity, label) {
    const map = {
      critical: 'rxn-sev-critical',
      high:     'rxn-sev-high',
      medium:   'rxn-sev-medium',
      low:      'rxn-sev-low'
    };
    return `<span class="rxn-badge ${map[severity] || 'rxn-sev-medium'}">${label}</span>`;
  }

  function statusBadge(status, label) {
    const map = {
      new:          'rxn-status-new',
      open:         'rxn-status-open',
      'under-review': 'rxn-status-review',
      resolved:     'rxn-status-resolved',
      dismissed:    'rxn-status-dismissed'
    };
    return `<span class="rxn-badge ${map[status] || 'rxn-status-open'}">${label}</span>`;
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
    el('rxn-kpi-total',   _records.length);
    el('rxn-kpi-new',     _records.filter(r => r.status === 'new').length);
    el('rxn-kpi-review',  _records.filter(r => r.status === 'under-review').length);
    el('rxn-kpi-critical',_records.filter(r => r.severity === 'critical' || r.severity === 'high').length);
  }

  function renderTable() {
    const tbody = document.getElementById('reactions-table-body');
    if (!tbody) return;

    if (_filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);">No reaction records match your filters.</td></tr>`;
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
            <div class="asmt-wellness-cell" style="max-width:220px;">${r.symptoms}</div>
            <div class="asmt-patient-sub" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.actionTaken}</div>
          </td>
          <td>${severityBadge(r.severity, r.severityLabel)}</td>
          <td>${statusBadge(r.status, r.statusLabel)}</td>
          <td><span class="asmt-careteam">${r.careTeam}</span></td>
          <td style="text-align:right">
            <button type="button" class="asmt-action-btn" onclick="Patients.viewPatient('${r.patientId || ''}', 'reactions')">
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
    const s = document.getElementById('rxn-search-input');
    if (s) s.addEventListener('input', () => { _searchTerm = s.value.trim(); applyFilters(); renderTable(); renderKPIs(); });

    const fs = document.getElementById('rxn-filter-status');
    if (fs) fs.addEventListener('change', () => { _filterStatus = fs.value; applyFilters(); renderTable(); renderKPIs(); });

    const fv = document.getElementById('rxn-filter-severity');
    if (fv) fv.addEventListener('change', () => { _filterSeverity = fv.value; applyFilters(); renderTable(); renderKPIs(); });

    const c = document.getElementById('rxn-clear-filters');
    if (c) c.addEventListener('click', resetFilters);
  }

  function resetFilters() {
    _searchTerm = ''; _filterStatus = 'all'; _filterSeverity = 'all';
    const s = document.getElementById('rxn-search-input');   if (s) s.value = '';
    const fs = document.getElementById('rxn-filter-status'); if (fs) fs.value = 'all';
    const fv = document.getElementById('rxn-filter-severity'); if (fv) fv.value = 'all';
    applyFilters(); renderTable(); renderKPIs();
  }

  function init() {
    wireControls();
    render();
  }

  return { init, render, resetFilters };

})();
