import { fileUploadLimit, formLogoPath } from "~/app/(public)/form/utils";
import { Icon } from "../../components/icons";
import { ACCEPTED_ICON_TYPES, draftFileName } from "../constants";
import type { FormIconPickerProps } from "../types";
import { useUploadFile } from "~/hooks/use-uploadfile";


const FormIconPicker = ({ logoUrl, setIcon, formId }: FormIconPickerProps) => {
    const { inputRef, uploading, error, progress, pick, removeFile, uploadFile } = useUploadFile();

    const FILE_UPLOAD_LIMIT = fileUploadLimit(2);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (!file) return;

        const options = {
            id: formId ?? "",
            file,
            sessionKey: draftFileName,
            maxSizeAllowed: FILE_UPLOAD_LIMIT,
            path: formLogoPath,
            setIcon,
        };

        await uploadFile(options);
    };

    return (
        <div className="form-icon">
            <button
                type="button"
                className={`form-icon-box${logoUrl ? " is-set" : ""}${uploading ? " is-busy" : ""}`}
                onClick={pick}
                disabled={uploading}
                aria-busy={uploading}
                aria-label={logoUrl ? "Replace form icon" : "Add a form icon"}
                title={logoUrl ? "Replace form icon" : "Add a form icon"}
            >
                {logoUrl ? (
                    <>
                        <img src={logoUrl} alt="" className="form-icon-img" />
                        <span className="form-icon-overlay">
                            <Icon name="upload" size={14} />
                        </span>
                    </>
                ) : (
                    <span className="form-icon-empty">
                        <Icon name="plus" size={16} />
                    </span>
                )}

                {uploading ? (
                    <span className="form-icon-progress">
                        <svg viewBox="0 0 64 64" aria-hidden="true">
                            <rect
                                className="ring-track"
                                x="1"
                                y="1"
                                width="62"
                                height="62"
                                rx="6"
                                pathLength={100}
                            />
                            <rect
                                className="ring-fill"
                                x="1"
                                y="1"
                                width="62"
                                height="62"
                                rx="6"
                                pathLength={100}
                                style={{ strokeDashoffset: 100 - progress! }}
                            />
                        </svg>
                        <span className="form-icon-pct">{Math.round(progress!)}</span>
                    </span>
                ) : null}
            </button>

            {logoUrl && !uploading ? (
                <button type="button" className="form-icon-clear" onClick={() => removeFile(setIcon)}>
                    <Icon name="x" size={10} /> remove
                </button>
            ) : null}

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_ICON_TYPES.join(",")}
                className="form-icon-input"
                onChange={handleFileChange}
                tabIndex={-1}
                aria-hidden="true"
            />

            {error ? (
                <p className="form-icon-error" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
};

export default FormIconPicker;
