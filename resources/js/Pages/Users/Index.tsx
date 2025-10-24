import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Shield,
  User as UserIcon,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  roles: string[];
}

interface Role {
  id: number;
  name: string;
}

interface Statistics {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  editors: number;
  viewers: number;
}

interface PaginatedUsers {
  data: User[];
  links: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Filters {
  search?: string;
  role?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  [key: string]: any;
}

interface Props {
  users: PaginatedUsers;
  roles: Role[];
  statistics: Statistics;
  filters: Filters;
}

export default function Index({ users, roles, statistics, filters }: Props) {
  const { flash } = usePage().props as any;
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: User | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    user: null,
    isDeleting: false,
  });

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    router.get(route('users.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: Filters = {};
    setLocalFilters(clearedFilters);
    router.get(route('users.index'), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setDeleteModal({
      isOpen: true,
      user,
      isDeleting: false,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        user: null,
        isDeleting: false,
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!deleteModal.user) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    router.delete(route('users.destroy', deleteModal.user.id), {
      preserveState: true,
      onSuccess: () => {
        closeDeleteModal();
      },
      onError: () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
        toast.error('Failed to delete user. Please try again.');
      },
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'viewer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Statistics cards
  const statCards = [
    {
      title: 'Total Users',
      value: statistics.total,
      icon: UserIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Verified',
      value: statistics.verified,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Unverified',
      value: statistics.unverified,
      icon: UserX,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Admins',
      value: statistics.admins,
      icon: Shield,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Users" />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage user accounts and permissions
            </p>
          </div>
          <Link
            href={route('users.create')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Plus className="h-5 w-5" />
            Add User
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={localFilters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Filter className="h-5 w-5" />
                Filters
                {Object.keys(localFilters).filter(k => localFilters[k as keyof Filters]).length > 0 && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                    {Object.keys(localFilters).filter(k => localFilters[k as keyof Filters]).length}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Search
              </button>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 grid gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                {/* Role Filter */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <select
                    value={localFilters.role || ''}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={localFilters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort By
                  </label>
                  <select
                    value={localFilters.sort_by || 'created_at'}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="created_at">Date Created</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort Order
                  </label>
                  <select
                    value={localFilters.sort_order || 'desc'}
                    onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 sm:flex-none"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:flex-none"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.data.length > 0 ? (
                  users.data.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(role)}`}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.email_verified_at ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            <XCircle className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {user.created_at}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={route('users.show', user.id)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={route('users.edit', user.id)}
                            className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                        No users found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating a new user.
                      </p>
                      <Link
                        href={route('users.create')}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                      >
                        <Plus className="h-4 w-4" />
                        Add User
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.data.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => router.visit(users.links[users.current_page - 1]?.url || '#')}
                  disabled={users.current_page === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => router.visit(users.links[users.current_page + 1]?.url || '#')}
                  disabled={users.current_page === users.last_page}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {(users.current_page - 1) * users.per_page + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(users.current_page * users.per_page, users.total)}
                    </span>{' '}
                    of <span className="font-medium">{users.total}</span> results
                  </p>
                </div>
                <div className="flex gap-1">
                  {users.links.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => link.url && router.visit(link.url)}
                      disabled={!link.url || link.active}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${link.active
                        ? 'z-10 bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} rounded-md border border-gray-300 dark:border-gray-600`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.user?.name}"? This action cannot be undone and will permanently remove the user and all their associated data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteModal.isDeleting}
        icon={<Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />}
      />
    </AuthenticatedLayout>
  );
}