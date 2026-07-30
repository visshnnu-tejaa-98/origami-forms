import React from 'react'
import FormsList from './FormsList'
import ChartPanel from './ChartPanel'
import Activities from './Activities'
import PinnedNotes from './PinnedNotes'

const SummaryInfo = () => {
    return (
        <section className="grid-cols">
            <div>
                <FormsList />
                <ChartPanel />
            </div>
            <aside>
                <Activities />
                <PinnedNotes />
            </aside>
        </section>
    )
}

export default SummaryInfo