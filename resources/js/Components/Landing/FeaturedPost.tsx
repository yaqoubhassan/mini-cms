import { Link } from '@inertiajs/react';
import { ClockIcon, UserCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
}

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl mb-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        {post.featured_image && (
          <div className="h-full min-h-[300px] md:min-h-[400px]">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className={`p-8 md:p-12 ${!post.featured_image ? 'md:col-span-2' : ''}`}>
          <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">
            Featured Post
          </span>

          <Link
            href={`/categories/${post.category.slug}`}
            className="inline-block text-white/90 hover:text-white text-sm font-medium mb-3"
          >
            {post.category.name}
          </Link>

          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 hover:opacity-90 transition-opacity">
              {post.title}
            </h2>
          </Link>

          <p className="text-white/90 text-lg mb-6 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 mb-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full border-2 border-white/30"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8" />
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>
            <span>•</span>
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {post.reading_time} min read
            </span>
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Read More
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}