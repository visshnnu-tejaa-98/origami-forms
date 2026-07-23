import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { handleAuthRouting } from './app/middlewares/authRules'


const isAdminRoute = createRouteMatcher(['/admin(.*)'])


export default clerkMiddleware(async (auth, req) => {

    const authDetails = await auth()
    const role = authDetails.sessionClaims?.metadata?.role
    const userId = authDetails.sessionClaims?.sub

    return handleAuthRouting({ req, userId, role })
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
        // Always run for Clerk-specific frontend API routes
        '/__clerk/(.*)',
    ],
}