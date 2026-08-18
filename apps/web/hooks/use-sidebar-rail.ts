"use client";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./use-localstorage";
import { useMediaQuery } from "./use-media-query";

/** must match the label fade-out in shell.css */
const LABEL_FADE_MS = 90;

/** below this the wide sidebar costs more room than it is worth */
const FORCE_RAIL = "(max-width: 1080px)";

const STORAGE_KEY = "origami:sidebar-collapsed";

/**
 * The sidebar's two widths, and the beat between them.
 *
 * Collapsing runs in two phases: the labels fade while the column is still wide enough to
 * hold them, and only then does the rail land. Expanding is one phase — the column widens
 * and the labels fade in behind it, which css handles on its own.
 */
export function useSidebarRail() {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(STORAGE_KEY, false);
  const narrow = useMediaQuery(FORCE_RAIL);

  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const toggle = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    if (collapsed) {
      setCollapsed(false);
      return;
    }

    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setClosing(false);
      setCollapsed(true);
    }, LABEL_FADE_MS);
  };

  return {
    /** the rail is showing — by preference, or because the viewport is too narrow for more */
    railed: !!collapsed || narrow,
    /** mid-collapse: labels are on their way out, the column has not moved yet */
    closing,
    /** the stored preference alone, which is what the handle reports and flips */
    collapsed: !!collapsed,
    /** nothing to toggle when the width is forcing the rail */
    toggleable: !narrow,
    toggle,
  };
}
