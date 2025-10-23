<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['user', 'category']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by author
        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $posts = $query->paginate($perPage)->withQueryString();

        $categories = Category::withCount('posts')->get();
        $authors = User::has('posts')->select('id', 'name')->get();

        // Get statistics for dashboard cards
        $statistics = [
            'total' => Post::count(),
            'published' => Post::where('status', 'published')->count(),
            'draft' => Post::where('status', 'draft')->count(),
            'archived' => Post::where('status', 'archived')->count(),
        ];

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'authors' => $authors,
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'category_id', 'status', 'user_id', 'sort_by', 'sort_order', 'per_page', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Posts/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:posts,slug',
            'body' => 'required|string|min:10',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        $validated['user_id'] = auth()->id();

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            // Ensure slug uniqueness
            $originalSlug = $validated['slug'];
            $count = 1;
            while (Post::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = $originalSlug . '-' . $count;
                $count++;
            }
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $image = $request->file('featured_image');
            $filename = time() . '_' . Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('posts', $filename, 'public');
            $validated['featured_image'] = $path;
        }

        // Auto-set published_at when status is published
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        return redirect()->route('posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load(['user', 'category', 'comments.user']);

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        $categories = Category::all();
        $post->load(['user', 'category']);

        return Inertia::render('Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:posts,slug,' . $post->id,
            'body' => 'required|string|min:10',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'remove_image' => 'nullable|boolean',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle featured image removal
        if ($request->input('remove_image') && $post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
            $validated['featured_image'] = null;
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }

            $image = $request->file('featured_image');
            $filename = time() . '_' . Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('posts', $filename, 'public');
            $validated['featured_image'] = $path;
        }

        // Auto-set published_at when changing to published status
        if ($validated['status'] === 'published' && $post->status !== 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->route('posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // Delete featured image if exists
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully.');
    }

    /**
     * Bulk delete posts
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:posts,id',
        ]);

        $posts = Post::whereIn('id', $request->ids)->get();

        foreach ($posts as $post) {
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $post->delete();
        }

        return back()->with('success', count($request->ids) . ' posts deleted successfully.');
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:posts,id',
            'status' => 'required|in:draft,published,archived',
        ]);

        $updateData = ['status' => $request->status];

        // Set published_at for posts being published
        if ($request->status === 'published') {
            $updateData['published_at'] = now();
        }

        Post::whereIn('id', $request->ids)->update($updateData);

        return back()->with('success', count($request->ids) . ' posts updated successfully.');
    }
}
