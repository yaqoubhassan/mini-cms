import { useState, FormEvent } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/Posts/RichTextEditor';
import ImageUpload from '@/Components/Posts/ImageUpload';
import TagsInput from '@/Components/Posts/TagsInput';
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
  const { data, setData, post: submit, processing, errors } = useForm({
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

  const handleSubmit = (e: FormEvent, status?: string) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', data.title);
    if (data.slug) formData.append('slug', data.slug);
    formData.append('body', data.body);
    if (data.category_id) formData.append('category_id', data.category_id.toString());
    if (data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }
    if (data.featured_image) formData.append('featured_image', data.featured_image);
    if (data.remove_image) formData.append('remove_image', '1');
    formData.append('status', status || data.status);
    if (data.published_at) formData.append('published_at', data.published_at);

    submit(route('posts.update', post.id), {
      forceFormData: true,
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
    // Mark slug as manually edited once user types in it
    setIsSlugManuallyEdited(true);
  };

  const handleResetSlug = () => {
    // Reset to auto-generated slug from title
    setIsSlugManuallyEdited(false);
    setData('slug', generateSlug(data.title));
  };

  // AI Content Generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch(route('ai.suggest'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const result = await response.json();
      if (result.content) {
        setData('body', data.body + '\n\n' + result.content);
        setShowAIAssistant(false);
        setAiPrompt('');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      router.delete(route('posts.destroy', post.id));
    }
  };

  const handleRemoveImage = () => {
    setData('remove_image', true);
    setData('featured_image', null);
  };

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
                Edit Post
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update your blog post content
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete Post</span>
          </button>
        </div>
      }
    >
      <Head title={`Edit: ${post.title}`} />

      <div className="mx-auto max-w-7xl space-y-6">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="space-y-6 lg:col-span-2">
              {/* Title and Slug */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={data.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter post title..."
                      required
                    />
                    {errors.title && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type="text"
                        id="slug"
                        value={data.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-24 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="url-friendly-slug"
                      />
                      <button
                        type="button"
                        onClick={handleResetSlug}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                        title="Reset to auto-generated slug from current title"
                      >
                        Reset
                      </button>
                    </div>
                    {errors.slug && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                    )}
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {isSlugManuallyEdited
                        ? "Editing slug manually. Click 'Reset' to regenerate from title."
                        : "Auto-updating with title changes. Edit to customize."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                  </button>
                </div>

                {showAIAssistant && (
                  <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-900/20">
                    <h4 className="mb-2 text-sm font-semibold text-purple-900 dark:text-purple-300">
                      AI Content Generator
                    </h4>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe what you want to add to your content..."
                      className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-purple-600 dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                      >
                        {aiLoading ? 'Generating...' : 'Generate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAIAssistant(false)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <RichTextEditor
                  content={data.body}
                  onChange={(content) => setData('body', content)}
                />
                {errors.body && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.body}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Post Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Author:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {post.user.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(post.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Publish Settings */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Publish Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      id="status"
                      value={data.status}
                      onChange={(e) => setData('status', e.target.value as 'draft' | 'published' | 'archived')}
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {data.status === 'published' && (
                    <div>
                      <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Publish Date
                      </label>
                      <input
                        type="datetime-local"
                        id="published_at"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {processing ? 'Saving...' : 'Update Post'}
                    </button>

                    {data.status === 'draft' && (
                      <button
                        type="button"
                        onClick={(e) => handleSubmit(e as any, 'published')}
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 disabled:opacity-50 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                      >
                        <Send className="h-4 w-4" />
                        Update & Publish
                      </button>
                    )}

                    <Link
                      href={route('posts.index')}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Category
                </h3>
                <select
                  value={data.category_id}
                  onChange={(e) => setData('category_id', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category_id}</p>
                )}
              </div>

              {/* Tags */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Tags
                </h3>
                <TagsInput
                  tags={data.tags}
                  onChange={(tags) => setData('tags', tags)}
                />
                {errors.tags && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.tags}</p>
                )}
              </div>

              {/* Featured Image */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Featured Image
                </h3>
                <ImageUpload
                  image={data.featured_image}
                  currentImage={!data.remove_image ? post.featured_image : null}
                  onChange={(file) => {
                    setData('featured_image', file);
                    setData('remove_image', false);
                  }}
                  onRemove={handleRemoveImage}
                />
                {errors.featured_image && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.featured_image}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}