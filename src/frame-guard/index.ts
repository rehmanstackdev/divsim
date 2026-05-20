// Runs at document_start inside every sub-frame.
// Patches window.top/parent/frameElement so JS-based frame-busting checks
// (e.g. `if (window.top !== window.self) location.href = '...'`) pass silently.
(function () {
  if (window === (window as Window).top) return; // only patch inside frames

  const self = window;
  try {
    Object.defineProperty(window, 'top',         { get: () => self, configurable: true });
    Object.defineProperty(window, 'parent',      { get: () => self, configurable: true });
    Object.defineProperty(window, 'frameElement',{ get: () => null, configurable: true });
  } catch {
    // Some cross-origin contexts disallow defineProperty — ignore
  }
})();
