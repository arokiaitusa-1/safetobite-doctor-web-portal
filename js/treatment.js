/* ============================================================
   Safe2Bite Doctor Web Portal — Pass 5: Treatment & Dosage Management
   Controller & Clinical Workflow Engine
   ============================================================ */

const Treatment = (() => {

  // Current user role state ('doctor' | 'care_team')
  let currentRole = 'doctor'; // Default role
  let currentPatientId = null;
  let activeFilter = 'all';
  let searchQuery = '';

  // Multi-step Adjust Treatment Modal State
  let adjustStep = 1;
  let adjustData = {
    patientId: null,
    newDose: '',
    effectiveDate: '',
    effectiveTime: 'Morning (8:00 AM)',
    frequency: 'Once Daily (Morning)',
    instructions: '',
    reason: ''
  };

  /* --------------------------------------------------
     Rich Clinical Mock Data Store for Pass 5
     (Synchronized with Patient Clinical Overview)
     -------------------------------------------------- */
  const treatmentStore = {
    'SB-00124': {
      patientId: 'SB-00124',
      name: 'Marcus Vance',
      age: 7,
      dob: 'Nov 12, 2018',
      gender: 'Male',
      initials: 'MV',
      avatarColor: 'blue',
      careTeam: 'Safe2Bite Allergy Care Team · Austin, TX',
      assignedDoctor: 'Dr. Sarah Chen, MD (Allergist & Immunologist)',
      treatmentType: 'Food Allergy Oral Immunotherapy (OIT)',
      allergen: 'Peanut Protein (Arachis hypogaea)',
      status: 'active',
      statusLabel: 'Active',
      statusClass: 'badge-treat-active',
      currentPhase: 'Phase 3 — Dose Escalation',
      currentDose: '12 mg Peanut Protein',
      targetDose: '300 mg Peanut Protein (Maintenance Goal)',
      frequency: 'Once Daily (Morning with meal)',
      administrationInstructions: 'Administer with a carbohydrate/fat-rich vehicle (applesauce or oatmeal). Observe patient for 2 full hours post-dose. No exercise, hot showers, or sports for 2 hours post-administration.',
      startDate: 'March 14, 2026',
      lastUpdated: 'Sep 10, 2026 by Dr. Sarah Chen',
      adherenceRate: '98.4%',
      clinicianNotes: 'Patient completed 12 mg escalation challenge in clinic on Sep 10 without reaction. Cleared for continued daily home maintenance build-up.',
      missedDoseInstructions: 'CLINICIAN-CONFIGURED PROTOCOL: If dose is delayed by >4 hours, do not administer a double dose. Skip the delayed dose and administer standard 12 mg dose the following morning. If >2 consecutive doses are missed, contact clinic before resumption.',
      upcomingDoses: [
        {
          id: 'DOSE-1092',
          date: 'Tomorrow, Sep 18, 2026',
          time: '8:00 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Scheduled',
          statusClass: 'badge-dose-upcoming',
          instructions: 'Administer with breakfast vehicle. Observe 2 hours post-dose.',
          verifiedBy: 'Pending Caregiver Administration'
        },
        {
          id: 'DOSE-1093',
          date: 'Saturday, Sep 19, 2026',
          time: '8:00 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Scheduled',
          statusClass: 'badge-dose-upcoming',
          instructions: 'Administer with breakfast vehicle. Observe 2 hours post-dose.',
          verifiedBy: 'Pending Caregiver Administration'
        },
        {
          id: 'DOSE-1094',
          date: 'Sunday, Sep 20, 2026',
          time: '8:00 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Scheduled',
          statusClass: 'badge-dose-upcoming',
          instructions: 'Administer with breakfast vehicle. Observe 2 hours post-dose.',
          verifiedBy: 'Pending Caregiver Administration'
        }
      ],
      doseHistory: [
        {
          id: 'DOSE-1091',
          date: 'Today, Sep 17, 2026',
          time: '8:15 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Photo Logged',
          notes: 'Administered with whole grain applesauce. No oral pruritus or systemic symptoms observed during 2h window.'
        },
        {
          id: 'DOSE-1090',
          date: 'Yesterday, Sep 16, 2026',
          time: '8:10 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Timed Log',
          notes: 'Taken normally with breakfast oatmeal. Mild scratchy throat reported for 3 minutes, resolved spontaneously.'
        },
        {
          id: 'DOSE-1089',
          date: 'Sep 15, 2026',
          time: '8:05 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Timed Log',
          notes: 'Standard morning dose. Well tolerated.'
        },
        {
          id: 'DOSE-1088',
          date: 'Sep 14, 2026',
          time: '8:20 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Photo Logged',
          notes: 'Patient in good spirits, no complaints.'
        },
        {
          id: 'DOSE-1087',
          date: 'Sep 13, 2026',
          time: '12:45 PM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Missed',
          statusClass: 'badge-dose-missed',
          confirmationMethod: 'Patient Caregiver Logged Delayed',
          notes: 'Family morning schedule conflict. Delayed >4 hours; caregiver followed missed-dose protocol and skipped morning dose.'
        },
        {
          id: 'DOSE-1086',
          date: 'Sep 12, 2026',
          time: '8:15 AM',
          food: 'Peanut Protein',
          doseAmount: '12 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Timed Log',
          notes: 'Taken with breakfast. Normal tolerance.'
        }
      ],
      recentChanges: [
        {
          id: 'CHG-301',
          date: 'Sep 10, 2026 · 10:15 AM',
          type: 'Dose Escalation',
          previousValue: '6 mg Peanut Protein',
          newValue: '12 mg Peanut Protein',
          effectiveDate: 'Sep 10, 2026',
          clinician: 'Dr. Sarah Chen, MD',
          reason: 'In-clinic escalation challenge passed successfully. Patient observed 2 hours with zero adverse symptoms.',
          status: 'Active'
        },
        {
          id: 'CHG-288',
          date: 'Aug 14, 2026 · 09:30 AM',
          type: 'Dose Escalation',
          previousValue: '3 mg Peanut Protein',
          newValue: '6 mg Peanut Protein',
          effectiveDate: 'Aug 14, 2026',
          clinician: 'Dr. Sarah Chen, MD',
          reason: 'Scheduled monthly titration phase increment.',
          status: 'Completed'
        }
      ],
      auditTrail: [
        {
          timestamp: 'Sep 10, 2026 10:15:22 AM',
          clinician: 'Dr. Sarah Chen, MD (SC)',
          action: 'Dose Escalation Authorized',
          previousValue: '6 mg Peanut Protein',
          newValue: '12 mg Peanut Protein',
          effectiveDate: 'Sep 10, 2026',
          reason: 'In-clinic escalation challenge passed successfully.',
          status: 'Authorized & Applied'
        },
        {
          timestamp: 'Aug 14, 2026 09:32:01 AM',
          clinician: 'Dr. Sarah Chen, MD (SC)',
          action: 'Dose Escalation Authorized',
          previousValue: '3 mg Peanut Protein',
          newValue: '6 mg Peanut Protein',
          effectiveDate: 'Aug 14, 2026',
          reason: 'Scheduled monthly build-up step.',
          status: 'Completed'
        },
        {
          timestamp: 'March 14, 2026 11:00:15 AM',
          clinician: 'Dr. Sarah Chen, MD (SC)',
          action: 'Treatment Protocol Initiated',
          previousValue: 'None (Baseline)',
          newValue: '1 mg Initial Day Escalation',
          effectiveDate: 'March 14, 2026',
          reason: 'Initial oral immunotherapy enrollment confirmed.',
          status: 'Completed'
        }
      ]
    },

    'SB-00135': {
      patientId: 'SB-00135',
      name: 'Liam Patel',
      age: 5,
      dob: 'Feb 18, 2021',
      gender: 'Male',
      initials: 'LP',
      avatarColor: 'teal',
      careTeam: 'Safe2Bite Allergy Care Team · Austin, TX',
      assignedDoctor: 'Dr. Sarah Chen, MD (Allergist & Immunologist)',
      treatmentType: 'Food Allergy Oral Immunotherapy (OIT)',
      allergen: 'Peanut Protein (Arachis hypogaea)',
      status: 'active',
      statusLabel: 'Active',
      statusClass: 'badge-treat-active',
      currentPhase: 'Phase 3 — Escalation Build-Up',
      currentDose: '20 mg Peanut Protein',
      targetDose: '300 mg Peanut Protein (Maintenance Goal)',
      frequency: 'Once Daily (Morning with meal)',
      administrationInstructions: 'Administer with carbohydrate or fat-rich breakfast. Observe for 2 hours post-dose. No vigorous exercise within 2 hours of dose.',
      startDate: 'Jan 22, 2026',
      lastUpdated: 'Sep 12, 2026 by Dr. Sarah Chen',
      adherenceRate: '95.8%',
      clinicianNotes: 'Dose escalated to 20 mg on Sep 12. Caregiver instructed to report any gastrointestinal or cutaneous signs.',
      missedDoseInstructions: 'CLINICIAN-CONFIGURED PROTOCOL: If dose delayed >4 hours, skip and resume regular single dose the next morning. Do not double dose.',
      upcomingDoses: [
        {
          id: 'DOSE-2041',
          date: 'Tomorrow, Sep 18, 2026',
          time: '8:30 AM',
          food: 'Peanut Protein',
          doseAmount: '20 mg',
          status: 'Scheduled',
          statusClass: 'badge-dose-upcoming',
          instructions: 'Take with food. Monitor for 2 hours post-dose.',
          verifiedBy: 'Pending Caregiver Administration'
        },
        {
          id: 'DOSE-2042',
          date: 'Saturday, Sep 19, 2026',
          time: '8:30 AM',
          food: 'Peanut Protein',
          doseAmount: '20 mg',
          status: 'Scheduled',
          statusClass: 'badge-dose-upcoming',
          instructions: 'Take with food. Monitor for 2 hours post-dose.',
          verifiedBy: 'Pending Caregiver Administration'
        }
      ],
      doseHistory: [
        {
          id: 'DOSE-2040',
          date: 'Today, Sep 17, 2026',
          time: '8:35 AM',
          food: 'Peanut Protein',
          doseAmount: '20 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Photo Logged',
          notes: 'Administered with pudding. Well tolerated.'
        },
        {
          id: 'DOSE-2039',
          date: 'Yesterday, Sep 16, 2026',
          time: '8:30 AM',
          food: 'Peanut Protein',
          doseAmount: '20 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Timed Log',
          notes: 'Normal administration.'
        }
      ],
      recentChanges: [
        {
          id: 'CHG-315',
          date: 'Sep 12, 2026 · 11:00 AM',
          type: 'Dose Escalation',
          previousValue: '15 mg Peanut Protein',
          newValue: '20 mg Peanut Protein',
          effectiveDate: 'Sep 12, 2026',
          clinician: 'Dr. Sarah Chen, MD',
          reason: 'Titration increment following 4 weeks of consistent 15 mg tolerance.',
          status: 'Active'
        }
      ],
      auditTrail: [
        {
          timestamp: 'Sep 12, 2026 11:02:14 AM',
          clinician: 'Dr. Sarah Chen, MD',
          action: 'Dose Escalation Authorized',
          previousValue: '15 mg Peanut Protein',
          newValue: '20 mg Peanut Protein',
          effectiveDate: 'Sep 12, 2026',
          reason: 'Consistent tolerance at 15 mg build-up step.',
          status: 'Authorized & Applied'
        }
      ]
    },

    'SB-00142': {
      patientId: 'SB-00142',
      name: 'Sofia Rodriguez',
      age: 9,
      dob: 'Jul 04, 2017',
      gender: 'Female',
      initials: 'SR',
      avatarColor: 'amber',
      careTeam: 'Safe2Bite Allergy Care Team · Austin, TX',
      assignedDoctor: 'Dr. Sarah Chen, MD (Allergist & Immunologist)',
      treatmentType: 'Food Allergy Oral Immunotherapy (OIT)',
      allergen: 'Tree Nut — Walnut Protein (Juglans regia)',
      status: 'needs_review',
      statusLabel: 'Needs Review',
      statusClass: 'badge-treat-needs-review',
      currentPhase: 'Phase 1 — Initial Escalation',
      currentDose: '6 mg Walnut Protein',
      targetDose: '300 mg Walnut Protein (Maintenance Goal)',
      frequency: 'Once Daily (Morning with meal)',
      administrationInstructions: 'Administer with meal. Keep antihistamines accessible. Observe for 2 hours post-dose.',
      startDate: 'Aug 05, 2026',
      lastUpdated: 'Sep 08, 2026 by Dr. Sarah Chen',
      adherenceRate: '89.2%',
      clinicianNotes: 'Recent mild reaction logged (localized abdominal cramping). Consolidate current 6 mg step before advancing.',
      missedDoseInstructions: 'CLINICIAN-CONFIGURED PROTOCOL: If any gastrointestinal upset occurs, do not increase dose. Contact clinic if symptoms persist >1 hour.',
      upcomingDoses: [
        {
          id: 'DOSE-3011',
          date: 'Tomorrow, Sep 18, 2026',
          time: '8:00 AM',
          food: 'Walnut Protein',
          doseAmount: '6 mg',
          status: 'Scheduled',
          statusClass: 'badge-dose-upcoming',
          instructions: 'Monitor carefully for abdominal discomfort.',
          verifiedBy: 'Pending Caregiver Administration'
        }
      ],
      doseHistory: [
        {
          id: 'DOSE-3010',
          date: 'Today, Sep 17, 2026',
          time: '8:15 AM',
          food: 'Walnut Protein',
          doseAmount: '6 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Timed Log',
          notes: 'Taken with oatmeal. Mild cramp reported at 45 min, resolved without medication.'
        },
        {
          id: 'DOSE-3009',
          date: 'Yesterday, Sep 16, 2026',
          time: '8:05 AM',
          food: 'Walnut Protein',
          doseAmount: '6 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Photo Logged',
          notes: 'Taken normally.'
        }
      ],
      recentChanges: [
        {
          id: 'CHG-320',
          date: 'Sep 08, 2026 · 02:15 PM',
          type: 'Step Consolidation',
          previousValue: '6 mg Walnut Protein',
          newValue: '6 mg Walnut Protein (Hold Step)',
          effectiveDate: 'Sep 08, 2026',
          clinician: 'Dr. Sarah Chen, MD',
          reason: 'Hold at 6 mg for 14 additional days due to mild cramp reports.',
          status: 'Active'
        }
      ],
      auditTrail: [
        {
          timestamp: 'Sep 08, 2026 02:16:30 PM',
          clinician: 'Dr. Sarah Chen, MD',
          action: 'Step Hold Applied',
          previousValue: '6 mg Walnut Protein',
          newValue: '6 mg Walnut Protein (Hold Step)',
          effectiveDate: 'Sep 08, 2026',
          reason: 'Hold at 6 mg for 14 additional days due to mild cramp reports.',
          status: 'Authorized & Applied'
        }
      ]
    },

    'SB-00155': {
      patientId: 'SB-00155',
      name: 'Noah Kim',
      age: 4,
      dob: 'May 30, 2022',
      gender: 'Male',
      initials: 'NK',
      avatarColor: 'purple',
      careTeam: 'Safe2Bite Allergy Care Team · Austin, TX',
      assignedDoctor: 'Dr. Sarah Chen, MD (Allergist & Immunologist)',
      treatmentType: 'Food Allergy Oral Immunotherapy (OIT)',
      allergen: 'Egg White Protein (Gal d 1)',
      status: 'paused',
      statusLabel: 'Paused (Illness Hold)',
      statusClass: 'badge-treat-paused',
      currentPhase: 'Phase 2 — Dose Build-Up',
      currentDose: '15 mg Egg White Protein',
      targetDose: '300 mg Egg White Protein (Maintenance Goal)',
      frequency: 'Once Daily (Morning with meal)',
      administrationInstructions: 'PROTOCOL CURRENTLY HELD. Do not administer home doses during febrile illness.',
      startDate: 'Feb 10, 2026',
      lastUpdated: 'Sep 16, 2026 by Dr. Sarah Chen',
      adherenceRate: '94.0%',
      clinicianNotes: 'Protocol paused on Sep 16 due to caregiver report of viral gastroenteritis and 101.4°F fever. Hold until afebrile 24 hours without fever-reducing meds.',
      missedDoseInstructions: 'CLINICIAN-CONFIGURED PROTOCOL: All home doses paused. Re-evaluate resumption dose with clinic once patient has been fully recovered and afebrile for 24 hours.',
      upcomingDoses: [
        {
          id: 'DOSE-4001',
          date: 'Pending Hold Release',
          time: '8:00 AM',
          food: 'Egg White Protein',
          doseAmount: '15 mg',
          status: 'Paused',
          statusClass: 'badge-treat-paused',
          instructions: 'Doses paused due to febrile illness hold.',
          verifiedBy: 'Clinician Hold Active'
        }
      ],
      doseHistory: [
        {
          id: 'DOSE-4000',
          date: 'Sep 16, 2026',
          time: '8:00 AM',
          food: 'Egg White Protein',
          doseAmount: '15 mg',
          status: 'Held',
          statusClass: 'badge-treat-paused',
          confirmationMethod: 'Clinician Dose Hold Implemented',
          notes: 'Fever 101.4°F reported by parent. Dose safely held.'
        },
        {
          id: 'DOSE-3999',
          date: 'Sep 15, 2026',
          time: '8:10 AM',
          food: 'Egg White Protein',
          doseAmount: '15 mg',
          status: 'Taken',
          statusClass: 'badge-dose-taken',
          confirmationMethod: 'Caregiver App Verified · Timed Log',
          notes: 'Standard morning dose.'
        }
      ],
      recentChanges: [
        {
          id: 'CHG-330',
          date: 'Sep 16, 2026 · 09:15 AM',
          type: 'Protocol Paused',
          previousValue: 'Active (15 mg daily)',
          newValue: 'Paused (Illness Hold)',
          effectiveDate: 'Sep 16, 2026',
          clinician: 'Dr. Sarah Chen, MD',
          reason: 'Caregiver reported febrile viral illness (101.4°F). Protocol safely paused.',
          status: 'Hold Active'
        }
      ],
      auditTrail: [
        {
          timestamp: 'Sep 16, 2026 09:16:04 AM',
          clinician: 'Dr. Sarah Chen, MD',
          action: 'Treatment Protocol Paused',
          previousValue: 'Active (15 mg daily)',
          newValue: 'Paused (Illness Hold)',
          effectiveDate: 'Sep 16, 2026',
          reason: 'Febrile illness hold reported by parent.',
          status: 'Active Hold'
        }
      ]
    }
  };

  /* --------------------------------------------------
     Initialize Module
     -------------------------------------------------- */
  function init() {
    // Inject Modals into DOM
    injectTreatmentModals();

    // Bind Global Treatment Navigation Events
    bindEvents();

    // Default to general view or first patient
    renderGeneralView();

    console.info('[Safe2Bite] Pass 5: Treatment & Dosage Management Module initialized');
  }

  /* --------------------------------------------------
     Bind Event Listeners
     -------------------------------------------------- */
  function bindEvents() {
    // Search input in general treatment view
    const searchInput = document.getElementById('treatment-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderGeneralTable();
      });
    }

    // Status filter buttons
    const filterBtns = document.querySelectorAll('.treatment-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter || 'all';
        renderGeneralTable();
      });
    });

    // Close modals on backdrop click
    document.querySelectorAll('.treatment-modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    });

    // ESC key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  /* --------------------------------------------------
     Inject Modals HTML into DOM
     -------------------------------------------------- */
  function injectTreatmentModals() {
    if (document.getElementById('treatment-modal-adjust')) return;

    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'treatment-modals-container';
    modalWrapper.innerHTML = `
      <!-- ==============================================
           1. ADJUST TREATMENT WORKFLOW MODAL
           ============================================== -->
      <div class="treatment-modal-backdrop" id="treatment-modal-adjust" role="dialog" aria-modal="true" aria-labelledby="adjust-modal-title">
        <div class="treatment-modal-box">
          <div class="treatment-modal-header">
            <h2 class="treatment-modal-title" id="adjust-modal-title">
              ${Icons.render('pencil', { size: 18, className: 'icon' })}
              Adjust Treatment &amp; Dosage
            </h2>
            <button type="button" class="treatment-modal-close-btn" onclick="Treatment.closeAllModals()" aria-label="Close modal">
              ${Icons.render('x', { size: 18, className: 'icon' })}
            </button>
          </div>

          <!-- Wizard Step Indicator -->
          <div style="padding: var(--space-4) var(--space-5) 0;">
            <div class="wizard-steps-indicator">
              <div class="wizard-step-item active" id="wizard-step-1-ind">
                <div class="step-num-bubble">1</div>
                <span>Propose Change</span>
              </div>
              <span style="color:var(--color-border);font-size:12px">&rarr;</span>
              <div class="wizard-step-item" id="wizard-step-2-ind">
                <div class="step-num-bubble">2</div>
                <span>Review &amp; Verify</span>
              </div>
              <span style="color:var(--color-border);font-size:12px">&rarr;</span>
              <div class="wizard-step-item" id="wizard-step-3-ind">
                <div class="step-num-bubble">3</div>
                <span>Confirmation</span>
              </div>
            </div>
          </div>

          <div class="treatment-modal-body" id="adjust-modal-body">
            <!-- Dynamic Content based on current step (1, 2, or 3) -->
          </div>

          <div class="treatment-modal-footer" id="adjust-modal-footer">
            <!-- Dynamic Action Buttons -->
          </div>
        </div>
      </div>

      <!-- ==============================================
           2. PAUSE / RESUME CONFIRMATION MODAL
           ============================================== -->
      <div class="treatment-modal-backdrop" id="treatment-modal-pause-resume" role="dialog" aria-modal="true" aria-labelledby="pause-modal-title">
        <div class="treatment-modal-box" style="max-width:520px">
          <div class="treatment-modal-header">
            <h2 class="treatment-modal-title" id="pause-modal-title">
              ${Icons.render('pause-circle', { size: 18, className: 'icon' })}
              Change Treatment Status
            </h2>
            <button type="button" class="treatment-modal-close-btn" onclick="Treatment.closeAllModals()" aria-label="Close modal">
              ${Icons.render('x', { size: 18, className: 'icon' })}
            </button>
          </div>
          <div class="treatment-modal-body" id="pause-modal-body">
            <!-- Dynamic Pause / Resume Content -->
          </div>
          <div class="treatment-modal-footer" id="pause-modal-footer">
            <!-- Dynamic Action Buttons -->
          </div>
        </div>
      </div>

      <!-- ==============================================
           3. DOSE DETAIL MODAL
           ============================================== -->
      <div class="treatment-modal-backdrop" id="treatment-modal-dose-detail" role="dialog" aria-modal="true" aria-labelledby="dose-detail-title">
        <div class="treatment-modal-box" style="max-width:560px">
          <div class="treatment-modal-header">
            <h2 class="treatment-modal-title" id="dose-detail-title">
              ${Icons.render('doses', { size: 18, className: 'icon' })}
              Dose Event Details
            </h2>
            <button type="button" class="treatment-modal-close-btn" onclick="Treatment.closeAllModals()" aria-label="Close modal">
              ${Icons.render('x', { size: 18, className: 'icon' })}
            </button>
          </div>
          <div class="treatment-modal-body" id="dose-detail-body">
            <!-- Dynamic Dose Detail Content -->
          </div>
          <div class="treatment-modal-footer">
            <button type="button" class="btn-clinical-secondary" onclick="Treatment.closeAllModals()">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalWrapper);
  }

  /* --------------------------------------------------
     General Treatment View (Sidebar Navigation)
     -------------------------------------------------- */
  function renderGeneralView() {
    const viewContainer = document.getElementById('view-treatment');
    if (!viewContainer) return;

    currentPatientId = null;

    // Calculate Summary Stats
    const allPatients = Object.values(treatmentStore);
    const totalCount = allPatients.length;
    const activeCount = allPatients.filter(p => p.status === 'active').length;
    const pausedCount = allPatients.filter(p => p.status === 'paused').length;
    const reviewCount = allPatients.filter(p => p.status === 'needs_review').length;

    viewContainer.innerHTML = `
      <div class="treatment-container">
        
        <!-- Top Nav & Permissions Bar -->
        <div class="treatment-nav-bar">
          <div>
            <h1 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);color:var(--color-text-primary);margin:0">
              Treatment &amp; Dosage Management
            </h1>
            <p style="font-size:var(--font-size-xs);color:var(--color-text-secondary);margin:4px 0 0">
              Prescribed oral immunotherapy protocols, dosage build-up schedules, and clinician audit logs.
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">
            <div class="treatment-security-pill">
              ${Icons.render('shield-check', { size: 14, className: 'icon' })}
              <span>Authorized Clinical Protocol</span>
            </div>
            <div class="treatment-role-pill">
              <span>View As Role:</span>
              <select class="treatment-role-select" id="treatment-role-switch" onchange="Treatment.setRole(this.value)">
                <option value="doctor" ${currentRole === 'doctor' ? 'selected' : ''}>Doctor (Edit &amp; Adjust)</option>
                <option value="care_team" ${currentRole === 'care_team' ? 'selected' : ''}>Care Team (Read-Only)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 4 Summary Stats Cards -->
        <div class="treatment-stats-grid">
          <div class="treatment-stat-card">
            <div class="treatment-stat-icon icon-blue">
              ${Icons.render('treatment', { size: 22, className: 'icon' })}
            </div>
            <div class="treatment-stat-info">
              <span class="treatment-stat-value">${totalCount}</span>
              <span class="treatment-stat-label">Total Patients on OIT</span>
            </div>
          </div>
          <div class="treatment-stat-card">
            <div class="treatment-stat-icon icon-green">
              ${Icons.render('check-circle', { size: 22, className: 'icon' })}
            </div>
            <div class="treatment-stat-info">
              <span class="treatment-stat-value">${activeCount}</span>
              <span class="treatment-stat-label">Active Dosing Protocols</span>
            </div>
          </div>
          <div class="treatment-stat-card">
            <div class="treatment-stat-icon icon-amber">
              ${Icons.render('pause-circle', { size: 22, className: 'icon' })}
            </div>
            <div class="treatment-stat-info">
              <span class="treatment-stat-value">${pausedCount}</span>
              <span class="treatment-stat-label">Paused / Illness Holds</span>
            </div>
          </div>
          <div class="treatment-stat-card">
            <div class="treatment-stat-icon icon-teal">
              ${Icons.render('alert-triangle', { size: 22, className: 'icon' })}
            </div>
            <div class="treatment-stat-info">
              <span class="treatment-stat-value">${reviewCount}</span>
              <span class="treatment-stat-label">Needs Review / Reaction</span>
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="treatment-filter-panel">
          <div class="treatment-search-box">
            <span class="treatment-search-icon">
              ${Icons.render('search', { size: 16, className: 'icon' })}
            </span>
            <input
              type="text"
              id="treatment-search-input"
              class="treatment-search-input"
              placeholder="Search by patient name, ID, or allergen..."
              value="${searchQuery}">
          </div>
          <div class="treatment-filter-pills">
            <button type="button" class="treatment-filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Treatments</button>
            <button type="button" class="treatment-filter-btn ${activeFilter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
            <button type="button" class="treatment-filter-btn ${activeFilter === 'paused' ? 'active' : ''}" data-filter="paused">Paused</button>
            <button type="button" class="treatment-filter-btn ${activeFilter === 'needs_review' ? 'active' : ''}" data-filter="needs_review">Needs Review</button>
          </div>
        </div>

        <!-- Treatment Directory Table -->
        <div class="treatment-table-card">
          <div class="treatment-table-header">
            <h2 class="treatment-table-title">
              ${Icons.render('file-text', { size: 16, className: 'icon' })}
              Patient Treatment Protocols
            </h2>
            <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">
              Showing clinician-managed dosage plans
            </span>
          </div>
          <div class="treatment-table-container" id="treatment-table-container">
            <!-- Table Rendered Dynamically -->
          </div>
        </div>

      </div>
    `;

    // Rebind inputs
    bindEvents();

    // Render Table Content
    renderGeneralTable();
  }

  /* --------------------------------------------------
     Render General Treatment Table Content
     -------------------------------------------------- */
  function renderGeneralTable() {
    const tableContainer = document.getElementById('treatment-table-container');
    if (!tableContainer) return;

    let patients = Object.values(treatmentStore);

    // Apply status filter
    if (activeFilter !== 'all') {
      patients = patients.filter(p => p.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      patients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.patientId.toLowerCase().includes(searchQuery) ||
        p.allergen.toLowerCase().includes(searchQuery) ||
        p.currentDose.toLowerCase().includes(searchQuery)
      );
    }

    if (patients.length === 0) {
      tableContainer.innerHTML = `
        <div class="treatment-empty-state">
          <div class="treatment-empty-icon">
            ${Icons.render('search', { size: 24, className: 'icon' })}
          </div>
          <h3 class="treatment-empty-title">No Treatments Found</h3>
          <p class="treatment-empty-desc">No patients match the specified search term or filter criteria.</p>
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = `
      <table class="clinical-table">
        <thead>
          <tr>
            <th class="col-patient">Patient</th>
            <th class="col-allergen">Target Allergen</th>
            <th class="col-phase">Current Phase</th>
            <th class="col-dose">Prescribed Dose</th>
            <th class="col-adherence">Adherence</th>
            <th class="col-status">Status</th>
            <th class="col-date">Last Updated</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          ${patients.map(p => `
            <tr>
              <td class="col-patient">
                <div class="patient-cell">
                  <div class="patient-cell-avatar avatar-color-${p.avatarColor}">${p.initials}</div>
                  <div class="patient-cell-info">
                    <span class="patient-cell-name" onclick="Treatment.openPatientTreatment('${p.patientId}')">${p.name}</span>
                    <span class="patient-cell-id">${p.patientId} · Age ${p.age}</span>
                  </div>
                </div>
              </td>
              <td class="col-allergen"><strong>${p.allergen.split('(')[0].trim()}</strong></td>
              <td class="col-phase"><span style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">${p.currentPhase}</span></td>
              <td class="col-dose"><strong style="color:var(--color-primary-dark)">${p.currentDose}</strong></td>
              <td class="col-adherence"><span style="color:var(--color-status-green);font-weight:var(--font-weight-bold)">${p.adherenceRate}</span></td>
              <td class="col-status"><span class="s2b-badge ${p.statusClass}">${p.statusLabel}</span></td>
              <td class="col-date"><span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">${p.lastUpdated.split('by')[0].trim()}</span></td>
              <td class="col-action">
                <button type="button" class="btn-manage-treatment" onclick="Treatment.openPatientTreatment('${p.patientId}')">
                  ${Icons.render('eye', { size: 14, className: 'icon' })}
                  <span>Manage Treatment</span>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /* --------------------------------------------------
     Patient-Specific Treatment Management View
     (Rendered in #view-treatment or in #tab-pane-treatment)
     -------------------------------------------------- */
  function openPatientTreatment(patientId, targetElementId = null) {
    let p = treatmentStore[patientId];
    if (!p) {
      // Create fallback record from sample data if patient exists in directory
      p = createPatientTreatmentFallback(patientId);
      treatmentStore[patientId] = p;
    }

    currentPatientId = patientId;

    const targetContainer = targetElementId
      ? document.getElementById(targetElementId)
      : document.getElementById('view-treatment');

    if (!targetContainer) return;

    // If rendering into sidebar page view, ensure view is active
    if (!targetElementId) {
      Sidebar.navigateTo('treatment');
    }

    targetContainer.innerHTML = `
      <div class="treatment-container">
        
        <!-- Back Navigation & Context Header -->
        <div class="treatment-nav-bar">
          <button type="button" class="btn-treatment-back" onclick="${targetElementId ? "PatientOverview.switchTab('overview')" : "Treatment.renderGeneralView()"}">
            &larr; ${targetElementId ? 'Back to Patient Overview' : 'Back to All Treatments'}
          </button>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">
            <div class="treatment-security-pill">
              ${Icons.render('shield-check', { size: 14, className: 'icon' })}
              <span>Clinician Authorized · Safe2Bite OIT Protocol</span>
            </div>
            <div class="treatment-role-pill">
              <span>Role:</span>
              <select class="treatment-role-select" onchange="Treatment.setRole(this.value)">
                <option value="doctor" ${currentRole === 'doctor' ? 'selected' : ''}>Doctor (Authorized)</option>
                <option value="care_team" ${currentRole === 'care_team' ? 'selected' : ''}>Care Team (Read-Only)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Patient Context Header Banner -->
        <div class="treatment-patient-header">
          <div class="treatment-patient-info-group">
            <div class="treatment-patient-avatar avatar-color-${p.avatarColor}">
              ${p.initials}
            </div>
            <div class="treatment-patient-details">
              <div class="treatment-patient-title-row">
                <h1 class="treatment-patient-name">${p.name}</h1>
                <span class="treatment-patient-id-badge">${p.patientId}</span>
                <span class="s2b-badge ${p.statusClass}" id="header-patient-status-badge">
                  ${Icons.render(p.status === 'active' ? 'check' : (p.status === 'paused' ? 'pause-circle' : 'alert-triangle'), { size: 11, className: 'icon' })}
                  ${p.statusLabel}
                </span>
              </div>
              <div class="treatment-patient-meta-row">
                <span><strong>Care Team:</strong> ${p.careTeam}</span>
                <span>&bull;</span>
                <span><strong>Clinician:</strong> ${p.assignedDoctor.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <div class="treatment-header-actions">
            ${currentRole === 'doctor' ? `
              <button type="button" class="btn-clinical-primary" onclick="Treatment.openAdjustModal('${p.patientId}')" id="btn-adjust-treatment-action">
                ${Icons.render('pencil', { size: 15, className: 'icon' })}
                Adjust Treatment
              </button>
              ${p.status === 'paused' ? `
                <button type="button" class="btn-clinical-success" onclick="Treatment.openPauseResumeModal('${p.patientId}', 'resume')">
                  ${Icons.render('play', { size: 15, className: 'icon' })}
                  Resume Treatment
                </button>
              ` : `
                <button type="button" class="btn-clinical-warning" onclick="Treatment.openPauseResumeModal('${p.patientId}', 'pause')">
                  ${Icons.render('pause-circle', { size: 15, className: 'icon' })}
                  Pause Treatment
                </button>
              `}
            ` : `
              <div class="s2b-badge badge-neutral" style="padding:var(--space-2) var(--space-3)">
                ${Icons.render('lock', { size: 14, className: 'icon' })}
                Read-Only Access (Doctor credentials required to edit)
              </div>
            `}
            <button type="button" class="btn-clinical-secondary" onclick="PatientOverview.loadPatient('${p.patientId}')">
              ${Icons.render('user', { size: 15, className: 'icon' })}
              View Patient Profile
            </button>
          </div>
        </div>

        <!-- 2-Column Main Treatment Layout -->
        <div class="treatment-layout-grid">
          
          <!-- LEFT COLUMN: Summary, Plan, and History -->
          <div class="treatment-main-column">
            
            <!-- 1. Current Treatment Summary Card -->
            <div class="treatment-card" id="treatment-summary-card">
              <div class="treatment-card-header">
                <div class="treatment-card-title-group">
                  <div class="treatment-card-icon">${Icons.render('treatment', { size: 16, className: 'icon' })}</div>
                  <h2 class="treatment-card-title">Current Treatment Summary</h2>
                </div>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">
                  Protocol ID: ${p.patientId}-OIT
                </span>
              </div>
              <div class="treatment-card-body">
                <div class="treatment-metrics-grid-pass5">
                  <div class="clinical-metric-box">
                    <span class="clinical-metric-label">Treatment Type</span>
                    <span class="clinical-metric-value" style="font-size:14px;color:var(--color-primary)">${p.treatmentType}</span>
                    <span class="clinical-metric-sub">Oral Immunotherapy</span>
                  </div>
                  <div class="clinical-metric-box">
                    <span class="clinical-metric-label">Current Phase</span>
                    <span class="clinical-metric-value" style="font-size:14px">${p.currentPhase}</span>
                    <span class="clinical-metric-sub">Dosing Progression</span>
                  </div>
                  <div class="clinical-metric-box">
                    <span class="clinical-metric-label">Current Dose</span>
                    <span class="clinical-metric-value" style="color:var(--color-primary-dark)">${p.currentDose}</span>
                    <span class="clinical-metric-sub">${p.frequency}</span>
                  </div>
                  <div class="clinical-metric-box">
                    <span class="clinical-metric-label">Target Maintenance</span>
                    <span class="clinical-metric-value">${p.targetDose.split('(')[0].trim()}</span>
                    <span class="clinical-metric-sub">Long-term target</span>
                  </div>
                </div>

                <div class="clinician-note-banner">
                  <div style="color:var(--color-primary);flex-shrink:0;margin-top:1px">
                    ${Icons.render('info', { size: 16, className: 'icon' })}
                  </div>
                  <div>
                    <strong>Clinician Treatment Note:</strong> ${p.clinicianNotes}
                    <div style="margin-top:4px;font-size:11px;color:var(--color-text-muted)">
                      Last updated: ${p.lastUpdated}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Treatment Plan Details -->
            <div class="treatment-card" id="treatment-plan-card">
              <div class="treatment-card-header">
                <div class="treatment-card-title-group">
                  <div class="treatment-card-icon">${Icons.render('clipboard', { size: 16, className: 'icon' })}</div>
                  <h2 class="treatment-card-title">Treatment Plan &amp; Protocol Guidelines</h2>
                </div>
                <span class="s2b-badge ${p.statusClass}">
                  ${p.statusLabel}
                </span>
              </div>
              <div class="treatment-card-body">
                <div class="plan-rows-list">
                  <div class="plan-row-item">
                    <span class="plan-row-title">Target Allergen / Food:</span>
                    <span class="plan-row-value"><strong>${p.allergen}</strong></span>
                  </div>
                  <div class="plan-row-item">
                    <span class="plan-row-title">Prescribed Frequency:</span>
                    <span class="plan-row-value">${p.frequency}</span>
                  </div>
                  <div class="plan-row-item">
                    <span class="plan-row-title">Protocol Start Date:</span>
                    <span class="plan-row-value">${p.startDate}</span>
                  </div>
                  <div class="plan-row-item">
                    <span class="plan-row-title">Adherence Rate:</span>
                    <span class="plan-row-value" style="color:var(--color-status-green);font-weight:bold">${p.adherenceRate}</span>
                  </div>
                </div>

                <!-- Structured Administration Instructions -->
                <div class="plan-instructions-box">
                  <div class="plan-instructions-header">
                    ${Icons.render('shield-check', { size: 14, className: 'icon' })}
                    Clinician-Configured Administration Instructions:
                  </div>
                  <p class="plan-instructions-text">${p.administrationInstructions}</p>
                </div>

                <!-- Missed Dose Policy -->
                <div class="plan-instructions-box" style="background:#FFFBEB;border-color:#FDE68A">
                  <div class="plan-instructions-header" style="color:#92400E">
                    ${Icons.render('alert-circle', { size: 14, className: 'icon' })}
                    Clinician-Configured Missed-Dose Instructions:
                  </div>
                  <p class="plan-instructions-text" style="color:#78350F">${p.missedDoseInstructions}</p>
                </div>
              </div>
            </div>

            <!-- 3. Dose History Table -->
            <div class="treatment-card" id="treatment-history-card">
              <div class="treatment-card-header">
                <div class="treatment-card-title-group">
                  <div class="treatment-card-icon">${Icons.render('history', { size: 16, className: 'icon' })}</div>
                  <h2 class="treatment-card-title">Dose History &amp; Patient Confirmations</h2>
                </div>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">
                  Click dose row for details
                </span>
              </div>
              <div class="treatment-table-container">
                <table class="clinical-table">
                  <thead>
                    <tr>
                      <th>Date / Time</th>
                      <th>Allergen Dose</th>
                      <th>Status</th>
                      <th>Confirmation Record</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${p.doseHistory.map(d => `
                      <tr onclick="Treatment.openDoseDetail('${d.id}')" style="cursor:pointer">
                        <td><strong>${d.date}</strong><br><span style="font-size:11px;color:var(--color-text-muted)">${d.time}</span></td>
                        <td><strong style="color:var(--color-primary-dark)">${d.doseAmount}</strong></td>
                        <td><span class="s2b-badge ${d.statusClass}">${d.status}</span></td>
                        <td><span style="font-size:var(--font-size-xs)">${d.confirmationMethod}</span></td>
                        <td><span style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">${d.notes || '—'}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

          </div><!-- /treatment-main-column -->

          <!-- RIGHT COLUMN: Upcoming Doses, Recent Changes, Audit Trail -->
          <div class="treatment-side-column">
            
            <!-- 1. Upcoming Doses -->
            <div class="treatment-card" id="treatment-upcoming-card">
              <div class="treatment-card-header">
                <div class="treatment-card-title-group">
                  <div class="treatment-card-icon">${Icons.render('calendar', { size: 16, className: 'icon' })}</div>
                  <h2 class="treatment-card-title">Upcoming Scheduled Doses</h2>
                </div>
                <span style="font-size:var(--font-size-xs);color:var(--color-text-muted)">
                  Next 3 days
                </span>
              </div>
              <div class="treatment-card-body">
                <div class="upcoming-doses-pass5-list">
                  ${p.upcomingDoses.map(u => `
                    <div class="dose-item-card" onclick="Treatment.openDoseDetail('${u.id}')">
                      <div class="dose-item-left">
                        <div class="dose-item-icon">
                          ${Icons.render('doses', { size: 18, className: 'icon' })}
                        </div>
                        <div class="dose-item-content">
                          <h3 class="dose-item-title">${u.date} · ${u.time}</h3>
                          <span class="dose-item-meta">${u.food} &bull; <strong>${u.doseAmount}</strong></span>
                        </div>
                      </div>
                      <div class="dose-item-right">
                        <span class="s2b-badge ${u.statusClass}">${u.status}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- 2. Recent Treatment Changes -->
            <div class="treatment-card" id="treatment-changes-card">
              <div class="treatment-card-header">
                <div class="treatment-card-title-group">
                  <div class="treatment-card-icon">${Icons.render('refresh', { size: 16, className: 'icon' })}</div>
                  <h2 class="treatment-card-title">Recent Treatment Changes</h2>
                </div>
              </div>
              <div class="treatment-card-body">
                <div class="treatment-changes-list">
                  ${p.recentChanges.map(c => `
                    <div class="change-log-item">
                      <div class="change-log-header">
                        <span class="change-type-pill">${c.type}</span>
                        <span style="font-size:11px;color:var(--color-text-muted)">${c.date}</span>
                      </div>
                      <div class="change-diff-row">
                        <span class="diff-prev">${c.previousValue}</span>
                        <span class="diff-arrow">&rarr;</span>
                        <span class="diff-new">${c.newValue}</span>
                      </div>
                      <p class="change-reason-note">"${c.reason}"</p>
                      <div class="change-meta-row">
                        <span>By: <strong>${c.clinician}</strong></span>
                        <span>Effective: ${c.effectiveDate}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- 3. Immutable Audit Trail -->
            <div class="treatment-card" id="treatment-audit-card">
              <div class="treatment-card-header">
                <div class="treatment-card-title-group">
                  <div class="treatment-card-icon">${Icons.render('lock', { size: 16, className: 'icon' })}</div>
                  <h2 class="treatment-card-title">Clinical Audit Record</h2>
                </div>
                <span class="treatment-security-pill" style="font-size:10px">Immutable</span>
              </div>
              <div class="treatment-card-body">
                <div style="display:flex;flex-direction:column;gap:var(--space-3)">
                  ${p.auditTrail.map(a => `
                    <div style="padding:var(--space-3);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);font-size:var(--font-size-xs);display:flex;flex-direction:column;gap:3px">
                      <div style="display:flex;justify-content:space-between;color:var(--color-text-muted)">
                        <span>${a.timestamp}</span>
                        <strong style="color:var(--color-primary)">${a.action}</strong>
                      </div>
                      <div style="color:var(--color-text-primary)">
                        <strong>${a.clinician}</strong> &bull; ${a.previousValue} &rarr; ${a.newValue}
                      </div>
                      <div style="color:var(--color-text-secondary);font-style:italic">
                        Reason: ${a.reason}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

          </div><!-- /treatment-side-column -->

        </div><!-- /treatment-layout-grid -->

      </div><!-- /treatment-container -->
    `;
  }

  /* --------------------------------------------------
     Multi-Step Adjust Treatment Workflow Modal
     -------------------------------------------------- */
  function openAdjustModal(patientId) {
    if (currentRole !== 'doctor') {
      alert('Access Restricted: You are currently viewing in Read-Only Care Team mode. Switch to Doctor role to adjust treatments.');
      return;
    }

    const p = treatmentStore[patientId];
    if (!p) return;

    adjustStep = 1;
    adjustData = {
      patientId: patientId,
      newDose: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      effectiveTime: 'Morning (8:00 AM)',
      frequency: p.frequency || 'Once Daily (Morning)',
      instructions: p.administrationInstructions || '',
      reason: ''
    };

    renderAdjustStep();
    openModal('treatment-modal-adjust');
  }

  function renderAdjustStep() {
    const p = treatmentStore[adjustData.patientId];
    const body = document.getElementById('adjust-modal-body');
    const footer = document.getElementById('adjust-modal-footer');
    if (!body || !footer || !p) return;

    // Update Step Indicators
    for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById(`wizard-step-${i}-ind`);
      if (ind) {
        ind.className = 'wizard-step-item';
        if (i === adjustStep) ind.classList.add('active');
        if (i < adjustStep) ind.classList.add('completed');
      }
    }

    // STEP 1: PROPOSE CHANGE
    if (adjustStep === 1) {
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:var(--space-3-5)">
          
          <!-- Current Treatment Context Box -->
          <div style="padding:var(--space-3) var(--space-4);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:space-between">
            <div>
              <span style="font-size:var(--font-size-xs);color:var(--color-text-secondary);text-transform:uppercase;font-weight:bold">Patient &amp; Protocol:</span>
              <div style="font-weight:bold;color:var(--color-text-primary)">${p.name} (${p.patientId})</div>
              <div style="font-size:var(--font-size-xs);color:var(--color-primary)">${p.allergen}</div>
            </div>
            <div style="text-align:right">
              <span style="font-size:var(--font-size-xs);color:var(--color-text-secondary);text-transform:uppercase;font-weight:bold">Current Prescribed Dose:</span>
              <div style="font-size:var(--font-size-base);font-weight:bold;color:var(--color-primary-dark)">${p.currentDose}</div>
            </div>
          </div>

          <!-- Input: Proposed Dose -->
          <div class="form-field-group">
            <label class="form-label" for="input-proposed-dose">
              <span>Proposed New Dose <span class="form-label-required">*</span></span>
              <span style="font-size:11px;color:var(--color-text-muted)">Must be explicitly clinician-entered</span>
            </label>
            <input
              type="text"
              id="input-proposed-dose"
              class="form-input-text"
              placeholder="e.g. 15 mg Peanut Protein"
              value="${escapeHtml(adjustData.newDose)}">
            <div class="field-error-msg" id="error-proposed-dose">
              ${Icons.render('alert-circle', { size: 13, className: 'icon' })}
              Please enter a proposed dosage value.
            </div>
          </div>

          <!-- Row: Effective Date & Time -->
          <div class="form-row-2col">
            <div class="form-field-group">
              <label class="form-label" for="input-effective-date">
                Effective Date <span class="form-label-required">*</span>
              </label>
              <input
                type="date"
                id="input-effective-date"
                class="form-input-text"
                value="${adjustData.effectiveDate}">
              <div class="field-error-msg" id="error-effective-date">
                ${Icons.render('alert-circle', { size: 13, className: 'icon' })}
                Please select an effective date.
              </div>
            </div>
            <div class="form-field-group">
              <label class="form-label" for="input-frequency">
                Dose Frequency <span class="form-label-required">*</span>
              </label>
              <select id="input-frequency" class="form-select">
                <option value="Once Daily (Morning with meal)" ${adjustData.frequency.includes('Morning') ? 'selected' : ''}>Once Daily (Morning with meal)</option>
                <option value="Once Daily (Evening with dinner)" ${adjustData.frequency.includes('Evening') ? 'selected' : ''}>Once Daily (Evening with dinner)</option>
                <option value="Twice Daily (Morning & Evening)">Twice Daily (Morning &amp; Evening)</option>
              </select>
            </div>
          </div>

          <!-- Input: Administration Instructions -->
          <div class="form-field-group">
            <label class="form-label" for="input-instructions">
              Administration Instructions
            </label>
            <textarea
              id="input-instructions"
              class="form-textarea"
              rows="3"
              placeholder="Enter patient-specific administration guidelines...">${escapeHtml(adjustData.instructions)}</textarea>
          </div>

          <!-- Input: Clinical Reason (Required) -->
          <div class="form-field-group">
            <label class="form-label" for="input-reason">
              <span>Clinical Note / Reason for Change <span class="form-label-required">*</span></span>
              <span style="font-size:11px;color:var(--color-text-muted)">Recorded in permanent audit log</span>
            </label>
            <textarea
              id="input-reason"
              class="form-textarea"
              rows="2"
              placeholder="e.g. Completed scheduled in-clinic escalation challenge without symptoms...">${escapeHtml(adjustData.reason)}</textarea>
            <div class="field-error-msg" id="error-reason">
              ${Icons.render('alert-circle', { size: 13, className: 'icon' })}
              Clinical note/reason is required for all treatment modifications.
            </div>
          </div>

          <div style="font-size:11px;color:var(--color-text-muted);display:flex;align-items:center;gap:6px">
            ${Icons.render('shield-check', { size: 14, className: 'icon' })}
            <span>Safe2Bite Safety Standard: The system never automatically infers or calculates doses.</span>
          </div>

        </div>
      `;

      footer.innerHTML = `
        <button type="button" class="btn-clinical-secondary" onclick="Treatment.closeAllModals()">Cancel</button>
        <button type="button" class="btn-clinical-primary" onclick="Treatment.validateAndAdvanceStep()">
          Continue to Review &rarr;
        </button>
      `;
    }

    // STEP 2: REVIEW CHANGE
    else if (adjustStep === 2) {
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">
          
          <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">
            Please review the proposed dosage modification carefully. Upon confirmation, this change will be recorded in the patient's permanent clinical audit ledger.
          </div>

          <!-- Side by Side Review Grid -->
          <div class="review-comparison-grid">
            
            <!-- CURRENT -->
            <div class="review-box">
              <div class="review-box-header">
                <span>Current Protocol</span>
                <span class="s2b-badge ${p.statusClass}">Current</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">Prescribed Dose:</span>
                <span class="review-field-val">${p.currentDose}</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">Frequency:</span>
                <span class="review-field-val">${p.frequency}</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">Instructions:</span>
                <span style="font-size:12px;color:var(--color-text-secondary);line-height:1.4">${p.administrationInstructions}</span>
              </div>
            </div>

            <!-- PROPOSED -->
            <div class="review-box proposed">
              <div class="review-box-header">
                <span>Proposed Change</span>
                <span class="s2b-badge badge-treat-active" style="background:#86EFAC;color:#14532D">New</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">New Prescribed Dose:</span>
                <span class="review-field-val" style="color:#15803D;font-size:16px">${adjustData.newDose}</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">Effective Date:</span>
                <span class="review-field-val">${adjustData.effectiveDate}</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">New Frequency:</span>
                <span class="review-field-val">${adjustData.frequency}</span>
              </div>
              <div class="review-field-item">
                <span class="review-field-name">Updated Instructions:</span>
                <span style="font-size:12px;color:#166534;line-height:1.4">${adjustData.instructions}</span>
              </div>
            </div>

          </div>

          <!-- Clinical Note Box -->
          <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4)">
            <span style="font-size:11px;text-transform:uppercase;color:var(--color-text-secondary);font-weight:bold">Clinician Clinical Reason:</span>
            <p style="margin:4px 0 0;font-size:var(--font-size-sm);color:var(--color-text-primary);font-style:italic">"${adjustData.reason}"</p>
          </div>

          <div style="padding:var(--space-2-5);background:#F8FAFC;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:11px;color:var(--color-text-secondary)">
            Clinician: <strong>Dr. Sarah Chen, MD</strong> &bull; Changes take effect on the specified date.
          </div>

        </div>
      `;

      footer.innerHTML = `
        <button type="button" class="btn-clinical-secondary" onclick="Treatment.goBackStep(1)">&larr; Back to Edit</button>
        <button type="button" class="btn-clinical-primary" onclick="Treatment.confirmTreatmentChange()" id="btn-confirm-treatment-change">
          ${Icons.render('check', { size: 15, className: 'icon' })}
          Confirm Treatment Change
        </button>
      `;
    }

    // STEP 3: SUCCESS / CONFIRMATION
    else if (adjustStep === 3) {
      body.innerHTML = `
        <div class="confirmation-success-state">
          <div class="success-icon-badge">
            ${Icons.render('check', { size: 30, strokeWidth: 2.5, className: 'icon' })}
          </div>
          <h3 class="success-title">Treatment Updated Successfully</h3>
          <p class="success-subtitle">
            The treatment change has been recorded in the clinical ledger and updated in ${p.name}'s protocol.
          </p>

          <div class="confirmation-receipt-card">
            <div class="receipt-row">
              <span class="receipt-label">Patient:</span>
              <span class="receipt-val">${p.name} (${p.patientId})</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Target Allergen:</span>
              <span class="receipt-val">${p.allergen.split('(')[0].trim()}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">New Prescribed Dose:</span>
              <span class="receipt-val" style="color:var(--color-primary-dark)">${adjustData.newDose}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Effective Date:</span>
              <span class="receipt-val">${adjustData.effectiveDate}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Authorized By:</span>
              <span class="receipt-val">Dr. Sarah Chen, MD</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Recorded At:</span>
              <span class="receipt-val">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          </div>
        </div>
      `;

      footer.innerHTML = `
        <button type="button" class="btn-clinical-primary" onclick="Treatment.finishAdjustment()">
          View Updated Treatment
        </button>
      `;
    }
  }

  /* --------------------------------------------------
     Validate Step 1 Form
     -------------------------------------------------- */
  function validateAndAdvanceStep() {
    const doseInput = document.getElementById('input-proposed-dose');
    const dateInput = document.getElementById('input-effective-date');
    const freqInput = document.getElementById('input-frequency');
    const instInput = document.getElementById('input-instructions');
    const reasonInput = document.getElementById('input-reason');

    let isValid = true;

    // Reset error displays
    document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.form-input-text, .form-textarea').forEach(el => el.classList.remove('has-error'));

    if (!doseInput || !doseInput.value.trim()) {
      isValid = false;
      document.getElementById('error-proposed-dose').classList.add('visible');
      if (doseInput) doseInput.classList.add('has-error');
    }

    if (!dateInput || !dateInput.value.trim()) {
      isValid = false;
      document.getElementById('error-effective-date').classList.add('visible');
      if (dateInput) dateInput.classList.add('has-error');
    }

    if (!reasonInput || !reasonInput.value.trim()) {
      isValid = false;
      document.getElementById('error-reason').classList.add('visible');
      if (reasonInput) reasonInput.classList.add('has-error');
    }

    if (!isValid) return;

    adjustData.newDose = doseInput.value.trim();
    adjustData.effectiveDate = dateInput.value.trim();
    adjustData.frequency = freqInput ? freqInput.value : adjustData.frequency;
    adjustData.instructions = instInput ? instInput.value.trim() : '';
    adjustData.reason = reasonInput.value.trim();

    adjustStep = 2;
    renderAdjustStep();
  }

  function goBackStep(step) {
    adjustStep = step;
    renderAdjustStep();
  }

  /* --------------------------------------------------
     Confirm Treatment Change & Apply State
     -------------------------------------------------- */
  function confirmTreatmentChange() {
    const p = treatmentStore[adjustData.patientId];
    if (!p) return;

    const previousDose = p.currentDose;
    const timestampStr = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    // 1. Update Patient Treatment Record
    p.currentDose = adjustData.newDose;
    p.frequency = adjustData.frequency;
    if (adjustData.instructions) p.administrationInstructions = adjustData.instructions;
    p.lastUpdated = `${adjustData.effectiveDate} by Dr. Sarah Chen`;
    p.clinicianNotes = adjustData.reason;

    // 2. Add to Recent Changes List
    p.recentChanges.unshift({
      id: `CHG-${Date.now().toString().slice(-4)}`,
      date: timestampStr,
      type: 'Dose Escalation',
      previousValue: previousDose,
      newValue: adjustData.newDose,
      effectiveDate: adjustData.effectiveDate,
      clinician: 'Dr. Sarah Chen, MD',
      reason: adjustData.reason,
      status: 'Active'
    });

    // 3. Add to Immutable Audit Trail
    p.auditTrail.unshift({
      timestamp: timestampStr,
      clinician: 'Dr. Sarah Chen, MD (SC)',
      action: 'Dose Adjustment Authorized',
      previousValue: previousDose,
      newValue: adjustData.newDose,
      effectiveDate: adjustData.effectiveDate,
      reason: adjustData.reason,
      status: 'Authorized & Applied'
    });

    // 4. Update Upcoming Scheduled Doses
    p.upcomingDoses.forEach(dose => {
      dose.doseAmount = adjustData.newDose;
    });

    // 5. Synchronize with PatientOverview if currently active
    syncWithPatientOverview(adjustData.patientId, p);

    // Advance to Step 3 (Success)
    adjustStep = 3;
    renderAdjustStep();
  }

  function finishAdjustment() {
    closeAllModals();
    openPatientTreatment(adjustData.patientId);
  }

  /* --------------------------------------------------
     Pause / Resume Treatment Workflow
     -------------------------------------------------- */
  function openPauseResumeModal(patientId, action) {
    if (currentRole !== 'doctor') {
      alert('Access Restricted: You are currently viewing in Read-Only Care Team mode. Switch to Doctor role to manage treatment status.');
      return;
    }

    const p = treatmentStore[patientId];
    if (!p) return;

    const modalBody = document.getElementById('pause-modal-body');
    const modalFooter = document.getElementById('pause-modal-footer');
    const modalTitle = document.getElementById('pause-modal-title');
    if (!modalBody || !modalFooter) return;

    const isPausing = action === 'pause';

    modalTitle.innerHTML = `
      ${Icons.render(isPausing ? 'pause-circle' : 'play', { size: 18, className: 'icon' })}
      ${isPausing ? 'Pause Treatment Protocol?' : 'Resume Treatment Protocol?'}
    `;

    modalBody.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:var(--space-3-5)">
        <div style="padding:var(--space-3-5) var(--space-4);background:${isPausing ? '#FEF3C7' : '#D1FAE5'};border:1px solid ${isPausing ? '#FDE68A' : '#A7F3D0'};border-radius:var(--radius-lg);font-size:var(--font-size-sm);color:${isPausing ? '#92400E' : '#065F46'}">
          ${isPausing
            ? `You are about to pause <strong>${p.name}'s</strong> OIT protocol. All scheduled upcoming doses will be placed on hold pending clinician clearance.`
            : `You are about to resume <strong>${p.name}'s</strong> active dosing schedule. Regular daily doses will be reactivated.`
          }
        </div>

        <div class="form-field-group">
          <label class="form-label" for="input-status-change-reason">
            Clinical Reason for Status Change <span class="form-label-required">*</span>
          </label>
          <textarea
            id="input-status-change-reason"
            class="form-textarea"
            rows="3"
            placeholder="${isPausing ? 'e.g. Dose held due to reported acute viral illness with fever...' : 'e.g. Patient afebrile >24h and fully recovered. Cleared to resume...'}"></textarea>
          <div class="field-error-msg" id="error-status-reason">
            ${Icons.render('alert-circle', { size: 13, className: 'icon' })}
            A clinical reason is required before modifying treatment status.
          </div>
        </div>

        <div style="font-size:11px;color:var(--color-text-muted)">
          Authorized clinician: <strong>Dr. Sarah Chen, MD</strong>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn-clinical-secondary" onclick="Treatment.closeAllModals()">Cancel</button>
      <button type="button" class="${isPausing ? 'btn-clinical-warning' : 'btn-clinical-success'}" onclick="Treatment.confirmPauseResume('${patientId}', '${action}')">
        ${isPausing ? 'Confirm Pause' : 'Confirm Resume'}
      </button>
    `;

    openModal('treatment-modal-pause-resume');
  }

  function confirmPauseResume(patientId, action) {
    const reasonInput = document.getElementById('input-status-change-reason');
    if (!reasonInput || !reasonInput.value.trim()) {
      document.getElementById('error-status-reason').classList.add('visible');
      if (reasonInput) reasonInput.classList.add('has-error');
      return;
    }

    const reason = reasonInput.value.trim();
    const p = treatmentStore[patientId];
    if (!p) return;

    const isPausing = action === 'pause';
    const timestampStr = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    if (isPausing) {
      p.status = 'paused';
      p.statusLabel = 'Paused (Clinician Hold)';
      p.statusClass = 'badge-treat-paused';
      p.upcomingDoses.forEach(d => {
        d.status = 'Paused';
        d.statusClass = 'badge-treat-paused';
      });
    } else {
      p.status = 'active';
      p.statusLabel = 'Active';
      p.statusClass = 'badge-treat-active';
      p.upcomingDoses.forEach(d => {
        d.status = 'Scheduled';
        d.statusClass = 'badge-dose-upcoming';
      });
    }

    p.lastUpdated = `${timestampStr} by Dr. Sarah Chen`;
    p.clinicianNotes = reason;

    // Log to Changes and Audit
    p.recentChanges.unshift({
      id: `CHG-${Date.now().toString().slice(-4)}`,
      date: timestampStr,
      type: isPausing ? 'Protocol Paused' : 'Protocol Resumed',
      previousValue: isPausing ? 'Active' : 'Paused',
      newValue: isPausing ? 'Paused' : 'Active',
      effectiveDate: timestampStr.split(',')[0],
      clinician: 'Dr. Sarah Chen, MD',
      reason: reason,
      status: isPausing ? 'Paused' : 'Active'
    });

    p.auditTrail.unshift({
      timestamp: timestampStr,
      clinician: 'Dr. Sarah Chen, MD (SC)',
      action: isPausing ? 'Protocol Paused' : 'Protocol Resumed',
      previousValue: isPausing ? 'Active' : 'Paused',
      newValue: isPausing ? 'Paused' : 'Active',
      effectiveDate: timestampStr.split(',')[0],
      reason: reason,
      status: 'Applied'
    });

    // Sync with PatientOverview
    syncWithPatientOverview(patientId, p);

    closeAllModals();
    openPatientTreatment(patientId);
  }

  /* --------------------------------------------------
     Dose Detail Modal
     -------------------------------------------------- */
  function openDoseDetail(doseId) {
    const p = treatmentStore[currentPatientId || 'SB-00124'];
    if (!p) return;

    // Find dose in upcoming or history
    let dose = p.upcomingDoses.find(d => d.id === doseId);
    let isUpcoming = true;

    if (!dose) {
      dose = p.doseHistory.find(d => d.id === doseId);
      isUpcoming = false;
    }

    if (!dose) return;

    const body = document.getElementById('dose-detail-body');
    if (!body) return;

    const isMissed = dose.status === 'Missed' || dose.status === 'Held';

    body.innerHTML = `
      <div class="dose-detail-grid">
        
        <div class="dose-detail-header-card">
          <div>
            <span style="font-size:11px;color:var(--color-text-muted);text-transform:uppercase;font-weight:bold">Dose Record ID:</span>
            <div style="font-weight:bold;color:var(--color-text-primary)">${dose.id}</div>
            <div style="font-size:var(--font-size-xs);color:var(--color-text-secondary)">${dose.date} &bull; ${dose.time}</div>
          </div>
          <span class="s2b-badge ${dose.statusClass}" style="font-size:13px;padding:4px 10px">
            ${dose.status}
          </span>
        </div>

        <div class="plan-rows-list">
          <div class="plan-row-item">
            <span class="plan-row-title">Patient:</span>
            <span class="plan-row-value"><strong>${p.name} (${p.patientId})</strong></span>
          </div>
          <div class="plan-row-item">
            <span class="plan-row-title">Target Allergen:</span>
            <span class="plan-row-value">${dose.food || p.allergen}</span>
          </div>
          <div class="plan-row-item">
            <span class="plan-row-title">Prescribed Amount:</span>
            <span class="plan-row-value"><strong style="color:var(--color-primary-dark)">${dose.doseAmount}</strong></span>
          </div>
          <div class="plan-row-item">
            <span class="plan-row-title">Verification Method:</span>
            <span class="plan-row-value">${dose.confirmationMethod || dose.verifiedBy || 'Pending'}</span>
          </div>
          ${dose.notes ? `
            <div class="plan-row-item">
              <span class="plan-row-title">Observations / Notes:</span>
              <span class="plan-row-value" style="font-style:italic">"${dose.notes}"</span>
            </div>
          ` : ''}
        </div>

        <!-- If Missed or Not Taken: Display Clinician-Configured Instructions -->
        ${isMissed ? `
          <div class="dose-missed-alert-box">
            <div class="dose-missed-title">
              ${Icons.render('alert-triangle', { size: 16, className: 'icon' })}
              Clinician Missed-Dose Protocol:
            </div>
            <p class="dose-missed-instructions">
              ${p.missedDoseInstructions}
            </p>
          </div>
        ` : `
          <div class="plan-instructions-box">
            <div class="plan-instructions-header">
              ${Icons.render('info', { size: 14, className: 'icon' })}
              Clinician Administration Guidelines:
            </div>
            <p class="plan-instructions-text">${p.administrationInstructions}</p>
          </div>
        `}

        <div style="font-size:11px;color:var(--color-text-muted);display:flex;align-items:center;gap:6px">
          ${Icons.render('shield-check', { size: 13, className: 'icon' })}
          <span>Safe2Bite Protocol: All instructions are clinician-configured. The system never generates automated medical advice.</span>
        </div>

      </div>
    `;

    openModal('treatment-modal-dose-detail');
  }

  /* --------------------------------------------------
     Role Management (Doctor vs Care Team Read-Only)
     -------------------------------------------------- */
  function setRole(role) {
    currentRole = role;
    if (currentPatientId) {
      openPatientTreatment(currentPatientId);
    } else {
      renderGeneralView();
    }
  }

  /* --------------------------------------------------
     Helpers & Synchronizer
     -------------------------------------------------- */
  function syncWithPatientOverview(patientId, updatedRecord) {
    if (typeof PatientOverview !== 'undefined' && PatientOverview.getCurrentPatientId && PatientOverview.getCurrentPatientId() === patientId) {
      // Re-render PatientOverview subtab or summary if needed
      PatientOverview.loadPatient(patientId, false);
    }
  }

  function createPatientTreatmentFallback(patientId) {
    return {
      patientId: patientId,
      name: `Patient ${patientId}`,
      age: 8,
      dob: 'Jan 01, 2018',
      gender: 'Unknown',
      initials: 'PT',
      avatarColor: 'blue',
      careTeam: 'Safe2Bite Allergy Care Team · Austin, TX',
      assignedDoctor: 'Dr. Sarah Chen, MD (Allergist & Immunologist)',
      treatmentType: 'Food Allergy Oral Immunotherapy (OIT)',
      allergen: 'Peanut Protein (Arachis hypogaea)',
      status: 'active',
      statusLabel: 'Active',
      statusClass: 'badge-treat-active',
      currentPhase: 'Phase 2 — Build-Up',
      currentDose: '10 mg Peanut Protein',
      targetDose: '300 mg Peanut Protein (Maintenance Goal)',
      frequency: 'Once Daily (Morning with meal)',
      administrationInstructions: 'Administer with meal. Observe for 2 hours post-dose. No exercise for 2 hours post-dose.',
      startDate: 'May 01, 2026',
      lastUpdated: 'Sep 01, 2026 by Dr. Sarah Chen',
      adherenceRate: '96.0%',
      clinicianNotes: 'Routine home dosing progression.',
      missedDoseInstructions: 'CLINICIAN-CONFIGURED PROTOCOL: Skip missed dose if delayed >4 hours. Do not double dose.',
      upcomingDoses: [
        { id: 'DOSE-901', date: 'Tomorrow', time: '8:00 AM', food: 'Peanut Protein', doseAmount: '10 mg', status: 'Scheduled', statusClass: 'badge-dose-upcoming', instructions: 'Take with meal.', verifiedBy: 'Pending Caregiver' }
      ],
      doseHistory: [
        { id: 'DOSE-900', date: 'Today', time: '8:00 AM', food: 'Peanut Protein', doseAmount: '10 mg', status: 'Taken', statusClass: 'badge-dose-taken', confirmationMethod: 'Caregiver App Verified', notes: 'Normal tolerance.' }
      ],
      recentChanges: [],
      auditTrail: []
    };
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.treatment-modal-backdrop').forEach(m => m.classList.remove('open'));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* --------------------------------------------------
     Public API
     -------------------------------------------------- */
  return {
    init,
    renderGeneralView,
    openPatientTreatment,
    openAdjustModal,
    validateAndAdvanceStep,
    goBackStep,
    confirmTreatmentChange,
    finishAdjustment,
    openPauseResumeModal,
    confirmPauseResume,
    openDoseDetail,
    setRole,
    closeAllModals,
    getPatientRecord: (id) => treatmentStore[id]
  };

})();
