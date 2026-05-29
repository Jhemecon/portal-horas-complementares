import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, requiredRoles = null }) {
    const { user, loading, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 text-ciesa-blue dark:bg-gray-900">
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">Verificando acesso...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
        return <Navigate to="/certifications" replace />;
    }

    return children;
}

export default ProtectedRoute;
