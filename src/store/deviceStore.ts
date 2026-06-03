import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AppState, DevicePreset, ViewportState, MultiDeviceLayout } from '../types';
import { DEVICE_PRESETS } from '../utils/devicePresets';

interface AppActions {
  setCurrentDevice: (deviceId: string) => void;
  addDevice: (device: DevicePreset) => void;
  removeDevice: (deviceId: string) => void;
  updateViewport: (deviceId: string, updates: Partial<ViewportState>) => void;
  rotateDevice: (deviceId: string) => void;
  setZoom: (deviceId: string, zoom: number) => void;
  toggleMultiDeviceView: () => void;
  setMultiDeviceLayout: (layout: MultiDeviceLayout) => void;
  addActiveDevice: (deviceId: string) => void;
  removeActiveDevice: (deviceId: string) => void;
  setActiveDevices: (deviceIds: string[]) => void;
  toggleDarkMode: () => void;
  toggleGrid: () => void;
  setScreenshotMode: (enabled: boolean) => void;
  setUrl: (url: string) => void;
  addToHistory: (deviceId: string) => void;
  togglePinDevice: (deviceId: string) => void;
  addCustomDevice: (device: DevicePreset) => void;
  updateCustomDevice: (deviceId: string, updates: Partial<DevicePreset>) => void;
}

const DEFAULT_DEVICE = DEVICE_PRESETS[2];

export const useStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        currentDeviceId: DEFAULT_DEVICE.id,
        devices: DEVICE_PRESETS,
        viewports: [],
        multiDeviceView: false,
        multiDeviceLayout: 'grid' as MultiDeviceLayout,
        activeDevices: [DEFAULT_DEVICE.id],
        darkMode: true,
        showGrid: false,
        screenshotMode: false,
        isRotated: false,
        history: [],
        pinnedDevices: [],

        setCurrentDevice: (deviceId) => {
          const device = get().devices.find((d) => d.id === deviceId);
          if (!device) return;
          set({ currentDeviceId: deviceId });
          const existing = get().viewports.find((v) => v.deviceId === deviceId);
          if (!existing) {
            set((state) => ({
              viewports: [...state.viewports, {
                width: device.width,
                height: device.height,
                pixelRatio: device.pixelRatio,
                rotation: 0,
                zoom: 100,
                url: get().viewports[0]?.url ?? '',
                isLandscape: false,
                deviceId: device.id,
              }],
            }));
          }
        },

        addDevice: (device) =>
          set((state) => ({ devices: [...state.devices, device] })),

        removeDevice: (deviceId) =>
          set((state) => ({
            devices: state.devices.filter((d) => d.id !== deviceId),
            viewports: state.viewports.filter((v) => v.deviceId !== deviceId),
            activeDevices: state.activeDevices.filter((id) => id !== deviceId),
            currentDeviceId:
              state.currentDeviceId === deviceId
                ? state.devices[0]?.id || ''
                : state.currentDeviceId,
          })),

        updateViewport: (deviceId, updates) =>
          set((state) => ({
            viewports: state.viewports.map((v) =>
              v.deviceId === deviceId ? { ...v, ...updates } : v
            ),
          })),

        rotateDevice: (deviceId) =>
          set((state) => {
            const viewport = state.viewports.find((v) => v.deviceId === deviceId);
            if (!viewport) return state;
            const newRotation = viewport.rotation === 0 ? 90 : 0;
            return {
              viewports: state.viewports.map((v) =>
                v.deviceId === deviceId
                  ? {
                      ...v,
                      rotation: newRotation,
                      width: newRotation === 90 ? viewport.height : viewport.width,
                      height: newRotation === 90 ? viewport.width : viewport.height,
                      isLandscape: newRotation === 90,
                    }
                  : v
              ),
              isRotated: newRotation !== 0,
            };
          }),

        setZoom: (deviceId, zoom) =>
          set((state) => ({
            viewports: state.viewports.map((v) =>
              v.deviceId === deviceId ? { ...v, zoom } : v
            ),
          })),

        toggleMultiDeviceView: () =>
          set((state) => {
            const next = !state.multiDeviceView;
            if (next && state.activeDevices.length === 0) {
              return { multiDeviceView: true, activeDevices: [state.currentDeviceId] };
            }
            return { multiDeviceView: next };
          }),

        setMultiDeviceLayout: (layout) => set({ multiDeviceLayout: layout }),

        addActiveDevice: (deviceId) =>
          set((state) => ({
            activeDevices: [...new Set([...state.activeDevices, deviceId])],
          })),

        removeActiveDevice: (deviceId) =>
          set((state) => ({
            activeDevices: state.activeDevices.filter((id) => id !== deviceId),
          })),

        setActiveDevices: (deviceIds) => set({ activeDevices: deviceIds }),

        toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

        toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

        setScreenshotMode: (enabled) => set({ screenshotMode: enabled }),

        setUrl: (url) =>
          set((state) => {
            // No viewport created yet (e.g. URL captured on first load before a
            // device is selected) — create one for the current device so the
            // URL isn't dropped.
            if (state.viewports.length === 0) {
              const device =
                state.devices.find((d) => d.id === state.currentDeviceId) ??
                state.devices[0];
              if (!device) return state;
              return {
                viewports: [{
                  width: device.width,
                  height: device.height,
                  pixelRatio: device.pixelRatio,
                  rotation: 0,
                  zoom: 100,
                  url,
                  isLandscape: false,
                  deviceId: device.id,
                }],
              };
            }
            return { viewports: state.viewports.map((v) => ({ ...v, url })) };
          }),

        addToHistory: (deviceId) =>
          set((state) => ({
            history: [...new Set([deviceId, ...state.history])].slice(0, 20),
          })),

        togglePinDevice: (deviceId) =>
          set((state) => ({
            pinnedDevices: state.pinnedDevices.includes(deviceId)
              ? state.pinnedDevices.filter((id) => id !== deviceId)
              : [...state.pinnedDevices, deviceId],
          })),

        addCustomDevice: (device) =>
          set((state) => {
            const exists = state.devices.find((d) => d.id === device.id);
            if (exists) return state;
            return {
              devices: [...state.devices, { ...device, isCustom: true }],
              currentDeviceId: device.id,
            };
          }),

        updateCustomDevice: (deviceId, updates) =>
          set((state) => ({
            devices: state.devices.map((d) =>
              d.id === deviceId && d.isCustom ? { ...d, ...updates } : d
            ),
          })),
      }),
      {
        name: 'devsim-storage',
        partialize: (state) => ({
          darkMode: state.darkMode,
          activeDevices: state.activeDevices,
          multiDeviceView: state.multiDeviceView,
          multiDeviceLayout: state.multiDeviceLayout,
          history: state.history,
          pinnedDevices: state.pinnedDevices,
        }),
      }
    ),
    { name: 'DevSim Store' }
  )
);