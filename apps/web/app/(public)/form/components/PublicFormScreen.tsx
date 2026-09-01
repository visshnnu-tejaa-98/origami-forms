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
import { useLocation } from "~/hooks/use-location";
import { useDeviceInfo } from "~/hooks/use-deviceinfo";

const PublicFormScreen = ({ form }: { form: PublicForm }) => {
    const [sent, setSent] = useState(false);

    const { submitResponseAsync, submitResponseIsPending } = useSubmitPublicResponse();

    const steps = useMemo(() => toSteps(form), [form]);

    const { location } = useLocation()
    const { browser, device } = useDeviceInfo()

    const onSubmit = useCallback(
        async (answers: Answers, completionTimeInSec: number) => {
            const metaData = {
                browser: browser ?? undefined,
                device: device ?? undefined,
                city: location?.city ?? undefined,
                country: location?.countryCode ?? undefined,
            }
            const hasMetaData = Object.values(metaData).some((value) => value !== undefined);
            await submitResponseAsync({
                formId: form.id,
                answers: toSubmittedAnswers(answers),
                completionTimeInSec,
                metadata: hasMetaData ? metaData : undefined,
            });
            setSent(true);
        },
        [form.id, submitResponseAsync, browser, device, location],
    );

    const flow = useFormFlow({ steps, mode: "live", onSubmit });

    const ThankyouMessage = (titile?: string) => <>
        Your answers to <b>"{titile}"</b> have landed safely on the other desk.
    </>

    const publicFormStateDescription = ThankyouMessage(form.title);
    if (sent) {
        return (
            <div className="db-shell db-shell--public o-scope">
                <main>
                    <div className="pv-screen pv-screen--page pf-screen">
                        <PreviewCanvas />
                        <PublicFormState
                            icon="sparkles"
                            title="Sent. Thank you."
                            description={publicFormStateDescription}
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
