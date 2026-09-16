"use client"

import Link from 'next/link'
import React from 'react'
import { Icon } from '../../components/icons'
import { useFormStore } from '~/app/store/form-store'
import { GreetingSkeleton } from '../skeletons'
import { useListForms } from '~/hooks/use-form'
import { formatCompletionTime, formatIndianNumber, relativeTime } from '~/app/utils'

const Greeting = () => {
    const formsStats = useFormStore(state => state.formsStats)

    /* The form carrying the most responses — the one worth naming in the lede. */
    const { formsData } = useListForms({ sortBy: 'submissionCount', sortOrder: 'desc', pageSize: 1 })
    const topForm = formsData?.forms?.[0]

    if (!formsStats) {
        return <GreetingSkeleton />
    }

    const {
        draft,
        published,
        total,
        totalResponses,
        totalViews,
        completionRate,
        avgTimeCompletion,
    } = formsStats

    if (total === 0) {
        return (
            <section className="greet">
                <div className="greet-card">
                    <span className="crane">
                        <Icon name="crane" size={92} />
                    </span>
                    <span className="o-eyebrow">Welcome to Origami</span>
                    <h2>
                        A blank sheet.
                        <br />
                        <span className="o-underline">Every form</span> starts here.
                    </h2>
                    <p className="lede">
                        No forms yet — which is exactly where the good ones begin. Fold your first in
                        about two minutes, share the link, and watch the responses land right on this page.
                    </p>
                    <div className="actions">
                        <Link className="o-btn o-btn--accent" href="/builder">
                            Fold your first form
                        </Link>
                        <Link className="o-btn" href="/templates">
                            <Icon name="analytics" size={14} /> Start from a template
                        </Link>
                    </div>
                </div>
                <div className="focus-card">
                    <span className="o-tape o-tape--matcha" />
                    <div className="lbl">first folds</div>
                    <h3>Three creases to get going</h3>
                    <div className="row">
                        <span className="o-dot" /> Build a form — questions, logic, your look
                    </div>
                    <div className="row">
                        <span className="o-dot o-dot--info" /> Publish it and copy the share link
                    </div>
                    <div className="row">
                        <span className="o-dot o-dot--info" /> Responses and stats appear here live
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
                        <Link className="o-btn o-btn--sm o-btn--accent" href="/builder">
                            <Icon name="edit" size={13} /> Start building
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="greet">
            <div className="greet-card">
                <span className="crane">
                    <Icon name="crane" size={92} />
                </span>
                <span className="o-eyebrow">Welcome back</span>
                <h2>
                    {draft} drafts. {published} live forms.
                    <br />
                    <span className="o-underline">A good week</span> to fold.
                </h2>
                <p className="lede">
                    {totalResponses === 0 ? (
                        <>
                            Nothing has landed yet — {formatIndianNumber(totalViews)} views, no completed
                            responses. Share a link and this page starts filling in.
                        </>
                    ) : topForm ? (
                        <>
                            Your <strong>{topForm.title}</strong> is carrying the most weight —{' '}
                            {formatIndianNumber(topForm.submissionCount)} of{' '}
                            {formatIndianNumber(totalResponses)} responses. Across every form,{' '}
                            {completionRate}% finish what they start, in about{' '}
                            {formatCompletionTime(avgTimeCompletion)}.
                        </>
                    ) : (
                        <>
                            {formatIndianNumber(totalResponses)} responses in so far, {completionRate}%
                            of them finished — about {formatCompletionTime(avgTimeCompletion)} each.
                        </>
                    )}
                </p>
                <div className="actions">
                    <Link className="o-btn o-btn--accent" href="/builder">
                        New form
                    </Link>
                    <Link className="o-btn" href="#">
                        <Icon name="analytics" size={14} /> See analytics
                    </Link>
                </div>
            </div>
            <div className="focus-card">
                <span className="o-tape o-tape--matcha" />
                <div className="lbl">today&rsquo;s focus</div>
                <h3>{topForm?.title ?? 'No form to focus on yet'}</h3>
                <div className="row">
                    <span className="o-dot" /> {formatIndianNumber(topForm?.submissionCount ?? 0)} responses
                    {topForm?.maxSubmissions
                        ? ` · ${Math.round((topForm.submissionCount / topForm.maxSubmissions) * 100)}% of cap`
                        : ''}
                </div>
                <div className={`row${draft > 0 ? ' warn' : ''}`}>
                    <span className="o-dot" />{' '}
                    {draft > 0 ? `${draft} form${draft === 1 ? '' : 's'} still in draft` : 'Every form is published'}
                </div>
                <div className="row">
                    <span className="o-dot o-dot--info" /> Avg time ·{' '}
                    {formatCompletionTime(avgTimeCompletion)}
                    {topForm?.updatedAt ? ` · edited ${relativeTime(topForm.updatedAt)}` : ''}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
                    <Link className="o-btn o-btn--sm" href={topForm ? `/builder/${topForm.id}` : '/builder'}>
                        <Icon name="edit" size={13} /> Edit
                    </Link>
                    {topForm && (
                        <Link className="o-btn o-btn--sm o-btn--accent" href={`/builder/${topForm.id}/preview`}>
                            <Icon name="eye" size={13} /> Preview
                        </Link>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Greeting