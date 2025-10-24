<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page with published posts.
     */
    public function index(Request $request): Response
    {
        $searchQuery = $request->input('search');

        // Get published posts with eager loading
        $postsQuery = Post::with(['user', 'category'])
            ->where('status', 'published')
            ->latest('published_at');

        // Apply search filter if present
        if ($searchQuery) {
            $postsQuery->where(function ($query) use ($searchQuery) {
                $query->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('body', 'like', "%{$searchQuery}%")
                    ->orWhere('excerpt', 'like', "%{$searchQuery}%");
            });
        }

        $posts = $postsQuery->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'featured_image' => $post->featured_image ? asset('storage/' . $post->featured_image) : null,
                'author' => [
                    'name' => $post->user->name,
                    'avatar' => $post->user->avatar ? asset('storage/' . $post->user->avatar) : null,
                ],
                'category' => [
                    'name' => $post->category->name,
                    'slug' => $post->category->slug,
                ],
                'published_at' => $post->published_at?->format('M d, Y'),
                'reading_time' => $this->calculateReadingTime($post->body),
                'comments_count' => $post->comments()->where('status', 'approved')->count(),
            ];
        });

        // Get featured post (most recent published post)
        $featuredPost = $posts->first();

        // Get all posts except featured for the grid
        $gridPosts = $posts->skip(1);

        // Get categories with post counts
        $categories = Category::withCount([
            'posts' => function ($query) {
                $query->where('status', 'published');
            }
        ])->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'posts_count' => $category->posts_count,
            ];
        });

        return Inertia::render('Landing', [
            'featuredPost' => $featuredPost,
            'posts' => $gridPosts->values(),
            'categories' => $categories,
            'searchQuery' => $searchQuery,
        ]);
    }

    /**
     * Calculate estimated reading time based on word count.
     */
    private function calculateReadingTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200;

        return max(1, (int) ceil($wordCount / $wordsPerMinute));
    }
}
