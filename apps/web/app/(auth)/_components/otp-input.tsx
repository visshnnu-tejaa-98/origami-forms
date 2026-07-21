"use client";

import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";

interface OtpInputProps {
  /** Current code, e.g. "1234" while partially filled. */
  value: string;
  onChange: (value: string) => void;
  /** Fired once the final digit lands (paste or typing). */
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
}

const DIGITS_ONLY = /\D/g;

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  invalid = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputs.current[clamped]?.focus();
    inputs.current[clamped]?.select();
  };

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const typed = event.target.value.replace(DIGITS_ONLY, "");
    if (!typed) return;

    // Take the last character so overwriting a filled box feels natural.
    const digit = typed[typed.length - 1]!;
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digit;
    const next = chars.join("").trimEnd().slice(0, length);

    commit(next);
    if (index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars = value.padEnd(length, " ").split("");

      if (chars[index] && chars[index] !== " ") {
        chars[index] = " ";
        commit(chars.join("").trimEnd());
        return;
      }
      // Already empty — clear the previous box and step back.
      if (index > 0) {
        chars[index - 1] = " ";
        commit(chars.join("").trimEnd());
        focusAt(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(DIGITS_ONLY, "").slice(0, length);
    if (!pasted) return;
    commit(pasted);
    focusAt(pasted.length);
  };

  return (
    <div className="otp-row" onPaste={handlePaste}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          className={`otp-box${invalid ? " is-invalid" : ""}`}
          value={value[index] ?? ""}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          inputMode="numeric"
          type="text"
          maxLength={1}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          autoComplete={index === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  );
}
