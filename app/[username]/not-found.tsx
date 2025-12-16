// Not found page for user profiles
import Link from 'next/link';
import { UserX } from 'lucide-react';

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <UserX className="w-20 h-20 text-gray-300 mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        The user profile you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
