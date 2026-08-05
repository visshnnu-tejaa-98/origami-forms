import React from 'react'
import ValidationFields from './ValidationFields'
import { ValidationsBlockProps } from '../types'
import { Icon } from '../../components/icons'
import { BLOCK_META } from '../constants'

const Validations = (props: ValidationsBlockProps) => {
    const { field, updateField } = props

    if (!field) return null

    const meta = BLOCK_META[field.type];


    return (
        <section className="insp-sec">
            <div className="sec-head">
                Validation <span className="sec-hint">blank means no limit</span>
            </div>

            <label className="o-toggle insp-toggle">
                <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                />
                <span className="track" /> Required
            </label>

            <hr className="o-rule o-rule--dashed" />

            <ValidationFields field={field} updateField={updateField} />

            <hr className="o-rule o-rule--dashed" />

            {field.required && (
                <div className="valid-row">
                    <span className="pip">
                        <Icon name="check" size={10} />
                    </span>
                    Required · &ldquo;Please answer this one.&rdquo;
                </div>
            )}
            <div className="valid-row">
                <span className="pip">
                    <Icon name="check" size={10} />
                </span>
                {meta?.label ?? "Value"} · enforced via Zod
            </div>
        </section>
    )
}

export default Validations