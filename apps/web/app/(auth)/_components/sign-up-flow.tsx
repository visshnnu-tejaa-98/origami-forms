"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";
import { OAuthRow } from "./oauth-row";
import { VerifyCode } from "./verify-code";
import { useForm } from "react-hook-form";
import { SignInFormInputType } from "../validators";
import { useSignInOrUp } from "~/hooks/use-signin";

export function SignUpFlow() {
  const [code, setCode] = useState("");

  const {
    otpVerifying,
    formError,
    isSignUpLoading,
    setOtpVerifying,
    signUpWithEmail,
    verifyOtp,
    resendOtp,
    clearFormError,
  } = useSignInOrUp();

  const { register, handleSubmit, getValues, watch } = useForm<SignInFormInputType>({
    defaultValues: { email: "" },
  });

  const enableButton = !!watch("email");

  if (otpVerifying) {
    return (
      <VerifyCode
        email={getValues("email")}
        code={code}
        loginMode={"sign-up"}
        formError={formError}
        setCode={setCode}
        onBack={() => {
          setOtpVerifying(false);
        }}
        onVerify={(code: string) => verifyOtp(code)}
        onResend={() => resendOtp()}
        clearFormError={clearFormError}
      />
    );
  }

  return (
    <div>
      <h2 className="auth-title">Start folding.</h2>
      <p className="auth-sub">Three forms free, no card needed.</p>

      <OAuthRow flow="sign-up" />

      <form className="form-stack" onSubmit={handleSubmit((data) => signUpWithEmail(data))}>
        <div className="o-field">
          <label className="o-field-label" htmlFor="email">
            Email
          </label>
          <input
            className="o-input"
            type="text"
            placeholder="you@studio.dev"
            {...register("email")}
          />
        </div>

        {/* <label className="o-check">
          <input type="checkbox" name="newsletter" defaultChecked />
          <span className="box" /> I&apos;d like the gentle monthly notebook.
        </label> */}


        {formError ? (
          <p className="text-[var(--accent-deep)] text-xs font-semibold py-1">{formError}</p>
        ) : (
          <p className="text-[var(--accent-deep)] text-xs font-semibold py-1 text-transparent">
            Test error
          </p>
        )}

        <button
          className="o-btn o-btn--accent o-btn--lg o-btn--block"
          type="submit"
          disabled={!enableButton || isSignUpLoading}
        >
          {isSignUpLoading ? (
            <>
              <span className="o-spinner" /> Sending code…
            </>
          ) : (
            <>
              <Icon name="sparkles" size={18} /> Create account
              <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-foot">
        By signing up you agree to our <Link href="/terms">terms</Link> &amp;{" "}
        <Link href="/privacy">privacy</Link>.
      </div>
    </div>
  );
}
