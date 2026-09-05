export const mockPrivacyControls = [
  {
    id: "CTRL-01",
    control: "Facial Feature & Re-ID Access",
    status: "RESTRICTED",
    requirement: "DSP / ACP Authorization Required",
    activeExemptions: "1 Active (Case #M102)",
    autoLog: "ENABLED (SHA-256 Hash Chaining)"
  },
  {
    id: "CTRL-02",
    control: "Vehicle ANPR Historical Tracking",
    status: "CASE_BOUND",
    requirement: "Must link active FIR / Case Number",
    activeExemptions: "Enforced at API Gateway",
    autoLog: "ENABLED (Immutable Ledger)"
  },
  {
    id: "CTRL-03",
    control: "Citizen Keyword NL Search",
    status: "PERMISSION_REQUIRED",
    requirement: "Supervisory Token Required for Natural Language Re-ID",
    activeExemptions: "Session Valid (USER_104)",
    autoLog: "ENABLED (Full Prompt Recorded)"
  },
  {
    id: "CTRL-04",
    control: "Cryptographic Evidence Watermarking",
    status: "ENFORCED",
    requirement: "All exported CCTV stills include Officer ID & Timestamp hash",
    activeExemptions: "Non-Bypassable",
    autoLog: "ENABLED"
  },
  {
    id: "CTRL-05",
    control: "Automated Data Retention Purge",
    status: "ACTIVE_POLICY",
    requirement: "Default 60 Days rolling deletion for non-evidentiary footage",
    activeExemptions: "Cases under active trial archived securely",
    autoLog: "CRON_DAILY_0300_IST"
  }
];

export const mockAuditLogs = [
  {
    id: "AUD-9941",
    officerId: "USER_104 (Insp. P. R. Jadeja)",
    action: "VEHICLE_TRAJECTORY_RECONSTRUCTION",
    query: "Plate: GJ01XX1234 | Window: 12:00-14:00 | 5 nodes reconstructed",
    caseId: "CASE #GJ-2026-8821",
    ipAddress: "10.45.12.88 (HQ Control Room Station 04)",
    timestamp: "2026-09-05 13:45:10 IST",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verified: true
  },
  {
    id: "AUD-9940",
    officerId: "USER_104 (Insp. P. R. Jadeja)",
    action: "NATURAL_LANGUAGE_QUERY",
    query: "Find red cars seen near SG Highway between 8 PM and 10 PM",
    caseId: "CASE #GJ-2026-4412",
    ipAddress: "10.45.12.88 (HQ Control Room Station 04)",
    timestamp: "2026-09-05 13:12:04 IST",
    hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    verified: true
  },
  {
    id: "AUD-9939",
    officerId: "USER_104 (SI Anita Solanki)",
    action: "MISSING_PERSON_SIGHTING_CONFIRMED",
    query: "Candidate CAND-01 at CAM-11 confirmed for Rameshchandra Patel",
    caseId: "CASE #M102",
    ipAddress: "10.45.12.92 (Navrangpura SIT Terminal)",
    timestamp: "2026-09-05 10:15:22 IST",
    hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    verified: true
  },
  {
    id: "AUD-9938",
    officerId: "USER_104 (CAD Dispatcher)",
    action: "EMERGENCY_UNIT_DISPATCH",
    query: "Dispatched PCR-17 and EMRI 108 to CAM-42 Pakwan Junction",
    caseId: "CASE #GJ-2026-0941",
    ipAddress: "10.45.10.01 (Central CAD Server)",
    timestamp: "2026-09-05 15:39:00 IST",
    hash: "3b30e428c0490b4356a640ce1c8d5d97d4f9bfef933a32f6b80327f2c974c8b2",
    verified: true
  },
  {
    id: "AUD-9937",
    officerId: "USER_208 (Insp. K. S. Zala)",
    action: "CCTV_FEED_EXPORT",
    query: "Exported 30-sec clip from CAM-11 (C.G. Road) with forensic hash",
    caseId: "CASE #GJ-2026-4412",
    ipAddress: "10.45.14.33 (Navrangpura Station)",
    timestamp: "2026-09-05 10:30:11 IST",
    hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    verified: true
  }
];

export const mockAccessRequests = [
  {
    id: "REQ-2026-088",
    requestingOfficer: "Inspector P. R. Jadeja (USER_104)",
    role: "Lead Investigator",
    targetResource: "Cross-District Archival ANPR Footage (>45 days)",
    caseId: "CASE #GJ-2026-8821",
    justification: "Cross-referencing interstate syndicate getaway routes into Gandhinagar & Mehsana.",
    requestedAt: "2026-09-05 11:20 IST",
    status: "PENDING", // PENDING | APPROVED | DENIED
    approverRole: "Superintendent of Police (SP) / DSP Level"
  },
  {
    id: "REQ-2026-085",
    requestingOfficer: "SI Anita V. Solanki (USER_104)",
    role: "Investigating Officer",
    targetResource: "Facial Re-ID Network Scan across Ahmedabad Transit Nodes",
    caseId: "CASE #M102",
    justification: "Locating vulnerable missing senior citizen with memory loss.",
    requestedAt: "2026-09-05 09:35 IST",
    status: "APPROVED",
    approverRole: "DCP Cyber & Crime Branch (Approved at 09:40 IST)"
  }
];
