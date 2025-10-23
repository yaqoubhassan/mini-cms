import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import Header from '@/Components/Header';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Update CSS custom property for header positioning
    useEffect(() => {
        document.documentElement.style.setProperty(
            '--sidebar-width',
            isSidebarCollapsed ? '4rem' : '16rem'
        );
    }, [isSidebarCollapsed]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobile={false}
            />

            {/* Mobile Sidebar */}
            <Sidebar
                isMobile={true}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
                {/* Header - positioned to match content area */}
                <div className="fixed left-0 right-0 top-0 z-30 lg:left-[var(--sidebar-width,16rem)]">
                    <Header
                        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        isMobileMenuOpen={isMobileMenuOpen}
                    />
                </div>

                {/* Page Content */}
                <main className="pt-16">
                    {header && (
                        <div className="border-b border-gray-200 bg-white px-4 py-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:px-8">
                            {header}
                        </div>
                    )}
                    <div className="p-4 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}