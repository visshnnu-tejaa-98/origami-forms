import React from 'react'
import { FormFieldConfigurationProps } from '../types'

const FormFieldConfiguration = (props: FormFieldConfigurationProps) => {
    const { field, updateField } = props

    const { label, description, helpText } = field
    const hasPlaceholder = "placeholder" in field;
    const hasDefaultValue = "defaultValue" in field;
    return (
        <section className="insp-sec">
            <div className="sec-head">Content</div>

            <div className="insp-row">
                <label htmlFor="insp-label">
                    Question label <span className="req-star">*</span>
                </label>
                <textarea
                    key={field.id}
                    id="insp-label"
                    className="insp-textarea"
                    placeholder={label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                />
            </div>

            <div className="insp-row">
                <label htmlFor="insp-desc">Description</label>
                <textarea
                    id="insp-desc"
                    className="insp-input"
                    value={description}
                    onChange={(e) => updateField(field.id, { description: e.target.value })}
                />
            </div>

            <div className="insp-row">
                <label htmlFor="insp-help">Helper text</label>
                <textarea
                    id="insp-help"
                    className="insp-input"
                    value={helpText}
                    onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                />
            </div>

            {hasPlaceholder && (
                <div className="insp-row">
                    <label htmlFor="insp-placeholder">Placeholder</label>
                    <input
                        id="insp-placeholder"
                        className="insp-input"
                        value={field.placeholder ?? ""}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    />
                </div>
            )}

            {hasDefaultValue && (
                <div className="insp-row">
                    <label htmlFor="insp-default">Default value</label>
                    <input
                        id="insp-default"
                        className="insp-input"
                        type={field.type === "date" ? "date" : "text"}
                        value={typeof field.defaultValue === "string" ? field.defaultValue : ""}
                        onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                    />
                </div>
            )}
        </section>
    )
}

export default FormFieldConfiguration