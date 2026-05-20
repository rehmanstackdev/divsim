# DevSim — Responsive Multi-Device Simulator

A modern, lightweight browser extension for responsive testing and multi-device website simulation.

## Features

- **Responsive Simulation Engine** — Dynamic width/height rendering with real-time viewport simulation
- **Device Presets** — 20+ devices across 8 categories: Android phones, iPhones, Android tablets, iPads, smart watches, desktop screens, large displays, and TVs
- **Multi-Device Preview** — View multiple devices simultaneously in grid, row, column, or stacked layouts
- **User Controls** — Rotate device, zoom controls, refresh preview, custom screen dimensions
- **Screenshot Support** — Capture and export screenshots
- **Dark/Light Mode** — Toggle between dark and light themes
- **Responsive Grid Overlay** — Visual grid for testing responsive breakpoints

## Technology Stack

| Area            | Technology                    |
|-----------------|-------------------------------|
| Frontend        | React 18                      |
| Language        | TypeScript                    |
| Styling         | Tailwind CSS                  |
| Build Tool      | Vite                          |
| State Management| Zustand                       |
| Extension       | Manifest V3                   |

## Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build extension
npm run build
```

## Project Structure

```
src/
├── App.tsx                    # Main application shell
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── background/
│   └── index.ts               # Service worker & background logic
├── components/
│   ├── TopToolbar.tsx         # Top control toolbar
│   ├── DeviceSidebar.tsx      # Device selection sidebar
│   ├── PreviewArea.tsx        # Responsive preview rendering
│   ├── ViewportFrame.tsx      # Individual device viewport
│   ├── MultiDeviceControls.tsx # Multi-device layout controls
│   └── StatusBar.tsx          # Bottom status bar
├── hooks/
│   └── useViewport.ts         # Viewport-related hooks
├── store/
│   └── deviceStore.ts         # Zustand global state store
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   ├── devicePresets.ts       # Device preset data & constants
│   └── helpers.ts             # Utility functions
└── content/
    ├── index.ts               # Content script for web pages
    └── content.css            # Content script styles
```

## MIT License