import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCases as initialCases } from '../data/mockCases';
import { mockAuditLogs as initialAuditLogs, mockPrivacyControls, mockAccessRequests as initialAccessRequests } from '../data/mockAuditLogs';
import { mockMissingPersons as initialMissingPersons } from '../data/mockMissingPersons';
import { mockActiveIncident as initialActiveIncident } from '../data/mockIncidents';
import { useAuth } from './AuthContext';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const { officer } = useAuth();
  const [cases, setCases] = useState(initialCases);
  const [activeCaseId, setActiveCaseId] = useState("CASE #GJ-2026-8821");
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [accessRequests, setAccessRequests] = useState(initialAccessRequests);
  const [missingData, setMissingData] = useState(initialMissingPersons);
  const [activeIncident, setActiveIncident] = useState(initialActiveIncident);
  const [retentionDays, setRetentionDays] = useState(60);
  const [toasts, setToasts] = useState([]);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Toast Helper
  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type, timestamp: new Date().toLocaleTimeString('en-GB') }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cryptographic audit logger simulation
  const recordAuditLog = (action, query, caseId = activeCaseId) => {
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }) + " IST";
    const pseudoHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      officerId: `${officer?.id || 'USER_104'} (${officer?.name || 'Insp. P. R. Jadeja'})`,
      action,
      query,
      caseId: caseId || "GENERAL_SURVEILLANCE",
      ipAddress: "10.45.12.88 (HQ Control Room Station 04)",
      timestamp,
      hash: pseudoHash,
      verified: true
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add new Case
  const addNewCase = (newCaseData) => {
    const caseId = `CASE #GJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdCase = {
      id: caseId,
      title: newCaseData.title,
      type: newCaseData.type || "VEHICLE_INVESTIGATION",
      category: newCaseData.category || "Investigation",
      priority: newCaseData.priority || "MEDIUM",
      status: "OPEN",
      registeredDate: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }) + " IST",
      assignedOfficer: officer?.name || "Insp. P. R. Jadeja",
      officerBadge: officer?.id || "USER_104",
      policeStation: officer?.station || "SG Highway Command HQ, Ahmedabad",
      firNumber: newCaseData.firNumber || `FIR-${Math.floor(100 + Math.random() * 900)}/2026`,
      summary: newCaseData.summary || "",
      linkedVehicle: newCaseData.linkedVehicle || "",
      candidateMatchesCount: 0,
      lastActivity: "Case file initialized by Command Center"
    };

    setCases(prev => [createdCase, ...prev]);
    setActiveCaseId(caseId);
    recordAuditLog("CASE_CREATED", `New Case File Created: ${caseId} (${createdCase.title})`, caseId);
    addToast(`Case ${caseId} created and set as active investigation context`, "success");
    return caseId;
  };

  // Missing Person Verification Actions
  const handleVerifyCandidate = (caseId, candidateId, status, note = "") => {
    setMissingData(prev => {
      const currentCase = prev[caseId];
      if (!currentCase) return prev;

      const updatedCandidates = currentCase.candidates.map(cand => {
        if (cand.id === candidateId) {
          return {
            ...cand,
            status, // CONFIRMED | REJECTED
            verifiedBy: `${officer?.name || 'Inspector'} (${officer?.id || 'USER_104'})`,
            verifiedAt: new Date().toLocaleTimeString('en-GB') + " IST",
            verificationNote: note || (status === 'CONFIRMED' ? "Verified match by Officer" : "Rejected false positive"),
            requiresVerification: false
          };
        }
        return cand;
      });

      return {
        ...prev,
        [caseId]: {
          ...currentCase,
          candidates: updatedCandidates
        }
      };
    });

    recordAuditLog(
      status === 'CONFIRMED' ? "MISSING_PERSON_SIGHTING_CONFIRMED" : "MISSING_PERSON_SIGHTING_REJECTED",
      `Candidate ${candidateId} set to ${status}. Note: ${note || 'Officer manual decision'}`,
      caseId
    );

    addToast(
      status === 'CONFIRMED' 
        ? `Sighting ${candidateId} confirmed! Added to evidentiary dossier.`
        : `Candidate ${candidateId} marked as False Positive.`,
      status === 'CONFIRMED' ? "success" : "info"
    );
  };

  // CAD Dispatch Action
  const dispatchCADUnits = (unitIds = []) => {
    setActiveIncident(prev => ({
      ...prev,
      status: "DISPATCHED",
      recommendedUnits: prev.recommendedUnits.map(u => ({
        ...u,
        status: "DISPATCHED"
      }))
    }));

    recordAuditLog(
      "EMERGENCY_UNIT_DISPATCH",
      `Dispatched tactical units (PCR-17, EMRI 108) to incident ${activeIncident.id} at CAM-42`,
      activeIncident.caseId
    );

    addToast(`Emergency CAD Units Dispatched to Pakwan Junction (CAM-42)`, "error");
  };

  // Access Request Approval
  const handleAccessRequestAction = (requestId, newStatus) => {
    setAccessRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    }));

    recordAuditLog(
      `SUPERVISORY_ACCESS_${newStatus}`,
      `Request ${requestId} ${newStatus.toLowerCase()} by Supervisory Desk`,
      "PRIVACY_GOVERNANCE"
    );

    addToast(`Access Request ${requestId} ${newStatus}`, newStatus === 'APPROVED' ? 'success' : 'warning');
  };

  return (
    <CaseContext.Provider value={{
      cases,
      activeCaseId,
      setActiveCaseId,
      activeCase,
      addNewCase,
      auditLogs,
      recordAuditLog,
      accessRequests,
      handleAccessRequestAction,
      missingData,
      setMissingData,
      handleVerifyCandidate,
      activeIncident,
      setActiveIncident,
      dispatchCADUnits,
      retentionDays,
      setRetentionDays,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
