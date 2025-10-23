import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  CheckSquare,
  Square,
  ChevronDown,
  X,
  Calendar,
  User,
  FolderOpen,
  FileText,
  Archive,
  Send,
} from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  category_id: number | null;
  user_id: number;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  } | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

interface Author {
  id: number;
  name: string;
}

interface Statistics {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

interface PaginatedPosts {
  data: Post[];
  links: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Filters {
  search?: string;
  category_id?: string;
  status?: string;
  user_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  date_from?: string;
  date_to?: string;
  [key: string]: string | number | undefined;
}

interface Props {
  posts: PaginatedPosts;
  categories: Category[];
  authors: Author[];
  statistics: Statistics;
  filters: Filters;
}

export default function Index({ posts, categories, authors, statistics, filters }: Props) {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedPosts.length === posts.data.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.data.map(post => post.id));
    }
  };

  // Handle individual selection
  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      router.post(route('posts.bulk-delete'), {
        ids: selectedPosts,
      }, {
        onSuccess: () => setSelectedPosts([]),
      });
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (status: string) => {
    router.post(route('posts.bulk-status'), {
      ids: selectedPosts,
      status,
    }, {
      onSuccess: () => setSelectedPosts([]),
    });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    router.get(route('posts.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category_id: '',
      status: '',
      user_id: '',
      date_from: '',
      date_to: '',
    };
    setLocalFilters(clearedFilters);
    router.get(route('posts.index'), clearedFilters);
  };

  // Delete single post
  const handleDelete = (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      router.delete(route('posts.destroy', postId));
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Truncate text
  const truncate = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200">
              Posts Management
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your blog posts, drafts, and published content
            </p>
          </div>
          <Link
            href={route('posts.create')}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </Link>
        </div>
      }
    >
      <Head title="Posts" />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Posts
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {statistics.total}
                </p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Published
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {statistics.published}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Drafts
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {statistics.draft}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <Edit className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Archived
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {statistics.archived}
                </p>
              </div>
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                <Archive className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Search and Filter Toggle */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts by title, slug, or content..."
                    value={localFilters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-400"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {(localFilters.category_id || localFilters.status || localFilters.user_id || localFilters.date_from || localFilters.date_to) && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                      {[localFilters.category_id, localFilters.status, localFilters.user_id, localFilters.date_from, localFilters.date_to].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      value={localFilters.category_id || ''}
                      onChange={(e) => handleFilterChange('category_id', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.posts_count})
                        </option>
                      ))}
                    </select>
                  </div>

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
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Author
                    </label>
                    <select
                      value={localFilters.user_id || ''}
                      onChange={(e) => handleFilterChange('user_id', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Authors</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Per Page
                    </label>
                    <select
                      value={localFilters.per_page || 15}
                      onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date From
                    </label>
                    <input
                      type="date"
                      value={localFilters.date_from || ''}
                      onChange={(e) => handleFilterChange('date_from', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={localFilters.date_to || ''}
                      onChange={(e) => handleFilterChange('date_to', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex items-end gap-2 sm:col-span-2">
                    <button
                      onClick={applyFilters}
                      className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedPosts.length > 0 && (
            <div className="border-t border-gray-200 bg-indigo-50 px-4 py-3 dark:border-gray-700 dark:bg-indigo-900/20 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                  {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkStatusUpdate('published')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('draft')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                  >
                    <Edit className="h-4 w-4" />
                    Draft
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('archived')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts Table - Desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {selectedPosts.length === posts.data.length ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.data.length > 0 ? (
                  posts.data.map((post) => (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleSelectPost(post.id)}
                          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {selectedPosts.includes(post.id) ? (
                            <CheckSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {post.featured_image && (
                            <img
                              src={`/storage/${post.featured_image}`}
                              alt={post.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <Link
                              href={route('posts.edit', post.id)}
                              className="block font-medium text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                            >
                              {post.title}
                            </Link>
                            {post.tags && post.tags.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{post.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {post.user.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {post.category ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <FolderOpen className="h-3.5 w-3.5" />
                            {post.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Uncategorized</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(post.created_at)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={route('posts.show', post.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          <Link
                            href={route('posts.edit', post.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium">No posts found</p>
                      <p className="mt-1 text-sm">
                        Try adjusting your filters or create a new post
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Posts Cards - Mobile/Tablet */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:hidden">
            {posts.data.length > 0 ? (
              posts.data.map((post) => (
                <div key={post.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleSelectPost(post.id)}
                      className="mt-1 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {selectedPosts.includes(post.id) ? (
                        <CheckSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        {post.featured_image && (
                          <img
                            src={`/storage/${post.featured_image}`}
                            alt={post.title}
                            className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={route('posts.edit', post.id)}
                            className="block font-medium text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                          >
                            {post.title}
                          </Link>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            by {post.user.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status}
                        </span>
                        {post.category && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <FolderOpen className="h-3 w-3" />
                            {post.category.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(post.created_at)}
                        </span>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Link
                          href={route('posts.show', post.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                        <Link
                          href={route('posts.edit', post.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="text-base font-medium">No posts found</p>
                <p className="mt-1 text-sm">
                  Try adjusting your filters or create a new post
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {posts.data.length > 0 && posts.last_page > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{' '}
                  <span className="font-medium">
                    {(posts.current_page - 1) * posts.per_page + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(posts.current_page * posts.per_page, posts.total)}
                  </span>{' '}
                  of <span className="font-medium">{posts.total}</span> results
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {posts.links.map((link, index) => (
                    <button
                      key={index}
                      disabled={!link.url || link.active}
                      onClick={() => link.url && router.get(link.url)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${link.active
                        ? 'bg-indigo-600 text-white'
                        : link.url
                          ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                          : 'cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                        }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}