import type { DocumentDimensions, FocusOrderItem } from "../shared/types";
import contentCss from "./content.css?inline";

const HOST_ID = "a11y-order-helper-host";
const CONTAINER_CLASS = "a11y-overlay-container";

/**
 * Ustawia przezroczystość tła overlay (0 = tylko mapa, 1 = widać stronę pod spodem).
 * Szuka hosta i kontenera w DOM, żeby działać także po odświeżeniu overlay (np. ResizeObserver).
 */
export function setOverlayOpacity(value: number, doc: Document = document): void {
  const host = doc.getElementById(HOST_ID);
  const shadow = host?.shadowRoot;
  const container = shadow?.querySelector<HTMLElement>(`.${CONTAINER_CLASS}`);
  if (container) {
    const alpha = Math.max(0, Math.min(1, 1 - value));
    container.style.background = `rgba(255, 255, 255, ${alpha})`;
  }
}

/**
 * Tworzy host + Shadow DOM z overlay: numerki w podanych miejscach, tło białe.
 * Rozmiar warstwy 1:1 z viewportem.
 */
export function createOverlay(
  items: FocusOrderItem[],
  dimensions: DocumentDimensions
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
  container.style.background = "rgba(255, 255, 255, 1)";
  shadow.appendChild(container);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "a11y-lines-svg");
  svg.setAttribute("width", String(dimensions.width));
  svg.setAttribute("height", String(dimensions.height));
  svg.setAttribute("aria-hidden", "true");

  for (let i = 0; i < items.length - 1; i++) {
    const a = items[i];
    const b = items[i + 1];
    const x1 = a.rect.left;
    const y1 = a.rect.top;
    const x2 = b.rect.left;
    const y2 = b.rect.top;
    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
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

/**
 * Usuwa host overlay z dokumentu (jeśli istnieje).
 */
export function removeOverlay(doc: Document = document): void {
  const host = doc.getElementById(HOST_ID);
  if (host) host.remove();
}
