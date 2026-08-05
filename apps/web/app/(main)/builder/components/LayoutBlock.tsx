import React from 'react'
import { Icon } from '../../components/icons'
import { BLOCK_META } from '../constants';
import { LayoutBlockProps } from '../types';

const LayoutBlock = (props: LayoutBlockProps) => {

    const { field, updateField, removeField, duplicateField } = props
    const meta = BLOCK_META[field.type];
    return (
        <aside className="b-right">
            <div className="insp-head">
                <span className={`iconbox t-${meta?.tint ?? "accent"}`}>
                    <Icon name={meta?.icon ?? "layers"} size={18} />
                </span>
                <div>
                    <h3>Layout settings</h3>
                    <div className="insp-sub">{meta?.label.toLowerCase() ?? field.type}</div>
                </div>
            </div>

            <section className="insp-sec">
                <div className="sec-head">Content</div>
                <div className="insp-row">
                    <label htmlFor="insp-layout-label">Label</label>
                    <input
                        id="insp-layout-label"
                        className="insp-input"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                </div>
                <p className="sec-empty">
                    This block only shapes the canvas — it is never sent with the form.
                </p>
            </section>

            <div className="insp-foot">
                <button
                    type="button"
                    className="o-btn o-btn--sm o-btn--ghost is-danger"
                    onClick={() => removeField(field.id)}
                >
                    <Icon name="trash" size={13} /> Delete block
                </button>
                <button
                    type="button"
                    className="o-btn o-btn--sm o-btn--ghost"
                    onClick={() => duplicateField(field.id)}
                >
                    <Icon name="copy" size={13} /> Duplicate
                </button>
            </div>
        </aside>
    )
}

export default LayoutBlock