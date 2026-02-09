import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Lidar com requisições OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 200 });
    res.headers.set("Access-Control-Allow-Origin", req.headers.get("origin") || "*");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400"); // 24 horas
    return res;
  }

  if (req.nextUrl.pathname.startsWith("/api")) {
    const res = NextResponse.next();
    
    // Usar a origem específica em vez de "*" quando usar credentials
    const origin = req.headers.get("origin");
    if (origin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }
    
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};