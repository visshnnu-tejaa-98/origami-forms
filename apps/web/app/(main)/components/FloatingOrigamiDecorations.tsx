import React from 'react'
import { Icon } from './icons'

// TODO: <ake this component reusuable once by passing all icons as props

const FloatingOrigamiDecorations = () => {
    return (
        <div className="forms-deco" aria-hidden>
            <span className="fd fd-crane">
                <Icon name="crane" size={78} />
            </span>
            <span className="fd fd-plane">
                <Icon name="plane" size={48} />
            </span>
            <span className="fd fd-sakura">
                <Icon name="sakura" size={36} />
            </span>
            <span className="fd fd-sakura2">
                <Icon name="sakura" size={22} />
            </span>
        </div>
    )
}

export default FloatingOrigamiDecorations