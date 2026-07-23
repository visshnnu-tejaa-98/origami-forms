"use client"

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { signInFlow, signupFlow } from "~/app/(auth)/constants";
import { LoginFlow } from "~/app/(auth)/types";
import { validateForm } from "~/app/(auth)/utils";
import { signInFormInput, SignInFormInputType } from "~/app/(auth)/validators"

export function useSignInOrUp() {
    const [formError, setFormError] = useState("")
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [isSigningInLoading, setisSigningInLoading] = useState(false)
    const [isSignUpLoading, setisSignUpLoading] = useState(false)
    const [missingRequirements, setMissingRequirements] = useState(false)
    // Which resource the shared OTP screen is driving.
    const [loginFlow, setLoginFlow] = useState<LoginFlow>('sign-in')

    const { signIn } = useSignIn()
    const { signUp } = useSignUp()
    const clerk = useClerk()
    const router = useRouter()

    const clearFormError = () => {
        setFormError("")
        setisSignUpLoading(false)
        setisSigningInLoading(false)
    }

    const sendOtp = async (mode: LoginFlow) => {
        return mode === signupFlow
            ? signUp.verifications.sendEmailCode()
            : signIn.emailCode.sendCode();
    };


    const signInWithEmail = async (data: SignInFormInputType) => {
        setFormError("")
        setisSigningInLoading(true)


        const { error, data: parsedData } = await validateForm({ schema: signInFormInput, input: data })

        if (error) {
            setFormError(error)
            setisSigningInLoading(false)
            return
        }

        if (!parsedData) {
            setFormError("Form data processing failed.");
            return;
        }

        const { email } = parsedData

        await startEmailSignIn(email)
        setisSigningInLoading(false)
    }

    const signUpWithEmail = async (data: SignInFormInputType) => {
        setFormError("")
        setisSignUpLoading(true)


        const { error, data: parsedData } = await validateForm({ schema: signInFormInput, input: data })

        if (error) {
            setFormError(error)
            setisSignUpLoading(false)
            return
        }

        if (!parsedData) {
            setFormError("Form data processing failed.");
            return;
        }

        const { email } = parsedData

        await startEmailSignIn(email)
        setisSignUpLoading(false)

    }

    const clerkErrorMessage = (error: unknown, fallback: string) =>
        isClerkAPIResponseError(error)
            ? error.errors[0]?.longMessage ?? error.errors[0]?.message ?? fallback
            : fallback

    const isAlreadySignedIn = (error: unknown) =>
        isClerkAPIResponseError(error) &&
        ['session_exists', 'identifier_already_signed_in'].includes(error.errors[0]?.code ?? '')

    const startEmailSignIn = async (email: string) => {
        setLoginFlow(signInFlow)

        const { error: createSignInError } = await signIn.create({
            identifier: email,
            signUpIfMissing: true,
        })
        if (createSignInError) {

            console.error(JSON.stringify(createSignInError, null, 2))
            if (isAlreadySignedIn(createSignInError)) {
                router.push('/')
                return
            }
            setFormError(clerkErrorMessage(createSignInError, "Couldn't sign you in. Please try again."))
            return
        }

        const { error: sendCodeError } = await sendOtp(loginFlow)

        if (sendCodeError) {
            console.error(JSON.stringify(sendCodeError, null, 2))
            setOtpVerifying(false)
            return
        }

        setOtpVerifying(true)
    }

    const signInWithGoogle = async (flow: LoginFlow = signInFlow) => {
        setFormError("")

        try {
            await clerk.client.signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: `/sso-callback?flow=${flow}`,
                redirectUrlComplete: '/dashboard',
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


    const isIncorrectCode = (error: unknown) => !!error &&
        isClerkAPIResponseError(error) &&
        error.errors[0]?.code === 'form_code_incorrect'

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
            if (loginFlow === signupFlow) {
                await verifySignUpOtp(code)
                return
            }

            const { error } = await signIn.emailCode.verifyCode({ code })

            if (isSignUpTransfer(error)) {
                await handleTransferToSignUp()
                return
            }

            if (isIncorrectCode(error)) {
                setFormError("Incorrect code, Please try again.")
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
        isSigningInLoading,
        isSignUpLoading,
        signInWithEmail,
        signUpWithEmail,
        setOtpVerifying,
        verifyOtp,
        resendOtp,
        signInWithGoogle,
        clearFormError
    }
}
