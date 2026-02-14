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

// Dashboard Pages
import DashboardPage from '@/pages/dashboard/DashboardPage';

// Student Records
import StudentsListPage from '@/pages/students/StudentsListPage';
import StudentDetailsPage from '@/pages/students/StudentDetailsPage';

// Gradebook / Performance
import GradebookPage from '@/pages/gradebook/GradebookPage';
import AttendancePage from '@/pages/gradebook/AttendancePage';
import ReportsPage from '@/pages/gradebook/ReportsPage';

// Calendar
import CalendarPage from '@/pages/calendar/CalendarPage';

// Reservations
import ReservationsPage from '@/pages/reservations/ReservationsPage';

// Communication
import MessagesPage from '@/pages/communication/MessagesPage';
import AnnouncementsPage from '@/pages/communication/AnnouncementsPage';
import ForumsPage from '@/pages/communication/ForumsPage';

// Resources
import LessonPlansPage from '@/pages/resources/LessonPlansPage';
import FilesLibraryPage from '@/pages/resources/FilesLibraryPage';

// Analytics
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';

// Certifications
import CertificationsPage from '@/pages/certifications/Certifications';

// Settings
import SettingsPage from '@/pages/settings/SettingsPage';
import ProfilePage from '@/pages/profile/ProfilePage';

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
                        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardPage />} />

                            {/* Student Records */}
                            <Route path="/students" element={<StudentsListPage />} />
                            <Route path="/students/:id" element={<StudentDetailsPage />} />

                            {/* Gradebook */}
                            <Route path="/gradebook" element={<GradebookPage />} />
                            <Route path="/attendance" element={<AttendancePage />} />
                            <Route path="/reports" element={<ReportsPage />} />

                            {/* Calendar */}
                            <Route path="/calendar" element={<CalendarPage />} />

                            {/* Reservations */}
                            <Route path="/reservations" element={<ReservationsPage />} />

                            {/* Communication */}
                            <Route path="/messages" element={<MessagesPage />} />
                            <Route path="/announcements" element={<AnnouncementsPage />} />
                            <Route path="/forums" element={<ForumsPage />} />

                            {/* Resources */}
                            <Route path="/lesson-plans" element={<LessonPlansPage />} />
                            <Route path="/files" element={<FilesLibraryPage />} />

                            {/* Analytics */}
                            <Route path="/analytics" element={<AnalyticsPage />} />

                            {/* Certifications */}
                            <Route path="/certifications" element={<CertificationsPage />} />

                            {/* Settings */}
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>

                    <Toaster position="top-right" richColors />
                </AppProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
