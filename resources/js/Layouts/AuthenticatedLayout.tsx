import { PropsWithChildren, ReactNode, useState } from 'react';
import Header from '@/Components/Header';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-300 dark:bg-gray-800 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="lg:pl-64">
                {/* Header */}
                <Header
                    onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    isMobileMenuOpen={isMobileMenuOpen}
                />

                {/* Page Content */}
                <main className="pt-16">
                    {header && (
                        <div className="border-b border-gray-200 bg-white px-4 py-6 dark:border-gray-700 dark:bg-gray-800 lg:px-8">
                            {header}
                        </div>
                    )}
                    <div className="p-4 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}