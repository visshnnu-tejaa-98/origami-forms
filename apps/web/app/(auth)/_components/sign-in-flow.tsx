"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";
import { OAuthRow } from "./oauth-row";
import { VerifyCode } from "./verify-code";
import { useForm } from "react-hook-form";
import { SignInFormInputType } from "../validators";

import { useSignInOrUp } from "~/hooks/use-signin";

export function SignInFlow() {
  const [code, setCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const {
    otpVerifying,
    formError,
    signInWithEmailAndPasswordWithOTPVerification,
    setOtpVerifying,
    verifyOtp,
    resendOtp,
  } = useSignInOrUp();

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignInFormInputType>({
    defaultValues: {
      email: "",
    },
  });

  const enableSignInButton = !!watch("email");

  if (otpVerifying) {
    const email = getValues("email");
    return (
      <VerifyCode
        email={email}
        code={code}
        setCode={setCode}
        onBack={() => {
          setOtpVerifying(false);
        }}
        onVerify={(code: string) => verifyOtp(code)}
        onResend={resendOtp}
      />
    );
  }

  return (
    <div>
      <h2 className="auth-title">Welcome back.</h2>
      <p className="auth-sub">Pick up where you left your pen.</p>

      <OAuthRow />

      <form
        className="form-stack"
        onSubmit={handleSubmit((formData) =>
          signInWithEmailAndPasswordWithOTPVerification(formData),
        )}
      >
        <div className="o-field">
          <label className="o-field-label" htmlFor="email">
            Email
          </label>
          <input
            className="o-input"
            type="email"
            placeholder="you@studio.dev"
            {...register("email")}
          />
        </div>

        {formError && (
          <p className="text-[var(--accent-deep)] text-xs font-semibold py-2">{formError}</p>
        )}
        <button
          className="o-btn o-btn--accent o-btn--lg o-btn--block"
          type="submit"
          disabled={!enableSignInButton || isSendingCode}
        >
          {isSendingCode ? (
            <>
              <span className="o-spinner" /> Sending code…
            </>
          ) : (
            <>
              Sign in
              <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-foot">
        New here? <Link href="/sign-up">Fold your first form →</Link>
      </div>
      <div id="clerk-captcha" className="my-2" />
    </div>
  );
}
