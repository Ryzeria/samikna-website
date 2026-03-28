/**
 * Database fix script — run with: node scripts/fixDatabase.js
 * Uses multipleStatements to batch all queries into 3 round trips.
 */
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const dbConfig = {
  host:             process.env.DB_HOST,
  port:             parseInt(process.env.DB_PORT) || 3306,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASS,
  database:         process.env.DB_NAME,
  connectTimeout:   60000,
  multipleStatements: true,
};

async function main() {
  console.log('SAMIKNA Database Fix Script (Batch Mode)');
  console.log('=========================================\n');

  const conn = await mysql.createConnection(dbConfig);
  console.log('Connected.\n');

  // ── BATCH 1: mitra_partners ──────────────────────────────────────────────
  console.log('1. Fixing mitra_partners...');
  const services = JSON.stringify(['Konsultasi', 'Data Sharing', 'Kolaborasi']);

  const mitraBatch = `
    UPDATE mitra_partners SET
      partner_name='Dinas Pertanian & Ketahanan Pangan Provinsi Jatim', partner_type='government',
      logo_url='/images/mitra/dinas-pertanian-jatim.png', website='https://pertanian.jatimprov.go.id',
      contact_person='Dr. Ir. Hadi Sulistyo, M.P.', contact_email='info@pertanian.jatimprov.go.id',
      contact_phone='+62-31-567-8901', city='Surabaya', province='Jawa Timur',
      description='Mitra utama dalam implementasi pertanian berbasis teknologi satelit di seluruh Jawa Timur.',
      rating=4.9, partnership_status='active', services_offered='${services}'
    WHERE partner_code='DISPERTA_JATIM';

    UPDATE mitra_partners SET
      partner_name='Balai Penelitian Tanaman Pangan', partner_type='research',
      logo_url='/images/mitra/bppt.png', website='https://balitpa.litbang.pertanian.go.id',
      contact_person='Dr. Ir. Mulyono Sumantri, M.Sc.', contact_email='balitpa@pertanian.go.id',
      contact_phone='+62-251-836-2783', city='Sukamandi', province='Jawa Timur',
      description='Kolaborasi riset dan validasi akurasi data citra satelit untuk rekomendasi budidaya tanaman pangan.',
      rating=4.7, partnership_status='active', services_offered='${services}'
    WHERE partner_code='BALITBANGTAN';

    UPDATE mitra_partners SET
      partner_name='Institut Teknologi Sepuluh Nopember (ITS)', partner_type='academic',
      logo_url='/images/mitra/its-surabaya.png', website='https://www.its.ac.id',
      contact_person='Prof. Dr. Ir. Bambang Pramujati, M.Sc.Eng.', contact_email='its@its.ac.id',
      contact_phone='+62-31-599-4251', city='Surabaya', province='Jawa Timur',
      description='Pusat riset dan pengembangan algoritma AI, remote sensing, dan IoT untuk sistem pertanian presisi SAMIKNA.',
      rating=4.9, partnership_status='active', services_offered='${services}'
    WHERE partner_code='ITS_SURABAYA';

    UPDATE mitra_partners SET
      partner_name='Universitas Brawijaya', partner_type='academic',
      logo_url='/images/mitra/universitas-brawijaya.png', website='https://www.ub.ac.id',
      contact_person='Prof. Dr. Ir. Siti Chuzaemi, M.P.', contact_email='info@ub.ac.id',
      contact_phone='+62-341-551-611', city='Malang', province='Jawa Timur',
      description='Kolaborasi penelitian agronomi, ilmu tanah, dan validasi model prediksi panen berbasis data satelit.',
      rating=4.8, partnership_status='active', services_offered='${services}'
    WHERE partner_code='UB_MALANG';

    UPDATE mitra_partners SET
      partner_name='BMKG Stasiun Meteorologi Jawa Timur', partner_type='government',
      logo_url='/images/mitra/lapan.png', website='https://www.bmkg.go.id',
      contact_person='Drs. Teguh Iman Santoso, M.T.', contact_email='bmkg.jatim@bmkg.go.id',
      contact_phone='+62-31-827-9731', city='Surabaya', province='Jawa Timur',
      description='Integrasi data cuaca resmi BMKG — suhu, curah hujan, angin, kelembaban — ke dalam platform monitoring SAMIKNA.',
      rating=4.9, partnership_status='active', services_offered='${services}'
    WHERE partner_code='BMKG_JATIM';

    INSERT IGNORE INTO mitra_partners
      (partner_code, partner_name, partner_type, logo_url, website, contact_person,
       contact_email, contact_phone, city, province, description, rating, partnership_status, services_offered)
    VALUES
      ('KEMTAN_RI','Kementerian Pertanian Republik Indonesia','government',
       '/images/mitra/kementerian-pertanian.png','https://www.pertanian.go.id',
       'Dr. Ir. Andi Amran Sulaiman, M.P.','setjen@pertanian.go.id','+62-21-780-6202',
       'Jakarta','Jawa Timur',
       'Kementerian Pertanian sebagai mitra kebijakan nasional dalam program digitalisasi dan modernisasi pertanian Indonesia.',
       4.8,'active','${services}'),
      ('BRIN_INDERAJA','BRIN – Pusat Riset Penginderaan Jauh','research',
       '/images/mitra/lapan.png','https://www.brin.go.id',
       'Dr. Orbita Roswintiarti, M.Sc.','prpj@brin.go.id','+62-21-8220-6254',
       'Jakarta','Jawa Timur',
       'Penyedia data satelit Landsat-9, Sentinel-2, dan LAPAN-A2 beresolusi tinggi untuk analisis vegetasi SAMIKNA.',
       4.8,'active','${services}'),
      ('PUPUK_IND','PT Pupuk Indonesia (Persero)','private',
       '/images/mitra/pupuk-indonesia.png','https://www.pupuk-indonesia.com',
       'Ir. Bakir Pasaman, M.M.','info@pupuk-indonesia.com','+62-21-520-7020',
       'Jakarta','Jawa Timur',
       'Distribusi pupuk bersubsidi berbasis rekomendasi kebutuhan nutrisi tanaman dari analisis citra satelit SAMIKNA.',
       4.6,'active','${services}'),
      ('PETROKIMIA_GRK','PT Petrokimia Gresik','private',
       '/images/mitra/petrokimia-gresik.png','https://www.petrokimia-gresik.com',
       'Ir. Dwi Satriyo Annurogo, M.M.','ptpg@petrokimia-gresik.com','+62-31-398-1811',
       'Gresik','Jawa Timur',
       'Sinergi data kebutuhan nutrisi tanah dari SAMIKNA dengan rekomendasi produk pupuk Petrokimia untuk hasil optimal.',
       4.7,'active','${services}'),
      ('INDOFOOD_AGR','PT Indofood Sukses Makmur Tbk','private',
       '/images/mitra/indofood.png','https://www.indofood.co.id',
       'Dr. Tjhie Tjai Fuk, M.B.A.','agri@indofood.com','+62-21-5795-8822',
       'Jakarta','Jawa Timur',
       'Integrasi data rantai pasok pertanian SAMIKNA untuk optimalisasi sourcing bahan baku pangan berkualitas tinggi.',
       4.6,'active','${services}'),
      ('SYNGENTA_IND','Syngenta Indonesia','private',
       '/images/mitra/syngenta.png','https://www.syngenta.co.id',
       'Dr. Hartono Wibisono, M.Sc.','indonesia.info@syngenta.com','+62-21-579-38099',
       'Jakarta','Jawa Timur',
       'Kolaborasi pengembangan rekomendasi perlindungan tanaman berbasis deteksi dini hama dan penyakit melalui citra satelit.',
       4.6,'active','${services}');
  `;

  await conn.query(mitraBatch);
  console.log('   Done.');

  // ── BATCH 2: users ───────────────────────────────────────────────────────
  console.log('\n2. Updating user profiles...');
  const usersBatch = `
    UPDATE users SET full_name='Drs. Ahmad Fauzi Mansur, M.P.', email='admin@disperta-bangkalan.go.id', phone='+62-31-309-5001', department='Dinas Pertanian & Ketahanan Pangan', organization='Pemerintah Kabupaten Bangkalan', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='bangkalan';
    UPDATE users SET full_name='Ir. Sugiarto Widodo, M.M.', email='admin@disperta-banyuwangi.go.id', phone='+62-333-424-101', department='Dinas Pertanian & Pangan', organization='Pemerintah Kabupaten Banyuwangi', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='banyuwangi';
    UPDATE users SET full_name='Dr. Heru Prasetyo, S.P., M.Si.', email='admin@disperta-blitar.go.id', phone='+62-342-801-001', department='Dinas Ketahanan Pangan & Pertanian', organization='Pemerintah Kabupaten Blitar', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='blitar';
    UPDATE users SET full_name='Ir. Nugroho Santoso, M.P.', email='admin@disperta-bojonegoro.go.id', phone='+62-353-881-011', department='Dinas Pertanian & Perkebunan', organization='Pemerintah Kabupaten Bojonegoro', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='bojonegoro';
    UPDATE users SET full_name='Drs. Moh. Saleh Husein, M.Agr.', email='admin@disperta-bondowoso.go.id', phone='+62-332-421-391', department='Dinas Pertanian Tanaman Pangan', organization='Pemerintah Kabupaten Bondowoso', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='bondowoso';
    UPDATE users SET full_name='Ir. Bambang Suryanto, M.P.', email='admin@disperta-gresik.go.id', phone='+62-31-399-7701', department='Dinas Pertanian Kab. Gresik', organization='Pemerintah Kabupaten Gresik', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='gresik';
    UPDATE users SET full_name='Dr. Ir. Harianto Wibisono, M.Si.', email='admin@disperta-jember.go.id', phone='+62-331-487-101', department='Dinas Tanaman Pangan & Hortikultura', organization='Pemerintah Kabupaten Jember', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='jember';
    UPDATE users SET full_name='Ir. Sri Wahyuni Rahayu, M.P.', email='admin@disperta-jombang.go.id', phone='+62-321-861-001', department='Dinas Pertanian & Kehutanan', organization='Pemerintah Kabupaten Jombang', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='jombang';
    UPDATE users SET full_name='Dr. Slamet Raharjo, M.P.', email='admin@disperta-kediri.go.id', phone='+62-354-682-001', department='Dinas Ketahanan Pangan & Pertanian', organization='Pemerintah Kabupaten Kediri', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='kediri';
    UPDATE users SET full_name='Ir. Moch. Wahyudi, M.Si.', email='admin@disperta-lamongan.go.id', phone='+62-322-321-101', department='Dinas Pertanian & Tanaman Pangan', organization='Pemerintah Kabupaten Lamongan', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='lamongan';
    UPDATE users SET full_name='Drs. Fatkhur Rozi, M.P.', email='admin@disperta-lumajang.go.id', phone='+62-334-881-001', department='Dinas Pertanian Kab. Lumajang', organization='Pemerintah Kabupaten Lumajang', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='lumajang';
    UPDATE users SET full_name='Ir. Endang Setyawati, M.M.', email='admin@disperta-madiun.go.id', phone='+62-351-462-001', department='Dinas Pertanian & Pangan Kab. Madiun', organization='Pemerintah Kabupaten Madiun', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='madiun';
    UPDATE users SET full_name='Drs. Agus Widarto, S.P., M.Si.', email='admin@disperta-magetan.go.id', phone='+62-351-895-001', department='Dinas Pertanian Kab. Magetan', organization='Pemerintah Kabupaten Magetan', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='magetan';
    UPDATE users SET full_name='Dr. Ir. Budiono Setiyono, M.P.', email='admin@disperta-malang.go.id', phone='+62-341-393-241', department='Dinas Pertanian & Hortikultura', organization='Pemerintah Kabupaten Malang', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='malang';
    UPDATE users SET full_name='Ir. Siti Asiyah, M.Agr.', email='admin@disperta-mojokerto.go.id', phone='+62-321-321-001', department='Dinas Pertanian Kab. Mojokerto', organization='Pemerintah Kabupaten Mojokerto', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='mojokerto';
    UPDATE users SET full_name='Drs. Khoirul Anam, M.P.', email='admin@disperta-nganjuk.go.id', phone='+62-358-321-101', department='Dinas Pertanian & Perkebunan', organization='Pemerintah Kabupaten Nganjuk', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='nganjuk';
    UPDATE users SET full_name='Ir. Purwanto Adi, M.Si.', email='admin@disperta-ngawi.go.id', phone='+62-351-749-101', department='Dinas Pertanian Kab. Ngawi', organization='Pemerintah Kabupaten Ngawi', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='ngawi';
    UPDATE users SET full_name='Dr. Tri Wahyuni, S.P., M.P.', email='admin@disperta-pacitan.go.id', phone='+62-357-881-101', department='Dinas Pertanian & Pangan', organization='Pemerintah Kabupaten Pacitan', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='pacitan';
    UPDATE users SET full_name='Drs. Moh. Asy''ari, M.Agr.', email='admin@disperta-pamekasan.go.id', phone='+62-324-322-001', department='Dinas Pertanian Kab. Pamekasan', organization='Pemerintah Kabupaten Pamekasan', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='pamekasan';
    UPDATE users SET full_name='Ir. Eko Hadi Purnomo, M.P.', email='admin@disperta-pasuruan.go.id', phone='+62-343-421-001', department='Dinas Ketahanan Pangan & Pertanian', organization='Pemerintah Kabupaten Pasuruan', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='pasuruan';
    UPDATE users SET full_name='Drs. Suharno Wijoyo, M.Si.', email='admin@disperta-ponorogo.go.id', phone='+62-352-481-001', department='Dinas Pertanian Kab. Ponorogo', organization='Pemerintah Kabupaten Ponorogo', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='ponorogo';
    UPDATE users SET full_name='Ir. Novi Kurniawati, M.P.', email='admin@disperta-probolinggo.go.id', phone='+62-335-421-001', department='Dinas Pertanian Kab. Probolinggo', organization='Pemerintah Kabupaten Probolinggo', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='probolinggo';
    UPDATE users SET full_name='Drs. Abdurahman Wahid, M.Agr.', email='admin@disperta-sampang.go.id', phone='+62-323-322-101', department='Dinas Pertanian & Pangan', organization='Pemerintah Kabupaten Sampang', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='sampang';
    UPDATE users SET full_name='Dr. Ir. Sigit Setiawan, M.M.', email='admin@disperta-sidoarjo.go.id', phone='+62-31-894-3451', department='Dinas Pertanian & Ketahanan Pangan', organization='Pemerintah Kabupaten Sidoarjo', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='sidoarjo';
    UPDATE users SET full_name='Ir. Imam Hidayat, M.Si.', email='admin@disperta-situbondo.go.id', phone='+62-338-671-101', department='Dinas Pertanian Kab. Situbondo', organization='Pemerintah Kabupaten Situbondo', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='situbondo';
    UPDATE users SET full_name='Drs. Moch. Hasan Fauzi, M.P.', email='admin@disperta-sumenep.go.id', phone='+62-328-671-101', department='Dinas Pertanian & Ketahanan Pangan', organization='Pemerintah Kabupaten Sumenep', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='sumenep';
    UPDATE users SET full_name='Dr. Ir. Erna Mulianingsih, M.T.', email='admin@disperta-surabaya.go.id', phone='+62-31-591-5041', department='Dinas Ketahanan Pangan & Pertanian Kota', organization='Pemerintah Kota Surabaya', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='surabaya';
    UPDATE users SET full_name='Ir. Soekarno Putra, M.P.', email='admin@disperta-trenggalek.go.id', phone='+62-355-791-101', department='Dinas Pertanian & Pangan', organization='Pemerintah Kabupaten Trenggalek', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='trenggalek';
    UPDATE users SET full_name='Dr. Ir. H. Mustain Fuadi, M.P.', email='admin@disperta-tuban.go.id', phone='+62-356-321-101', department='Dinas Ketahanan Pangan & Pertanian', organization='Pemerintah Kabupaten Tuban', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='tuban';
    UPDATE users SET full_name='Drs. Supriyadi Hartono, M.Si.', email='admin@disperta-tulungagung.go.id', phone='+62-355-323-101', department='Dinas Pertanian & Perkebunan', organization='Pemerintah Kabupaten Tulungagung', position='Kepala Dinas Pertanian', updated_at=CURRENT_TIMESTAMP WHERE username='tulungagung';
  `;

  await conn.query(usersBatch);
  console.log('   Done (30 users).');

  // ── BATCH 3: inquiries ───────────────────────────────────────────────────
  console.log('\n3. Adding sample inquiries...');
  const inquiriesBatch = `
    INSERT IGNORE INTO inquiries
      (inquiry_number, full_name, email, phone, company, inquiry_type, subject, message, inquiry_status)
    VALUES
      ('INQ-2024-001','Ir. Budi Santoso, M.P.','budi.santoso@disperta-nganjuk.go.id','+62-358-321-456',
       'Dinas Pertanian Kab. Nganjuk','demo','Permohonan Demo Platform SAMIKNA',
       'Kami dari Dinas Pertanian Kabupaten Nganjuk tertarik untuk menggunakan platform SAMIKNA guna meningkatkan efisiensi monitoring lahan pertanian di wilayah kami. Mohon dijadwalkan sesi demo dan presentasi fitur-fitur unggulan platform ini.',
       'responded'),
      ('INQ-2024-002','Prof. Dr. Ir. Eko Widodo, M.Sc.','eko.widodo@unair.ac.id','+62-31-599-1555',
       'Universitas Airlangga – Fakultas Pertanian','partnership','Proposal Kolaborasi Riset Pertanian Presisi',
       'Dalam rangka pengembangan penelitian pertanian presisi berbasis remote sensing, kami mengajukan proposal kolaborasi riset antara Universitas Airlangga dengan SAMIKNA. Kami tertarik pada integrasi data satelit untuk studi produktivitas padi di Delta Brantas.',
       'assigned'),
      ('INQ-2024-003','Agus Priyanto','agus.priyanto@gmail.com','+62-812-3456-7890',
       'Gapoktan Makmur Jaya – Tulungagung','information','Informasi Harga & Cara Berlangganan SAMIKNA',
       'Saya ketua kelompok tani Makmur Jaya di Tulungagung. Kami mengelola sekitar 150 hektar sawah. Ingin tahu lebih lanjut mengenai paket harga, cara berlangganan, dan manfaat yang kami dapatkan dari platform SAMIKNA untuk membantu petani di kelompok kami.',
       'new'),
      ('INQ-2024-004','Ir. Sriningsih Wijayanti, M.T.','sriningsih@bptp-jatim.go.id','+62-31-321-5905',
       'BPTP Balai Pengkajian Teknologi Pertanian Jawa Timur','technical','Integrasi API Data Satelit SAMIKNA dengan SIG Pertanian',
       'Kami dari BPTP Jawa Timur sedang mengembangkan Sistem Informasi Geografis (SIG) pertanian terintegrasi. Kami membutuhkan informasi teknis mengenai REST API SAMIKNA untuk integrasi data NDVI, EVI, dan data cuaca ke dalam platform SIG kami.',
       'responded');
  `;

  await conn.query(inquiriesBatch);
  console.log('   Done.');

  // ── VERIFY ───────────────────────────────────────────────────────────────
  console.log('\n=== Final Database State ===');
  const tables = [
    'users','mitra_partners','agricultural_fields','crop_activities',
    'satellite_data','weather_data','suppliers','supply_chain_items',
    'supply_chain_orders','inquiries','system_alerts'
  ];

  for (const t of tables) {
    try {
      const [r] = await conn.execute('SELECT COUNT(*) as c FROM `' + t + '`');
      console.log('  ' + t.padEnd(25) + r[0].c + ' rows');
    } catch { console.log('  ' + t.padEnd(25) + 'NOT FOUND'); }
  }

  const [sampleUser] = await conn.execute(
    'SELECT username, full_name, email, phone, department FROM users WHERE username=?', ['tuban']
  );
  console.log('\nSample user (tuban):', JSON.stringify(sampleUser[0], null, 2));

  const [mitraCheck] = await conn.execute(
    'SELECT partner_code, partner_name, logo_url FROM mitra_partners ORDER BY id'
  );
  console.log('\nMitra partners:');
  mitraCheck.forEach(m =>
    console.log('  ' + (m.logo_url ? '✅' : '❌') + ' ' + m.partner_code.padEnd(18) + ' | ' + m.partner_name)
  );

  await conn.end();
  console.log('\n✅ All done!');
}

main().catch(e => {
  console.error('\n❌ Error:', e.message);
  process.exit(1);
});
