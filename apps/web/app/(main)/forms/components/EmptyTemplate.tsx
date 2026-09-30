import React from 'react'
import { Icon, IconName } from '../../components/icons'
import { EmptyScreenProps } from '../../types'

const EmptyTemplate = (props: EmptyScreenProps) => {
    const { title, description, icon, cta, ctaIcon = "plus", onClick } = props
    return (
        <div className="forms-empty">
            <span className="art">
                <Icon name={icon} size={72} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
            <button type="button" className="o-btn o-btn--accent o-btn--lg" onClick={onClick}>
                <Icon name={ctaIcon} size={15} /> {cta}
            </button>
        </div>
    )
}

export default EmptyTemplate