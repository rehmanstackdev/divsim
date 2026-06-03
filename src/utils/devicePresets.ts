import type { DevicePreset } from '../types';

const UA_ANDROID = (model: string) =>
  `Mozilla/5.0 (Linux; Android 14; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36`;
const UA_IPHONE = (ios: string) =>
  `Mozilla/5.0 (iPhone; CPU iPhone OS ${ios} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1`;
const UA_IPAD =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const UA_DESKTOP =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export const DEVICE_PRESETS: DevicePreset[] = [
  /* ── Android Phones ──────────────────────────────── */
  { id: 'and-s20',        name: 'Samsung Galaxy S20',    category: 'android-phone', width: 360,  height: 800,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('SM-G980B') },
  { id: 'and-mi11i',      name: 'Xiaomi Mi 11i',         category: 'android-phone', width: 393,  height: 873,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('Mi 11i') },
  { id: 'and-p30pro',     name: 'Huawei P30 PRO',        category: 'android-phone', width: 360,  height: 780,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('VOG-L29') },
  { id: 'and-pixel5',     name: 'Google Pixel 5',        category: 'android-phone', width: 393,  height: 851,  pixelRatio: 2.75, icon: '📱', userAgent: UA_ANDROID('Pixel 5') },
  { id: 'and-nord2',      name: 'OnePlus Nord 2',        category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('DN2101') },
  { id: 'and-flip3',      name: 'Galaxy Z Flip3',        category: 'android-phone', width: 412,  height: 914,  pixelRatio: 2.6,  icon: '📱', userAgent: UA_ANDROID('SM-F711B') },
  { id: 'and-findx3',     name: 'OPPO Find X3 PRO',     category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('CPH2173') },
  { id: 'and-a12',        name: 'Galaxy A12',            category: 'android-phone', width: 360,  height: 780,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('SM-A125F') },
  { id: 'and-s21ultra',   name: 'Galaxy S21 Ultra',      category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3.5,  icon: '📱', userAgent: UA_ANDROID('SM-G998B') },
  { id: 'and-pixel6pro',  name: 'Google Pixel 6 PRO',   category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3.5,  icon: '📱', userAgent: UA_ANDROID('Pixel 6 Pro') },
  { id: 'and-mi12',       name: 'Xiaomi 12',             category: 'android-phone', width: 393,  height: 873,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('2201123G') },
  { id: 'and-note20ultra',name: 'Galaxy Note20 Ultra',   category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3.5,  icon: '📱', userAgent: UA_ANDROID('SM-N986B') },
  { id: 'and-s22',        name: 'Galaxy S22',            category: 'android-phone', width: 393,  height: 851,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('SM-S901B') },
  { id: 'and-s22plus',    name: 'Galaxy S22+',           category: 'android-phone', width: 393,  height: 851,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('SM-S906B') },
  { id: 'and-s22ultra',   name: 'Galaxy S22 ULTRA',      category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3.5,  icon: '📱', userAgent: UA_ANDROID('SM-S908B') },
  { id: 'and-pixel8',     name: 'Google Pixel 8',        category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3.5,  icon: '📱', userAgent: UA_ANDROID('Pixel 8') },
  { id: 'and-s24',        name: 'Samsung Galaxy S24',    category: 'android-phone', width: 393,  height: 851,  pixelRatio: 3,    icon: '📱', userAgent: UA_ANDROID('SM-S921B') },
  { id: 'and-s24ultra',   name: 'Galaxy S24 ULTRA',      category: 'android-phone', width: 412,  height: 915,  pixelRatio: 3.5,  icon: '📱', userAgent: UA_ANDROID('SM-S928B') },

  /* ── iPhones ─────────────────────────────────────── */
  { id: 'ip-5',           name: 'iPhone 5',              category: 'iphone', width: 320,  height: 568,  pixelRatio: 2,   icon: '📱', userAgent: UA_IPHONE('8_0') },
  { id: 'ip-se2016',      name: 'iPhone SE 2016',        category: 'iphone', width: 320,  height: 568,  pixelRatio: 2,   icon: '📱', userAgent: UA_IPHONE('9_3') },
  { id: 'ip-x',           name: 'iPhone X',              category: 'iphone', width: 375,  height: 812,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('11_0') },
  { id: 'ip-xr',          name: 'iPhone XR 2018',        category: 'iphone', width: 414,  height: 896,  pixelRatio: 2,   icon: '📱', userAgent: UA_IPHONE('12_0') },
  { id: 'ip-11',          name: 'iPhone 11',             category: 'iphone', width: 414,  height: 896,  pixelRatio: 2,   icon: '📱', userAgent: UA_IPHONE('13_0') },
  { id: 'ip-11pro',       name: 'iPhone 11 PRO',         category: 'iphone', width: 375,  height: 812,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('13_0') },
  { id: 'ip-11promax',    name: 'iPhone 11 PRO MAX',     category: 'iphone', width: 414,  height: 896,  pixelRatio: 3,   icon: '📱', frameAsset: '/iphones/iphone11promax.svg', userAgent: UA_IPHONE('13_0') },
  { id: 'ip-12mini',      name: 'iPhone 12 Mini',        category: 'iphone', width: 360,  height: 780,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('14_0') },
  { id: 'ip-12',          name: 'iPhone 12 (iOS 14)',    category: 'iphone', width: 390,  height: 844,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('14_0') },
  { id: 'ip-12pro',       name: 'iPhone 12 PRO',         category: 'iphone', width: 390,  height: 844,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('14_0') },
  { id: 'ip-12promax',    name: 'iPhone 12 PRO MAX',     category: 'iphone', width: 428,  height: 926,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('14_0') },
  { id: 'ip-13mini',      name: 'iPhone 13 Mini',        category: 'iphone', width: 360,  height: 780,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('15_0') },
  { id: 'ip-13',          name: 'iPhone 13 (iOS 16)',    category: 'iphone', width: 390,  height: 844,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('16_0') },
  { id: 'ip-13pro',       name: 'iPhone 13 PRO',         category: 'iphone', width: 390,  height: 844,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('16_0') },
  { id: 'ip-13promax',    name: 'iPhone 13 PRO MAX',     category: 'iphone', width: 428,  height: 926,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('16_0') },
  { id: 'ip-14',          name: 'iPhone 14',             category: 'iphone', width: 390,  height: 844,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('16_0') },
  { id: 'ip-14pro',       name: 'iPhone 14 PRO',         category: 'iphone', width: 393,  height: 852,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('16_0') },
  { id: 'ip-15',          name: 'iPhone 15',             category: 'iphone', width: 393,  height: 852,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('17_0') },
  { id: 'ip-15pro',       name: 'iPhone 15 PRO',         category: 'iphone', width: 393,  height: 852,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('17_0') },
  { id: 'ip-15promax',    name: 'iPhone 15 PRO MAX',     category: 'iphone', width: 430,  height: 932,  pixelRatio: 3,   icon: '📱', userAgent: UA_IPHONE('17_0') },

  /* ── Android Tablets ─────────────────────────────── */
  { id: 'atab-s9',        name: 'Galaxy Tab S9',         category: 'android-tablet', width: 800,  height: 1280, pixelRatio: 2,   icon: '📱', userAgent: UA_ANDROID('SM-X710') },
  { id: 'atab-s9fe',      name: 'Galaxy Tab S9 FE',      category: 'android-tablet', width: 800,  height: 1280, pixelRatio: 2,   icon: '📱', userAgent: UA_ANDROID('SM-X510') },
  { id: 'atab-a8',        name: 'Galaxy Tab A8',         category: 'android-tablet', width: 800,  height: 1280, pixelRatio: 2,   icon: '📱', userAgent: UA_ANDROID('SM-X200') },

  /* ── iPads ───────────────────────────────────────── */
  { id: 'ipad-mini6',     name: 'iPad Mini 6',           category: 'ipad', width: 744,  height: 1133, pixelRatio: 2,   icon: '📱', userAgent: UA_IPAD },
  { id: 'ipad-air5',      name: 'iPad Air 5',            category: 'ipad', width: 820,  height: 1180, pixelRatio: 2,   icon: '📱', userAgent: UA_IPAD },
  { id: 'ipad-pro11',     name: 'iPad Pro 11"',          category: 'ipad', width: 834,  height: 1194, pixelRatio: 2,   icon: '📱', userAgent: UA_IPAD },
  { id: 'ipad-pro129',    name: 'iPad Pro 12.9"',        category: 'ipad', width: 1024, height: 1366, pixelRatio: 2,   icon: '📱', userAgent: UA_IPAD },

  /* ── Smart Watches ───────────────────────────────── */
  { id: 'watch-ultra',    name: 'Apple Watch Ultra',     category: 'smartwatch', width: 205, height: 251, pixelRatio: 2, icon: '⌚', userAgent: UA_IPHONE('17_0') },
  { id: 'watch-s9',       name: 'Apple Watch S9',        category: 'smartwatch', width: 198, height: 242, pixelRatio: 2, icon: '⌚', userAgent: UA_IPHONE('17_0') },
  { id: 'watch-wearos',   name: 'Wear OS 5',             category: 'smartwatch', width: 220, height: 220, pixelRatio: 2, icon: '⌚', userAgent: UA_ANDROID('Pixel Watch 2') },

  /* ── Desktop ─────────────────────────────────────── */
  { id: 'desk-hd',        name: 'HD 13"',                category: 'desktop', width: 1280, height: 720,  pixelRatio: 1, icon: '🖥️', userAgent: UA_DESKTOP },
  { id: 'desk-fhd',       name: 'Full HD 24"',           category: 'desktop', width: 1920, height: 1080, pixelRatio: 1, icon: '🖥️', userAgent: UA_DESKTOP },
  { id: 'desk-2k',        name: '2K QHD 27"',            category: 'desktop', width: 2560, height: 1440, pixelRatio: 1, icon: '🖥️', userAgent: UA_DESKTOP },
  { id: 'desk-4k',        name: '4K UHD 32"',            category: 'desktop', width: 3840, height: 2160, pixelRatio: 1, icon: '🖥️', userAgent: UA_DESKTOP },

  /* ── Large Display ───────────────────────────────── */
  { id: 'ld-ultrawide',   name: '34" Ultrawide',         category: 'large-display', width: 3440, height: 1440, pixelRatio: 1, icon: '🖥️', userAgent: UA_DESKTOP },
  { id: 'ld-superultra',  name: '49" Super Ultrawide',   category: 'large-display', width: 5120, height: 1440, pixelRatio: 1, icon: '🖥️', userAgent: UA_DESKTOP },

  /* ── TV ──────────────────────────────────────────── */
  { id: 'tv-4k55',        name: '55" 4K TV',             category: 'tv', width: 3840, height: 2160, pixelRatio: 1, icon: '📺', userAgent: 'Mozilla/5.0 (SmartTV; Tizen 6.5) AppleWebKit/537.36 SamsungBrowser/16.0 TV Safari/537.36' },
  { id: 'tv-8k65',        name: '65" 8K TV',             category: 'tv', width: 7680, height: 4320, pixelRatio: 1, icon: '📺', userAgent: 'Mozilla/5.0 (SmartTV; Tizen 6.5) AppleWebKit/537.36 SamsungBrowser/16.0 TV Safari/537.36' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  'android-phone':   'Android Phones',
  'iphone':          'Apple Phones',
  'android-tablet':  'Android Tablets',
  'ipad':            'iPads',
  'smartwatch':      'Smart Watches',
  'desktop':         'Desktop Screens',
  'large-display':   'Large Displays',
  'tv':              'TV Screens',
};

export const CATEGORY_EMOJI: Record<string, string> = {
  'android-phone':   '🤖',
  'iphone':          '🍎',
  'android-tablet':  '📲',
  'ipad':            '🍎',
  'smartwatch':      '⌚',
  'desktop':         '🖥️',
  'large-display':   '🖥️',
  'tv':              '📺',
};

export function formatDimensions(w: number, h: number) {
  return `${w}×${h}`;
}
