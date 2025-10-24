import { useState, useEffect, FormEvent } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/Posts/RichTextEditor';
import ImageUpload from '@/Components/Posts/ImageUpload';
import TagsInput from '@/Components/Posts/TagsInput';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Save,
  X,
  Eye,
  Send,
  FileText,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

export default function Create({ categories }: Props) {
  const { flash } = usePage().props as any;
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    slug: '',
    body: '',
    category_id: '',
    tags: [] as string[],
    featured_image: null as File | null,
    status: 'draft',
    published_at: '',
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
    formData.append('status', status || data.status);
    if (data.published_at) formData.append('published_at', data.published_at);

    post(route('posts.store'), {
      forceFormData: true,
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
    // Mark slug as manually edited once user types in it
    setIsSlugManuallyEdited(true);
  };

  const handleResetSlug = () => {
    // Reset to auto-generated slug from title
    setIsSlugManuallyEdited(false);
    setData('slug', generateSlug(data.title));
  };

  // AI Content Generation - FIXED VERSION
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axios.post(route('ai.suggest'), {
        prompt: aiPrompt,
        type: 'content', // FIXED: Added required type field
        context: data.body,
      });

      // FIXED: Changed from response.data.content to response.data.text
      if (response.data.text) {
        setData('body', data.body + '\n\n' + response.data.text);
        setShowAIAssistant(false);
        setAiPrompt('');
        toast.success('AI content generated!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate content');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create Post" />

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Post</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Write and publish your blog post
              </p>
            </div>
          </div>
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
                  {isSlugManuallyEdited && (
                    <button
                      type="button"
                      onClick={handleResetSlug}
                      className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      Reset to auto-generated
                    </button>
                  )}
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
                      AI Content Generator
                    </div>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe what you want to write about..."
                      className="mb-3 w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-purple-700 dark:bg-gray-800 dark:text-white"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                      >
                        {aiLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Generating...
                          </div>
                        ) : (
                          'Generate Content'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAIAssistant(false);
                          setAiPrompt('');
                        }}
                        className="rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700"
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

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={data.category_id}
                  onChange={(e) => setData('category_id', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.category_id}
                  </p>
                )}
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
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tags}</p>
                )}
              </div>

              {/* Featured Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Image
                </label>
                <ImageUpload
                  image={data.featured_image}
                  onChange={(file) => setData('featured_image', file)}
                />
                {errors.featured_image && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.featured_image}
                  </p>
                )}
              </div>

              {/* Publish Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Publish Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={data.published_at}
                  onChange={(e) => setData('published_at', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {errors.published_at && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.published_at}
                  </p>
                )}
              </div>
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
                Save Draft
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}