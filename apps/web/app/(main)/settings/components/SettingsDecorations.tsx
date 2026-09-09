import React from "react";
import { Icon } from "../../components/icons";

/** the floating paper layer behind the settings desk — purely decorative */
const SettingsDecorations = () => (
    <div className="set-deco" aria-hidden>
        <span className="sd sd-crane">
            <Icon name="crane" size={82} />
        </span>
        <span className="sd sd-plane">
            <Icon name="plane" size={44} />
        </span>
        <span className="sd sd-sakura">
            <Icon name="sakura" size={34} />
        </span>
        <span className="sd sd-sakura2">
            <Icon name="sakura" size={20} />
        </span>
        <span className="sd sd-star">
            <Icon name="star" size={26} />
        </span>
    </div>
);

export default SettingsDecorations;
