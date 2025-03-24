import { auth } from "@/../auth";

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

// Don't forget to update src/constants/privateRoutes to hide the menu items
export const config = {
  matcher: ["/encounters/:path*", "/characters/:path*"],
};
