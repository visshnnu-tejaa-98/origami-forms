import React from "react";
import { Icon } from "../../../../components/icons";
import { ACCEPTED_ICON_TYPES, draftFileName, hasOptions } from "../../../constants";
import { AnswerValue, FieldBlock, PreviewInputProps } from "../../../types";
import { previewNumberNote } from "~/app/(main)/utils";
import { describeAccepted, fileNameFromUrl, isImageUrl } from "~/app/utils";
import { fileUploadLimit, formFilesPath } from "~/app/(public)/form/utils";
import { useUploadFile } from "~/hooks/use-uploadfile";

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const prettySize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

type UploadItem = {
  key: string;
  name: string;
  size: number;
  type: string;
  preview: string | null;
  url: string | null;
  status: "uploading" | "done" | "error";
  error: string;
};

const MIME_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
};

const acceptedMimeTypes = (extensions?: string[]) => {
  const types = (extensions ?? [])
    .map((extension) => MIME_BY_EXTENSION[extension.replace(/^\./, "").toLowerCase()])
    .filter((type): type is string => Boolean(type));

  return types.length > 0 ? Array.from(new Set(types)) : ACCEPTED_ICON_TYPES;
};

const asList = (value: string | string[]) =>
  (Array.isArray(value) ? value : value === "" ? [] : [value]).filter(Boolean);

