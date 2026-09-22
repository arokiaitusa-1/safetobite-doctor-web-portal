/* ============================================================
   Safe2Bite Doctor Web Portal — Food Intake Module
   Cross-patient food intake log directory.
   Data sourced from Safe2BiteData (sample-data.js).
   ============================================================ */

const FoodIntake = (() => {

  let _records = [];
  let _filtered = [];
  let _searchTerm = '';
  let _filterMeal = 'all';
  let _filterDate = 'all';

  /* -----------------------------------------------
     Build food intake records
  ----------------------------------------------- */
  function buildRecords() {
    const mockLogs = [
      // Sarah Johnson — Sep 17
      { id: 'FI-001', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 17, 2026', time: '7:15 AM', meal: 'Breakfast', description: 'Warm oatmeal with sliced bananas and a glass of water', notes: '50 min pre-dose. No peanut-containing foods.', dosingNote: 'Pre-dose meal — cleared', status: 'logged', statusLabel: 'Logged' },
      { id: 'FI-002', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 16, 2026', time: '7:20 AM', meal: 'Breakfast', description: 'Whole-grain toast with butter, orange juice', notes: 'Standard morning meal before dose.', dosingNote: 'Pre-dose meal — cleared', status: 'logged', statusLabel: 'Logged' },
      { id: 'FI-003', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 16, 2026', time: '8:10 PM', meal: 'Dinner', description: 'Grilled chicken with brown rice and broccoli', notes: 'Evening meal after afternoon dose.', dosingNote: 'Post-dose — no concerns', status: 'logged', statusLabel: 'Logged' },
      // Emma Vasquez — Sep 17
      { id: 'FI-004', patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 17, 2026', time: '3:30 PM', meal: 'Snack', description: 'Apple slices with sunbutter (peanut-free certified)', notes: '30 min before dose.', dosingNote: 'Pre-dose snack — cleared', status: 'logged', statusLabel: 'Logged' },
      { id: 'FI-005', patientId: 'SB-00125', patient: 'Emma Vasquez', initials: 'EV', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 16, 2026', time: '3:45 PM', meal: 'Snack', description: 'Rice cakes with hummus', notes: 'Standard pre-dose snack.', dosingNote: 'Pre-dose snack — cleared', status: 'logged', statusLabel: 'Logged' },
      // Liam Okafor — Sep 17 (no entry)
      { id: 'FI-006', patientId: 'SB-00126', patient: 'Liam Okafor', initials: 'LO', avatarColor: 1, protocol: 'Tree Nut OIT — Phase 1', date: 'Sep 17, 2026', time: '—', meal: '—', description: 'No food log submitted', notes: 'Family traveling; dose missed.', dosingNote: 'No dose — no food log', status: 'not_logged', statusLabel: 'Not Logged' },
      // Sophia Nguyen — Sep 17 (illness)
      { id: 'FI-007', patientId: 'SB-00127', patient: 'Sophia Nguyen', initials: 'SN', avatarColor: 5, protocol: 'Egg OIT — Phase 2', date: 'Sep 17, 2026', time: '8:00 AM', meal: 'Breakfast', description: 'Chicken noodle soup and warm chamomile tea with honey', notes: 'Light dietary intake during illness.', dosingNote: 'Dose on hold — illness', status: 'logged', statusLabel: 'Logged' },
      // Marcus Williams
      { id: 'FI-008', patientId: 'PT-20455', patient: 'Marcus Williams', initials: 'MW', avatarColor: 3, protocol: 'Dairy OIT — Maintenance', date: 'Sep 17, 2026', time: '7:00 AM', meal: 'Breakfast', description: 'Scrambled eggs with toast, black coffee', notes: '30 min before maintenance dairy dose.', dosingNote: 'Pre-dose — cleared', status: 'logged', statusLabel: 'Logged' },
      // Liam Patel
      { id: 'FI-009', patientId: 'PT-20412', patient: 'Liam Patel', initials: 'LP', avatarColor: 4, protocol: 'Cashew OIT — Phase 1', date: 'Sep 17, 2026', time: '6:30 AM', meal: 'Breakfast', description: 'Dry cereal and water', notes: 'Light meal; feeling unwell.', dosingNote: 'Dose held — illness hold', status: 'logged', statusLabel: 'Logged' },
      // Noah Patel
      { id: 'FI-010', patientId: 'PT-20488', patient: 'Noah Patel', initials: 'NP', avatarColor: 7, protocol: 'Tree Nut OIT — Phase 2', date: 'Sep 17, 2026', time: '7:45 AM', meal: 'Breakfast', description: 'Pancakes with maple syrup and orange juice', notes: '15 min pre-dose. No nut-containing foods.', dosingNote: 'Pre-dose meal — cleared', status: 'logged', statusLabel: 'Logged' },
      // Ava Thompson
      { id: 'FI-011', patientId: 'PT-20312', patient: 'Ava Thompson', initials: 'AT', avatarColor: 4, protocol: 'Wheat OIT — Phase 2', date: 'Sep 16, 2026', time: '11:30 AM', meal: 'Lunch', description: 'Half a grilled cheese sandwich (before stomach upset)', notes: 'Stomach ache developed; dose withheld.', dosingNote: 'Dose declined — nausea', status: 'flagged', statusLabel: 'Flagged' },
      // Additional historical
      { id: 'FI-012', patientId: 'SB-00124', patient: 'Sarah Johnson', initials: 'SJ', avatarColor: 0, protocol: 'Peanut OIT — Phase 3', date: 'Sep 15, 2026', time: '7:30 AM', meal: 'Breakfast', description: 'Yogurt with blueberries and honey', notes: '45 min pre-dose.', dosingNote: 'Pre-dose meal — cleared', status: 'logged', statusLabel: 'Logged' },
      { id: 'FI-013', patientId: 'SB-00127', patient: 'Sophia Nguyen', initials: 'SN', avatarColor: 5, protocol: 'Egg OIT — Phase 2', date: 'Sep 15, 2026', time: '7:15 AM', meal: 'Breakfast', description: 'Waffles with strawberry jam', notes: 'Routine pre-dose meal.', dosingNote: 'Pre-dose meal — cleared', status: 'logged', statusLabel: 'Logged' },
    ];

    _records = mockLogs;
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
        r.description.toLowerCase().includes(q) ||
        r.meal.toLowerCase().includes(q) ||
        r.protocol.toLowerCase().includes(q)
      );
    }

    if (_filterMeal !== 'all') data = data.filter(r => r.meal.toLowerCase() === _filterMeal);
    if (_filterDate !== 'all') {
      const map = { today: 'Sep 17, 2026', yesterday: 'Sep 16, 2026' };
      const targetDate = map[_filterDate];
      if (targetDate) data = data.filter(r => r.date === targetDate);
    }

    _filtered = data;
  }

  /* -----------------------------------------------
     Badge helpers
  ----------------------------------------------- */
  function mealIcon(meal) {
    const m = (meal || '').toLowerCase();
    if (m === 'breakfast') return '🌅';
    if (m === 'lunch')     return '☀️';
    if (m === 'dinner')    return '🌙';
    if (m === 'snack')     return '🍎';
    return '🍽️';
  }

  function statusBadge(status, label) {
    const map = {
      logged:     'rxn-status-resolved',
      flagged:    'rxn-sev-high',
      not_logged: 'ill-status-new',
    };
    return `<span class="rxn-badge ${map[status] || 'rxn-status-resolved'}">${label}</span>`;
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
    const today = _records.filter(r => r.date === 'Sep 17, 2026');
    const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    el('fi-kpi-total',      _records.length);
    el('fi-kpi-today',      today.filter(r => r.status === 'logged').length);
    el('fi-kpi-missing',    today.filter(r => r.status === 'not_logged').length);
    el('fi-kpi-flagged',    _records.filter(r => r.status === 'flagged').length);
  }

  function renderTable() {
    const tbody = document.getElementById('food-intake-table-body');
    if (!tbody) return;

    if (_filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);">No food intake records match your filters.</td></tr>`;
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
          <td>
            <div class="asmt-date-cell">
              <span class="asmt-date">${r.date}</span>
              <span class="asmt-time">${r.time}</span>
            </div>
          </td>
          <td>
            <span style="font-size:1.1rem;margin-right:0.35rem;">${mealIcon(r.meal)}</span>
            <span class="asmt-type-label">${r.meal}</span>
          </td>
          <td>
            <div class="asmt-wellness-cell">${r.description}</div>
            <div class="asmt-patient-sub">${r.notes}</div>
          </td>
          <td>
            <div class="asmt-patient-sub fi-dose-note">${r.dosingNote}</div>
          </td>
          <td>${statusBadge(r.status, r.statusLabel)}</td>
          <td style="text-align:right">
            <button type="button" class="asmt-action-btn" onclick="Patients.viewPatient('${r.patientId || ''}', 'food-intake')">View</button>
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
    const s = document.getElementById('fi-search-input');
    if (s) s.addEventListener('input', () => { _searchTerm = s.value.trim(); applyFilters(); renderTable(); renderKPIs(); });

    const fm = document.getElementById('fi-filter-meal');
    if (fm) fm.addEventListener('change', () => { _filterMeal = fm.value; applyFilters(); renderTable(); renderKPIs(); });

    const fd = document.getElementById('fi-filter-date');
    if (fd) fd.addEventListener('change', () => { _filterDate = fd.value; applyFilters(); renderTable(); renderKPIs(); });

    const c = document.getElementById('fi-clear-filters');
    if (c) c.addEventListener('click', resetFilters);
  }

  function resetFilters() {
    _searchTerm = ''; _filterMeal = 'all'; _filterDate = 'all';
    const s = document.getElementById('fi-search-input');  if (s) s.value = '';
    const fm = document.getElementById('fi-filter-meal');  if (fm) fm.value = 'all';
    const fd = document.getElementById('fi-filter-date');  if (fd) fd.value = 'all';
    applyFilters(); renderTable(); renderKPIs();
  }

  function init() {
    wireControls();
    render();
  }

  return { init, render, resetFilters };

})();
