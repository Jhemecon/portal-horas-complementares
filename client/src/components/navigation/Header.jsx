import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Menu,
    Bell,
    Search,
    Moon,
    Sun,
    User,
    Settings,
    LogOut,
    ChevronDown,
} from 'lucide-react';

function Header() {
    const { toggleSidebar, notifications, unreadCount, markNotificationRead } = useApp();
    const { user, logout, hasRole } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6">
            <div className="h-full flex items-center justify-between gap-4">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Search */}
                    <div className={cn(
                        'hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 transition-all',
                        searchOpen && 'ring-2 ring-seculo-blue'
                    )}>
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar alunos, turmas..."
                            className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-gray-400"
                            onFocus={() => setSearchOpen(true)}
                            onBlur={() => setSearchOpen(false)}
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        title={isDark ? 'Modo claro' : 'Modo escuro'}
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-seculo-yellow text-seculo-blue text-xs font-bold rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                Notificações
                                {unreadCount > 0 && (
                                    <span className="text-xs text-gray-500">
                                        {unreadCount} não lida(s)
                                    </span>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    Nenhuma notificação
                                </div>
                            ) : (
                                notifications.slice(0, 5).map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={cn(
                                            'flex flex-col items-start p-3 cursor-pointer',
                                            !notification.read && 'bg-blue-50 dark:bg-blue-900/20'
                                        )}
                                        onClick={() => markNotificationRead(notification.id)}
                                    >
                                        <p className="text-sm font-medium">{notification.title}</p>
                                        <p className="text-xs text-gray-500">{notification.message}</p>
                                    </DropdownMenuItem>
                                ))
                            )}
                            {notifications.length > 5 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/notifications" className="w-full text-center text-sm text-seculo-blue">
                                            Ver todas
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2">
                                <div className="w-8 h-8 rounded-full bg-seculo-blue flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
                                    <p className="text-xs text-gray-500">{user?.role || 'Professor'}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/profile" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Meu Perfil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/settings" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Configurações
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={logout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export default Header;
