export const signInFlow = 'sign-in'
export const signupFlow = 'sign-up'

export const ADMIN = "admin"

export const PUBLIC_ROUTES = ["/", "/about", "/contact", "/policies",];

/** routes whose whole subtree is public — a published form is answered by strangers,
 *  so /form/<id> must never bounce to sign-in */
export const PUBLIC_ROUTE_PREFIXES = ["/form/"];
export const LOGGED_OUT_ONLY_ROUTES = ["/sign-in", "/sign-up"];
export const LOGGED_IN_ONLY_ROUTES = ["/dashboard", "/error", "/notfound", "/responses"];