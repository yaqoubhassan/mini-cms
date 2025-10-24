import { useState, useEffect, FormEvent } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/Posts/RichTextEditor';
import ImageUpload from '@/Components/Posts/ImageUpload';
import TagsInput from '@/Components/Posts/TagsInput';
import toast from 'react-hot-toast';
import {
  Save,
  X,
  Eye,
  Send,
  FileText,
  Sparkles,
  ArrowLeft,
  Trash2,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  category_id: number | null;
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

interface Props {
  post: Post;
  categories: Category[];
}

export default function Edit({ post, categories }: Props) {
  const { flash } = usePage().props as any;
  const { data, setData, processing, errors } = useForm({
    title: post.title,
    slug: post.slug,
    body: post.body,
    category_id: post.category_id?.toString() || '',
    tags: post.tags || [],
    featured_image: null as File | null,
    remove_image: false,
    status: post.status,
    published_at: post.published_at || '',
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(true); // Default true for edit mode

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleSubmit = (e: FormEvent, status?: string) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PUT'); // This is the key fix!
    formData.append('title', data.title);
    if (data.slug) formData.append('slug', data.slug);
    formData.append('body', data.body);
    if (data.category_id) formData.append('category_id', data.category_id.toString());
    if (data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }
    if (data.featured_image) {
      formData.append('featured_image', data.featured_image);
    }
    if (data.remove_image) {
      formData.append('remove_image', '1');
    }
    formData.append('status', status || data.status);
    if (data.published_at) formData.append('published_at', data.published_at);

    // Use router.post with _method: PUT for file uploads
    router.post(route('posts.update', post.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      onError: (errors) => {
        // Show first error in toast
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast.error(firstError as string);
        }
      },
    });
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setData('title', title);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      const autoSlug = generateSlug(title);
      setData('slug', autoSlug);
    }
  };

  const handleSlugChange = (slug: string) => {
    setData('slug', slug);
    setIsSlugManuallyEdited(true);
  };

  const handleResetSlug = () => {
    setIsSlugManuallyEdited(false);
    setData('slug', generateSlug(data.title));
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit: ${post.title}`} />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={route('posts.index')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update your blog post
              </p>
            </div>
          </div>
          <Link
            href={route('posts.show', post.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter post title..."
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Slug
                  </label>
                  <button
                    type="button"
                    onClick={handleResetSlug}
                    className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Reset to auto-generated
                  </button>
                </div>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="auto-generated-from-title"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                )}
              </div>

              {/* Body with AI Assistant */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700"
                  >
                    <Sparkles className="h-3 w-3" />
                    AI Assistant
                  </button>
                </div>

                {/* AI Assistant Panel */}
                {showAIAssistant && (
                  <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-purple-900 dark:text-purple-100">
                      <Sparkles className="h-4 w-4" />
                      AI Content Improver
                    </div>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="How would you like to improve this content?"
                      className="mb-3 w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-purple-700 dark:bg-gray-800 dark:text-white"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toast('AI improvement feature coming soon!')}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                      >
                        {aiLoading ? 'Processing...' : 'Improve Content'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAIAssistant(false)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <RichTextEditor
                  content={data.body}
                  onChange={(value) => setData('body', value)}
                />
                {errors.body && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.body}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Featured Image
              </h3>
              <ImageUpload
                image={data.featured_image}
                onChange={(file) => setData('featured_image', file)}
                currentImage={post.featured_image}
                onRemove={() => {
                  setData('featured_image', null);
                  setData('remove_image', true);
                }}
              />
              {errors.featured_image && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.featured_image}
                </p>
              )}
            </div>

            {/* Post Settings */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Post Settings
              </h3>
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <TagsInput
                    tags={data.tags}
                    onChange={(tags) => setData('tags', tags)}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as 'draft' | 'published' | 'archived')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Publish Date */}
                {data.status === 'published' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={data.published_at}
                      onChange={(e) => setData('published_at', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Post Meta */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Post Info
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Created:</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {new Date(post.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Updated:</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {new Date(post.updated_at).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Author:</dt>
                  <dd className="text-gray-900 dark:text-white">{post.user.name}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Link
              href={route('posts.index')}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {processing ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}