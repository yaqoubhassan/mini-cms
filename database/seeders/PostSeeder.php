<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();

        $posts = [
            [
                'title' => 'Getting Started with Laravel 11',
                'body' => 'Laravel 11 brings exciting new features and improvements. In this comprehensive guide, we will explore the latest additions to the framework and how they can enhance your development workflow.',
                'status' => 'published',
                'tags' => ['laravel', 'php', 'web development'],
            ],
            [
                'title' => 'The Future of AI in Business',
                'body' => 'Artificial Intelligence is transforming how businesses operate. From automation to predictive analytics, AI is becoming an essential tool for modern enterprises.',
                'status' => 'published',
                'tags' => ['ai', 'business', 'technology'],
            ],
            [
                'title' => 'Healthy Living Tips for 2025',
                'body' => 'As we navigate through 2025, maintaining a healthy lifestyle is more important than ever. Here are some practical tips to help you stay fit and healthy.',
                'status' => 'published',
                'tags' => ['health', 'wellness', 'lifestyle'],
            ],
            [
                'title' => 'Top Travel Destinations This Year',
                'body' => 'Discover the most amazing travel destinations for this year. From exotic beaches to historic cities, we have compiled a list of must-visit places.',
                'status' => 'draft',
                'tags' => ['travel', 'tourism', 'adventure'],
            ],
            [
                'title' => 'Building Modern Web Applications',
                'body' => 'Learn how to build modern, responsive web applications using the latest technologies and best practices in web development.',
                'status' => 'published',
                'tags' => ['web development', 'javascript', 'react'],
            ],
        ];

        foreach ($posts as $postData) {
            Post::create([
                'title' => $postData['title'],
                'body' => $postData['body'],
                'status' => $postData['status'],
                'tags' => $postData['tags'],
                'user_id' => $users->random()->id,
                'category_id' => $categories->random()->id,
                'published_at' => $postData['status'] === 'published' ? now() : null,
            ]);
        }
    }
}
