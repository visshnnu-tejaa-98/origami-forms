/** Google / GitHub sign-in buttons, shared by sign-in and sign-up. */

function GoogleMark() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path fill="#4285F4" d="M19.6 10.23c0-.7-.06-1.4-.18-2.06H10v3.91h5.43c-.23 1.24-.94 2.29-2 3v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.35z" />
      <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.13H1.05v2.59A10 10 0 0 0 10 20z" />
      <path fill="#FBBC04" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.5H1.05a10 10 0 0 0 0 9l3.35-2.6z" />
      <path fill="#EA4335" d="M10 3.97c1.47 0 2.79.5 3.83 1.5L16.7 2.6A10 10 0 0 0 10 0a10 10 0 0 0-8.95 5.5L4.4 8.1c.79-2.37 3-4.13 5.6-4.13z" />
    </svg>
  );
}

export function OAuthRow() {
  return (
    <>
      <div className="oauth-row">
        <button className="oauth-btn" type="button">
          <GoogleMark /> Google
        </button>
      </div>
      <div className="or">or with email</div>
    </>
  );
}
