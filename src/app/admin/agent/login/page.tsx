'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, [router]);
  return (
    <div className="min-h-screen bg-[#0f1e3d] flex items-center justify-center text-white text-sm">
      Redirecting…
    </div>
  );
}
