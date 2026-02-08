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
  container.style.setProperty("--a11y-line-stroke", theme.lineStroke);
  container.style.setProperty(
    "--a11y-line-width",
    String(theme.lineStrokeWidth)
  );
  container.style.setProperty("--a11y-line-cap", theme.lineStrokeLinecap);
}

export function buildOverlay(
  items: FocusOrderItem[],
  dimensions: DocumentDimensions,
  theme: OverlayThemeConfig
): HTMLElement {
  const host = document.createElement("div");
  host.id = HOST_ID;

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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "a11y-lines-svg");
  svg.setAttribute("width", String(dimensions.width));
  svg.setAttribute("height", String(dimensions.height));
  svg.setAttribute("aria-hidden", "true");

  for (let i = 0; i < items.length - 1; i++) {
    const a = items[i];
    const b = items[i + 1];
    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line.setAttribute("x1", String(a.rect.left));
    line.setAttribute("y1", String(a.rect.top));
    line.setAttribute("x2", String(b.rect.left));
    line.setAttribute("y2", String(b.rect.top));
    line.setAttribute("class", "a11y-line");
    svg.appendChild(line);
  }
  container.appendChild(svg);

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

  return host;
}

export { HOST_ID, CONTAINER_CLASS };
