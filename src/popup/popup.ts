const popupIcon = document.getElementById("popup-icon") as HTMLImageElement | null;
if (popupIcon) popupIcon.src = chrome.runtime.getURL("icons/icon48.png");

function sendToActiveTab(message: { type: string; opacity?: number }): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId == null) return;
    chrome.tabs
      .sendMessage(tabId, message)
      .catch(() => {
        // Content script nie załadowany (chrome://, nowa karta itd.) — cicho ignorujemy
      });
  });
}

const btnRun = document.getElementById("btn-run");
if (btnRun) btnRun.addEventListener("click", () => sendToActiveTab({ type: "RUN" }));

const btnStop = document.getElementById("btn-stop");
if (btnStop) btnStop.addEventListener("click", () => sendToActiveTab({ type: "STOP" }));

const opacitySlider = document.getElementById("opacity-slider") as HTMLInputElement | null;
if (opacitySlider) {
  opacitySlider.addEventListener("input", () => {
    const value = Number(opacitySlider.value) / 100;
    sendToActiveTab({ type: "SET_OPACITY", opacity: value });
  });
}
