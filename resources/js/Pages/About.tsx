import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import {
  SparklesIcon,
  UserGroupIcon,
  LightBulbIcon,
  HeartIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AboutProps {
  auth?: {
    user?: User;
  };
}

export default function About({ auth }: AboutProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Writing',
      description: 'Get intelligent suggestions and improve your content with our AI assistant.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: UserGroupIcon,
      title: 'Vibrant Community',
      description: 'Connect with writers and readers from around the world.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: LightBulbIcon,
      title: 'Creative Freedom',
      description: 'Express yourself without limits. Your stories, your way.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Easy Publishing',
      description: 'Publish your content with just one click. Simple and fast.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: HeartIcon,
      title: 'Built with Love',
      description: 'Designed by writers, for writers. We understand your needs.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safe & Secure',
      description: 'Your data and content are protected with enterprise-grade security.',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const stats = [
    { label: 'Active Writers', value: '10,000+' },
    { label: 'Stories Published', value: '50,000+' },
    { label: 'Monthly Readers', value: '1M+' },
    { label: 'Countries', value: '150+' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Head title="About Us - ContentHub" />

      <Navbar user={auth?.user} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
                About ContentHub
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                We're building the future of content creation. A platform where
                writers can share their stories, connect with readers, and grow
                their audience.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 100 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-xl"
              >
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Mission Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              To empower every writer with the tools and platform they need to share
              their voice with the world. We believe everyone has a story worth telling.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white dark:bg-gray-800 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  ContentHub was born from a simple idea: writing and sharing stories
                  should be easy, enjoyable, and accessible to everyone. We noticed that
                  many content platforms were either too complex, too restrictive, or
                  simply didn't understand what writers needed.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  So we set out to build something different. A platform that combines
                  powerful features with simplicity. Where AI helps you write better, but
                  never takes away your unique voice. Where you own your content and
                  control how it's shared.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Today, ContentHub is home to thousands of writers from over 150 countries,
                  each sharing their unique perspective with the world. And we're just
                  getting started.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center shadow-2xl"
          >
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our community of writers and start sharing your stories today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}