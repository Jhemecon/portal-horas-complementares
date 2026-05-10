import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Layouts
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AuthLayout from '@/components/layouts/AuthLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Certifications
import CertificationsPage from '@/pages/certifications/Certifications';

// History
import HistoryPage from '@/pages/history/HistoryPage';

// Help
import HelpPage from '@/pages/help/HelpPage';

// Notifications
import NotificationsPage from '@/pages/notifications/NotificationsPage';

// Protected Route Component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        {/* Auth Routes */}
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        </Route>

                        {/* Protected Dashboard Routes */}
                        <Route element={<DashboardLayout />}>
                            <Route path="/" element={<Navigate to="/certifications" replace />} />

                            {/* Certifications */}
                            <Route path="/certifications" element={<CertificationsPage />} />

                            {/* History */}
                            <Route path="/history" element={<HistoryPage />} />

                            {/* Help */}
                            <Route path="/help" element={<HelpPage />} />

                            {/* Notifications */}
                            <Route path="/notifications" element={<NotificationsPage />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/certifications" replace />} />
                    </Routes>

                    <Toaster position="top-right" richColors />
                </AppProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
