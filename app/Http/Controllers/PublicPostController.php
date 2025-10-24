<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPostController extends Controller
{
    /**
     * Display a single post with comments and related posts.
     */
    public function show(string $slug): Response
    {
        // Find the post by slug
        $post = Post::with(['user', 'category', 'comments' => function ($query) {
            $query->where('status', 'approved')->latest();
        }, 'comments.user'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        // Format the post data
        $postData = [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'body' => $post->body,
            'excerpt' => $post->excerpt,
            'featured_image' => $post->featured_image ? asset('storage/' . $post->featured_image) : null,
            'author' => [
                'id' => $post->user->id,
                'name' => $post->user->name,
                'email' => $post->user->email,
                'avatar' => $post->user->avatar ? asset('storage/' . $post->user->avatar) : null,
            ],
            'category' => [
                'id' => $post->category->id,
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ],
            'published_at' => $post->published_at?->toISOString(),
            'reading_time' => $this->calculateReadingTime($post->body),
            'comments_count' => $post->comments->count(),
            'comments' => $post->comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'author' => [
                        'name' => $comment->user->name,
                        'avatar' => $comment->user->avatar ? asset('storage/' . $comment->user->avatar) : null,
                    ],
                    'created_at' => $comment->created_at->toISOString(),
                ];
            }),
        ];

        // Get related posts (same category, excluding current post)
        $relatedPosts = Post::with(['user', 'category'])
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function ($relatedPost) {
                return [
                    'id' => $relatedPost->id,
                    'title' => $relatedPost->title,
                    'slug' => $relatedPost->slug,
                    'excerpt' => $relatedPost->excerpt,
                    'featured_image' => $relatedPost->featured_image ? asset('storage/' . $relatedPost->featured_image) : null,
                    'reading_time' => $this->calculateReadingTime($relatedPost->body),
                ];
            });

        return Inertia::render('PostShow', [
            'post' => $postData,
            'relatedPosts' => $relatedPosts,
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
