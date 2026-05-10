import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const USER_ROLES = {
    TEACHER: 'teacher',
    COORDINATOR: 'coordinator',
    SECRETARY: 'secretary',
    ADMIN: 'admin',
};

export const ROLE_LABELS = {
    [USER_ROLES.TEACHER]: 'Professor',
    [USER_ROLES.COORDINATOR]: 'Coordenador',
    [USER_ROLES.SECRETARY]: 'Secretaria',
    [USER_ROLES.ADMIN]: 'Gestor',
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState({ name: "Admin Teste", role: "admin" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Temporarily disabled auth check for testing
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const token = localStorage.getItem('auth_token');
    //             const savedUser = localStorage.getItem('user_data');

    //             // Se tem dados de usuário salvos (mock), usa eles
    //             if (token && savedUser) {
    //                 setUser(JSON.parse(savedUser));
    //                 setLoading(false);
    //                 return;
    //             }

    //             if (token) {
    //                 const response = await fetch('/api/auth/me', {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 });

    //                 if (response.ok) {
    //                     const userData = await response.json();
    //                     setUser(userData);
    //                 } else {
    //                     localStorage.removeItem('auth_token');
    //                     localStorage.removeItem('user_data');
    //                 }
    //             }
    //         } catch (err) {
    //             console.error('Auth check failed:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     checkAuth();
    // }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            // Mock login para desenvolvimento
            // Credenciais: admin / admin123
            if (email === 'admin' && password === 'admin123') {
                const mockUser = {
                    id: 1,
                    name: 'Administrador',
                    email: 'admin@seculo.com.br',
                    role: USER_ROLES.ADMIN,
                    avatar: null,
                };
                localStorage.setItem('auth_token', 'mock_token_admin');
                localStorage.setItem('user_data', JSON.stringify(mockUser));
                setUser(mockUser);
                navigate('/dashboard');
                return { success: true };
            }

            // Mock para professor
            if (email === 'professor' && password === 'prof123') {
                const mockUser = {
                    id: 2,
                    name: 'João Silva',
                    email: 'joao.silva@seculo.com.br',
                    role: USER_ROLES.TEACHER,
                    avatar: null,
                };
                localStorage.setItem('auth_token', 'mock_token_teacher');
                localStorage.setItem('user_data', JSON.stringify(mockUser));
                setUser(mockUser);
                navigate('/dashboard');
                return { success: true };
            }

            // Tentar API real (para quando o backend estiver pronto)
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            localStorage.setItem('auth_token', data.token);
            setUser(data.user);
            navigate('/dashboard');
            return { success: true };
        } catch (err) {
            // Se falhou na API, mostrar erro de credenciais inválidas
            const errorMsg = 'Credenciais inválidas. Use: admin / admin123';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const updateUser = useCallback((updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    }, []);

    const hasPermission = useCallback((permission) => {
        if (!user) return false;

        // Admin has all permissions
        if (user.role === USER_ROLES.ADMIN) return true;

        // Define role-based permissions
        const rolePermissions = {
            [USER_ROLES.COORDINATOR]: [
                'view_all_students',
                'view_all_grades',
                'edit_grades',
                'view_reports',
                'manage_calendar',
                'manage_reservations',
                'send_announcements',
            ],
            [USER_ROLES.TEACHER]: [
                'view_own_students',
                'view_own_grades',
                'edit_own_grades',
                'view_own_reports',
                'view_calendar',
                'request_reservations',
                'send_messages',
            ],
            [USER_ROLES.SECRETARY]: [
                'view_all_students',
                'edit_student_records',
                'manage_enrollment',
                'view_reports',
                'manage_reservations',
            ],
        };

        return rolePermissions[user.role]?.includes(permission) || false;
    }, [user]);

    const hasRole = useCallback((roles) => {
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
    }, [user]);

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        hasPermission,
        hasRole,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
