<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $posts = Post::all();
        $users = User::all();

        $comments = [
            'Great article! Very informative.',
            'Thanks for sharing this valuable information.',
            'I learned a lot from this post.',
            'Looking forward to more content like this.',
            'Excellent insights!',
        ];

        foreach ($posts as $post) {
            for ($i = 0; $i < rand(2, 5); $i++) {
                Comment::create([
                    'post_id' => $post->id,
                    'user_id' => $users->random()->id,
                    'content' => $comments[array_rand($comments)],
                    'status' => ['pending', 'approved', 'approved', 'approved'][rand(0, 3)],
                ]);
            }
        }
    }
}
