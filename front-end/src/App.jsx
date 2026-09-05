import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CaseProvider } from './context/CaseContext';

// Layout
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CaseBanner } from './components/layout/CaseBanner';
import { ToastContainer } from './components/common/ToastContainer';

// Modules
import { LoginView } from './components/modules/auth/LoginView';
import { CaseManagementView } from './components/modules/cases/CaseManagementView';
import { NewCaseModal } from './components/modules/cases/NewCaseModal';
import { VehicleInvestigationView } from './components/modules/vehicle/VehicleInvestigationView';
import { NLSearchView } from './components/modules/search/NLSearchView';
import { EmergencyResponseView } from './components/modules/emergency/EmergencyResponseView';
import { MissingPersonView } from './components/modules/missing/MissingPersonView';
import { PrivacyAuditView } from './components/modules/privacy/PrivacyAuditView';
import { LiveMatrixView } from './components/modules/live/LiveMatrixView';

// Protected App Layout
const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col font-sans text-slate-800">
      {/* Top Persistent Header */}
      <Header />

      {/* Case Context Strip */}
      <CaseBanner onOpenNewCase={() => setIsNewCaseModalOpen(true)} />

      {/* Main Body with Fixed Left Sidebar & Scrollable Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<CaseManagementView onOpenNewCase={() => setIsNewCaseModalOpen(true)} />} />
            <Route path="/vehicle" element={<VehicleInvestigationView />} />
            <Route path="/search" element={<NLSearchView />} />
            <Route path="/emergency" element={<EmergencyResponseView />} />
            <Route path="/missing" element={<MissingPersonView />} />
            <Route path="/privacy" element={<PrivacyAuditView />} />
            <Route path="/live" element={<LiveMatrixView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Toast Notification Popups */}
      <ToastContainer />

      {/* New Case Creation Modal */}
      <NewCaseModal 
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CaseProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </CaseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
