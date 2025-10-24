<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the explore page with all posts.
     */
    public function explore(Request $request): Response
    {
        $categorySlug = $request->input('category');

        // Get published posts
        $postsQuery = Post::with(['user', 'category'])
            ->where('status', 'published')
            ->latest('published_at');

        // Filter by category if specified
        if ($categorySlug) {
            $postsQuery->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
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

        return Inertia::render('Explore', [
            'posts' => $posts,
            'categories' => $categories,
            'selectedCategory' => $categorySlug,
        ]);
    }

    /**
     * Display the about page.
     */
    public function about(): Response
    {
        return Inertia::render('About');
    }

    /**
     * Display the contact page.
     */
    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    /**
     * Handle contact form submission.
     */
    public function sendContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // Here you would typically send an email or save to database
        // For now, we'll just return success

        // Example: Mail::to('support@contenthub.com')->send(new ContactFormMail($validated));

        return back()->with('success', 'Message sent successfully!');
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
