import type { ReactNode } from "react";

/**
 * Origami toast — a tiny framework-agnostic store.
 *
 * The `toast` object can be called from anywhere (event handlers, tRPC
 * callbacks, plain functions) — it doesn't need React context. A single
 * <OrigamiToaster /> mounted in the provider tree subscribes and renders.
 */

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Provide to update/replace an existing toast. */
  id?: string;
  /** Bold heading above the message. Optional. */
  title?: string;
  /** Variant drives colour + default icon. */
  variant?: ToastVariant;
  /** Auto-dismiss after N ms. Use `Infinity` to keep it until closed. */
  duration?: number;
  /** Show the close (×) button. Default: true. */
  dismissible?: boolean;
  /** Override the icon, or pass `false` to hide it. */
  icon?: ReactNode | false;
  /** Where it appears. Default: "bottom-right". */
  position?: ToastPosition;
  /** Optional single action button. */
  action?: ToastAction;
  /** Called when the toast leaves the screen (any reason). */
  onDismiss?: (id: string) => void;
}

export interface ToastRecord {
  id: string;
  message: ReactNode;
  title?: string;
  variant: ToastVariant;
  duration: number;
  dismissible: boolean;
  icon?: ReactNode | false;
  position: ToastPosition;
  action?: ToastAction;
  onDismiss?: (id: string) => void;
  /** false while animating out. */
  open: boolean;
  createdAt: number;
}

const DEFAULT_DURATION = 4500;
const EXIT_MS = 240;

let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit() {
  // New array reference so useSyncExternalStore re-renders.
  toasts = [...toasts];
  for (const listener of listeners) listener();
}

function upsert(message: ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `t${++counter}`;
  const existing = toasts.find((t) => t.id === id);

  const record: ToastRecord = {
    id,
    message,
    title: options.title,
    variant: options.variant ?? "info",
    duration: options.duration ?? DEFAULT_DURATION,
    dismissible: options.dismissible ?? true,
    icon: options.icon,
    position: options.position ?? "bottom-right",
    action: options.action,
    onDismiss: options.onDismiss,
    open: true,
    createdAt: Date.now(),
  };

  toasts = existing ? toasts.map((t) => (t.id === id ? record : t)) : [...toasts, record];
  emit();
  return id;
}

/** Begin the exit animation, then remove after it finishes. */
function dismiss(id?: string) {
  if (id === undefined) {
    toasts.forEach((t) => dismiss(t.id));
    return;
  }
  const target = toasts.find((t) => t.id === id);
  if (!target || !target.open) return;

  toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  emit();
  target.onDismiss?.(id);

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, EXIT_MS);
}

type ToastFn = ((message: ReactNode, options?: ToastOptions) => string) & {
  success: (message: ReactNode, options?: ToastOptions) => string;
  error: (message: ReactNode, options?: ToastOptions) => string;
  warning: (message: ReactNode, options?: ToastOptions) => string;
  info: (message: ReactNode, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
};

const base = (message: ReactNode, options?: ToastOptions) => upsert(message, options);

export const toast: ToastFn = Object.assign(base, {
  success: (message: ReactNode, options?: ToastOptions) => upsert(message, { ...options, variant: "success" }),
  error: (message: ReactNode, options?: ToastOptions) => upsert(message, { ...options, variant: "error" }),
  warning: (message: ReactNode, options?: ToastOptions) => upsert(message, { ...options, variant: "warning" }),
  info: (message: ReactNode, options?: ToastOptions) => upsert(message, { ...options, variant: "info" }),
  dismiss,
});

/* ---- store plumbing for useSyncExternalStore ---- */
export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getToasts() {
  return toasts;
}
export function getServerToasts(): ToastRecord[] {
  return EMPTY;
}
const EMPTY: ToastRecord[] = [];

export { dismiss as dismissToast, EXIT_MS };
