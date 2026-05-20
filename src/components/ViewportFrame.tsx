import { useRef, useState, useEffect } from 'react';
import { useStore } from '../store/deviceStore';
import type { DeviceCategory } from '../types';

/* ─── Bezel config by category ─────────────────────────────────── */
const BEZEL: Record<DeviceCategory, { radius: number; border: number; hasNotch: boolean; hasHomeBar: boolean; hasHomeButton: boolean }> = {
  'iphone':         { radius: 44, border: 10, hasNotch: true,  hasHomeBar: true,  hasHomeButton: false },
  'android-phone':  { radius: 36, border: 8,  hasNotch: false, hasHomeBar: false, hasHomeButton: false },
  'ipad':           { radius: 20, border: 10, hasNotch: false, hasHomeBar: true,  hasHomeButton: false },
  'android-tablet': { radius: 16, border: 8,  hasNotch: false, hasHomeBar: false, hasHomeButton: false },
  'smartwatch':     { radius: 999, border: 6, hasNotch: false, hasHomeBar: false, hasHomeButton: false },
  'desktop':        { radius: 6,  border: 4,  hasNotch: false, hasHomeBar: false, hasHomeButton: false },
  'large-display':  { radius: 6,  border: 4,  hasNotch: false, hasHomeBar: false, hasHomeButton: false },
  'tv':             { radius: 8,  border: 6,  hasNotch: false, hasHomeBar: false, hasHomeButton: false },
};

/* ─── Monitor stand (for desktop / TV) ─────────────────────────── */
function MonitorStand({ scale }: { scale: number }) {
  return (
    <div className="flex flex-col items-center" style={{ marginTop: -1 * scale }}>
      <div style={{ width: 60 * scale, height: 28 * scale, background: '#1a1f2e', borderRadius: `0 0 ${4 * scale}px ${4 * scale}px`, borderTop: 'none' }} />
      <div style={{ width: 100 * scale, height: 5 * scale, background: '#0e111a', borderRadius: 4 * scale }} />
    </div>
  );
}

/* ─── Side buttons (phones / tablets) ──────────────────────────── */
function SideButtons({ height, scale, category }: { height: number; scale: number; category: DeviceCategory }) {
  if (!['iphone', 'android-phone', 'ipad', 'android-tablet'].includes(category)) return null;
  const btnH = 36 * scale;
  const btnW = 3 * scale;
  const btnR = 2 * scale;

  return (
    <>
      {/* Volume up / down on left */}
      <div style={{ position: 'absolute', left: -(btnW), top: height * scale * 0.22, width: btnW, height: btnH, background: '#1a1f2e', borderRadius: `${btnR}px 0 0 ${btnR}px` }} />
      <div style={{ position: 'absolute', left: -(btnW), top: height * scale * 0.22 + btnH + 8 * scale, width: btnW, height: btnH, background: '#1a1f2e', borderRadius: `${btnR}px 0 0 ${btnR}px` }} />
      {/* Power on right */}
      <div style={{ position: 'absolute', right: -(btnW), top: height * scale * 0.28, width: btnW, height: btnH * 1.2, background: '#1a1f2e', borderRadius: `0 ${btnR}px ${btnR}px 0` }} />
    </>
  );
}

/* ─── Dynamic Island / Notch ────────────────────────────────────── */
function Notch({ category, scale }: { category: DeviceCategory; scale: number }) {
  if (category !== 'iphone') return null;
  // Dynamic island style pill
  const w = 100 * scale;
  const h = 26 * scale;
  return (
    <div style={{
      position: 'absolute',
      top: 8 * scale,
      left: '50%',
      transform: 'translateX(-50%)',
      width: w,
      height: h,
      background: '#07080e',
      borderRadius: h / 2,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8 * scale,
    }}>
      {/* camera dot */}
      <div style={{ width: 8 * scale, height: 8 * scale, borderRadius: '50%', background: '#1a1f2e', border: `${1.5 * scale}px solid #2a2f40` }} />
      {/* FaceID grid lines - decorative */}
      <div style={{ width: 14 * scale, height: 14 * scale, borderRadius: 2 * scale, border: `${1 * scale}px solid #2a2f40` }} />
    </div>
  );
}

