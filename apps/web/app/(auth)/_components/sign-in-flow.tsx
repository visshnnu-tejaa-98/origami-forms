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
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export function SignInFlow() {
  const [code, setCode] = useState("")
  const [verifying, setVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [formError, setFormError] = useState("")
  const [showMissingRequirements, setShowMissingRequirements] = useState(false)


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
    setVerifying(true)

    const { error, data: parsedData } = await validateForm({ schema: signInFormInput, input: data })

    if (error) {
      setFormError(error)
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
      return
    }

    if (!createError) {

      const { error: sendError } = await signIn.emailCode.sendCode()
      if (sendError) {
        console.error(JSON.stringify(sendError, null, 2))
        setVerifying(false)
        return
      }

      setVerifying(true)
    }

  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();

    const { error } = await signIn.emailCode.verifyCode({ code })

    // When the user doesn't exist, verifyCode returns an error with
    // the code 'sign_up_if_missing_transfer'. Check for this error
    // to determine if we need to transfer to sign-up.
    if (error) {
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0]?.code === 'sign_up_if_missing_transfer') {
          // The user doesn't exist - transfer to sign-up
          await handleTransferToSignUp()
          return
        }
      }

      // Some other error occurred
      console.error(JSON.stringify(error, null, 2))
      return
    }

    // The user exists and verification succeeded
    if (signIn.status === 'complete') {
      await finalizeSignIn()
    } else {
      // Check why the sign-in is not complete
      console.error('Sign-in attempt not complete:', signIn.status)
    }
  };

  const handleResend = async () => {

  };

  const handleTransferToSignUp = async () => {
    // Create sign-up using transfer.
    // This moves the verified identification from the sign-in to a new sign-up.
    const { error } = await signUp.create({ transfer: true })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signUp.status === 'complete') {
      // No additional requirements - sign-up is complete
      await finalizeSignUp()
    } else if (signUp.status === 'missing_requirements') {
      // Additional fields are required to complete sign-up.
      // Common missing fields include legal_accepted, first_name, last_name, etc.
      // Show a form to collect the missing fields.
      setShowMissingRequirements(true)
    } else {
      console.error('Unexpected sign-up status:', signUp.status)
    }
  }

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          // Handle pending session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          console.log(session?.currentTask)
          return
        }

        const url = decorateUrl('/')
        console.log({ url })
        if (url.startsWith('http')) {
          window.location.href = url
        } else {
          router.push(url)
        }
      },
    })
  }

  // Helper to finalize sign-up and navigate
  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          // Handle pending session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          console.log(session?.currentTask)
          return
        }

        const url = decorateUrl('/')
        if (url.startsWith('http')) {
          window.location.href = url
        } else {
          router.push(url)
        }
      },
    })
  }



  if (verifying) {
    const email = getValues("email")
    return (
      <VerifyCode
        email={email}
        code={code}
        setCode={setCode}
        onBack={() => setVerifying(false)}
        onVerify={handleVerify}
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
