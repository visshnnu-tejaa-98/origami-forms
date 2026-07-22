"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";
import { OAuthRow } from "./oauth-row";
import { VerifyCode } from "./verify-code";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form"
import { signInFormInput, SignInFormInputType } from "../validators";
import { validateForm } from "../utils";
import { toast } from "~/components/origami/toast";

export function SignInFlow() {
  const [code, setCode] = useState("")
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showMissingRequirements, setShowMissingRequirements] = useState(false)
  const [formError, setFormError] = useState("")

  const { signIn, errors: signInError, fetchStatus } = useSignIn()
  const { signUp } = useSignUp()

  const router = useRouter()


  const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm<SignInFormInputType>({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const enableSignInButton = !!(watch("email") && watch("password"))


  const handleSignIn = async (data: SignInFormInputType) => {

    setFormError("")

    const { error, data: parsedData } = await validateForm({ schema: signInFormInput, input: data })

    if (error) {
      setFormError(error)
      toast.info("Couldn't sign you in", {
        title: "Error",
      })
      return
    }

    if (!parsedData) {
      setFormError("Form data processing failed.");
      return;
    }

    const { email, password } = parsedData

    const { error: createError } = await signIn.create({
      identifier: email,
      signUpIfMissing: true,
    })

    if (createError) {
      console.error(JSON.stringify(createError, null, 2))
      toast.error("Couldn't sign you in", {
        title: "Error",
      })
      return
    }

  };

  if (isVerificationPending) {
    const email = getValues("email")
    return (
      <VerifyCode
        email={email}
        code={code}
        setCode={setCode}
        onBack={() => setIsVerificationPending(false)}
        onVerify={async () => {
          // TODO: verify the code and redirect into the studio.
        }}
        onResend={async () => {
          // TODO: re-send the email code.
        }}
      />
    );
  }

  return (
    <div>
      <h2 className="auth-title">Welcome back.</h2>
      <p className="auth-sub">Pick up where you left your pen.</p>

      <OAuthRow />

      <form className="form-stack" onSubmit={handleSubmit(handleSignIn)}>
        <div className="o-field">
          <label className="o-field-label" htmlFor="email">Email</label>
          <input
            className="o-input"
            type="email"
            placeholder="you@studio.dev"
            {...register("email")}
          />
        </div>

        <div className="o-field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="o-field-label" htmlFor="password">Password</label>
            <Link className="forgot-link" href="/forgot">forgot?</Link>
          </div>
          <input
            className="o-input"
            type="password"
            placeholder="at least 8 characters"
            {...register("password")}
          />
        </div>

        {formError && <p className="text-[var(--accent-deep)] text-xs font-semibold py-2">{formError}</p>}
        <button className="o-btn o-btn--accent o-btn--lg o-btn--block" type="submit" disabled={!enableSignInButton || isSendingCode}>
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
    </div>
  );
}
