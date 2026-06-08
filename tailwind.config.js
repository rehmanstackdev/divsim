import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './popup.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          10: '#0c0f1a',   // darkest page bg
          15: '#111624',   // sidebar bg
          20: '#161e30',   // toolbar / panel bg
          30: '#1f293f',   // border
          40: '#28345a',   // hover border / divider
          50: '#0f1520',   // preview canvas bg (dark navy)
          60: '#243060',   // hover bg elements
          70: '#556080',   // muted / secondary text
          80: '#07080e',   // device bezel (near black)
          90: '#8899c0',   // subtle text
          100: '#dce6ff',  // PRIMARY TEXT (near white)
          200: '#ffffff',  // pure white
        },
        accent: {
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0369a1',
        },
        success: '#22d3a0',
        warning: '#fbbf24',
        danger:  '#f43f5e',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm:  '4px',
        md:  '8px',
        lg:  '12px',
        xl:  '18px',
        '2xl': '24px',
        full:'9999px',
      },
      spacing: {
        'status-bar': '28px',
        toolbar:      '52px',
        sidebar:      '220px',
      },
      boxShadow: {
        device: '0 25px 60px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)',
        panel:  '4px 0 20px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
