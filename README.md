# Content Management Dashboard (Mini CMS)

This is a modern, fullstack content management dashboard built with Laravel 11, Inertia.js, React, and TailwindCSS. It provides a complete, production-quality starter project for managing blog posts, categories, comments, and users, with integrated AI-assisted content generation.

## Features

-   **Authentication & Authorization**: Secure admin authentication with role-based access control (Admin, Editor, Viewer) using Laravel Breeze and Spatie Laravel Permission.
-   **Dashboard Overview**: A landing dashboard with key metrics, recent activity, and analytics charts.
-   **Posts Management**: Full CRUD for blog posts with a rich-text editor, image uploads, search, and filtering.
-   **Category Management**: CRUD operations for categories.
-   **Comment Moderation**: View, approve, or delete comments.
-   **User Management**: Full CRUD for users and role assignment.
-   **Media Library**: Simple media manager for uploaded files.
-   **Settings Page**: Manage basic site settings.
-   **AI Content Assistant**: Integrated AI to generate and improve content (titles, summaries, keywords) using OpenAI or other compatible APIs.
-   **Responsive UI**: Clean, modern, and fully responsive UI built with TailwindCSS.

## Tech Stack

-   **Backend**: Laravel 11 (PHP 8.3+)
-   **Frontend**: React (with TypeScript) & Inertia.js
-   **Styling**: TailwindCSS
-   **Authentication**: Laravel Breeze, Laravel Sanctum
-   **Roles & Permissions**: Spatie Laravel Permission
-   **Database**: MySQL or PostgreSQL (SQLite for local development)
-   **Charts**: Chart.js
-   **Rich-Text Editor**: Tiptap
-   **AI Integration**: OpenAI API (configurable)

## Getting Started

### Prerequisites

-   PHP 8.3+
-   Composer
-   Node.js & npm
-   A database server (MySQL, PostgreSQL, or SQLite)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-cms
```

### 2. Install Dependencies

Install PHP and Node.js dependencies.

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Configuration

Copy the environment file and generate an application key.

```bash
cp .env.example .env
php artisan key:generate
```

Next, configure your database and AI service credentials in the `.env` file:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mini_cms
DB_USERNAME=root
DB_PASSWORD=

# Add your OpenAI API Key for the AI assistant
OPENAI_API_KEY=sk-...
```

### 4. Run Database Migrations & Seeders

Run the migrations to create the database tables and seed the database with demo data.

```bash
php artisan migrate:fresh --seed
```

**Default Users:**

| Role   | Email             | Password   |
| :----- | :---------------- | :--------- |
| Admin  | `admin@example.com` | `password` |
| Editor | `editor@example.com`| `password` |
| Viewer | `viewer@example.com`| `password` |

### 5. Build Frontend Assets

Compile the frontend assets.

```bash
npm run build
```

### 6. Start the Development Server

Run the Laravel development server.

```bash
php artisan serve
```

Your application will be available at `http://127.0.0.1:8000`.

## Deployment on Railway.app

This project is designed for easy deployment on platforms like Railway.

### 1. Push to a GitHub Repository

Create a new repository on GitHub and push your project code.

### 2. Create a New Project on Railway

-   Log in to your Railway account and click "New Project".
-   Select "Deploy from GitHub repo" and choose your repository.
-   Railway will automatically detect the Laravel application and suggest a build plan.

### 3. Add a Database

-   In your Railway project, click "New" and add a PostgreSQL or MySQL database service.
-   Railway will automatically inject the database credentials into your application environment.

### 4. Configure Environment Variables

-   In your project settings on Railway, go to the "Variables" tab.
-   Railway will pre-fill most variables. Ensure you add the following:
    -   `APP_KEY`: Copy this from your local `.env` file. You can generate a new one with `php artisan key:generate` and copy the output.
    -   `OPENAI_API_KEY`: Your OpenAI API key for the AI features.
    -   `APP_URL`: The public URL provided by Railway (e.g., `https://my-app-production.up.railway.app`).

### 5. Set Up Deployment Configuration

Railway uses a `railway.json` file or infers the build and deploy commands. For Laravel, it typically runs:

-   **Build Command**: `npm install && npm run build && composer install --no-dev`
-   **Deploy Command**: `php artisan migrate:fresh --seed && php artisan serve --host=0.0.0.0 --port=$PORT`

Ensure your `Procfile` (if you choose to use one) or Railway deploy settings reflect this.

### 6. Persistent Storage

For file uploads (media library), you need to configure a persistent volume.

-   In your Railway project, add a Volume service.
-   Mount the volume to `/app/storage/app/public` in your application service settings.
-   Run `php artisan storage:link` as part of your deploy command to ensure the public symlink is created.


