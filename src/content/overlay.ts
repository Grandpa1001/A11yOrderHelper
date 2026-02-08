import type { DocumentDimensions, FocusOrderItem } from "../shared/types";
import { buildOverlay, CONTAINER_CLASS, HOST_ID } from "./overlay-component";
import { getTheme, type OverlayThemeName } from "./overlay-theme";

export function setOverlayOpacity(value: number, doc: Document = document): void {
  const host = doc.getElementById(HOST_ID);
  const shadow = host?.shadowRoot;
  const container = shadow?.querySelector<HTMLElement>(`.${CONTAINER_CLASS}`);
  if (container) {
    const alpha = Math.max(0, Math.min(1, 1 - value));
    container.style.background = `rgba(255, 255, 255, ${alpha})`;
  }
}

export function createOverlay(
  items: FocusOrderItem[],
  dimensions: DocumentDimensions,
  themeName: OverlayThemeName = "default"
): HTMLElement {
  const theme = getTheme(themeName);
  return buildOverlay(items, dimensions, theme);
}

export function removeOverlay(doc: Document = document): void {
  const host = doc.getElementById(HOST_ID);
  if (host) host.remove();
}
