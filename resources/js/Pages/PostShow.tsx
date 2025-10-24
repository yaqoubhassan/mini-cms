import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import {
  ClockIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  ArrowLeftIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  featured_image?: string;
  author: Author;
  category: Category;
  published_at: string;
  reading_time: number;
  comments_count: number;
  comments: Comment[];
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  reading_time: number;
}

interface PostShowProps {
  auth?: {
    user?: User;
  };
  post: Post;
  relatedPosts: RelatedPost[];
}

export default function PostShow({ auth, post, relatedPosts }: PostShowProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { data, setData, post: submitComment, processing, reset } = useForm({
    content: '',
    post_id: post.id,
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment(route('comments.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Head title={`${post.title} - ContentHub`} />

      <Navbar user={auth?.user} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Home
              </Link>

              <div className="mb-6">
                <Link
                  href={`/?category=${post.category.slug}`}
                  className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full hover:bg-white/30 transition-colors"
                >
                  {post.category.name}
                </Link>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Link href="#" className="flex items-center gap-3 group">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <UserCircleIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold group-hover:underline">
                        {post.author.name}
                      </p>
                      <div className="flex items-center gap-3 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {post.reading_time} min read
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLiked(!liked)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    {liked ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-400" />
                    ) : (
                      <HeartIcon className="w-6 h-6" />
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setBookmarked(!bookmarked)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <BookmarkIcon className={`w-6 h-6 ${bookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <ShareIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Image */}
        {post.featured_image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-12">
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-strong:text-gray-900 dark:prose-strong:text-white prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>

          {/* Tags or share section could go here */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Share this story:</span>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Share
              </button>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-6 h-6" />
              Comments ({post.comments_count})
            </h2>

            {/* Comment Form */}
            {auth?.user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none"
                  required
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {processing ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Sign in to join the conversation
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    {comment.author.avatar ? (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.author.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {relatedPost.featured_image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {relatedPost.reading_time} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}