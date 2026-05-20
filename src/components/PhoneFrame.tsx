import { useState, useEffect, useRef } from 'react';
import type { DevicePreset, ViewportState } from '../types';

/* ── live clock ─────────────────────────────────────────────────── */
function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  useEffect(() => {
    const id = setInterval(() =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    , 10000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── SVG status-bar icons ────────────────────────────────────────── */
function SignalIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <rect x="0"  y="7" width="3" height="5" rx="0.5" opacity="1"/>
      <rect x="4.5"y="5" width="3" height="7" rx="0.5" opacity="1"/>
      <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" opacity="1"/>
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3"/>
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M1 4.5C3.8 1.8 12.2 1.8 15 4.5" opacity="0.4"/>
      <path d="M3.5 7C5.2 5.3 10.8 5.3 12.5 7"/>
      <path d="M6 9.5C6.9 8.6 9.1 8.6 10 9.5"/>
      <circle cx="8" cy="11.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35"/>
      <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/>
      <path d="M23 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

/* ── iOS status bar ──────────────────────────────────────────────── */
function IOSStatusBar({ color = '#fff', hasNotch }: { color?: string; hasNotch: boolean }) {
  const time = useClock();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: hasNotch ? 44 : 28,
      paddingLeft: hasNotch ? 28 : 14,
      paddingRight: hasNotch ? 28 : 14,
      paddingTop: hasNotch ? 12 : 6,
      color,
      flexShrink: 0,
      position: 'relative',
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

/* ── Android status bar ──────────────────────────────────────────── */
function AndroidStatusBar({ color = '#fff' }: { color?: string }) {
  const time = useClock();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 28, padding: '0 14px', color, flexShrink: 0,
    }}>
      <span style={{ fontSize: 12, fontWeight: 500 }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

/* ── Dynamic Island (iPhone 14 Pro+) ────────────────────────────── */
function DynamicIsland() {
  return (
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      width: 120, height: 34, background: '#000',
      borderRadius: 20, zIndex: 30,
    }} />
  );
}

/* ── Notch (iPhone X–13) ─────────────────────────────────────────── */
function Notch() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: 150, height: 30, background: 'inherit',
      borderRadius: '0 0 20px 20px', zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      <div style={{ width: 60, height: 6, background: '#1a1a1a', borderRadius: 3 }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a' }} />
    </div>
  );
}

/* ── Punch-hole camera (Android) ─────────────────────────────────── */
function PunchHole() {
  return (
    <div style={{
      position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
      width: 12, height: 12, borderRadius: '50%', background: '#0a0a0a', zIndex: 30,
    }} />
  );
}

/* ── Home indicator ──────────────────────────────────────────────── */
function HomeBar({ width }: { width: number }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
      width: width * 0.32, height: 4, background: 'rgba(0,0,0,0.25)',
      borderRadius: 4, zIndex: 30,
    }} />
  );
}

