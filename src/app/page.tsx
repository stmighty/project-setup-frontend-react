"use client";

import Image from "next/image";
import useUser from "@/hooks/use-user";

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <main className="p-24">Loading...</main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Landing Page</h1>
      {user ? (
        <div className="text-center space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
        </div>
      ) : (
        <p>Please login to view your information.</p>
      )}
    </main>
  );
}
