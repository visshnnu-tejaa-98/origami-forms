/**
 * Origami toast — public entry point.
 *
 *   import { toast } from "~/components/origami/toast";
 *   toast.success("Form published", { title: "Nicely folded" });
 *   toast.error("Couldn't save", { action: { label: "Retry", onClick: save } });
 *
 * <OrigamiToaster /> is mounted once globally in the provider tree.
 */
export { toast } from "./toast-store";
export type { ToastOptions, ToastVariant, ToastPosition } from "./toast-store";
export { OrigamiToaster } from "./toaster";
