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
      style={{ flex: 1, minWidth: 0, position: 'relative', background: '#1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Subtle radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,122,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {device && viewport && width > 0 && height > 0 ? (
        <PhoneFrame device={device} viewport={viewport} containerW={width} containerH={height} />
      ) : (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: 12 }}><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>
          <p style={{ fontSize: 14, margin: 0 }}>Select a device on the right</p>
        </div>
      )}
    </div>
  );
}
