import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Hero from '@/Components/Landing/Hero';
import FeaturedPost from '@/Components/Landing/FeaturedPost';
import SearchBar from '@/Components/Landing/SearchBar';
import CategoryFilter from '@/Components/Landing/CategoryFilter';
import PostGrid from '@/Components/Landing/PostGrid';
import Footer from '@/Components/Landing/Footer';

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Head title="Home - ContentHub" />

      {/* Navbar */}
      <Navbar
        user={auth?.user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Hero Section - Only show if no search query and user is not authenticated */}
      {!searchQuery && !auth?.user && <Hero />}

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Featured Post - Only show on home page */}
          {!searchQuery && featuredPost && (
            <FeaturedPost post={featuredPost} />
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar initialQuery={searchQuery} />
          </div>

          {/* Search Results Header */}
          {searchQuery && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search results for "{searchQuery}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Found {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:col-span-1">
              <CategoryFilter
                categories={categories}
                activeCategory={undefined}
              />
            </aside>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchQuery ? 'Results' : 'Latest Posts'}
                </h2>
              </div>
              <PostGrid posts={posts} />

              {/* Load More Button - For pagination later */}
              {posts.length >= 9 && (
                <div className="mt-8 text-center">
                  <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    Load More Posts
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}