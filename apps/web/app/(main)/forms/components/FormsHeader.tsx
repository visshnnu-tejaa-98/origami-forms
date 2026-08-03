import React from 'react'
import { Icon } from '~/components/origami/icon'
import { FormHeaderProps } from '../../types'
import Link from 'next/link'

const FormsHeader = (props: FormHeaderProps) => {
    const { query, setQuery, totalForms, totalResponses } = props
    return (
        <header className="forms-head">
            <div>
                <h1>Your paper drawer</h1>
                <div className="sub">
                    {/* TODO: This length comes ander analytics, need to work on this, this data changes wrt to teh filter based on status */}
                    {totalForms.toLocaleString()} forms folded · {totalResponses.toLocaleString()} responses
                    gathered so far
                </div>
            </div>
            <div className="head-actions">
                <div className="forms-search">
                    <Icon name="search" size={16} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search your forms…"
                    />
                    {query !== "" && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <Icon name="x" size={13} />
                        </button>
                    )}
                </div>
                <Link href="#" className="o-btn o-btn--accent">
                    <Icon name="plus" size={15} /> New form
                </Link>
            </div>
        </header>
    )
}

export default FormsHeader