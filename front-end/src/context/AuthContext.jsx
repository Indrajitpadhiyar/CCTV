import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [officer, setOfficer] = useState(() => {
    const saved = localStorage.getItem('drishti_officer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parse error
      }
    }
    return {
      id: "USER_104",
      name: "Insp. P. R. Jadeja",
      rank: "Police Inspector (SIT Surveillance Lead)",
      badgeNumber: "GP-AHM-104",
      station: "SG Highway Command HQ, Ahmedabad",
      district: "Ahmedabad City Police",
      clearanceLevel: "LEVEL 3 (ANPR & CAD ACCESS)",
      loginTime: new Date().toLocaleTimeString('en-GB')
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('drishti_auth') === 'true';
  });

  useEffect(() => {
    if (officer) {
      localStorage.setItem('drishti_officer', JSON.stringify(officer));
    }
    localStorage.setItem('drishti_auth', isAuthenticated ? 'true' : 'false');
  }, [officer, isAuthenticated]);

  const login = (officerData) => {
    setOfficer({
      id: officerData.id || "USER_104",
      name: officerData.name || "Insp. P. R. Jadeja",
      rank: officerData.rank || "Police Inspector (SIT Surveillance Lead)",
      badgeNumber: officerData.badgeNumber || "GP-AHM-104",
      station: officerData.station || "SG Highway Command HQ, Ahmedabad",
      district: officerData.district || "Ahmedabad City Police",
      clearanceLevel: "LEVEL 3 (ANPR & CAD ACCESS)",
      loginTime: new Date().toLocaleTimeString('en-GB')
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchStation = (newStation, newDistrict) => {
    setOfficer(prev => ({
      ...prev,
      station: newStation,
      district: newDistrict || prev.district
    }));
  };

  return (
    <AuthContext.Provider value={{ officer, isAuthenticated, login, logout, switchStation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
