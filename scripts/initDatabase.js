const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration - MariaDB compatible for SAMIKNA Platform
const dbConfig = {
  host: process.env.DB_HOST || 'srv566.hstgr.io',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u722506862_samikna',
  password: process.env.DB_PASS || 'S@m1Kn4!',
  database: process.env.DB_NAME || 'u722506862_samikna',
  ssl: false,
  connectTimeout: 30000,
  charset: 'utf8mb4'
};

// All kabupaten in East Java with Google Earth Engine URLs for SAMIKNA
const kabupatenJatim = [
  { name: 'bangkalan', displayName: 'Bangkalan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/bangkalan' },
  { name: 'banyuwangi', displayName: 'Banyuwangi', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/banyuwangi' },
  { name: 'blitar', displayName: 'Blitar', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/blitar' },
  { name: 'bojonegoro', displayName: 'Bojonegoro', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/bojonegoro' },
  { name: 'bondowoso', displayName: 'Bondowoso', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/bondowoso' },
  { name: 'gresik', displayName: 'Gresik', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/gresik' },
  { name: 'jember', displayName: 'Jember', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/jember' },
  { name: 'jombang', displayName: 'Jombang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/jombang' },
  { name: 'kediri', displayName: 'Kediri', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/kediri' },
  { name: 'lamongan', displayName: 'Lamongan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/lamongan' },
  { name: 'lumajang', displayName: 'Lumajang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/lumajang' },
  { name: 'madiun', displayName: 'Madiun', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/madiun' },
  { name: 'magetan', displayName: 'Magetan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/magetan' },
  { name: 'malang', displayName: 'Malang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/malang' },
  { name: 'mojokerto', displayName: 'Mojokerto', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/mojokerto' },
  { name: 'nganjuk', displayName: 'Nganjuk', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/nganjuk' },
  { name: 'ngawi', displayName: 'Ngawi', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/ngawi' },
  { name: 'pacitan', displayName: 'Pacitan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/pacitan' },
  { name: 'pamekasan', displayName: 'Pamekasan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/pamekasan' },
  { name: 'pasuruan', displayName: 'Pasuruan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/pasuruan' },
  { name: 'ponorogo', displayName: 'Ponorogo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/ponorogo' },
  { name: 'probolinggo', displayName: 'Probolinggo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/probolinggo' },
  { name: 'sampang', displayName: 'Sampang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/sampang' },
  { name: 'sidoarjo', displayName: 'Sidoarjo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/sidoarjo' },
  { name: 'situbondo', displayName: 'Situbondo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/situbondo' },
  { name: 'sumenep', displayName: 'Sumenep', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/sumenep' },
  { name: 'surabaya', displayName: 'Surabaya', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/surabaya' },
  { name: 'trenggalek', displayName: 'Trenggalek', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/trenggalek' },
  { name: 'tuban', displayName: 'Tuban', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/tuban' },
  { name: 'tulungagung', displayName: 'Tulungagung', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/tulungagung' }
];

async function initializeDatabase() {
  let connection = null;

  try {
    console.log('SAMIKNA Platform - Database Initialization');
    console.log('==========================================');
    console.log('Initializing SAMIKNA Satellite Agricultural Monitoring Platform...');
    
    console.log('Connection config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });

    // Connect to database
    console.log('Connecting to MariaDB...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');

    // Test connection
    const [testResult] = await connection.execute('SELECT VERSION() as db_version, NOW() as db_time');
    console.log('Database info:', testResult[0]);

    console.log('\nCreating SAMIKNA Platform Tables...');

    // Create users table for kabupaten administrators
    console.log('Creating users table...');
    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        kabupaten VARCHAR(100) NOT NULL,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        position VARCHAR(100) DEFAULT 'Kepala Dinas Pertanian',
        department VARCHAR(100),
        earth_engine_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        INDEX idx_username (username),
        INDEX idx_kabupaten (kabupaten),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createUsersTableSQL);
    console.log('Users table created/verified');

    // Create satellite_data table for remote sensing data
    console.log('Creating satellite_data table...');
    const createSatelliteTableSQL = `
      CREATE TABLE IF NOT EXISTS satellite_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kabupaten VARCHAR(50) NOT NULL,
        data_date DATE NOT NULL,
        ndvi_avg DECIMAL(4,3),
        ndvi_min DECIMAL(4,3),
        ndvi_max DECIMAL(4,3),
        evi_avg DECIMAL(4,3),
        land_surface_temp DECIMAL(5,2),
        rainfall_mm DECIMAL(6,2),
        soil_moisture DECIMAL(5,2),
        cloud_coverage DECIMAL(5,2),
        image_url TEXT,
        processing_level VARCHAR(20) DEFAULT 'L2',
        satellite_source VARCHAR(50) DEFAULT 'Landsat-8',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_kabupaten_date (kabupaten, data_date),
        INDEX idx_date (data_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createSatelliteTableSQL);
    console.log('Satellite data table created/verified');

    // Create weather_data table
    console.log('Creating weather_data table...');
    const createWeatherTableSQL = `
      CREATE TABLE IF NOT EXISTS weather_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kabupaten VARCHAR(50) NOT NULL,
        station_name VARCHAR(100),
        data_date DATE NOT NULL,
        data_time TIME,
        temperature_avg DECIMAL(4,1),
        temperature_min DECIMAL(4,1),
        temperature_max DECIMAL(4,1),
        humidity_avg DECIMAL(5,2),
        rainfall_mm DECIMAL(6,2),
        wind_speed DECIMAL(5,2),
        wind_direction DECIMAL(5,1),
        pressure_hpa DECIMAL(7,2),
        solar_radiation DECIMAL(6,2),
        evapotranspiration DECIMAL(6,2),
        weather_condition VARCHAR(50),
        visibility_km DECIMAL(4,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_kabupaten_date (kabupaten, data_date),
        INDEX idx_date_time (data_date, data_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createWeatherTableSQL);
    console.log('Weather data table created/verified');

    // Create crop_activities table
    console.log('Creating crop_activities table...');
    const createCropActivitiesTableSQL = `
      CREATE TABLE IF NOT EXISTS crop_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        kabupaten VARCHAR(50) NOT NULL,
        field_name VARCHAR(100),
        crop_type VARCHAR(50),
        variety VARCHAR(100),
        activity_type ENUM('planting', 'fertilizing', 'irrigation', 'pest_control', 'harvesting', 'land_preparation') NOT NULL,
        activity_date DATE NOT NULL,
        description TEXT,
        area_hectares DECIMAL(8,2),
        cost_amount DECIMAL(12,2),
        notes TEXT,
        status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_kabupaten_date (kabupaten, activity_date),
        INDEX idx_status (status),
        INDEX idx_activity_type (activity_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createCropActivitiesTableSQL);
    console.log('Crop activities table created/verified');

    // Create supply_chain table
    console.log('Creating supply_chain table...');
    const createSupplyChainTableSQL = `
      CREATE TABLE IF NOT EXISTS supply_chain (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        kabupaten VARCHAR(50) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        category ENUM('seed', 'fertilizer', 'pesticide', 'equipment', 'harvest') NOT NULL,
        supplier_name VARCHAR(100),
        supplier_contact VARCHAR(100),
        quantity DECIMAL(10,2),
        unit VARCHAR(20),
        price_per_unit DECIMAL(12,2),
        total_cost DECIMAL(15,2),
        order_date DATE,
        delivery_date DATE,
        status ENUM('ordered', 'shipped', 'delivered', 'cancelled') DEFAULT 'ordered',
        quality_grade VARCHAR(20),
        storage_location VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_kabupaten_category (kabupaten, category),
        INDEX idx_status (status),
        INDEX idx_order_date (order_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createSupplyChainTableSQL);
    console.log('Supply chain table created/verified');

    // Create mitra_partners table
    console.log('Creating mitra_partners table...');
    const createMitraPartnersTableSQL = `
      CREATE TABLE IF NOT EXISTS mitra_partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        logo_url VARCHAR(255),
        location VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        description TEXT,
        contact_email VARCHAR(100),
        contact_phone VARCHAR(20),
        website VARCHAR(255),
        partnership_type ENUM('research', 'government', 'academic', 'private') DEFAULT 'government',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_partnership_type (partnership_type),
        INDEX idx_location (location)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createMitraPartnersTableSQL);
    console.log('Mitra partners table created/verified');

    // Create inquiries table
    console.log('Creating inquiries table...');
    const createInquiriesTableSQL = `
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(100),
        message TEXT NOT NULL,
        inquiry_type ENUM('information', 'partnership', 'support', 'other') DEFAULT 'information',
        status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP NULL,
        INDEX idx_status (status),
        INDEX idx_inquiry_type (inquiry_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.execute(createInquiriesTableSQL);
    console.log('Inquiries table created/verified');

    // Check existing users
    const [existingUsers] = await connection.execute('SELECT username FROM users');
    const existingUsernames = existingUsers.map(user => user.username);
    console.log('\nExisting users:', existingUsernames.length, 'found');

    // Create administrator accounts for each kabupaten
    console.log('\nProcessing SAMIKNA administrator accounts...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const kabupaten of kabupatenJatim) {
      if (!existingUsernames.includes(kabupaten.name)) {
        // Create secure password
        const securePassword = `${kabupaten.name}Admin2024!`;
        const hashedPassword = await bcrypt.hash(securePassword, 12);
        
        await connection.execute(`
          INSERT INTO users (
            username, password, kabupaten, full_name, email, 
            position, department, earth_engine_url
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          kabupaten.name,
          hashedPassword,
          kabupaten.name,
          `Administrator ${kabupaten.displayName}`,
          `admin.${kabupaten.name}@samikna.id`,
          'Kepala Dinas Pertanian',
          `Dinas Pertanian Kabupaten ${kabupaten.displayName}`,
          kabupaten.earthEngineUrl
        ]);
        
        console.log(`Created admin: ${kabupaten.name} for ${kabupaten.displayName}`);
        createdCount++;
      } else {
        console.log(`Skipped existing admin: ${kabupaten.name}`);
        skippedCount++;
      }
    }

    console.log('\nSummary:');
    console.log(`   - Created: ${createdCount} administrator accounts`);
    console.log(`   - Skipped: ${skippedCount} existing accounts`);
    console.log(`   - Total processed: ${createdCount + skippedCount} accounts`);

    // Verify final user count
    const [finalUsers] = await connection.execute('SELECT COUNT(*) as user_count FROM users');
    console.log(`   - Total administrators in database: ${finalUsers[0].user_count}`);

    // Show login credentials format
    console.log('\nSAMIKNA Administrator Login Format:');
    console.log('====================================');
    console.log('Username: [kabupaten_name]');
    console.log('Password: [kabupaten_name]Admin2024!');
    console.log('');
    console.log('Example Login Credentials:');
    kabupatenJatim.slice(0, 5).forEach(kab => {
      const status = existingUsernames.includes(kab.name) ? '(existing)' : '(new)';
      console.log(`   Username: ${kab.name}  |  Password: ${kab.name}Admin2024! ${status}`);
    });
    console.log('   ... and 25 more kabupaten accounts');

    console.log('\nSAMIKNA Platform Features Initialized:');
    console.log('====================================');
    console.log('✅ Satellite Data Monitoring (Google Earth Engine Integration)');
    console.log('✅ Weather Data Integration (BMKG Compatible)');
    console.log('✅ Crop Management System');
    console.log('✅ Supply Chain Management');
    console.log('✅ Multi-Kabupaten Administration');
    console.log('✅ Secure Authentication System');

    console.log('\nNext Steps:');
    console.log('==========');
    console.log('1. Run: npm run db:seed (to add sample data)');
    console.log('2. Run: npm run dev (to start the platform)');
    console.log('3. Login with any kabupaten credentials');
    console.log('4. Configure Google Earth Engine endpoints');

    console.log('\nSAMIKNA Platform database initialization completed successfully!');

  } catch (error) {
    console.error('SAMIKNA Database initialization failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    console.log('\nTroubleshooting Steps:');
    console.log('=====================');
    console.log('1. Check database connection: npm run db:test');
    console.log('2. Verify .env.local configuration');
    console.log('3. Ensure MariaDB service is running on Hostinger');
    console.log('4. Check database user permissions');
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n🎉 SAMIKNA Platform initialization completed successfully!');
      console.log('🌾 Satellite Agricultural Monitoring Platform is ready');
      console.log('🚀 Ready to run: npm run dev');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 SAMIKNA Platform initialization failed:', error.message);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };