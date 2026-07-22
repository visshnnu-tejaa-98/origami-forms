import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * OAuth landing page. Clerk's component reads the redirect params and finishes
 * the sign-in (or the sign-up, for a first-time Google user), then forwards on.
 */
export default function SSOCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    />
  );
}
