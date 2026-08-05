import React from 'react'
import { Icon } from '../../components/icons'
import { InspectorActionsProps } from '../types'

const InspectorActions = (props: InspectorActionsProps) => {
    const { field, removeField, duplicateField } = props
    return (
        <div className="insp-foot">
            <button
                type="button"
                className="o-btn o-btn--sm o-btn--ghost is-danger"
                onClick={() => removeField(field.id)}
            >
                <Icon name="trash" size={13} /> Delete field
            </button>
            <button
                type="button"
                className="o-btn o-btn--sm o-btn--ghost"
                onClick={() => duplicateField(field.id)}
            >
                <Icon name="copy" size={13} /> Duplicate
            </button>
        </div>
    )
}

export default InspectorActions