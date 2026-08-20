"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSubmitPublicResponse } from "~/hooks/use-public-form";
import type { PublicForm } from "../types";
import { toSteps } from "../utils";
import PublicFormState from "./PublicFormState";
import { Answers } from "~/components/form-flow/types";
import { toSubmittedAnswers } from "~/components/form-flow/flow";
import { useFormFlow } from "~/components/form-flow/useFormFlow";
import FormFlowStage from "~/components/form-flow/FormFlowStage";
import PreviewCanvas from "~/app/(main)/builder/[formId]/preview/components/PreviewCanvas";
import BrandCreditsLogo from "~/components/origami/BrandCreditsLogo";

const PublicFormScreen = ({ form }: { form: PublicForm }) => {
    const [sent, setSent] = useState(false);

    const { submitResponseAsync, submitResponseIsPending } = useSubmitPublicResponse();

    const steps = useMemo(() => toSteps(form), [form]);

    const onSubmit = useCallback(
        async (answers: Answers, completionTimeInSec: number) => {
            await submitResponseAsync({
                formId: form.id,
                answers: toSubmittedAnswers(answers),
                completionTimeInSec,
            });
            setSent(true);
        },
        [form.id, submitResponseAsync],
    );

    const flow = useFormFlow({ steps, mode: "live", onSubmit });

    if (sent) {
        return (
            <div className="db-shell db-shell--public o-scope">
                <main>
                    <div className="pv-screen pv-screen--page pf-screen">
                        <PreviewCanvas />
                        <PublicFormState
                            icon="sparkles"
                            title="Sent. Thank you."
                            description={`Your answers to "${form.title}" have landed safely on the other desk.`}
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="db-shell db-shell--public o-scope">
            <main>
                <div className="pv-screen pv-screen--page pf-screen" aria-label={form.title}>
                    <PreviewCanvas />
                    <FormFlowStage
                        mode="live"
                        flow={flow}
                        title={form.title}
                        description={form.description}
                        submitting={submitResponseIsPending}
                        brand={<BrandCreditsLogo />}
                    />
                </div>
            </main>
        </div>
    );
};

export default PublicFormScreen;
