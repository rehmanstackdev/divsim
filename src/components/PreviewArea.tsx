import { useRef, useState, useEffect } from 'react';
import { useStore } from '../store/deviceStore';
import ViewportFrame from './ViewportFrame';

function useContainerSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      setSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

/* ─── Empty state ────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-surface-50 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-20 border border-surface-30 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#556080" strokeWidth="1.5" strokeLinecap="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <circle cx="12" cy="18" r="1" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-surface-100/70">Select a device to begin</p>
        <p className="text-xs text-surface-70 mt-1">Choose from the sidebar on the left</p>
      </div>
    </div>
  );
}

/* ─── Layout toggle (multi-view) ─────────────────────────────────── */
function MultiViewControls() {
  const { multiDeviceLayout, setMultiDeviceLayout, activeDevices, toggleMultiDeviceView } = useStore();

  const layouts = [
    { value: 'grid', label: 'Grid',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> },
    { value: 'row', label: 'Row',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="6" height="12" rx="1"/><rect x="9" y="6" width="6" height="12" rx="1"/><rect x="16" y="6" width="6" height="12" rx="1"/></svg> },
    { value: 'column', label: 'Column',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="2" width="12" height="6" rx="1"/><rect x="6" y="9" width="12" height="6" rx="1"/><rect x="6" y="16" width="12" height="6" rx="1"/></svg> },
  ] as const;

  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-surface-20/90 backdrop-blur-sm border border-surface-30 rounded-lg p-1.5">
      <span className="text-[11px] text-surface-70 px-1">{activeDevices.length} devices</span>
      <div className="w-px h-4 bg-surface-30" />
      {layouts.map((l) => (
        <button
          key={l.value}
          className={`p-1.5 rounded transition-all ${multiDeviceLayout === l.value ? 'bg-accent-500/20 text-accent-400' : 'text-surface-70 hover:text-surface-100 hover:bg-surface-30'}`}
          onClick={() => setMultiDeviceLayout(l.value)}
          title={l.label}
        >
          {l.icon}
        </button>
      ))}
      <div className="w-px h-4 bg-surface-30" />
      <button
        className="text-[11px] text-accent-400 hover:text-accent-300 px-1"
        onClick={toggleMultiDeviceView}
      >
        Done
      </button>
    </div>
  );
}

/* ─── Main preview area ──────────────────────────────────────────── */
export default function PreviewArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);

  const { currentDeviceId, multiDeviceView, multiDeviceLayout, activeDevices } = useStore();

  const devicesToShow = multiDeviceView
    ? (activeDevices.length > 0 ? activeDevices : [currentDeviceId])
    : [currentDeviceId];

  if (!currentDeviceId) {
    return <EmptyState />;
  }

  /* ── Single device ── */
  if (!multiDeviceView || devicesToShow.length <= 1) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-auto"
        style={{ background: '#0f1520' }}
      >
        {width > 0 && height > 0 && (
          <ViewportFrame
            deviceId={devicesToShow[0]}
            containerWidth={width}
            containerHeight={height}
          />
        )}
      </div>
    );
  }

  /* ── Multi device ── */
  const isGrid   = multiDeviceLayout === 'grid';
  const isRow    = multiDeviceLayout === 'row';
  const isColumn = multiDeviceLayout === 'column';

  const perDeviceW = isRow    ? Math.floor(width  / devicesToShow.length) - 16
                   : isColumn ? width  - 32
                   : isGrid   ? Math.floor(width  / 2) - 20
                   : width - 32;
  const perDeviceH = isColumn ? Math.floor(height / devicesToShow.length) - 16
                   : isRow    ? height - 32
                   : isGrid   ? Math.floor(height / 2) - 20
                   : height - 32;

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-auto"
      style={{ background: '#0f1520' }}
    >
      <MultiViewControls />
      <div
        className="min-h-full"
        style={{
          display: isRow    ? 'flex'         : isColumn ? 'flex' : 'grid',
          flexDirection:       isColumn ? 'column' : 'row',
          gridTemplateColumns: isGrid   ? 'repeat(2, 1fr)' : undefined,
          gap: 16,
          padding: 16,
          paddingTop: 48,
          alignItems: 'center',
          justifyItems: 'center',
          justifyContent: isRow ? 'flex-start' : 'center',
        }}
      >
        {devicesToShow.map((deviceId) => (
          <div key={deviceId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {width > 0 && height > 0 && (
              <ViewportFrame
                deviceId={deviceId}
                containerWidth={Math.max(perDeviceW, 200)}
                containerHeight={Math.max(perDeviceH, 200)}
                isMultiView
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
