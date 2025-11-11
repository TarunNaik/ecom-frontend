import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Welcome to Our Store
            </h1>
            <p className="text-lg text-gray-600">
              Your one-stop shop for everything you need
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-10">
            <Link
              href="/login"
              className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Create Account
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Join thousands of happy customers shopping with us
          </p>
        </div>
      </main>
    </div>
  );
}
