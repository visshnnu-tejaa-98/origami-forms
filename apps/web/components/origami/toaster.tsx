"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "./icon";
import {
  dismissToast,
  getServerToasts,
  getToasts,
  subscribeToasts,
  type ToastPosition,
  type ToastRecord,
  type ToastVariant,
} from "./toast-store";

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  success: "checkCircle",
  error: "alertCircle",
  warning: "alertTriangle",
  info: "info",
};

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function OrigamiToaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Portal only after mount so server and first client render agree.
  if (!mounted) return null;

  const byPosition = (position: ToastPosition) => toasts.filter((t) => t.position === position);

  return createPortal(
    <>
      {POSITIONS.map((position) => {
        const group = byPosition(position);
        if (group.length === 0) return null;
        return (
          <div
            key={position}
            className="o-toast-region"
            data-position={position}
            role="region"
            aria-label="Notifications"
          >
            {group.map((toast) => (
              <ToastCard key={toast.id} toast={toast} />
            ))}
          </div>
        );
      })}
    </>,
    document.body,
  );
}

function ToastCard({ toast }: { toast: ToastRecord }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const start = () => {
    clear();
    if (toast.open && Number.isFinite(toast.duration)) {
      timer.current = setTimeout(() => dismissToast(toast.id), toast.duration);
    }
  };

  useEffect(() => {
    start();
    return clear;
    // Re-arm when open flips or duration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.open, toast.duration]);

  const showIcon = toast.icon !== false;
  const iconNode = toast.icon ? (
    toast.icon
  ) : (
    <Icon name={VARIANT_ICON[toast.variant]} size={20} weight={2} />
  );

  return (
    <div
      className="o-toast"
      data-variant={toast.variant}
      data-state={toast.open ? "open" : "closed"}
      role={toast.variant === "error" ? "alert" : "status"}
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
      onMouseEnter={clear}
      onMouseLeave={start}
    >
      <span className="o-toast-stripe" aria-hidden="true" />

      {showIcon ? <span className="o-toast-icon">{iconNode}</span> : null}

      <div className="o-toast-body">
        {toast.title ? <p className="o-toast-title">{toast.title}</p> : null}
        <div className="o-toast-message">{toast.message}</div>
        {toast.action ? (
          <button
            type="button"
            className="o-toast-action"
            onClick={() => {
              toast.action?.onClick();
              dismissToast(toast.id);
            }}
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>

      {toast.dismissible ? (
        <button
          type="button"
          className="o-toast-close"
          aria-label="Dismiss notification"
          onClick={() => dismissToast(toast.id)}
        >
          <Icon name="x" size={15} weight={2} />
        </button>
      ) : null}
    </div>
  );
}
