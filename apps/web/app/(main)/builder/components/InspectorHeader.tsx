import React from 'react'
import { Icon } from '../../components/icons'
import { BLOCK_META } from '../constants';
import { InspectorheaderProps } from '../types';

const InspectorHeader = (props: InspectorheaderProps) => {
    const { field, index } = props
    const meta = BLOCK_META[field.type];

    return (
        <div className="insp-head">
            <span className={`iconbox t-${meta?.tint ?? "accent"}`}>
                <Icon name={meta?.icon ?? "text"} size={18} />
            </span>
            <div>
                <h3>Field settings</h3>
                <div className="insp-sub">
                    Q{index} · {meta?.label.toLowerCase() ?? field.type}
                </div>
            </div>
        </div>
    )
}

export default InspectorHeader