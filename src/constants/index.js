/**
 * Centralized application constants.
 * Import from here instead of duplicating values across files.
 */

// ── Authentication ─────────────────────────────────────────────────────────
export const AUTH_COOKIE_NAME  = 'samikna_token';
export const CSRF_COOKIE_NAME  = 'csrf_token';
export const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 jam

// ── API Endpoints ──────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  LOGIN:       '/api/auth/login',
  LOGOUT:      '/api/auth/logout',
  ME:          '/api/auth/me',
  CSRF_TOKEN:  '/api/auth/csrf-token',
  DASHBOARD:   '/api/dashboard/data',
  CROP:        '/api/crop-management',
  SUPPLY:      '/api/supply-chain',
  REPORTS:     '/api/reports',
  PROFILE:     '/api/profile',
};

// ── Kabupaten / Kota Jawa Timur ────────────────────────────────────────────
export const KABUPATEN_JATIM = [
  { id: 'pacitan',       name: 'Kab. Pacitan' },
  { id: 'ponorogo',      name: 'Kab. Ponorogo' },
  { id: 'trenggalek',    name: 'Kab. Trenggalek' },
  { id: 'tulungagung',   name: 'Kab. Tulungagung' },
  { id: 'blitar_kab',   name: 'Kab. Blitar' },
  { id: 'kediri_kab',   name: 'Kab. Kediri' },
  { id: 'malang_kab',   name: 'Kab. Malang' },
  { id: 'lumajang',      name: 'Kab. Lumajang' },
  { id: 'jember',        name: 'Kab. Jember' },
  { id: 'banyuwangi',    name: 'Kab. Banyuwangi' },
  { id: 'bondowoso',     name: 'Kab. Bondowoso' },
  { id: 'situbondo',     name: 'Kab. Situbondo' },
  { id: 'probolinggo_kab', name: 'Kab. Probolinggo' },
  { id: 'pasuruan_kab', name: 'Kab. Pasuruan' },
  { id: 'sidoarjo',      name: 'Kab. Sidoarjo' },
  { id: 'mojokerto_kab', name: 'Kab. Mojokerto' },
  { id: 'jombang',       name: 'Kab. Jombang' },
  { id: 'nganjuk',       name: 'Kab. Nganjuk' },
  { id: 'madiun_kab',   name: 'Kab. Madiun' },
  { id: 'magetan',       name: 'Kab. Magetan' },
  { id: 'ngawi',         name: 'Kab. Ngawi' },
  { id: 'bojonegoro',    name: 'Kab. Bojonegoro' },
  { id: 'tuban',         name: 'Kab. Tuban' },
  { id: 'lamongan',      name: 'Kab. Lamongan' },
  { id: 'gresik',        name: 'Kab. Gresik' },
  { id: 'bangkalan',     name: 'Kab. Bangkalan' },
  { id: 'sampang',       name: 'Kab. Sampang' },
  { id: 'pamekasan',     name: 'Kab. Pamekasan' },
  { id: 'sumenep',       name: 'Kab. Sumenep' },
  { id: 'surabaya',      name: 'Kota Surabaya' },
  { id: 'malang',        name: 'Kota Malang' },
  { id: 'blitar',        name: 'Kota Blitar' },
  { id: 'kediri',        name: 'Kota Kediri' },
  { id: 'mojokerto',     name: 'Kota Mojokerto' },
  { id: 'madiun',        name: 'Kota Madiun' },
  { id: 'probolinggo',   name: 'Kota Probolinggo' },
  { id: 'pasuruan',      name: 'Kota Pasuruan' },
  { id: 'batu',          name: 'Kota Batu' },
];

// ── Crop Types ─────────────────────────────────────────────────────────────
export const CROP_TYPES = [
  { id: 'padi',    name: 'Padi',    icon: '🌾' },
  { id: 'jagung',  name: 'Jagung',  icon: '🌽' },
  { id: 'kedelai', name: 'Kedelai', icon: '🫘' },
  { id: 'tebu',    name: 'Tebu',    icon: '🌿' },
  { id: 'singkong',name: 'Singkong',icon: '🥔' },
  { id: 'cabai',   name: 'Cabai',   icon: '🌶️' },
  { id: 'bawang',  name: 'Bawang',  icon: '🧅' },
  { id: 'tomat',   name: 'Tomat',   icon: '🍅' },
  { id: 'lainnya', name: 'Lainnya', icon: '🌱' },
];

// ── Activity Types ─────────────────────────────────────────────────────────
export const ACTIVITY_TYPES = [
  { id: 'pengolahan_tanah', name: 'Pengolahan Tanah' },
  { id: 'penanaman',        name: 'Penanaman' },
  { id: 'pemupukan',        name: 'Pemupukan' },
  { id: 'penyiraman',       name: 'Penyiraman' },
  { id: 'penyemprotan',     name: 'Penyemprotan Pestisida' },
  { id: 'pemanenan',        name: 'Pemanenan' },
  { id: 'monitoring',       name: 'Monitoring' },
  { id: 'lainnya',          name: 'Lainnya' },
];

// ── Activity Status ────────────────────────────────────────────────────────
export const ACTIVITY_STATUS = {
  PLANNED:    'planned',
  ONGOING:    'ongoing',
  COMPLETED:  'completed',
  CANCELLED:  'cancelled',
  OVERDUE:    'overdue',
};

// ── Inventory Categories ───────────────────────────────────────────────────
export const INVENTORY_CATEGORIES = [
  { id: 'pupuk',      name: 'Pupuk' },
  { id: 'pestisida',  name: 'Pestisida' },
  { id: 'benih',      name: 'Benih' },
  { id: 'alat',       name: 'Alat Pertanian' },
  { id: 'lainnya',    name: 'Lainnya' },
];

// ── Date Range Options ─────────────────────────────────────────────────────
export const DATE_RANGE_OPTIONS = [
  { value: '7',   label: '7 Hari Terakhir' },
  { value: '30',  label: '30 Hari Terakhir' },
  { value: '90',  label: '3 Bulan Terakhir' },
  { value: '180', label: '6 Bulan Terakhir' },
  { value: '365', label: '1 Tahun Terakhir' },
];
