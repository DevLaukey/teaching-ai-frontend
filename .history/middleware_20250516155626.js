// middleware.js
import { NextResponse } from "next/server";

// List of paths that don't require authentication
const publicPaths = [
  "/", // Landing page
  "/auth/login", // Login page
  "/auth/register", // Registration page
  "/auth/forgot-password", // Forgot password page
  "/auth/reset-password", // Reset password page
];

// Function to check if the path is public
const isPublicPath = (path) => {
  return publicPaths.some(
    (publicPath) =>
      path === publicPath ||
      path.startsWith(`${publicPath}/`) ||
      // Handle static files and API routes
      path.startsWith("/_next") ||
      path.startsWith("/api/")
  );
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if a token exists in cookies - use "authToken" (the name used in AuthContext)
  const token = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!token;

  // For debugging - log the authentication status and token (remove in production)
  console.log(
    `Path: ${pathname}, Auth Status: ${isAuthenticated}, Token exists: ${!!token}`
  );

  // Allow access to public paths regardless of authentication status
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    // Add the current path as a redirect parameter after login
    loginUrl.searchParams.set("redirect", encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access to protected routes
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes (API routes will handle their own authentication)
     * 2. /_next (Next.js internal routes)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /robots.txt, etc.
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|robots.txt).*)",
  ],
};
