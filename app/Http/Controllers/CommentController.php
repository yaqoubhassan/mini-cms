<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::with(['post', 'user']);

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('post_id') && $request->post_id) {
            $query->where('post_id', $request->post_id);
        }

        $comments = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Comments/Index', [
            'comments' => $comments,
            'filters' => $request->only(['status', 'post_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string',
            'author_name' => 'nullable|string|max:255',
            'author_email' => 'nullable|email',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pending';

        Comment::create($validated);

        return back()->with('success', 'Comment submitted for moderation.');
    }

    public function update(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment updated successfully.');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully.');
    }

    public function approve(Comment $comment)
    {
        $comment->update(['status' => 'approved']);

        return back()->with('success', 'Comment approved.');
    }

    public function reject(Comment $comment)
    {
        $comment->update(['status' => 'rejected']);

        return back()->with('success', 'Comment rejected.');
    }
}
