import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * OAuth landing page. Clerk's component reads the redirect params and finishes
 * the sign-in (or the sign-up, for a first-time Google user), then forwards on.
 *
 * The callback component renders nothing, so we show a loader in the meantime —
 * otherwise a first-time Google user stares at an empty card while their account
 * is being created.
 */
export default async function SSOCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { flow } = await searchParams;

  const message =
    flow === "sign-up"
      ? "Folding a fresh sheet just for you…"
      : "Pressing the last fold into place…";

  return (
    <>
      <div className="auth-loading" role="status" aria-live="polite">
        <span className="o-spinner" />
        <p className="auth-sub">{message}</p>
      </div>

      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </>
  );
}
