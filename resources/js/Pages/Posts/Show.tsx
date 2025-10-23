import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, FolderOpen, Tag, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      // Using Inertia's router for delete
      window.location.href = `/posts/${post.id}`;
    }
  };

  const approvedComments = post.comments.filter(comment => comment.status === 'approved');

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={route('posts.index')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                View Post
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {post.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('posts.edit', post.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      }
    >
      <Head title={post.title} />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h1>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{post.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                {post.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <FolderOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {post.category.name}
                    </span>
                  </div>
                )}
                <span
                  className={`ml-auto inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadge(post.status)}`}
                >
                  {post.status}
                </span>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-b border-gray-200 py-4 dark:border-gray-700">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Featured Image */}
              {post.featured_image && (
                <div className="my-6">
                  <img
                    src={`/storage/${post.featured_image}`}
                    alt={post.title}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Post Body */}
              <div className="prose prose-lg dark:prose-invert max-w-none pt-6 dark:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.body}
                </ReactMarkdown>
              </div>
            </div>

            {/* Comments Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Comments ({approvedComments.length})
                </h3>
              </div>

              {approvedComments.length > 0 ? (
                <div className="space-y-4">
                  {approvedComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.user.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Post Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium capitalize ${post.status === 'published' ? 'text-green-600 dark:text-green-400' : post.status === 'draft' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Author:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {post.user.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(post.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(post.updated_at)}
                  </span>
                </div>
                {post.published_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Published:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Slug:</span>
                  <span className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                    {post.slug}
                  </span>
                </div>
                {post.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {post.category.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Comments:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {approvedComments.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href={route('posts.edit', post.id)}
                  className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Edit className="h-4 w-4" />
                  Edit Post
                </Link>
                <Link
                  href={route('posts.index')}
                  className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Delete Post
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete "{post.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <Link
                href={route('posts.destroy', post.id)}
                method="delete"
                as="button"
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </Link>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}