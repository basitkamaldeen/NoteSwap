import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// server/checkClerkKey.ts (example)
export function ensureClerkKeys() {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  if (!/^pk_(test|live)_[A-Za-z0-9]+$/.test(pk)) {
    throw new Error(
      "Clerk publishable key invalid or missing. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your Clerk publishable key (pk_test_... or pk_live_...)."
    );
  }
}


const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",  // Protect everything under /dashboard
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // protects all pages except static assets
};
