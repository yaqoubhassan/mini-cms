import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header/Navigation */}
            <nav className="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-900/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                                <span className="text-xl font-bold text-white">C</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                MiniCMS
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center space-x-6 md:flex">
                            <a
                                href="#features"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                            >
                                How It Works
                            </a>
                            <a
                                href="#pricing"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                            >
                                Pricing
                            </a>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                aria-label="Toggle theme"
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </button>

                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center space-x-2 md:hidden">
                            <button
                                onClick={toggleTheme}
                                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                aria-label="Toggle theme"
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            <a
                                href="#features"
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                How It Works
                            </a>
                            <a
                                href="#pricing"
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Pricing
                            </a>
                            <Link
                                href="/login"
                                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="block rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-base font-medium text-white shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-16">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
                                    <span className="text-xl font-bold text-white">C</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    MiniCMS
                                </span>
                            </Link>
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                A modern, AI-powered content management system built for creators and teams.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="#features" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} MiniCMS. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}