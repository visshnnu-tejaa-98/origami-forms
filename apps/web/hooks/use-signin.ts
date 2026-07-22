"use client"

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { validateForm } from "~/app/(auth)/utils";
import { signInFormInput, SignInFormInputType } from "~/app/(auth)/validators"

export function useSignInOrUp() {
    const [formError, setFormError] = useState("")
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [missingRequirements, setMissingRequirements] = useState(false)
    // Which resource the shared OTP screen is driving.
    const [loginFlow, setLoginFlow] = useState<'sign-in' | 'sign-up'>('sign-in')

    const { signIn } = useSignIn()
    const { signUp } = useSignUp()
    const clerk = useClerk()
    const router = useRouter()

    const createSignInOrUp = async ({ email }: SignInFormInputType, mode: 'sign-in' | 'sign-up') => {
        return mode === 'sign-up' ?
            await signUp.create({
                emailAddress: email,
            })
            :
            await signIn.create({
                identifier: email,
                signUpIfMissing: true,
            })
    }

    const sendOtp = async (mode: 'sign-in' | 'sign-up') => {
        return mode === "sign-up"
            ? signUp.verifications.sendEmailCode()
            : signIn.emailCode.sendCode();
    };


    const signInWithEmailAndPasswordWithOTPVerification = async (data: SignInFormInputType) => {
        setFormError("")

        const { error, data: parsedData } = await validateForm({ schema: signInFormInput, input: data })

        if (error) {
            setFormError(error)
            return
        }

        if (!parsedData) {
            setFormError("Form data processing failed.");
            return;
        }

        const { email } = parsedData

        setLoginFlow('sign-in')

        await startEmailSignIn(email)
    }

    const signUpWithEmail = async (data: SignInFormInputType) => {
        setFormError("")

        const { error, data: parsedData } = await validateForm({ schema: signInFormInput, input: data })

        if (error) {
            setFormError(error)
            return
        }

        if (!parsedData) {
            setFormError("Form data processing failed.");
            return;
        }

        const { email } = parsedData

        await startEmailSignIn(email)
    }

    // Pulls a human-readable message out of a Clerk error (falls back to generic).
    const clerkErrorMessage = (error: unknown, fallback: string) =>
        isClerkAPIResponseError(error)
            ? error.errors[0]?.longMessage ?? error.errors[0]?.message ?? fallback
            : fallback

    // Clerk codes that mean "a session already exists on this client".
    const isAlreadySignedIn = (error: unknown) =>
        isClerkAPIResponseError(error) &&
        ['session_exists', 'identifier_already_signed_in'].includes(error.errors[0]?.code ?? '')

    // Starts the email-OTP sign-in path (shared by the sign-in form and the
    // "already registered" fallback from the sign-up form).
    const startEmailSignIn = async (email: string) => {
        setLoginFlow('sign-in')

        const { error: createSignInError } = await createSignInOrUp({ email }, 'sign-in')
        if (createSignInError) {
            console.error(JSON.stringify(createSignInError, null, 2))
            // Already logged in on this device: just go home instead of erroring.
            if (isAlreadySignedIn(createSignInError)) {
                router.push('/')
                return
            }
            setFormError(clerkErrorMessage(createSignInError, "Couldn't sign you in. Please try again."))
            return
        }

        const { error: sendCodeError } = await sendOtp('sign-in')
        if (sendCodeError) {
            console.error(JSON.stringify(sendCodeError, null, 2))
            setOtpVerifying(false)
            return
        }

        setOtpVerifying(true)
    }

    const signInWithGoogle = async () => {
        setFormError("")

        try {
            await clerk.client.signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            })
        } catch (error) {
            console.error(JSON.stringify(error, null, 2))
            setFormError("Couldn't start Google sign-in. Please try again.")
        }
    }

    const resendOtp = async () => {
        const { error: sendCodeError } = await sendOtp(loginFlow)

        if (sendCodeError) {
            console.error(JSON.stringify(sendCodeError, null, 2))
            setOtpVerifying(false)
            return
        }

        setOtpVerifying(true)
    }

    // When the identifier has no account yet, Clerk answers a correct code with
    // this error instead of completing the sign-in — the signal to transfer to sign-up.
    const isSignUpTransfer = (error: unknown) =>
        !!error &&
        isClerkAPIResponseError(error) &&
        error.errors[0]?.code === 'sign_up_if_missing_transfer'

    const verifySignUpOtp = async (code: string) => {
        const { error } = await signUp.verifications.verifyEmailCode({ code })

        if (error) {
            console.error(JSON.stringify(error, null, 2))
            setFormError("That code didn't work. Please try again.")
            return
        }

        if (signUp.status === 'complete') {
            await finalizeSignUp()
            return
        }

        if (signUp.status === 'missing_requirements') {
            setMissingRequirements(true)
            return
        }

        console.error('Sign-up attempt not complete:', signUp.status)
        setFormError("We couldn't finish creating your account. Please try again.")
    }

    const verifyOtp = async (code: string) => {
        setFormError("")

        // Catch here so a thrown Clerk error surfaces as a real message instead of
        // bubbling to VerifyCode's generic "Verification failed at DOM boundary".
        try {
            if (loginFlow === 'sign-up') {
                await verifySignUpOtp(code)
                return
            }

            const { error } = await signIn.emailCode.verifyCode({ code })

            if (isSignUpTransfer(error)) {
                await handleTransferToSignUp()
                return
            }

            if (error) {
                console.error(JSON.stringify(error, null, 2))
                setFormError("That code didn't work. Please try again.")
                return
            }

            if (signIn.status === 'complete') {
                await finalizeSignIn()
                return
            }

            console.error('Sign-in attempt not complete:', signIn.status)
            setFormError("We couldn't finish signing you in. Please try again.")
        } catch (err) {
            console.error('verifyOtp threw:', err)
            setFormError(
                isClerkAPIResponseError(err)
                    ? err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Something went wrong. Please try again."
                    : "Something went wrong. Please try again."
            )
        }
    };

    const handleTransferToSignUp = async () => {
        const { error } = await signUp.create({ transfer: true })
        if (error) {
            console.error(JSON.stringify(error, null, 2))
            return
        }
        if (signUp.status === 'complete') {
            await finalizeSignUp()
        } else if (signUp.status === 'missing_requirements') {
            setMissingRequirements(true)
        } else {
            console.error('Unexpected sign-up status:', signUp.status)
        }
    }

    const finalizeSignIn = async () => {
        await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
                console.log({ session })
                if (session?.currentTask) {
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

    const finalizeSignUp = async () => {
        await signUp.finalize({
            navigate: ({ session, decorateUrl }) => {
                if (session?.currentTask) {
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


    return {
        otpVerifying,
        formError,
        missingRequirements,
        signInWithEmailAndPasswordWithOTPVerification,
        signUpWithEmail,
        setOtpVerifying,
        verifyOtp,
        resendOtp,
        signInWithGoogle
    }
}
