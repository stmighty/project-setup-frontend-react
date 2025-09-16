"use client";

import { useRouter } from "next/navigation";
import useUser from "@/hooks/use-user";
import { signInWithGoogle, signOut } from "@/lib/firebase-auth";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
    router.refresh();
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderAvatar = () => {
    const name = user?.displayName || user?.email || "";
    const firstChar = name.charAt(0).toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={toggleDropdown}
          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer"
        >
          {firstChar}
        </div>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="fixed top-0 left-0 right-0 z-40 w-full flex justify-end items-center p-4 border-b bg-white shadow-sm h-16" // Explicitly set h-16
      >
        {isLoading ? null : user ? (
          renderAvatar()
        ) : (
          <Button onClick={handleLogin} variant="outline">
            Login
          </Button>
        )}
      </header>
      <main className="flex-1 pt-16"> {/* Padding top to match header height h-16 */}
        {children}
      </main>
    </div>
  );
}
