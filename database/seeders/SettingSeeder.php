<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_title', 'value' => 'Mini CMS', 'type' => 'string', 'description' => 'Website title'],
            ['key' => 'site_description', 'value' => 'A modern content management system', 'type' => 'string', 'description' => 'Website description'],
            ['key' => 'theme_mode', 'value' => 'light', 'type' => 'string', 'description' => 'Theme mode (light/dark/auto)'],
            ['key' => 'posts_per_page', 'value' => '15', 'type' => 'integer', 'description' => 'Number of posts per page'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
