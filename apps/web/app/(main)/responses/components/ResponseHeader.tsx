import React from 'react'
import { ResponseHeaderProps } from '../types'
import { Icon } from '../../components/icons'
import { formatItemCount } from '~/app/utils'

const ResponseHeader = (props: ResponseHeaderProps) => {
    const { totalItems, searchQuery, setSearchQuery } = props

    return (
        <header className="rsp-head">
            <div>
                <h1>Responses</h1>
                <div className="sub">
                    Every response, across every form · {formatItemCount(totalItems)} gathered so far
                </div>
            </div>
            <div className="head-actions">
                <div className="rsp-search">
                    <Icon name="search" size={16} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search responses…"
                    />
                    {searchQuery !== "" && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <Icon name="x" size={13} />
                        </button>
                    )}
                </div>
                <button className="o-btn o-btn--sm"
                // onClick={() => exportCsv(visible)}
                >
                    <Icon name="download" size={14} /> Export CSV
                </button>
                <button className="o-btn o-btn--sm o-btn--accent">
                    <Icon name="share" size={14} /> Share view
                </button>
            </div>
        </header>
    )
}

export default ResponseHeader