import { NextResponse, type NextRequest } from "next/server";
import {
  INTAKE_LOCK_COOKIE,
  INTAKE_PORTAL_COOKIE,
  INTAKE_STAFF_UNLOCK_PARAM,
} from "@/lib/intake-lock";

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

function isIntakeLocked(request: NextRequest) {
  return request.cookies.get(INTAKE_LOCK_COOKIE)?.value === "1";
}

function submitRedirect(request: NextRequest) {
  const portal = request.cookies.get(INTAKE_PORTAL_COOKIE)?.value?.trim();
  const url = request.nextUrl.clone();
  url.pathname = "/submit";
  url.search = portal ? `?portal=${encodeURIComponent(portal)}` : "";
  return NextResponse.redirect(url);
}

function isIntakeAllowedPath(pathname: string) {
  return pathname === "/submit" || pathname === "/api/intake";
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Internal team escape hatch — clears intake lock, then continues to login.
  if (
    pathname === "/login" &&
    searchParams.get(INTAKE_STAFF_UNLOCK_PARAM) === "1"
  ) {
    const response = NextResponse.next();
    response.cookies.delete(INTAKE_LOCK_COOKIE);
    response.cookies.delete(INTAKE_PORTAL_COOKIE);
    return response;
  }

  // Client intake visit — lock this browser session to submit-only.
  if (pathname === "/submit") {
    const portal = searchParams.get("portal")?.trim().toLowerCase();
    const response = NextResponse.next();

    if (portal) {
      response.cookies.set(INTAKE_LOCK_COOKIE, "1", COOKIE_OPTIONS);
      response.cookies.set(INTAKE_PORTAL_COOKIE, portal, COOKIE_OPTIONS);
    }

    return response;
  }

  if (!isIntakeLocked(request)) {
    return NextResponse.next();
  }

  // Locked clients stay on intake only (plus the intake API).
  if (isIntakeAllowedPath(pathname)) {
    return NextResponse.next();
  }

  return submitRedirect(request);
}

export const config = {
  // Run on all page/API navigations; skip Next internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.svg|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
