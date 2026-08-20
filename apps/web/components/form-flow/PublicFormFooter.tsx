import React from 'react'
import { PublicFormFooterProps } from './types'
import { Icon } from '~/app/(main)/components/icons'

const PublicFormFooter = (props: PublicFormFooterProps) => {
    const { isPreview, at, total, go, next } = props
    return (
        <footer className="pv-bot">
            <div className="kbd-row">
                <span className="o-kbd">↵</span> next
                <span className="sep">·</span>
                <span className="o-kbd">←</span>
                <span className="o-kbd">→</span> nav
                {isPreview && (
                    <>
                        <span className="sep">·</span>
                        <span className="o-kbd">esc</span> back to builder
                    </>
                )}
                <span className="sep">·</span>
                question {at} of {total}
            </div>
            <div className="pv-arrows">
                <button
                    type="button"
                    onClick={() => go(at - 1)}
                    disabled={at === 0}
                    aria-label="Previous"
                >
                    <Icon name="arrow-left" size={16} />
                </button>
                <button type="button" onClick={next} disabled={at === total} aria-label="Next">
                    <Icon name="arrow" size={16} />
                </button>
            </div>
        </footer>
    )
}

export default PublicFormFooter