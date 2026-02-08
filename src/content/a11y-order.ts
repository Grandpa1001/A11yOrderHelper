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

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6, [role='heading']";
const IMG_WITH_NAME_SELECTOR = "img[alt]:not([alt='']), img[aria-label], [role='img'][aria-label]";

function isExcludedForReading(el: Element): boolean {
  if (el.getAttribute("aria-hidden") === "true") return true;
  if (el.getAttribute("hidden") != null) return true;
  try {
    const style = (el as HTMLElement).ownerDocument.defaultView?.getComputedStyle(el as HTMLElement);
    if (style?.getPropertyValue("display") === "none") return true;
  } catch {
    return true;
  }
  return false;
}

function isReadingOrderElement(el: Element): boolean {
  if (el instanceof HTMLElement && el.matches(FOCUSABLE_SELECTOR)) return true;
  if (el.matches(HEADING_SELECTOR)) return true;
  if (el.matches(IMG_WITH_NAME_SELECTOR)) return true;
  return false;
}

function getReadingOrderElements(doc: Document): Element[] {
  const result: Element[] = [];
  try {
    const walker = doc.createTreeWalker(doc.body ?? doc.documentElement, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        const el = node as Element;
        if (isExcludedForReading(el)) return NodeFilter.FILTER_REJECT;
        if (!isReadingOrderElement(el)) return NodeFilter.FILTER_SKIP;
        if (!isVisible(el)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node: Element | null = walker.nextNode() as Element | null;
    while (node) {
      result.push(node);
      node = walker.nextNode() as Element | null;
    }
  } catch {
    return getFocusOrderElements(doc);
  }
  return result;
}

export function getReadingOrderWithCoordinates(
  doc: Document = document
): FocusOrderItem[] {
  try {
    const elements = getReadingOrderElements(doc);
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
