'use client';

import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard/buyer" className="text-sm text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Contact Support</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Get in Touch</h2>
              <p className="text-gray-600 mt-1">If you have any questions or need help with your account, please don't hesitate to contact us. We're here to help!</p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Support */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-700">Email Us</h3>
                <p className="text-gray-600 mt-2">For general inquiries, account assistance, or order questions.</p>
                <a href="mailto:support@example.com" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">
                  support@example.com
                </a>
              </div>

              {/* Phone Support */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-700">Call Us</h3>
                <p className="text-gray-600 mt-2">Speak directly with a support agent for urgent issues.</p>
                <a href="tel:+18005550199" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">
                  +1 (800) 555-0199
                </a>
              </div>
            </div>

            {/* Mailing Address */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-700">Mailing Address</h3>
              <p className="text-gray-600 mt-2">For official correspondence, you can reach us by mail at:</p>
              <address className="mt-4 not-italic text-gray-800">
                123 Support Lane<br />
                Tech City, 54321<br />
                USA
              </address>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