const FileUploadPreview = ({
  field,
  onChange,
  value,
}: {
  field: FieldBlock;
  onChange: (value: AnswerValue) => void;
  value: AnswerValue | undefined;
}) => {
  const { inputRef, uploading, error, progress, pick, uploadFile } = useUploadFile();
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [pickError, setPickError] = React.useState("");
  const track = React.useRef<UploadItem[]>([]);

  // answers restored from an earlier step come back as urls with no local file behind them
  const restored = React.useMemo(() => asList(value ?? []), [value]);

  if (field.type !== "file_upload") return null;

  const maxMb = field.validation?.maxSizeMb ?? 5;
  const maxFiles = Math.max(1, field.validation?.maxFiles ?? 1);
  const multiple = maxFiles > 1;
  const accepted = acceptedMimeTypes(field.validation?.allowedFileTypes);

  const shown: UploadItem[] =
    items.length > 0
      ? items
      : restored.map((url) => ({
        key: url,
        name: fileNameFromUrl(url),
        size: 0,
        type: "",
        preview: url,
        url,
        status: "done" as const,
        error: "",
      }));

  const landed = shown.filter((item) => item.status === "done");
  const roomLeft = maxFiles - shown.filter((item) => item.status !== "error").length;

  track.current = shown;

  const commit = (next: UploadItem[], publish: boolean) => {
    track.current = next;
    setItems(next);
    if (!publish) return;
    const urls = next.flatMap((item) => (item.url ? [item.url] : []));
    onChange(multiple ? urls : (urls[0] ?? ""));
  };

  const patch = (key: string, change: Partial<UploadItem>) =>
    commit(
      track.current.map((item) => (item.key === key ? { ...item, ...change } : item)),
      "url" in change,
    );

  const start = async (files: FileList | File[] | null | undefined) => {
    const chosen = Array.from(files ?? []);
    if (chosen.length === 0 || uploading) return;

    setPickError("");
    const room = maxFiles - shown.filter((item) => item.status !== "error").length;

    if (room <= 0) {
      return setPickError(`That's the limit — ${maxFiles} file${maxFiles > 1 ? "s" : ""}.`);
    }
    if (chosen.length > room) {
      setPickError(`Only ${room} more file${room > 1 ? "s" : ""} fit — the rest were left out.`);
    }

    const queued: UploadItem[] = chosen.slice(0, room).map((file) => ({
      key: `${file.name}-${crypto.randomUUID()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null,
      url: null,
      status: "uploading",
      error: "",
    }));

    // seed the list with what is already answered so a restored url is not dropped
    commit([...track.current, ...queued], false);

    // one at a time: the hook tracks a single upload's progress and error
    for (const [index, file] of chosen.slice(0, room).entries()) {
      const item = queued[index]!;
      const { uploadedImageUrl, error: uploadError } = await uploadFile({
        id: `${field.id ?? draftFileName}-${item.key}`,
        file,
        sessionKey: draftFileName,
        maxSizeAllowed: fileUploadLimit(maxMb),
        path: formFilesPath,
        acceptedTypes: accepted,
        setIcon: (url) => patch(item.key, { preview: url }),
      });

      patch(item.key, {
        url: uploadedImageUrl,
        status: uploadedImageUrl ? "done" : "error",
        error: uploadedImageUrl ? "" : uploadError || "That file didn't upload.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void start(event.target.files);
    event.target.value = "";
  };

  const remove = (key: string) => {
    setPickError("");
    commit(
      track.current.filter((item) => item.key !== key),
      true,
    );
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accepted.join(",")}
      multiple={multiple}
      hidden
      onChange={handleFileChange}
    />
  );

  const dropZone = (compact: boolean) => (
    <button
      type="button"
      className={`pv-drop${compact ? " pv-drop--compact" : ""}${dragging ? " is-dragging" : ""}`}
      onClick={pick}
      disabled={uploading || roomLeft <= 0}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void start(e.dataTransfer.files);
      }}
    >
      <span className="pv-drop__glyph">
        <Icon name="upload" size={compact ? 18 : 26} />
      </span>
      {compact ? (
        <span className="pv-drop__line">
          Add {multiple ? `another — ${roomLeft} left` : "a different file"}
        </span>
      ) : (
        <>
          <h4>{multiple ? "Drop your papers here" : "Drop a paper here"}</h4>
          <p>
            or click to browse — {describeAccepted(accepted)}, max {maxMb}MB
            {multiple ? ` · up to ${maxFiles} files` : ""}
          </p>
        </>
      )}
    </button>
  );

  const notice = pickError || (items.length === 0 ? error : "");

  return (
    <div className="pv-file">
      {hiddenInput}

      {shown.length === 0 ? (
        dropZone(false)
      ) : (
        <>
          <div className="pv-filelist">
            {shown.map((item) => {
              const active = item.status === "uploading";
              const pct = active ? Math.round(progress ?? 0) : 100;
              const isImage = item.type ? item.type.startsWith("image/") : isImageUrl(item.url ?? "");
              return (
                <div
                  key={item.key}
                  className={`pv-filecard${item.status === "error" ? " is-error" : item.status === "done" ? " is-done" : " is-busy"
                    }`}
                >
                  <div className="pv-filecard__thumb">
                    {item.preview && isImage && item.status !== "error" ? (
                      <img src={item.preview} alt={item.name} />
                    ) : (
                      <Icon name={item.status === "error" ? "error" : "clip"} size={22} />
                    )}
                    {active && <span className="pv-filecard__veil">{pct}%</span>}
                  </div>

                  <div className="pv-filecard__body">
                    <span className="pv-filecard__name" title={item.name}>
                      {item.name}
                    </span>

                    {item.status === "error" ? (
                      <span className="pv-filecard__note pv-filecard__note--error">{item.error}</span>
                    ) : active ? (
                      <span className="pv-filecard__note">Uploading… {pct}%</span>
                    ) : (
                      <span className="pv-filecard__note pv-filecard__note--done">
                        <Icon name="check" size={12} /> Uploaded
                        {item.size > 0 ? ` · ${prettySize(item.size)}` : ""}
                      </span>
                    )}

                    <span className="pv-filecard__track">
                      <span className="pv-filecard__bar" style={{ width: `${pct}%` }} />
                    </span>
                  </div>

                  <div className="pv-filecard__actions">
                    <button
                      type="button"
                      className="pv-filecard__btn"
                      onClick={() => remove(item.key)}
                      disabled={active}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {roomLeft > 0 && !uploading && dropZone(true)}
          {multiple && (
            <p className="pv-file__count">
              {landed.length} of {maxFiles} attached
            </p>
          )}
        </>
      )}

      {notice && (
        <p className="pv-file__error" role="alert">
          <Icon name="error" size={14} /> {notice}
        </p>
      )}
    </div>
  );
};

const PreviewInput = ({ field, value, onChange }: PreviewInputProps) => {
  const text = typeof value === "string" ? value : "";
  const picked = Array.isArray(value) ? value : [];

  // single/multi select, radio and checkbox all read from the same option list
  if (hasOptions(field)) {
    const multiple = field.type === "multi_select" || field.type === "check_box";
    const choices = field.options.filter((opt) => opt.label.trim() !== "");

    const toggle = (optValue: string) => {
      if (!multiple) return onChange(optValue);
      return onChange(
        picked.includes(optValue) ? picked.filter((v) => v !== optValue) : [...picked, optValue],
      );
    };

    return (
      <div className={`pv-pills${multiple ? " pv-pills--two" : ""}`}>
        {choices.map((opt, i) => {
          const selected = multiple ? picked.includes(opt.value) : text === opt.value;
          return (
            <button
              key={opt.id}
              type="button"
              className={`pv-pill${selected ? " selected" : ""}${multiple ? " multi" : ""}`}
              onClick={() => toggle(opt.value)}
              aria-pressed={selected}
            >
              <span className="key">{multiple ? i + 1 : (OPTION_KEYS[i] ?? i + 1)}</span>
              <span className="txt">{opt.label}</span>
              <span className="mark">{selected && <Icon name="check" size={13} />}</span>
            </button>
          );
        })}
      </div>
    );
  }

  switch (field.type) {
    case "long_text":
      return (
        <textarea
          className="pv-textarea"
          placeholder={field.placeholder ?? "anything we should know…"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.validation?.maxLength}
        />
      );

    case "number": {
      const min = field.validation?.min ?? 0;
      const max = field.validation?.max ?? 99;
      const step = field.validation?.step ?? 1;
      const current = Number(text) || min;
      const bump = (by: number) => onChange(String(Math.min(max, Math.max(min, current + by))));

      return (
        <div className="pv-num">
          <div className="stepper">
            <button type="button" onClick={() => bump(-step)} aria-label="Decrease">
              −
            </button>
            <input
              inputMode="numeric"
              value={text}
              onChange={(e) => onChange(e.target.value.replace(/[^\d-]/g, ""))}
              aria-label={field.label}
            />
            <button type="button" onClick={() => bump(step)} aria-label="Increase">
              +
            </button>
          </div>
          <span className="unit">
            <span className="preview-note">
              {field?.validation && previewNumberNote(field.validation)}
            </span>
          </span>
        </div>
      );
    }

    case "rating": {
      const scale = Math.max(1, Math.min(10, field.validation?.max ?? 5));
      const current = Number(text) || 0;
      return (
        <div className="pv-stars" role="radiogroup" aria-label={field.label}>
          {Array.from({ length: scale }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`s${n <= current ? " on" : ""}`}
              onClick={() => onChange(String(n))}
              aria-label={`${n} of ${scale}`}
              aria-checked={n === current}
              role="radio"
            >
              <Icon name="star" size={38} />
            </button>
          ))}
        </div>
      );
    }

    case "date":
      return (
        <input
          className="pv-input pv-input--date"
          type="date"
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "file_upload":
      return <FileUploadPreview field={field} onChange={onChange} value={value} />;

    case "url":
      return (
        <div className="pv-prefix">
          <span className="prefix">https://</span>
          <input
            value={text}
            placeholder={field.placeholder ?? "your-site.com"}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    default:
      return (
        <input
          className="pv-input"
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          placeholder={field.placeholder ?? "Type your answer…"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          maxLength={field.validation?.maxLength}
        />
      );
  }
};

export default PreviewInput;
