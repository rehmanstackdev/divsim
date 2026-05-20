import { useStore } from '../store/deviceStore';

export default function MultiDeviceControls() {
  const {
    multiDeviceView,
    multiDeviceLayout,
    setMultiDeviceLayout,
    activeDevices,
    devices,
  } = useStore();

  if (!multiDeviceView) return null;

  const layouts: { value: string; icon: string }[] = [
    { value: 'grid', icon: '⊞' },
    { value: 'row', icon: '≡' },
    { value: 'column', icon: '≩' },
    { value: 'stacked', icon: '☰' },
  ];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-20 rounded-lg border border-surface-40">
      <span className="text-xs font-mono text-surface-50 mr-2">
        {activeDevices.length} device(s)
      </span>
      <div className="flex items-center gap-0.5">
        {layouts.map((layout) => (
          <button
            key={layout.value}
            onClick={() => setMultiDeviceLayout(layout.value as any)}
            className={`toolbar-btn text-xs w-7 h-7 ${
              multiDeviceLayout === layout.value
                ? 'bg-accent-500/20 text-accent-400'
                : 'text-surface-50 hover:bg-surface-40'
            }`}
            title={`${layout.value} layout`}
          >
            {layout.icon}
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-surface-40 mx-2" />
      <select
        className="select-field text-xs py-0.5 px-2 bg-surface-30"
        value=""
        onChange={(e) => {
          useStore.getState().setCurrentDevice(e.target.value);
          useStore.getState().addActiveDevice(e.target.value);
        }}
      >
        <option value="">+ Add device</option>
        {devices
          .filter((d) => !activeDevices.includes(d.id))
          .map((d) => (
            <option key={d.id} value={d.id}>
              {d.icon} {d.name} ({d.width}×{d.height})
            </option>
          ))}
      </select>
    </div>
  );
}