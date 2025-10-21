<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::with('user');

        if ($request->has('search')) {
            $query->where('original_filename', 'like', "%{$request->search}%");
        }

        if ($request->has('mime_type') && $request->mime_type) {
            $query->where('mime_type', 'like', $request->mime_type . '%');
        }

        $media = $query->latest()->paginate(24)->withQueryString();

        return Inertia::render('Media/Index', [
            'media' => $media,
            'filters' => $request->only(['search', 'mime_type']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('media', $filename, 'public');

        $media = Media::create([
            'user_id' => auth()->id(),
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'disk' => 'public',
            'metadata' => [
                'extension' => $file->getClientOriginalExtension(),
            ],
        ]);

        return response()->json([
            'success' => true,
            'media' => $media,
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function destroy(Media $media)
    {
        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return back()->with('success', 'Media deleted successfully.');
    }
}
