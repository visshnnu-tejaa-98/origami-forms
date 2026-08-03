import React from 'react'
import { Icon } from './icons';

type EmptyComponentProps = {
    message?: string;
    title?: string;
    cta?: string;
    onClick: () => void;
};

const EmptyComponent = (props: EmptyComponentProps) => {
    const {
        title = "A clean sheet, so far.",
        message = "Nothing folded here yet. Start with a blank sheet and crease it into your first form.",
        cta = "Fold your first form",
        onClick,
    } = props;

    return (
        <div className="forms-empty">
            <span className="art">
                <Icon name="empty-box" size={72} />
            </span>
            <h3>{title}</h3>
            <p>{message}</p>
            <button className="o-btn o-btn--accent o-btn--lg" onClick={() => onClick()}>
                <Icon name="plus" size={15} /> {cta}
            </button>
        </div>
    )
}

export default EmptyComponent
