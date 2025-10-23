import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    FileText,
    FolderOpen,
    MessageSquare,
    Users,
    TrendingUp,
    Clock,
    Eye,
    ArrowUpRight,
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
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
    const statusChartData = {
        labels: postsByStatus.labels,
        datasets: [
            {
                data: postsByStatus.data,
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(156, 163, 175, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const monthChartData = {
        labels: postsByMonth.labels,
        datasets: [
            {
                label: 'Posts Created',
                data: postsByMonth.data,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Welcome back! Here's what's happening with your content.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Posts"
                        value={stats.total_posts}
                        subtitle={`${stats.published_posts} published`}
                        icon={FileText}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-100"
                        link={route('posts.index')}
                        trend="+12.5%"
                    />
                    <StatCard
                        title="Categories"
                        value={stats.total_categories}
                        subtitle="Active categories"
                        icon={FolderOpen}
                        iconColor="text-green-600"
                        iconBg="bg-green-100"
                        link={route('categories.index')}
                    />
                    <StatCard
                        title="Comments"
                        value={stats.total_comments}
                        subtitle={`${stats.pending_comments} pending`}
                        icon={MessageSquare}
                        iconColor="text-yellow-600"
                        iconBg="bg-yellow-100"
                        link={route('comments.index')}
                    />
                    <StatCard
                        title="Users"
                        value={stats.total_users}
                        subtitle="Total users"
                        icon={Users}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-100"
                        link={route('users.index')}
                        trend="+3.2%"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Posts by Status */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Posts by Status
                            </h3>
                            <TrendingUp className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="h-64">
                            <Doughnut data={statusChartData} options={chartOptions} />
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                            {postsByStatus.labels.map((label, index) => (
                                <div key={label} className="flex items-center">
                                    <div
                                        className="mr-2 h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                statusChartData.datasets[0].backgroundColor[
                                                index
                                                ],
                                        }}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {label}: {postsByStatus.data[index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Posts Created Over Time */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Posts Created
                            </h3>
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="h-64">
                            <Bar data={monthChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Posts */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recent Posts
                                </h3>
                                <Link
                                    href={route('posts.index')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                >
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentPosts.length > 0 ? (
                                recentPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Link
                                                    href={route('posts.edit', post.id)}
                                                    className="font-medium text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                                                >
                                                    {post.title}
                                                </Link>
                                                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>{post.user.name}</span>
                                                    {post.category && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{post.category.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <StatusBadge status={post.status} />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        No posts yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Comments */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recent Comments
                                </h3>
                                <Link
                                    href={route('comments.index')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                >
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentComments.length > 0 ? (
                                recentComments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {comment.content.substring(0, 100)}
                                                    {comment.content.length > 100 && '...'}
                                                </p>
                                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium">
                                                        {comment.user?.name || 'Anonymous'}
                                                    </span>
                                                    {' on '}
                                                    <Link
                                                        href={route('posts.edit', comment.post.id)}
                                                        className="hover:text-indigo-600 dark:hover:text-indigo-400"
                                                    >
                                                        {comment.post.title}
                                                    </Link>
                                                </div>
                                            </div>
                                            <StatusBadge status={comment.status} />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        No comments yet
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

interface StatCardProps {
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBg: string;
    link?: string;
    trend?: string;
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor,
    iconBg,
    link,
    trend,
}: StatCardProps) {
    const content = (
        <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {value.toLocaleString()}
                    </p>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className="mt-2 flex items-center text-sm font-medium text-green-600">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            {trend}
                        </div>
                    )}
                </div>
                <div className={`rounded-full p-3 ${iconBg}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
            </div>
            {link && (
                <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye className="h-4 w-4 text-gray-400" />
                </div>
            )}
        </div>
    );

    return link ? <Link href={link}>{content}</Link> : content;
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        published: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };

    const colorClass = colors[status as keyof typeof colors] || colors.draft;

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
            {status}
        </span>
    );
}