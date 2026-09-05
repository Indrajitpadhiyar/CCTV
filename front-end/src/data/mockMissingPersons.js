export const mockMissingPersons = {
  "CASE #M102": {
    caseId: "CASE #M102",
    personName: "Rameshchandra Patel",
    age: 72,
    gender: "Male",
    height: "5 ft 6 in (168 cm)",
    reportedBy: "Family (Son: Hiren Patel)",
    contactNumber: "+91 98250 XXXXX",
    lastSeenLocation: "Navrangpura Bus Stand / C.G. Road",
    lastSeenTime: "2026-09-05 08:30 IST",
    status: "OPEN", // OPEN | UNDER_REVIEW | RESOLVED
    
    // Description Details
    clothingTop: "Blue Checked Kurta",
    clothingBottom: "Light Grey Trousers",
    distinguishingItems: "Gold-rimmed Spectacles, Brown Wooden Walking Cane, Red-bordered Handkerchief",
    medicalNotes: "Mild Alzheimer's / disorientation tendency. Does not carry mobile phone.",
    referencePhoto: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    
    // Candidate Matches (AI Re-ID stream)
    candidates: [
      {
        id: "CAND-01",
        cameraId: "CAM-11",
        cameraName: "C.G. Road (Municipal Market Cross)",
        timestamp: "09:45:10 IST",
        timeRaw: "09:45:10",
        confidence: 88.5,
        status: "CONFIRMED", // AI_CANDIDATE | CONFIRMED | REJECTED
        thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80",
        boundingCrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        aiFeatures: {
          clothingMatch: "94% (Blue check pattern detected)",
          accessoryMatch: "86% (Walking cane identified)",
          postureMatch: "85% (Slow stooped gait)"
        },
        verifiedBy: "Sub-Inspector Anita V. Solanki (USER_104)",
        verifiedAt: "10:15 IST",
        verificationNote: "Positive match on attire, cane and silver hair. Heading south towards Law Garden.",
        requiresVerification: false
      },
      {
        id: "CAND-02",
        cameraId: "CAM-03",
        cameraName: "Sabarmati Riverfront (East Promenade)",
        timestamp: "10:30:22 IST",
        timeRaw: "10:30:22",
        confidence: 76.2,
        status: "REJECTED",
        thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        boundingCrop: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        aiFeatures: {
          clothingMatch: "72% (Solid blue shirt)",
          accessoryMatch: "0% (No walking stick)",
          postureMatch: "68% (Brisk walking tempo)"
        },
        verifiedBy: "Sub-Inspector Anita V. Solanki (USER_104)",
        verifiedAt: "10:45 IST",
        verificationNote: "Rejected upon officer inspection: Subject is a younger jogger wearing solid blue tee.",
        requiresVerification: false
      },
      {
        id: "CAND-03",
        cameraId: "CAM-19",
        cameraName: "Prahladnagar Garden Main Gate",
        timestamp: "11:55:04 IST",
        timeRaw: "11:55:04",
        confidence: 84.1,
        status: "AI_CANDIDATE", // Unverified
        thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
        boundingCrop: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        aiFeatures: {
          clothingMatch: "91% (Blue pattern top + grey bottom)",
          accessoryMatch: "79% (Elongated object in right hand)",
          postureMatch: "82% (Resting on public bench)"
        },
        verifiedBy: null,
        verifiedAt: null,
        verificationNote: null,
        requiresVerification: true
      },
      {
        id: "CAND-04",
        cameraId: "CAM-14",
        cameraName: "Iskcon Flyover (Ascent Gate)",
        timestamp: "13:10:40 IST",
        timeRaw: "13:10:40",
        confidence: 79.8,
        status: "AI_CANDIDATE", // Unverified
        thumbnail: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
        boundingCrop: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        aiFeatures: {
          clothingMatch: "83% (Blue checked top)",
          accessoryMatch: "75% (Walking stick profile detected)",
          postureMatch: "81% (Slow pedestrian moving on footpath)"
        },
        verifiedBy: null,
        verifiedAt: null,
        verificationNote: null,
        requiresVerification: true
      }
    ]
  }
};
