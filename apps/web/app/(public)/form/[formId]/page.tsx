"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import "../../../(main)/builder/preview.css";
import "../public-form.css";
import { usePublicForm } from "~/hooks/use-public-form";
import PreviewCanvas from "../../../(main)/builder/[formId]/preview/components/PreviewCanvas";
import PublicFormScreen from "../components/PublicFormScreen";
import PublicFormState from "../components/PublicFormState";

/** the public link is /form/<formId> — the id is an unguessable uuid, and only a published,
 *  undeleted form answers to it */
const PublicFormPage = () => {
    const { formId } = useParams<{ formId: string }>();
    const router = useRouter();

    const { publicForm, publicFormError, publicFormIsPending, refetchPublicForm } = usePublicForm({
        formId,
    });

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

    if (publicFormIsPending) {
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
                    description: `"${publicForm.title}" has collected every response it was taking.`,
                }
                : {
                    title: "This form has closed.",
                    description: `"${publicForm.title}" stopped taking responses. Ask whoever sent the link if it can be reopened.`,
                };

        return shell(
            <PublicFormState
                icon="lock"
                title={closed.title}
                description={closed.description}
                action={{ label: "Back to origami", onClick: () => router.push("/") }}
            />,
        );
    }

    return <PublicFormScreen form={publicForm} />;
};

export default PublicFormPage;
