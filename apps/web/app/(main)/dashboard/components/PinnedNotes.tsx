import React from 'react'
import { Icon } from '../../components/icons'

const PinnedNotes = () => {
    return (
        <div className="notes-panel">
            <div className="notes-panel-head">
                <h3>Pinned notes</h3>
                <button className="o-btn o-btn--ghost o-btn--sm">
                    <Icon name="plus" size={13} /> Pin
                </button>
            </div>
            <div className="note-wall">
                <div className="o-note o-note--sticky" style={{ transform: "rotate(-2deg)" }}>
                    ★ check copy on Q5 — too long
                </div>
                <div
                    className="o-note o-note--sticky o-note--green"
                    style={{ transform: "rotate(3deg)" }}
                >
                    ship public theme
                    <br />
                    before Friday
                </div>
                <div
                    className="o-note o-note--sticky o-note--pink"
                    style={{ transform: "rotate(-3deg)" }}
                >
                    add CSV export to
                    <br />
                    responses page
                </div>
                <div
                    className="o-note o-note--sticky o-note--lavender"
                    style={{ transform: "rotate(2deg)" }}
                >
                    try cyberpunk theme
                    <br />
                    on gaming form ★
                </div>
            </div>
        </div>
    )
}

export default PinnedNotes