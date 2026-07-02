import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

export const { auth: middlewareAuth } = NextAuth(authConfig);

export default middlewareAuth((request) => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = Boolean(request.auth);
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPage =
    pathname.startsWith("/analyze") || pathname.startsWith("/results");
  const isAnalyzeApi = pathname.startsWith("/api/analyze");

  if ((isProtectedPage || isAnalyzeApi) && !isLoggedIn) {
    if (isAnalyzeApi) {
      return Response.json(
        { error: "Please log in to analyze code.", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/analyze", request.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/analyze/:path*",
    "/results/:path*",
    "/api/analyze",
    "/login",
    "/signup",
  ],
};
