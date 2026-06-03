chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id == null) return;

  const tabUrl = tab.url ?? '';
  const simBase = chrome.runtime.getURL('index.html');

  // Already on the simulator — nothing to do.
  if (tabUrl.startsWith(simBase)) return;

  // Replace the current tab with the simulator, passing along the page URL
  // it was showing so the device preview auto-loads it (no manual entry).
  const simUrl = simBase + '?tabUrl=' + encodeURIComponent(tabUrl);
  await chrome.tabs.update(tab.id, { url: simUrl });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'OPEN_SIMULATOR_WINDOW') {
    const ua: string | undefined = msg.userAgent;
    chrome.windows.create(
      { url: msg.url, width: msg.width + 16, height: msg.height + 88, type: 'popup', focused: true },
      async (win) => {
        if (win?.tabs?.[0]?.id && ua) {
          // Override user agent so the site thinks it's a real mobile browser
          try {
            await chrome.scripting.executeScript({
              target: { tabId: win.tabs[0].id! },
              world: 'MAIN',
              func: (agent: string) => { Object.defineProperty(navigator, 'userAgent', { get: () => agent }); },
              args: [ua],
            });
          } catch { /* tab may not be ready yet */ }
        }
        sendResponse({ windowId: win?.id });
      }
    );
    return true;
  }
});
