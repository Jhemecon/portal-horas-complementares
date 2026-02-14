import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Award,
} from 'lucide-react';

const menuItems = [
    {
        title: 'Certificados',
        items: [
            { icon: Award, label: 'Horas Complementares', href: '/certifications' },
        ],
    },
];

function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useApp();
    const { user } = useAuth();
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full bg-seculo-blue transition-all duration-300 ease-in-out',
                    sidebarOpen ? 'w-64' : 'w-20',
                    'lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    <Link to="/certifications" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-seculo-yellow flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-seculo-blue" />
                        </div>
                        {sidebarOpen && (
                            <div className="text-white">
                                <p className="font-semibold text-sm">Portal do Aluno</p>
                                <p className="text-xs text-blue-200">Colégio Século</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-seculo-yellow text-seculo-blue flex items-center justify-center shadow-md hover:scale-110 transition-transform hidden lg:flex"
                >
                    {sidebarOpen ? (
                        <ChevronLeft className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </button>

                {/* Navigation */}
                <nav className="p-4 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto">
                    {menuItems.map((section) => (
                        <div key={section.title}>
                            {sidebarOpen && (
                                <p className="text-xs font-medium text-blue-300 uppercase tracking-wider mb-2 px-3">
                                    {section.title}
                                </p>
                            )}
                            <ul className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                to={item.href}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                                                    'hover:bg-white/10',
                                                    isActive && 'bg-white/10 border-l-3 border-seculo-yellow',
                                                    !sidebarOpen && 'justify-center'
                                                )}
                                                title={!sidebarOpen ? item.label : undefined}
                                            >
                                                <Icon
                                                    className={cn(
                                                        'w-5 h-5 flex-shrink-0',
                                                        isActive ? 'text-seculo-yellow' : 'text-blue-200'
                                                    )}
                                                />
                                                {sidebarOpen && (
                                                    <span
                                                        className={cn(
                                                            'text-sm',
                                                            isActive ? 'text-white font-medium' : 'text-blue-100'
                                                        )}
                                                    >
                                                        {item.label}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* User Info */}
                {sidebarOpen && user && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                        <Link
                            to="/settings"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-full bg-seculo-yellow flex items-center justify-center">
                                <span className="text-seculo-blue font-semibold text-sm">
                                    {user.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.name || 'Usuário'}
                                </p>
                                <p className="text-xs text-blue-200 truncate">
                                    {user.email || ''}
                                </p>
                            </div>
                            <Settings className="w-4 h-4 text-blue-200" />
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}

export default Sidebar;
