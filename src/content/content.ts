chrome.runtime.onMessage.addListener(
  (
    message: { type: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (message.type === "RUN") {
      console.log("[A11Y Order Helper] Content script załadowany.");
      sendResponse({ ok: true });
    }
    return true;
  }
);
