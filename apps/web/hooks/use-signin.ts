"use client"

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { validateForm } from "~/app/(auth)/utils";
import { signInFormInput, SignInFormInputType } from "~/app/(auth)/validators"

export function useSignInOrUp() {
    const [formError, setFormError] = useState("")
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [missingRequirements, setMissingRequirements] = useState(false)


    const { signIn, errors: signInError, fetchStatus } = useSignIn()
    const { signUp } = useSignUp()
    const router = useRouter()


    const signInWithEmailAndPasswordWithOTPVerification = async (data: SignInFormInputType) => {
        const { email } = data

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

        const { error: createSignInError } = await signIn.create({
            identifier: email,
            signUpIfMissing: true,
        })

        if (createSignInError) {
            // TODO: Handle This error
            console.error(JSON.stringify(createSignInError, null, 2))
            return
        } else {
            const { error: sendCodeError } = await signIn.emailCode.sendCode()

            if (sendCodeError) {
                console.error(JSON.stringify(sendCodeError, null, 2))
                setOtpVerifying(false)
                return
            }

            setOtpVerifying(true)
        }
    }

    const resendOtp = async () => {
        const { error: sendCodeError } = await signIn.emailCode.sendCode()

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
        isClerkAPIResponseError(error) &&
        error.errors[0]?.code === 'sign_up_if_missing_transfer'

    const verifyOtp = async (code: string) => {
        setFormError("")

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
        setOtpVerifying,
        verifyOtp,
        resendOtp
    }
}
