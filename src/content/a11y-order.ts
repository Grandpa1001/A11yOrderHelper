import type { DocumentDimensions, FocusOrderItem, Rect } from "../shared/types";

/** Selektor elementów focusable (tab order) — bez tabindex="-1". */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Zwraca listę elementów w kolejności focus (tab order) — kolejność DOM.
 * Pomija elementy niewidoczne (zerowy rozmiar). Nie rzuca — błędy są łapane.
 */
function getFocusOrderElements(doc: Document): Element[] {
  const result: Element[] = [];
  try {
    const nodes = doc.querySelectorAll(FOCUSABLE_SELECTOR);
    nodes.forEach((el) => {
      try {
        if (isVisible(el)) result.push(el);
      } catch {
        // pomijamy element przy błędzie (np. oderwany z DOM)
      }
    });
  } catch {
    // querySelectorAll lub dokument w nietypowym stanie
  }
  return result;
}

function isVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Zwraca listę elementów w kolejności focus wraz z współrzędnymi (getBoundingClientRect).
 * Nie rzuca — przy błędzie zwraca pustą tablicę.
 */
export function getFocusOrderWithCoordinates(
  doc: Document = document
): FocusOrderItem[] {
  try {
    const elements = getFocusOrderElements(doc);
    return elements.map((el, i) => {
      try {
        const rect = el.getBoundingClientRect();
        const r: Rect = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
        return { index: i + 1, rect: r };
      } catch {
        return { index: i + 1, rect: { left: 0, top: 0, width: 0, height: 0 } };
      }
    });
  } catch {
    return [];
  }
}

/**
 * Wymiary viewportu (dla overlay 1:1 przy zablokowanym scrollu).
 */
export function getViewportDimensions(): DocumentDimensions {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
