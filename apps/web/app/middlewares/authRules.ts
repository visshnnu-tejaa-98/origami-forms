import { NextRequest, NextResponse } from "next/server";
import { ADMIN, ALLOWED_PUBLIC_ROUTES } from "../(auth)/constants";

type handleRouteProps = {
    req: NextRequest;
    userId: string | undefined;
    role: string | undefined;
}

export const handleAuthRouting = ({ req, userId, role }: handleRouteProps) => {
    const currentPath = req.nextUrl.pathname

    // redirect user to sign-in page if he tries to access the private routes
    if (!userId) {
        if (!ALLOWED_PUBLIC_ROUTES.includes(currentPath)) {
            const signInUrl = new URL('/sign-in', req.url)
            return NextResponse.redirect(signInUrl)
        }
        return NextResponse.next()
    }

    try {
        // redirect user to /admin/dashboard if he is admin and tries to access the public routes
        if (role === ADMIN) {
            if (currentPath === "/dashboard" || ALLOWED_PUBLIC_ROUTES.includes(currentPath)) {
                const dashboardUrl = new URL('/admin/dashboard', req.url)
                return NextResponse.redirect(dashboardUrl)
            }
            return NextResponse.next()
        }

        // redirect user to /dashboard if he is subscriber or standard user and tries to access the public routes
        if (ALLOWED_PUBLIC_ROUTES.includes(currentPath)) {
            const dashboardUrl = new URL('/dashboard', req.url)
            return NextResponse.redirect(dashboardUrl)
        }

        // redirect user to /dashboard if he is subscriber or standard user and tries to access the admin routes
        if (currentPath.startsWith("/admin")) {
            const dashboardUrl = new URL('/dashboard', req.url)
            return NextResponse.redirect(dashboardUrl)
        }

        return NextResponse.next()

    } catch (error) {
        console.error("Middleware processing crash:", error);
        return NextResponse.redirect(new URL("/error", req.url));
    }

}