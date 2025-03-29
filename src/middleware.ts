import { auth } from "@/../auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

// Don't forget to update src/constants/privateRoutes to hide the menu items
export const config = {
  matcher: ["/encounters/:path*", "/characters/:path*", "/creatures/:path*"],
};
