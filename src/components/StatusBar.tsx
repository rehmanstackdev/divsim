import { useStore } from '../store/deviceStore';

export default function StatusBar() {
  const { viewports, currentDeviceId, devices, darkMode, multiDeviceView, activeDevices } = useStore();

  const viewport = viewports.find((v) => v.deviceId === currentDeviceId);
  const device   = devices.find((d) => d.id === currentDeviceId);

  const devW = viewport?.isLandscape ? device?.height : device?.width;
  const devH = viewport?.isLandscape ? device?.width  : device?.height;

  let displayUrl = viewport?.url ?? '';
  try {
    const u = new URL(displayUrl);
    displayUrl = u.hostname;
  } catch { /* keep raw */ }

  return (
    <footer
      className="flex items-center justify-between px-3 border-t border-surface-30 flex-shrink-0 text-[11px] text-surface-70"
      style={{ height: 28, background: '#161e30' }}
    >
      {/* Left: device info */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-blue-400'}`} />
          {darkMode ? 'Dark' : 'Light'} mode
        </span>

        {device && (
          <span className="font-medium text-surface-90/80">{device.name}</span>
        )}

        {multiDeviceView && (
          <span>
            <span className="text-accent-400 font-semibold">{activeDevices.length}</span> devices
          </span>
        )}
      </div>

      {/* Center: URL */}
      {displayUrl && (
        <span className="font-mono text-surface-70/80 truncate max-w-[220px]" title={viewport?.url}>
          {displayUrl}
        </span>
      )}

      {/* Right: dimensions + zoom + orientation */}
      <div className="flex items-center gap-3 font-mono">
        {devW && devH && (
          <span className="text-surface-90">{devW}<span className="text-surface-70/50 mx-0.5">×</span>{devH}</span>
        )}
        {device?.pixelRatio && (
          <span>{device.pixelRatio}x</span>
        )}
        {viewport && (
          <span className="text-accent-400/80">{viewport.zoom}%</span>
        )}
        {viewport?.isLandscape && (
          <span className="flex items-center gap-1 text-warning">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>
            Landscape
          </span>
        )}
      </div>
    </footer>
  );
}
