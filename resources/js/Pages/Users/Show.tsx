import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  MessageSquare,
  Image,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: string[];
}

interface Stats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_comments: number;
  approved_comments: number;
  total_media: number;
}

interface Post {
  id: number;
  title: string;
  status: string;
  category: string | null;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  post_title: string;
  status: string;
  created_at: string;
}

interface Props {
  user: User;
  stats: Stats;
  recentPosts: Post[];
  recentComments: Comment[];
}

export default function Show({ user, stats, recentPosts, recentComments }: Props) {
  const { flash } = usePage().props as any;
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
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

  // Open delete modal
  const openDeleteModal = () => {
    setDeleteModal({
      isOpen: true,
      isDeleting: false,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        isDeleting: false,
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    router.delete(route('users.destroy', user.id), {
      onSuccess: () => {
        // Will redirect to index page
      },
      onError: () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
        toast.error('Failed to delete user. Please try again.');
      },
    });
  };

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.total_posts,
      subtitle: `${stats.published_posts} published`,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Comments',
      value: stats.total_comments,
      subtitle: `${stats.approved_comments} approved`,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Media Files',
      value: stats.total_media,
      subtitle: 'Uploads',
      icon: Image,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <AuthenticatedLayout>
      <Head title={`User: ${user.name}`} />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('users.index')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Details
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                View and manage user information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={route('users.edit', user.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={openDeleteModal}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-12">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-indigo-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <div className="mt-1 flex items-center gap-2 text-white/90">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Roles */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Shield className="h-4 w-4" />
                  Roles
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles.map((role, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getRoleBadgeColor(role)}`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Email Status */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  Email Status
                </div>
                <div className="mt-2">
                  {user.email_verified_at ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      <XCircle className="h-4 w-4" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {user.created_at}
                </div>
                {user.email_verified_at && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Verified on {user.email_verified_at}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Posts */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Recent Posts
              </h3>
            </div>
            <div className="p-6">
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={route('posts.show', post.id)}
                      className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </h4>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.created_at}
                            </span>
                            {post.category && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                                {post.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(post.status)}`}
                        >
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    No posts yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This user hasn't created any posts.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                Recent Comments
              </h3>
            </div>
            <div className="p-6">
              {recentComments.length > 0 ? (
                <div className="space-y-4">
                  {recentComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(comment.status)}`}
                        >
                          {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>on "{comment.post_title}"</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {comment.created_at}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    No comments yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This user hasn't made any comments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${user.name}"? This action cannot be undone and will permanently remove the user and all their associated data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteModal.isDeleting}
        icon={<Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />}
      />
    </AuthenticatedLayout>
  );
}