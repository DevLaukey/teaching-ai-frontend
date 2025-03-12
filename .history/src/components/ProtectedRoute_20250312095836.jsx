"use client";

import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking auth status
  if (loading) {
    return <LoadingSpinner />;
  }

  // Only render children if authenticated
  return isAuthenticated ? children : null;
}
