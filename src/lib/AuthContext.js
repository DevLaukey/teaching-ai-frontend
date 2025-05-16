"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Install with: npm install js-cookie

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Helper function to set auth token in cookies
  const setAuthToken = (token) => {
    if (token) {
      // Set in js-cookie (for client-side usage)
      Cookies.set("authToken", token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
    } else {
      // Remove token when called with null/undefined
      Cookies.remove("authToken");
    }
  };

  // Helper function to get auth token from cookies
  const getAuthToken = () => {
    return Cookies.get("authToken");
  };

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const checkAuth = async () => {
      try {
        // Get token from cookie
        const token = getAuthToken();

        if (token) {
          // You could also validate the token with your backend
          try {
            const response = await fetch(`${backendUrl}/auth/profile/`, {
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
              setAuthToken(null);
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
    try {
      const response = await fetch(`${backendUrl}/auth/token/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        mode: "cors",
        credentials: "include", // Important for cookies in cross-origin requests
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.non_field_errors || "Login failed");
      }

      // Store the token in cookie
      if (data.auth_token) {
        setAuthToken(data.auth_token);

        // Fetch user data
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
      const token = getAuthToken();

      if (token) {
        // Call backend logout endpoint
        try {
          await fetch(`${backendUrl}/auth/token/logout/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
            credentials: "include",
          });
        } catch (error) {
          console.error("Logout API error:", error);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and user data regardless of API response
      setAuthToken(null);
      setUser(null);
      router.push("/auth/login");
    }
  };

  // Registration can be handled with the login flow
  const register = async (userData) => {
    try {
      const response = await fetch(`${backendUrl}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        mode: "cors",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Extract error messages from the response
        const errorMsg = Object.values(data).flat().join(", ");
        throw new Error(errorMsg || "Registration failed");
      }

      // Login after successful registration
      return login({
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "Failed to register. Please try again.",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
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
