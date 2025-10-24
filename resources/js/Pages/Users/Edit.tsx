import { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  roles: string[];
}

interface Props {
  user: UserData;
  roles: Role[];
}

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  email_verified: boolean;
}

export default function Edit({ user, roles }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const { data, setData, put, processing, errors } = useForm<FormData>({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    role: user.roles[0] || 'viewer',
    email_verified: !!user.email_verified_at,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('users.update', user.id));
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit ${user.name}`} />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={route('users.index')}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit User
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Update user information and permissions
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                User's personal and contact information
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Password Change */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Leave blank to keep current password
              </p>
            </div>

            {/* Password Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Password Confirmation */}
              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className={`w-full rounded-lg border ${errors.password_confirmation
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                      } bg-white py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Role & Permissions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Role & Permissions
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Assign a role to define user permissions
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Shield className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  id="role"
                  value={data.role}
                  onChange={(e) => setData('role', e.target.value)}
                  className={`w-full rounded-lg border ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white py-2 pl-10 pr-10 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white`}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.role}
                </p>
              )}

              {/* Role Descriptions */}
              <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                    <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Full access to all features and settings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900/30">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Editor</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Can create and manage content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Viewer</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Read-only access to content
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Verification */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="email_verified"
                checked={data.email_verified}
                onChange={(e) => setData('email_verified', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700"
              />
              <label
                htmlFor="email_verified"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                Mark email as verified
              </label>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3">
              <Link
                href={route('users.index')}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}