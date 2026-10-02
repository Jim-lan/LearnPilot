import { NextResponse, type NextRequest } from "next/server";
import { checkLocalRequest } from "./server/request-guard";

export function proxy(request: NextRequest) {
  const problem = checkLocalRequest(request.method, request.headers.get("host"), request.headers.get("origin"));
  if (problem) return new NextResponse(problem, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export const config = { matcher: "/:path*" };
