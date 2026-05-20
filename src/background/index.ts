const SIM_ID_KEY = 'simulatorWindowId';

async function getSimulatorWindowId(): Promise<number | null> {
  const data = await chrome.storage.session.get(SIM_ID_KEY);
  const id = data[SIM_ID_KEY] as number | undefined;
  if (!id || id < 0) return null;
  try {
    await chrome.windows.get(id);
    return id;
  } catch {
    return null;
  }
}

async function saveSimulatorWindowId(id: number | null) {
  await chrome.storage.session.set({ [SIM_ID_KEY]: id ?? -1 });
}

chrome.action.onClicked.addListener(async (tab) => {
  const tabUrl = tab.url ?? '';

  const existingId = await getSimulatorWindowId();
  if (existingId !== null) {
    try {
      await chrome.windows.update(existingId, { focused: true });
      await chrome.storage.session.set({ pendingUrl: tabUrl });
      return;
    } catch {
      await saveSimulatorWindowId(null);
    }
  }

  const windowUrl =
    chrome.runtime.getURL('index.html') +
    '?tabUrl=' + encodeURIComponent(tabUrl);

  const win = await chrome.windows.create({
    url: windowUrl,
    type: 'popup',
    width: 1280,
    height: 820,
    focused: true,
  });

  await saveSimulatorWindowId(win?.id ?? null);
});

chrome.windows.onRemoved.addListener(async (id) => {
  const existingId = await getSimulatorWindowId();
  if (id === existingId) await saveSimulatorWindowId(null);
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
