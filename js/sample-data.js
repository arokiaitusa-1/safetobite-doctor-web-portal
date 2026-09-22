/* ============================================================
   Safe2Bite Doctor Web Portal — Sample Data
   
   ALL data in this file is placeholder/demonstration data.
   Backend integration points are marked with:
   // TODO: Replace with API call to /api/endpoint
   
   Data structures are designed to match expected backend
   response shapes for easy future integration.
   ============================================================ */

const Safe2BiteData = {

  /* --------------------------------------------------
     Current Doctor / User
     TODO: Replace with API call to /api/auth/me
  -------------------------------------------------- */
  currentDoctor: {
    id: "DR-10042",
    firstName: "Sarah",
    lastName: "Chen",
    displayName: "Dr. Sarah Chen",
    initials: "SC",
    role: "Allergist & Immunologist",
    clinic: "Safe2Bite Allergy Care – Austin, TX",
    email: "s.chen@safe2bite.com",
    phone: "(512) 555-0192",
    status: "available", // available | busy | away
    lastLogin: "2026-09-16T14:52:00Z"
  },

  /* --------------------------------------------------
     Summary Stats
     TODO: Replace with API call to /api/dashboard/summary
  -------------------------------------------------- */
  summary: {
    totalActivePatients: 48,
    patientsRequiringAttention: 6,
    openAlerts: 9,
    unreadMessages: 4,
    upcomingDosesToday: 12,
    upcomingAppointmentsToday: 5,
    lastUpdated: "2026-09-16T20:20:00Z"
  },

  /* --------------------------------------------------
     Patients Requiring Attention
     TODO: Replace with API call to /api/dashboard/attention-queue
  -------------------------------------------------- */
  attentionQueue: [
    {
      id: "PT-20381",
      name: "Emma Vasquez",
      age: 8,
      initials: "EV",
      avatarColor: 0,
      alertType: "reaction-reported",
      alertLabel: "Reaction Reported",
      alertDetail: "Mild reaction — hives noted 2h post-dose",
      alertSeverity: "attention", // attention | review | info
      status: "attention",
      statusLabel: "Attention Required",
      lastActivity: "2026-09-16T18:34:00Z",
      lastActivityLabel: "Today, 6:34 PM",
      treatmentLabel: "Peanut OIT — Phase 3",
      patientVisible: true
    },
    {
      id: "PT-20417",
      name: "Liam Okafor",
      age: 12,
      initials: "LO",
      avatarColor: 1,
      alertType: "missed-dose",
      alertLabel: "Missed Dose",
      alertDetail: "Scheduled dose not taken — Day 3",
      alertSeverity: "attention",
      status: "attention",
      statusLabel: "Attention Required",
      lastActivity: "2026-09-16T08:00:00Z",
      lastActivityLabel: "Today, 8:00 AM",
      treatmentLabel: "Tree Nut OIT — Phase 1",
      patientVisible: true
    },
    {
      id: "PT-20299",
      name: "Sophia Nguyen",
      age: 6,
      initials: "SN",
      avatarColor: 5,
      alertType: "assessment-review",
      alertLabel: "Assessment Requires Review",
      alertDetail: "Illness assessment submitted by caregiver",
      alertSeverity: "review",
      status: "review",
      statusLabel: "Review Needed",
      lastActivity: "2026-09-16T15:10:00Z",
      lastActivityLabel: "Today, 3:10 PM",
      treatmentLabel: "Egg OIT — Phase 2",
      patientVisible: true
    },
    {
      id: "PT-20455",
      name: "Marcus Williams",
      age: 34,
      initials: "MW",
      avatarColor: 3,
      alertType: "patient-message",
      alertLabel: "Patient Message",
      alertDetail: "Question about today's dose timing",
      alertSeverity: "info",
      status: "review",
      statusLabel: "Review Needed",
      lastActivity: "2026-09-16T17:45:00Z",
      lastActivityLabel: "Today, 5:45 PM",
      treatmentLabel: "Dairy OIT — Maintenance",
      patientVisible: true
    },
    {
      id: "PT-20312",
      name: "Ava Thompson",
      age: 9,
      initials: "AT",
      avatarColor: 4,
      alertType: "dose-not-taken",
      alertLabel: "Dose Not Taken",
      alertDetail: "Patient reported unable to take dose — illness",
      alertSeverity: "review",
      status: "review",
      statusLabel: "Review Needed",
      lastActivity: "2026-09-16T12:20:00Z",
      lastActivityLabel: "Today, 12:20 PM",
      treatmentLabel: "Wheat OIT — Phase 2",
      patientVisible: true
    },
    {
      id: "PT-20488",
      name: "Noah Patel",
      age: 15,
      initials: "NP",
      avatarColor: 7,
      alertType: "new-assessment",
      alertLabel: "Health Assessment Submitted",
      alertDetail: "Weekly health check submitted for review",
      alertSeverity: "review",
      status: "review",
      statusLabel: "Review Needed",
      lastActivity: "2026-09-16T10:05:00Z",
      lastActivityLabel: "Today, 10:05 AM",
      treatmentLabel: "Tree Nut OIT — Phase 2",
      patientVisible: true
    }
  ],

  /* --------------------------------------------------
     Pass 6: Active Clinical Alerts Directory & Monitoring
     Covers all 8 clinical event types, configured severities,
     recorded event details, audit trail & clinician review notes.
     IMPORTANT: Severities represent clinician-configured rules,
     never automated AI diagnoses or medical conclusions.
  -------------------------------------------------- */
  alerts: [
    {
      id: "ALT-2026-101",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      patientAge: 10,
      patientInitials: "MV",
      avatarColor: 2,
      caregiver: "David Vance (Father)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Peanut OIT — Phase 2",
      treatmentStatusClass: "badge-green",
      type: "reaction-report",
      typeLabel: "Reaction Report",
      summary: "Reaction submitted after today's dose",
      severity: "critical",
      severityLabel: "Critical",
      severityReason: "Configured Rule: Reaction reported within 60 minutes post-dose",
      status: "new",
      statusLabel: "New",
      occurredAt: "2026-09-17T09:12:00Z",
      occurredLabel: "Sep 17, 2026 · 9:12 AM",
      dateGroup: "today",
      assignedTo: "Dr. Sarah Chen",
      source: "Patient Mobile App",
      eventDetails: {
        reportedSymptoms: ["Localized hives on torso and neck", "Mild lip itchiness"],
        patientSelectedSeverity: "Moderate",
        reportedTime: "Sep 17, 2026 · 9:12 AM (22 min post-dose)",
        associatedDose: "Dose #48 — 20mg Peanut Protein",
        patientNotes: "Took morning dose at 8:50 AM with oatmeal. Hives appeared at 9:10 AM on chest and neck. Administered 10mg Cetirizine per approved emergency care plan. Breathing completely unlabored. Caregiver requesting physician call back.",
        emergencyPathwayFollowed: true,
        emergencyCarePlanStep: "Step 1: Antihistamine administered per clinician-approved action plan"
      },
      clinicalRecordLink: {
        tab: "reactions",
        label: "View Reaction in Patient Record"
      },
      timeline: [
        { time: "Sep 17, 9:12 AM", user: "Marcus Vance (Caregiver)", action: "Reaction report submitted via Safe2Bite Mobile App" },
        { time: "Sep 17, 9:13 AM", user: "System Monitor", action: "Configured workflow rule triggered Critical priority based on reaction timing" },
        { time: "Sep 17, 9:14 AM", user: "System", action: "Notification dispatched to Dr. Sarah Chen" }
      ],
      notes: [
        {
          id: "NOTE-101-1",
          author: "Dr. Sarah Chen",
          role: "Attending Allergist",
          time: "Sep 17, 9:20 AM",
          text: "Phone check completed with David Vance (father). Hives receding, patient comfortable. Instructed to keep resting and hold strenuous physical activity today. Hold tomorrow morning's dose until review."
        }
      ]
    },
    {
      id: "ALT-2026-102",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      patientAge: 8,
      patientInitials: "EV",
      avatarColor: 0,
      caregiver: "Elena Vasquez (Mother)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Peanut OIT — Phase 3",
      treatmentStatusClass: "badge-green",
      type: "reaction-report",
      typeLabel: "Reaction Report",
      summary: "Mild hives noted 2h post-dose",
      severity: "high",
      severityLabel: "High",
      severityReason: "Configured Rule: Post-escalation reaction reporting threshold",
      status: "under-review",
      statusLabel: "Under Review",
      occurredAt: "2026-09-16T18:34:00Z",
      occurredLabel: "Sep 16, 2026 · 6:34 PM",
      dateGroup: "today",
      assignedTo: "Dr. Sarah Chen",
      source: "Patient Mobile App",
      eventDetails: {
        reportedSymptoms: ["Scattered red hives on forearms", "Mild itching"],
        patientSelectedSeverity: "Mild",
        reportedTime: "Sep 16, 2026 · 6:34 PM (110 min post-dose)",
        associatedDose: "Dose #74 — 40mg Peanut Protein",
        patientNotes: "Emma noticed itching on both arms before dinner. Checked arms and saw 4-5 hives. No facial swelling, cough, or stomach complaint. Applied cool compress.",
        emergencyPathwayFollowed: false,
        emergencyCarePlanStep: "Monitored at home — no emergency medication required per caregiver judgment"
      },
      clinicalRecordLink: {
        tab: "reactions",
        label: "View Reaction in Patient Record"
      },
      timeline: [
        { time: "Sep 16, 6:34 PM", user: "Elena Vasquez", action: "Submitted reaction entry from home" },
        { time: "Sep 16, 6:36 PM", user: "System Monitor", action: "Alert categorized as High priority per Phase 3 protocol settings" },
        { time: "Sep 16, 6:50 PM", user: "Dr. Sarah Chen", action: "Alert opened and marked Under Review" }
      ],
      notes: [
        {
          id: "NOTE-102-1",
          author: "Dr. Sarah Chen",
          role: "Attending Allergist",
          time: "Sep 16, 7:15 PM",
          text: "Reviewed photos submitted with log. Mild urticaria limited to bilateral forearms. Discussed repeating 40mg with food tomorrow under parent observation; will follow up tomorrow evening."
        }
      ]
    },
    {
      id: "ALT-2026-103",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      patientAge: 12,
      patientInitials: "LO",
      avatarColor: 1,
      caregiver: "Chidi Okafor (Father)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Tree Nut OIT — Phase 1",
      treatmentStatusClass: "badge-amber",
      type: "missed-dose",
      typeLabel: "Missed Dose",
      summary: "Scheduled dose not taken — Day 3 consecutive",
      severity: "high",
      severityLabel: "High",
      severityReason: "Configured Rule: 3 consecutive unconfirmed doses triggers protocol review",
      status: "open",
      statusLabel: "Open",
      occurredAt: "2026-09-17T08:00:00Z",
      occurredLabel: "Sep 17, 2026 · 8:00 AM",
      dateGroup: "today",
      assignedTo: "Nurse Elena Rostova",
      source: "Automated Protocol Monitor",
      eventDetails: {
        scheduledDose: "Dose #14 — 12mg Walnut Protein",
        scheduledTime: "Sep 16, 2026 · 8:00 PM",
        doseStatus: "Unconfirmed / Missed (3 consecutive days)",
        patientReason: "Family traveling / forgot dose kit at home",
        patientNotes: "We had an unexpected trip out of town and did not pack the cold pack container. We will be back tonight."
      },
      clinicalRecordLink: {
        tab: "doses",
        label: "View Dose Schedule in Patient Record"
      },
      timeline: [
        { time: "Sep 17, 8:00 AM", user: "Automated Monitor", action: "Dose window expired without confirmation — consecutive missed threshold met" },
        { time: "Sep 17, 8:05 AM", user: "System", action: "Assigned to Nurse Elena Rostova for compliance outreach" }
      ],
      notes: [
        {
          id: "NOTE-103-1",
          author: "Nurse Elena Rostova",
          role: "Clinical Care Coordinator",
          time: "Sep 17, 8:30 AM",
          text: "Left voicemail for father. Per Safe2Bite protocol, after 3 consecutive missed doses, patient must receive clinician guidance on re-entry dose before resuming home administration."
        }
      ]
    },
    {
      id: "ALT-2026-104",
      patientId: "PT-20412",
      patientName: "Liam Patel",
      patientAge: 7,
      patientInitials: "LP",
      avatarColor: 4,
      caregiver: "Meera Patel (Mother)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Cashew OIT — Phase 1",
      treatmentStatusClass: "badge-amber",
      type: "illness-report",
      typeLabel: "Illness / Sick Report",
      summary: "Active fever (101.4°F) & gastrointestinal upset reported",
      severity: "high",
      severityLabel: "High",
      severityReason: "Configured Rule: System illness hold requirement for fever > 100.4°F",
      status: "new",
      statusLabel: "New",
      occurredAt: "2026-09-17T07:45:00Z",
      occurredLabel: "Sep 17, 2026 · 7:45 AM",
      dateGroup: "today",
      assignedTo: "Dr. Sarah Chen",
      source: "Caregiver Portal",
      eventDetails: {
        illnessStatus: "Active Illness — Treatment Hold Recommended",
        reportedSymptoms: ["Fever (101.4°F)", "Vomiting once overnight", "Fatigue"],
        onsetTime: "Sep 16, 2026 · 11:00 PM",
        patientNotes: "Liam woke up vomiting around 11 PM and felt hot. Temperature measured 101.4°F at 7:30 AM. He has not taken his morning cashew dose. App advised sick day hold.",
        doseHeld: "Morning Dose #21 withheld by caregiver pending doctor review"
      },
      clinicalRecordLink: {
        tab: "illness",
        label: "View Illness Record in Patient Record"
      },
      timeline: [
        { time: "Sep 17, 7:45 AM", user: "Meera Patel", action: "Submitted sick day report via Caregiver Portal" },
        { time: "Sep 17, 7:46 AM", user: "System Monitor", action: "Generated Illness Hold alert per pediatric protocol safety rules" }
      ],
      notes: []
    },
    {
      id: "ALT-2026-105",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      patientAge: 6,
      patientInitials: "SN",
      avatarColor: 5,
      caregiver: "Hanh Nguyen (Mother)",
      careTeam: "Nurse Elena Rostova",
      treatmentProtocol: "Egg OIT — Phase 2",
      treatmentStatusClass: "badge-green",
      type: "assessment-review",
      typeLabel: "Health Assessment Requires Review",
      summary: "Pre-dose check: Mild cold symptoms & congestion reported",
      severity: "medium",
      severityLabel: "Medium",
      severityReason: "Configured Rule: Symptom questionnaire flagged for clinical clearance",
      status: "under-review",
      statusLabel: "Under Review",
      occurredAt: "2026-09-16T15:10:00Z",
      occurredLabel: "Sep 16, 2026 · 3:10 PM",
      dateGroup: "yesterday",
      assignedTo: "Nurse Elena Rostova",
      source: "Patient Mobile App",
      eventDetails: {
        assessmentType: "Daily Pre-Dose Health Safety Checklist",
        submittedResponses: [
          { question: "Any fever within last 24 hours?", answer: "No (98.6°F)" },
          { question: "Any cough, wheezing, or asthma symptoms?", answer: "Mild nasal congestion, no cough" },
          { question: "Any gastrointestinal discomfort or nausea?", answer: "No" },
          { question: "Any strenuous exercise scheduled within 2h of dose?", answer: "No" },
          { question: "Any concurrent medications taken today?", answer: "Saline nasal spray" }
        ],
        patientNotes: "Just a mild runny nose from preschool. Sophia is acting energetic and eating normally."
      },
      clinicalRecordLink: {
        tab: "assessments",
        label: "View Assessment in Patient Record"
      },
      timeline: [
        { time: "Sep 16, 3:10 PM", user: "Hanh Nguyen", action: "Daily pre-dose assessment submitted" },
        { time: "Sep 16, 3:15 PM", user: "Nurse Elena Rostova", action: "Opened assessment and initiated review" }
      ],
      notes: [
        {
          id: "NOTE-105-1",
          author: "Nurse Elena Rostova",
          role: "Clinical Care Coordinator",
          time: "Sep 16, 3:30 PM",
          text: "Reviewed responses. No lower respiratory involvement or fever. Safe to proceed with normal Phase 2 dose with parent observation. Communicated via in-app message."
        }
      ]
    },
    {
      id: "ALT-2026-106",
      patientId: "PT-20312",
      patientName: "Ava Thompson",
      patientAge: 9,
      patientInitials: "AT",
      avatarColor: 4,
      caregiver: "Rachel Thompson (Mother)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Wheat OIT — Phase 2",
      treatmentStatusClass: "badge-green",
      type: "dose-not-taken",
      typeLabel: "Dose Not Taken",
      summary: "Patient declined dose — mild nausea before dinner",
      severity: "medium",
      severityLabel: "Medium",
      severityReason: "Configured Rule: Proactively declined dose requires caregiver check",
      status: "open",
      statusLabel: "Open",
      occurredAt: "2026-09-16T12:20:00Z",
      occurredLabel: "Sep 16, 2026 · 12:20 PM",
      dateGroup: "yesterday",
      assignedTo: "Dr. Sarah Chen",
      source: "Patient Mobile App",
      eventDetails: {
        scheduledDose: "Dose #32 — 15mg Wheat Protein",
        scheduledTime: "Sep 16, 2026 · 12:00 PM",
        doseStatus: "Not Taken / Held by Caregiver",
        patientReason: "Stomach upset before scheduled dose",
        patientNotes: "Ava complained of tummy ache right before lunch. Decided not to give wheat dose until tummy settles."
      },
      clinicalRecordLink: {
        tab: "doses",
        label: "View Dose in Patient Record"
      },
      timeline: [
        { time: "Sep 16, 12:20 PM", user: "Rachel Thompson", action: "Logged 'Dose Not Taken' with reason" },
        { time: "Sep 16, 12:22 PM", user: "System", action: "Alert queued for clinical review" }
      ],
      notes: []
    },
    {
      id: "ALT-2026-107",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      patientAge: 34,
      patientInitials: "MW",
      avatarColor: 3,
      caregiver: "Self (Adult Patient)",
      careTeam: "Dr. Michael Lee",
      treatmentProtocol: "Dairy OIT — Maintenance",
      treatmentStatusClass: "badge-green",
      type: "patient-message",
      typeLabel: "Patient Message",
      summary: "Question regarding dose timing during morning marathon training",
      severity: "low",
      severityLabel: "Low",
      severityReason: "Configured Rule: Standard clinical question queue",
      status: "under-review",
      statusLabel: "Under Review",
      occurredAt: "2026-09-16T17:45:00Z",
      occurredLabel: "Sep 16, 2026 · 5:45 PM",
      dateGroup: "yesterday",
      assignedTo: "Dr. Michael Lee",
      source: "Patient Portal Messaging",
      eventDetails: {
        messageSubject: "Dose timing and long morning run",
        messageContent: "Hi Dr. Lee, I have a 10-mile training run planned for Saturday at 7 AM. Should I take my maintenance milk dose before running or wait 2-3 hours after finishing to prevent exercise-induced reactions?",
        patientUrgency: "Normal",
        submissionTime: "Sep 16, 2026 · 5:45 PM"
      },
      clinicalRecordLink: {
        tab: "treatment",
        label: "View Treatment Plan in Patient Record"
      },
      timeline: [
        { time: "Sep 16, 5:45 PM", user: "Marcus Williams", action: "Message sent via portal" },
        { time: "Sep 16, 6:00 PM", user: "Dr. Michael Lee", action: "Message assigned to personal queue" }
      ],
      notes: [
        {
          id: "NOTE-107-1",
          author: "Dr. Michael Lee",
          role: "Associate Allergist",
          time: "Sep 17, 8:15 AM",
          text: "Drafted reply: per Safe2Bite exercise protocol, never dose within 2h before or after vigorous exercise. Recommended taking Saturday dose in the late afternoon after full recovery and hydration."
        }
      ]
    },
    {
      id: "ALT-2026-108",
      patientId: "PT-20490",
      patientName: "Noah Kim",
      patientAge: 11,
      patientInitials: "NK",
      avatarColor: 6,
      caregiver: "Grace Kim (Mother)",
      careTeam: "Dr. Michael Lee",
      treatmentProtocol: "Walnut OIT — Phase 2",
      treatmentStatusClass: "badge-green",
      type: "treatment-change",
      typeLabel: "Treatment Change",
      summary: "Titration milestone reached: 14 consecutive days completed with 0 reactions",
      severity: "medium",
      severityLabel: "Medium",
      severityReason: "Configured Rule: Automated protocol titration eligibility flag",
      status: "new",
      statusLabel: "New",
      occurredAt: "2026-09-17T06:00:00Z",
      occurredLabel: "Sep 17, 2026 · 6:00 AM",
      dateGroup: "today",
      assignedTo: "Dr. Michael Lee",
      source: "Automated Protocol Engine",
      eventDetails: {
        milestoneType: "Phase 2 Dose Escalation Eligibility",
        currentDoseLevel: "Dose #28 — 25mg Walnut Protein",
        consecutiveDays: "14 days at current dose with 100% adherence",
        reactionCount: "0 reported adverse reactions during cycle",
        nextScheduledEscalation: "Eligible for in-clinic challenge or escalation to 50mg"
      },
      clinicalRecordLink: {
        tab: "treatment",
        label: "View Treatment Management Protocol"
      },
      timeline: [
        { time: "Sep 17, 6:00 AM", user: "Protocol Engine", action: "Milestone reached: 14 days consecutive compliance" },
        { time: "Sep 17, 6:01 AM", user: "System", action: "Titration review alert generated and routed to Dr. Michael Lee" }
      ],
      notes: []
    },
    {
      id: "ALT-2026-109",
      patientId: "PT-20355",
      patientName: "Sofia Rodriguez",
      patientAge: 14,
      patientInitials: "SR",
      avatarColor: 7,
      caregiver: "Carlos Rodriguez (Father)",
      careTeam: "Nurse Elena Rostova",
      treatmentProtocol: "Sesame OIT — Phase 3",
      treatmentStatusClass: "badge-green",
      type: "appointment-item",
      typeLabel: "Appointment-related item",
      summary: "In-clinic challenge visit due in 4 days — appointment confirmation pending",
      severity: "low",
      severityLabel: "Low",
      severityReason: "Configured Rule: Routine appointment coordination reminder",
      status: "open",
      statusLabel: "Open",
      occurredAt: "2026-09-16T09:00:00Z",
      occurredLabel: "Sep 16, 2026 · 9:00 AM",
      dateGroup: "yesterday",
      assignedTo: "Nurse Elena Rostova",
      source: "Scheduling System",
      eventDetails: {
        appointmentType: "Phase 3 In-Clinic Escalation Challenge",
        scheduledDate: "Monday, Sep 21, 2026 · 10:30 AM",
        provider: "Dr. Sarah Chen / Nurse Elena Rostova",
        status: "Pending Caregiver Confirmation (SMS reminder sent)"
      },
      clinicalRecordLink: {
        tab: "treatment",
        label: "View Patient Record"
      },
      timeline: [
        { time: "Sep 16, 9:00 AM", user: "Scheduling System", action: "Automatic alert for unconfirmed challenge visit" }
      ],
      notes: []
    },
    {
      id: "ALT-2026-110",
      patientId: "SB-00124",
      patientName: "Sarah Johnson",
      patientAge: 8,
      patientInitials: "SJ",
      avatarColor: 0,
      caregiver: "Linda Johnson (Mother)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Peanut OIT — Phase 3",
      treatmentStatusClass: "badge-green",
      type: "assessment-review",
      typeLabel: "Health Assessment Requires Review",
      summary: "Bi-weekly health assessment completed with zero flags",
      severity: "low",
      severityLabel: "Low",
      severityReason: "Configured Rule: Periodic compliance check",
      status: "resolved",
      statusLabel: "Resolved",
      occurredAt: "2026-09-15T14:30:00Z",
      occurredLabel: "Sep 15, 2026 · 2:30 PM",
      dateGroup: "past",
      assignedTo: "Dr. Sarah Chen",
      source: "Patient Mobile App",
      eventDetails: {
        assessmentType: "Bi-Weekly Comprehensive Health & Lifestyle Survey",
        submittedResponses: [
          { question: "Any allergic reactions in past 14 days?", answer: "No" },
          { question: "Any difficulty swallowing or food refusal?", answer: "No" },
          { question: "EpiPen availability confirmed?", answer: "Yes (Checked expiration: 04/2027)" }
        ],
        patientNotes: "Sarah is doing great with Phase 3 breakfast routine."
      },
      clinicalRecordLink: {
        tab: "assessments",
        label: "View Assessment in Patient Record"
      },
      timeline: [
        { time: "Sep 15, 2:30 PM", user: "Linda Johnson", action: "Survey submitted" },
        { time: "Sep 15, 4:10 PM", user: "Dr. Sarah Chen", action: "Reviewed responses and marked Resolved" }
      ],
      notes: [
        {
          id: "NOTE-110-1",
          author: "Dr. Sarah Chen",
          role: "Attending Allergist",
          time: "Sep 15, 4:10 PM",
          text: "All safety metrics verified. Routine bi-weekly review completed. Continue current protocol."
        }
      ]
    },
    {
      id: "ALT-2026-111",
      patientId: "PT-20488",
      patientName: "Noah Patel",
      patientAge: 15,
      patientInitials: "NP",
      avatarColor: 7,
      caregiver: "Sunita Patel (Mother)",
      careTeam: "Dr. Sarah Chen",
      treatmentProtocol: "Tree Nut OIT — Phase 2",
      treatmentStatusClass: "badge-green",
      type: "reaction-report",
      typeLabel: "Reaction Report",
      summary: "Resolved mild abdominal cramping after maintenance dose",
      severity: "medium",
      severityLabel: "Medium",
      severityReason: "Configured Rule: Single gastrointestinal reaction symptom",
      status: "resolved",
      statusLabel: "Resolved",
      occurredAt: "2026-09-15T11:20:00Z",
      occurredLabel: "Sep 15, 2026 · 11:20 AM",
      dateGroup: "past",
      assignedTo: "Nurse Elena Rostova",
      source: "Patient Mobile App",
      eventDetails: {
        reportedSymptoms: ["Mild abdominal cramping"],
        patientSelectedSeverity: "Mild",
        reportedTime: "Sep 15, 2026 · 11:20 AM (45 min post-dose)",
        associatedDose: "Dose #30 — 30mg Cashew Protein",
        patientNotes: "Cramp lasted about 15 minutes and resolved on its own after drinking warm water."
      },
      clinicalRecordLink: {
        tab: "reactions",
        label: "View Reaction in Patient Record"
      },
      timeline: [
        { time: "Sep 15, 11:20 AM", user: "Noah Patel", action: "Reported symptom" },
        { time: "Sep 15, 1:00 PM", user: "Nurse Elena Rostova", action: "Followed up with caregiver, logged resolution" }
      ],
      notes: [
        {
          id: "NOTE-111-1",
          author: "Nurse Elena Rostova",
          role: "Clinical Care Coordinator",
          time: "Sep 15, 1:00 PM",
          text: "Patient asymptomatic at 1 PM check. Emphasized taking dose with substantial carbohydrate/protein meal."
        }
      ]
    },
    {
      id: "ALT-2026-112",
      patientId: "PT-20401",
      patientName: "James Kowalski",
      patientAge: 11,
      patientInitials: "JK",
      avatarColor: 7,
      caregiver: "Anna Kowalski (Mother)",
      careTeam: "Dr. Michael Lee",
      treatmentProtocol: "Tree Nut OIT — Phase 1",
      treatmentStatusClass: "badge-green",
      type: "missed-dose",
      typeLabel: "Missed Dose",
      summary: "Single missed dose resolved after caregiver logged catch-up window",
      severity: "low",
      severityLabel: "Low",
      severityReason: "Configured Rule: Isolated single missed dose within protocol limit",
      status: "resolved",
      statusLabel: "Resolved",
      occurredAt: "2026-09-14T21:00:00Z",
      occurredLabel: "Sep 14, 2026 · 9:00 PM",
      dateGroup: "past",
      assignedTo: "Dr. Michael Lee",
      source: "Automated Monitor",
      eventDetails: {
        scheduledDose: "Dose #18 — 8mg Almond Protein",
        scheduledTime: "Sep 14, 2026 · 8:00 PM",
        doseStatus: "Missed / Logged late",
        patientReason: "School science fair evening",
        patientNotes: "Took dose safely at 9:15 PM with bedtime snack."
      },
      clinicalRecordLink: {
        tab: "doses",
        label: "View Dose in Patient Record"
      },
      timeline: [
        { time: "Sep 14, 9:00 PM", user: "System", action: "Single missed dose alert generated" },
        { time: "Sep 15, 9:30 AM", user: "Dr. Michael Lee", action: "Reviewed dose entry and closed alert" }
      ],
      notes: []
    }
  ],

  /* --------------------------------------------------
     Available Care Team Members for Assignment
  -------------------------------------------------- */
  careTeamList: [
    { id: "DOC-1", name: "Dr. Sarah Chen", role: "Attending Allergist", initials: "SC", avatarColor: 0 },
    { id: "NURSE-1", name: "Nurse Elena Rostova", role: "Clinical Care Coordinator", initials: "ER", avatarColor: 2 },
    { id: "DOC-2", name: "Dr. Michael Lee", role: "Associate Allergist", initials: "ML", avatarColor: 3 },
    { id: "UNASSIGNED", name: "Unassigned", role: "Queue", initials: "UN", avatarColor: 8 }
  ],

  /* --------------------------------------------------
     Today's Patient Activity Feed
     TODO: Replace with API call to /api/dashboard/activity
  -------------------------------------------------- */
  activityFeed: [
    {
      id: "ACT-88201",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      activityType: "reaction-reported",
      activityLabel: "Reaction reported",
      detail: "Mild hives reported post-dose",
      timestamp: "2026-09-16T18:34:00Z",
      timeLabel: "6:34 PM",
      status: "attention",
      iconType: "reaction",
      iconColor: "bg-red"
    },
    {
      id: "ACT-88202",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      activityType: "illness-assessment",
      activityLabel: "Illness assessment submitted",
      detail: "Reported mild cold symptoms",
      timestamp: "2026-09-16T15:10:00Z",
      timeLabel: "3:10 PM",
      status: "review",
      iconType: "assessment",
      iconColor: "bg-amber"
    },
    {
      id: "ACT-88203",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      activityType: "message",
      activityLabel: "Message received",
      detail: "Question about dose timing",
      timestamp: "2026-09-16T17:45:00Z",
      timeLabel: "5:45 PM",
      status: "unread",
      iconType: "message",
      iconColor: "bg-blue"
    },
    {
      id: "ACT-88204",
      patientId: "PT-20312",
      patientName: "Ava Thompson",
      activityType: "dose-not-taken",
      activityLabel: "Dose not taken",
      detail: "Patient reported illness — dose skipped",
      timestamp: "2026-09-16T12:20:00Z",
      timeLabel: "12:20 PM",
      status: "review",
      iconType: "dose",
      iconColor: "bg-amber"
    },
    {
      id: "ACT-88205",
      patientId: "PT-20488",
      patientName: "Noah Patel",
      activityType: "health-assessment",
      activityLabel: "Health assessment submitted",
      detail: "Weekly check — no concerns flagged",
      timestamp: "2026-09-16T10:05:00Z",
      timeLabel: "10:05 AM",
      status: "review",
      iconType: "assessment",
      iconColor: "bg-purple"
    },
    {
      id: "ACT-88206",
      patientId: "PT-20371",
      patientName: "Isabella Garcia",
      activityType: "dose-recorded",
      activityLabel: "Dose recorded",
      detail: "Daily dose taken — no issues reported",
      timestamp: "2026-09-16T09:15:00Z",
      timeLabel: "9:15 AM",
      status: "completed",
      iconType: "dose",
      iconColor: "bg-green"
    },
    {
      id: "ACT-88207",
      patientId: "PT-20401",
      patientName: "James Kowalski",
      activityType: "food-intake",
      activityLabel: "Food intake updated",
      detail: "Daily food log submitted",
      timestamp: "2026-09-16T08:30:00Z",
      timeLabel: "8:30 AM",
      status: "completed",
      iconType: "food",
      iconColor: "bg-teal"
    }
  ],

  /* --------------------------------------------------
     Upcoming Doses
     TODO: Replace with API call to /api/dashboard/upcoming-doses
     NOTE: Dose labels come from clinician-configured treatment
           plans. No dosage values are calculated here.
  -------------------------------------------------- */
  upcomingDoses: [
    {
      id: "DOSE-5501",
      patientId: "PT-20371",
      patientName: "Isabella Garcia",
      initials: "IG",
      avatarColor: 5,
      scheduledTime: "2026-09-16T21:00:00Z",
      scheduledTimeLabel: "9:00 PM",
      treatmentLabel: "Peanut OIT",
      doseLevelLabel: "Phase 2 — Clinician-set dose",
      status: "scheduled",
      statusLabel: "Scheduled"
    },
    {
      id: "DOSE-5502",
      patientId: "PT-20401",
      patientName: "James Kowalski",
      initials: "JK",
      avatarColor: 7,
      scheduledTime: "2026-09-16T21:30:00Z",
      scheduledTimeLabel: "9:30 PM",
      treatmentLabel: "Tree Nut OIT",
      doseLevelLabel: "Phase 1 — Clinician-set dose",
      status: "scheduled",
      statusLabel: "Scheduled"
    },
    {
      id: "DOSE-5503",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      initials: "LO",
      avatarColor: 1,
      scheduledTime: "2026-09-16T20:00:00Z",
      scheduledTimeLabel: "8:00 PM",
      treatmentLabel: "Tree Nut OIT",
      doseLevelLabel: "Phase 1 — Clinician-set dose",
      status: "missed",
      statusLabel: "Missed"
    },
    {
      id: "DOSE-5504",
      patientId: "PT-20333",
      patientName: "Olivia Martinez",
      initials: "OM",
      avatarColor: 4,
      scheduledTime: "2026-09-17T07:30:00Z",
      scheduledTimeLabel: "Tomorrow, 7:30 AM",
      treatmentLabel: "Egg OIT",
      doseLevelLabel: "Maintenance — Clinician-set dose",
      status: "scheduled",
      statusLabel: "Scheduled"
    },
    {
      id: "DOSE-5505",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      initials: "SN",
      avatarColor: 5,
      scheduledTime: "2026-09-17T08:00:00Z",
      scheduledTimeLabel: "Tomorrow, 8:00 AM",
      treatmentLabel: "Egg OIT",
      doseLevelLabel: "Phase 2 — Clinician-set dose",
      status: "held",
      statusLabel: "On Hold — Illness"
    }
  ],

  /* --------------------------------------------------
     Pass 7: Secure Care-Team & Patient Conversations
  -------------------------------------------------- */
  conversations: [
    {
      id: "CONV-101",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      patientAge: 10,
      initials: "MV",
      avatarColor: 2,
      caregiver: "David Vance (Father)",
      treatmentProtocol: "Peanut OIT — Phase 2",
      treatmentStatus: "Active Dosing (Hold)",
      treatmentStatusClass: "badge-amber",
      assignedCareTeam: "Dr. Sarah Chen",
      type: "patient",
      unread: true,
      needsResponse: true,
      lastMessage: {
        text: "Thank you Dr. Chen, we gave the cetirizine as discussed and the hives have almost completely cleared. Should we keep holding tomorrow's breakfast dose?",
        timestamp: "2026-09-17T09:42:00Z",
        timeLabel: "Today · 9:42 AM",
        sender: "patient"
      },
      messages: [
        {
          id: "M-101-1",
          sender: "patient",
          senderName: "David Vance (Father)",
          senderRole: "Caregiver",
          text: "Hi Dr. Chen, Marcus broke out in scattered hives on his neck and chest about 20 minutes after his 20mg morning dose. We followed the emergency care plan and administered 10mg Cetirizine. He is breathing fine.",
          timestamp: "2026-09-17T09:12:00Z",
          timeLabel: "9:12 AM",
          status: "read"
        },
        {
          id: "M-101-2",
          sender: "doctor",
          senderName: "Dr. Sarah Chen",
          senderRole: "Attending Allergist",
          text: "Hello David, thank you for following the action plan promptly. Good job giving the cetirizine immediately. Keep Marcus resting quietly indoors today and hold strenuous play. I called your mobile earlier.",
          timestamp: "2026-09-17T09:22:00Z",
          timeLabel: "9:22 AM",
          status: "read"
        },
        {
          id: "M-101-3",
          sender: "patient",
          senderName: "David Vance (Father)",
          senderRole: "Caregiver",
          text: "Thank you Dr. Chen, we gave the cetirizine as discussed and the hives have almost completely cleared. Should we keep holding tomorrow's breakfast dose?",
          timestamp: "2026-09-17T09:42:00Z",
          timeLabel: "9:42 AM",
          status: "delivered"
        }
      ]
    },
    {
      id: "CONV-102",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      patientAge: 8,
      initials: "EV",
      avatarColor: 0,
      caregiver: "Elena Vasquez (Mother)",
      treatmentProtocol: "Peanut OIT — Phase 3",
      treatmentStatus: "Phase 3 Maintenance",
      treatmentStatusClass: "badge-green",
      assignedCareTeam: "Dr. Sarah Chen",
      type: "patient",
      unread: true,
      needsResponse: true,
      lastMessage: {
        text: "Emma had some hives on her arm about two hours after her dose. Should we be concerned?",
        timestamp: "2026-09-16T18:34:00Z",
        timeLabel: "Yesterday · 6:34 PM",
        sender: "patient"
      },
      messages: [
        {
          id: "M-102-1",
          sender: "patient",
          senderName: "Elena Vasquez (Mother)",
          senderRole: "Caregiver",
          text: "Emma had some hives on her arm about two hours after her dose. Should we be concerned? I uploaded 2 photos to the reaction entry.",
          timestamp: "2026-09-16T18:34:00Z",
          timeLabel: "6:34 PM",
          status: "read"
        },
        {
          id: "M-102-2",
          sender: "doctor",
          senderName: "Dr. Sarah Chen",
          senderRole: "Attending Allergist",
          text: "Hi Elena, I reviewed the photos. The urticaria is localized to the forearms without any systemic signs. Let's monitor her closely this evening. Did you apply a cool compress?",
          timestamp: "2026-09-16T19:15:00Z",
          timeLabel: "7:15 PM",
          status: "delivered"
        }
      ]
    },
    {
      id: "CONV-103",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      patientAge: 6,
      initials: "SN",
      avatarColor: 5,
      caregiver: "Hanh Nguyen (Mother)",
      treatmentProtocol: "Egg OIT — Phase 2",
      treatmentStatus: "Active Dosing",
      treatmentStatusClass: "badge-green",
      assignedCareTeam: "Nurse Elena Rostova",
      type: "patient",
      unread: true,
      needsResponse: false,
      lastMessage: {
        text: "Sophia has a runny nose and low-grade fever. Submitted illness assessment.",
        timestamp: "2026-09-16T15:10:00Z",
        timeLabel: "Yesterday · 3:10 PM",
        sender: "patient"
      },
      messages: [
        {
          id: "M-103-1",
          sender: "patient",
          senderName: "Hanh Nguyen (Mother)",
          senderRole: "Caregiver",
          text: "Sophia has a runny nose and low-grade fever. Submitted illness assessment.",
          timestamp: "2026-09-16T15:10:00Z",
          timeLabel: "3:10 PM",
          status: "read"
        },
        {
          id: "M-103-2",
          sender: "care-team",
          senderName: "Nurse Elena Rostova",
          senderRole: "Clinical Care Coordinator",
          text: "Thank you Hanh. Since she is alert with no wheeze, hold the dose while fever is present. We will reassess once temperature is normal for 24h.",
          timestamp: "2026-09-16T15:30:00Z",
          timeLabel: "3:30 PM",
          status: "delivered"
        }
      ]
    },
    {
      id: "CONV-104",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      patientAge: 12,
      initials: "LO",
      avatarColor: 1,
      caregiver: "Chidi Okafor (Father)",
      treatmentProtocol: "Tree Nut OIT — Phase 1",
      treatmentStatus: "Protocol Hold — 3 Missed",
      treatmentStatusClass: "badge-red",
      assignedCareTeam: "Dr. Sarah Chen",
      type: "patient",
      unread: true,
      needsResponse: true,
      lastMessage: {
        text: "We are back home from travel now. Can Liam take his dose tonight or do we need to come in?",
        timestamp: "2026-09-17T08:15:00Z",
        timeLabel: "Today · 8:15 AM",
        sender: "patient"
      },
      messages: [
        {
          id: "M-104-1",
          sender: "care-team",
          senderName: "Nurse Elena Rostova",
          senderRole: "Clinical Care Coordinator",
          text: "Good morning Mr. Okafor, our monitoring system flagged 3 consecutive unconfirmed doses for Liam. Per safety protocol, please hold home dosing until we connect.",
          timestamp: "2026-09-17T08:05:00Z",
          timeLabel: "8:05 AM",
          status: "read"
        },
        {
          id: "M-104-2",
          sender: "patient",
          senderName: "Chidi Okafor (Father)",
          senderRole: "Caregiver",
          text: "We are back home from travel now. Can Liam take his dose tonight or do we need to come in?",
          timestamp: "2026-09-17T08:15:00Z",
          timeLabel: "8:15 AM",
          status: "delivered"
        }
      ]
    },
    {
      id: "CONV-105",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      patientAge: 34,
      initials: "MW",
      avatarColor: 3,
      caregiver: "Self (Adult Patient)",
      treatmentProtocol: "Dairy OIT — Maintenance",
      treatmentStatus: "Maintenance",
      treatmentStatusClass: "badge-green",
      assignedCareTeam: "Dr. Michael Lee",
      type: "patient",
      unread: false,
      needsResponse: false,
      lastMessage: {
        text: "Understood Dr. Lee, I will take the dose Saturday at 4 PM after resting. Thank you!",
        timestamp: "2026-09-17T08:35:00Z",
        timeLabel: "Today · 8:35 AM",
        sender: "patient"
      },
      messages: [
        {
          id: "M-105-1",
          sender: "patient",
          senderName: "Marcus Williams",
          senderRole: "Patient",
          text: "Hi Dr. Lee, I have a 10-mile training run planned for Saturday at 7 AM. Should I take my maintenance milk dose before running or wait 2-3 hours after finishing to prevent exercise-induced reactions?",
          timestamp: "2026-09-16T17:45:00Z",
          timeLabel: "Sep 16 · 5:45 PM",
          status: "read"
        },
        {
          id: "M-105-2",
          sender: "doctor",
          senderName: "Dr. Michael Lee",
          senderRole: "Associate Allergist",
          text: "Hello Marcus, great question. Always separate vigorous exercise from dosing by at least 2 to 3 hours on both sides. Take your dose late in the afternoon with food after your body has cooled down completely.",
          timestamp: "2026-09-17T08:20:00Z",
          timeLabel: "8:20 AM",
          status: "read"
        },
        {
          id: "M-105-3",
          sender: "patient",
          senderName: "Marcus Williams",
          senderRole: "Patient",
          text: "Understood Dr. Lee, I will take the dose Saturday at 4 PM after resting. Thank you!",
          timestamp: "2026-09-17T08:35:00Z",
          timeLabel: "8:35 AM",
          status: "read"
        }
      ]
    },
    {
      id: "CONV-106",
      patientId: "PT-20355",
      patientName: "Sofia Rodriguez",
      patientAge: 14,
      initials: "SR",
      avatarColor: 7,
      caregiver: "Carlos Rodriguez (Father)",
      treatmentProtocol: "Sesame OIT — Phase 3",
      treatmentStatus: "In-Clinic Escalation Pending",
      treatmentStatusClass: "badge-blue",
      assignedCareTeam: "Nurse Elena Rostova",
      type: "patient",
      unread: false,
      needsResponse: false,
      lastMessage: {
        text: "Yes, Carlos confirmed for Monday at 10:30 AM. EpiPen check complete.",
        timestamp: "2026-09-16T14:15:00Z",
        timeLabel: "Yesterday",
        sender: "care-team"
      },
      messages: [
        {
          id: "M-106-1",
          sender: "patient",
          senderName: "Carlos Rodriguez (Father)",
          senderRole: "Caregiver",
          text: "Hi Elena, checking on the visit for Monday. Should Sofia eat before coming in for the challenge?",
          timestamp: "2026-09-16T13:40:00Z",
          timeLabel: "1:40 PM",
          status: "read"
        },
        {
          id: "M-106-2",
          sender: "care-team",
          senderName: "Nurse Elena Rostova",
          senderRole: "Clinical Care Coordinator",
          text: "Hi Carlos! A light breakfast about 1.5 to 2 hours before the appointment is ideal. Avoid heavy or high-fat foods. Bring her EpiPens with you.",
          timestamp: "2026-09-16T14:15:00Z",
          timeLabel: "2:15 PM",
          status: "read"
        }
      ]
    },
    {
      id: "CONV-107",
      patientId: "SB-00124",
      patientName: "Sarah Johnson",
      patientAge: 8,
      initials: "SJ",
      avatarColor: 0,
      caregiver: "Linda Johnson (Mother)",
      treatmentProtocol: "Peanut OIT — Phase 3",
      treatmentStatus: "Maintenance Active",
      treatmentStatusClass: "badge-green",
      assignedCareTeam: "Dr. Sarah Chen",
      type: "patient",
      unread: false,
      needsResponse: false,
      lastMessage: {
        text: "Sarah is doing great with her Phase 3 breakfast routine. No symptoms at all this week.",
        timestamp: "2026-09-15T15:20:00Z",
        timeLabel: "Sep 15",
        sender: "patient"
      },
      messages: [
        {
          id: "M-107-1",
          sender: "patient",
          senderName: "Linda Johnson (Mother)",
          senderRole: "Caregiver",
          text: "Sarah is doing great with her Phase 3 breakfast routine. No symptoms at all this week.",
          timestamp: "2026-09-15T15:20:00Z",
          timeLabel: "Sep 15",
          status: "read"
        },
        {
          id: "M-107-2",
          sender: "doctor",
          senderName: "Dr. Sarah Chen",
          senderRole: "Attending Allergist",
          text: "Wonderful progress Linda! Keep logging each morning and we'll see you for the 6-month checkup.",
          timestamp: "2026-09-15T16:00:00Z",
          timeLabel: "Sep 15",
          status: "read"
        }
      ]
    },
    {
      id: "CONV-108",
      patientId: "TEAM-001",
      patientName: "Nurse Elena Rostova",
      patientAge: null,
      initials: "ER",
      avatarColor: 2,
      caregiver: "Clinical Care Team",
      treatmentProtocol: "Clinic Protocol Coordination",
      treatmentStatus: "Internal Staff",
      treatmentStatusClass: "badge-blue",
      assignedCareTeam: "Safe2Bite Allergy Care Staff",
      type: "care-team",
      unread: false,
      needsResponse: false,
      lastMessage: {
        text: "Challenge room 1 is reserved for Sofia Rodriguez on Monday at 10:30 AM. Dosing kit PN-882 is stocked.",
        timestamp: "2026-09-16T16:45:00Z",
        timeLabel: "Sep 16",
        sender: "care-team"
      },
      messages: [
        {
          id: "M-108-1",
          sender: "care-team",
          senderName: "Nurse Elena Rostova",
          senderRole: "Clinical Care Coordinator",
          text: "Dr. Chen, challenge room 1 is reserved for Sofia Rodriguez on Monday at 10:30 AM. Dosing kit PN-882 is stocked.",
          timestamp: "2026-09-16T16:45:00Z",
          timeLabel: "Sep 16 · 4:45 PM",
          status: "read"
        }
      ]
    }
  ],

  /* --------------------------------------------------
     Upcoming Appointments
     TODO: Replace with API call to /api/appointments?upcoming=true&limit=5
  -------------------------------------------------- */
  upcomingAppointments: [
    {
      id: "APT-9901",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      initials: "EV",
      avatarColor: 0,
      dateDay: "17",
      dateMonth: "SEP",
      time: "9:00 AM",
      dateTimeLabel: "Sep 17, 2026 — 9:00 AM",
      appointmentType: "Reaction Follow-Up",
      status: "confirmed",
      statusLabel: "Confirmed"
    },
    {
      id: "APT-9902",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      initials: "LO",
      avatarColor: 1,
      dateDay: "17",
      dateMonth: "SEP",
      time: "10:30 AM",
      dateTimeLabel: "Sep 17, 2026 — 10:30 AM",
      appointmentType: "Dose Review",
      status: "confirmed",
      statusLabel: "Confirmed"
    },
    {
      id: "APT-9903",
      patientId: "PT-20333",
      patientName: "Olivia Martinez",
      initials: "OM",
      avatarColor: 4,
      dateDay: "23",
      dateMonth: "SEP",
      time: "2:00 PM",
      dateTimeLabel: "Sep 23, 2026 — 2:00 PM",
      appointmentType: "Maintenance Check",
      status: "pending",
      statusLabel: "Pending Confirmation"
    },
    {
      id: "APT-9904",
      patientId: "PT-20488",
      patientName: "Noah Patel",
      initials: "NP",
      avatarColor: 7,
      dateDay: "24",
      dateMonth: "SEP",
      time: "11:00 AM",
      dateTimeLabel: "Sep 24, 2026 — 11:00 AM",
      appointmentType: "Phase Progression Review",
      status: "confirmed",
      statusLabel: "Confirmed"
    },
    {
      id: "APT-9905",
      patientId: "PT-20371",
      patientName: "Isabella Garcia",
      initials: "IG",
      avatarColor: 5,
      dateDay: "23",
      dateMonth: "SEP",
      time: "3:30 PM",
      dateTimeLabel: "Sep 23, 2026 — 3:30 PM",
      appointmentType: "Routine Assessment",
      status: "confirmed",
      statusLabel: "Confirmed"
    }
  ],

  /* --------------------------------------------------
     Pass 7: Comprehensive Clinic Appointments Dataset
  -------------------------------------------------- */
  allAppointments: [
    {
      id: "APT-1001",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      patientAge: 10,
      initials: "MV",
      avatarColor: 2,
      treatmentProtocol: "Peanut OIT — Phase 2",
      caregiver: "David Vance (Father)",
      appointmentType: "Reaction Follow-up",
      date: "2026-09-17",
      dateLabel: "Today · Sep 17, 2026",
      time: "11:30 AM",
      timeGroup: "today",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Telehealth",
      location: "Video Link (Safe2Bite Telehealth Room 2)",
      status: "confirmed",
      statusLabel: "Confirmed",
      notes: [
        {
          id: "AN-1001-1",
          author: "Dr. Sarah Chen",
          time: "Sep 17, 9:25 AM",
          text: "Caregiver David Vance requested tele-check following morning breakfast reaction. EpiPen availability verified."
        }
      ]
    },
    {
      id: "APT-1002",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      patientAge: 8,
      initials: "EV",
      avatarColor: 0,
      treatmentProtocol: "Peanut OIT — Phase 3",
      caregiver: "Elena Vasquez (Mother)",
      appointmentType: "Reaction Follow-up",
      date: "2026-09-17",
      dateLabel: "Today · Sep 17, 2026",
      time: "9:00 AM",
      timeGroup: "today",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Telehealth",
      location: "Video Link (Safe2Bite Telehealth Room 1)",
      status: "completed",
      statusLabel: "Completed",
      notes: [
        {
          id: "AN-1002-1",
          author: "Dr. Sarah Chen",
          time: "Sep 17, 9:20 AM",
          text: "Completed morning tele-check. Urticaria resolved completely overnight. Authorized continuation of 40mg with full parent observation."
        }
      ]
    },
    {
      id: "APT-1003",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      patientAge: 12,
      initials: "LO",
      avatarColor: 1,
      treatmentProtocol: "Tree Nut OIT — Phase 1",
      caregiver: "Chidi Okafor (Father)",
      appointmentType: "Dose Review",
      date: "2026-09-17",
      dateLabel: "Today · Sep 17, 2026",
      time: "10:30 AM",
      timeGroup: "today",
      clinician: "Nurse Elena Rostova",
      clinicianRole: "Clinical Care Coordinator",
      visitType: "Office Visit",
      location: "Clinic Suite 3B",
      status: "confirmed",
      statusLabel: "Confirmed",
      notes: [
        {
          id: "AN-1003-1",
          author: "Nurse Elena Rostova",
          time: "Sep 17, 8:40 AM",
          text: "Protocol re-entry review after 3 consecutive missed doses during family travel. Patient bringing medication kit for dose level check."
        }
      ]
    },
    {
      id: "APT-1004",
      patientId: "PT-20412",
      patientName: "Liam Patel",
      patientAge: 7,
      initials: "LP",
      avatarColor: 4,
      treatmentProtocol: "Cashew OIT — Phase 1",
      caregiver: "Meera Patel (Mother)",
      appointmentType: "Assessment Review",
      date: "2026-09-18",
      dateLabel: "Tomorrow · Sep 18, 2026",
      time: "2:00 PM",
      timeGroup: "tomorrow",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Telehealth",
      location: "Video Link (Safe2Bite Telehealth Room 1)",
      status: "scheduled",
      statusLabel: "Scheduled",
      notes: [
        {
          id: "AN-1004-1",
          author: "Dr. Sarah Chen",
          time: "Sep 17, 8:00 AM",
          text: "Check temperature clearance following active viral illness hold."
        }
      ]
    },
    {
      id: "APT-1005",
      patientId: "PT-20355",
      patientName: "Sofia Rodriguez",
      patientAge: 14,
      initials: "SR",
      avatarColor: 7,
      treatmentProtocol: "Sesame OIT — Phase 3",
      caregiver: "Carlos Rodriguez (Father)",
      appointmentType: "Treatment Review",
      date: "2026-09-21",
      dateLabel: "Monday · Sep 21, 2026",
      time: "10:30 AM",
      timeGroup: "next-7",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Office Visit",
      location: "In-Clinic Challenge Room 1",
      status: "confirmed",
      statusLabel: "Confirmed",
      notes: [
        {
          id: "AN-1005-1",
          author: "Nurse Elena Rostova",
          time: "Sep 16, 4:50 PM",
          text: "Phase 3 Sesame escalation challenge visit. Dosing kit PN-882 reserved."
        }
      ]
    },
    {
      id: "APT-1006",
      patientId: "PT-20490",
      patientName: "Noah Kim",
      patientAge: 11,
      initials: "NK",
      avatarColor: 6,
      treatmentProtocol: "Walnut OIT — Phase 2",
      caregiver: "Grace Kim (Mother)",
      appointmentType: "Treatment Review",
      date: "2026-09-22",
      dateLabel: "Tuesday · Sep 22, 2026",
      time: "1:15 PM",
      timeGroup: "next-7",
      clinician: "Dr. Michael Lee",
      clinicianRole: "Associate Allergist",
      visitType: "Office Visit",
      location: "Clinic Suite 4A",
      status: "scheduled",
      statusLabel: "Scheduled",
      notes: [
        {
          id: "AN-1006-1",
          author: "Dr. Michael Lee",
          time: "Sep 17, 8:10 AM",
          text: "14-day zero-reaction milestone check. Assess eligibility for 50mg escalation."
        }
      ]
    },
    {
      id: "APT-1007",
      patientId: "SB-00124",
      patientName: "Sarah Johnson",
      patientAge: 8,
      initials: "SJ",
      avatarColor: 0,
      treatmentProtocol: "Peanut OIT — Phase 3",
      caregiver: "Linda Johnson (Mother)",
      appointmentType: "Follow-up",
      date: "2026-09-23",
      dateLabel: "Wednesday · Sep 23, 2026",
      time: "10:00 AM",
      timeGroup: "next-7",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Office Visit",
      location: "Clinic Suite 3A",
      status: "confirmed",
      statusLabel: "Confirmed",
      notes: [
        {
          id: "AN-1007-1",
          author: "Dr. Sarah Chen",
          time: "Sep 15, 4:15 PM",
          text: "6-month Peanut OIT maintenance compliance check."
        }
      ]
    },
    {
      id: "APT-1008",
      patientId: "PT-20333",
      patientName: "Olivia Martinez",
      patientAge: 11,
      initials: "OM",
      avatarColor: 4,
      treatmentProtocol: "Egg OIT — Phase 2",
      caregiver: "Carmen Martinez (Mother)",
      appointmentType: "Follow-up",
      date: "2026-09-23",
      dateLabel: "Wednesday · Sep 23, 2026",
      time: "2:00 PM",
      timeGroup: "next-7",
      clinician: "Nurse Elena Rostova",
      clinicianRole: "Clinical Care Coordinator",
      visitType: "Telehealth",
      location: "Video Link (Safe2Bite Telehealth Room 3)",
      status: "scheduled",
      statusLabel: "Scheduled",
      notes: []
    },
    {
      id: "APT-1009",
      patientId: "PT-20488",
      patientName: "Noah Patel",
      patientAge: 15,
      initials: "NP",
      avatarColor: 7,
      treatmentProtocol: "Tree Nut OIT — Phase 2",
      caregiver: "Sunita Patel (Mother)",
      appointmentType: "Phase Progression Review",
      date: "2026-09-24",
      dateLabel: "Thursday · Sep 24, 2026",
      time: "11:00 AM",
      timeGroup: "next-7",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Office Visit",
      location: "In-Clinic Challenge Room 2",
      status: "scheduled",
      statusLabel: "Scheduled",
      notes: []
    },
    {
      id: "APT-1010",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      patientAge: 34,
      initials: "MW",
      avatarColor: 3,
      treatmentProtocol: "Dairy OIT — Maintenance",
      caregiver: "Self (Adult Patient)",
      appointmentType: "Follow-up",
      date: "2026-09-25",
      dateLabel: "Friday · Sep 25, 2026",
      time: "4:00 PM",
      timeGroup: "next-7",
      clinician: "Dr. Michael Lee",
      clinicianRole: "Associate Allergist",
      visitType: "Telehealth",
      location: "Video Link (Safe2Bite Telehealth Room 1)",
      status: "scheduled",
      statusLabel: "Scheduled",
      notes: [
        {
          id: "AN-1010-1",
          author: "Dr. Michael Lee",
          time: "Sep 17, 8:40 AM",
          text: "Adult OIT exercise and marathon training schedule follow-up."
        }
      ]
    },
    {
      id: "APT-1011",
      patientId: "PT-20371",
      patientName: "Isabella Garcia",
      patientAge: 7,
      initials: "IG",
      avatarColor: 5,
      treatmentProtocol: "Peanut OIT — Phase 2",
      caregiver: "Lucia Garcia (Mother)",
      appointmentType: "Assessment Review",
      date: "2026-09-28",
      dateLabel: "Monday · Sep 28, 2026",
      time: "3:30 PM",
      timeGroup: "next-30",
      clinician: "Nurse Elena Rostova",
      clinicianRole: "Clinical Care Coordinator",
      visitType: "Office Visit",
      location: "Clinic Suite 3B",
      status: "scheduled",
      statusLabel: "Scheduled",
      notes: []
    },
    {
      id: "APT-1012",
      patientId: "PT-20401",
      patientName: "James Kowalski",
      patientAge: 11,
      initials: "JK",
      avatarColor: 7,
      treatmentProtocol: "Tree Nut OIT — Phase 1",
      caregiver: "Anna Kowalski (Mother)",
      appointmentType: "Dose Review",
      date: "2026-09-15",
      dateLabel: "Tuesday · Sep 15, 2026",
      time: "11:00 AM",
      timeGroup: "past",
      clinician: "Dr. Michael Lee",
      clinicianRole: "Associate Allergist",
      visitType: "Office Visit",
      location: "Clinic Suite 4A",
      status: "completed",
      statusLabel: "Completed",
      notes: [
        {
          id: "AN-1012-1",
          author: "Dr. Michael Lee",
          time: "Sep 15, 11:30 AM",
          text: "Reviewed evening dose log. Adherence normal."
        }
      ]
    },
    {
      id: "APT-1013",
      patientId: "PT-20312",
      patientName: "Ava Thompson",
      patientAge: 9,
      initials: "AT",
      avatarColor: 4,
      treatmentProtocol: "Wheat OIT — Phase 2",
      caregiver: "Rachel Thompson (Mother)",
      appointmentType: "Dose Review",
      date: "2026-09-16",
      dateLabel: "Wednesday · Sep 16, 2026",
      time: "1:30 PM",
      timeGroup: "past",
      clinician: "Dr. Sarah Chen",
      clinicianRole: "Attending Allergist",
      visitType: "Office Visit",
      location: "Clinic Suite 3A",
      status: "cancelled",
      statusLabel: "Cancelled",
      notes: [
        {
          id: "AN-1013-1",
          author: "Dr. Sarah Chen",
          time: "Sep 16, 12:30 PM",
          text: "Caregiver called to cancel due to stomach upset before lunch. Rescheduling for next week."
        }
      ]
    }
  ],

  /* --------------------------------------------------
     Notifications
     TODO: Replace with API call to /api/notifications?limit=10
  -------------------------------------------------- */
  notifications: [
    {
      id: "NOTIF-1101",
      type: "reaction",
      iconColor: "notif-icon-red",
      title: "Reaction reported — Emma Vasquez",
      detail: "Mild hives reported 2h post-dose. Review required.",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      timestamp: "2026-09-16T18:34:00Z",
      timeLabel: "6:34 PM",
      unread: true
    },
    {
      id: "NOTIF-1102",
      type: "missed-dose",
      iconColor: "notif-icon-amber",
      title: "Missed dose — Liam Okafor",
      detail: "Scheduled dose not recorded for today.",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      timestamp: "2026-09-16T20:00:00Z",
      timeLabel: "8:00 PM",
      unread: true
    },
    {
      id: "NOTIF-1103",
      type: "message",
      iconColor: "notif-icon-blue",
      title: "New message — Marcus Williams",
      detail: "Question regarding dose timing.",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      timestamp: "2026-09-16T17:45:00Z",
      timeLabel: "5:45 PM",
      unread: true
    },
    {
      id: "NOTIF-1104",
      type: "assessment",
      iconColor: "notif-icon-purple",
      title: "Illness assessment — Sophia Nguyen",
      detail: "Caregiver submitted illness assessment. Review pending.",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      timestamp: "2026-09-16T15:10:00Z",
      timeLabel: "3:10 PM",
      unread: true
    },
    {
      id: "NOTIF-1105",
      type: "appointment",
      iconColor: "notif-icon-teal",
      title: "Appointment tomorrow — Emma Vasquez",
      detail: "Reaction Follow-Up at 9:00 AM",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      timestamp: "2026-09-16T09:00:00Z",
      timeLabel: "9:00 AM",
      unread: false
    },
    {
      id: "NOTIF-1106",
      type: "health-check",
      iconColor: "notif-icon-green",
      title: "Assessment submitted — Noah Patel",
      detail: "Weekly health check submitted for review.",
      patientId: "PT-20488",
      patientName: "Noah Patel",
      timestamp: "2026-09-16T10:05:00Z",
      timeLabel: "10:05 AM",
      unread: false
    }
  ],

  /* --------------------------------------------------
     Search Sample Data
     TODO: Replace with API call to /api/search?q={query}
  -------------------------------------------------- */
  searchSamples: {
    patients: [
      { id: "PT-20381", name: "Emma Vasquez",    age: 8,  treatment: "Peanut OIT", initials: "EV", avatarColor: 0 },
      { id: "PT-20417", name: "Liam Okafor",     age: 12, treatment: "Tree Nut OIT", initials: "LO", avatarColor: 1 },
      { id: "PT-20299", name: "Sophia Nguyen",   age: 6,  treatment: "Egg OIT", initials: "SN", avatarColor: 5 },
      { id: "PT-20455", name: "Marcus Williams", age: 34, treatment: "Dairy OIT", initials: "MW", avatarColor: 3 },
      { id: "PT-20312", name: "Ava Thompson",    age: 9,  treatment: "Wheat OIT", initials: "AT", avatarColor: 4 },
      { id: "PT-20488", name: "Noah Patel",      age: 15, treatment: "Tree Nut OIT", initials: "NP", avatarColor: 7 },
      { id: "PT-20371", name: "Isabella Garcia", age: 7,  treatment: "Peanut OIT", initials: "IG", avatarColor: 5 },
      { id: "PT-20401", name: "James Kowalski",  age: 29, treatment: "Tree Nut OIT", initials: "JK", avatarColor: 7 },
      { id: "PT-20333", name: "Olivia Martinez", age: 11, treatment: "Egg OIT", initials: "OM", avatarColor: 4 }
    ],
    alerts: [
      { id: "ALT-881", label: "Reaction: Emma Vasquez", type: "Reaction Reported",   patientId: "PT-20381" },
      { id: "ALT-882", label: "Missed dose: Liam Okafor", type: "Missed Dose",       patientId: "PT-20417" },
      { id: "ALT-883", label: "Assessment: Sophia Nguyen", type: "Illness Assessment", patientId: "PT-20299" }
    ]
  },

  /* --------------------------------------------------
     Pass 3: Patient Directory Dataset (25 Fictional Patients)
     TODO: Replace with API call to /api/patients
  -------------------------------------------------- */
  totalPatientsCount: 128, // Representative mock panel size
  patients: [
    {
      id: "SB-00124",
      firstName: "Sarah",
      lastName: "Johnson",
      name: "Sarah Johnson",
      initials: "SJ",
      avatarColor: 0,
      age: 8,
      dobPlaceholder: "04/12/2016",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 3",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 9:42 AM",
      lastActivityTimestamp: "2026-09-17T09:42:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 8:00 AM",
      notes: "Patient tolerating Phase 3 dose well. Parent logged morning dose with no symptoms."
    },
    {
      id: "SB-00189",
      firstName: "Sarah",
      lastName: "Williams",
      name: "Sarah Williams",
      initials: "SW",
      avatarColor: 2,
      age: 11,
      dobPlaceholder: "08/23/2013",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Tree Nut OIT — Phase 2",
      assessmentStatus: "pending",
      assessmentStatusLabel: "Pending",
      doseStatus: "upcoming",
      doseStatusLabel: "Upcoming",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 8:15 AM",
      lastActivityTimestamp: "2026-09-17T08:15:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Today, 6:00 PM",
      notes: "Weekly dose escalation visit scheduled next Thursday."
    },
    {
      id: "SB-00125",
      firstName: "Emma",
      lastName: "Vasquez",
      name: "Emma Vasquez",
      initials: "EV",
      avatarColor: 0,
      age: 8,
      dobPlaceholder: "03/12/2018",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 3",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Reaction reported — mild hives noted 2h post-dose",
      activityStatus: "active_recently",
      lastActivity: "Today, 6:34 PM",
      lastActivityTimestamp: "2026-09-17T18:34:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 8:30 AM",
      notes: "Antihistamine administered per action plan; hives resolved within 45 minutes."
    },
    {
      id: "SB-00126",
      firstName: "Liam",
      lastName: "Okafor",
      name: "Liam Okafor",
      initials: "LO",
      avatarColor: 1,
      age: 12,
      dobPlaceholder: "07/28/2014",
      treatmentStatus: "needs_review",
      treatmentStatusLabel: "Needs Review",
      treatmentLabel: "Tree Nut OIT — Phase 1",
      assessmentStatus: "not_submitted",
      assessmentStatusLabel: "Not Submitted",
      doseStatus: "missed",
      doseStatusLabel: "Missed",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Scheduled dose not taken — Day 3 missed",
      activityStatus: "active_recently",
      lastActivity: "Today, 8:00 AM",
      lastActivityTimestamp: "2026-09-17T08:00:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 8:00 AM",
      notes: "Caregiver contacted; reminder sent regarding protocol compliance."
    },
    {
      id: "SB-00127",
      firstName: "Sophia",
      lastName: "Nguyen",
      name: "Sophia Nguyen",
      initials: "SN",
      avatarColor: 5,
      age: 6,
      dobPlaceholder: "01/05/2020",
      treatmentStatus: "paused",
      treatmentStatusLabel: "Paused",
      treatmentLabel: "Egg OIT — Phase 2",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "not_taken",
      doseStatusLabel: "Not Taken",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Viral illness reported by caregiver — dose held",
      activityStatus: "active_recently",
      lastActivity: "Today, 3:10 PM",
      lastActivityTimestamp: "2026-09-17T15:10:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Pending clinician hold release",
      notes: "Caregiver reported mild fever and runny nose. Clinician hold initiated."
    },
    {
      id: "SB-00128",
      firstName: "Marcus",
      lastName: "Williams",
      name: "Marcus Williams",
      initials: "MW",
      avatarColor: 3,
      age: 34,
      dobPlaceholder: "11/15/1992",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Dairy OIT — Maintenance",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 5:45 PM",
      lastActivityTimestamp: "2026-09-17T17:45:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 7:30 AM",
      notes: "Maintenance phase going smoothly. Adult patient self-monitoring daily."
    },
    {
      id: "SB-00129",
      firstName: "Ava",
      lastName: "Thompson",
      name: "Ava Thompson",
      initials: "AT",
      avatarColor: 4,
      age: 9,
      dobPlaceholder: "06/22/2017",
      treatmentStatus: "paused",
      treatmentStatusLabel: "Paused",
      treatmentLabel: "Wheat OIT — Phase 2",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "not_taken",
      doseStatusLabel: "Not Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 12:20 PM",
      lastActivityTimestamp: "2026-09-17T12:20:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Sep 21, 2026 — Clinician resume",
      notes: "Planned school travel pause approved by clinic staff."
    },
    {
      id: "SB-00130",
      firstName: "Noah",
      lastName: "Patel",
      name: "Noah Patel",
      initials: "NP",
      avatarColor: 7,
      age: 15,
      dobPlaceholder: "09/08/2011",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Tree Nut OIT — Phase 2",
      assessmentStatus: "pending",
      assessmentStatusLabel: "Pending",
      doseStatus: "upcoming",
      doseStatusLabel: "Upcoming",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 10:05 AM",
      lastActivityTimestamp: "2026-09-17T10:05:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Today, 7:00 PM",
      notes: "Adolescent patient doing well with evening dose routine."
    },
    {
      id: "SB-00131",
      firstName: "Isabella",
      lastName: "Garcia",
      name: "Isabella Garcia",
      initials: "IG",
      avatarColor: 5,
      age: 7,
      dobPlaceholder: "05/19/2019",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 1",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Yesterday, 7:15 PM",
      lastActivityTimestamp: "2026-09-16T19:15:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Today, 7:00 PM",
      notes: "No symptoms recorded during 2-week baseline escalation."
    },
    {
      id: "SB-00132",
      firstName: "James",
      lastName: "Kowalski",
      name: "James Kowalski",
      initials: "JK",
      avatarColor: 7,
      age: 29,
      dobPlaceholder: "02/14/1997",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Tree Nut OIT — Maintenance",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Yesterday, 6:30 PM",
      lastActivityTimestamp: "2026-09-16T18:30:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Today, 6:30 PM",
      notes: "Full adherence logged for 180 consecutive days."
    },
    {
      id: "SB-00133",
      firstName: "Olivia",
      lastName: "Martinez",
      name: "Olivia Martinez",
      initials: "OM",
      avatarColor: 4,
      age: 11,
      dobPlaceholder: "10/03/2015",
      treatmentStatus: "needs_review",
      treatmentStatusLabel: "Needs Review",
      treatmentLabel: "Egg OIT — Phase 1",
      assessmentStatus: "not_submitted",
      assessmentStatusLabel: "Not Submitted",
      doseStatus: "missed",
      doseStatusLabel: "Missed",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Missed dose logged — requires clinician check-in",
      activityStatus: "no_recent_activity",
      lastActivity: "2 days ago",
      lastActivityTimestamp: "2026-09-15T09:00:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Sep 18, 2026 — Pending review",
      notes: "Care coordinator reached out to parent via portal message."
    },
    {
      id: "SB-00134",
      firstName: "Lucas",
      lastName: "Bennett",
      name: "Lucas Bennett",
      initials: "LB",
      avatarColor: 1,
      age: 10,
      dobPlaceholder: "12/01/2015",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 2",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 7:20 AM",
      lastActivityTimestamp: "2026-09-17T07:20:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 7:30 AM",
      notes: "Breakfast dose recorded with oat milk vehicle without issue."
    },
    {
      id: "SB-00135",
      firstName: "Mia",
      lastName: "Rodriguez",
      name: "Mia Rodriguez",
      initials: "MR",
      avatarColor: 2,
      age: 5,
      dobPlaceholder: "03/15/2021",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Sesame OIT — Phase 1",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 8:40 AM",
      lastActivityTimestamp: "2026-09-17T08:40:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 8:30 AM",
      notes: "Parent notes good tolerance with apple sauce vehicle."
    },
    {
      id: "SB-00136",
      firstName: "Ethan",
      lastName: "Davis",
      name: "Ethan Davis",
      initials: "ED",
      avatarColor: 6,
      age: 14,
      dobPlaceholder: "08/17/2012",
      treatmentStatus: "paused",
      treatmentStatusLabel: "Paused",
      treatmentLabel: "Tree Nut OIT — Phase 3",
      assessmentStatus: "pending",
      assessmentStatusLabel: "Pending",
      doseStatus: "not_taken",
      doseStatusLabel: "Not Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "no_recent_activity",
      lastActivity: "3 days ago",
      lastActivityTimestamp: "2026-09-14T16:00:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Sep 20, 2026 — Clinician resume",
      notes: "Dose held temporarily following dental procedure."
    },
    {
      id: "SB-00137",
      firstName: "Charlotte",
      lastName: "Lee",
      name: "Charlotte Lee",
      initials: "CL",
      avatarColor: 3,
      age: 13,
      dobPlaceholder: "01/29/2013",
      treatmentStatus: "completed",
      treatmentStatusLabel: "Completed",
      treatmentLabel: "Peanut OIT — Graduation",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "no_recent_activity",
      lastActivity: "Sep 14, 2026",
      lastActivityTimestamp: "2026-09-14T11:00:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Daily dietary maintenance",
      notes: "Graduated to free dietary intake of peanut. Annual check-in scheduled."
    },
    {
      id: "SB-00138",
      firstName: "Henry",
      lastName: "Wilson",
      name: "Henry Wilson",
      initials: "HW",
      avatarColor: 7,
      age: 7,
      dobPlaceholder: "11/04/2018",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Milk OIT — Phase 2",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 11:15 AM",
      lastActivityTimestamp: "2026-09-17T11:15:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 8:00 AM",
      notes: "Morning milk dose taken with cereal. No symptoms."
    },
    {
      id: "SB-00139",
      firstName: "Harper",
      lastName: "Taylor",
      name: "Harper Taylor",
      initials: "HT",
      avatarColor: 0,
      age: 10,
      dobPlaceholder: "04/05/2016",
      treatmentStatus: "needs_review",
      treatmentStatusLabel: "Needs Review",
      treatmentLabel: "Soy OIT — Phase 1",
      assessmentStatus: "not_submitted",
      assessmentStatusLabel: "Not Submitted",
      doseStatus: "upcoming",
      doseStatusLabel: "Upcoming",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Assessment pending review before today's scheduled dose",
      activityStatus: "active_recently",
      lastActivity: "Yesterday, 4:50 PM",
      lastActivityTimestamp: "2026-09-16T16:50:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Today, 5:00 PM",
      notes: "Clinician verification required before parent gives 5 PM dose."
    },
    {
      id: "SB-00140",
      firstName: "Alexander",
      lastName: "Brown",
      name: "Alexander Brown",
      initials: "AB",
      avatarColor: 1,
      age: 16,
      dobPlaceholder: "07/11/2010",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 3",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 1:10 PM",
      lastActivityTimestamp: "2026-09-17T13:10:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Sep 18, 2026 — 1:00 PM",
      notes: "Post-lunch dose confirmed via mobile app."
    },
    {
      id: "SB-00141",
      firstName: "Ella",
      lastName: "Clark",
      name: "Ella Clark",
      initials: "EC",
      avatarColor: 2,
      age: 6,
      dobPlaceholder: "09/14/2020",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Cashew OIT — Phase 2",
      assessmentStatus: "pending",
      assessmentStatusLabel: "Pending",
      doseStatus: "upcoming",
      doseStatusLabel: "Upcoming",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 9:05 AM",
      lastActivityTimestamp: "2026-09-17T09:05:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Today, 6:30 PM",
      notes: "Routine evening dose scheduled."
    },
    {
      id: "SB-00142",
      firstName: "Benjamin",
      lastName: "Harris",
      name: "Benjamin Harris",
      initials: "BH",
      avatarColor: 4,
      age: 12,
      dobPlaceholder: "05/03/2014",
      treatmentStatus: "completed",
      treatmentStatusLabel: "Completed",
      treatmentLabel: "Egg OIT — Maintenance",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "no_recent_activity",
      lastActivity: "Sep 12, 2026",
      lastActivityTimestamp: "2026-09-12T10:00:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Weekly maintenance egg intake",
      notes: "Patient tolerates cooked egg without restriction."
    },
    {
      id: "SB-00143",
      firstName: "Grace",
      lastName: "Lewis",
      name: "Grace Lewis",
      initials: "GL",
      avatarColor: 5,
      age: 8,
      dobPlaceholder: "12/20/2017",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 2",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 10:45 AM",
      lastActivityTimestamp: "2026-09-17T10:45:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — 8:00 AM",
      notes: "Assessment submitted with all normal parameters."
    },
    {
      id: "SB-00144",
      firstName: "Daniel",
      lastName: "Walker",
      name: "Daniel Walker",
      initials: "DW",
      avatarColor: 6,
      age: 9,
      dobPlaceholder: "03/08/2017",
      treatmentStatus: "paused",
      treatmentStatusLabel: "Paused",
      treatmentLabel: "Walnut OIT — Phase 1",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "not_taken",
      doseStatusLabel: "Not Taken",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Illness dose hold active — fever reported yesterday",
      activityStatus: "active_recently",
      lastActivity: "Yesterday, 2:15 PM",
      lastActivityTimestamp: "2026-09-16T14:15:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 19, 2026 — Resume contingent on afebrile 24h",
      notes: "Clinician nurse spoke with mom; recommended standard fever management."
    },
    {
      id: "SB-00145",
      firstName: "Chloe",
      lastName: "Hall",
      name: "Chloe Hall",
      initials: "CH",
      avatarColor: 3,
      age: 11,
      dobPlaceholder: "06/30/2015",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Peanut OIT — Phase 3",
      assessmentStatus: "completed",
      assessmentStatusLabel: "Completed",
      doseStatus: "taken",
      doseStatusLabel: "Taken",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Today, 12:00 PM",
      lastActivityTimestamp: "2026-09-17T12:00:00Z",
      careTeam: "care_team_member",
      careTeamLabel: "Care Team Member",
      nextScheduledDose: "Sep 18, 2026 — 12:00 PM",
      notes: "Lunchtime dose logged consistently."
    },
    {
      id: "SB-00146",
      firstName: "Jackson",
      lastName: "Allen",
      name: "Jackson Allen",
      initials: "JA",
      avatarColor: 7,
      age: 13,
      dobPlaceholder: "10/18/2012",
      treatmentStatus: "active",
      treatmentStatusLabel: "Active",
      treatmentLabel: "Tree Nut OIT — Phase 2",
      assessmentStatus: "pending",
      assessmentStatusLabel: "Pending",
      doseStatus: "upcoming",
      doseStatusLabel: "Upcoming",
      alertStatus: "none",
      alertStatusLabel: "No Current Alerts",
      alertDetail: "",
      activityStatus: "active_recently",
      lastActivity: "Yesterday, 8:30 PM",
      lastActivityTimestamp: "2026-09-16T20:30:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Today, 8:00 PM",
      notes: "Evening dose scheduled with caregiver supervision."
    },
    {
      id: "SB-00147",
      firstName: "Zoe",
      lastName: "Young",
      name: "Zoe Young",
      initials: "ZY",
      avatarColor: 2,
      age: 7,
      dobPlaceholder: "02/10/2019",
      treatmentStatus: "needs_review",
      treatmentStatusLabel: "Needs Review",
      treatmentLabel: "Sesame OIT — Phase 2",
      assessmentStatus: "not_submitted",
      assessmentStatusLabel: "Not Submitted",
      doseStatus: "missed",
      doseStatusLabel: "Missed",
      alertStatus: "attention_required",
      alertStatusLabel: "Attention Required",
      alertDetail: "Dose verification required — 2 consecutive doses skipped",
      activityStatus: "active_recently",
      lastActivity: "Today, 7:50 AM",
      lastActivityTimestamp: "2026-09-17T07:50:00Z",
      careTeam: "assigned_doctor",
      careTeamLabel: "Dr. Sarah Chen",
      nextScheduledDose: "Sep 18, 2026 — In-clinic verification",
      notes: "Parent flagged scheduling difficulties. Clinic nurse contacted."
    }
  ],

  /* --------------------------------------------------
     Patient Directory Helper Methods
  -------------------------------------------------- */
  getPatients() {
    return this.patients || [];
  },

  getPatient(patientId) {
    if (!patientId) return null;
    return this.patients.find(p => p.id === patientId || p.id.toLowerCase() === patientId.toLowerCase()) || null;
  },

  /* --------------------------------------------------
     Patient Quick View Data
     TODO: Replace with API call to /api/patients/{id}/summary
  -------------------------------------------------- */
  getPatientQuickView(patientId) {
    const quickViewData = {
      "PT-20381": {
        id: "PT-20381",
        name: "Emma Vasquez",
        initials: "EV",
        avatarColor: 0,
        age: 8,
        dob: "2018-03-12",
        treatmentStatus: "Active Treatment",
        treatmentLabel: "Peanut OIT — Phase 3",
        lastActivity: "Today, 6:34 PM",
        todayAssessmentStatus: "Completed",
        todayAssessmentStatusClass: "badge-completed",
        todayDoseStatus: "Taken",
        todayDoseStatusClass: "badge-taken",
        latestReactionStatus: "Mild reaction reported",
        latestReactionStatusClass: "badge-attention",
        latestIllnessStatus: "No illness reported",
        latestIllnessStatusClass: "badge-neutral",
        nextScheduledDose: "Sep 17, 2026 — Clinician-set schedule",
        alerts: [
          { type: "alert-red",   icon: "alert-triangle", text: "Reaction reported — review recommended" },
          { type: "alert-blue",  icon: "calendar",        text: "Reaction Follow-Up appointment: Sep 17, 9:00 AM" }
        ]
      },
      "PT-20417": {
        id: "PT-20417",
        name: "Liam Okafor",
        initials: "LO",
        avatarColor: 1,
        age: 12,
        dob: "2014-07-28",
        treatmentStatus: "Active Treatment",
        treatmentLabel: "Tree Nut OIT — Phase 1",
        lastActivity: "Today, 8:00 AM",
        todayAssessmentStatus: "Not submitted",
        todayAssessmentStatusClass: "badge-neutral",
        todayDoseStatus: "Missed",
        todayDoseStatusClass: "badge-missed",
        latestReactionStatus: "No recent reactions",
        latestReactionStatusClass: "badge-neutral",
        latestIllnessStatus: "No illness reported",
        latestIllnessStatusClass: "badge-neutral",
        nextScheduledDose: "Sep 17, 2026 — Clinician-set schedule",
        alerts: [
          { type: "alert-red",   icon: "alert-triangle", text: "Dose not recorded today — follow-up needed" },
          { type: "alert-blue",  icon: "calendar",        text: "Dose Review appointment: Sep 17, 10:30 AM" }
        ]
      },
      "PT-20299": {
        id: "PT-20299",
        name: "Sophia Nguyen",
        initials: "SN",
        avatarColor: 5,
        age: 6,
        dob: "2020-01-05",
        treatmentStatus: "Active Treatment",
        treatmentLabel: "Egg OIT — Phase 2",
        lastActivity: "Today, 3:10 PM",
        todayAssessmentStatus: "Illness assessment submitted",
        todayAssessmentStatusClass: "badge-review",
        todayDoseStatus: "On Hold",
        todayDoseStatusClass: "badge-amber",
        latestReactionStatus: "No recent reactions",
        latestReactionStatusClass: "badge-neutral",
        latestIllnessStatus: "Mild cold reported",
        latestIllnessStatusClass: "badge-review",
        nextScheduledDose: "Pending — clinician hold",
        alerts: [
          { type: "alert-amber", icon: "thermometer",    text: "Illness assessment requires review" },
          { type: "alert-amber", icon: "pause-circle",   text: "Dose held pending clinician review" }
        ]
      },
      "PT-20455": {
        id: "PT-20455",
        name: "Marcus Williams",
        initials: "MW",
        avatarColor: 3,
        age: 34,
        dob: "1992-11-15",
        treatmentStatus: "Active Treatment",
        treatmentLabel: "Dairy OIT — Maintenance",
        lastActivity: "Today, 5:45 PM",
        todayAssessmentStatus: "Completed",
        todayAssessmentStatusClass: "badge-completed",
        todayDoseStatus: "Taken",
        todayDoseStatusClass: "badge-taken",
        latestReactionStatus: "No recent reactions",
        latestReactionStatusClass: "badge-neutral",
        latestIllnessStatus: "No illness reported",
        latestIllnessStatusClass: "badge-neutral",
        nextScheduledDose: "Sep 17, 2026 — Clinician-set schedule",
        alerts: [
          { type: "alert-blue",  icon: "message-square", text: "Unread message — question about dose timing" }
        ]
      },
      "PT-20312": {
        id: "PT-20312",
        name: "Ava Thompson",
        initials: "AT",
        avatarColor: 4,
        age: 9,
        dob: "2017-06-22",
        treatmentStatus: "Active Treatment",
        treatmentLabel: "Wheat OIT — Phase 2",
        lastActivity: "Today, 12:20 PM",
        todayAssessmentStatus: "Completed",
        todayAssessmentStatusClass: "badge-completed",
        todayDoseStatus: "Not taken — illness",
        todayDoseStatusClass: "badge-not-taken",
        latestReactionStatus: "No recent reactions",
        latestReactionStatusClass: "badge-neutral",
        latestIllnessStatus: "Illness reported",
        latestIllnessStatusClass: "badge-review",
        nextScheduledDose: "Pending — clinician hold",
        alerts: [
          { type: "alert-amber", icon: "alert-circle",   text: "Dose skipped — illness reported" },
          { type: "alert-amber", icon: "thermometer",    text: "Caregiver reported illness — no assessment yet" }
        ]
      },
      "PT-20488": {
        id: "PT-20488",
        name: "Noah Patel",
        initials: "NP",
        avatarColor: 7,
        age: 15,
        dob: "2011-09-08",
        treatmentStatus: "Active Treatment",
        treatmentLabel: "Tree Nut OIT — Phase 2",
        lastActivity: "Today, 10:05 AM",
        todayAssessmentStatus: "Submitted",
        todayAssessmentStatusClass: "badge-review",
        todayDoseStatus: "Taken",
        todayDoseStatusClass: "badge-taken",
        latestReactionStatus: "No recent reactions",
        latestReactionStatusClass: "badge-neutral",
        latestIllnessStatus: "No illness reported",
        latestIllnessStatusClass: "badge-neutral",
        nextScheduledDose: "Sep 24, 2026 — Clinician-set schedule",
        alerts: [
          { type: "alert-blue",  icon: "clipboard",      text: "Health assessment submitted — pending review" }
        ]
      }
    };

    if (quickViewData[patientId]) {
      return quickViewData[patientId];
    }

    // Dynamic fallback for any directory patient (SB-...)
    const p = this.getPatient(patientId);
    if (!p) return null;

    const doseClassMap = {
      'taken': 'badge-taken',
      'not_taken': 'badge-not-taken',
      'missed': 'badge-missed',
      'upcoming': 'badge-upcoming'
    };

    const assessClassMap = {
      'completed': 'badge-completed',
      'pending': 'badge-review',
      'not_submitted': 'badge-neutral'
    };

    const alertsList = [];
    if (p.alertStatus === 'attention_required' && p.alertDetail) {
      alertsList.push({
        type: 'alert-amber',
        icon: 'alert-triangle',
        text: p.alertDetail
      });
    }

    return {
      id: p.id,
      name: p.name,
      initials: p.initials,
      avatarColor: p.avatarColor,
      age: p.age,
      dob: p.dobPlaceholder,
      treatmentStatus: p.treatmentStatusLabel,
      treatmentLabel: p.treatmentLabel,
      lastActivity: p.lastActivity,
      todayAssessmentStatus: p.assessmentStatusLabel,
      todayAssessmentStatusClass: assessClassMap[p.assessmentStatus] || 'badge-neutral',
      todayDoseStatus: p.doseStatusLabel,
      todayDoseStatusClass: doseClassMap[p.doseStatus] || 'badge-neutral',
      latestReactionStatus: p.alertStatus === 'attention_required' ? 'Review recommended' : 'No recent reactions',
      latestReactionStatusClass: p.alertStatus === 'attention_required' ? 'badge-attention' : 'badge-neutral',
      latestIllnessStatus: p.treatmentStatus === 'paused' ? 'Illness reported' : 'No illness reported',
      latestIllnessStatusClass: p.treatmentStatus === 'paused' ? 'badge-review' : 'badge-neutral',
      nextScheduledDose: p.nextScheduledDose,
      alerts: alertsList
    };
  },

  /* --------------------------------------------------
     Pass 4: Patient Clinical Overview Dataset & Generator
     TODO: Replace with API call to /api/patients/{id}/clinical-overview
  -------------------------------------------------- */
  getPatientClinicalOverview(patientId) {
    if (!patientId) return null;

    // Base patient lookup
    const p = this.getPatient(patientId);
    if (!p) return null;

    // Check mock doctor authorization
    const isAuthorized = true; // In production: check against currentDoctor.assignedPatients
    if (!isAuthorized) {
      return { authorized: false, id: patientId };
    }

    // Curated rich cases
    const specialProfiles = {
      "SB-00124": { // Sarah Johnson (Primary reference patient)
        caregiver: {
          name: "Linda Johnson",
          relationship: "Mother / Primary Caregiver",
          phone: "(512) 555-0144",
          email: "linda.j@example.com"
        },
        gender: "Female",
        clinic: "Safe2Bite Allergy Care – Austin, TX",
        treatment: {
          status: "active",
          statusLabel: "Active",
          statusClass: "badge-treat-active",
          protocol: "Peanut OIT",
          phase: "Phase 3 — Escalation",
          currentDose: "12 mg Peanut Protein",
          targetDose: "300 mg Maintenance Dose",
          nextDoseTime: "Tomorrow, Sep 18 · 8:00 AM",
          lastUpdated: "Sep 10, 2026 by Dr. Sarah Chen",
          adherenceRate: "98.4%"
        },
        todayStatus: {
          assessment: {
            status: "completed",
            label: "Completed",
            class: "badge-assess-completed",
            icon: "check-circle",
            time: "Today · 9:30 AM",
            wellness: "Feeling Well",
            symptoms: "None reported",
            severity: "None",
            notes: "Sarah took her morning dose smoothly with breakfast. No adverse symptoms observed."
          },
          dose: {
            status: "taken",
            label: "Taken",
            class: "badge-dose-taken",
            icon: "check-circle",
            scheduledTime: "8:00 AM",
            recordedTime: "8:05 AM",
            doseValue: "12 mg Peanut Protein",
            verifiedBy: "Caregiver App Verification"
          },
          reaction: {
            hasReaction: false,
            status: "none",
            label: "No Reported Reaction",
            class: "badge-alert-none",
            icon: "shield-check",
            symptoms: "None",
            severity: "None",
            time: "—",
            actionTaken: "—",
            reviewStatus: "No Action Needed",
            notes: "No acute or delayed reactions reported in the past 30 days."
          },
          illness: {
            hasIllness: false,
            status: "none",
            label: "No Reported Illness",
            class: "badge-alert-none",
            icon: "shield-check",
            symptoms: "None",
            severity: "None",
            date: "—",
            doseHold: false,
            reviewStatus: "No Action Needed",
            notes: "Patient is healthy with no reported infectious symptoms or fever."
          },
          foodIntake: {
            hasIntake: true,
            status: "updated",
            label: "Updated",
            class: "badge-assess-completed",
            icon: "check-circle",
            meal: "Breakfast",
            time: "Today · 7:15 AM",
            description: "Warm oatmeal with sliced bananas and a glass of water",
            notes: "Meal consumed 50 minutes prior to scheduled morning dose."
          }
        },
        alerts: [], // Clean state: "No current alerts"
        upcomingDoses: [
          { date: "Tomorrow, Sep 18", time: "8:00 AM", label: "Peanut OIT", doseValue: "12 mg Peanut Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" },
          { date: "Saturday, Sep 19", time: "8:00 AM", label: "Peanut OIT", doseValue: "12 mg Peanut Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" },
          { date: "Sunday, Sep 20", time: "8:00 AM", label: "Peanut OIT", doseValue: "12 mg Peanut Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" }
        ],
        recentActivity: [
          { date: "Today", time: "9:30 AM", type: "assessment", icon: "clipboard", title: "Health Assessment Completed", detail: "Caregiver reported feeling well; zero symptoms", status: "Completed", statusClass: "badge-assess-completed", actionText: "View Assessment" },
          { date: "Today", time: "8:05 AM", type: "dose", icon: "check-circle", title: "Morning Dose Taken", detail: "12 mg Peanut Protein administered on schedule", status: "Taken", statusClass: "badge-dose-taken", actionText: "View Dose" },
          { date: "Today", time: "7:15 AM", type: "food", icon: "food-intake", title: "Food Intake Logged", detail: "Breakfast: Oatmeal with bananas (50 min pre-dose)", status: "Recorded", statusClass: "badge-assess-completed", actionText: "View Food Log" },
          { date: "Yesterday", time: "8:10 PM", type: "dose", icon: "check-circle", title: "Evening Dose Taken", detail: "12 mg Peanut Protein administered", status: "Taken", statusClass: "badge-dose-taken", actionText: "View Dose" },
          { date: "Yesterday", time: "7:20 PM", type: "food", icon: "food-intake", title: "Food Intake Logged", detail: "Dinner: Grilled chicken with brown rice and broccoli", status: "Recorded", statusClass: "badge-assess-completed", actionText: "View Food Log" },
          { date: "Sep 15, 2026", time: "2:30 PM", type: "message", icon: "messages", title: "Caregiver Message", detail: "Inquiry regarding travel kit dose storage", status: "Resolved", statusClass: "badge-alert-none", actionText: "View Message" }
        ]
      },

      "SB-00125": { // Emma Vasquez (Reaction alert case)
        caregiver: {
          name: "Carlos Vasquez",
          relationship: "Father / Primary Caregiver",
          phone: "(512) 555-0188",
          email: "carlos.v@example.com"
        },
        gender: "Female",
        clinic: "Safe2Bite Allergy Care – Austin, TX",
        treatment: {
          status: "active",
          statusLabel: "Active",
          statusClass: "badge-treat-active",
          protocol: "Peanut OIT",
          phase: "Phase 3 — Escalation",
          currentDose: "20 mg Peanut Protein",
          targetDose: "300 mg Maintenance Dose",
          nextDoseTime: "Tomorrow, Sep 18 · 8:30 AM",
          lastUpdated: "Sep 12, 2026 by Dr. Sarah Chen",
          adherenceRate: "95.8%"
        },
        todayStatus: {
          assessment: {
            status: "completed",
            label: "Completed",
            class: "badge-assess-completed",
            icon: "check-circle",
            time: "Today · 4:15 PM",
            wellness: "Tired after reaction",
            symptoms: "Mild urticaria / hives on neck",
            severity: "Mild",
            notes: "Caregiver noted hives appeared 2 hours post afternoon dose."
          },
          dose: {
            status: "taken",
            label: "Taken",
            class: "badge-dose-taken",
            icon: "check-circle",
            scheduledTime: "4:00 PM",
            recordedTime: "4:20 PM",
            doseValue: "20 mg Peanut Protein",
            verifiedBy: "Caregiver App Verification"
          },
          reaction: {
            hasReaction: true,
            status: "attention_required",
            label: "Reaction Reported",
            class: "badge-alert-attention",
            icon: "alert-triangle",
            symptoms: "Mild localized erythema & hives on neck and upper chest",
            severity: "Mild (Caregiver-reported)",
            time: "Today · 6:34 PM",
            actionTaken: "Oral Cetirizine 5 mg administered per emergency action plan. Hives resolved within 40 minutes.",
            reviewStatus: "Requires Review",
            notes: "Parent observed symptoms after outdoor play. No respiratory distress or wheezing."
          },
          illness: {
            hasIllness: false,
            status: "none",
            label: "No Reported Illness",
            class: "badge-alert-none",
            icon: "shield-check",
            symptoms: "None",
            severity: "None",
            date: "—",
            doseHold: false,
            reviewStatus: "No Action Needed",
            notes: "No fever, cold, or viral symptoms reported."
          },
          foodIntake: {
            hasIntake: true,
            status: "updated",
            label: "Updated",
            class: "badge-assess-completed",
            icon: "check-circle",
            meal: "Snack",
            time: "Today · 3:30 PM",
            description: "Apple slices with sunbutter (peanut-free certified)",
            notes: "Consumed 30 min before dose."
          }
        },
        alerts: [
          {
            id: "ALT-EMMA-01",
            type: "reaction",
            title: "Reaction Reported",
            detail: "Mild urticaria on neck 2h post-dose. Cetirizine administered; resolved.",
            time: "Today · 6:34 PM",
            severity: "attention",
            actionText: "Review Reaction",
            actionType: "reactions"
          }
        ],
        upcomingDoses: [
          { date: "Tomorrow, Sep 18", time: "8:30 AM", label: "Peanut OIT", doseValue: "20 mg Peanut Protein", status: "Pending Review", statusClass: "badge-treat-needs-review" },
          { date: "Saturday, Sep 19", time: "8:30 AM", label: "Peanut OIT", doseValue: "20 mg Peanut Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" }
        ],
        recentActivity: [
          { date: "Today", time: "6:34 PM", type: "reaction", icon: "alert-triangle", title: "Reaction Reported", detail: "Mild hives noted 2h post-dose; antihistamine given", status: "Requires Review", statusClass: "badge-alert-attention", actionText: "Review Reaction" },
          { date: "Today", time: "4:20 PM", type: "dose", icon: "check-circle", title: "Dose Taken", detail: "20 mg Peanut Protein administered", status: "Taken", statusClass: "badge-dose-taken", actionText: "View Dose" },
          { date: "Today", time: "4:15 PM", type: "assessment", icon: "clipboard", title: "Health Assessment Completed", detail: "Routine check completed pre-dose", status: "Completed", statusClass: "badge-assess-completed", actionText: "View Assessment" },
          { date: "Yesterday", time: "4:10 PM", type: "dose", icon: "check-circle", title: "Dose Taken", detail: "20 mg Peanut Protein administered", status: "Taken", statusClass: "badge-dose-taken", actionText: "View Dose" }
        ]
      },

      "SB-00126": { // Liam Okafor (Missed dose alert case)
        caregiver: {
          name: "Amara Okafor",
          relationship: "Mother / Primary Caregiver",
          phone: "(512) 555-0162",
          email: "amara.o@example.com"
        },
        gender: "Male",
        clinic: "Safe2Bite Allergy Care – Austin, TX",
        treatment: {
          status: "needs_review",
          statusLabel: "Needs Review",
          statusClass: "badge-treat-needs-review",
          protocol: "Tree Nut OIT",
          phase: "Phase 1 — Initial Escalation",
          currentDose: "6 mg Walnut Protein",
          targetDose: "300 mg Maintenance Dose",
          nextDoseTime: "Sep 18, 2026 · 8:00 AM",
          lastUpdated: "Sep 08, 2026 by Dr. Sarah Chen",
          adherenceRate: "89.2%"
        },
        todayStatus: {
          assessment: {
            status: "not_submitted",
            label: "Not Submitted",
            class: "badge-assess-not-submitted",
            icon: "minus",
            time: "Overdue",
            wellness: "Unreported",
            symptoms: "Unreported",
            severity: "None",
            notes: "Caregiver has not submitted today's health assessment."
          },
          dose: {
            status: "missed",
            label: "Missed",
            class: "badge-dose-missed",
            icon: "alert-circle",
            scheduledTime: "8:00 AM",
            recordedTime: "—",
            doseValue: "6 mg Walnut Protein",
            verifiedBy: "Automated Non-Submission Log"
          },
          reaction: {
            hasReaction: false,
            status: "none",
            label: "No Reported Reaction",
            class: "badge-alert-none",
            icon: "shield-check",
            symptoms: "None",
            severity: "None",
            time: "—",
            actionTaken: "—",
            reviewStatus: "No Action Needed",
            notes: "No reactions logged."
          },
          illness: {
            hasIllness: false,
            status: "none",
            label: "No Reported Illness",
            class: "badge-alert-none",
            icon: "shield-check",
            symptoms: "None",
            severity: "None",
            date: "—",
            doseHold: false,
            reviewStatus: "No Action Needed",
            notes: "No illness reports submitted."
          },
          foodIntake: {
            hasIntake: false,
            status: "not_updated",
            label: "Not Updated",
            class: "badge-assess-not-submitted",
            icon: "minus",
            meal: "—",
            time: "—",
            description: "No food entries submitted today",
            notes: "No dietary logs recorded for current date."
          }
        },
        alerts: [
          {
            id: "ALT-LIAM-01",
            type: "missed-dose",
            title: "Missed Dose (Day 3)",
            detail: "Scheduled morning dose (6 mg Walnut) not recorded. Protocol adherence review required.",
            time: "Today · 8:00 AM",
            severity: "attention",
            actionText: "Follow Up Missed Dose",
            actionType: "doses"
          }
        ],
        upcomingDoses: [
          { date: "Tomorrow, Sep 18", time: "8:00 AM", label: "Tree Nut OIT", doseValue: "6 mg Walnut Protein", status: "Pending Contact", statusClass: "badge-treat-needs-review" },
          { date: "Saturday, Sep 19", time: "8:00 AM", label: "Tree Nut OIT", doseValue: "6 mg Walnut Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" }
        ],
        recentActivity: [
          { date: "Today", time: "8:00 AM", type: "dose", icon: "alert-circle", title: "Dose Missed", detail: "6 mg Walnut Protein not recorded by scheduled time", status: "Missed", statusClass: "badge-dose-missed", actionText: "Follow Up" },
          { date: "Yesterday", time: "8:00 AM", type: "dose", icon: "alert-circle", title: "Dose Missed", detail: "Dose skipped due to family travel", status: "Missed", statusClass: "badge-dose-missed", actionText: "Follow Up" },
          { date: "Sep 15, 2026", time: "8:10 AM", type: "dose", icon: "check-circle", title: "Dose Taken", detail: "6 mg Walnut Protein administered", status: "Taken", statusClass: "badge-dose-taken", actionText: "View Dose" }
        ]
      },

      "SB-00127": { // Sophia Nguyen (Illness case)
        caregiver: {
          name: "Mai Nguyen",
          relationship: "Mother / Primary Caregiver",
          phone: "(512) 555-0177",
          email: "mai.n@example.com"
        },
        gender: "Female",
        clinic: "Safe2Bite Allergy Care – Austin, TX",
        treatment: {
          status: "paused",
          statusLabel: "Paused (Illness Hold)",
          statusClass: "badge-treat-paused",
          protocol: "Egg OIT",
          phase: "Phase 2 — Dose Build-Up",
          currentDose: "15 mg Egg White Protein",
          targetDose: "300 mg Maintenance Dose",
          nextDoseTime: "Pending Clinician Hold Release",
          lastUpdated: "Sep 16, 2026 by Dr. Sarah Chen",
          adherenceRate: "94.0%"
        },
        todayStatus: {
          assessment: {
            status: "completed",
            label: "Illness Assessment Submitted",
            class: "badge-assess-pending",
            icon: "clock",
            time: "Today · 8:15 AM",
            wellness: "Mild fever & nasal congestion",
            symptoms: "Low-grade fever (99.8°F), runny nose, fatigue",
            severity: "Mild",
            notes: "Caregiver submitted illness assessment requesting clinical guidance on dose hold."
          },
          dose: {
            status: "not_taken",
            label: "On Hold",
            class: "badge-treat-paused",
            icon: "pause-circle",
            scheduledTime: "8:00 AM",
            recordedTime: "—",
            doseValue: "15 mg Egg White Protein",
            verifiedBy: "Caregiver Hold Request"
          },
          reaction: {
            hasReaction: false,
            status: "none",
            label: "No Reported Reaction",
            class: "badge-alert-none",
            icon: "shield-check",
            symptoms: "None",
            severity: "None",
            time: "—",
            actionTaken: "—",
            reviewStatus: "No Action Needed",
            notes: "No allergic reactions reported."
          },
          illness: {
            hasIllness: true,
            status: "attention_required",
            label: "Illness Reported",
            class: "badge-treat-paused",
            icon: "thermometer",
            symptoms: "Mild rhinovirus symptoms: nasal congestion, mild cough, temp 99.8°F",
            severity: "Mild",
            date: "Yesterday, Sep 16",
            doseHold: true,
            reviewStatus: "Requires Review",
            notes: "Protocol requires dose hold during febrile illness until 24h afebrile."
          },
          foodIntake: {
            hasIntake: true,
            status: "updated",
            label: "Updated",
            class: "badge-assess-completed",
            icon: "check-circle",
            meal: "Breakfast",
            time: "Today · 8:00 AM",
            description: "Chicken noodle soup and warm chamomile tea with honey",
            notes: "Light dietary intake during illness."
          }
        },
        alerts: [
          {
            id: "ALT-SOPHIA-01",
            type: "illness",
            title: "Illness Assessment Requires Review",
            detail: "Mild cold & 99.8°F fever reported. Dose placed on temporary hold.",
            time: "Today · 8:15 AM",
            severity: "review",
            actionText: "Review Illness Hold",
            actionType: "illness"
          }
        ],
        upcomingDoses: [
          { date: "Pending Hold Release", time: "—", label: "Egg OIT", doseValue: "15 mg Egg White Protein", status: "On Hold", statusClass: "badge-treat-paused" }
        ],
        recentActivity: [
          { date: "Today", time: "8:15 AM", type: "illness", icon: "thermometer", title: "Illness Assessment Submitted", detail: "Parent reported 99.8°F temp & congestion; requested hold", status: "Pending Review", statusClass: "badge-treat-paused", actionText: "Review Illness" },
          { date: "Today", time: "8:00 AM", type: "dose", icon: "pause-circle", title: "Dose Held", detail: "Morning dose withheld due to active illness protocol", status: "On Hold", statusClass: "badge-treat-paused", actionText: "View Protocol" },
          { date: "Yesterday", time: "6:00 PM", type: "assessment", icon: "clipboard", title: "Health Assessment Completed", detail: "Mild fatigue reported", status: "Completed", statusClass: "badge-assess-completed", actionText: "View Assessment" }
        ]
      }
    };

    // Return special profile if explicitly defined
    if (specialProfiles[p.id]) {
      const sp = specialProfiles[p.id];
      return {
        authorized: true,
        id: p.id,
        name: p.name,
        firstName: p.firstName,
        lastName: p.lastName,
        initials: p.initials,
        avatarColor: p.avatarColor,
        age: p.age,
        dob: p.dobPlaceholder,
        gender: sp.gender,
        clinic: sp.clinic,
        caregiver: sp.caregiver,
        assignedDoctor: {
          name: p.careTeamLabel || "Dr. Sarah Chen",
          role: "Allergist & Immunologist"
        },
        treatment: sp.treatment,
        todayStatus: sp.todayStatus,
        alerts: sp.alerts,
        upcomingDoses: sp.upcomingDoses,
        recentActivity: sp.recentActivity
      };
    }

    // Dynamic generator for any other patient in directory
    const isPaused = p.treatmentStatus === 'paused';
    const isNeedsReview = p.treatmentStatus === 'needs_review';
    const isAttention = p.alertStatus === 'attention_required';

    const treatClassMap = {
      'active': 'badge-treat-active',
      'paused': 'badge-treat-paused',
      'completed': 'badge-treat-completed',
      'needs_review': 'badge-treat-needs-review'
    };

    const alertsList = [];
    if (isAttention && p.alertDetail) {
      alertsList.push({
        id: `ALT-${p.id}`,
        type: 'attention',
        title: p.alertDetail.split('—')[0] || 'Attention Required',
        detail: p.alertDetail,
        time: p.lastActivity || 'Today',
        severity: 'attention',
        actionText: 'Review Clinical Item',
        actionType: 'overview'
      });
    }

    return {
      authorized: true,
      id: p.id,
      name: p.name,
      firstName: p.firstName,
      lastName: p.lastName,
      initials: p.initials,
      avatarColor: p.avatarColor,
      age: p.age,
      dob: p.dobPlaceholder,
      gender: p.age % 2 === 0 ? "Female" : "Male",
      clinic: "Safe2Bite Allergy Care – Austin, TX",
      caregiver: {
        name: `${p.lastName} Family Contact`,
        relationship: "Parent / Primary Caregiver",
        phone: "(512) 555-0100",
        email: `contact.${p.id.toLowerCase()}@example.com`
      },
      assignedDoctor: {
        name: p.careTeamLabel || "Dr. Sarah Chen",
        role: "Allergist & Immunologist"
      },
      treatment: {
        status: p.treatmentStatus,
        statusLabel: p.treatmentStatusLabel,
        statusClass: treatClassMap[p.treatmentStatus] || 'badge-treat-active',
        protocol: p.treatmentLabel ? p.treatmentLabel.split('—')[0].trim() : 'OIT Protocol',
        phase: p.treatmentLabel ? (p.treatmentLabel.split('—')[1] || 'Escalation Phase').trim() : 'Phase 2',
        currentDose: "10 mg Active Allergen Protein",
        targetDose: "300 mg Maintenance Dose",
        nextDoseTime: p.nextScheduledDose || "Tomorrow · 8:00 AM",
        lastUpdated: "Sep 12, 2026 by Dr. Sarah Chen",
        adherenceRate: "96.5%"
      },
      todayStatus: {
        assessment: {
          status: p.assessmentStatus,
          label: p.assessmentStatusLabel,
          class: p.assessmentStatus === 'completed' ? 'badge-assess-completed' : (p.assessmentStatus === 'pending' ? 'badge-assess-pending' : 'badge-assess-not-submitted'),
          icon: p.assessmentStatus === 'completed' ? 'check-circle' : (p.assessmentStatus === 'pending' ? 'clock' : 'minus'),
          time: p.assessmentStatus === 'completed' ? 'Today · 8:30 AM' : (p.assessmentStatus === 'pending' ? 'Pending submission' : 'Not submitted'),
          wellness: p.assessmentStatus === 'completed' ? 'Feeling Well' : 'Pending',
          symptoms: 'None reported',
          severity: 'None',
          notes: p.notes || "No acute remarks reported."
        },
        dose: {
          status: p.doseStatus,
          label: p.doseStatusLabel,
          class: p.doseStatus === 'taken' ? 'badge-dose-taken' : (p.doseStatus === 'missed' ? 'badge-dose-missed' : (p.doseStatus === 'upcoming' ? 'badge-dose-upcoming' : 'badge-dose-not-taken')),
          icon: p.doseStatus === 'taken' ? 'check-circle' : (p.doseStatus === 'missed' ? 'alert-circle' : (p.doseStatus === 'upcoming' ? 'clock' : 'minus')),
          scheduledTime: "8:00 AM",
          recordedTime: p.doseStatus === 'taken' ? "8:10 AM" : "—",
          doseValue: "10 mg Allergen Protein",
          verifiedBy: p.doseStatus === 'taken' ? "Caregiver App Verification" : "—"
        },
        reaction: {
          hasReaction: isAttention && p.alertDetail.toLowerCase().includes('reaction'),
          status: isAttention && p.alertDetail.toLowerCase().includes('reaction') ? 'attention_required' : 'none',
          label: isAttention && p.alertDetail.toLowerCase().includes('reaction') ? 'Reaction Reported' : 'No Reported Reaction',
          class: isAttention && p.alertDetail.toLowerCase().includes('reaction') ? 'badge-alert-attention' : 'badge-alert-none',
          icon: isAttention && p.alertDetail.toLowerCase().includes('reaction') ? 'alert-triangle' : 'shield-check',
          symptoms: isAttention && p.alertDetail.toLowerCase().includes('reaction') ? p.alertDetail : 'None',
          severity: isAttention && p.alertDetail.toLowerCase().includes('reaction') ? 'Mild' : 'None',
          time: isAttention ? p.lastActivity : '—',
          actionTaken: isAttention ? 'Caregiver administered action plan' : '—',
          reviewStatus: isAttention ? 'Requires Review' : 'No Action Needed',
          notes: "No unreviewed reactions recorded."
        },
        illness: {
          hasIllness: isPaused,
          status: isPaused ? 'attention_required' : 'none',
          label: isPaused ? 'Illness Reported' : 'No Reported Illness',
          class: isPaused ? 'badge-treat-paused' : 'badge-alert-none',
          icon: isPaused ? 'thermometer' : 'shield-check',
          symptoms: isPaused ? 'Mild viral symptoms reported by parent' : 'None',
          severity: isPaused ? 'Mild' : 'None',
          date: isPaused ? 'Past 48 hours' : '—',
          doseHold: isPaused,
          reviewStatus: isPaused ? 'Requires Review' : 'No Action Needed',
          notes: isPaused ? 'Dose hold active pending 24h afebrile period.' : 'No illness recorded.'
        },
        foodIntake: {
          hasIntake: true,
          status: 'updated',
          label: 'Updated',
          class: 'badge-assess-completed',
          icon: 'check-circle',
          meal: 'Breakfast',
          time: 'Today · 7:30 AM',
          description: 'Cereal with low-fat milk and banana slices',
          notes: 'Consumed prior to morning activity.'
        }
      },
      alerts: alertsList,
      upcomingDoses: [
        { date: "Tomorrow", time: "8:00 AM", label: p.treatmentLabel ? p.treatmentLabel.split('—')[0] : 'OIT', doseValue: "10 mg Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" },
        { date: "Day after tomorrow", time: "8:00 AM", label: p.treatmentLabel ? p.treatmentLabel.split('—')[0] : 'OIT', doseValue: "10 mg Protein", status: "Scheduled", statusClass: "badge-dose-upcoming" }
      ],
      recentActivity: [
        { date: "Today", time: p.lastActivity || "9:00 AM", type: "activity", icon: "clock", title: p.doseStatus === 'taken' ? "Dose Administered" : "Patient Status Checked", detail: p.treatmentLabel || "OIT Protocol", status: p.doseStatusLabel || "Recorded", statusClass: "badge-assess-completed", actionText: "View Details" },
        { date: "Yesterday", time: "8:00 AM", type: "dose", icon: "check-circle", title: "Scheduled Protocol Event", detail: "Daily maintenance dose cycle", status: "Logged", statusClass: "badge-dose-taken", actionText: "View History" }
      ]
    };
  },

  /* --------------------------------------------------
     Pass 7: Secure Care-Team & Patient Conversations
  -------------------------------------------------- */
  conversations: [
    {
      id: "conv-1",
      type: "patient",
      participantName: "David Vance",
      participantRole: "Father of Marcus Vance",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      patientProtocol: "Peanut OIT",
      patientPhase: "Phase 2",
      currentDose: "20mg Peanut Protein",
      lastMessageTime: "9:24 AM",
      lastMessageSnippet: "David: Hives have settled down after cetirizine. Resting in bed now.",
      unreadCount: 1,
      needsResponse: true,
      messages: [
        { id: "m101", sender: "David Vance", senderRole: "patient", timestamp: "Today, 9:12 AM", content: "Good morning Dr. Chen, Marcus developed mild hives on his chest about 20 minutes after taking his morning 20mg dose with oatmeal. We gave 10mg Cetirizine per his action plan.", isInbound: true },
        { id: "m102", sender: "Dr. Sarah Chen", senderRole: "doctor", timestamp: "Today, 9:20 AM", content: "Thank you for the update David. Please keep him resting and hold strenuous physical activity today. Hold tomorrow morning's dose until our follow-up check.", isInbound: false },
        { id: "m103", sender: "David Vance", senderRole: "patient", timestamp: "Today, 9:24 AM", content: "Hives have settled down after cetirizine. Resting in bed now. Thank you Dr. Chen.", isInbound: true }
      ]
    },
    {
      id: "conv-2",
      type: "patient",
      participantName: "Elena Vasquez",
      participantRole: "Mother of Emma Vasquez",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      patientProtocol: "Peanut OIT",
      patientPhase: "Phase 3",
      currentDose: "40mg Peanut Protein",
      lastMessageTime: "Yesterday",
      lastMessageSnippet: "Dr. Sarah Chen: Reviewed photos submitted with log. Mild urticaria limited to bilateral forearms.",
      unreadCount: 0,
      needsResponse: false,
      messages: [
        { id: "m201", sender: "Elena Vasquez", senderRole: "patient", timestamp: "Yesterday, 6:34 PM", content: "Hi Dr. Chen, Emma noticed some mild itching on both forearms after dinner. There are about 4 red hives. Breathing is fine and no tummy pain.", isInbound: true },
        { id: "m202", sender: "Dr. Sarah Chen", senderRole: "doctor", timestamp: "Yesterday, 7:15 PM", content: "Reviewed photos submitted with log. Mild urticaria limited to bilateral forearms. Please repeat 40mg with food tomorrow under observation; will check in tomorrow evening.", isInbound: false }
      ]
    },
    {
      id: "conv-3",
      type: "care_team",
      participantName: "Nurse Elena Rostova",
      participantRole: "Lead Clinical Nurse & Triage",
      patientId: null,
      patientName: null,
      patientProtocol: null,
      patientPhase: null,
      currentDose: null,
      lastMessageTime: "8:35 AM",
      lastMessageSnippet: "Elena: Liam Okafor's father reached via phone. Re-entry dose scheduled for Thursday.",
      unreadCount: 0,
      needsResponse: false,
      messages: [
        { id: "m301", sender: "Dr. Sarah Chen", senderRole: "doctor", timestamp: "Today, 8:15 AM", content: "Elena, could you follow up on Liam Okafor (PT-20417)? The automated monitor flagged 3 consecutive missed doses while traveling.", isInbound: false },
        { id: "m302", sender: "Nurse Elena Rostova", senderRole: "care_team", timestamp: "Today, 8:35 AM", content: "Liam Okafor's father reached via phone. Family is back in town tonight. Re-entry dose scheduled for Thursday clinic.", isInbound: true }
      ]
    },
    {
      id: "conv-4",
      type: "patient",
      participantName: "Hanh Nguyen",
      participantRole: "Mother of Sophia Nguyen",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      patientProtocol: "Egg OIT",
      patientPhase: "Phase 2",
      currentDose: "15mg Egg Protein",
      lastMessageTime: "Yesterday",
      lastMessageSnippet: "Nurse Elena Rostova: Dose hold approved for mild cold symptoms. Please log temperature tonight.",
      unreadCount: 0,
      needsResponse: false,
      messages: [
        { id: "m401", sender: "Hanh Nguyen", senderRole: "patient", timestamp: "Yesterday, 3:10 PM", content: "Sophia has a runny nose and mild congestion from preschool. No fever. Should we proceed with today's dose?", isInbound: true },
        { id: "m402", sender: "Nurse Elena Rostova", senderRole: "care_team", timestamp: "Yesterday, 3:25 PM", content: "Dose hold approved for mild cold symptoms. Please log temperature tonight and we will check again in 24 hours.", isInbound: false }
      ]
    },
    {
      id: "conv-5",
      type: "patient",
      participantName: "Chidi Okafor",
      participantRole: "Father of Liam Okafor",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      patientProtocol: "Tree Nut OIT",
      patientPhase: "Phase 1",
      currentDose: "12mg Walnut Protein",
      lastMessageTime: "Sep 15",
      lastMessageSnippet: "Chidi: Confirmed, we will see Nurse Elena on Thursday at 10:30 AM.",
      unreadCount: 0,
      needsResponse: false,
      messages: [
        { id: "m501", sender: "Chidi Okafor", senderRole: "patient", timestamp: "Sep 15, 8:40 AM", content: "Hello team, we accidentally left Liam's refrigerated dose vials while traveling for a family event.", isInbound: true },
        { id: "m502", sender: "Dr. Sarah Chen", senderRole: "doctor", timestamp: "Sep 15, 9:00 AM", content: "Understood Chidi. Do not double up doses. When you return, Liam will do a quick in-clinic re-entry challenge.", isInbound: false },
        { id: "m503", sender: "Chidi Okafor", senderRole: "patient", timestamp: "Sep 15, 9:15 AM", content: "Confirmed, we will see Nurse Elena on Thursday at 10:30 AM.", isInbound: true }
      ]
    },
    {
      id: "conv-6",
      type: "patient",
      participantName: "Marcus Williams",
      participantRole: "Adult Patient",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      patientProtocol: "Dairy OIT",
      patientPhase: "Maintenance",
      currentDose: "200mg Milk Protein",
      lastMessageTime: "Sep 14",
      lastMessageSnippet: "Dr. Michael Lee: Maintenance labs received. IgG4 levels demonstrate excellent immune modulation.",
      unreadCount: 0,
      needsResponse: false,
      messages: [
        { id: "m601", sender: "Marcus Williams", senderRole: "patient", timestamp: "Sep 14, 11:20 AM", content: "Hi Dr. Lee, finished my 6-month maintenance blood draw yesterday at Quest.", isInbound: true },
        { id: "m602", sender: "Dr. Michael Lee", senderRole: "doctor", timestamp: "Sep 14, 2:45 PM", content: "Maintenance labs received. IgG4 levels demonstrate excellent immune modulation. Keep up the daily maintenance routine!", isInbound: false }
      ]
    },
    {
      id: "conv-7",
      type: "patient",
      participantName: "Meera Patel",
      participantRole: "Mother of Liam Patel",
      patientId: "PT-20412",
      patientName: "Liam Patel",
      patientProtocol: "Cashew OIT",
      patientPhase: "Phase 1",
      currentDose: "8mg Cashew Protein",
      lastMessageTime: "7:50 AM",
      lastMessageSnippet: "Meera: Woke up with fever 101.4 and vomiting. We held dose.",
      unreadCount: 1,
      needsResponse: true,
      messages: [
        { id: "m701", sender: "Meera Patel", senderRole: "patient", timestamp: "Today, 7:50 AM", content: "Woke up with fever 101.4 and vomiting. We held morning cashew dose per the illness guideline.", isInbound: true }
      ]
    },
    {
      id: "conv-8",
      type: "patient",
      participantName: "Sarah Johnson",
      participantRole: "Adult Patient",
      patientId: "SB-00124",
      patientName: "Sarah Johnson",
      patientProtocol: "Peanut OIT",
      patientPhase: "Phase 3",
      currentDose: "50mg Peanut Protein",
      lastMessageTime: "Sep 12",
      lastMessageSnippet: "Sarah Johnson: Dose tolerance is excellent. Looking forward to Phase 4 escalation.",
      unreadCount: 0,
      needsResponse: false,
      messages: [
        { id: "m801", sender: "Sarah Johnson", senderRole: "patient", timestamp: "Sep 12, 10:00 AM", content: "Dose tolerance is excellent. Looking forward to Phase 4 escalation next month.", isInbound: true }
      ]
    }
  ],

  /* --------------------------------------------------
     Pass 7: Comprehensive Clinical Appointments
  -------------------------------------------------- */
  allAppointments: [
    {
      id: "apt-201",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      protocol: "Peanut OIT — Phase 3",
      currentDose: "40mg Peanut Protein",
      type: "Escalation Challenge",
      date: "Today, Oct 14",
      time: "9:00 AM",
      duration: "60 min",
      clinician: "Dr. Sarah Chen",
      location: "Clinic Room 3A",
      isVirtual: false,
      status: "confirmed",
      reason: "In-clinic dose escalation challenge to 60mg peanut protein",
      clinicalNotes: [
        { author: "Dr. Sarah Chen", date: "Oct 12", note: "Vital signs stable, parent confirmed afebrile for past 7 days. Emergency medication kit verified." }
      ]
    },
    {
      id: "apt-202",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      protocol: "Tree Nut OIT — Phase 1",
      currentDose: "12mg Walnut Protein",
      type: "Re-entry Clearance",
      date: "Today, Oct 14",
      time: "10:30 AM",
      duration: "45 min",
      clinician: "Nurse Elena Rostova",
      location: "Observation Bay 2",
      isVirtual: false,
      status: "confirmed",
      reason: "Re-entry dosing protocol review following 3 consecutive missed doses",
      clinicalNotes: [
        { author: "Nurse Elena Rostova", date: "Oct 13", note: "Parent contacted. Cold pack failure resolved. Will observe 12mg test dose in clinic." }
      ]
    },
    {
      id: "apt-203",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      protocol: "Egg OIT — Phase 2",
      currentDose: "15mg Egg Protein",
      type: "Telehealth Check",
      date: "Today, Oct 14",
      time: "1:15 PM",
      duration: "30 min",
      clinician: "Dr. Sarah Chen",
      location: "Telehealth Room B",
      isVirtual: true,
      status: "scheduled",
      reason: "Post-illness symptom clearance and dose un-hold authorization",
      clinicalNotes: []
    },
    {
      id: "apt-204",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      protocol: "Dairy OIT — Maintenance",
      currentDose: "200mg Milk Protein",
      type: "Maintenance Review",
      date: "Today, Oct 14",
      time: "3:00 PM",
      duration: "30 min",
      clinician: "Dr. Michael Lee",
      location: "Clinic Room 1B",
      isVirtual: false,
      status: "confirmed",
      reason: "6-Month Maintenance blood draw and clinical tolerance evaluation",
      clinicalNotes: [
        { author: "Dr. Michael Lee", date: "Oct 10", note: "Review IgG4 titer trends and pulmonary peak flow." }
      ]
    },
    {
      id: "apt-205",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      protocol: "Peanut OIT — Phase 2",
      currentDose: "20mg Peanut Protein",
      type: "Reaction Follow-up",
      date: "Tomorrow, Oct 15",
      time: "9:30 AM",
      duration: "45 min",
      clinician: "Dr. Sarah Chen",
      location: "Clinic Room 3A",
      isVirtual: false,
      status: "confirmed",
      reason: "Clinical examination following mild hives event post-dose",
      clinicalNotes: [
        { author: "Dr. Sarah Chen", date: "Today", note: "Phone check completed. Patient stable after cetirizine. Holding morning dose." }
      ]
    },
    {
      id: "apt-206",
      patientId: "PT-20412",
      patientName: "Liam Patel",
      protocol: "Cashew OIT — Phase 1",
      currentDose: "8mg Cashew Protein",
      type: "Sick-Day Follow-up",
      date: "Fri, Oct 16",
      time: "11:00 AM",
      duration: "30 min",
      clinician: "Nurse Elena Rostova",
      location: "Telehealth Room A",
      isVirtual: true,
      status: "scheduled",
      reason: "Fever clearance assessment before resuming cashew titration",
      clinicalNotes: []
    },
    {
      id: "apt-207",
      patientId: "SB-00124",
      patientName: "Sarah Johnson",
      protocol: "Peanut OIT — Phase 3",
      currentDose: "50mg Peanut Protein",
      type: "Phase 4 Up-Dosing",
      date: "Mon, Oct 19",
      time: "8:30 AM",
      duration: "90 min",
      clinician: "Dr. Sarah Chen",
      location: "Infusion / Challenge Suite",
      isVirtual: false,
      status: "scheduled",
      reason: "Escalation to Phase 4 protocol with serial 15-minute vitals",
      clinicalNotes: []
    },
    {
      id: "apt-208",
      patientId: "PT-20355",
      patientName: "Sofia Rodriguez",
      protocol: "Sesame OIT — Phase 3",
      currentDose: "30mg Sesame Protein",
      type: "Routine Check",
      date: "Tue, Oct 20",
      time: "2:00 PM",
      duration: "30 min",
      clinician: "Nurse Elena Rostova",
      location: "Clinic Room 2A",
      isVirtual: false,
      status: "confirmed",
      reason: "Mid-phase weight adjustment and prescription refill check",
      clinicalNotes: []
    },
    {
      id: "apt-209",
      patientId: "PT-20490",
      patientName: "Noah Kim",
      protocol: "Walnut OIT — Phase 2",
      currentDose: "15mg Walnut Protein",
      type: "Adherence Counseling",
      date: "Wed, Oct 21",
      time: "10:00 AM",
      duration: "45 min",
      clinician: "Dr. Michael Lee",
      location: "Telehealth Room B",
      isVirtual: true,
      status: "scheduled",
      reason: "Caregiver consultation regarding dose administration scheduling",
      clinicalNotes: []
    },
    {
      id: "apt-210",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      protocol: "Peanut OIT — Phase 3",
      currentDose: "40mg Peanut Protein",
      type: "Initial Challenge",
      date: "Sep 28, 2026",
      time: "9:00 AM",
      duration: "60 min",
      clinician: "Dr. Sarah Chen",
      location: "Clinic Room 3A",
      isVirtual: false,
      status: "completed",
      reason: "Phase 3 entry challenge 40mg peanut protein",
      clinicalNotes: [
        { author: "Dr. Sarah Chen", date: "Sep 28", note: "Tolerated well. Discharged after 90 minute observation window." }
      ]
    },
    {
      id: "apt-211",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      protocol: "Tree Nut OIT — Phase 1",
      currentDose: "12mg Walnut Protein",
      type: "Routine Check",
      date: "Sep 22, 2026",
      time: "11:00 AM",
      duration: "30 min",
      clinician: "Dr. Sarah Chen",
      location: "Clinic Room 2B",
      isVirtual: false,
      status: "completed",
      reason: "Phase 1 progress check",
      clinicalNotes: [
        { author: "Dr. Sarah Chen", date: "Sep 22", note: "Dose kit instructions reinforced." }
      ]
    },
    {
      id: "apt-212",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      protocol: "Egg OIT — Phase 2",
      currentDose: "15mg Egg Protein",
      type: "Clinic Visit",
      date: "Sep 15, 2026",
      time: "1:00 PM",
      duration: "30 min",
      clinician: "Nurse Elena Rostova",
      location: "Clinic Room 1A",
      isVirtual: false,
      status: "cancelled",
      reason: "Patient requested reschedule due to illness",
      clinicalNotes: [
        { author: "Nurse Elena Rostova", date: "Sep 14", note: "Rescheduled per mother's phone call." }
      ]
    },
    {
      id: "apt-213",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      protocol: "Dairy OIT — Maintenance",
      currentDose: "200mg Milk Protein",
      type: "Routine Check",
      date: "Sep 08, 2026",
      time: "3:30 PM",
      duration: "30 min",
      clinician: "Dr. Michael Lee",
      location: "Clinic Room 1B",
      isVirtual: false,
      status: "completed",
      reason: "Quarterly maintenance follow-up",
      clinicalNotes: [
        { author: "Dr. Michael Lee", date: "Sep 08", note: "Normal exam, peak flow 480 L/min." }
      ]
    }
  ],

  /* --------------------------------------------------
     Pass 8: Clinician-Approved Educational Resources
  -------------------------------------------------- */
  education: [
    {
      id: "edu-1",
      title: "Understanding Your Daily Dose Routine",
      category: "Daily Dosing",
      audience: "Both", // Patient | Caregiver | Both | Care Team
      status: "published", // published | draft | archived
      lastUpdated: "Sep 10, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Best practices for administering daily oral immunotherapy doses safely at home.",
      content: "Daily dosing is the core of oral immunotherapy (OIT). Doses must always be taken with a substantial meal containing carbohydrates and fat to slow absorption. Never administer a dose on an empty stomach or immediately before or after vigorous physical exercise. Keep at least a 2-hour observation window following each dose during which the patient remains awake and in the vicinity of an adult caregiver trained in emergency anaphylaxis response."
    },
    {
      id: "edu-2",
      title: "Recognizing Allergic Reactions: Mild vs. Severe",
      category: "Reaction Awareness",
      audience: "Both",
      status: "published",
      lastUpdated: "Sep 05, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Clear distinctions between mild localized symptoms and systemic emergencies.",
      content: "Mild reactions typically involve localized itching, a few hives, or mild redness around the mouth. These should be treated with prescribed antihistamines and logged immediately in the Safe2Bite app. Severe reactions involve two or more body systems (e.g. skin hives plus vomiting, coughing, or dizziness) or any difficulty breathing or throat tightness. Severe reactions require immediate epinephrine injection and 911 activation. Always remember: when in doubt, use epinephrine first."
    },
    {
      id: "edu-3",
      title: "What to Do If a Dose Is Missed or Delayed",
      category: "Missed Dose Guidance",
      audience: "Caregiver",
      status: "published",
      lastUpdated: "Aug 28, 2026",
      updatedBy: "Nurse Elena Rostova",
      summary: "Step-by-step guidance on safely managing missed doses without double-dosing.",
      content: "Never give two doses in one day to make up for a missed dose. If a dose is delayed by a few hours on the same calendar day, it may generally be given with dinner. If a full 24-hour dose cycle is missed, log it in the app and continue the regular dose the next day. If 2 or more consecutive days are missed, do not give the home dose—contact our clinical care team through the portal for re-entry guidance."
    },
    {
      id: "edu-4",
      title: "Sick Day Protocol: Managing Illness During OIT",
      category: "Illness & Treatment",
      audience: "Both",
      status: "published",
      lastUpdated: "Sep 12, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Criteria for holding home doses during fevers, vomiting, or asthma flares.",
      content: "Viral infections and systemic inflammation lower the clinical threshold for allergic reactions. If your child has a fever over 100.4°F (38°C), active vomiting, diarrhea, or an acute asthma exacerbation, hold the daily dose and log the illness in the Safe2Bite app. Resume dosing only after 24 hours of normal temperature without fever-reducing medications, and message your care team if the hold exceeds 48 hours."
    },
    {
      id: "edu-5",
      title: "Emergency Care Plan: Epinephrine Auto-Injector Steps",
      category: "Emergency Preparedness",
      audience: "Both",
      status: "published",
      lastUpdated: "Sep 01, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Critical step-by-step instructions for emergency auto-injector administration.",
      content: "1. Form a fist around the auto-injector with the tip pointing downward. 2. Remove the safety release cap. 3. Hold the outer thigh and swing firmly until the device clicks into the thigh muscle at a 90-degree angle. 4. Hold firmly against the thigh for 3 full seconds. 5. Call 911 immediately and state 'anaphylaxis treated with epinephrine'. 6. Keep the patient lying flat with feet elevated unless breathing is difficult, in which case keep seated."
    },
    {
      id: "edu-6",
      title: "Food Preparation & Safe Allergen Storage at Home",
      category: "Food & Nutrition",
      audience: "Caregiver",
      status: "published",
      lastUpdated: "Aug 15, 2026",
      updatedBy: "Nurse Elena Rostova",
      summary: "Preventing accidental cross-contact and safely storing prescribed medical doses.",
      content: "Prescribed pharmaceutical-grade allergen powders or pre-measured food proteins must be stored in their original labeled Safe2Bite containers, refrigerated if indicated, and kept out of reach of young children. Use dedicated measuring utensils and mix into cold or room-temperature vehicles such as applesauce, yogurt, or pudding. Never microwave or boil the dose vehicle as heat may alter the therapeutic protein structure."
    },
    {
      id: "edu-7",
      title: "Principles of Oral Immunotherapy Desensitization",
      category: "Oral Immunotherapy",
      audience: "Patient",
      status: "published",
      lastUpdated: "Jul 20, 2026",
      updatedBy: "Dr. Michael Lee",
      summary: "How gradual, controlled antigen exposure retrains the immune system over time.",
      content: "Oral immunotherapy works by introducing tiny, precisely measured quantities of the allergenic food to the gastrointestinal tract daily. Over weeks and months, dendritic cells and regulatory T-cells shift the immune response away from allergic IgE antibodies and toward protective IgG4 blocking antibodies. The goal is to establish protection against accidental ingestion exposures, providing peace of mind and safety."
    },
    {
      id: "edu-8",
      title: "School & Caregiver Coordination Checklist",
      category: "Caregiver Guidance",
      audience: "Caregiver",
      status: "published",
      lastUpdated: "Aug 30, 2026",
      updatedBy: "Nurse Elena Rostova",
      summary: "Sharing emergency plans and accommodation notes with teachers and school nurses.",
      content: "Ensure your child's school nurse, principal, and homeroom teachers have a signed copy of the Safe2Bite Allergy & Anaphylaxis Emergency Plan. Two non-expired epinephrine auto-injectors must remain in the school health office or with the student if self-carry authorized. Remind staff that Safe2Bite OIT doses are strictly given at home under parent supervision, never at school."
    },
    {
      id: "edu-9",
      title: "Frequently Asked Questions About OIT Titration",
      category: "Frequently Asked Questions",
      audience: "Both",
      status: "published",
      lastUpdated: "Sep 08, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Answers to common questions regarding escalation visits, taste, and exercise rules.",
      content: "Q: Can my child do sports after taking a dose? A: No, avoid vigorous exercise (running, soccer, swimming, jumping) for 2 hours post-dose as elevated heart rate and body heat accelerate systemic absorption. Q: Why does the dose need to increase in the clinic? A: Dose escalations carry the highest risk of unexpected symptoms and must always be supervised by an experienced allergist in a clinic equipped with resuscitation supplies."
    },
    {
      id: "edu-10",
      title: "Internal Protocol: Managing Exercise-Induced Cofactors",
      category: "Oral Immunotherapy",
      audience: "Care Team",
      status: "published",
      lastUpdated: "Aug 10, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Clinical team guide on assessing exercise, NSAIDs, and sleep deprivation cofactors.",
      content: "Clinical Care Team reference: Exercise, non-steroidal anti-inflammatory drugs (NSAIDs), menses, and sleep deprivation significantly lower the eliciting dose threshold for food-induced anaphylaxis. When reviewing delayed reaction reports, clinicians must specifically query these cofactors during triage interviews and reinforce strict 2-hour post-dose rest periods."
    },
    {
      id: "edu-11",
      title: "Draft: Advanced Sublingual Immunotherapy (SLIT) Overview",
      category: "Food Allergy Basics",
      audience: "Both",
      status: "draft",
      lastUpdated: "Sep 15, 2026",
      updatedBy: "Dr. Michael Lee",
      summary: "Under development: Comparison between sublingual and oral immunotherapy approaches.",
      content: "This resource is currently in draft status and under clinical review by the medical director. It compares sublingual administration of allergen extracts under the tongue with gastrointestinal oral ingestion."
    },
    {
      id: "edu-12",
      title: "Archived: 2025 Seasonal Pollen-Food Allergy Syndrome Guide",
      category: "Food Allergy Basics",
      audience: "Patient",
      status: "archived",
      lastUpdated: "Jan 10, 2026",
      updatedBy: "Dr. Sarah Chen",
      summary: "Archived educational material covering cross-reactive oral allergy syndrome.",
      content: "This guide was archived following the release of the updated 2026 Safe2Bite comprehensive food allergy resource series."
    }
  ],

  /* --------------------------------------------------
     Pass 8: Portal Settings, Security & Configuration
  -------------------------------------------------- */
  settings: {
    account: {
      id: "DR-10042",
      name: "Dr. Sarah Chen",
      title: "Lead Allergist & Clinical Immunologist",
      role: "Doctor / Admin",
      email: "s.chen@safe2bite.com",
      phone: "(512) 555-0192",
      npi: "1982736450",
      licenseNumber: "TX-MD84920",
      clinic: "Safe2Bite Allergy Care — Austin Main Center",
      department: "Pediatric & Adult Allergy/Immunology",
      avatarInitials: "SC",
      avatarColor: "blue"
    },
    notifications: {
      channels: {
        inApp: true,
        email: true,
        smsPush: true
      },
      events: [
        { id: "notif-reaction", label: "Patient Reported Reaction", desc: "Notification triggered when a patient or caregiver logs an adverse reaction.", inApp: true, email: true, push: true, locked: true },
        { id: "notif-illness-hold", label: "Illness Hold & Fever Reports", desc: "Notification when treatment hold is initiated due to illness.", inApp: true, email: true, push: true, locked: true },
        { id: "notif-missed-doses", label: "Consecutive Missed Doses (3+)", desc: "Alert when patient misses 3 consecutive doses requiring re-entry review.", inApp: true, email: true, push: false, locked: false },
        { id: "notif-messages", label: "Direct Clinical Messages", desc: "Inbound messages from patient families or care team members.", inApp: true, email: true, push: true, locked: false },
        { id: "notif-appointments", label: "Appointment Bookings & Cancellations", desc: "Updates to scheduled escalation challenges and telehealth visits.", inApp: true, email: false, push: false, locked: false },
        { id: "notif-assessments", label: "Pre-Dose Health Questionnaire Flag", desc: "Patient flagged positive answers on pre-dose safety checklist.", inApp: true, email: false, push: false, locked: false }
      ]
    },
    security: {
      twoFactorEnabled: true,
      twoFactorMethod: "Authenticator App (TOTP)",
      lastPasswordChange: "Aug 12, 2026",
      activeSessions: [
        { id: "sess-1", device: "Chrome 128 / Windows 11", location: "Austin, TX (Current Session)", ip: "192.168.1.45", lastActive: "Just now", isCurrent: true },
        { id: "sess-2", device: "Safari Mobile / iPad Pro (Clinic Suite 3A)", location: "Austin, TX", ip: "10.0.4.12", lastActive: "2 hours ago", isCurrent: false },
        { id: "sess-3", device: "Safe2Bite Care Team iOS App / iPhone 15", location: "Austin, TX", ip: "172.16.8.99", lastActive: "Yesterday, 8:40 PM", isCurrent: false }
      ]
    },
    careTeamMembers: [
      { id: "TEAM-1", name: "Dr. Sarah Chen", role: "Doctor", permissions: "Full Clinical & Admin", panelCount: 32, status: "Active" },
      { id: "TEAM-2", name: "Dr. Michael Lee", role: "Doctor", permissions: "Full Clinical", panelCount: 16, status: "Active" },
      { id: "TEAM-3", name: "Nurse Elena Rostova", role: "Care Team", permissions: "Clinical Triage & Dosing Review", panelCount: 48, status: "Active" },
      { id: "TEAM-4", name: "Maria Gonzalez", role: "Care Team", permissions: "Care Coordination & Messaging", panelCount: 48, status: "Active" }
    ],
    clinicalConfig: {
      treatmentStatuses: ["Active Treatment", "Maintenance", "Initial Escalation", "Treatment Paused (Hold)", "Completed"],
      doseStatuses: ["Scheduled", "Taken", "Missed", "On Hold", "Reaction Logged"],
      alertSeverities: ["Critical", "High", "Medium", "Low"],
      alertTypes: ["Reaction Report", "Missed Dose", "Dose Not Taken", "Illness / Sick Report", "Health Assessment Requires Review", "Patient Message", "Treatment Change", "Appointment Item"]
    },
    preferences: {
      defaultLandingPage: "dashboard",
      tableDensity: "comfortable",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h"
    },
    auditTrail: [
      { id: "aud-1", time: "Sep 17, 9:20 AM", user: "Dr. Sarah Chen", action: "Clinical review note logged for reaction alert ALT-2026-101 (Marcus Vance)" },
      { id: "aud-2", time: "Sep 16, 7:15 PM", user: "Dr. Sarah Chen", action: "Treatment dose repetition confirmed for Emma Vasquez (PT-20381)" },
      { id: "aud-3", time: "Sep 15, 2:30 PM", user: "Dr. Sarah Chen", action: "Education resource 'Draft: Advanced Sublingual Immunotherapy' saved" },
      { id: "aud-4", time: "Sep 14, 11:00 AM", user: "System Admin", action: "Role permission matrix verified for clinic nurse group" },
      { id: "aud-5", time: "Sep 10, 8:15 AM", user: "Dr. Sarah Chen", action: "Notification settings updated: Push enabled for Direct Clinical Messages" }
    ]
  },

  /* --------------------------------------------------
     Pass 8: Consolidated Reports Dataset (9 Categories)
  -------------------------------------------------- */
  reports: [
    {
      id: "rep-1",
      category: "Patient Progress",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      date: "Sep 16, 2026",
      treatmentStatus: "Active Treatment",
      phase: "Phase 3",
      dose: "40mg Peanut",
      adherenceRate: "94%",
      adherenceStatus: "Consistent",
      reactionsCount: 1,
      illnessCount: 0,
      lastAssessment: "Sep 16 · Completed",
      lastActivity: "Yesterday, 6:34 PM",
      clinician: "Dr. Sarah Chen",
      summary: "Progressing through Phase 3. Single mild reaction logged yesterday, stable.",
      status: "Active"
    },
    {
      id: "rep-2",
      category: "Adherence",
      patientId: "PT-20417",
      patientName: "Liam Okafor",
      date: "Sep 17, 2026",
      treatmentStatus: "Dose Hold",
      phase: "Phase 1",
      dose: "12mg Walnut",
      adherenceRate: "78%",
      adherenceStatus: "Hold Review",
      scheduledDoses: 28,
      takenDoses: 22,
      missedDoses: 3,
      heldDoses: 3,
      reactionsCount: 0,
      illnessCount: 0,
      lastAssessment: "Sep 14 · Not submitted",
      lastActivity: "Today, 8:00 AM",
      clinician: "Dr. Sarah Chen",
      summary: "3 consecutive doses missed during travel. In-clinic re-entry challenge booked.",
      status: "Dose Hold"
    },
    {
      id: "rep-3",
      category: "Reactions",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      date: "Sep 17, 2026",
      treatmentStatus: "Active Treatment",
      phase: "Phase 2",
      dose: "20mg Peanut",
      adherenceRate: "96%",
      adherenceStatus: "Consistent",
      reactionsCount: 1,
      illnessCount: 0,
      lastAssessment: "Sep 17 · Pre-dose OK",
      lastActivity: "Today, 9:12 AM",
      clinician: "Dr. Sarah Chen",
      summary: "Reported mild hives 20m post-dose. Cetirizine given, patient recovered.",
      status: "Reviewed"
    },
    {
      id: "rep-4",
      category: "Illness",
      patientId: "PT-20412",
      patientName: "Liam Patel",
      date: "Sep 17, 2026",
      treatmentStatus: "Dose Hold",
      phase: "Phase 1",
      dose: "8mg Cashew",
      adherenceRate: "90%",
      adherenceStatus: "Sick Day Hold",
      reactionsCount: 0,
      illnessCount: 1,
      lastAssessment: "Sep 17 · Sick reported",
      lastActivity: "Today, 7:45 AM",
      clinician: "Dr. Sarah Chen",
      summary: "Fever 101.4°F and emesis reported. Sick day hold initiated pending afebrile 24h.",
      status: "Hold Active"
    },
    {
      id: "rep-5",
      category: "Health Assessments",
      patientId: "PT-20299",
      patientName: "Sophia Nguyen",
      date: "Sep 16, 2026",
      treatmentStatus: "Active Treatment",
      phase: "Phase 2",
      dose: "15mg Egg",
      adherenceRate: "92%",
      adherenceStatus: "Consistent",
      reactionsCount: 0,
      illnessCount: 1,
      lastAssessment: "Sep 16 · Mild cold noted",
      lastActivity: "Yesterday, 3:10 PM",
      clinician: "Nurse Elena Rostova",
      summary: "Daily safety checklist completed. Mild runny nose reported; clear to resume after 24h.",
      status: "Completed"
    },
    {
      id: "rep-6",
      category: "Treatment & Dosage",
      patientId: "PT-20455",
      patientName: "Marcus Williams",
      date: "Sep 16, 2026",
      treatmentStatus: "Maintenance",
      phase: "Maintenance",
      dose: "200mg Milk",
      adherenceRate: "99%",
      adherenceStatus: "Consistent",
      reactionsCount: 0,
      illnessCount: 0,
      lastAssessment: "Sep 16 · Completed",
      lastActivity: "Yesterday, 5:45 PM",
      clinician: "Dr. Michael Lee",
      summary: "6-month maintenance dose milestone achieved. Lab markers confirmed stable.",
      status: "Maintenance"
    },
    {
      id: "rep-7",
      category: "Food Intake",
      patientId: "SB-00124",
      patientName: "Sarah Johnson",
      date: "Sep 16, 2026",
      treatmentStatus: "Active Treatment",
      phase: "Phase 3",
      dose: "50mg Peanut",
      adherenceRate: "98%",
      adherenceStatus: "Consistent",
      reactionsCount: 0,
      illnessCount: 0,
      lastAssessment: "Sep 16 · Completed",
      lastActivity: "Sep 16, 8:00 AM",
      clinician: "Dr. Sarah Chen",
      summary: "Meal vehicle: Oatmeal with almond milk and blueberries. Dose taken comfortably.",
      status: "Logged"
    },
    {
      id: "rep-8",
      category: "Appointments",
      patientId: "PT-20381",
      patientName: "Emma Vasquez",
      date: "Oct 14, 2026",
      treatmentStatus: "Active Treatment",
      phase: "Phase 3",
      dose: "40mg Peanut",
      adherenceRate: "94%",
      adherenceStatus: "Consistent",
      reactionsCount: 1,
      illnessCount: 0,
      lastAssessment: "Completed",
      lastActivity: "Today, 9:00 AM",
      clinician: "Dr. Sarah Chen",
      summary: "In-clinic dose escalation challenge to 60mg completed in Suite 3A.",
      status: "Confirmed"
    },
    {
      id: "rep-9",
      category: "Care Team Activity",
      patientId: "PT-20395",
      patientName: "Marcus Vance",
      date: "Sep 17, 2026",
      treatmentStatus: "Active Treatment",
      phase: "Phase 2",
      dose: "20mg Peanut",
      adherenceRate: "96%",
      adherenceStatus: "Consistent",
      reactionsCount: 1,
      illnessCount: 0,
      lastAssessment: "Sep 17",
      lastActivity: "Today, 9:20 AM",
      clinician: "Dr. Sarah Chen",
      summary: "Care team telephone triage completed; clinical note logged; dose hold instruction issued.",
      status: "Logged"
    }
  ]
};
