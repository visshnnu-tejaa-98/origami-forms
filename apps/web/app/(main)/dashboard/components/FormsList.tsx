"use client"

import React, { useMemo } from 'react'
import { Icon } from '../../components/icons'
import Link from 'next/link'
import { useListForms } from '~/hooks/use-form'
import { DESC, UPDATED_AT } from '../../constants'
import { RecentFormsSkeleton } from '../skeletons'
import ErrorComponent from '../../components/ErrorComponent'
import { STATUS_BADGE, toUiForm } from '../../utils'
import EmptyComponent from '../../components/EmptyComponent'

const FormsList = () => {
    const { formsData, listFormsIsPending, listFormsError, refetchForms } = useListForms({
        page: 1,
        pageSize: 5,
        sortBy: UPDATED_AT,
        sortOrder: DESC,
    })

    const forms = useMemo(() => {
        if (!formsData?.forms) return []
        return formsData.forms.map(toUiForm);
    }, [formsData]);

    return (
        <div className="panel">
            <div className="panel-head">
                <h3>Recent forms</h3>
                <div className="head-actions">
                    <Link className="o-btn o-btn--sm o-btn--ghost" href={"/forms"}>
                        See all <Icon name="arrow" size={13} />
                    </Link>
                </div>
            </div>



            {listFormsIsPending && <RecentFormsSkeleton count={7} />}

            {listFormsError &&
                <ErrorComponent
                    onClick={refetchForms}
                    message={listFormsError?.message || "Failed to load forms"}
                />
            }

            {forms.length === 0 &&
                <EmptyComponent
                    title="Nothing on the desk yet."
                    message="Your recent folds will gather here. Make the first one and watch this panel fill up."
                    onClick={() => { }}
                />
            }

            {forms && forms.map((f) => {
                const badge = STATUS_BADGE[f.status];
                const isDraft = f.status === "draft";
                return <div key={f.title} className={`form-row ${f.tint}`}>
                    <span className="ic">
                        <Icon name={f.icon} size={20} />
                    </span>
                    <div>
                        <div className="name">{f.title}</div>
                        <div className="sub">{f.edited}</div>
                    </div>
                    <div className="col">
                        <div className="lbl">status</div>
                        <span className={`o-badge ${badge.cls}`}>{f.status}</span>
                    </div>
                    <div className="col">
                        <div className="lbl">responses</div>
                        <div className="num">{f.responses}</div>
                    </div>
                    <div className="col" style={{ minWidth: "120px" }}>
                        <div className="lbl">Complete</div>
                        <div className="o-progress" style={{ marginTop: "4px" }}>
                            <div className="bar" style={{ "--p": f.completion } as React.CSSProperties} />
                        </div>
                        <div className="sub" style={{ marginTop: "3px" }}>
                            {f.completion}
                        </div>
                    </div>
                    <span className="ellipsis">
                        <Icon name="chevron" size={16} />
                    </span>
                </div>
            })}
        </div>

    )
}

export default FormsList