import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
  Sparkles,
  Zap,
  Shield,
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  ArrowRight,
  Check,
  Star,
} from 'lucide-react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const numericValue = parseInt(value.replace(/\D/g, ''));
    if (isNaN(numericValue)) return;

    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
    >
      {count.toLocaleString()}{value.includes('+') ? '+' : ''}{suffix}
    </motion.div>
  );
}

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description: 'Generate and improve content with cutting-edge AI assistance. Write faster, better, and smarter.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FileText,
      title: 'Rich Content Editor',
      description: 'Create beautiful content with our intuitive WYSIWYG editor. Support for markdown, images, and more.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with role-based permissions and real-time collaboration features.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your content performance with detailed analytics and insights at a glance.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: MessageSquare,
      title: 'Comment Management',
      description: 'Moderate and engage with your audience through a powerful comment management system.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: ImageIcon,
      title: 'Media Library',
      description: 'Organize and manage your media assets with an intuitive media library and CDN support.',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds and get instant access to your dashboard.',
    },
    {
      number: '02',
      title: 'Set Up Your Site',
      description: 'Customize your site settings, branding, and preferences.',
    },
    {
      number: '03',
      title: 'Start Creating',
      description: 'Write, edit, and publish content with AI-powered assistance.',
    },
    {
      number: '04',
      title: 'Grow Your Audience',
      description: 'Track analytics, engage with comments, and optimize your content.',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for personal blogs and small projects',
      features: [
        'Up to 10 posts',
        'Basic analytics',
        'Comment moderation',
        'Media library (1GB)',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Ideal for professional bloggers and businesses',
      features: [
        'Unlimited posts',
        'Advanced analytics',
        'AI content generation',
        'Media library (50GB)',
        'Priority support',
        'Custom branding',
        'Team collaboration',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large teams and organizations',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Advanced security',
        'Custom workflows',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const testimonials = [
    {
      content: 'MiniCMS transformed how we manage our content. The AI features save us hours every week!',
      author: 'Sarah Johnson',
      role: 'Content Manager',
      rating: 5,
    },
    {
      content: 'The best CMS I\'ve used. Clean interface, powerful features, and excellent support.',
      author: 'Michael Chen',
      role: 'Tech Blogger',
      rating: 5,
    },
    {
      content: 'Collaboration features are outstanding. Our team is more productive than ever.',
      author: 'Emily Rodriguez',
      role: 'Marketing Director',
      rating: 5,
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '100K+', label: 'Posts Created' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <GuestLayout>
      <Head title="Welcome to MiniCMS" />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y, opacity }}
        >
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 transform"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-indigo-600/30 to-purple-600/30 blur-3xl" />
          </motion.div>
        </motion.div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="mb-8 inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
              </motion.div>
              AI-Powered Content Management
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
            >
              Create, Manage, and{' '}
              <motion.span
                className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Publish
              </motion.span>{' '}
              with Ease
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl"
            >
              The modern content management system that combines powerful features with AI assistance to help you create amazing content faster than ever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  Get Started Free
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-colors hover:border-indigo-600 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                >
                  Learn More
                </a>
              </motion.div>
            </motion.div>

            {/* Stats with animated counters */}
            <motion.div
              variants={staggerContainer}
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInScale}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="rounded-2xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-800/50"
                >
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Scroll Animations */}
      <FeaturesSection features={features} />

      {/* How It Works Section */}
      <HowItWorksSection steps={steps} />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Pricing Section */}
      <PricingSection plans={plans} />

      {/* Final CTA Section */}
      <CTASection />
    </GuestLayout>
  );
}

// Features Section Component
function FeaturesSection({ features }: { features: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features" className="scroll-mt-16 bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Powerful features designed to help you create, manage, and grow your content effortlessly.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 }
              }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <motion.div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>

              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 transition-opacity group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// How It Works Section Component
function HowItWorksSection({ steps }: { steps: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" className="scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Get started in minutes with our simple 4-step process.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-indigo-600 to-purple-600 lg:block"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              )}

              <motion.div
                className="relative rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
                whileHover={{
                  y: -10,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Step Number */}
                <motion.div
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl font-bold text-white shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.number}
                </motion.div>

                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section Component
function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Loved by Content Creators
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            See what our users have to say about MiniCMS.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInScale}
              whileHover={{
                y: -10,
                scale: 1.03,
                transition: { type: 'spring', stiffness: 300 }
              }}
              className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Stars */}
              <motion.div
                className="mb-4 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: index * 0.1 + i * 0.1,
                      type: 'spring',
                      stiffness: 200
                    }}
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>

              <p className="mb-6 text-gray-600 dark:text-gray-400">{testimonial.content}</p>

              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Pricing Section Component
function PricingSection({ plans }: { plans: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="pricing" className="scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{
                y: -15,
                scale: plan.popular ? 1.05 : 1.03,
                transition: { type: 'spring', stiffness: 300 }
              }}
              className={`relative overflow-hidden rounded-2xl border bg-white p-8 dark:bg-gray-800 ${plan.popular
                ? 'border-indigo-600 shadow-2xl ring-2 ring-indigo-600 dark:border-indigo-500'
                : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute right-8 top-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                >
                  Most Popular
                </motion.div>
              )}

              {/* Plan Details */}
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <motion.span
                    className="text-5xl font-extrabold text-gray-900 dark:text-white"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                  >
                    {plan.price}
                  </motion.span>
                  {plan.period && (
                    <span className="ml-1 text-xl text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature: string, featureIndex: number) => (
                  <motion.li
                    key={featureIndex}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: featureIndex * 0.05 }}
                  >
                    <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className={`block w-full rounded-lg px-6 py-3 text-center font-semibold transition-all ${plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'border-2 border-gray-300 bg-white text-gray-900 hover:border-indigo-600 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500'
                    }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-20 sm:px-6 lg:px-8">
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <div className="absolute h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTAgMGgxMnYxMkgwVjB6bTI0IDI0aDE4djE4SDI0VjI0eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </motion.div>

      <motion.div
        className="relative mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Ready to Transform Your Content?
        </motion.h2>
        <motion.p
          className="mb-10 text-xl text-indigo-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Join thousands of content creators who are already using MiniCMS to create amazing content.
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="group inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-lg transition-shadow hover:shadow-xl"
            >
              Start Your Free Trial
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white hover:text-indigo-600"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}