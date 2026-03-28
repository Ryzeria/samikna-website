/**
 * SAMIKNA - Comprehensive Mock Data Seeder
 * Seeds all tables with realistic, recent data for East Java kabupaten.
 *
 * Strategy:
 *  - TRUNCATE time-series tables (satellite, weather, alerts) → fresh 90-day data
 *  - DELETE + re-insert operational tables (fields, activities, supply chain)
 *  - INSERT IGNORE for lookup tables (suppliers, mitra) → keep existing records
 *  - Batch inserts throughout for speed
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

if (!process.env.DB_HOST) {
  console.error('❌ Missing DB env vars. Copy .env.local and fill in DB_HOST, DB_USER, DB_PASS, DB_NAME.');
  process.exit(1);
}

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: false,
  connectTimeout: 120000,
  charset: 'utf8mb4',
};

// ─────────────────────────── helpers ───────────────────────────

function rnd(min, max, dec = 0) {
  const v = Math.random() * (max - min) + min;
  return dec > 0 ? parseFloat(v.toFixed(dec)) : Math.floor(v);
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function dateStr(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// ─────────────────────────── constants ───────────────────────────

const KABUPATEN = [
  { name: 'bangkalan',   lat: -6.9924, lng: 112.7336 },
  { name: 'banyuwangi',  lat: -8.2190, lng: 114.3691 },
  { name: 'blitar',      lat: -8.0961, lng: 112.1608 },
  { name: 'bojonegoro',  lat: -7.1506, lng: 111.8815 },
  { name: 'bondowoso',   lat: -7.9104, lng: 113.8228 },
  { name: 'gresik',      lat: -7.1567, lng: 112.6531 },
  { name: 'jember',      lat: -8.1724, lng: 113.7020 },
  { name: 'jombang',     lat: -7.5500, lng: 112.2333 },
  { name: 'kediri',      lat: -7.8167, lng: 112.0167 },
  { name: 'lamongan',    lat: -7.1119, lng: 112.4132 },
  { name: 'lumajang',    lat: -8.1312, lng: 113.2228 },
  { name: 'madiun',      lat: -7.6295, lng: 111.5231 },
  { name: 'magetan',     lat: -7.6499, lng: 111.3289 },
  { name: 'malang',      lat: -7.9826, lng: 112.6308 },
  { name: 'mojokerto',   lat: -7.4700, lng: 112.4333 },
  { name: 'nganjuk',     lat: -7.6046, lng: 111.9049 },
  { name: 'ngawi',       lat: -7.3975, lng: 111.4461 },
  { name: 'pacitan',     lat: -8.1964, lng: 111.1036 },
  { name: 'pamekasan',   lat: -7.1569, lng: 113.4782 },
  { name: 'pasuruan',    lat: -7.6465, lng: 112.9082 },
  { name: 'ponorogo',    lat: -7.8658, lng: 111.4659 },
  { name: 'probolinggo', lat: -7.7543, lng: 113.2159 },
  { name: 'sampang',     lat: -7.1784, lng: 113.2472 },
  { name: 'sidoarjo',    lat: -7.4479, lng: 112.7183 },
  { name: 'situbondo',   lat: -7.7066, lng: 114.0092 },
  { name: 'sumenep',     lat: -6.9982, lng: 114.0608 },
  { name: 'surabaya',    lat: -7.2504, lng: 112.7688 },
  { name: 'trenggalek',  lat: -8.0527, lng: 111.7090 },
  { name: 'tuban',       lat: -6.8998, lng: 112.0519 },
  { name: 'tulungagung', lat: -8.0645, lng: 111.9029 },
];

const CROP_TYPES = ['padi', 'jagung', 'kedelai', 'tebu', 'cabai', 'tomat', 'kentang'];
const CROP_VARIETY = {
  padi:     ['IR64 Premium', 'Ciherang', 'Inpari 32', 'Mekongga', 'Way Apo Buru'],
  jagung:   ['Hibrida NK212', 'Pioneer P27', 'BISI 18', 'Pertiwi 3', 'JH 37'],
  kedelai:  ['Grobogan', 'Anjasmoro', 'Argomulyo', 'Wilis', 'Dena 1'],
  tebu:     ['PS 862', 'PS 881', 'PS 864', 'VMC 76-16', 'Kidang Kencana'],
  cabai:    ['Keriting Merah TM 999', 'Lokal Jawa', 'Kencana', 'Gada F1', 'Lado'],
  tomat:    ['Mirah F1', 'Permata', 'Servo', 'Tombatu', 'Lebak Bulus'],
  kentang:  ['Atlantik', 'Granola', 'Repita', 'Marabel', 'Granola L'],
};
const GROWTH_STAGES = ['land_preparation', 'planting', 'vegetative', 'flowering', 'fruiting', 'mature'];
const ACTIVITY_TYPES = ['planting', 'fertilizing', 'irrigation', 'pest_control', 'harvesting', 'monitoring', 'land_preparation'];
const WEATHER_CONDITIONS = ['Cerah', 'Berawan', 'Cerah Berawan', 'Hujan Ringan', 'Hujan Sedang', 'Mendung'];

// ─────────────────────────── 1. SATELLITE & WEATHER ───────────────────────────

async function seedSatelliteWeather(conn) {
  console.log('🛰️  Truncating & re-seeding satellite + weather data (90 days × 30 kab)...');
  await conn.query('TRUNCATE TABLE satellite_data');
  await conn.query('TRUNCATE TABLE weather_data');

  const DAYS = 90;
  const CHUNK = 5; // kabupaten per batch

  for (let ci = 0; ci < KABUPATEN.length; ci += CHUNK) {
    const batch = KABUPATEN.slice(ci, ci + CHUNK);
    const satRows = [];
    const wetRows = [];

    for (const kab of batch) {
      for (let d = DAYS; d >= 0; d--) {
        const dt = dateStr(-d);

        // Realistic NDVI oscillation (growth cycle ~60 days)
        const phase    = (d % 60) / 60;
        const baseNDVI = 0.55 + Math.sin(phase * Math.PI * 2) * 0.20 + rnd(-5, 5, 2) * 0.01;
        const ndvi     = Math.max(0.15, Math.min(0.92, baseNDVI));
        // Seasonal temp: East Java avg ~28°C, range ±6°
        const seasonT  = 28 + Math.sin((d / DAYS) * Math.PI) * 4;
        const tempAvg  = seasonT + rnd(-15, 15, 1) * 0.1;
        const humidity = Math.max(45, Math.min(95, 100 - tempAvg * 1.2 + rnd(-10, 10)));
        const rainProb = humidity > 80 ? rnd(0, 35, 1) : rnd(0, 5, 1);
        const cloud    = humidity > 80 ? rnd(30, 90, 1) : rnd(5, 40, 1);

        satRows.push([
          kab.name, dt, '10:30:00',
          parseFloat(ndvi.toFixed(3)),
          parseFloat(Math.max(0.05, ndvi - rnd(8,16,1)*0.01).toFixed(3)),
          parseFloat(Math.min(0.95, ndvi + rnd(8,16,1)*0.01).toFixed(3)),
          parseFloat(Math.max(0.10, (ndvi * 0.78 + rnd(-3,3,2)*0.01)).toFixed(3)),
          parseFloat((tempAvg + rnd(0, 5, 1)).toFixed(2)),  // LST slightly higher
          parseFloat(rainProb.toFixed(2)),
          parseFloat((humidity * 0.6 + rnd(-5,5)).toFixed(2)),
          parseFloat(cloud.toFixed(2)),
          parseFloat((rnd(88, 99, 1)).toFixed(2)),
          parseFloat((rnd(90, 100, 1)).toFixed(2)),
          d % 7 < 4 ? 'Landsat-8' : 'Sentinel-2',
          'L2',
        ]);

        wetRows.push([
          kab.name,
          `Stasiun BMKG ${kab.name.charAt(0).toUpperCase() + kab.name.slice(1)}`,
          `BMKG_${kab.name.toUpperCase().replace(/ /g,'_')}`,
          dt, '14:00:00',
          parseFloat(tempAvg.toFixed(1)),
          parseFloat((tempAvg - rnd(3, 8, 1)).toFixed(1)),
          parseFloat((tempAvg + rnd(3, 8, 1)).toFixed(1)),
          parseFloat(humidity.toFixed(1)),
          parseFloat(rainProb.toFixed(2)),
          parseFloat(rnd(1.5, 18, 1).toFixed(1)),
          parseFloat(rnd(0, 360, 1).toFixed(1)),
          parseFloat(rnd(1005, 1020, 1).toFixed(1)),
          parseFloat(Math.max(1, Math.min(12, tempAvg / 3)).toFixed(1)),
          pick(WEATHER_CONDITIONS),
          parseFloat(rnd(5, 25, 1).toFixed(1)),
          'BMKG',
        ]);
      }
    }

    await conn.query(
      `INSERT INTO satellite_data
        (kabupaten, data_date, data_time, ndvi_avg, ndvi_min, ndvi_max, evi_avg,
         land_surface_temp, rainfall_mm, soil_moisture, cloud_coverage,
         confidence_score, coverage_percentage, satellite_source, processing_level)
       VALUES ?`,
      [satRows]
    );
    await conn.query(
      `INSERT INTO weather_data
        (kabupaten, station_name, station_id, data_date, data_time,
         temperature_avg, temperature_min, temperature_max, humidity_avg,
         rainfall_mm, wind_speed, wind_direction, pressure_hpa, uv_index,
         weather_condition, visibility_km, data_source)
       VALUES ?`,
      [wetRows]
    );

    console.log(`   ✓ Batch ${Math.floor(ci/CHUNK)+1}/${Math.ceil(KABUPATEN.length/CHUNK)} (${batch.map(k=>k.name).join(', ')})`);
  }

  const [[{s}]] = await conn.query('SELECT COUNT(*) s FROM satellite_data');
  const [[{w}]] = await conn.query('SELECT COUNT(*) w FROM weather_data');
  console.log(`   ✅ satellite_data: ${s} rows | weather_data: ${w} rows`);
}

// ─────────────────────────── 2. AGRICULTURAL FIELDS ───────────────────────────

async function seedAgriculturalFields(conn) {
  console.log('🌾  Re-seeding agricultural fields (5 per kabupaten = 150 total)...');

  // Get user IDs mapped by kabupaten
  const [users] = await conn.query('SELECT id, kabupaten FROM users ORDER BY id');
  const userMap = {};
  for (const u of users) userMap[u.kabupaten] = u.id;

  await conn.query('DELETE FROM crop_activities');
  await conn.query('DELETE FROM agricultural_fields');

  const FIELDS_PER_KAB = 5;
  const FIELD_NAMES = [
    'Sawah Timur', 'Ladang Selatan', 'Kebun Barat', 'Lahan Utara', 'Petak Tengah',
    'Blok Merah', 'Blok Hijau', 'Lahan Prima', 'Sawah Induk', 'Kebun Produktif',
  ];
  const DESA_KECAMATAN = [
    'Ds. Sumber Agung', 'Ds. Tani Makmur', 'Ds. Sukamaju', 'Ds. Harapan Baru',
    'Ds. Mekar Sari', 'Ds. Rejosari', 'Ds. Kedungmulyo', 'Ds. Purwosari',
    'Ds. Wonorejo', 'Ds. Sidodadi',
  ];
  const SUPERVISORS = [
    'Ir. Bambang Sutrisno', 'Drh. Siti Rahayu', 'Ir. Ahmad Fauzi',
    'M. Agus Prasetyo, SP', 'Dra. Dewi Lestari', 'Ir. Wahyu Hidayat',
    'Sri Mulyani, SP', 'Ir. Hendra Wijaya', 'Drs. Supriyadi', 'Nining Susilowati, SP',
  ];

  const rows = [];
  for (const kab of KABUPATEN) {
    const userId = userMap[kab.name] || 1;
    const crops = shuffle(CROP_TYPES).slice(0, FIELDS_PER_KAB);

    for (let f = 0; f < FIELDS_PER_KAB; f++) {
      const crop = crops[f];
      const variety = pick(CROP_VARIETY[crop] || ['Varietas Unggul']);
      const stage = pick(GROWTH_STAGES);
      const plantDaysAgo = rnd(10, 100);
      const plantDate = dateStr(-plantDaysAgo);
      const harvestOffset = crop === 'tebu' ? 365 : crop === 'kentang' ? 90 : 110;
      const harvestDate = dateStr(-plantDaysAgo + harvestOffset);
      const ndvi = rnd(35, 85, 3) * 0.01;
      const health = rnd(65, 96, 2);

      rows.push([
        userId,
        `${FIELD_NAMES[f % FIELD_NAMES.length]} ${kab.name.charAt(0).toUpperCase() + kab.name.slice(1)} ${f+1}`,
        kab.name,
        `${pick(DESA_KECAMATAN)}, Kec. ${kab.name.charAt(0).toUpperCase() + kab.name.slice(1)}, Jawa Timur`,
        parseFloat((kab.lat + rnd(-10,10,4)*0.001).toFixed(8)),
        parseFloat((kab.lng + rnd(-10,10,4)*0.001).toFixed(8)),
        rnd(30, 250, 2) * 0.1,    // area 3–25 ha
        crop,
        variety,
        plantDate,
        harvestDate,
        stage,
        health,
        parseFloat(ndvi.toFixed(3)),
        rnd(40, 80, 2),
        rnd(26, 34, 2),
        `Kelompok Tani ${kab.name.charAt(0).toUpperCase() + kab.name.slice(1)} ${f+1}`,
        pick(SUPERVISORS),
        pick(['active','active','active','active','fallow','preparation']),
        `Lahan ${crop} varietas ${variety} dikelola dengan sistem pertanian modern.`,
      ]);
    }
  }

  await conn.query(
    `INSERT INTO agricultural_fields
      (user_id, field_name, kabupaten, location_address, coordinates_lat, coordinates_lng,
       area_hectares, crop_type, crop_variety, planting_date, expected_harvest_date,
       growth_stage, health_score, current_ndvi, current_soil_moisture, current_temperature,
       owner_name, supervisor_name, field_status, field_notes)
     VALUES ?`,
    [rows]
  );
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM agricultural_fields');
  console.log(`   ✅ agricultural_fields: ${n} rows`);
}

// ─────────────────────────── 3. CROP ACTIVITIES ───────────────────────────

async function seedCropActivities(conn) {
  console.log('📋  Seeding crop activities (~5 per field)...');

  const [fields] = await conn.query('SELECT id, user_id, field_name, crop_type FROM agricultural_fields');

  const ACTIVITY_TEMPLATES = [
    { type: 'land_preparation', title: 'Pengolahan Lahan',          dur: 8,  costRange: [3000000, 8000000],   mats: ['Herbisida pra-tanam','Pupuk dasar','Kapur pertanian'],   equip: ['Traktor bajak','Hand tractor','Cangkul'] },
    { type: 'planting',         title: 'Penanaman Bibit',            dur: 10, costRange: [8000000, 18000000],  mats: ['Benih bersertifikat','Fungisida benih','Pupuk starter'], equip: ['Alat tanam manual','Tugal','Ember'] },
    { type: 'fertilizing',      title: 'Aplikasi Pupuk NPK',         dur: 4,  costRange: [4000000, 10000000],  mats: ['Pupuk NPK 15-15-15','Urea','KCl','ZA'],                 equip: ['Spreader pupuk','Sprayer knapsack','Gerobak'] },
    { type: 'fertilizing',      title: 'Pemupukan Susulan Organik',  dur: 3,  costRange: [2000000, 6000000],   mats: ['Pupuk kandang','Kompos matang','Pupuk hayati'],          equip: ['Cangkul','Gerobak dorong','Ember'] },
    { type: 'irrigation',       title: 'Pengairan Irigasi Tetes',    dur: 6,  costRange: [3000000, 9000000],   mats: ['Air irigasi bersih','Pupuk larut air'],                  equip: ['Pompa irigasi','Selang drip','Timer otomatis'] },
    { type: 'irrigation',       title: 'Irigasi Curah / Sprinkler',  dur: 4,  costRange: [2000000, 7000000],   mats: ['Air irigasi'],                                           equip: ['Pompa sentrifugal','Sprinkler','Pipa PVC'] },
    { type: 'pest_control',     title: 'Pengendalian Hama Terpadu',  dur: 5,  costRange: [3000000, 8000000],   mats: ['Insektisida bio','Pestisida nabati','Perangkap feromon'], equip: ['Sprayer motorized','APD lengkap','Masker respirator'] },
    { type: 'pest_control',     title: 'Penyemprotan Fungisida',     dur: 3,  costRange: [2000000, 5000000],   mats: ['Fungisida sistemik','Surfaktan','Air bersih'],           equip: ['Sprayer punggung','APD','Topi petani'] },
    { type: 'monitoring',       title: 'Monitoring Kesehatan Tanaman', dur: 2, costRange: [500000, 1500000],  mats: ['Form monitoring','Kertas pH','Sample tanah'],            equip: ['GPS handheld','Soil tester','pH meter digital','Kamera'] },
    { type: 'monitoring',       title: 'Pengambilan Sampel Tanah',   dur: 3,  costRange: [1000000, 3000000],   mats:['Kantong sampel','Label','Ice box'],                      equip: ['Bor tanah','GPS','Timbangan digital'] },
    { type: 'harvesting',       title: 'Panen Raya',                 dur: 14, costRange: [8000000, 20000000],  mats: ['Karung panen','Tali rafia','Sabit panen'],               equip: ['Combine harvester mini','Gerobak panen','Terpal'] },
    { type: 'harvesting',       title: 'Sortasi dan Grading Hasil',  dur: 6,  costRange: [2000000, 6000000],   mats: ['Karung grade A/B','Timbangan','Label sortasi'],          equip: ['Timbangan duduk','Meja sortasi','Plastik kemasan'] },
  ];

  const rows = [];
  const STATUSES = ['completed','completed','completed','ongoing','planned','planned'];
  const PRIORITIES = ['normal','normal','high','low','urgent'];
  const WEATHER_OBS = ['Cerah, suhu 28–32°C','Berawan ringan','Hujan pagi, siang cerah','Cuaca kondusif','Angin sepoi-sepoi'];

  for (const field of fields) {
    // Pick 5-7 activities per field
    const chosen = shuffle(ACTIVITY_TEMPLATES).slice(0, rnd(5, 7));

    chosen.forEach((tmpl, idx) => {
      const daysOffset = rnd(-80, 30);
      const status = daysOffset > 5 ? 'planned' : pick(STATUSES);
      const isCompleted = status === 'completed';
      const cost = rnd(tmpl.costRange[0], tmpl.costRange[1]);
      const workers = rnd(2, 12);
      const materials = tmpl.mats.map((m, i) => ({
        name: m,
        quantity: rnd(10, 200),
        unit: ['kg','liter','karung','pak'][i % 4],
        cost: Math.floor(cost * (0.2 + i * 0.1)),
      }));

      rows.push([
        field.user_id,
        field.id,
        tmpl.type,
        `${tmpl.title} - ${field.field_name}`,
        `${tmpl.title} dilaksanakan pada lahan ${field.field_name} untuk meningkatkan produktivitas tanaman ${field.crop_type}.`,
        dateStr(daysOffset),
        isCompleted ? dateStr(daysOffset + rnd(0, 2)) : null,
        tmpl.dur,
        rnd(5, 200, 2) * 0.1,
        JSON.stringify(materials),
        JSON.stringify(tmpl.equip.map(e => ({ name: e, condition: 'Baik', operator: `Operator ${rnd(1,5)}` }))),
        workers,
        `Ir. ${['Siti', 'Budi', 'Ahmad', 'Dewi', 'Eko'][idx % 5]} ${['Rahayu', 'Santoso', 'Wijaya', 'Pratama', 'Kusuma'][idx % 5]}, SP`,
        cost,
        status,
        pick(PRIORITIES),
        pick(WEATHER_OBS),
        `${tmpl.title} dilaksanakan sesuai SOP Dinas Pertanian Jawa Timur. Hasil pemantauan menunjukkan kondisi lahan ${pick(['sangat baik','baik','normal','perlu perhatian'])}.`,
        isCompleted ? rnd(75, 98, 2) : null,
      ]);
    });
  }

  await conn.query(
    `INSERT INTO crop_activities
      (user_id, field_id, activity_type, activity_title, activity_description,
       scheduled_date, completed_date, duration_hours, area_hectares,
       materials_used, equipment_used, workers_count, supervisor_name,
       total_cost, activity_status, priority_level, weather_conditions,
       activity_notes, quality_score)
     VALUES ?`,
    [rows]
  );
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM crop_activities');
  console.log(`   ✅ crop_activities: ${n} rows`);
}

// ─────────────────────────── 4. SUPPLIERS ───────────────────────────

async function seedSuppliers(conn) {
  console.log('🏢  Ensuring suppliers (INSERT IGNORE)...');

  const extra = [
    ['PT. Sejahtera Benih Unggul','SBU001','seeds','Rudi Hermawan','rudi@sejahterabenih.id','+62-822-1111-2222','Malang',4.7,JSON.stringify(['Organik','SNI']),92.5,93.0,35],
    ['CV. Nutrisi Tanah Nusantara','NTN001','fertilizers','Lina Susanti','lina@nutrisitanah.co.id','+62-811-3333-4444','Kediri',4.5,JSON.stringify(['ISO 9001']),88.0,91.5,28],
    ['PT. Agro Kimia Jatim','AKJ001','pesticides','Hendra Mulyadi','hendra@agrokimia.id','+62-813-5555-7777','Surabaya',4.6,JSON.stringify(['ISO 14001','REACH']),90.0,94.0,42],
    ['UD. Mesin Tani Makmur','MTM001','equipment','Slamet Riyadi','slamet@mesintani.id','+62-818-8888-0000','Gresik',4.4,JSON.stringify(['CE Certified']),85.0,90.0,19],
    ['PT. Teknologi Agro Digital','TAD001','services','Fitri Anggraini','fitri@agrodigital.id','+62-877-9999-1111','Surabaya',4.8,JSON.stringify(['ISO 27001','ISO 9001']),95.0,96.0,55],
    ['CV. Tools Pertanian Prima','TPP001','tools','Andika Pratama','andika@toolstani.id','+62-856-2222-3333','Mojokerto',4.3,JSON.stringify(['SNI']),87.0,89.5,22],
  ];

  for (const s of extra) {
    await conn.query(
      `INSERT IGNORE INTO suppliers
        (supplier_name,supplier_code,category,contact_person,email,phone,city,rating,certifications,on_time_delivery_rate,quality_score,total_orders)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      s
    );
  }
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM suppliers');
  console.log(`   ✅ suppliers: ${n} rows`);
}

// ─────────────────────────── 5. SUPPLY CHAIN ITEMS ───────────────────────────

async function seedSupplyChainItems(conn) {
  console.log('📦  Re-seeding supply chain items (25 items)...');

  await conn.query('DELETE FROM supply_chain_order_items');
  await conn.query('DELETE FROM supply_chain_orders');
  await conn.query('DELETE FROM inventory_movements');
  await conn.query('DELETE FROM supply_chain_items');

  // Get supplier IDs
  const [sups] = await conn.query('SELECT id, category FROM suppliers ORDER BY id');
  const supByCat = {};
  for (const s of sups) { (supByCat[s.category] = supByCat[s.category] || []).push(s.id); }
  const supId = (cat) => pick(supByCat[cat] || [1]);

  const items = [
    // Seeds (5)
    ['Benih Padi IR64 Premium','BPD-IR64-001','SKU-BPD001','seeds',supId('seeds'),3500,500,6000,'kg',35000,'Gudang A-1','2025-12-31','A+'],
    ['Benih Jagung Hibrida NK212','BJG-NK212-002','SKU-BJG002','seeds',supId('seeds'),2200,400,4000,'kg',48000,'Gudang A-2','2025-08-30','A+'],
    ['Benih Kedelai Grobogan','BKD-GRB-003','SKU-BKD003','seeds',supId('seeds'),1800,300,3500,'kg',32000,'Gudang A-3','2025-10-31','A'],
    ['Benih Cabai TM 999 F1','BCB-TM999-004','SKU-BCB004','seeds',supId('seeds'),850,100,1500,'kg',185000,'Gudang A-4','2025-09-30','A+'],
    ['Benih Tomat Mirah F1','BTM-MRH-005','SKU-BTM005','seeds',supId('seeds'),650,80,1200,'kg',220000,'Gudang A-5','2025-07-31','A'],
    // Fertilizers (6)
    ['Pupuk NPK 15-15-15 Organik','FNK-151515-006','SKU-FNK006','fertilizers',supId('fertilizers'),2400,600,5000,'kg',14500,'Gudang B-1','2026-06-30','A+'],
    ['Pupuk Urea Premium 46%','FUR-P46-007','SKU-FUR007','fertilizers',supId('fertilizers'),3200,800,6000,'kg',9500,'Gudang B-2','2026-12-31','A'],
    ['Pupuk TSP Super 36%','FTS-P36-008','SKU-FTS008','fertilizers',supId('fertilizers'),1800,400,3500,'kg',17000,'Gudang B-3','2026-06-30','A'],
    ['Pupuk KCl 60% Premium','FKC-P60-009','SKU-FKC009','fertilizers',supId('fertilizers'),1200,300,2500,'kg',21000,'Gudang B-4','2026-12-31','A'],
    ['Pupuk Organik Cair Bio','POC-BIO-010','SKU-POC010','fertilizers',supId('fertilizers'),1500,300,3000,'liter',28000,'Gudang B-5','2025-11-30','A+'],
    ['Pupuk Hayati Mikoriza','PHM-MIK-011','SKU-PHM011','fertilizers',supId('fertilizers'),800,150,1500,'kg',55000,'Gudang B-6','2025-10-31','A+'],
    // Pesticides (4)
    ['Insektisida Bio Nabati','PBS-NB-012','SKU-PBS012','pesticides',supId('pesticides'),420,80,800,'liter',92000,'Gudang C-1','2025-12-31','A+'],
    ['Fungisida Sistemik','PFS-SIS-013','SKU-PFS013','pesticides',supId('pesticides'),380,60,700,'liter',115000,'Gudang C-2','2025-11-30','A'],
    ['Herbisida Ramah Lingkungan','PHB-RL-014','SKU-PHB014','pesticides',supId('pesticides'),280,50,500,'liter',78000,'Gudang C-3','2025-12-31','A'],
    ['Akarisida Organik','PAK-ORG-015','SKU-PAK015','pesticides',supId('pesticides'),160,30,300,'liter',135000,'Gudang C-4','2025-09-30','A'],
    // Equipment (4)
    ['Traktor Mini 4WD 30HP','EMT-4WD-016','SKU-EMT016','equipment',supId('equipment'),5,2,8,'unit',82000000,'Gudang Equipment',null,'A+'],
    ['Hand Tractor 8HP Power Plus','EHT-8HP-017','SKU-EHT017','equipment',supId('equipment'),12,3,20,'unit',13500000,'Gudang Equipment',null,'A'],
    ['Combine Harvester 105HP','ECH-105-018','SKU-ECH018','equipment',supId('equipment'),3,1,5,'unit',285000000,'Gudang Equipment',null,'A+'],
    ['Pompa Irigasi Sentrifugal 3"','EPI-3IN-019','SKU-EPI019','equipment',supId('equipment'),18,5,30,'unit',4800000,'Gudang Equipment',null,'A'],
    // Tools (6)
    ['Sprayer Motorized 20L','TSM-20L-020','SKU-TSM020','tools',supId('tools'),35,10,60,'unit',2800000,'Gudang Tools',null,'A+'],
    ['Soil pH & NPK Meter Digital','TPH-DIG-021','SKU-TPH021','tools',supId('tools'),22,5,40,'unit',1250000,'Gudang Tools',null,'A'],
    ['GPS Handheld Garmin 64s','TGP-G64-022','SKU-TGP022','tools',supId('tools'),15,5,25,'unit',3800000,'Gudang Tools',null,'A+'],
    ['Drone Pertanian DJI Agras','TDR-DJI-023','SKU-TDR023','tools',supId('tools'),4,2,8,'unit',95000000,'Gudang Equipment',null,'A+'],
    ['Moisture Meter Profesional','TMM-PRO-024','SKU-TMM024','tools',supId('tools'),28,8,50,'unit',850000,'Gudang Tools',null,'A'],
    ['Refraktometer Brix 0-32%','TRF-BRX-025','SKU-TRF025','tools',supId('tools'),18,5,35,'unit',650000,'Gudang Tools',null,'A'],
  ];

  await conn.query(
    `INSERT INTO supply_chain_items
      (item_name,item_code,sku,category,supplier_id,current_stock,min_stock_level,
       max_stock_level,unit_of_measure,unit_price,storage_location,expiry_date,quality_grade,
       tracking_code,barcode,item_status)
     VALUES ?`,
    [items.map(it => [
      ...it,
      `TRK-${it[1]}`, `BAR-${it[1]}`, 'active',
    ])]
  );
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM supply_chain_items');
  console.log(`   ✅ supply_chain_items: ${n} rows`);
}

// ─────────────────────────── 6. SUPPLY CHAIN ORDERS ───────────────────────────

async function seedSupplyChainOrders(conn) {
  console.log('🚚  Seeding supply chain orders (60 orders)...');

  const [sups] = await conn.query('SELECT id FROM suppliers');
  const [users] = await conn.query('SELECT id FROM users ORDER BY id');
  const [items] = await conn.query('SELECT id, unit_price, category FROM supply_chain_items');

  const ORDER_STATUSES = ['pending','confirmed','confirmed','shipped','shipped','delivered','delivered','delivered'];
  const PAY_STATUSES   = ['pending','paid','paid'];
  const PRIORITIES     = ['normal','normal','normal','high','urgent','low'];

  const NOTE_TEMPL = [
    'Order rutin bulanan untuk kebutuhan operasional',
    'Pengadaan darurat akibat stock habis lebih cepat',
    'Order berdasarkan rekomendasi penyuluh pertanian',
    'Persiapan musim tanam berikutnya',
    'Order khusus untuk program intensifikasi pertanian',
    'Pembelian berdasarkan hasil evaluasi lapangan',
  ];

  const orderRows = [];
  const orderItemRows = [];
  let orderSeq = 1;

  for (let i = 0; i < 60; i++) {
    const sup  = pick(sups);
    const user = users[i % users.length];
    const daysOff = rnd(0, 85);
    const orderDate = dateStr(-daysOff);
    const expectedDel = dateStr(-daysOff + rnd(5, 14));
    const actualDel = daysOff > 14 && Math.random() > 0.3 ? dateStr(-daysOff + rnd(6, 16)) : null;
    const status = actualDel ? 'delivered' : daysOff < 3 ? 'pending' : pick(ORDER_STATUSES);
    const payStatus = status === 'delivered' ? pick(['paid','paid','pending']) : 'pending';
    const orderNo = `ORD-2025-${String(orderSeq++).padStart(4,'0')}`;

    // Pick 1-4 compatible items
    const numItems = rnd(1, 4);
    const chosenItems = shuffle(items).slice(0, numItems);
    let totalAmount = 0;
    const thisBatch = [];
    for (const item of chosenItems) {
      const qty = item.category === 'equipment' ? rnd(1, 3) : rnd(20, 200);
      const unitPrice = item.unit_price;
      totalAmount += qty * unitPrice;
      thisBatch.push([null, item.id, qty, unitPrice, qty, status === 'delivered' ? 'delivered' : 'pending', '']);
    }

    orderRows.push([
      orderNo, sup.id, user.id, orderDate, expectedDel, actualDel,
      totalAmount, status, payStatus,
      pick(PRIORITIES), pick(NOTE_TEMPL),
    ]);
    orderItemRows.push(thisBatch);
  }

  for (let i = 0; i < orderRows.length; i++) {
    const [res] = await conn.query(
      `INSERT INTO supply_chain_orders
        (order_number, supplier_id, user_id, order_date, expected_delivery_date,
         actual_delivery_date, total_amount, order_status, payment_status,
         priority_level, order_notes)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      orderRows[i]
    );
    const orderId = res.insertId;
    for (const it of orderItemRows[i]) {
      it[0] = orderId;
    }
    await conn.query(
      `INSERT INTO supply_chain_order_items
        (order_id, item_id, quantity, unit_price, delivered_quantity, item_status, notes)
       VALUES ?`,
      [orderItemRows[i]]
    );
  }

  const [[{o}]] = await conn.query('SELECT COUNT(*) o FROM supply_chain_orders');
  const [[{oi}]] = await conn.query('SELECT COUNT(*) oi FROM supply_chain_order_items');
  console.log(`   ✅ supply_chain_orders: ${o} | order_items: ${oi}`);
}

// ─────────────────────────── 7. INVENTORY MOVEMENTS ───────────────────────────

async function seedInventoryMovements(conn) {
  console.log('📈  Seeding inventory movements (10-15 per item)...');

  const [items] = await conn.query('SELECT id, current_stock, unit_price FROM supply_chain_items');
  const [users] = await conn.query('SELECT id FROM users LIMIT 10');

  const mvRows = [];
  const MOVE_TYPES = ['in','in','in','out','out','adjustment'];
  const REF_TYPES  = { in: 'purchase', out: 'consumption', adjustment: 'adjustment' };
  const NOTES = {
    in:  ['Penerimaan dari supplier','Retur dari gudang cabang','Pembelian tambahan','Penerimaan order'],
    out: ['Pengeluaran ke lapangan','Distribusi ke petani','Pemakaian kegiatan lapangan','Pengiriman ke pos distribusi'],
    adjustment: ['Penyesuaian stock opname','Koreksi data','Perubahan setelah audit','Selisih timbangan'],
  };

  for (const item of items) {
    const numMov = rnd(10, 15);
    let stock = 0;

    for (let m = 0; m < numMov; m++) {
      const mvType = m < 3 ? 'in' : pick(MOVE_TYPES);
      const qty = mvType === 'in'
        ? rnd(50, 500)
        : mvType === 'adjustment'
          ? rnd(1, 50)
          : rnd(10, 100);

      const prev = stock;
      if (mvType === 'in') stock += qty;
      else if (mvType === 'out') stock = Math.max(0, stock - qty);
      else stock = Math.max(0, stock + (Math.random() > 0.5 ? qty : -qty));

      const unitCost = item.unit_price * rnd(90, 110, 2) * 0.01;
      mvRows.push([
        item.id, mvType, qty, REF_TYPES[mvType], prev, stock,
        unitCost, qty * unitCost,
        dateStr(-(numMov - m) * 6),
        pick(NOTES[mvType]),
        pick(users).id,
      ]);
    }

    // Sync final stock
    await conn.query('UPDATE supply_chain_items SET current_stock = ? WHERE id = ?', [stock, item.id]);
  }

  await conn.query(
    `INSERT INTO inventory_movements
      (item_id, movement_type, quantity, reference_type, previous_stock, new_stock,
       unit_cost, total_cost, movement_date, notes, created_by)
     VALUES ?`,
    [mvRows]
  );
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM inventory_movements');
  console.log(`   ✅ inventory_movements: ${n} rows`);
}

// ─────────────────────────── 8. SYSTEM ALERTS ───────────────────────────

async function seedSystemAlerts(conn) {
  console.log('🚨  Truncating & re-seeding system alerts...');
  await conn.query('TRUNCATE TABLE system_alerts');

  const ALERT_TEMPLATES = [
    // Weather
    { type:'weather', sev:'high',     title:'⚡ Peringatan Angin Kencang',         msg:'Kecepatan angin diprediksi mencapai {v} km/jam. Amankan tanaman dan peralatan lapangan.', action:'Segera amankan tanaman muda dan peralatan. Tunda kegiatan semprot.', pri:80 },
    { type:'weather', sev:'medium',   title:'🌧️ Potensi Hujan Lebat',              msg:'BMKG memprakirakan curah hujan {v}–{v2} mm dalam 12 jam ke depan.', action:'Pastikan saluran drainase berfungsi baik. Tunda pemupukan.', pri:60 },
    { type:'weather', sev:'low',      title:'☀️ Prediksi Kemarau Panjang',          msg:'Musim kemarau diperkirakan berlanjut {v} minggu ke depan.', action:'Intensifkan irigasi. Monitor kelembaban tanah secara berkala.', pri:40 },
    { type:'weather', sev:'info',     title:'🌤️ Cuaca Ideal untuk Aplikasi Pupuk', msg:'Kondisi cuaca optimal: suhu {v}°C, tidak ada hujan 48 jam ke depan.', action:'Manfaatkan kondisi cuaca untuk pemupukan dan penyemprotan.', pri:20 },
    { type:'weather', sev:'critical', title:'🌀 Potensi Banjir Bandang',            msg:'Level sungai naik signifikan. Risiko banjir tinggi di daerah dataran rendah.', action:'Segera evakuasi hasil panen. Koordinasi dengan BPBD setempat.', pri:95 },
    // Satellite
    { type:'satellite', sev:'medium', title:'📉 Penurunan NDVI Signifikan',         msg:'NDVI turun {v}% dalam 7 hari terakhir. Kemungkinan stres tanaman atau serangan hama.', action:'Lakukan pengecekan lapangan segera. Periksa kondisi tanaman secara visual.', pri:65 },
    { type:'satellite', sev:'low',    title:'🛰️ Data Citra Terbaru Tersedia',        msg:'Citra satelit {v} berhasil diproses. Data NDVI dan EVI telah diperbarui.', action:'Tinjau data terbaru di dashboard monitoring.', pri:25 },
    { type:'satellite', sev:'high',   title:'🌡️ Suhu Permukaan Lahan Tinggi',       msg:'Land Surface Temperature mencapai {v}°C. Indikasi cekaman panas pada tanaman.', action:'Tingkatkan frekuensi irigasi. Pertimbangkan mulsa untuk mengurangi suhu tanah.', pri:75 },
    { type:'satellite', sev:'info',   title:'💧 Kelembaban Tanah Optimal',           msg:'Soil moisture index menunjukkan kondisi optimal ({v}%) untuk pertumbuhan tanaman.', action:'Pertahankan jadwal irigasi saat ini.', pri:15 },
    // System
    { type:'system', sev:'info',      title:'⚙️ Update Sistem SAMIKNA',             msg:'Sistem telah diperbarui ke versi {v}. Fitur baru: analitik real-time ditingkatkan.', action:'Tidak diperlukan tindakan. Hubungi admin jika ada kendala.', pri:10 },
    { type:'system', sev:'low',       title:'📊 Laporan Bulanan Tersedia',           msg:'Laporan monitoring bulan {v} telah selesai diproses dan siap diunduh.', action:'Unduh laporan dari menu Reports.', pri:30 },
    // Inventory
    { type:'inventory', sev:'high',   title:'⚠️ Stok Kritis: Benih Padi',           msg:'Stok benih padi IR64 tersisa {v} kg. Di bawah batas minimum ({v2} kg).', action:'Segera lakukan pemesanan ke supplier. Estimasi waktu pengiriman 5-7 hari.', pri:82 },
    { type:'inventory', sev:'medium', title:'📦 Stok Pupuk NPK Menipis',            msg:'Stok pupuk NPK 15-15-15 tersisa {v} kg ({v2}% dari target).', action:'Rencanakan pembelian dalam 2 minggu ke depan.', pri:55 },
    { type:'inventory', sev:'low',    title:'✅ Stok Pestisida Organik Mencukupi',   msg:'Level stok pestisida bio dalam kondisi baik. Tersedia untuk {v} minggu ke depan.', action:'Tidak diperlukan tindakan segera.', pri:20 },
    // Crop
    { type:'crop', sev:'high',        title:'🐛 Deteksi Serangan Wereng Coklat',    msg:'Pola cuaca mendukung ledakan populasi wereng coklat. Waspadai tanaman padi fase vegetatif.', action:'Lakukan monitoring intensif 2x seminggu. Siapkan insektisida bio.', pri:85 },
    { type:'crop', sev:'medium',      title:'🍄 Risiko Penyakit Blast Padi',        msg:'Kelembaban tinggi ({v}%) meningkatkan risiko penyakit blast. Waspada pada persemaian.', action:'Aplikasikan fungisida preventif. Perbaiki sirkulasi udara antar tanaman.', pri:62 },
    { type:'crop', sev:'medium',      title:'🦟 Potensi Serangan Penggerek Batang', msg:'Fase vegetatif dan cuaca lembab meningkatkan risiko penggerek batang padi.', action:'Pasang perangkap feromon. Monitor secara rutin setiap 3 hari.', pri:58 },
    { type:'crop', sev:'low',         title:'🌱 Rekomendasi Pemupukan',             msg:'Berdasarkan data NDVI dan umur tanaman, waktu optimal pemupukan susulan tiba.', action:'Aplikasikan pupuk N-P-K sesuai rekomendasi lokal. Kondisi cuaca mendukung.', pri:35 },
    { type:'crop', sev:'info',        title:'📅 Perkiraan Panen Mendatang',         msg:'Estimasi {v} lahan memasuki fase panen dalam {v2} hari ke depan.', action:'Persiapkan peralatan panen dan koordinasi tenaga kerja.', pri:18 },
    // Equipment
    { type:'equipment', sev:'medium', title:'🔧 Jadwal Servis Traktor Tiba',        msg:'Traktor unit {v} telah beroperasi {v2} jam. Jadwal servis rutin telah melewati batas.', action:'Jadwalkan servis ke bengkel terdekat dalam 3 hari ke depan.', pri:50 },
    { type:'equipment', sev:'low',    title:'✅ Kalibrasi Sensor Berhasil',          msg:'Sensor pH dan kelembaban tanah telah dikalibrasi ulang. Akurasi data meningkat.', action:'Tidak diperlukan tindakan. Pantau konsistensi data selama 1 minggu.', pri:22 },
  ];

  const rows = [];
  for (let i = 0; i < 90; i++) {
    const kab   = KABUPATEN[i % KABUPATEN.length];
    const tmpl  = ALERT_TEMPLATES[i % ALERT_TEMPLATES.length];
    const v     = rnd(5, 90);
    const v2    = rnd(v, v + 30);
    const hoursAgo = rnd(1, 72);
    const alertTime = new Date(Date.now() - hoursAgo * 3600000);
    const isActive = Math.random() > 0.2;
    const expiresHrs = rnd(12, 168);
    const expiresAt = new Date(alertTime.getTime() + expiresHrs * 3600000);

    rows.push([
      tmpl.type, tmpl.sev,
      tmpl.title,
      tmpl.msg.replace(/{v}/g, v).replace(/{v2}/g, v2),
      kab.name,
      `Kecamatan ${kab.name.charAt(0).toUpperCase() + kab.name.slice(1)} dan sekitarnya`,
      tmpl.action,
      true, isActive, tmpl.pri,
      alertTime,
      isActive ? expiresAt : alertTime,
    ]);
  }

  await conn.query(
    `INSERT INTO system_alerts
      (alert_type, severity, title, message, kabupaten, location_details,
       recommended_action, is_automated, is_active, priority_score, alert_time, expires_at)
     VALUES ?`,
    [rows]
  );
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM system_alerts');
  console.log(`   ✅ system_alerts: ${n} rows`);
}

// ─────────────────────────── 9. MITRA PARTNERS ───────────────────────────

async function seedMitraPartners(conn) {
  console.log('🤝  Ensuring mitra partners (INSERT IGNORE)...');

  const extra = [
    ['Kementerian Pertanian RI','KEMENTAN_RI','government',null,'https://pertanian.go.id','Jl. Harsono RM No.3','Jakarta Selatan','DKI Jakarta',-6.2598,106.8269,'Kepala Biro TI','info@pertanian.go.id','+62-21-7804161','Kementerian Pertanian RI sebagai mitra utama dalam implementasi smart farming nasional.',JSON.stringify(['Regulasi','Anggaran','Koordinasi Nasional']),'active',4.8],
    ['LAPAN - Pusat Teknologi Penginderaan Jauh','LAPAN_PTPJ','research',null,'https://lapan.go.id','Jl. Lapan No.70','Bogor','Jawa Barat',-6.5907,106.8268,'Kepala Pusat','lapan@lapan.go.id','+62-251-822-1427','LAPAN menyediakan data citra satelit resolusi tinggi untuk monitoring pertanian.',JSON.stringify(['Data Satelit','Penginderaan Jauh','Analisis Citra']),'active',4.9],
    ['Universitas Gadjah Mada - Fak. Pertanian','UGM_PERTANIAN','academic',null,'https://ugm.ac.id','Jl. Flora 1 Bulaksumur','Yogyakarta','DI Yogyakarta',-7.7705,110.3778,'Dekan Pertanian','pertanian@ugm.ac.id','+62-274-563062','UGM berkontribusi dalam penelitian varietas unggul dan teknologi pertanian inovatif.',JSON.stringify(['Penelitian','Pemuliaan Tanaman','Agroteknologi']),'active',4.7],
    ['Badan Standardisasi Nasional (BSN)','BSN_PERTANIAN','government',null,'https://bsn.go.id','Jl. Kuningan Barat No.1','Jakarta Selatan','DKI Jakarta',-6.2358,106.8239,'Direktur Pertanian','bsn@bsn.go.id','+62-21-5747043','BSN memastikan standar kualitas produk pertanian dan alat ukur pertanian.',JSON.stringify(['Sertifikasi','Standarisasi','Kalibrasi']),'active',4.5],
    ['Badan Riset dan Inovasi Nasional (BRIN)','BRIN_AGRO','research',null,'https://brin.go.id','Jl. Gatot Subroto No.10','Jakarta Selatan','DKI Jakarta',-6.2345,106.8197,'Kepala Pusat Agro','brin@brin.go.id','+62-21-5225711','BRIN mendukung penelitian teknologi IoT dan AI untuk pertanian presisi.',JSON.stringify(['IoT Pertanian','AI Analytics','Smart Farming']),'active',4.6],
    ['Pusat Penelitian Kopi dan Kakao Indonesia','ICCRI','research',null,'https://iccri.net','Jl. PB. Sudirman No.90','Jember','Jawa Timur',-8.1725,113.7022,'Direktur Penelitian','iccri@iccri.net','+62-331-757000','ICCRI mendukung diversifikasi pertanian dan penelitian tanaman perkebunan.',JSON.stringify(['Penelitian Kopi','Kakao','Perkebunan']),'active',4.4],
    ['Asosiasi Petani Jawa Timur (APJATI)','APJATI','ngo',null,'https://apjati.or.id','Jl. Raya Diponegoro No.12','Surabaya','Jawa Timur',-7.2503,112.7688,'Ketua Umum','apjati@apjati.or.id','+62-31-5678901','APJATI mewakili 500.000+ petani di Jawa Timur dalam implementasi teknologi modern.',JSON.stringify(['Pemberdayaan Petani','Pelatihan','Advokasi']),'active',4.5],
    ['PT. Petrokimia Gresik','PKG_GRESIK','private',null,'https://petrokimia-gresik.com','Jl. Jenderal Ahmad Yani','Gresik','Jawa Timur',-7.1566,112.6532,'Manager Agro','pk_gresik@petrokimia-gresik.com','+62-31-3981811','Produsen pupuk terbesar di Indonesia, mendukung program pemupukan berimbang.',JSON.stringify(['Pupuk Kimia','Pupuk Hayati','Konsultasi Pemupukan']),'active',4.7],
    ['Balai Besar Perbenihan dan Proteksi Tanaman Pangan','BBP2TP','government',null,'https://bbpopt.pertanian.go.id','Jl. Raya Bekasi KM 17','Cimanggis','Jawa Barat',-6.3726,106.9161,'Kepala Balai','bbp2tp@pertanian.go.id','+62-21-8710796','BBP2TP bertanggung jawab dalam pengawasan mutu benih dan pengendalian hama.',JSON.stringify(['Pengawasan Benih','Proteksi Tanaman','Laboratorium']),'active',4.6],
  ];

  for (const p of extra) {
    await conn.query(
      `INSERT IGNORE INTO mitra_partners
        (partner_name, partner_code, partner_type, logo_url, website, address, city, province,
         latitude, longitude, contact_person, contact_email, contact_phone, description,
         services_offered, partnership_status, rating)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      p
    );
  }
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM mitra_partners');
  console.log(`   ✅ mitra_partners: ${n} rows`);
}

// ─────────────────────────── 10. USER SETTINGS ───────────────────────────

async function seedUserSettings(conn) {
  console.log('⚙️   Ensuring user settings for all 30 users...');

  const [users] = await conn.query('SELECT id FROM users');
  const defaults = [
    ['notifications', 'emailNotifications',     true],
    ['notifications', 'pushNotifications',       true],
    ['notifications', 'weatherAlerts',           true],
    ['notifications', 'satelliteAlerts',         true],
    ['notifications', 'inventoryAlerts',         true],
    ['notifications', 'cropAlerts',              true],
    ['notifications', 'weeklyReport',            true],
    ['privacy',       'profileVisibility',       'private'],
    ['privacy',       'dataSharing',             false],
    ['privacy',       'analyticsOptIn',          true],
    ['privacy',       'locationTracking',        true],
    ['preferences',   'language',                'id'],
    ['preferences',   'timezone',                'Asia/Jakarta'],
    ['preferences',   'theme',                   'light'],
    ['preferences',   'dashboardRefreshInterval', 5],
    ['preferences',   'autoRefresh',             true],
    ['preferences',   'dataVisualization',       'chart'],
  ];

  for (const user of users) {
    for (const [type, key, val] of defaults) {
      await conn.query(
        `INSERT IGNORE INTO user_settings (user_id, setting_type, setting_key, setting_value)
         VALUES (?, ?, ?, ?)`,
        [user.id, type, key, JSON.stringify(val)]
      );
    }
  }
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM user_settings');
  console.log(`   ✅ user_settings: ${n} rows`);
}

// ─────────────────────────── 11. INQUIRIES ───────────────────────────

async function seedInquiries(conn) {
  console.log('📬  Adding more inquiries...');

  const rows = [
    ['INQ-2025-001','Budi Santoso','budi.santoso@pemkab-malang.go.id','+62-341-123456','Pemkab Malang','partnership','Kerjasama Implementasi SAMIKNA','Kami tertarik untuk mengimplementasikan sistem SAMIKNA di seluruh kecamatan di Kabupaten Malang. Bagaimana prosedur kerjasama dan estimasi biayanya?','new'],
    ['INQ-2025-002','Dr. Siti Rahayu','siti.rahayu@ub.ac.id','+62-341-551611','Universitas Brawijaya','demo','Demo Sistem untuk Penelitian','Sebagai peneliti bidang precision agriculture, saya ingin mengajukan demo SAMIKNA untuk keperluan penelitian kolaborasi antara UB dan Dinas Pertanian Jatim.','responded'],
    ['INQ-2025-003','Ahmad Yusuf','ahmad.yusuf@petani-jember.id','+62-331-987654','Kelompok Tani Harapan Jember','support','Bantuan Teknis Penggunaan Dashboard','Kami baru menggunakan sistem SAMIKNA dan mengalami kesulitan dalam membaca data NDVI di dashboard. Mohon panduan lebih lanjut.','resolved'],
    ['INQ-2025-004','Ir. Hendra Wijaya','hendra.w@distan-surabaya.go.id','+62-31-5678901','Dinas Pertanian Surabaya','information','Informasi Integrasi Data BMKG','Apakah SAMIKNA dapat diintegrasikan langsung dengan data real-time dari stasiun BMKG lokal kami? Kami memiliki 5 stasiun cuaca di berbagai titik.','assigned'],
    ['INQ-2025-005','Dewi Lestari','dewi.lestari@agro-invest.co.id','+62-21-5551234','PT. Agro Investama','pricing','Penawaran Harga Lisensi Enterprise','Perusahaan kami berencana menggunakan SAMIKNA untuk monitoring 50+ lahan pertanian di 5 kabupaten Jawa Timur. Mohon informasi paket harga enterprise.','new'],
    ['INQ-2025-006','Kang Udin','kang.udin@tanimodern.id','+62-822-3456-7890','Komunitas Tani Modern','information','Panduan Penggunaan Fitur Peta Satelit','Bagaimana cara memaksimalkan fitur peta Google Earth Engine di SAMIKNA? Apakah bisa digunakan offline?','new'],
    ['INQ-2025-007','Prof. Bambang','bambang@its.ac.id','+62-31-5994251','Institut Teknologi Sepuluh Nopember','partnership','Kolaborasi Pengembangan AI Analytics','ITS memiliki tim AI/ML yang berpengalaman. Kami mengajukan kolaborasi untuk mengembangkan fitur prediksi panen berbasis machine learning pada platform SAMIKNA.','assigned'],
    ['INQ-2025-008','Ibu Sari','sari.pertiwi@pemkab-kediri.go.id','+62-354-683022','Pemkab Kediri','technical','Kendala Login dan Akses Dashboard','Beberapa staf kami mengalami masalah login. Setelah masuk, dashboard menampilkan data yang berbeda dari kenyataan di lapangan. Mohon bantuan teknis.','responded'],
  ];

  for (const r of rows) {
    await conn.query(
      `INSERT IGNORE INTO inquiries
        (inquiry_number, full_name, email, phone, company, inquiry_type,
         subject, message, inquiry_status)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      r
    );
  }
  const [[{n}]] = await conn.query('SELECT COUNT(*) n FROM inquiries');
  console.log(`   ✅ inquiries: ${n} rows`);
}

// ─────────────────────────── MAIN ───────────────────────────

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     SAMIKNA - Comprehensive Mock Data Seeder v2.0       ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  let conn;
  try {
    console.log('🔌 Connecting to Hostinger MariaDB...');
    conn = await mysql.createConnection(dbConfig);
    console.log('✅ Connected!\n');

    const t0 = Date.now();

    await seedSatelliteWeather(conn);     console.log('');
    await seedAgriculturalFields(conn);   console.log('');
    await seedCropActivities(conn);       console.log('');
    await seedSuppliers(conn);            console.log('');
    await seedSupplyChainItems(conn);     console.log('');
    await seedSupplyChainOrders(conn);    console.log('');
    await seedInventoryMovements(conn);   console.log('');
    await seedSystemAlerts(conn);         console.log('');
    await seedMitraPartners(conn);        console.log('');
    await seedUserSettings(conn);         console.log('');
    await seedInquiries(conn);            console.log('');

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    // ── Summary ──
    const tables = [
      'satellite_data','weather_data','agricultural_fields','crop_activities',
      'suppliers','supply_chain_items','supply_chain_orders','supply_chain_order_items',
      'inventory_movements','system_alerts','mitra_partners','user_settings','inquiries',
    ];
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║                  FINAL ROW COUNTS                   ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    for (const t of tables) {
      const [[{n}]] = await conn.query(`SELECT COUNT(*) n FROM ${t}`);
      console.log(`║  ${t.padEnd(34)}  ${String(n).padStart(6)} rows  ║`);
    }
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║  Total time: ${elapsed}s`.padEnd(54) + '║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('\n🎉 Seeding completed successfully!');

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main();
