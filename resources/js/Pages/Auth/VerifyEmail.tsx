import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-md w-full">
                    {/* Card Container */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                        {/* Icon and Header */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-extrabold text-gray-900">
                                Verify your email
                            </h2>
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just sent you.
                            </p>
                        </div>

                        {/* Success Status Message */}
                        {status === 'verification-link-sent' && (
                            <div className="p-4 rounded-lg bg-green-50 border border-green-200 animate-fade-in">
                                <div className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-green-800">
                                            Verification link sent!
                                        </p>
                                        <p className="text-xs text-green-700 mt-1">
                                            A new verification link has been sent to your email address.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Check your inbox
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700 space-y-1">
                                        <p>• Look for an email from us</p>
                                        <p>• Click the verification link</p>
                                        <p>• Check spam if you don't see it</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-4">
                            <div className="text-center text-sm text-gray-600">
                                Didn't receive the email?
                            </div>

                            {/* Resend Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Resend verification email
                                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Log out
                        </Link>

                        {/* Help Text */}
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                                Having trouble? Make sure to check your spam folder or contact support.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Need help? Contact{' '}
                            <a href="mailto:support@example.com" className="font-medium text-indigo-600 hover:text-indigo-500">
                                support@example.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}