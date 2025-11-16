import { auth } from "@/../auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/encounters/:path*",
    "/characters/:path*",
    "/spells/:path*",
    "/creatures/:path*",
    "/dm-screen",
  ],
};
