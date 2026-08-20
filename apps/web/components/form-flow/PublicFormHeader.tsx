import React from 'react'
import { PublicFormHeaderProps } from './types'

const PublicFormHeader = (props: PublicFormHeaderProps) => {
    const { isPreview, brand, at, total, progress } = props
    return (
        <header className={`pv-top${isPreview ? "" : " pf-top"}`}>
            {isPreview ? (
                <span className="pv-eyebrow">
                    wet-fold preview · <span>{status === "published" ? "published" : "unpublished"}</span>
                </span>
            ) : (
                brand
            )}

            {(isPreview || at > 0) && (
                <div className="pv-meta">
                    <span className="pv-step-label">
                        {at} / {total}
                    </span>
                    <div className="pv-progress">
                        <span style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </header>
    )
}

export default PublicFormHeader