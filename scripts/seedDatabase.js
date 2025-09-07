const mysql = require('mysql2/promise');

// Hostinger Remote MySQL Configuration
const dbConfig = {
  host: 'srv566.hstgr.io',
  port: 3306,
  user: 'u722506862_samikna',
  password: 'S@m1Kn4!',
  database: 'u722506862_samikna',
  ssl: false,
  connectTimeout: 30000,
  acquireTimeout: 30000,
  timeout: 30000
};

// All kabupaten in East Java with their Google Earth Engine URLs
const kabupatenJatim = [
  { name: 'bangkalan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/bangkalan' },
  { name: 'banyuwangi', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/banyuwangi' },
  { name: 'blitar', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/blitar' },
  { name: 'bojonegoro', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/bojonegoro' },
  { name: 'bondowoso', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/bondowoso' },
  { name: 'gresik', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/gresik' },
  { name: 'jember', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/jember' },
  { name: 'jombang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/jombang' },
  { name: 'kediri', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/kediri' },
  { name: 'lamongan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/lamongan' },
  { name: 'lumajang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/lumajang' },
  { name: 'madiun', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/madiun' },
  { name: 'magetan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/magetan' },
  { name: 'malang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/malang' },
  { name: 'mojokerto', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/mojokerto' },
  { name: 'nganjuk', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/nganjuk' },
  { name: 'ngawi', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/ngawi' },
  { name: 'pacitan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/pacitan' },
  { name: 'pamekasan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/pamekasan' },
  { name: 'pasuruan', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/pasuruan' },
  { name: 'ponorogo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/ponorogo' },
  { name: 'probolinggo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/probolinggo' },
  { name: 'sampang', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/sampang' },
  { name: 'sidoarjo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/sidoarjo' },
  { name: 'situbondo', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/situbondo' },
  { name: 'sumenep', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/sumenep' },
  { name: 'surabaya', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/surabaya' },
  { name: 'trenggalek', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/trenggalek' },
  { name: 'tuban', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/tuban' },
  { name: 'tulungagung', earthEngineUrl: 'https://ee-samikna.projects.earthengine.app/view/tulungagung' }
];

// Mitra partners data
const mitraData = [
  {
    name: 'Dinas Pertanian Jawa Timur',
    location: 'Surabaya',
    latitude: -7.2504,
    longitude: 112.7688,
    description: 'Instansi pemerintah daerah bidang pertanian',
    logo_url: '/images/mitra/disperta-jatim.png'
  },
  {
    name: 'Balai Penelitian Tanaman Pangan',
    location: 'Malang',
    latitude: -7.9826,
    longitude: 112.6308,
    description: 'Lembaga penelitian tanaman pangan',
    logo_url: '/images/mitra/balitbangtan.png'
  },
  {
    name: 'Institut Teknologi Sepuluh Nopember',
    location: 'Surabaya',
    latitude: -7.2574,
    longitude: 112.7954,
    description: 'Universitas teknologi partner riset',
    logo_url: '/images/mitra/its.png'
  },
  {
    name: 'Universitas Brawijaya',
    location: 'Malang',
    latitude: -7.9519,
    longitude: 112.6141,
    description: 'Universitas dengan fakultas pertanian',
    logo_url: '/images/mitra/ub.png'
  },
  {
    name: 'BMKG Jawa Timur',
    location: 'Surabaya',
    latitude: -7.2575,
    longitude: 112.7521,
    description: 'Badan Meteorologi Klimatologi dan Geofisika',
    logo_url: '/images/mitra/bmkg.png'
  },
  {
    name: 'BPS Jawa Timur',
    location: 'Surabaya',
    latitude: -7.2456,
    longitude: 112.7639,
    description: 'Badan Pusat Statistik Provinsi Jawa Timur',
    logo_url: '/images/mitra/bps.png'
  }
];

// Weather stations data
const weatherStations = [
  { name: 'Stasiun Meteorologi Juanda', kabupaten: 'sidoarjo', latitude: -7.3797, longitude: 112.7869, type: 'meteorologi' },
  { name: 'Stasiun Klimatologi Karangploso', kabupaten: 'malang', latitude: -7.9186, longitude: 112.5281, type: 'klimatologi' },
  { name: 'Stasiun Geofisika Tretes', kabupaten: 'pasuruan', latitude: -7.7147, longitude: 112.8083, type: 'geofisika' },
  { name: 'Pos Hujan Kediri', kabupaten: 'kediri', latitude: -7.8167, longitude: 112.0167, type: 'hujan' },
  { name: 'AWS Banyuwangi', kabupaten: 'banyuwangi', latitude: -8.2192, longitude: 114.3691, type: 'otomatis' }
];

async function createTables() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Connected to MariaDB successfully');
    
    // Drop existing tables if they exist
    console.log('Dropping existing tables...');
    await connection.execute('DROP TABLE IF EXISTS crop_activities');
    await connection.execute('DROP TABLE IF EXISTS supply_chain');
    await connection.execute('DROP TABLE IF EXISTS weather_data');
    await connection.execute('DROP TABLE IF EXISTS satellite_data');
    await connection.execute('DROP TABLE IF EXISTS inquiries');
    await connection.execute('DROP TABLE IF EXISTS mitra_partners');
    await connection.execute('DROP TABLE IF EXISTS users');

    // Create users table
    console.log('Creating users table...');
    await connection.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        kabupaten VARCHAR(100) NOT NULL,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        position VARCHAR(100),
        department VARCHAR(100),
        earth_engine_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create mitra_partners table
    console.log('Creating mitra_partners table...');
    await connection.execute(`
      CREATE TABLE mitra_partners (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create inquiries table
    console.log('Creating inquiries table...');
    await connection.execute(`
      CREATE TABLE inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(100),
        message TEXT NOT NULL,
        inquiry_type ENUM('information', 'partnership', 'support', 'other') DEFAULT 'information',
        status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create satellite_data table for remote sensing data
    console.log('Creating satellite_data table...');
    await connection.execute(`
      CREATE TABLE satellite_data (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create weather_data table
    console.log('Creating weather_data table...');
    await connection.execute(`
      CREATE TABLE weather_data (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create crop_activities table for crop management
    console.log('Creating crop_activities table...');
    await connection.execute(`
      CREATE TABLE crop_activities (
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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create supply_chain table
    console.log('Creating supply_chain table...');
    await connection.execute(`
      CREATE TABLE supply_chain (
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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('All tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

async function seedUsers() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Seeding users...');
    
    for (const kabupaten of kabupatenJatim) {
      // Create secure password hash
      const bcrypt = require('bcryptjs');
      const password = `${kabupaten.name}Admin2024!`;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      await connection.execute(
        `INSERT INTO users (username, password, kabupaten, full_name, email, position, department, earth_engine_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          kabupaten.name,
          hashedPassword,
          kabupaten.name,
          `Administrator ${kabupaten.name.charAt(0).toUpperCase() + kabupaten.name.slice(1)}`,
          `admin.${kabupaten.name}@samikna.id`,
          'Kepala Dinas Pertanian',
          `Dinas Pertanian Kabupaten ${kabupaten.name.charAt(0).toUpperCase() + kabupaten.name.slice(1)}`,
          kabupaten.earthEngineUrl
        ]
      );
      
      console.log(`Created user: ${kabupaten.name} with secure password`);
    }
    
    console.log(`Successfully created ${kabupatenJatim.length} users with secure passwords!`);
    
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await connection.end();
  }
}

async function seedMitraPartners() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Seeding mitra partners...');
    
    for (const mitra of mitraData) {
      await connection.execute(
        `INSERT INTO mitra_partners (name, location, latitude, longitude, description, logo_url, partnership_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          mitra.name, 
          mitra.location, 
          mitra.latitude, 
          mitra.longitude, 
          mitra.description,
          mitra.logo_url,
          mitra.name.includes('Dinas') ? 'government' : 
          mitra.name.includes('Universitas') || mitra.name.includes('Institut') ? 'academic' : 'research'
        ]
      );
      
      console.log(`Created mitra: ${mitra.name}`);
    }
    
    console.log(`Successfully created ${mitraData.length} mitra partners!`);
    
  } catch (error) {
    console.error('Error seeding mitra partners:', error);
  } finally {
    await connection.end();
  }
}

async function seedSampleData() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Seeding sample satellite and weather data...');
    
    // Generate sample satellite data for each kabupaten
    for (let i = 0; i < kabupatenJatim.length; i++) {
      const kabupaten = kabupatenJatim[i];
      
      // Generate data for last 30 days
      for (let day = 30; day >= 0; day--) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        
        await connection.execute(`
          INSERT INTO satellite_data 
          (kabupaten, data_date, ndvi_avg, ndvi_min, ndvi_max, evi_avg, land_surface_temp, rainfall_mm, soil_moisture, cloud_coverage) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          kabupaten.name,
          date.toISOString().split('T')[0],
          (Math.random() * 0.4 + 0.3).toFixed(3), // NDVI 0.3-0.7
          (Math.random() * 0.2 + 0.1).toFixed(3), // NDVI min
          (Math.random() * 0.2 + 0.7).toFixed(3), // NDVI max
          (Math.random() * 0.3 + 0.2).toFixed(3), // EVI
          (Math.random() * 10 + 25).toFixed(2), // Temperature 25-35°C
          (Math.random() * 15).toFixed(2), // Rainfall 0-15mm
          (Math.random() * 30 + 40).toFixed(2), // Soil moisture 40-70%
          (Math.random() * 40).toFixed(2) // Cloud coverage 0-40%
        ]);
        
        // Weather data
        await connection.execute(`
          INSERT INTO weather_data 
          (kabupaten, station_name, data_date, temperature_avg, temperature_min, temperature_max, humidity_avg, rainfall_mm, wind_speed, pressure_hpa) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          kabupaten.name,
          `Stasiun ${kabupaten.name.charAt(0).toUpperCase() + kabupaten.name.slice(1)}`,
          date.toISOString().split('T')[0],
          (Math.random() * 8 + 26).toFixed(1), // Avg temp 26-34°C
          (Math.random() * 5 + 22).toFixed(1), // Min temp 22-27°C
          (Math.random() * 8 + 30).toFixed(1), // Max temp 30-38°C
          (Math.random() * 20 + 70).toFixed(2), // Humidity 70-90%
          (Math.random() * 20).toFixed(2), // Rainfall 0-20mm
          (Math.random() * 8 + 2).toFixed(2), // Wind speed 2-10 m/s
          (Math.random() * 20 + 1005).toFixed(2) // Pressure 1005-1025 hPa
        ]);
      }
    }
    
    console.log('Successfully created sample satellite and weather data!');
    
  } catch (error) {
    console.error('Error seeding sample data:', error);
  } finally {
    await connection.end();
  }
}

async function main() {
  console.log('Starting SAMIKNA database seeding...');
  console.log('==========================================');
  
  try {
    await createTables();
    await seedUsers();
    await seedMitraPartners();
    await seedSampleData();
    
    console.log('==========================================');
    console.log('Database seeding completed successfully!');
    console.log('');
    console.log('Admin Login Credentials:');
    console.log('==========================================');
    console.log('Format: username | password');
    kabupatenJatim.slice(0, 10).forEach(kabupaten => {
      console.log(`${kabupaten.name} | ${kabupaten.name}Admin2024!`);
    });
    console.log('... and 20 more kabupaten with same pattern');
    console.log('');
    console.log('Features Available:');
    console.log('- Satellite/Remote Sensing Monitoring');
    console.log('- Weather Data Integration');
    console.log('- Crop Management System');
    console.log('- Supply Chain Management');
    console.log('- AI Chatbot Assistant');
    console.log('- Comprehensive Reports');
    console.log('');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  main();
}

module.exports = {
  createTables,
  seedUsers,
  seedMitraPartners,
  seedSampleData
};