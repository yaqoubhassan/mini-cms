import { Link, usePage, router } from '@inertiajs/react';
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { useTheme } from '@/Contexts/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuClick, isMobileMenuOpen }: HeaderProps) {
  const user = usePage().props.auth.user;
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when mobile search modal opens
  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      // TODO: Implement actual search functionality
      console.log('Searching for:', mobileSearchQuery);
      // Example: router.get(route('search'), { query: mobileSearchQuery });
      setShowMobileSearch(false);
      setMobileSearchQuery('');
    }
  };

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 1,
      message: 'New comment on "Getting Started with Laravel"',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'User John Doe registered',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      message: 'Post "React Best Practices" was published',
      time: '2 hours ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Theme Menu */}
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="py-1">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTheme(option.value as 'light' | 'dark' | 'system');
                          setShowThemeMenu(false);
                        }}
                        className={`flex w-full items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === option.value
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                          : 'text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                        {theme === option.value && (
                          <span className="ml-auto text-indigo-600 dark:text-indigo-400">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-gray-100 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${!notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                        }`}
                    >
                      <p className="text-sm text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 p-2 dark:border-gray-700">
                  <button className="w-full rounded-lg px-4 py-2 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <Dropdown>
            <Dropdown.Trigger>
              <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>

              <Dropdown.Link href={route('profile.edit')}>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
              </Dropdown.Link>

              <Dropdown.Link href={route('settings.index')}>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
              </Dropdown.Link>

              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </header>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setShowMobileSearch(false)}
          />

          {/* Modal Content */}
          <div className="relative flex h-full flex-col bg-white dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search
              </h3>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Form */}
            <div className="p-4">
              <form onSubmit={handleMobileSearch}>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="Search posts, categories, users..."
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Search
                </button>
              </form>

              {/* Quick Links / Recent Searches */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Quick Links
                </h4>
                <div className="mt-3 space-y-2">
                  <Link
                    href={route('posts.index')}
                    onClick={() => setShowMobileSearch(false)}
                    className="flex items-center space-x-3 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>All Posts</span>
                  </Link>
                  <Link
                    href={route('categories.index')}
                    onClick={() => setShowMobileSearch(false)}
                    className="flex items-center space-x-3 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Search className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>All Categories</span>
                  </Link>
                  <Link
                    href={route('users.index')}
                    onClick={() => setShowMobileSearch(false)}
                    className="flex items-center space-x-3 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>All Users</span>
                  </Link>
                </div>
              </div>

              {/* Helper Text */}
              <div className="mt-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  💡 <strong>Tip:</strong> Use quick links above to browse content by type, or enter search terms to find specific items.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}