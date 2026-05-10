import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, requiredRoles = null }) {
    // Temporarily disabled authentication checks for testing
    return children;
}

export default ProtectedRoute;
