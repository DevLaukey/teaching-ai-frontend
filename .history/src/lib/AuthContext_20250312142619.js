// lib/AuthContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (token) {
          // Set cookie for the middleware to access
          document.cookie = `token=${token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }`; // 7 days

          // You could also validate the token with your backend
          try {
            const response = await fetch(`${backendUrl}/auth/users/me/`, {
              method: "GET",
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              // If token is invalid, clear it
              localStorage.removeItem("token");
              document.cookie =
                "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              setUser(null);
            }
          } catch (error) {
            console.error("Failed to validate token:", error);
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [backendUrl]);

  const login = async (credentials) => {

    console.log("credentials:", credentials);
    try {
      const response = await fetch(`${backendUrl}/auth/token/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        mode: "cors",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.non_field_errors || "Login failed");
      }

      // Store the token
      if (data.auth_token) {
        localStorage.setItem("token", data.auth_token);

        // Set cookie for middleware to detect
        document.cookie = `token=${data.auth_token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`; // 7 days

          // Fetch user data'
          
        try {
          const userResponse = await fetch(`${backendUrl}/profile/`, {
            method: "GET",
            headers: {
              Authorization: `Token ${data.auth_token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }

      // Get the redirect URL from query params or default to dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect") || "/dashboard";
      router.push(decodeURIComponent(redirectPath));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.message || "Failed to login. Please check your credentials.",
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Call backend logout endpoint
        try {
          await fetch(`${backendUrl}/auth/token/logout/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        } catch (error) {
          console.error("Logout API error:", error);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and user data regardless of API response
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      router.push("/auth/login");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
