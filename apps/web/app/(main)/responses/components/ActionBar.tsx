import { ActionsBarProps } from "../types";

const ActionsBar = (props: ActionsBarProps) => {
    const { checked, setChecked } = props;

    if (checked.size === 0) return null;

    return (
        <div className="rsp-bulk">
            <span className="cnt">
                <strong>{checked.size}</strong> selected
            </span>
            <button className="bulk-clear" onClick={() => setChecked(new Map())}>
                clear
            </button>
        </div>
    );
};

export default ActionsBar