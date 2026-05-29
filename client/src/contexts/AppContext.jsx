import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
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
        setNotifications,
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
