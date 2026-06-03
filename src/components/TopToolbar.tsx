import { useState, useEffect } from 'react';
import { useStore } from '../store/deviceStore';

/* ─── SVG icon helpers ─────────────────────────────────────────── */
function IconRotate() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

/* ─── URL bar ──────────────────────────────────────────────────── */
function UrlBar() {
  const { viewports, currentDeviceId, setUrl } = useStore();
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const [localUrl, setLocalUrl] = useState(viewport?.url ?? 'https://example.com');

  useEffect(() => {
    if (viewport?.url) setLocalUrl(viewport.url);
  }, [viewport?.url]);

  const handleNavigate = () => {
    let url = localUrl.trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (url) {
      setLocalUrl(url);
      setUrl(url);
    }
  };

  return (
    <div className="flex items-center flex-1 mx-3 gap-1.5">
      <div className="flex-1 relative">
        <input
          type="url"
          className="input-field pr-8 text-sm font-mono text-surface-100/80 w-full"
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
          placeholder="Enter URL…"
          spellCheck={false}
        />
        {/* globe icon inside input */}
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-70 pointer-events-none"
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
      <button
        className="toolbar-btn p-2"
        onClick={handleNavigate}
        title="Go / Refresh"
      >
        <IconRefresh />
      </button>
    </div>
  );
}

/* ─── Zoom controls ────────────────────────────────────────────── */
function ZoomControls() {
  const { viewports, setZoom, currentDeviceId } = useStore();
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const zoom = viewport?.zoom ?? 100;

  return (
    <div className="flex items-center gap-0.5 bg-surface-20 border border-surface-30 rounded-lg px-1">
      <button
        className="toolbar-btn p-1.5 text-base leading-none"
        onClick={() => setZoom(currentDeviceId, Math.max(25, zoom - 25))}
        title="Zoom out"
      >−</button>
      <span className="text-xs font-mono text-surface-90 w-9 text-center select-none">{zoom}%</span>
      <button
        className="toolbar-btn p-1.5 text-base leading-none"
        onClick={() => setZoom(currentDeviceId, Math.min(200, zoom + 25))}
        title="Zoom in"
      >+</button>
    </div>
  );
}

/* ─── Open in window button ────────────────────────────────────── */
function OpenInWindowButton() {
  const { viewports, currentDeviceId, devices } = useStore();
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const device = devices.find((d) => d.id === currentDeviceId);

  const handleOpen = () => {
    if (!viewport || !device) return;
    const url = viewport.url;
    const width = viewport.isLandscape ? device.height : device.width;
    const height = viewport.isLandscape ? device.width : device.height;

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: 'OPEN_SIMULATOR_WINDOW',
        url,
        width,
        height,
        userAgent: device.userAgent ?? '',
      });
    } else {
      window.open(url, '_blank', `width=${width},height=${height}`);
    }
  };

  return (
    <button
      className="btn-primary text-xs gap-1.5 py-1.5 px-2.5"
      onClick={handleOpen}
      title="Open in a real browser window at device size"
    >
      <IconExternal />
      Open in Window
    </button>
  );
}

/* ─── Main toolbar ─────────────────────────────────────────────── */
export default function TopToolbar() {
  const {
    darkMode, toggleDarkMode,
    multiDeviceView, toggleMultiDeviceView,
    viewports, currentDeviceId, rotateDevice,
    screenshotMode, setScreenshotMode,
  } = useStore();

  const hasViewport = viewports.some((v) => v.deviceId === currentDeviceId);

  return (
    <header
      className="flex items-center justify-between px-3 flex-shrink-0 border-b border-surface-30"
      style={{ height: 52, background: '#161e30' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div className="leading-none">
          <span className="text-sm font-bold text-surface-100 tracking-tight">DeviceLens</span>
          <span className="block text-[10px] text-surface-70 font-mono leading-none mt-0.5">v1.0</span>
        </div>
      </div>

      {/* URL bar */}
      <UrlBar />

      {/* Right controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {hasViewport && <ZoomControls />}

        <div className="w-px h-5 bg-surface-30 mx-1" />

        {hasViewport && (
          <button
            className="toolbar-btn"
            onClick={() => rotateDevice(currentDeviceId)}
            title="Rotate device"
          >
            <IconRotate />
          </button>
        )}

        <button
          className={`toolbar-btn ${multiDeviceView ? 'toolbar-btn-active' : ''}`}
          onClick={toggleMultiDeviceView}
          title="Multi-device view"
        >
          <IconGrid />
        </button>

        <button
          className={`toolbar-btn ${screenshotMode ? 'toolbar-btn-active' : ''}`}
          onClick={() => setScreenshotMode(!screenshotMode)}
          title="Screenshot mode"
        >
          <IconCamera />
        </button>

        <button
          className="toolbar-btn"
          onClick={toggleDarkMode}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>

        <div className="w-px h-5 bg-surface-30 mx-1" />

        <OpenInWindowButton />
      </div>
    </header>
  );
}
