/** Współrzędne prostokąta (viewport-relative, np. z getBoundingClientRect). */
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Element w kolejności focus order z współrzędnymi. */
export interface FocusOrderItem {
  index: number;
  rect: Rect;
}

/** Wymiary dokumentu/viewport. */
export interface DocumentDimensions {
  width: number;
  height: number;
}

/** Typ czytnika / tryb kolejności (ścieżka 2). */
export type ReaderType = "focus" | "voiceover" | "nvda";

/** Typy wiadomości popup ↔ content. */
export type ContentMessageType = "RUN" | "STOP" | "SET_OPACITY";

export interface ContentMessage {
  type: ContentMessageType;
  opacity?: number;
  readerType?: ReaderType;
}