/* ─── Android camera punch hole ─────────────────────────────────── */
function PunchHole({ category, scale }: { category: DeviceCategory; scale: number }) {
  if (category !== 'android-phone') return null;
  return (
    <div style={{
      position: 'absolute',
      top: 10 * scale,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 10 * scale,
      height: 10 * scale,
      borderRadius: '50%',
      background: '#07080e',
      zIndex: 20,
    }} />
  );
}

/* ─── Home bar (swipe indicator) ────────────────────────────────── */
function HomeBar({ frameWidth, scale }: { frameWidth: number; scale: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 8 * scale,
      left: '50%',
      transform: 'translateX(-50%)',
      width: frameWidth * 0.35,
      height: 4 * scale,
      background: 'rgba(255,255,255,0.25)',
      borderRadius: 4 * scale,
      zIndex: 20,
    }} />
  );
}

/* ─── Watch crown ────────────────────────────────────────────────── */
function WatchCrown({ scale }: { scale: number }) {
  return (
    <div style={{
      position: 'absolute',
      right: -(8 * scale),
      top: '35%',
      width: 8 * scale,
      height: 28 * scale,
      background: '#1a1f2e',
      borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
    }} />
  );
}

/* ─── Browser chrome bar inside frame ───────────────────────────── */
function BrowserChrome({ width, url }: { width: number; url: string }) {
  let displayUrl = url;
  try {
    const u = new URL(url);
    displayUrl = u.hostname + u.pathname.slice(0, 20) + (u.pathname.length > 20 ? '…' : '');
  } catch { /* keep raw */ }

  return (
    <div style={{
      width,
      height: 40,
      background: '#1a2235',
      borderBottom: '1px solid #1f293f',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: 8,
      flexShrink: 0,
    }}>
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e' }} />
      </div>
      {/* URL pill */}
      <div style={{
        flex: 1,
        height: 22,
        background: '#0f1520',
        borderRadius: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        overflow: 'hidden',
      }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#6b80a0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          {displayUrl}
        </span>
      </div>
    </div>
  );
}

/* ─── Iframe with fallback ───────────────────────────────────────── */
function SiteIframe({ url, width, height }: { url: string; width: number; height: number }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setStatus('loading');
    // Give the iframe 5s to load; if it doesn't fire onLoad, assume blocked
    timerRef.current = setTimeout(() => {
      try {
        // Try accessing contentDocument - fails for cross-origin, but onLoad should've fired
        const doc = iframeRef.current?.contentDocument;
        if (!doc || doc.body.innerHTML === '') setStatus('blocked');
      } catch {
        // cross-origin - if no load fired by now, assume blocked
        setStatus('blocked');
      }
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [url]);

  const handleLoad = () => {
    clearTimeout(timerRef.current);
    setStatus('loaded');
  };

  const handleError = () => {
    clearTimeout(timerRef.current);
    setStatus('blocked');
  };

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f1520', gap: 12, zIndex: 5 }}>
          <div style={{ width: 28, height: 28, border: '3px solid #1f293f', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 11, color: '#556080', fontFamily: 'system-ui' }}>Loading preview…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {status === 'blocked' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f1520', gap: 10, padding: 20, zIndex: 5 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#556080" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
          <span style={{ fontSize: 12, color: '#8899c0', textAlign: 'center', fontFamily: 'system-ui', lineHeight: 1.5 }}>
            This site blocks embedding.<br />Use <strong style={{ color: '#0ea5e9' }}>Open in Window</strong> to simulate.
          </span>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        width={width}
        height={height}
        style={{ border: 'none', display: 'block' }}
        onLoad={handleLoad}
        onError={handleError}
        title="Device preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
interface ViewportFrameProps {
  deviceId: string;
  containerWidth: number;
  containerHeight: number;
  isMultiView?: boolean;
}

export default function ViewportFrame({ deviceId, containerWidth, containerHeight, isMultiView = false }: ViewportFrameProps) {
  const { viewports, devices, showGrid, screenshotMode } = useStore();

  const viewport = viewports.find((v) => v.deviceId === deviceId);
  const device   = devices.find((d) => d.id === deviceId);

  if (!viewport || !device) return null;

  const { zoom, url, isLandscape } = viewport;
  const bezel = BEZEL[device.category] ?? BEZEL['desktop'];

  // Device pixel dimensions (swapped when landscape)
  const devW = isLandscape ? device.height : device.width;
  const devH = isLandscape ? device.width  : device.height;

  // Frame adds bezel border on each side
  const BROWSER_CHROME_H = ['desktop', 'large-display', 'tv'].includes(device.category) ? 0 : 40;
  const frameW = devW + bezel.border * 2;
  const frameH = devH + bezel.border * 2 + BROWSER_CHROME_H;

  // Extra vertical space: home bar, notch padding
  const extraTopPad    = (bezel.hasNotch)      ? 44 : bezel.hasNotch ? 30 : 0;
  const extraBottomPad = (bezel.hasHomeBar)     ? 30 : 0;
  const totalFrameH    = frameH + extraTopPad + extraBottomPad;

  const isDesktop = ['desktop', 'large-display', 'tv'].includes(device.category);
  const standH    = isDesktop ? 40 : 0;

  // Compute scale to fit the container, then apply user zoom on top
  const padding = isMultiView ? 24 : 40;
  const maxW = containerWidth  - padding;
  const maxH = containerHeight - padding - standH;
  const autoScale = Math.min(maxW / frameW, maxH / totalFrameH, 1.5);
  const scale = isMultiView ? autoScale : autoScale * (zoom / 100);

  const scaledFrameW    = frameW    * scale;
  const scaledTotalH    = totalFrameH * scale;
  const scaledBrowserH  = BROWSER_CHROME_H * scale;
  const scaledDevW      = devW * scale;
  const scaledDevH      = (devH + extraTopPad + extraBottomPad) * scale - scaledBrowserH;

  const borderR = Math.min(bezel.radius, frameW / 2) * scale;

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Outer device bezel */}
      <div
        className="device-shadow"
        style={{
          width:  scaledFrameW,
          height: scaledTotalH,
          background: '#07080e',
          borderRadius: borderR,
          padding: bezel.border * scale,
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <SideButtons height={devH} scale={scale} category={device.category} />
        {device.category === 'smartwatch' && <WatchCrown scale={scale} />}

        {/* Inner screen area */}
        <div style={{
          width:    scaledDevW,
          height:   scaledTotalH - bezel.border * 2 * scale,
          borderRadius: Math.max(0, borderR - bezel.border * scale),
          overflow: 'hidden',
          position: 'relative',
          background: '#fff',
        }}>
          <Notch category={device.category} scale={scale} />
          <PunchHole category={device.category} scale={scale} />

          {/* Top padding for notch */}
          {extraTopPad > 0 && (
            <div style={{ height: extraTopPad * scale, background: '#0f1520', flexShrink: 0 }} />
          )}

          {/* Browser chrome for phones/tablets */}
          {BROWSER_CHROME_H > 0 && (
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: devW, flexShrink: 0 }}>
              <BrowserChrome width={devW} url={url} />
            </div>
          )}

          {/* Desktop address bar */}
          {isDesktop && (
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: devW, flexShrink: 0 }}>
              <BrowserChrome width={devW} url={url} />
            </div>
          )}

          {/* Iframe content — rendered at real device size then scaled */}
          <div style={{ overflow: 'hidden', width: scaledDevW, height: scaledDevH }}>
            <div style={{ width: devW, height: devH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <SiteIframe url={url} width={devW} height={devH} />
            </div>
          </div>

          {/* Responsive grid overlay */}
          {showGrid && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30,
              backgroundImage: `linear-gradient(rgba(14,165,233,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.12) 1px,transparent 1px)`,
              backgroundSize: `${32 * scale}px ${32 * scale}px`,
            }} />
          )}

          {/* Bottom home bar */}
          {bezel.hasHomeBar && !isLandscape && (
            <HomeBar frameWidth={scaledDevW} scale={scale} />
          )}

          {/* Screenshot overlay */}
          {screenshotMode && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(14,165,233,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 12, color: '#0ea5e9', background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>
                📸 Click to capture
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Monitor stand */}
      {isDesktop && <MonitorStand scale={scale} />}

      {/* Device label (multi-view only) */}
      {isMultiView && (
        <div style={{ marginTop: 6, fontSize: 11, color: '#8899c0', fontFamily: 'system-ui', textAlign: 'center' }}>
          {device.name} · {devW}×{devH}
        </div>
      )}
    </div>
  );
}
