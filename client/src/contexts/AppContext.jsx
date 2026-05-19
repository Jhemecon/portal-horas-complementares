import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

function createInitialNotifications() {
    const now = Date.now();
    return [
        {
            id: 1,
            title: 'Atividade Aprovada',
            message: 'Seu certificado "Curso de React Avançado" foi aprovado com 40 horas.',
            type: 'success',
            createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            read: false,
        },
        {
            id: 2,
            title: 'Atividade Rejeitada',
            message: 'Seu certificado "Voluntariado em ONG Local" foi rejeitado. Verifique a justificativa no histórico.',
            type: 'error',
            createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
            read: false,
        },
        {
            id: 3,
            title: 'Lembrete',
            message: 'Você tem 3 atividades pendentes de análise. Acompanhe o status no histórico.',
            type: 'warning',
            createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
            read: true,
        },
    ];
}

export function AppProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState(() => createInitialNotifications());
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [currentTerm, setCurrentTerm] = useState('2026.1');

    const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            read: false,
            ...notification,
        };
        setNotifications((prev) => [newNotification, ...prev]);
        return newNotification.id;
    }, []);

    const markNotificationRead = useCallback((id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }, []);

    const markAllNotificationsRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);

    const clearNotifications = useCallback(() => setNotifications([]), []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const value = {
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,

        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadCount,

        selectedClass,
        setSelectedClass,
        selectedSubject,
        setSelectedSubject,

        currentTerm,
        setCurrentTerm,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;
