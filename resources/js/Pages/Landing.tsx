import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ArrowRightIcon,
  FireIcon,
  // TrendingUpIcon,
} from '@heroicons/react/24/outline';

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
  posts_count: number;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  published_at: string;
  reading_time: number;
  comments_count: number;
}

interface LandingProps {
  auth?: {
    user?: User;
  };
  featuredPost?: Post;
  posts: Post[];
  categories: Category[];
  searchQuery?: string;
}

export default function Landing({ auth, featuredPost, posts, categories, searchQuery }: LandingProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery || '');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchValue.trim())}`;
    } else {
      window.location.href = '/';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Head title="Home - ContentHub" />

      {/* Navbar */}
      <Navbar user={auth?.user} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      {!searchQuery && !auth?.user && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
        >
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-8"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">AI-Powered Content Platform</span>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
              >
                Share Your Stories
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Inspire the World
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl sm:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                A modern platform where writers, creators, and thinkers come together to share ideas,
                spark conversations, and build communities.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span>Start Writing</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Explore Stories
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              >
                {[
                  { label: 'Active Writers', value: '10K+', icon: '✍️' },
                  { label: 'Stories Published', value: '50K+', icon: '📚' },
                  { label: 'Daily Readers', value: '100K+', icon: '👥' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for stories, topics, or authors..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 text-lg"
                />
              </div>
            </form>

            {searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Found <span className="font-bold text-indigo-600 dark:text-indigo-400">{posts.length}</span> results for "{searchQuery}"
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Featured Post */}
          {!searchQuery && featuredPost && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-6">
                <FireIcon className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Story</h2>
              </div>

              <Link href={`/posts/${featuredPost.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredPost.featured_image && (
                      <div className="relative h-80 md:h-full overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-transparent"></div>
                      </div>
                    )}

                    <div className={`p-8 md:p-12 flex flex-col justify-center ${!featuredPost.featured_image ? 'md:col-span-2' : ''}`}>
                      <span className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-4">
                        {/* <TrendingUpIcon className="w-4 h-4" /> */}
                        TRENDING NOW
                      </span>

                      <span className="text-white/80 text-sm font-medium mb-3">
                        {featuredPost.category.name}
                      </span>

                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-yellow-300 transition-colors">
                        {featuredPost.title}
                      </h3>

                      <p className="text-white/90 text-lg mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-white/80 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          {featuredPost.author.avatar ? (
                            <img
                              src={featuredPost.author.avatar}
                              alt={featuredPost.author.name}
                              className="w-8 h-8 rounded-full border-2 border-white/30"
                            />
                          ) : (
                            <UserCircleIcon className="w-8 h-8" />
                          )}
                          <span className="font-medium">{featuredPost.author.name}</span>
                        </div>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {featuredPost.reading_time} min read
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                        Read Full Story
                        <ArrowRightIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Category Filters */}
          {categories.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Explore by Category</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  All Posts
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/?category=${category.slug}`}
                    className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {category.name} ({category.posts_count})
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Posts Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {searchQuery ? 'Search Results' : 'Latest Stories'}
            </h2>

            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? 'Try a different search term' : 'Be the first to share your story!'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <Link href={`/posts/${post.slug}`} className="block">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
                        {/* Image */}
                        {post.featured_image && (
                          <div className="relative h-48 overflow-hidden">
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold rounded-full">
                                {post.category.name}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          {!post.featured_image && (
                            <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-full mb-3">
                              {post.category.name}
                            </span>
                          )}

                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                              {post.author.avatar ? (
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                              )}
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {post.author.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {post.reading_time}m
                              </span>
                              <span className="flex items-center gap-1">
                                <ChatBubbleLeftIcon className="w-4 h-4" />
                                {post.comments_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          {!auth?.user && posts.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-20 mb-12"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center shadow-2xl">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-4">Ready to Share Your Story?</h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Join our community of writers and start publishing your content today. It's free and takes less than a minute!
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}