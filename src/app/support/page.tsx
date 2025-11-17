'use client';

import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Contact Support</h1>
          <Link href="/dashboard/buyer">
            <span className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
              ← Back to Dashboard
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">How can we help you?</h2>
          <p className="text-center text-gray-600 mb-10">
            Our support team is here to assist you with any questions or issues you may have.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Email Support */}
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow transform hover:-translate-y-1">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@example.com" className="font-semibold text-indigo-600 hover:underline">
                support@example.com
              </a>
            </div>

            {/* Phone Support */}
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow transform hover:-translate-y-1">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Speak with a support agent directly during business hours.</p>
              <a href="tel:+1234567890" className="font-semibold text-indigo-600 hover:underline">
                +1 (234) 567-890
              </a>
            </div>

            {/* Live Chat */}
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow transform hover:-translate-y-1">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our team in real-time for immediate assistance.</p>
              <button className="font-semibold text-indigo-600 hover:underline">
                Start Chat
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 text-center">
             <h3 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
             <p className="text-gray-600 mb-6">Find answers to common questions in our comprehensive FAQ section.</p>
            <Link href="/faq">
              <span className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer text-lg font-semibold">
                Visit FAQ Page
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
