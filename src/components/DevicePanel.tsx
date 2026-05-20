import { useState, useMemo } from 'react';
import { useStore } from '../store/deviceStore';
import type { DevicePreset, DeviceCategory } from '../types';
import { DEVICE_PRESETS, CATEGORY_LABELS, CATEGORY_EMOJI } from '../utils/devicePresets';

/* ── Phone outline SVG ─────────────────────────────────────────────── */
function PhoneSVG({ category, size = 40 }: { category: DeviceCategory; size?: number }) {
  if (category === 'smartwatch') {
    return (
      <svg width={size * 0.85} height={size * 0.85} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="26" height="26" rx="9"/>
        <rect x="10" y="1" width="14" height="4" rx="1"/>
        <rect x="10" y="29" width="14" height="4" rx="1"/>
      </svg>
    );
  }
  if (category === 'desktop' || category === 'large-display' || category === 'tv') {
    return (
      <svg width={size * 1.2} height={size * 0.8} viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="44" height="26" rx="3"/>
        <line x1="18" y1="28" x2="18" y2="32"/>
        <line x1="30" y1="28" x2="30" y2="32"/>
        <line x1="14" y1="32" x2="34" y2="32"/>
      </svg>
    );
  }
  if (category === 'ipad' || category === 'android-tablet') {
    return (
      <svg width={size * 0.78} height={size} viewBox="0 0 26 36" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="22" height="32" rx="3"/>
        <circle cx="13" cy="31" r="1.2"/>
        <line x1="8" y1="5" x2="18" y2="5"/>
      </svg>
    );
  }
  // Phone (iphone / android-phone)
  const hasNotch = category === 'iphone';
  return (
    <svg width={size * 0.52} height={size} viewBox="0 0 22 40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="19" height="37" rx="4"/>
      {hasNotch
        ? <rect x="7" y="4" width="8" height="2.5" rx="1.25"/>
        : <circle cx="11" cy="5" r="1.5"/>}
      <line x1="7" y1="36" x2="15" y2="36"/>
    </svg>
  );
}

/* ── Device card ───────────────────────────────────────────────────── */
function DeviceCard({ device, isSelected, onClick }: { device: DevicePreset; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 90,
        padding: '12px 6px 9px',
        border: isSelected ? '2px solid #2563eb' : `1px solid ${hovered ? '#a0aec0' : '#e2e8f0'}`,
        borderRadius: 10,
        background: isSelected ? '#eff6ff' : hovered ? '#f8faff' : '#fff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        transition: 'border-color 0.15s, background 0.15s',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ color: isSelected ? '#2563eb' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44 }}>
        <PhoneSVG category={device.category} size={40} />
      </div>

      <span style={{
        fontSize: 10.5, textAlign: 'center', lineHeight: 1.35,
        color: isSelected ? '#1d4ed8' : '#374151',
        fontWeight: isSelected ? 600 : 400,
        wordBreak: 'break-word',
        hyphens: 'auto',
      }}>
        {device.name}
      </span>
    </div>
  );
}

/* ── Category section ──────────────────────────────────────────────── */
function CategorySection({ category, devices }: { category: string; devices: DevicePreset[] }) {
  const { currentDeviceId, setCurrentDevice } = useStore();
  const [open, setOpen] = useState(false);
  const label = CATEGORY_LABELS[category] ?? category;
  const emoji = CATEGORY_EMOJI[category] ?? '📱';

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Section header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', background: 'none', border: 'none', padding: '0 0 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <span style={{ fontSize: 15 }}>{emoji}</span>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{label}</span>
        <svg style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* 5-column card grid */}
      {open && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isSelected={device.id === currentDeviceId}
              onClick={() => setCurrentDevice(device.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main panel ────────────────────────────────────────────────────── */
export default function DevicePanel() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? DEVICE_PRESETS.filter((d) => d.name.toLowerCase().includes(q))
      : DEVICE_PRESETS;
  }, [search]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, DevicePreset[]>>((acc, d) => {
      if (!acc[d.category]) acc[d.category] = [];
      acc[d.category].push(d);
      return acc;
    }, {});
  }, [filtered]);

  const handleAddCustom = () => {
    const name = prompt('Device name:');
    if (!name) return;
    const w = parseInt(prompt('Width (px):', '390') ?? '390', 10);
    const h = parseInt(prompt('Height (px):', '844') ?? '844', 10);
    const dpr = parseFloat(prompt('Pixel ratio:', '2') ?? '2');
    if (!isNaN(w) && !isNaN(h)) {
      useStore.getState().addCustomDevice({ id: `custom-${Date.now()}`, name, category: 'android-phone', width: w, height: h, pixelRatio: dpr, icon: '✨', isCustom: true });
    }
  };

  return (
    <div style={{
      width: 530, flexShrink: 0,
      background: '#fff',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>DevSim</span>
          </div>
          <button
            onClick={handleAddCustom}
            style={{ fontSize: 11, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 500 }}
          >
            + Custom
          </button>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices…"
            style={{ width: '100%', paddingLeft: 32, paddingRight: search ? 30 : 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#111827', background: '#f9fafb' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2 }}>✕</button>
          )}
        </div>
      </div>

      {/* Scrollable device grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>
        {Object.keys(grouped).length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 40 }}>No devices found</p>
        ) : (
          Object.entries(grouped).map(([cat, devs]) => (
            <CategorySection key={cat} category={cat} devices={devs} />
          ))
        )}
      </div>
    </div>
  );
}
