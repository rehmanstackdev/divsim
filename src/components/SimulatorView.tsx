import { useRef, useState, useEffect } from 'react';
import { useStore } from '../store/deviceStore';
import PhoneFrame from './PhoneFrame';

function useSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/* ── Floating controls overlay ────────────────────────────────────── */
function Controls() {
  const { viewports, currentDeviceId, setZoom, rotateDevice, devices } = useStore();
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const device   = devices.find((d) => d.id === currentDeviceId);
  const zoom     = viewport?.zoom ?? 100;

  const openInWindow = () => {
    if (!viewport || !device) return;
    const url = viewport.url;
    const w   = viewport.isLandscape ? device.height : device.width;
    const h   = viewport.isLandscape ? device.width  : device.height;
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'OPEN_SIMULATOR_WINDOW', url, width: w, height: h });
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 14, right: 16,
      display: 'flex', alignItems: 'center', gap: 6, zIndex: 20,
    }}>
      {/* Zoom */}
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '3px 4px', gap: 2 }}>
        <button onClick={() => setZoom(currentDeviceId, Math.max(25, zoom - 25))} style={btnStyle}>−</button>
        <span style={{ color: '#fff', fontSize: 12, fontFamily: 'monospace', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
        <button onClick={() => setZoom(currentDeviceId, Math.min(200, zoom + 25))} style={btnStyle}>+</button>
      </div>
      {/* Rotate */}
      <button onClick={() => rotateDevice(currentDeviceId)} title="Rotate" style={{ ...iconBtnStyle }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
      </button>
      {/* Open in window */}
      <button onClick={openInWindow} title="Open at real device size" style={{ ...iconBtnStyle, background: '#007AFF', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open in Window
      </button>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#fff', fontSize: 16,
  cursor: 'pointer', padding: '2px 6px', borderRadius: 4,
  lineHeight: 1, opacity: 0.8,
};
const iconBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff',
  cursor: 'pointer', padding: 7, borderRadius: 8, display: 'flex',
  alignItems: 'center', justifyContent: 'center', opacity: 0.9,
};

/* ── Bottom info bar ──────────────────────────────────────────────── */
function InfoBar() {
  const { viewports, currentDeviceId, devices } = useStore();
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const device   = devices.find((d) => d.id === currentDeviceId);
  if (!viewport || !device) return null;

  const w = viewport.isLandscape ? device.height : device.width;
  const h = viewport.isLandscape ? device.width  : device.height;
  let domain = viewport.url;
  try { domain = new URL(viewport.url).hostname; } catch { /* keep raw */ }

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 36, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 18px', color: 'rgba(255,255,255,0.7)', fontSize: 12,
    }}>
      <span>{device.name}</span>
      <span style={{ fontFamily: 'monospace' }}>{w}×{h} · {device.pixelRatio}x · {viewport.zoom}%</span>
      <span style={{ opacity: 0.6 }}>{domain}</span>
    </div>
  );
}

/* ── URL input ────────────────────────────────────────────────────── */
function UrlInput() {
  const { viewports, currentDeviceId, setUrl } = useStore();
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const [val, setVal] = useState(viewport?.url ?? '');

  useEffect(() => { if (viewport?.url) setVal(viewport.url); }, [viewport?.url]);

  const go = () => {
    let url = val.trim();
    if (url && !/^https?:\/\//.test(url)) url = 'https://' + url;
    if (url) { setVal(url); setUrl(url); }
  };

  return (
    <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: 420 }}>
      <div style={{ display: 'flex', background: 'rgba(30,30,40,0.85)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '6px 10px', gap: 8, alignItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder="Enter URL and press Enter…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e0e6ff', fontSize: 13, fontFamily: 'monospace' }}
          spellCheck={false}
        />
        <button onClick={go} style={{ background: '#007AFF', border: 'none', borderRadius: 7, padding: '4px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Go</button>
      </div>
    </div>
  );
}

/* ── Main view ────────────────────────────────────────────────────── */
export default function SimulatorView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(containerRef);
  const { currentDeviceId, devices, viewports } = useStore();

  const device  = devices.find((d) => d.id === currentDeviceId);
  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, position: 'relative', background: '#1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Subtle radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,122,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {device && viewport && width > 0 && height > 0 ? (
        <PhoneFrame device={device} viewport={viewport} containerW={width} containerH={height - 80} />
      ) : (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: 12 }}><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>
          <p style={{ fontSize: 14, margin: 0 }}>Select a device on the right</p>
        </div>
      )}

      <Controls />
      <UrlInput />
      <InfoBar />
    </div>
  );
}
