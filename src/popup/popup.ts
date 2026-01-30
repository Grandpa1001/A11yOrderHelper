const btnRun = document.getElementById("btn-run");
if (btnRun) {
  btnRun.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId != null) {
        chrome.tabs.sendMessage(tabId, { type: "RUN" });
      }
    });
  });
}
