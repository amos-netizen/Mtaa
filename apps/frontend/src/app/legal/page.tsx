'use client';

import Link from 'next/link';
import { useState } from 'react';

type LegalSection = 'license' | 'terms' | 'privacy';

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState<LegalSection>('license');

  const sections = [
    { id: 'license' as LegalSection, label: 'License', icon: '📜' },
    { id: 'terms' as LegalSection, label: 'Terms of Service', icon: '📋' },
    { id: 'privacy' as LegalSection, label: 'Privacy Policy', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Legal Information</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Terms of Service, Privacy Policy, and License Information
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {activeSection === 'license' && <LicenseContent />}
          {activeSection === 'terms' && <TermsContent />}
          {activeSection === 'privacy' && <PrivacyContent />}
        </div>
      </div>
    </div>
  );
}

function LicenseContent() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Software License</h2>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">MIT License</h3>
          <p className="mb-4">
            Copyright (c) {new Date().getFullYear()} Mtaa Platform
          </p>
          <p className="mb-4">
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p className="mb-4">
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <p className="mb-4">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </section>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Third-Party Licenses</h3>
          <p className="mb-4">
            This application uses the following open-source libraries and frameworks:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Next.js - MIT License</li>
            <li>React - MIT License</li>
            <li>NestJS - MIT License</li>
            <li>Prisma - Apache 2.0 License</li>
            <li>PostgreSQL - PostgreSQL License</li>
            <li>Tailwind CSS - MIT License</li>
            <li>TypeScript - Apache 2.0 License</li>
          </ul>
        </section>

        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Content License</h3>
          <p className="mb-4">
            User-generated content on Mtaa remains the property of the respective users.
            By posting content on Mtaa, users grant Mtaa a non-exclusive, worldwide,
            royalty-free license to use, display, and distribute their content within
            the platform.
          </p>
        </section>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h2>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mb-4">
            Welcome to Mtaa. By accessing or using our platform, you agree to be bound by
            these Terms of Service. Please read them carefully.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By creating an account, accessing, or using Mtaa, you agree to comply with and
            be bound by these Terms of Service. If you do not agree, please do not use our service.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. User Accounts</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>You must be at least 18 years old to use Mtaa</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must provide accurate and complete information</li>
            <li>One person or entity may maintain only one account</li>
            <li>You are responsible for all activities under your account</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. User Conduct</h3>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Post false, misleading, or fraudulent information</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Spam or send unsolicited communications</li>
            <li>Interfere with the platform's operation</li>
            <li>Use automated systems to access the platform without permission</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Content and Intellectual Property</h3>
          <p className="mb-4">
            You retain ownership of content you post on Mtaa. By posting, you grant Mtaa
            a license to use, display, and distribute your content. You are responsible
            for ensuring you have the right to post any content you share.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Marketplace Transactions</h3>
          <p className="mb-4">
            Mtaa facilitates connections between buyers and sellers but is not a party to
            transactions. Users are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Verifying the accuracy of listings</li>
            <li>Conducting transactions safely</li>
            <li>Resolving disputes directly</li>
            <li>Complying with local laws and regulations</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Safety Alerts</h3>
          <p className="mb-4">
            Safety alerts are user-generated and should be verified. Mtaa does not guarantee
            the accuracy of safety alerts. For emergencies, always contact official authorities
            (999 or 112 in Kenya).
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Termination</h3>
          <p className="mb-4">
            We reserve the right to suspend or terminate accounts that violate these terms.
            You may delete your account at any time through your settings.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Limitation of Liability</h3>
          <p className="mb-4">
            Mtaa is provided "as is" without warranties. We are not liable for any damages
            arising from your use of the platform, including but not limited to transactions,
            interactions with other users, or reliance on user-generated content.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Changes to Terms</h3>
          <p className="mb-4">
            We may update these terms from time to time. Continued use of Mtaa after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10. Contact</h3>
          <p className="mb-4">
            For questions about these terms, please contact us through the platform or at
            support@mtaa.com
          </p>
        </section>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h2>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mb-4">
            At Mtaa, we are committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, and safeguard your information.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h3>
          <p className="mb-3">We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Account Information:</strong> Name, email, phone number, username</li>
            <li><strong>Profile Information:</strong> Bio, profile picture, address, location</li>
            <li><strong>Content:</strong> Posts, messages, listings, reviews you create</li>
            <li><strong>Location Data:</strong> Your location when using location-based features</li>
            <li><strong>Usage Data:</strong> How you interact with the platform</li>
            <li><strong>Device Information:</strong> Device type, browser, IP address</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h3>
          <p className="mb-3">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Provide and improve our services</li>
            <li>Connect you with your neighborhood</li>
            <li>Show you relevant content and services</li>
            <li>Send you notifications and updates</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Information Sharing</h3>
          <p className="mb-4">
            We do not sell your personal information. We may share information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>With other users as part of the platform's functionality</li>
            <li>With service providers who help us operate the platform</li>
            <li>When required by law or to protect rights and safety</li>
            <li>With your consent</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Location Data</h3>
          <p className="mb-4">
            We collect location data to provide location-based features like nearby search.
            You can control location sharing in your device settings. Location data is used
            to show you relevant neighborhood content and is not shared with third parties
            except as necessary to provide the service.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Data Security</h3>
          <p className="mb-4">
            We implement industry-standard security measures to protect your information,
            including encryption, secure servers, and access controls. However, no system is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Your Rights</h3>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Access your personal information</li>
            <li>Update or correct your information</li>
            <li>Delete your account and data</li>
            <li>Opt-out of certain communications</li>
            <li>Request data export</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Cookies and Tracking</h3>
          <p className="mb-4">
            We use cookies and similar technologies to improve your experience, analyze usage,
            and provide personalized content. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Children's Privacy</h3>
          <p className="mb-4">
            Mtaa is not intended for users under 18 years of age. We do not knowingly collect
            information from children.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. International Users</h3>
          <p className="mb-4">
            If you are using Mtaa from outside Kenya, please note that your information may be
            transferred to and processed in Kenya, where our servers are located.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10. Changes to Privacy Policy</h3>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">11. Contact Us</h3>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@mtaa.com
            <br />
            Address: Mtaa Platform, Nairobi, Kenya
          </p>
        </section>
      </div>
    </div>
  );
}

