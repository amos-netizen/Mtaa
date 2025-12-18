'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About MTAA</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* What is MTAA? */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is MTAA?</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            MTAA is your neighborhood's digital community center. It's a platform designed specifically for people who live in the same area to connect, help each other, and build stronger local communities.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Think of MTAA as your local notice board, marketplace, job board, and community chat—all in one place. Unlike social media platforms where you connect with people from all over the world, MTAA focuses on <strong>your neighborhood</strong> and the people who live nearby.
          </p>
        </section>

        {/* Why MTAA Exists */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why MTAA Exists</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            In today's fast-paced world, many of us don't know our neighbors. We pass each other on the street without recognizing familiar faces. MTAA exists to change that.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Our mission is simple: <strong>strengthen local communities and local economies</strong>. We believe that when neighbors know each other, trust each other, and support each other, everyone benefits.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            MTAA helps you:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4 ml-4">
            <li>Build real relationships with people in your area</li>
            <li>Support local businesses and service providers</li>
            <li>Keep your neighborhood safe and informed</li>
            <li>Find opportunities and help within your community</li>
            <li>Create a stronger, more connected neighborhood</li>
          </ul>
        </section>

        {/* What You Can Do on MTAA */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What You Can Do on MTAA</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">🛒 Buy and Sell Locally</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                List items you no longer need or find great deals from neighbors. From furniture and electronics to clothing and books, buy and sell within your neighborhood. No shipping needed—just meet up locally.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">💼 Find and Post Jobs</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Looking for work? Post your skills and find opportunities nearby. Need help with a project? Post a job and hire from your local community. Support local employment and keep money in your neighborhood.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">🔧 Offer and Hire Services</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Are you a plumber, electrician, cleaner, tutor, or offer any service? List your services on MTAA. Need something fixed or done? Find trusted local professionals. Build relationships with service providers you can trust.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">🚨 Post Emergency Alerts</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Keep your neighborhood safe and informed. Report security concerns, missing persons, accidents, fires, or power outages. Share important information that helps everyone stay safe. Emergency alerts are always visible and prioritized.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">💬 Chat and Connect</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Message sellers, employers, service providers, or neighbors directly. Have conversations, ask questions, and build relationships—all within your local community.
              </p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">📢 Share Community News</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Post announcements, ask questions, share recommendations, or start discussions. Keep your neighborhood informed about local events, issues, and opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Safety & Community Values */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Safety & Community Values</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Trust and safety are at the heart of MTAA. We're not just another platform—we're your neighborhood's trusted space.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">✓ Verified Users</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                We verify phone numbers and offer ID verification for trusted members. Look for verification badges to know you're dealing with real, verified neighbors.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">🛡️ Community Moderation</h3>
              <p className="text-sm text-green-800 dark:text-green-300">
                Our community helps keep MTAA safe. Report inappropriate content, and our team reviews every report. We take safety seriously.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">⭐ Ratings & Reviews</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Rate sellers, employers, and service providers. Read reviews from other neighbors. Build trust through real experiences shared by your community.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">🚨 Emergency Priority</h3>
              <p className="text-sm text-red-800 dark:text-red-300">
                Safety alerts are always prioritized and visible. When someone posts an emergency, it's immediately shown to everyone in the area. Your safety comes first.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Remember:</strong> Always meet in public places for transactions, verify identities, and trust your instincts. If something feels wrong, report it. We're here to help keep your community safe.
            </p>
          </div>
        </section>

        {/* Who MTAA Is For */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Who MTAA Is For</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            MTAA is for <strong>everyone</strong> who wants to be part of a stronger, more connected neighborhood:
          </p>
          
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 text-xl">🏠</span>
              <div>
                <strong>Homeowners and Renters</strong> - Connect with neighbors, find local services, and stay informed about your area
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 text-xl">💼</span>
              <div>
                <strong>Job Seekers and Employers</strong> - Find work opportunities or hire local talent
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 text-xl">🔧</span>
              <div>
                <strong>Service Providers</strong> - Plumbers, electricians, cleaners, tutors, and anyone offering services can find clients in their area
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 text-xl">🛒</span>
              <div>
                <strong>Buyers and Sellers</strong> - Buy and sell items locally without shipping hassles
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 text-xl">👨‍👩‍👧‍👦</span>
              <div>
                <strong>Families</strong> - Find trusted local services, stay safe, and connect with other families nearby
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 text-xl">🏢</span>
              <div>
                <strong>Local Businesses</strong> - Reach customers in your neighborhood and build local relationships
              </div>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="text-primary-900 dark:text-primary-200 font-medium">
              MTAA is designed for <strong>neighborhood-level interaction</strong>, not strangers from far away. Every user is connected to specific neighborhoods, ensuring you're interacting with people who are actually nearby.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We envision a future where every neighborhood in Kenya is connected, safe, and thriving. Where neighbors know each other by name, support local businesses, and look out for one another.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            MTAA isn't just an app—it's a movement toward stronger communities. We believe that when people connect locally, amazing things happen:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Stronger Local Economies</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Money stays in the neighborhood, supporting local businesses and creating local jobs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Safer Neighborhoods</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  When neighbors know each other, they look out for each other
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Real Relationships</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Build genuine connections with people you'll actually see in your daily life
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Sustainable Communities</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Reduce waste through local buying and selling, support local services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join Your Neighborhood on MTAA</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Start connecting with your neighbors today. Whether you're looking to buy, sell, find work, offer services, or just stay informed, MTAA is here to help you build a stronger community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors font-semibold"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

