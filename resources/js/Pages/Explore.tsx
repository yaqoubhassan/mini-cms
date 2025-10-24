import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
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

interface ExploreProps {
  auth?: {
    user?: User;
  };
  posts: Post[];
  categories: Category[];
  selectedCategory?: string;
}

export default function Explore({ auth, posts, categories, selectedCategory }: ExploreProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
    }
  };

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
      <Head title="Explore - ContentHub" />

      <Navbar user={auth?.user} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-5xl font-extrabold text-white mb-6">
                Explore Amazing Stories
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Discover thousands of stories from talented writers around the world.
                Filter by category or search for specific topics.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for stories..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                  />
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories Filter */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <FunnelIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filter by Category</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className={`px-6 py-3 rounded-full font-medium transition-all ${!selectedCategory
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/explore?category=${category.slug}`}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === category.slug
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                  {category.name} ({category.posts_count})
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Posts Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory
                  ? `${categories.find((c) => c.slug === selectedCategory)?.name} Stories`
                  : 'All Stories'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {posts.length} {posts.length === 1 ? 'story' : 'stories'} found
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No stories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <motion.article
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <Link href={`/posts/${post.slug}`} className="group block">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}