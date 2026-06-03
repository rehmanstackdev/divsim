export interface DevicePreset {
  id: string;
  name: string;
  category: DeviceCategory;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent?: string;
  icon: string;
  frameAsset?: string;
  badge?: 'PRO' | 'NEW' | 'ULTRA';
  isCustom?: boolean;
}

export type DeviceCategory =
  | 'android-phone'
  | 'android-tablet'
  | 'iphone'
  | 'ipad'
  | 'smartwatch'
  | 'desktop'
  | 'large-display'
  | 'tv';

export interface ViewportState {
  width: number;
  height: number;
  pixelRatio: number;
  rotation: number;
  zoom: number;
  url: string;
  isLandscape: boolean;
  deviceId: string;
}

export type MultiDeviceLayout = 'grid' | 'row' | 'column' | 'stacked';

export interface AppState {
  currentDeviceId: string;
  devices: DevicePreset[];
  viewports: ViewportState[];
  multiDeviceView: boolean;
  multiDeviceLayout: MultiDeviceLayout;
  activeDevices: string[];
  darkMode: boolean;
  showGrid: boolean;
  screenshotMode: boolean;
  isRotated: boolean;
  history: string[];
  pinnedDevices: string[];
}
