import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    FileText,
    FolderOpen,
    MessageSquare,
    Users,
    TrendingUp,
    TrendingDown,
    Clock,
    Eye,
    ArrowUpRight,
    ArrowRight,
    Plus,
    Edit,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Activity,
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

interface DashboardProps {
    stats: {
        total_posts: number;
        total_categories: number;
        total_comments: number;
        total_users: number;
        published_posts: number;
        draft_posts: number;
        pending_comments: number;
    };
    recentPosts: Array<{
        id: number;
        title: string;
        status: string;
        created_at: string;
        user: { name: string };
        category?: { name: string };
    }>;
    recentComments: Array<{
        id: number;
        content: string;
        status: string;
        created_at: string;
        post: { title: string };
        user?: { name: string };
    }>;
    postsByStatus: {
        labels: string[];
        data: number[];
    };
    postsByMonth: {
        labels: string[];
        data: number[];
    };
}

export default function Dashboard({
    stats,
    recentPosts,
    recentComments,
    postsByStatus,
    postsByMonth,
}: DashboardProps) {
    // Chart Data Configurations
    const statusChartData = {
        labels: postsByStatus.labels,
        datasets: [
            {
                data: postsByStatus.data,
                backgroundColor: [
                    'rgba(34, 197, 94, 0.9)',
                    'rgba(234, 179, 8, 0.9)',
                    'rgba(156, 163, 175, 0.9)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(156, 163, 175, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    const monthChartData = {
        labels: postsByMonth.labels,
        datasets: [
            {
                label: 'Posts Created',
                data: postsByMonth.data,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: {
                        size: 12,
                        weight: '500' as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold' as const,
                },
                bodyFont: {
                    size: 13,
                },
                cornerRadius: 8,
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold' as const,
                },
                bodyFont: {
                    size: 13,
                },
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Stat Cards Data
    const statCards = [
        {
            title: 'Total Posts',
            value: stats.total_posts,
            icon: FileText,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            change: '+12.5%',
            trending: 'up',
            link: route('posts.index'),
        },
        {
            title: 'Categories',
            value: stats.total_categories,
            icon: FolderOpen,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            change: '+3',
            trending: 'up',
            link: route('categories.index'),
        },
        {
            title: 'Comments',
            value: stats.total_comments,
            icon: MessageSquare,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            change: '+8.2%',
            trending: 'up',
            link: route('comments.index'),
        },
        {
            title: 'Users',
            value: stats.total_users,
            icon: Users,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400',
            change: '+2',
            trending: 'up',
            link: route('users.index'),
        },
    ];

    // Quick Stats
    const quickStats = [
        {
            label: 'Published',
            value: stats.published_posts,
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            label: 'Drafts',
            value: stats.draft_posts,
            icon: Edit,
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        },
        {
            label: 'Pending Comments',
            value: stats.pending_comments,
            icon: AlertCircle,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
        return badges[status as keyof typeof badges] || badges.draft;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                            Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Welcome back! Here's what's happening with your content.
                        </p>
                    </div>
                    <Link
                        href={route('posts.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Post</span>
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stat Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;
                        const TrendIcon = card.trending === 'up' ? TrendingUp : TrendingDown;
                        return (
                            <Link
                                key={index}
                                href={card.link}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                {/* Background Gradient */}
                                <div
                                    className={`absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
                                />

                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div className={`rounded-lg ${card.bgColor} p-3`}>
                                            <Icon className={`h-6 w-6 ${card.textColor}`} />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                                            <TrendIcon className="h-3 w-3" />
                                            {card.change}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {card.title}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                            {card.value.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 dark:text-gray-500" />
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats Row */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Posts Trend Chart */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Posts Trend
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Last 6 months activity
                                </p>
                            </div>
                            <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <div className="h-64">
                            <Line data={monthChartData} options={lineChartOptions} />
                        </div>
                    </div>

                    {/* Posts by Status Chart */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Posts by Status
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Distribution overview
                                </p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
                                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="h-64">
                            <Doughnut data={statusChartData} options={doughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Content Tables Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Posts */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Recent Posts
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Latest published content
                                    </p>
                                </div>
                                <Link
                                    href={route('posts.index')}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentPosts.length > 0 ? (
                                recentPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={route('posts.edit', post.id)}
                                        className="block p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {post.title}
                                                </h4>
                                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {post.user.name}
                                                    </span>
                                                    {post.category && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="inline-flex items-center gap-1">
                                                                <FolderOpen className="h-3 w-3" />
                                                                {post.category.name}
                                                            </span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDate(post.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                                                    post.status
                                                )}`}
                                            >
                                                {post.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        No posts yet
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Create your first post to get started
                                    </p>
                                    <Link
                                        href={route('posts.create')}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create Post
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Comments */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Recent Comments
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Latest user feedback
                                    </p>
                                </div>
                                <Link
                                    href={route('comments.index')}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentComments.length > 0 ? (
                                recentComments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm text-gray-900 dark:text-white">
                                                    {comment.content}
                                                </p>
                                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    {comment.user && (
                                                        <>
                                                            <span className="inline-flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {comment.user.name}
                                                            </span>
                                                            <span>•</span>
                                                        </>
                                                    )}
                                                    <span className="truncate">on: {comment.post.title}</span>
                                                    <span>•</span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDate(comment.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                                                    comment.status
                                                )}`}
                                            >
                                                {comment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        No comments yet
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Comments will appear here when users interact with your posts
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}