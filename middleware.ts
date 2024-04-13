import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  afterAuth: (auth, req, evt) => {
    if (auth.userId && auth.isPublicRoute) {
      const dashboard = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboard);
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
