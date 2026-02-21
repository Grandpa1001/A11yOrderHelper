import type { ReaderType } from "../shared/types";

const STORAGE_KEY_READER = "readerType";
const STORAGE_KEY_THEME = "overlayTheme";
const STORAGE_KEY_ANNOTATION = "annotation";

const popupIcon = document.getElementById("popup-icon") as HTMLImageElement | null;
if (popupIcon) popupIcon.src = chrome.runtime.getURL("icons/icon48.png");

const popupVersion = document.getElementById("popup-version");
if (popupVersion) {
  const { version } = chrome.runtime.getManifest();
  popupVersion.textContent = `v${version}`;
}

function getDefaultReaderByOS(): ReaderType {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() ?? "";
  if (platform.includes("mac") || ua.includes("mac")) return "voiceover";
  if (platform.includes("win") || ua.includes("windows")) return "nvda";
  return "focus";
}

function getSelectedReader(): ReaderType {
  const checked = document.querySelector<HTMLInputElement>('input[name="reader"]:checked');
  const v = checked?.value as ReaderType | undefined;
  return v === "voiceover" || v === "nvda" ? v : "focus";
}

function setSelectedReader(value: ReaderType): void {
  const el = document.querySelector<HTMLInputElement>(`input[name="reader"][value="${value}"]`);
  if (el) el.checked = true;
}

function loadStoredReader(): void {
  chrome.storage.local.get(STORAGE_KEY_READER, (data) => {
    const stored = data[STORAGE_KEY_READER] as string | undefined;
    const value: ReaderType =
      stored === "voiceover" || stored === "nvda" ? stored : stored === "focus" ? "focus" : getDefaultReaderByOS();
    setSelectedReader(value);
  });
}

function saveReader(value: ReaderType): void {
  chrome.storage.local.set({ [STORAGE_KEY_READER]: value });
}

function getSelectedTheme(): "default" | "minimal" {
  const el = document.getElementById("theme-select") as HTMLSelectElement | null;
  return el?.value === "minimal" ? "minimal" : "default";
}

function setSelectedTheme(value: "default" | "minimal"): void {
  const el = document.getElementById("theme-select") as HTMLSelectElement | null;
  if (el) el.value = value;
}

function loadStoredTheme(): void {
  chrome.storage.local.get(STORAGE_KEY_THEME, (data) => {
    const stored = data[STORAGE_KEY_THEME] as string | undefined;
    setSelectedTheme(stored === "minimal" ? "minimal" : "default");
  });
}

function saveTheme(value: "default" | "minimal"): void {
  chrome.storage.local.set({ [STORAGE_KEY_THEME]: value });
}

const annotationInput = document.getElementById("annotation-input") as HTMLInputElement | null;

function loadStoredAnnotation(): void {
  chrome.storage.local.get(STORAGE_KEY_ANNOTATION, (data) => {
    const stored = data[STORAGE_KEY_ANNOTATION] as string | undefined;
    if (annotationInput && stored != null) annotationInput.value = stored;
  });
}

function saveAnnotation(value: string): void {
  chrome.storage.local.set({ [STORAGE_KEY_ANNOTATION]: value });
}

function sendToActiveTab(message: { type: string; opacity?: number; readerType?: ReaderType; annotation?: string }): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId == null) return;
    chrome.tabs
      .sendMessage(tabId, message)
      .catch(() => {});
  });
}

loadStoredReader();
loadStoredTheme();
loadStoredAnnotation();

document.querySelectorAll<HTMLInputElement>('input[name="reader"]').forEach((input) => {
  input.addEventListener("change", () => saveReader(getSelectedReader()));
});

const themeSelect = document.getElementById("theme-select") as HTMLSelectElement | null;
if (themeSelect) themeSelect.addEventListener("change", () => saveTheme(getSelectedTheme()));

if (annotationInput) {
  annotationInput.addEventListener("input", () => saveAnnotation(annotationInput.value));
}

const btnDateNow = document.getElementById("btn-date-now");
if (btnDateNow && annotationInput) {
  btnDateNow.addEventListener("click", () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const sep = annotationInput.value.trim() ? " " : "";
    annotationInput.value = annotationInput.value.trimEnd() + sep + stamp;
    saveAnnotation(annotationInput.value);
    annotationInput.focus();
  });
}

const btnRun = document.getElementById("btn-run");
if (btnRun) {
  btnRun.addEventListener("click", () => {
    const annotation = annotationInput?.value.trim() ?? "";
    sendToActiveTab({ type: "RUN", readerType: getSelectedReader(), annotation });
  });
}

const btnStop = document.getElementById("btn-stop");
if (btnStop) btnStop.addEventListener("click", () => sendToActiveTab({ type: "STOP" }));

const opacitySlider = document.getElementById("opacity-slider") as HTMLInputElement | null;
if (opacitySlider) {
  opacitySlider.addEventListener("input", () => {
    sendToActiveTab({ type: "SET_OPACITY", opacity: Number(opacitySlider.value) / 100 });
  });
}
