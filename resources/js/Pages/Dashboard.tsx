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
                borderWidth: 1,
            },
        ],
    };

    const monthChartData = {
        labels: postsByMonth.labels,
        datasets: [
            {
                label: 'Posts Created',
                data: postsByMonth.data,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Posts"
                            value={stats.total_posts}
                            subtitle={`${stats.published_posts} published`}
                            link="/posts"
                        />
                        <StatCard
                            title="Categories"
                            value={stats.total_categories}
                            link="/categories"
                        />
                        <StatCard
                            title="Comments"
                            value={stats.total_comments}
                            subtitle={`${stats.pending_comments} pending`}
                            link="/comments"
                        />
                        <StatCard
                            title="Users"
                            value={stats.total_users}
                            link="/users"
                        />
                    </div>

                    {/* Charts */}
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Posts by Status
                                </h3>
                                <Doughnut data={statusChartData} />
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Posts by Month
                                </h3>
                                <Bar data={monthChartData} />
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Recent Posts */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Recent Posts
                                    </h3>
                                    <Link
                                        href="/posts"
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="border-b border-gray-200 pb-3 last:border-0 dark:border-gray-700"
                                        >
                                            <Link
                                                href={`/posts/${post.id}`}
                                                className="font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100"
                                            >
                                                {post.title}
                                            </Link>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                By {post.user.name} •{' '}
                                                {post.category?.name || 'Uncategorized'} •{' '}
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                        post.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {post.status}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Comments */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Recent Comments
                                    </h3>
                                    <Link
                                        href="/comments"
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="border-b border-gray-200 pb-3 last:border-0 dark:border-gray-700"
                                        >
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {comment.content.substring(0, 100)}
                                                {comment.content.length > 100 ? '...' : ''}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                On "{comment.post.title}" •{' '}
                                                {comment.user?.name || 'Guest'} •{' '}
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                        comment.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : comment.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {comment.status}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    link,
}: {
    title: string;
    value: number;
    subtitle?: string;
    link?: string;
}) {
    const content = (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {title}
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {value}
                </p>
                {subtitle && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );

    return link ? <Link href={link}>{content}</Link> : content;
}

