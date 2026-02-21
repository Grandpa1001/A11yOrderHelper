import type { ContentMessage, ReaderType } from "../shared/types";
import type { FocusOrderItem } from "../shared/types";
import {
  getDocumentDimensions,
  getFocusOrderElements,
  getReadingOrderElements,
} from "./a11y-order";
import { createOverlay, removeOverlay, setOverlayOpacity } from "./overlay";

const OVERLAY_HOST_ID = "a11y-order-helper-host";
const STORAGE_KEY_THEME = "overlayTheme";

let resizeObserver: ResizeObserver | null = null;
let keepOnTopObserver: MutationObserver | null = null;
let currentOpacity = 0.5;
let currentReaderType: ReaderType = "focus";
let currentThemeName: "default" | "minimal" = "default";
let currentAnnotation = "";

/** Ostatnia lista elementów w kolejności overlay (dla sterowania focusem w testach E2E). */
let lastOrderedElements: Element[] = [];

function keepOverlayOnTop(): void {
  const host = document.getElementById(OVERLAY_HOST_ID);
  if (!host || !host.parentElement) return;
  if (host.parentElement.lastElementChild !== host) {
    host.parentElement.appendChild(host);
  }
}

function elementsToItems(elements: Element[], useDocumentCoords: boolean): FocusOrderItem[] {
  const scrollX = useDocumentCoords ? window.scrollX : 0;
  const scrollY = useDocumentCoords ? window.scrollY : 0;
  return elements.map((el, i) => {
    try {
      const rect = el.getBoundingClientRect();
      return {
        index: i + 1,
        rect: {
          left: rect.left + scrollX,
          top: rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        },
      };
    } catch {
      return { index: i + 1, rect: { left: 0, top: 0, width: 0, height: 0 } };
    }
  });
}

function runOverlay(
  readerType: ReaderType = currentReaderType,
  themeName: "default" | "minimal" = currentThemeName,
  annotation: string = currentAnnotation
): void {
  try {
    currentReaderType = readerType;
    currentThemeName = themeName;
    currentAnnotation = annotation;
    removeOverlay(document);
    const elements =
      readerType === "voiceover" || readerType === "nvda"
        ? getReadingOrderElements(document)
        : getFocusOrderElements(document);
    lastOrderedElements = elements;
    const items = elementsToItems(elements, true);
    const dimensions = getDocumentDimensions(document);
    const host = createOverlay(items, dimensions, themeName, annotation);
    document.documentElement.appendChild(host);
    setOverlayOpacity(currentOpacity, document);

    if (keepOnTopObserver) keepOnTopObserver.disconnect();
    keepOnTopObserver = new MutationObserver(() => keepOverlayOnTop());
    keepOnTopObserver.observe(document.documentElement, { childList: true, subtree: false });

    if (resizeObserver) resizeObserver.disconnect();
    resizeObserver = new ResizeObserver(() =>
      runOverlay(currentReaderType, currentThemeName)
    );
    resizeObserver.observe(document.documentElement);
  } catch {
    // Nie rzucamy dalej — strona lub DOM w nietypowym stanie
  }
}

function stopOverlay(): void {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (keepOnTopObserver) {
    keepOnTopObserver.disconnect();
    keepOnTopObserver = null;
  }
  removeOverlay(document);
}

chrome.runtime.onMessage.addListener(
  (
    message: ContentMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    try {
      if (message.type === "RUN") {
        const readerType =
          message.readerType === "voiceover" || message.readerType === "nvda"
            ? message.readerType
            : "focus";
        const annotation = typeof message.annotation === "string" ? message.annotation : "";
        chrome.storage.local.get(STORAGE_KEY_THEME, (data) => {
          const themeName =
            data[STORAGE_KEY_THEME] === "minimal" ? "minimal" : "default";
          runOverlay(readerType, themeName, annotation);
          sendResponse({ ok: true });
        });
      } else if (message.type === "STOP") {
        stopOverlay();
        sendResponse({ ok: true });
      } else if (message.type === "SET_OPACITY") {
        const value = message.opacity ?? 0;
        currentOpacity = Math.max(0, Math.min(1, value));
        setOverlayOpacity(currentOpacity, document);
        sendResponse({ ok: true });
      }
    } catch {
      sendResponse({ ok: false });
    }
    return true;
  }
);

declare global {
  interface Window {
    __a11yOrderHelperFocusAtIndex?: (index: number) => void;
  }
}

/** Ustawia focus na elemencie o indeksie w kolejności overlay (0-based). Dla testów E2E — czytnik ogłasza ten element. */
window.__a11yOrderHelperFocusAtIndex = (index: number): void => {
  const el = lastOrderedElements[index];
  if (el && el instanceof HTMLElement) el.focus();
};
