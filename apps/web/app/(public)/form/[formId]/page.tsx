"use client";

import React, { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import "../../../(main)/builder/preview.css";
import "../public-form.css";
import { usePublicForm } from "~/hooks/use-public-form";
import PreviewCanvas from "../../../(main)/builder/[formId]/preview/components/PreviewCanvas";
import PublicFormScreen from "../components/PublicFormScreen";
import PublicFormState from "../components/PublicFormState";
import { useRouter } from "next/navigation";

const PublicFormPage = () => {
    const { formId } = useParams<{ formId: string }>();
    const { publicForm, publicFormError, publicFormIsPending, refetchPublicForm } = usePublicForm({
        formId,
    });

    const pathname = usePathname()
    const router = useRouter()
    const { isLoaded: authLoaded, isSignedIn } = useAuth()

    const needsSignIn =
        publicForm?.visibility === "authenticated" && authLoaded && !isSignedIn

    useEffect(() => {
        if (needsSignIn) {
            router.replace(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`)
        }
    }, [needsSignIn, pathname, router])

    const shell = (children: React.ReactNode) => (
        <div className="db-shell db-shell--public o-scope">
            <main>
                <div className="pv-screen pv-screen--page pf-screen">
                    <PreviewCanvas />
                    {children}
                </div>
            </main>
        </div>
    );

    if (publicFormIsPending || needsSignIn) {
        return shell(
            <PublicFormState
                icon="crane"
                title="Unfolding…"
                description="One moment while the paper flattens out."
            />,
        );
    }

    if (publicFormError || !publicForm) {
        return shell(
            <PublicFormState
                icon="clip"
                title="This form isn't here."
                description={
                    publicFormError?.message ??
                    "The link may be mistyped, or the form may have been unpublished."
                }
                action={{ label: "Try again", onClick: () => void refetchPublicForm() }}
            />,
        );
    }

    if (!publicForm.accepting) {
        const closed =
            publicForm.closedReason === "limit_reached"
                ? {
                    title: "All folded up.",
                    description: <div>"<b>{publicForm.title}</b>" has collected every response it was taking.</div>
                }
                : {
                    title: "This form has closed.",
                    description: <div>"<b>{publicForm.title}</b>" has closed. Ask the sender if it can be reopened.</div>,
                };

        return shell(
            <PublicFormState
                icon="lock"
                title={closed.title}
                description={closed.description}
            />,
        );
    }

    return <PublicFormScreen form={publicForm} />;
};

export default PublicFormPage;
