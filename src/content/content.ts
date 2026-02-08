import type { ContentMessage, ReaderType } from "../shared/types";
import {
  getFocusOrderWithCoordinates,
  getReadingOrderWithCoordinates,
  getViewportDimensions,
} from "./a11y-order";
import { createOverlay, removeOverlay, setOverlayOpacity } from "./overlay";

const OVERLAY_HOST_ID = "a11y-order-helper-host";
const STORAGE_KEY_THEME = "overlayTheme";

let resizeObserver: ResizeObserver | null = null;
let keepOnTopObserver: MutationObserver | null = null;
let currentOpacity = 0;
let currentReaderType: ReaderType = "focus";
let currentThemeName: "default" | "minimal" = "default";

function keepOverlayOnTop(): void {
  const host = document.getElementById(OVERLAY_HOST_ID);
  if (!host || !host.parentElement) return;
  if (host.parentElement.lastElementChild !== host) {
    host.parentElement.appendChild(host);
  }
}

function runOverlay(
  readerType: ReaderType = currentReaderType,
  themeName: "default" | "minimal" = currentThemeName
): void {
  try {
    currentReaderType = readerType;
    currentThemeName = themeName;
    removeOverlay(document);
    const items =
      readerType === "voiceover" || readerType === "nvda"
        ? getReadingOrderWithCoordinates(document)
        : getFocusOrderWithCoordinates(document);
    const dimensions = getViewportDimensions();
    const host = createOverlay(items, dimensions, themeName);
    document.body.appendChild(host);
    setOverlayOpacity(currentOpacity, document);

    if (keepOnTopObserver) keepOnTopObserver.disconnect();
    keepOnTopObserver = new MutationObserver(() => keepOverlayOnTop());
    keepOnTopObserver.observe(document.body, { childList: true, subtree: false });

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
        chrome.storage.local.get(STORAGE_KEY_THEME, (data) => {
          const themeName =
            data[STORAGE_KEY_THEME] === "minimal" ? "minimal" : "default";
          runOverlay(readerType, themeName);
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
