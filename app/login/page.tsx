'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Make /login dynamic (no static pre-render)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function LoginInner() {
  const search = useSearchParams();
  const error = search.get('error'); // example use

  return (
    <div className="p-6 max-w-sm mx-auto">
      {error ? (
        <p className="mb-3 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}

      {/* your actual login form here */}
      <form className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full rounded px-3 py-2 bg-pink-500 text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
