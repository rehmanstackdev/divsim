import { useState, useMemo } from 'react';
import { useStore } from '../store/deviceStore';
import type { DevicePreset, DeviceCategory } from '../types';
import { CATEGORY_LABELS, formatDimensions } from '../utils/devicePresets';

/* ─── Category SVG icons ───────────────────────────────────────── */
const CATEGORY_SVG: Record<string, JSX.Element> = {
  'android-phone': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  ),
  'iphone': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M10 6h4" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  ),
  'android-tablet': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  ),
  'ipad': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  ),
  'smartwatch': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="7" y="7" width="10" height="10" rx="3" />
      <path d="M9 7V5h6v2M9 17v2h6v-2" />
    </svg>
  ),
  'desktop': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  'large-display': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="1" y="4" width="22" height="14" rx="2" />
      <line x1="8" y1="22" x2="16" y2="22" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  ),
  'tv': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
};

/* ─── Category accent colors ───────────────────────────────────── */
const CATEGORY_COLOR: Record<string, string> = {
  'android-phone':   'text-green-400',
  'iphone':          'text-blue-400',
  'android-tablet':  'text-emerald-400',
  'ipad':            'text-sky-400',
  'smartwatch':      'text-purple-400',
  'desktop':         'text-orange-400',
  'large-display':   'text-yellow-400',
  'tv':              'text-pink-400',
};

/* ─── Device list item ─────────────────────────────────────────── */
function DeviceItem({
  device, isCurrent, isActive, multiDeviceView, onSelect, onToggleMulti,
}: {
  device: DevicePreset;
  isCurrent: boolean;
  isActive: boolean;
  multiDeviceView: boolean;
  onSelect: () => void;
  onToggleMulti: () => void;
}) {
  return (
    <div
      className={`device-item group text-left w-full ${isCurrent ? 'device-item-active' : ''} ${isActive && !isCurrent ? 'ring-1 ring-accent-500/40' : ''}`}
      onClick={onSelect}
    >
      {/* Device type mini-icon */}
      <span className={`flex-shrink-0 ${isCurrent ? 'text-accent-400' : CATEGORY_COLOR[device.category] ?? 'text-surface-70'}`}>
        {CATEGORY_SVG[device.category]}
      </span>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium truncate leading-tight">{device.name}</div>
        <div className="text-[10px] text-surface-70 font-mono leading-tight mt-0.5">
          {formatDimensions(device.width, device.height)}
        </div>
      </div>

      {/* Multi-select checkbox */}
      {multiDeviceView && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleMulti(); }}
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[9px] transition-all ${
            isActive
              ? 'bg-accent-500 border-accent-500 text-white'
              : 'border-surface-40 text-surface-70 hover:border-accent-400'
          }`}
        >
          {isActive ? '✓' : ''}
        </button>
      )}
    </div>
  );
}

/* ─── Category section ─────────────────────────────────────────── */
function CategorySection({
  category, devices, currentDeviceId, activeDevices, multiDeviceView, onSelect, onToggleMulti,
}: {
  category: DeviceCategory;
  devices: DevicePreset[];
  currentDeviceId: string;
  activeDevices: string[];
  multiDeviceView: boolean;
  onSelect: (id: string) => void;
  onToggleMulti: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const label = CATEGORY_LABELS[category];
  const color = CATEGORY_COLOR[category] ?? 'text-surface-70';
  const icon = CATEGORY_SVG[category];

  return (
    <div className="mb-1">
      <button
        className="w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-surface-40/20 rounded-md"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`${color} flex-shrink-0`}>{icon}</span>
        <span className="text-[11px] font-semibold text-surface-70 uppercase tracking-widest flex-1">{label}</span>
        <span className="text-[10px] text-surface-70/60 font-mono">{devices.length}</span>
        <svg
          className={`text-surface-70/50 transition-transform ${open ? 'rotate-180' : ''}`}
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="space-y-0.5 mt-0.5">
          {devices.map((device) => (
            <DeviceItem
              key={device.id}
              device={device}
              isCurrent={device.id === currentDeviceId}
              isActive={activeDevices.includes(device.id)}
              multiDeviceView={multiDeviceView}
              onSelect={() => onSelect(device.id)}
              onToggleMulti={() => onToggleMulti(device.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────── */
export default function DeviceSidebar() {
  const {
    devices, currentDeviceId, multiDeviceView, activeDevices,
    setCurrentDevice, addActiveDevice, removeActiveDevice, toggleMultiDeviceView,
  } = useStore();

  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? devices.filter((d) => d.name.toLowerCase().includes(q) || `${d.width}x${d.height}`.includes(q)) : devices;
  }, [devices, search]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, DevicePreset[]>>((acc, d) => {
      if (!acc[d.category]) acc[d.category] = [];
      acc[d.category].push(d);
      return acc;
    }, {});
  }, [filtered]);

  const handleSelect = (id: string) => {
    setCurrentDevice(id);
    if (multiDeviceView) toggleMultiDeviceView();
  };

  const handleToggleMulti = (id: string) => {
    if (activeDevices.includes(id)) removeActiveDevice(id);
    else addActiveDevice(id);
  };

  const handleAddCustom = () => {
    const name = prompt('Device name:');
    if (!name) return;
    const width = parseInt(prompt('Width (px):', '390') ?? '390', 10);
    const height = parseInt(prompt('Height (px):', '844') ?? '844', 10);
    const pixelRatio = parseFloat(prompt('Pixel ratio:', '2') ?? '2');
    if (name && !isNaN(width) && !isNaN(height)) {
      useStore.getState().addCustomDevice({
        id: `custom-${Date.now()}`,
        name,
        category: 'android-phone',
        width,
        height,
        pixelRatio,
        icon: '✨',
        isCustom: true,
      });
    }
  };

  return (
    <aside
      className="flex flex-col overflow-hidden flex-shrink-0 border-r border-surface-30"
      style={{ width: 220, background: '#111624' }}
    >
      {/* Search */}
      <div className="px-2.5 pt-2.5 pb-2 border-b border-surface-30">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-70 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="input-field pl-7 py-1.5 text-[12px]"
            placeholder="Search devices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-70 hover:text-surface-100" onClick={() => setSearch('')}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Device list */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-surface-70 text-xs mt-8">No devices found</p>
        ) : (
          Object.entries(grouped).map(([cat, devs]) => (
            <CategorySection
              key={cat}
              category={cat as DeviceCategory}
              devices={devs}
              currentDeviceId={currentDeviceId}
              activeDevices={activeDevices}
              multiDeviceView={multiDeviceView}
              onSelect={handleSelect}
              onToggleMulti={handleToggleMulti}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-2.5 py-2 border-t border-surface-30 space-y-1.5">
        {multiDeviceView && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-surface-70">{activeDevices.length} selected</span>
            <button className="text-[11px] text-accent-400 hover:text-accent-300" onClick={toggleMultiDeviceView}>Done</button>
          </div>
        )}
        <button
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-surface-70 hover:text-surface-100 rounded-lg hover:bg-surface-40/30 transition-colors border border-dashed border-surface-40/60 hover:border-surface-40"
          onClick={handleAddCustom}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Custom device
        </button>
      </div>
    </aside>
  );
}
