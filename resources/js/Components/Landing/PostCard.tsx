import { Link } from '@inertiajs/react';
import { ClockIcon, ChatBubbleLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {post.featured_image && (
        <Link href={`/posts/${post.slug}`} className="block">
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <Link
          href={`/categories/${post.category.slug}`}
          className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-full mb-3 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
        >
          {post.category.name}
        </Link>

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {post.reading_time} min read
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span className="text-sm">{post.comments_count}</span>
          </div>
        </div>
      </div>
    </article>
  );
}