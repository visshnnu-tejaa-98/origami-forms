import { ListResponseOutputType } from '@repo/services/response/model'
import React from 'react'
import { formatCompletionTime, relativeTime } from '~/app/utils'
import { TINTS } from '../../constants'
import { Icon } from '../../components/icons'
import { hash } from '../../utils'
import { ResponsesListProps } from '../types'
import EmptyTemplate from '../../forms/components/EmptyTemplate'
import { ResponsesSkeleton } from '../skeletons'

const ResponsesList = (props: ResponsesListProps) => {
    const { responsesData, selectedId, listResponsesIsFetching, checked, isFiltered, setSelectedId, onClick } = props;

    const responses = responsesData?.responses ?? [];
    if (listResponsesIsFetching) {
        return <ResponsesSkeleton count={Math.max(responses.length, 3)} />
    }
    return (
        <div className="rsp-table" role="table" aria-label="Form responses">
            <span className="o-tape rsp-table-tape" aria-hidden />

            <div className="rsp-th" role="row">
                {/* TODO: this is for checkbox selection */}
                <span></span>
                <span>respondent</span>
                <span className="col-picked">Form Title</span>
                <span className="col-head">Status</span>
                <span className="col-hype">Time Taken</span>
                <span>Submitted at</span>
                <span />
            </div>
            {responses.length === 0 && (
                <EmptyTemplate
                    icon="mail"
                    title={isFiltered ? "Nothing matches that fold." : "No responses yet."}
                    description={isFiltered ? "Nothing came back for that search or filter. Try a different word, or open the gates to everyone with <em>all</em>." : "Once someone fills in one of your forms, their answers land here — ready to unfold, one crease at a time."}
                    cta={isFiltered ? "Clear filters" : "Create a form"}
                    onClick={onClick}
                />
            )}

            {responses.map((response: ListResponseOutputType["responses"][number]) => {
                const { id } = response
                const name = response.name ?? "Anonymous User"
                const email = response.email ?? ""
                const formTitle = response.formTitle ?? "--"
                const status = response.status === "completed" ? "Completed" : "Partial";
                const timeTaken = response.completionTimeInSec ? formatCompletionTime(response.completionTimeInSec) : "--";
                const submittedAt = response.submittedAt ? relativeTime(response.submittedAt) : "--";

                const tint = TINTS[hash(id) % TINTS.length]!
                const initial = name ? name[0]?.toUpperCase() : email?.[0]?.toUpperCase() ?? "--"

                return <div
                    key={id}
                    className={`rsp-tr${id === selectedId ? " selected" : ""}`}
                    role="row"
                    tabIndex={0}
                    onClick={() => setSelectedId(id)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(id);
                        }
                    }}
                >
                    <button
                        className={`rsp-check${checked.has(id) ? " on" : ""}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        aria-label={`Select ${name}`}
                        aria-pressed={checked.has(id)}
                    >
                        {checked.has(id) && <Icon name="check" size={12} />}
                    </button>
                    <div className="who">
                        <span className={`rsp-av t-${tint}`}>{initial}</span>
                        <div className="txt">
                            <span className="nm" title={name}>
                                {name}
                            </span>
                            <span className="em">{email}</span>
                        </div>
                    </div>

                    <div className="cell col-picked">
                        <span className="val">{formTitle}</span>
                    </div>

                    <div className="cell col-head">
                        <span className="val">
                            <span className={`o-badge o-badge--${status === "Partial" ? "peach" : "matcha"}`}>{status}</span>
                        </span>
                    </div>

                    <div className="cell col-hype">
                        <span className="time">
                            {timeTaken}
                        </span>
                    </div>

                    <div className="time">{submittedAt}</div>

                    <div className="chev" aria-hidden>
                        <Icon name="chevron" size={14} />
                    </div>
                </div>
            }
            )}
        </div>
    )
}

export default ResponsesList