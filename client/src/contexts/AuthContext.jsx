import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPermissionForRole, hasRole as hasRoleUtil } from '@/lib/auth';

const AuthContext = createContext(null);

// Coloque aqui o endereço onde o seu back-end está a rodar
const API_URL = 'http://localhost:5000/api'; 

export function AuthProvider({ children }) {
    // 1. Iniciamos sem nenhum utilizador logado e com o loading a true para verificar o token
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 2. Este useEffect recupera a sessão (bate na rota /api/users/me que criámos!)
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Chama a nossa rota protegida que exige o token
                const response = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Se o token expirou ou é inválido, limpa tudo
                    localStorage.removeItem('auth_token');
                    setUser(null);
                }
            } catch (err) {
                console.error('Falha ao verificar autenticação:', err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 3. A função de Login REAL conectada ao seu banco de dados
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // Se o express devolver um erro (ex: credenciais inválidas)
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            // Sucesso! Guardamos o token e os dados no navegador
            localStorage.setItem('auth_token', data.token);
            setUser(data.user);
            navigate('/dashboard'); // Redireciona para o painel principal
            
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const updateUser = useCallback((updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    }, []);

    const hasPermission = useCallback((permission) => {
        if (!user) return false;
        return hasPermissionForRole(user.role, permission);
    }, [user]);

    const hasRole = useCallback((roles) => {
        if (!user) return false;
        return hasRoleUtil(user.role, roles);
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
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

export default AuthContext;