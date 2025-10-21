<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $stats = [
            'total_posts' => Post::count(),
            'total_categories' => Category::count(),
            'total_comments' => Comment::count(),
            'total_users' => User::count(),
            'published_posts' => Post::where('status', 'published')->count(),
            'draft_posts' => Post::where('status', 'draft')->count(),
            'pending_comments' => Comment::where('status', 'pending')->count(),
        ];

        $recentPosts = Post::with(['user', 'category'])
            ->latest()
            ->take(5)
            ->get();

        $recentComments = Comment::with(['post', 'user'])
            ->latest()
            ->take(5)
            ->get();

        // Chart data for posts by status
        $postsByStatus = [
            'labels' => ['Published', 'Draft', 'Archived'],
            'data' => [
                Post::where('status', 'published')->count(),
                Post::where('status', 'draft')->count(),
                Post::where('status', 'archived')->count(),
            ],
        ];

        // Chart data for posts by month (last 6 months)
        $postsByMonth = [
            'labels' => [],
            'data' => [],
        ];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $postsByMonth['labels'][] = $date->format('M Y');
            $postsByMonth['data'][] = Post::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'recentComments' => $recentComments,
            'postsByStatus' => $postsByStatus,
            'postsByMonth' => $postsByMonth,
        ]);
    }
}
