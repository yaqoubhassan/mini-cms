import { Link } from '@inertiajs/react';
import { TagIcon } from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <TagIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Categories
        </h3>
      </div>

      <div className="space-y-2">
        <Link
          href="/"
          className={`block px-4 py-2 rounded-lg transition-colors ${!activeCategory
            ? 'bg-indigo-600 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          <div className="flex items-center justify-between">
            <span>All Posts</span>
          </div>
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`block px-4 py-2 rounded-lg transition-colors ${activeCategory === category.slug
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <div className="flex items-center justify-between">
              <span>{category.name}</span>
              <span className="text-sm opacity-75">
                {category.posts_count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}