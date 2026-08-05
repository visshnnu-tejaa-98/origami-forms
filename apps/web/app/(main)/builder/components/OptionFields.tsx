import React from 'react'
import { Icon } from '../../components/icons'
import { FieldOption, OptionFieldsProps } from '../types'
import { hasOptions } from '../constants'

const OptionFields = (props: OptionFieldsProps) => {
    const { field, updateField, } = props

    const optionField = hasOptions(field) ? field : null;
    const options: FieldOption[] = optionField?.options ?? [];

    const setOptions = (next: FieldOption[]) => updateField(field.id, { options: next });
    const newOptionId = () => `o-${Math.random().toString(36).slice(2, 9)}`;


    if (!options || options.length === 0) {
        return null
    }

    return (
        <section className="insp-sec">
            <div className="sec-head">
                Options <span className="sec-hint">drag to reorder</span>
            </div>

            <div className="options-list">
                {options.map((opt, i) => (
                    <div className="opt-row" key={opt.id}>
                        <span className="drag-mini" title="Drag to reorder">
                            <Icon name="drag" size={12} />
                        </span>
                        <input
                            value={opt.label}
                            placeholder={`Option`}
                            aria-label={`Option ${i + 1}`}
                            onChange={(e) =>
                                setOptions(
                                    options.map((o) =>
                                        o.id === opt.id
                                            ? { ...o, label: e.target.value, value: e.target.value }
                                            : o,
                                    ),
                                )
                            }
                        />
                        <button
                            type="button"
                            className="x"
                            title="Remove option"
                            aria-label={`Remove option ${i + 1}`}
                            onClick={() => setOptions(options.filter((o) => o.id !== opt.id))}
                        >
                            <Icon name="x" size={12} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="add-opt"
                onClick={() => setOptions([...options, { id: newOptionId(), label: "", value: "" }])}
            >
                + add option
            </button>
        </section>
    )
}

export default OptionFields