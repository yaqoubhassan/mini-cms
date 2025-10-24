import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Calendar,
  User,
  FolderOpen,
  Tag,
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  Clock,
} from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  comments: Array<{
    id: number;
    content: string;
    status: string;
    created_at: string;
    user: {
      id: number;
      name: string;
    };
  }>;
}

interface Props {
  post: Post;
}

export default function Show({ post }: Props) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getCommentStatusBadge = (status: string) => {
    const badges = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

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

    router.delete(route('posts.destroy', post.id), {
      onSuccess: () => {
        // Will redirect to posts index
      },
      onError: () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
        toast.error('Failed to delete post. Please try again.');
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={post.title} />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={route('posts.index')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Post Details
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                View and manage post content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={route('posts.edit', post.id)}
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

        {/* Post Content */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={`/storage/${post.featured_image}`}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Post Header */}
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="mb-4 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(post.status)}`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              {post.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  <FolderOpen className="h-3 w-3" />
                  {post.category.name}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {post.user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(post.created_at)}</span>
              </div>
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Published {formatDate(post.published_at)}</span>
                </div>
              )}
              {post.comments.length > 0 && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Post Body */}
          <div className="prose prose-lg max-w-none p-6 dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </div>
        </div>

        {/* Comments Section */}
        {post.comments.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Comments ({post.comments.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {post.comments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {comment.user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.created_at)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCommentStatusBadge(comment.status)}`}>
                      {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Metadata
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Slug
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {post.slug}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(post.updated_at)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Author Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {post.user.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Post ID
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                #{post.id}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone and will permanently remove the post and all its associated data including comments.`}
        confirmText="Delete Post"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteModal.isDeleting}
        icon={<Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />}
      />
    </AuthenticatedLayout>
  );
}