import { NextRequest, NextResponse } from "next/server";
import { ADMIN, PUBLIC_ROUTES, PUBLIC_ROUTE_PREFIXES, LOGGED_IN_ONLY_ROUTES, LOGGED_OUT_ONLY_ROUTES } from "../(auth)/constants";

type handleRouteProps = {
    req: NextRequest;
    userId: string | undefined;
    role: string | undefined;
}

export const handleAuthRouting = ({ req, userId, role }: handleRouteProps) => {
    const currentPath = req.nextUrl.pathname

    const isPublicPath =
        PUBLIC_ROUTES.includes(currentPath) ||
        PUBLIC_ROUTE_PREFIXES.some((prefix) => currentPath.startsWith(prefix));

    if (PUBLIC_ROUTE_PREFIXES.some((prefix) => currentPath.startsWith(prefix))) {
        return NextResponse.next();
    }

    if (!userId) {
        if (isPublicPath || LOGGED_OUT_ONLY_ROUTES.includes(currentPath)) {
            return NextResponse.next();
        }

        // Anything else (logged-in-only routes) sends them to sign-in.
        const signInUrl = new URL('/sign-in', req.url)
        //  Append redirect_url so Clerk returns them here after signing in
        signInUrl.searchParams.set('redirect_url', currentPath);
        return NextResponse.redirect(signInUrl)
    }

    try {
        if (currentPath === "/error" || currentPath === "/notfound") {
            return NextResponse.next();
        }

        const isLoggedOutOnlyRoute = LOGGED_OUT_ONLY_ROUTES.includes(currentPath);


        if (role === ADMIN) {
            if (currentPath === "/dashboard" || PUBLIC_ROUTES.includes(currentPath) || isLoggedOutOnlyRoute) {
                const dashboardUrl = new URL('/admin/dashboard', req.url)
                return NextResponse.redirect(dashboardUrl)
            }
            return NextResponse.next()
        }

        if (currentPath.startsWith("/admin")) {
            const dashboardUrl = new URL('/dashboard', req.url)
            return NextResponse.redirect(dashboardUrl)
        }

        if (isLoggedOutOnlyRoute) {
            const dashboardUrl = new URL('/dashboard', req.url)
            return NextResponse.redirect(dashboardUrl)
        }

        return NextResponse.next()

    } catch (error) {
        console.error("Middleware processing crash:", error);
        return NextResponse.redirect(new URL("/error", req.url));
    }

}