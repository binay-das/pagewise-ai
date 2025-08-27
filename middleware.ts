import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const pathName = req.nextUrl.pathname;

    const protectedRoutes = ["/documents"];
    const authRoutes = ["/signin", "/signup"];

    if (!token && protectedRoutes.some(route => pathName.startsWith(route))) {
        const signInUrl = new URL("/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", pathName);
        return NextResponse.redirect(signInUrl);
    }

    if (token && authRoutes.some(route => pathName.startsWith(route))) {
        return NextResponse.redirect(new URL("/documents", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/documents/:path*",
        "/signin",
        "/signup"
    ]
}