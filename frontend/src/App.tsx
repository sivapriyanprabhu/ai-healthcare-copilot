import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import FirstTimeLanguageModal from './components/FirstTimeLanguageModal';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/patient/ProfilePage';
import DashboardPage from './pages/patient/DashboardPage';
import HealthTrackingPage from './pages/patient/HealthTrackingPage';
import ReportsPage from './pages/patient/ReportsPage';
import ReportUploadPage from './pages/patient/ReportUploadPage';
import ReportDetailPage from './pages/patient/ReportDetailPage';
import ReportComparePage from './pages/patient/ReportComparePage';
import ChatPage from './pages/patient/ChatPage';
import SymptomsPage from './pages/patient/SymptomsPage';
import RiskPredictionPage from './pages/patient/RiskPredictionPage';
import DietPlannerPage from './pages/patient/DietPlannerPage';
import ExercisePage from './pages/patient/ExercisePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <FirstTimeLanguageModal />
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="health" element={<HealthTrackingPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/upload" element={<ReportUploadPage />} />
              <Route path="reports/compare" element={<ReportComparePage />} />
              <Route path="reports/:id" element={<ReportDetailPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="symptoms" element={<SymptomsPage />} />
              <Route path="risk-prediction" element={<RiskPredictionPage />} />
              <Route path="diet" element={<DietPlannerPage />} />
              <Route path="exercise" element={<ExercisePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="medications" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="*"
                element={
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs text-center">
                    <h1 className="text-xl font-bold text-slate-800">Page Not Found</h1>
                    <p className="text-slate-500 text-sm mt-1">The requested page does not exist. Return to your dashboard.</p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
  );
}
