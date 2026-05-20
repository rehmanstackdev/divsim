import { useEffect } from 'react';
import SimulatorView from './components/SimulatorView';
import DevicePanel from './components/DevicePanel';
import { useStore } from './store/deviceStore';

export default function App() {
  const { setUrl, setCurrentDevice, currentDeviceId } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabUrl = params.get('tabUrl') ?? '';

    const applyUrl = (url: string) => {
      if (url && !url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
        setUrl(url);
      }
    };

    if (tabUrl) {
      applyUrl(tabUrl);
    } else if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        const target = tabs.find(
          (t) => t.active && t.url && !t.url.startsWith('chrome') && !t.url.startsWith('chrome-extension')
        ) ?? tabs.find((t) => t.url && !t.url.startsWith('chrome'));
        if (target?.url) applyUrl(target.url);
      });
    }

    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      chrome.storage.session.onChanged.addListener((changes) => {
        if (changes.pendingUrl?.newValue) applyUrl(changes.pendingUrl.newValue as string);
      });
    }

    setCurrentDevice(currentDeviceId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <SimulatorView />
      <DevicePanel />
    </div>
  );
}
