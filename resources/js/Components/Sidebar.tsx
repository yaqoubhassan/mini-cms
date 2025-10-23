import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { url } = usePage();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: route('dashboard'),
      icon: LayoutDashboard,
      active: route().current('dashboard'),
    },
    {
      name: 'Posts',
      href: route('posts.index'),
      icon: FileText,
      active: route().current('posts.*'),
    },
    {
      name: 'Categories',
      href: route('categories.index'),
      icon: FolderOpen,
      active: route().current('categories.*'),
    },
    {
      name: 'Comments',
      href: route('comments.index'),
      icon: MessageSquare,
      active: route().current('comments.*'),
    },
    {
      name: 'Users',
      href: route('users.index'),
      icon: Users,
      active: route().current('users.*'),
    },
    {
      name: 'Media',
      href: route('media.index'),
      icon: Image,
      active: route().current('media.*'),
    },
    {
      name: 'Settings',
      href: route('settings.index'),
      icon: Settings,
      active: route().current('settings.*'),
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        } bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              CMS
            </span>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${item.active
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
            <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300">
              Need Help?
            </p>
            <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-400">
              Check our documentation
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}