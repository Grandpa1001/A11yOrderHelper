import type { DocumentDimensions, FocusOrderItem } from "../shared/types";
import type { OverlayThemeConfig } from "./overlay-theme";
import contentCss from "./content.css?inline";

const HOST_ID = "a11y-order-helper-host";
const CONTAINER_CLASS = "a11y-overlay-container";

function applyThemeToContainer(
  container: HTMLElement,
  theme: OverlayThemeConfig
): void {
  container.style.setProperty("--a11y-container-bg", theme.containerBackground);
  container.style.setProperty("--a11y-badge-bg", theme.badgeBackground);
  container.style.setProperty("--a11y-badge-color", theme.badgeColor);
  container.style.setProperty("--a11y-badge-border", theme.badgeBorder);
  container.style.setProperty(
    "--a11y-badge-border-color",
    theme.badgeBorderColor
  );
  container.style.setProperty("--a11y-badge-radius", theme.badgeBorderRadius);
  container.style.setProperty("--a11y-badge-min-width", theme.badgeMinWidth);
  container.style.setProperty("--a11y-badge-height", theme.badgeHeight);
  container.style.setProperty("--a11y-badge-font-size", theme.badgeFontSize);
  container.style.setProperty("--a11y-badge-font-weight", theme.badgeFontWeight);
}

export function buildOverlay(
  items: FocusOrderItem[],
  dimensions: DocumentDimensions,
  theme: OverlayThemeConfig,
  annotation = ""
): HTMLElement {
  const host = document.createElement("div");
  host.id = HOST_ID;
  host.style.position = "absolute";
  host.style.top = "0";
  host.style.left = "0";
  host.style.width = `${dimensions.width}px`;
  host.style.height = `${dimensions.height}px`;
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";
  host.style.isolation = "isolate";

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = contentCss;
  shadow.appendChild(style);

  const container = document.createElement("div");
  container.className = CONTAINER_CLASS;
  container.style.width = `${dimensions.width}px`;
  container.style.height = `${dimensions.height}px`;
  container.style.background = theme.containerBackground;
  applyThemeToContainer(container, theme);
  shadow.appendChild(container);

  const numbersLayer = document.createElement("div");
  numbersLayer.className = "a11y-numbers-layer";
  container.appendChild(numbersLayer);

  for (const item of items) {
    const num = document.createElement("span");
    num.className = "a11y-number";
    num.textContent = String(item.index);
    num.style.left = `${item.rect.left}px`;
    num.style.top = `${item.rect.top}px`;
    numbersLayer.appendChild(num);
  }

  if (annotation.trim()) {
    const label = document.createElement("div");
    label.className = "a11y-annotation";
    label.textContent = annotation.trim();
    shadow.appendChild(label);
  }

  return host;
}

export { HOST_ID, CONTAINER_CLASS };
