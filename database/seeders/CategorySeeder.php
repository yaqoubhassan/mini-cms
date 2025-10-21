<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'description' => 'Articles about technology and innovation'],
            ['name' => 'Business', 'slug' => 'business', 'description' => 'Business news and insights'],
            ['name' => 'Lifestyle', 'slug' => 'lifestyle', 'description' => 'Lifestyle tips and trends'],
            ['name' => 'Health', 'slug' => 'health', 'description' => 'Health and wellness articles'],
            ['name' => 'Travel', 'slug' => 'travel', 'description' => 'Travel guides and experiences'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
