import { Outlet } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { cn } from '@/lib/utils';

function DashboardLayout() {
    const { sidebarOpen } = useApp();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                )}
            >
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
