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
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(true);

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
    if (data.featured_image) {
      formData.append('featured_image', data.featured_image);
    }
    if (data.remove_image) {
      formData.append('remove_image', '1');
    }
    formData.append('status', status || data.status);
    if (data.published_at) formData.append('published_at', data.published_at);

    router.post(route('posts.update', post.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast.error(firstError as string);
        }
      },
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setData('title', title);
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

  // AI Content Improvement - FIXED VERSION
  const handleAIImprove = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter improvement instructions');
      return;
    }

    if (!data.body.trim()) {
      toast.error('No content to improve');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axios.post(route('ai.suggest'), {
        prompt: `${aiPrompt}\n\nCurrent content:\n${data.body}`,
        type: 'content', // FIXED: Added required type field
        context: data.body,
      });

      // FIXED: Changed from response.data.content to response.data.text
      if (response.data.text) {
        setData('body', response.data.text);
        setShowAIAssistant(false);
        setAiPrompt('');
        toast.success('Content improved!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to improve content');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      router.delete(route('posts.destroy', post.id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit: ${post.title}`} />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
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

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-6">
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
                        onClick={handleAIImprove}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                      >
                        {aiLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Improving...
                          </div>
                        ) : (
                          'Improve Content'
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

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Image
                </label>
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.featured_image}
                  </p>
                )}
              </div>

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
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}