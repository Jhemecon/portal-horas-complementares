import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import {
    Bell,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Trash2,
    CheckCheck,
} from 'lucide-react';

const STATUS_ICONS = {
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
    info: Clock,
};

const STATUS_COLORS = {
    success: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
    error: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    info: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
};

export default function NotificationsPage() {
    const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount } = useApp();
    const [filter, setFilter] = useState('all'); // all, unread, read

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'read') return notification.read;
        return true;
    });

    const handleMarkRead = (id) => {
        markNotificationRead(id);
    };

    const handleMarkAllRead = () => {
        markAllNotificationsRead();
    };

    const handleClearAll = () => {
        clearNotifications();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
                    <p className="text-muted-foreground">
                        Acompanhe todas as suas notificações do sistema
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button onClick={handleMarkAllRead} variant="outline">
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Marcar todas como lidas
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button onClick={handleClearAll} variant="outline">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Limpar todas
                        </Button>
                    )}
                </div>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Filtrar:</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('all')}
                            >
                                Todas ({notifications.length})
                            </Button>
                            <Button
                                variant={filter === 'unread' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('unread')}
                            >
                                Não lidas ({unreadCount})
                            </Button>
                            <Button
                                variant={filter === 'read' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('read')}
                            >
                                Lidas ({notifications.length - unreadCount})
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Notificações */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhuma notificação</h3>
                            <p className="text-muted-foreground">
                                {filter === 'all' ? 'Você não tem notificações no momento.' : `Nenhuma notificação ${filter === 'unread' ? 'não lida' : 'lida'} encontrada.`}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => {
                        const StatusIcon = STATUS_ICONS[notification.type] || STATUS_ICONS.info;
                        const statusColor = STATUS_COLORS[notification.type] || STATUS_COLORS.info;

                        return (
                            <Card key={notification.id} className={cn("transition-all", !notification.read && "border-l-4 border-l-blue-500")}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className={cn("p-2 rounded-lg", statusColor)}>
                                                <StatusIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{notification.title}</h3>
                                                    {!notification.read && (
                                                        <Badge variant="secondary" className="text-xs">Novo</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        {!notification.read && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleMarkRead(notification.id)}
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}