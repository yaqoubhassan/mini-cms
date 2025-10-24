<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Role filter
        if ($request->has('role') && $request->role) {
            $query->role($request->role);
        }

        // Status filter (email verified)
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->status === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($request->get('per_page', 15))
            ->withQueryString()
            ->through(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at->format('M d, Y'),
                'roles' => $user->roles->pluck('name'),
            ]);

        $roles = Role::all();

        // Statistics
        $statistics = [
            'total' => User::count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'unverified' => User::whereNull('email_verified_at')->count(),
            'admins' => User::role('admin')->count(),
            'editors' => User::role('editor')->count(),
            'viewers' => User::role('viewer')->count(),
        ];

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'role', 'status', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'email_verified' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => $request->email_verified ? now() : null,
        ]);

        if (isset($validated['role'])) {
            $user->assignRole($validated['role']);
        }

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['roles', 'posts', 'comments', 'media']);

        // User statistics
        $stats = [
            'total_posts' => $user->posts()->count(),
            'published_posts' => $user->posts()->where('status', 'published')->count(),
            'draft_posts' => $user->posts()->where('status', 'draft')->count(),
            'total_comments' => $user->comments()->count(),
            'approved_comments' => $user->comments()->where('status', 'approved')->count(),
            'total_media' => $user->media()->count(),
        ];

        // Recent activity
        $recentPosts = $user->posts()
            ->with('category')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'status' => $post->status,
                'category' => $post->category?->name,
                'created_at' => $post->created_at->format('M d, Y'),
            ]);

        $recentComments = $user->comments()
            ->with('post')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($comment) => [
                'id' => $comment->id,
                'content' => substr($comment->content, 0, 100) . (strlen($comment->content) > 100 ? '...' : ''),
                'post_title' => $comment->post->title,
                'status' => $comment->status,
                'created_at' => $comment->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->format('M d, Y h:i A'),
                'created_at' => $user->created_at->format('M d, Y h:i A'),
                'updated_at' => $user->updated_at->format('M d, Y h:i A'),
                'roles' => $user->roles->pluck('name'),
            ],
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'recentComments' => $recentComments,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $user->load('roles');
        $roles = Role::all();

        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'roles' => $user->roles->pluck('name'),
            ],
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id . '|max:255',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'email_verified' => 'boolean',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'email_verified_at' => $request->email_verified ? now() : null,
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting the last admin
        if ($user->hasRole('admin') && User::role('admin')->count() === 1) {
            return redirect()->route('users.index')
                ->with('error', 'Cannot delete the last admin user.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
