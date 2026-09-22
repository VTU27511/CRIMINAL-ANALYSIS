import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { logVisitorVisit } from './services/visitorService';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { CrimeAnalyticsPage } from './pages/CrimeAnalyticsPage';
import { HotspotsPage } from './pages/HotspotsPage';
import { FIRListPage } from './pages/FIRListPage';
import { FIRUploadPage } from './pages/FIRUploadPage';
import { NetworkAnalysisPage } from './pages/NetworkAnalysisPage';
import { InvestigationAssistantPage } from './pages/InvestigationAssistantPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { OfficersPage } from './pages/OfficersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Automatic platform visitor tracking into Firebase Cloud Firestore
const VisitorTracker: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    logVisitorVisit(
      location.pathname,
      user?.email,
      user ? 'OFFICER' : 'GUEST'
    );
  }, [location.pathname, user?.email]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <VisitorTracker />
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated Law Enforcement Platform Shell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/crime-analytics" element={<CrimeAnalyticsPage />} />
              <Route path="/hotspots" element={<HotspotsPage />} />
              <Route path="/fir" element={<FIRListPage />} />
              <Route path="/fir/upload" element={<FIRUploadPage />} />
              <Route path="/network" element={<NetworkAnalysisPage />} />
              <Route path="/investigation-assistant" element={<InvestigationAssistantPage />} />
              <Route path="/predictions" element={<PredictionsPage />} />
              
              {/* Senior Official Privileged Module */}
              <Route
                path="/officers"
                element={
                  <ProtectedRoute requiredRole="SENIOR_OFFICIAL">
                    <OfficersPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Root redirect to Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;