/* ── iOS Safari chrome ───────────────────────────────────────────── */
function SafariChrome({ url }: { url: string }) {
  let display = url;
  try { display = new URL(url).hostname; } catch { /* keep raw */ }

  return (
    <div style={{ flexShrink: 0, background: '#f2f2f7', borderTop: '0.5px solid #c6c6c8' }}>
      {/* Address bar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
        <span style={{ fontSize: 16, color: '#555', flexShrink: 0 }}>AA</span>
        <div style={{
          flex: 1, height: 34, background: '#e5e5ea', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontSize: 13, color: '#333', fontWeight: 400 }}>{display}</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ flexShrink: 0 }}>
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-.07-8.85"/>
        </svg>
      </div>
      {/* Navigation row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '4px 12px 10px' }}>
        {[
          <path key="b" d="M15 18l-6-6 6-6"/>,
          <path key="f" d="M9 18l6-6-6-6"/>,
          <><rect key="r1" x="3" y="3" width="7" height="7"/><rect key="r2" x="14" y="3" width="7" height="7"/><rect key="r3" x="3" y="14" width="7" height="7"/><rect key="r4" x="14" y="14" width="7" height="7"/></>,
          <><path key="s1" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline key="s2" points="16 6 12 2 8 6"/><line key="s3" x1="12" y1="2" x2="12" y2="15"/></>,
          <><path key="b1" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></>,
        ].map((icon, i) => (
          <button key={i} style={{ background: 'none', border: 'none', padding: 6, cursor: 'default', color: '#555' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {icon}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Android nav bar ─────────────────────────────────────────────── */
function AndroidNavBar() {
  return (
    <div style={{ height: 36, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexShrink: 0 }}>
      {['◁','●','▣'].map((sym) => (
        <span key={sym} style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>{sym}</span>
      ))}
    </div>
  );
}

/* ── Iframe with loading/blocked state ───────────────────────────── */
function SiteIframe({ url, width, height, userAgent }: { url: string; width: number; height: number; userAgent?: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!url) { setStatus('blocked'); return; }
    setStatus('loading');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('blocked'), 6000);
    return () => clearTimeout(timerRef.current);
  }, [url]);

  const openInWindow = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'OPEN_SIMULATOR_WINDOW', url, width, height, userAgent });
    }
  };

  return (
    <div style={{ position: 'relative', width, height, background: '#fff', overflow: 'hidden', flexShrink: 0 }}>
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, background: '#f5f5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, zIndex: 5 }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ width: 32, height: 32, border: '3px solid #ddd', borderTopColor: '#007AFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13, color: '#999' }}>Loading preview…</span>
        </div>
      )}
      {status === 'blocked' && (
        <div style={{ position: 'absolute', inset: 0, background: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 28, zIndex: 5 }}>
          <div style={{ width: 52, height: 52, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#333', margin: '0 0 6px' }}>Site blocks embedding</p>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, margin: 0 }}>
              This site prevents loading inside<br/>frames. Open it in a real window.
            </p>
          </div>
          <button
            onClick={openInWindow}
            style={{
              background: '#007AFF', color: '#fff', border: 'none',
              borderRadius: 10, padding: '9px 18px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open in Simulated Window
          </button>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url || 'about:blank'}
        width={width}
        height={height}
        style={{ border: 'none', display: 'block' }}
        onLoad={() => { clearTimeout(timerRef.current); setStatus('loaded'); }}
        onError={() => { clearTimeout(timerRef.current); setStatus('blocked'); }}
        title="preview"
      />
    </div>
  );
}

/* ── Side buttons ─────────────────────────────────────────────────── */
function SideButtons({ frameH, isIPhone }: { frameH: number; isIPhone: boolean }) {
  const btnStyle = (top: number, h: number, side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top,
    [side]: -4,
    width: 4,
    height: h,
    background: 'linear-gradient(90deg,#2c2c2e,#3a3a3c)',
    borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
  });
  return (
    <>
      {isIPhone && <div style={btnStyle(Math.round(frameH * 0.14), 32, 'left')} title="Silent" />}
      <div style={btnStyle(Math.round(frameH * (isIPhone ? 0.22 : 0.2)), 36, 'left')} title="Vol+" />
      <div style={btnStyle(Math.round(frameH * (isIPhone ? 0.31 : 0.29)), 36, 'left')} title="Vol-" />
      <div style={btnStyle(Math.round(frameH * 0.22), isIPhone ? 52 : 44, 'right')} title="Power" />
    </>
  );
}

/* ── Watch frame ──────────────────────────────────────────────────── */
function WatchFrame({ device, viewport, scale }: { device: DevicePreset; viewport: ViewportState; scale: number }) {
  const W = device.width  * scale;
  const H = device.height * scale;
  return (
    <div style={{ position: 'relative' }}>
      {/* Crown */}
      <div style={{ position: 'absolute', right: -6, top: '30%', width: 6, height: 28 * scale, background: '#2c2c2e', borderRadius: '0 3px 3px 0' }} />
      <div style={{
        width: W + 16, height: H + 24,
        background: 'linear-gradient(145deg,#2c2c2e,#1c1c1e)',
        borderRadius: device.id === 'watch-wearos' ? '50%' : Math.min(W, H) * 0.28,
        padding: '12px 8px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <SiteIframe url={viewport.url} width={device.width} height={device.height} userAgent={device.userAgent} />
      </div>
    </div>
  );
}

/* ── Desktop / TV frame ───────────────────────────────────────────── */
function DesktopFrame({ device, viewport, scale }: { device: DevicePreset; viewport: ViewportState; scale: number }) {
  const W = device.width  * scale;
  const H = device.height * scale;
  const chromeH = 36;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Monitor shell */}
      <div style={{
        background: '#1c1c1e', borderRadius: 8,
        padding: '6px 6px 0',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        border: '1px solid #3a3a3c',
      }}>
        {/* Browser chrome */}
        <div style={{ width: W, height: chromeH, background: '#2c2c2e', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ef4444','#f59e0b','#22c55e'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, height: 20, background: '#1c1c1e', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, color: '#666', fontFamily: 'monospace' }}>
              {(() => { try { return new URL(viewport.url).hostname; } catch { return viewport.url; } })()}
            </span>
          </div>
        </div>
        {/* Screen */}
        <div style={{ width: W, height: H, overflow: 'hidden' }}>
          <div style={{ width: device.width, height: device.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <SiteIframe url={viewport.url} width={device.width} height={device.height} userAgent={device.userAgent} />
          </div>
        </div>
      </div>
      {/* Stand */}
      <div style={{ width: 60 * scale, height: 20, background: '#2c2c2e', clipPath: 'polygon(20% 0,80% 0,100% 100%,0 100%)' }} />
      <div style={{ width: 100 * scale, height: 6, background: '#1c1c1e', borderRadius: 3 }} />
    </div>
  );
}

/* ── Main PhoneFrame ──────────────────────────────────────────────── */
export interface PhoneFrameProps {
  device: DevicePreset;
  viewport: ViewportState;
  containerW: number;
  containerH: number;
}

export default function PhoneFrame({ device, viewport, containerW, containerH }: PhoneFrameProps) {
  const isIPhone   = device.category === 'iphone';
  const isAndroid  = device.category === 'android-phone';
  const isWatch    = device.category === 'smartwatch';
  const isDesktop  = ['desktop','large-display','tv'].includes(device.category);
  const isTablet   = ['ipad','android-tablet'].includes(device.category);

  const devW = viewport.isLandscape ? device.height : device.width;
  const devH = viewport.isLandscape ? device.width  : device.height;

  // Dynamic island only for iPhone 14 Pro, 15*
  const hasDynamicIsland = isIPhone && (device.id.includes('14pro') || device.id.includes('15'));
  const hasNotch = isIPhone && !hasDynamicIsland && !['ip-5','ip-se2016'].includes(device.id);
  const hasHomeButton = ['ip-5','ip-se2016'].includes(device.id);
  const hasHomeBar = isIPhone && !hasHomeButton;

  // Heights of chrome areas inside the screen
  const STATUS_H = isIPhone ? (hasNotch || hasDynamicIsland ? 44 : 20) : isAndroid ? 28 : 0;
  const SAFARI_H = (isIPhone || isTablet) && !hasHomeButton ? 98 : 0;  // address bar + nav bar
  const NAV_H    = isAndroid ? 36 : 0;
  const CHROME_H = STATUS_H + SAFARI_H + NAV_H;

  // Bezel thickness
  const BEZEL = isWatch ? 8 : isDesktop ? 0 : (isIPhone || isTablet) ? 14 : 10;
  const RADIUS = isIPhone ? 52 : isTablet ? 24 : isAndroid ? 32 : 12;

  const frameW = devW + BEZEL * 2;
  const frameH = devH + BEZEL * 2;

  // Scale to fit container with padding
  const PAD = 40;
  const scale = Math.min((containerW - PAD) / frameW, (containerH - PAD) / frameH, 1.4);

  if (isWatch) return <WatchFrame device={device} viewport={viewport} scale={scale} />;
  if (isDesktop) {
    const deskScale = Math.min((containerW - PAD) / devW, (containerH - PAD) / devH, 1);
    return <DesktopFrame device={device} viewport={viewport} scale={deskScale} />;
  }

  const scaledFrameW  = frameW * scale;
  const scaledFrameH  = frameH * scale;
  const scaledDevW    = devW   * scale;
  const contentH      = devH - CHROME_H;
  const scaledContent = contentH * scale;

  const frameColor = isIPhone
    ? 'linear-gradient(145deg,#3a3a3c 0%,#1c1c1e 40%,#2a2a2c 60%,#1c1c1e 100%)'
    : 'linear-gradient(145deg,#2c2c2e 0%,#1a1a1c 50%,#2c2c2e 100%)';

  const screenBg = '#000';

  return (
    <div style={{ position: 'relative' }}>
      {/* Outer device shell */}
      <div style={{
        width: scaledFrameW,
        height: scaledFrameH,
        background: frameColor,
        borderRadius: RADIUS * scale,
        padding: BEZEL * scale,
        boxSizing: 'border-box',
        boxShadow: '0 30px 80px rgba(0,0,0,0.75), 0 8px 20px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        <SideButtons frameH={scaledFrameH} isIPhone={isIPhone} />

        {/* Screen */}
        <div style={{
          width: scaledDevW,
          height: scaledFrameH - BEZEL * 2 * scale,
          background: screenBg,
          borderRadius: Math.max(0, (RADIUS - BEZEL) * scale),
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Notch / Dynamic Island / Punch-hole */}
          {hasDynamicIsland && <DynamicIsland />}
          {hasNotch && <Notch />}
          {isAndroid && <PunchHole />}

          {/* Status bar */}
          {isIPhone && <IOSStatusBar hasNotch={hasNotch || hasDynamicIsland} />}
          {isAndroid && <AndroidStatusBar />}

          {/* Iframe — scaled from device native size */}
          <div style={{ width: scaledDevW, height: scaledContent, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: devW, height: contentH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <SiteIframe url={viewport.url} width={devW} height={contentH} userAgent={device.userAgent} />
            </div>
          </div>

          {/* Safari chrome (iOS) */}
          {SAFARI_H > 0 && (
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'bottom left', width: devW, flexShrink: 0 }}>
              <SafariChrome url={viewport.url} />
            </div>
          )}

          {/* Android nav bar */}
          {NAV_H > 0 && (
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'bottom left', width: devW, flexShrink: 0 }}>
              <AndroidNavBar />
            </div>
          )}

          {/* Home bar */}
          {hasHomeBar && <HomeBar width={scaledDevW} />}
        </div>
      </div>
    </div>
  );
}
