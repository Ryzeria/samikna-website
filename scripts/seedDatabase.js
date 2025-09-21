const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Enhanced MariaDB Configuration
const dbConfig = {
  host: 'srv566.hstgr.io',
  port: 3306,
  user: 'u722506862_samikna',
  password: 'S@m1Kn4!',
  database: 'u722506862_samikna',
  ssl: false,
  connectTimeout: 60000,
  charset: 'utf8mb4'
};

// Kabupaten Jawa Timur with Earth Engine URLs
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

// Utility function for safe connection handling
async function withConnection(callback) {
  let connection = null;
  try {
    connection = await mysql.createConnection(dbConfig);
    return await callback(connection);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createTables() {
  return await withConnection(async (connection) => {
    console.log('Connected to MariaDB successfully');
    
    // Drop existing tables in correct order
    console.log('Dropping existing tables...');
    const tablesToDrop = [
      'ai_recommendations', 'system_alerts', 'activity_logs', 'notifications',
      'supply_chain_orders', 'supply_chain_order_items', 'inventory_movements',
      'crop_activities', 'field_sensors', 'agricultural_fields', 'supply_chain_items',
      'suppliers', 'satellite_data', 'weather_data', 'user_settings', 'inquiries', 
      'mitra_partners', 'users'
    ];
    
    for (const table of tablesToDrop) {
      await connection.execute(`DROP TABLE IF EXISTS ${table}`);
    }

    // Create tables with enhanced schema
    const tables = {
      users: `
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
          address TEXT,
          bio TEXT,
          website VARCHAR(255),
          organization VARCHAR(100),
          profile_image VARCHAR(255),
          earth_engine_url TEXT,
          join_date DATE DEFAULT (CURDATE()),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          last_login TIMESTAMP NULL,
          last_updated TIMESTAMP NULL,
          is_active BOOLEAN DEFAULT TRUE,
          INDEX idx_username (username),
          INDEX idx_kabupaten (kabupaten)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      user_settings: `
        CREATE TABLE user_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          setting_type ENUM('notifications', 'privacy', 'preferences') NOT NULL,
          setting_key VARCHAR(100) NOT NULL,
          setting_value JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_setting (user_id, setting_type, setting_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      satellite_data: `
        CREATE TABLE satellite_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          kabupaten VARCHAR(50) NOT NULL,
          data_date DATE NOT NULL,
          data_time TIME DEFAULT '12:00:00',
          ndvi_avg DECIMAL(5,3),
          ndvi_min DECIMAL(5,3),
          ndvi_max DECIMAL(5,3),
          evi_avg DECIMAL(5,3),
          land_surface_temp DECIMAL(6,2),
          rainfall_mm DECIMAL(8,2),
          soil_moisture DECIMAL(6,2),
          cloud_coverage DECIMAL(6,2),
          confidence_score DECIMAL(5,2) DEFAULT 95.0,
          coverage_percentage DECIMAL(5,2) DEFAULT 100.0,
          satellite_source VARCHAR(50) DEFAULT 'Landsat-8',
          processing_level VARCHAR(20) DEFAULT 'L2',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_kabupaten_date (kabupaten, data_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      weather_data: `
        CREATE TABLE weather_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          kabupaten VARCHAR(50) NOT NULL,
          station_name VARCHAR(100),
          station_id VARCHAR(50),
          data_date DATE NOT NULL,
          data_time TIME,
          temperature_avg DECIMAL(5,2),
          temperature_min DECIMAL(5,2),
          temperature_max DECIMAL(5,2),
          humidity_avg DECIMAL(6,2),
          rainfall_mm DECIMAL(8,2),
          wind_speed DECIMAL(6,2),
          wind_direction DECIMAL(6,2),
          pressure_hpa DECIMAL(8,2),
          uv_index DECIMAL(4,1),
          weather_condition VARCHAR(50),
          visibility_km DECIMAL(6,2),
          data_source VARCHAR(50) DEFAULT 'BMKG',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_kabupaten_date (kabupaten, data_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      agricultural_fields: `
        CREATE TABLE agricultural_fields (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          field_name VARCHAR(150) NOT NULL,
          kabupaten VARCHAR(50) NOT NULL,
          location_address TEXT,
          coordinates_lat DECIMAL(12,8),
          coordinates_lng DECIMAL(12,8),
          area_hectares DECIMAL(10,2),
          crop_type ENUM('padi', 'jagung', 'kedelai', 'tebu', 'cabai', 'tomat', 'kentang', 'other') NOT NULL,
          crop_variety VARCHAR(100),
          planting_date DATE,
          expected_harvest_date DATE,
          growth_stage ENUM('land_preparation', 'planting', 'vegetative', 'flowering', 'fruiting', 'mature', 'harvested') DEFAULT 'land_preparation',
          health_score DECIMAL(5,2) DEFAULT 0,
          current_ndvi DECIMAL(5,3),
          current_soil_moisture DECIMAL(6,2),
          current_temperature DECIMAL(5,2),
          next_activity VARCHAR(200),
          owner_name VARCHAR(100),
          supervisor_name VARCHAR(100),
          field_status ENUM('active', 'fallow', 'preparation', 'harvested', 'inactive') DEFAULT 'active',
          field_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_user_kabupaten (user_id, kabupaten)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      crop_activities: `
        CREATE TABLE crop_activities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          field_id INT,
          activity_type ENUM('planting', 'fertilizing', 'irrigation', 'pest_control', 'harvesting', 'land_preparation', 'monitoring') NOT NULL,
          activity_title VARCHAR(200) NOT NULL,
          activity_description TEXT,
          scheduled_date DATE NOT NULL,
          completed_date DATE NULL,
          duration_hours DECIMAL(5,2),
          area_hectares DECIMAL(8,2),
          materials_used JSON,
          equipment_used JSON,
          workers_count INT DEFAULT 1,
          supervisor_name VARCHAR(100),
          total_cost DECIMAL(15,2),
          activity_status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
          priority_level ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
          weather_conditions VARCHAR(200),
          activity_notes TEXT,
          quality_score DECIMAL(5,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (field_id) REFERENCES agricultural_fields(id) ON DELETE CASCADE,
          INDEX idx_user_date (user_id, scheduled_date),
          INDEX idx_status (activity_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      suppliers: `
        CREATE TABLE suppliers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          supplier_name VARCHAR(150) NOT NULL,
          supplier_code VARCHAR(50) UNIQUE,
          category ENUM('seeds', 'fertilizers', 'pesticides', 'equipment', 'services', 'others') NOT NULL,
          contact_person VARCHAR(100),
          email VARCHAR(100),
          phone VARCHAR(30),
          address TEXT,
          city VARCHAR(100),
          province VARCHAR(100) DEFAULT 'Jawa Timur',
          rating DECIMAL(3,2) DEFAULT 0,
          total_orders INT DEFAULT 0,
          on_time_delivery_rate DECIMAL(5,2) DEFAULT 0,
          quality_score DECIMAL(5,2) DEFAULT 0,
          payment_terms VARCHAR(50) DEFAULT 'NET 30',
          certifications JSON,
          supplier_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category (category),
          INDEX idx_status (supplier_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      supply_chain_items: `
        CREATE TABLE supply_chain_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          item_name VARCHAR(200) NOT NULL,
          item_code VARCHAR(100) UNIQUE,
          sku VARCHAR(100) UNIQUE,
          category ENUM('seeds', 'fertilizers', 'pesticides', 'equipment', 'tools', 'others') NOT NULL,
          supplier_id INT,
          current_stock DECIMAL(12,2) DEFAULT 0,
          min_stock_level DECIMAL(12,2) DEFAULT 0,
          max_stock_level DECIMAL(12,2) DEFAULT 0,
          unit_of_measure VARCHAR(20) NOT NULL,
          unit_price DECIMAL(12,2),
          total_value DECIMAL(20,2) GENERATED ALWAYS AS (current_stock * unit_price) STORED,
          storage_location VARCHAR(100),
          expiry_date DATE,
          quality_grade ENUM('A+', 'A', 'B+', 'B', 'C') DEFAULT 'A',
          tracking_code VARCHAR(100),
          barcode VARCHAR(100),
          item_status ENUM('active', 'discontinued', 'out_of_stock') DEFAULT 'active',
          stock_status ENUM('excellent', 'good', 'adequate', 'low', 'critical', 'out') AS (
            CASE 
              WHEN current_stock >= max_stock_level * 0.8 THEN 'excellent'
              WHEN current_stock >= max_stock_level * 0.6 THEN 'good'
              WHEN current_stock >= min_stock_level * 1.5 THEN 'adequate'
              WHEN current_stock >= min_stock_level THEN 'low'
              WHEN current_stock > 0 THEN 'critical'
              ELSE 'out'
            END
          ) STORED,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
          INDEX idx_category (category),
          INDEX idx_stock_status (stock_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      supply_chain_orders: `
        CREATE TABLE supply_chain_orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_number VARCHAR(100) UNIQUE NOT NULL,
          supplier_id INT NOT NULL,
          user_id INT,
          order_date DATE NOT NULL,
          expected_delivery_date DATE,
          actual_delivery_date DATE,
          total_amount DECIMAL(20,2) DEFAULT 0,
          order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
          payment_status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
          priority_level ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
          order_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_supplier_date (supplier_id, order_date),
          INDEX idx_status (order_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,

      supply_chain_order_items: `
        CREATE TABLE supply_chain_order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          item_id INT NOT NULL,
          quantity DECIMAL(12,2) NOT NULL,
          unit_price DECIMAL(12,2) NOT NULL,
          total_price DECIMAL(20,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
          delivered_quantity DECIMAL(12,2) DEFAULT 0,
          item_status ENUM('pending', 'partial', 'delivered', 'cancelled') DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES supply_chain_orders(id) ON DELETE CASCADE,
          FOREIGN KEY (item_id) REFERENCES supply_chain_items(id) ON DELETE CASCADE,
          INDEX idx_order_item (order_id, item_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,

      inventory_movements: `
        CREATE TABLE inventory_movements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          item_id INT NOT NULL,
          movement_type ENUM('in', 'out', 'adjustment', 'transfer') NOT NULL,
          quantity DECIMAL(12,2) NOT NULL,
          reference_type ENUM('purchase', 'sale', 'production', 'consumption', 'adjustment', 'transfer') NOT NULL,
          reference_id INT,
          previous_stock DECIMAL(12,2) NOT NULL,
          new_stock DECIMAL(12,2) NOT NULL,
          unit_cost DECIMAL(12,2),
          total_cost DECIMAL(20,2),
          movement_date DATE NOT NULL,
          notes TEXT,
          created_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (item_id) REFERENCES supply_chain_items(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_item_date (item_id, movement_date),
          INDEX idx_type (movement_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      system_alerts: `
        CREATE TABLE system_alerts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          alert_type ENUM('weather', 'satellite', 'system', 'equipment', 'inventory', 'crop') NOT NULL,
          severity ENUM('info', 'low', 'medium', 'high', 'critical') NOT NULL,
          title VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          kabupaten VARCHAR(50),
          location_details VARCHAR(200),
          recommended_action TEXT,
          is_automated BOOLEAN DEFAULT TRUE,
          is_active BOOLEAN DEFAULT TRUE,
          priority_score INT DEFAULT 0,
          alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_type_severity (alert_type, severity),
          INDEX idx_kabupaten_active (kabupaten, is_active),
          INDEX idx_priority (priority_score DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      mitra_partners: `
        CREATE TABLE mitra_partners (
          id INT AUTO_INCREMENT PRIMARY KEY,
          partner_name VARCHAR(150) NOT NULL,
          partner_code VARCHAR(50) UNIQUE,
          partner_type ENUM('research', 'government', 'academic', 'private', 'ngo') NOT NULL,
          logo_url VARCHAR(255),
          website VARCHAR(255),
          address TEXT,
          city VARCHAR(100),
          province VARCHAR(100) DEFAULT 'Jawa Timur',
          latitude DECIMAL(12,8),
          longitude DECIMAL(12,8),
          contact_person VARCHAR(100),
          contact_email VARCHAR(100),
          contact_phone VARCHAR(30),
          description TEXT,
          services_offered JSON,
          partnership_status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
          rating DECIMAL(3,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_type_status (partner_type, partnership_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      
      inquiries: `
        CREATE TABLE inquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          inquiry_number VARCHAR(50) UNIQUE,
          full_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(30),
          company VARCHAR(150),
          inquiry_type ENUM('information', 'partnership', 'support', 'demo', 'pricing', 'technical', 'other') DEFAULT 'information',
          subject VARCHAR(200),
          message TEXT NOT NULL,
          inquiry_status ENUM('new', 'assigned', 'responded', 'resolved', 'closed') DEFAULT 'new',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status_type (inquiry_status, inquiry_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    };

    for (const [tableName, sql] of Object.entries(tables)) {
      console.log(`Creating ${tableName} table...`);
      await connection.execute(sql);
    }

    console.log('All tables created successfully!');
  });
}

async function seedUsers() {
  return await withConnection(async (connection) => {
    console.log('Seeding users...');
    
    for (const kabupaten of kabupatenJatim) {
      const password = `${kabupaten.name}Admin2024!`;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      await connection.execute(
        `INSERT INTO users (
          username, password, kabupaten, full_name, email, phone, position, 
          department, address, bio, organization, earth_engine_url, join_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          kabupaten.name,
          hashedPassword,
          kabupaten.name,
          `Administrator ${kabupaten.name.charAt(0).toUpperCase() + kabupaten.name.slice(1)}`,
          `admin.${kabupaten.name}@samikna.id`,
          `+62-821-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
          'Kepala Dinas Pertanian',
          `Dinas Pertanian Kabupaten ${kabupaten.name.charAt(0).toUpperCase() + kabupaten.name.slice(1)}`,
          `Jl. Pertanian No. ${Math.floor(Math.random() * 500) + 1}, ${kabupaten.name}, Jawa Timur`,
          `Mengelola sistem pertanian modern dengan teknologi satelit di wilayah ${kabupaten.name}.`,
          'Kementerian Pertanian RI',
          kabupaten.earthEngineUrl,
          '2024-01-01'
        ]
      );
    }
    
    console.log(`✅ Created ${kabupatenJatim.length} users`);
  });
}

async function seedSuppliers() {
  return await withConnection(async (connection) => {
    console.log('Seeding suppliers...');
    
    const suppliers = [
      {
        name: 'PT. Benih Nusantara Prima', code: 'BNP001', category: 'seeds',
        contact: 'Budi Santoso', email: 'budi@benihnusantara.com', phone: '+62-821-3456-7890',
        city: 'Malang', rating: 4.8, certs: ['ISO 9001', 'Organic Certified']
      },
      {
        name: 'CV. Pupuk Organik Jaya', code: 'POJ001', category: 'fertilizers',
        contact: 'Sari Wijaya', email: 'sari@pupukorganik.com', phone: '+62-812-9876-5432',
        city: 'Kediri', rating: 4.6, certs: ['Organic Certified', 'SNI']
      },
      {
        name: 'PT. Bio Pestisida Indonesia', code: 'BPI001', category: 'pesticides',
        contact: 'Ahmad Yusuf', email: 'ahmad@biopestisida.co.id', phone: '+62-813-5555-6666',
        city: 'Surabaya', rating: 4.7, certs: ['ISO 14001', 'Organic']
      },
      {
        name: 'PT. Alat Mesin Pertanian', code: 'AMP001', category: 'equipment',
        contact: 'Indra Kusuma', email: 'indra@alatmesin.com', phone: '+62-814-7777-8888',
        city: 'Gresik', rating: 4.5, certs: ['ISO 9001', 'CE Certified']
      },
      {
        name: 'CV. Teknologi Tani Modern', code: 'TTM001', category: 'equipment',
        contact: 'Dewi Sartika', email: 'dewi@teknotani.com', phone: '+62-815-1234-5678',
        city: 'Malang', rating: 4.3, certs: ['ISO 9001']
      },
      {
        name: 'PT. Agro Services Indonesia', code: 'ASI001', category: 'services',
        contact: 'Andi Wijaya', email: 'andi@agroservices.id', phone: '+62-816-8888-9999',
        city: 'Surabaya', rating: 4.4, certs: ['ISO 9001', 'Halal']
      }
    ];
    
    for (const supplier of suppliers) {
      await connection.execute(
        `INSERT INTO suppliers (
          supplier_name, supplier_code, category, contact_person, email, phone, 
          city, rating, certifications, on_time_delivery_rate, quality_score, total_orders
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          supplier.name, supplier.code, supplier.category, supplier.contact,
          supplier.email, supplier.phone, supplier.city, supplier.rating,
          JSON.stringify(supplier.certs), Math.random() * 15 + 85,
          Math.random() * 10 + 90, Math.floor(Math.random() * 50) + 10
        ]
      );
    }
    
    console.log('✅ Suppliers seeded');
  });
}

async function seedSupplyChainItems() {
  return await withConnection(async (connection) => {
    console.log('Seeding supply chain items...');
    
    const items = [
      { name: 'Benih Padi IR64 Premium', code: 'SPD-IR64-001', category: 'seeds', stock: 2500, min: 500, max: 5000, unit: 'kg', price: 35000, location: 'Gudang A-1', supplier_id: 1 },
      { name: 'Benih Jagung Hibrida NK212', code: 'SJG-NK212-002', category: 'seeds', stock: 1800, min: 300, max: 3000, unit: 'kg', price: 45000, location: 'Gudang A-2', supplier_id: 1 },
      { name: 'Benih Kedelai Grobogan', code: 'SKD-GRB-003', category: 'seeds', stock: 1200, min: 200, max: 2000, unit: 'kg', price: 28000, location: 'Gudang A-3', supplier_id: 1 },
      { name: 'Pupuk NPK 15-15-15 Organik', code: 'FRT-NPK-002', category: 'fertilizers', stock: 1200, min: 300, max: 2000, unit: 'kg', price: 12500, location: 'Gudang B-2', supplier_id: 2 },
      { name: 'Pupuk Urea Premium', code: 'FRT-URE-004', category: 'fertilizers', stock: 800, min: 200, max: 1500, unit: 'kg', price: 8500, location: 'Gudang B-1', supplier_id: 2 },
      { name: 'Pupuk TSP Super', code: 'FRT-TSP-005', category: 'fertilizers', stock: 600, min: 150, max: 1000, unit: 'kg', price: 15000, location: 'Gudang B-3', supplier_id: 2 },
      { name: 'Pestisida Organik Nabati', code: 'PST-ORG-003', category: 'pesticides', stock: 150, min: 50, max: 500, unit: 'liter', price: 85000, location: 'Gudang C-1', supplier_id: 3 },
      { name: 'Insektisida Bio Herbal', code: 'PST-INS-006', category: 'pesticides', stock: 100, min: 30, max: 300, unit: 'liter', price: 95000, location: 'Gudang C-2', supplier_id: 3 },
      { name: 'Fungisida Organik', code: 'PST-FNG-007', category: 'pesticides', stock: 80, min: 25, max: 250, unit: 'liter', price: 105000, location: 'Gudang C-3', supplier_id: 3 },
      { name: 'Traktor Mini 4WD 25HP', code: 'EQP-TRC-004', category: 'equipment', stock: 3, min: 2, max: 5, unit: 'unit', price: 75000000, location: 'Gudang Equipment', supplier_id: 4 },
      { name: 'Hand Tractor 8HP', code: 'EQP-HTR-008', category: 'equipment', stock: 8, min: 3, max: 15, unit: 'unit', price: 12500000, location: 'Gudang Equipment', supplier_id: 4 },
      { name: 'Combine Harvester Mini', code: 'EQP-CHV-009', category: 'equipment', stock: 2, min: 1, max: 3, unit: 'unit', price: 125000000, location: 'Gudang Equipment', supplier_id: 4 },
      { name: 'Sprayer Motorized', code: 'TLS-SPR-010', category: 'tools', stock: 25, min: 10, max: 50, unit: 'unit', price: 2500000, location: 'Gudang Tools', supplier_id: 5 },
      { name: 'Soil pH Meter Digital', code: 'TLS-PHM-011', category: 'tools', stock: 15, min: 5, max: 30, unit: 'unit', price: 850000, location: 'Gudang Tools', supplier_id: 5 },
      { name: 'GPS Handheld Professional', code: 'TLS-GPS-012', category: 'tools', stock: 12, min: 5, max: 25, unit: 'unit', price: 3500000, location: 'Gudang Tools', supplier_id: 5 }
    ];
    
    for (const item of items) {
      await connection.execute(
        `INSERT INTO supply_chain_items (
          item_name, item_code, sku, category, supplier_id, current_stock, 
          min_stock_level, max_stock_level, unit_of_measure, unit_price, 
          storage_location, quality_grade, tracking_code, barcode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.name, item.code, `SKU-${item.code}`, item.category, item.supplier_id,
          item.stock, item.min, item.max, item.unit, item.price, item.location,
          'A+', `TRK-${item.code}`, `BAR-${item.code}`
        ]
      );
    }
    
    console.log('✅ Supply chain items seeded');
  });
}

async function seedAgriculturalFields() {
  return await withConnection(async (connection) => {
    console.log('Seeding agricultural fields...');
    
    const baseCoordinates = { 
      malang: { lat: -7.9826, lng: 112.6308 },
      surabaya: { lat: -7.2504, lng: 112.7688 },
      kediri: { lat: -7.8167, lng: 112.0167 }
    };
    
    const crops = [
      { crop: 'padi', variety: 'IR64 Premium', area: 12.5, growthStage: 'vegetative' },
      { crop: 'jagung', variety: 'Hibrida NK212', area: 8.2, growthStage: 'flowering' },
      { crop: 'kedelai', variety: 'Grobogan', area: 15.8, growthStage: 'fruiting' },
      { crop: 'tebu', variety: 'PS 862', area: 20.5, growthStage: 'vegetative' },
      { crop: 'cabai', variety: 'Keriting Merah', area: 5.2, growthStage: 'flowering' }
    ];
    
    for (let i = 0; i < 30; i++) {
      const kabupaten = kabupatenJatim[i % kabupatenJatim.length];
      const crop = crops[i % crops.length];
      const coordBase = Object.values(baseCoordinates)[i % Object.keys(baseCoordinates).length];
      
      const plantingDate = new Date();
      plantingDate.setDate(plantingDate.getDate() - Math.floor(Math.random() * 90));
      const expectedHarvest = new Date(plantingDate);
      expectedHarvest.setMonth(expectedHarvest.getMonth() + (crop.crop === 'tebu' ? 12 : 3));
      
      await connection.execute(
        `INSERT INTO agricultural_fields (
          user_id, field_name, kabupaten, location_address, coordinates_lat, 
          coordinates_lng, area_hectares, crop_type, crop_variety, planting_date,
          expected_harvest_date, growth_stage, health_score, current_ndvi,
          current_soil_moisture, current_temperature, owner_name, supervisor_name, field_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          (i % kabupatenJatim.length) + 1, 
          `${crop.crop.charAt(0).toUpperCase() + crop.crop.slice(1)} Field ${String.fromCharCode(65 + (i % 5))}-${Math.floor(i/5) + 1}`,
          kabupaten.name,
          `Desa Sukamaju RT ${Math.floor(Math.random() * 10) + 1}, Kec. ${kabupaten.name}`,
          coordBase.lat + (Math.random() - 0.5) * 0.2,
          coordBase.lng + (Math.random() - 0.5) * 0.2,
          crop.area + (Math.random() - 0.5) * 5,
          crop.crop, crop.variety,
          plantingDate.toISOString().split('T')[0],
          expectedHarvest.toISOString().split('T')[0],
          crop.growthStage,
          Math.random() * 25 + 70,
          Math.random() * 0.4 + 0.4,
          Math.random() * 30 + 45,
          Math.random() * 8 + 26,
          `Kelompok Tani ${kabupaten.name}`,
          `Supervisor ${Math.floor(Math.random() * 5) + 1}`,
          'active'
        ]
      );
    }
    
    console.log('✅ Agricultural fields seeded');
  });
}

async function seedCropActivities() {
  return await withConnection(async (connection) => {
    console.log('Seeding crop activities...');
    
    // Get fields
    const [fields] = await connection.execute('SELECT id, user_id, field_name, crop_type FROM agricultural_fields');
    
    const activities = [
      { type: 'planting', title: 'Penanaman Bibit', duration: 8, cost: [8000000, 15000000] },
      { type: 'fertilizing', title: 'Aplikasi Pupuk NPK', duration: 4, cost: [3000000, 8000000] },
      { type: 'pest_control', title: 'Pengendalian Hama Terpadu', duration: 3, cost: [2000000, 6000000] },
      { type: 'irrigation', title: 'Sistem Irigasi Tetes', duration: 6, cost: [4000000, 10000000] },
      { type: 'monitoring', title: 'Monitoring Kesehatan Tanaman', duration: 2, cost: [500000, 1500000] },
      { type: 'harvesting', title: 'Panen dan Pasca Panen', duration: 12, cost: [5000000, 12000000] }
    ];
    
    for (const field of fields) {
      const numActivities = Math.floor(Math.random() * 4) + 2; // 2-5 activities per field
      
      for (let i = 0; i < numActivities; i++) {
        const activity = activities[i % activities.length];
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 60) + Math.floor(Math.random() * 30));
        
        const isCompleted = Math.random() > 0.4;
        const cost = Math.floor(Math.random() * (activity.cost[1] - activity.cost[0]) + activity.cost[0]);
        
        const materials = [
          { name: getDefaultMaterial(activity.type), quantity: Math.floor(Math.random() * 100) + 50, unit: 'kg', cost: cost * 0.6 },
          { name: 'Material Pendukung', quantity: Math.floor(Math.random() * 50) + 20, unit: 'kg', cost: cost * 0.2 }
        ];
        
        const equipment = getDefaultEquipment(activity.type);
        
        await connection.execute(
          `INSERT INTO crop_activities (
            user_id, field_id, activity_type, activity_title, activity_description,
            scheduled_date, completed_date, duration_hours, area_hectares, 
            materials_used, equipment_used, workers_count, supervisor_name, 
            total_cost, activity_status, priority_level, weather_conditions, 
            activity_notes, quality_score
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            field.user_id, field.id, activity.type,
            `${activity.title} - ${field.field_name}`,
            `${activity.title} untuk optimalisasi pertumbuhan tanaman ${field.crop_type}`,
            scheduledDate.toISOString().split('T')[0],
            isCompleted ? scheduledDate.toISOString().split('T')[0] : null,
            activity.duration,
            Math.random() * 5 + 1,
            JSON.stringify(materials),
            JSON.stringify(equipment),
            Math.floor(Math.random() * 8) + 2,
            `Supervisor ${Math.floor(Math.random() * 5) + 1}`,
            cost,
            isCompleted ? 'completed' : Math.random() > 0.7 ? 'ongoing' : 'planned',
            ['low', 'normal', 'high'][Math.floor(Math.random() * 3)],
            ['Kondisi cuaca normal', 'Cuaca berawan', 'Kondisi cerah'][Math.floor(Math.random() * 3)],
            `Aktivitas ${activity.title} dilaksanakan sesuai SOP`,
            isCompleted ? Math.random() * 20 + 80 : null
          ]
        );
      }
    }
    
    console.log('✅ Crop activities seeded');
  });
}

function getDefaultMaterial(activityType) {
  const materials = {
    planting: 'Bibit berkualitas tinggi',
    fertilizing: 'Pupuk NPK 15-15-15',
    irrigation: 'Air irigasi bersih',
    pest_control: 'Pestisida organik',
    harvesting: 'Karung panen',
    monitoring: 'Alat ukur pH'
  };
  return materials[activityType] || 'Material umum pertanian';
}

function getDefaultEquipment(activityType) {
  const equipment = {
    planting: ['Hand tractor', 'Alat tanam manual', 'Cangkul'],
    fertilizing: ['Spreader pupuk', 'Sprayer', 'Ember'],
    irrigation: ['Pompa air', 'Selang irigasi', 'Timer otomatis'],
    pest_control: ['Sprayer motorized', 'APD lengkap', 'Masker'],
    harvesting: ['Sabit', 'Combine harvester mini', 'Karung'],
    monitoring: ['GPS handheld', 'Soil tester', 'pH meter digital']
  };
  return equipment[activityType] || ['Alat umum pertanian'];
}

async function seedSupplyChainOrders() {
  return await withConnection(async (connection) => {
    console.log('Seeding supply chain orders...');
    
    const [suppliers] = await connection.execute('SELECT id, supplier_name FROM suppliers');
    const [users] = await connection.execute('SELECT id FROM users LIMIT 10');
    const [items] = await connection.execute('SELECT id, item_name, unit_price FROM supply_chain_items');
    
    for (let i = 0; i < 30; i++) {
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90));
      
      const expectedDelivery = new Date(orderDate);
      expectedDelivery.setDate(expectedDelivery.getDate() + Math.floor(Math.random() * 14) + 3);
      
      const orderNumber = `ORD-${orderDate.getFullYear()}-${String(i + 1).padStart(4, '0')}`;
      
      // Insert order
      const [orderResult] = await connection.execute(
        `INSERT INTO supply_chain_orders (
          order_number, supplier_id, user_id, order_date, expected_delivery_date,
          order_status, payment_status, priority_level, order_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber, supplier.id, user.id, 
          orderDate.toISOString().split('T')[0],
          expectedDelivery.toISOString().split('T')[0],
          ['pending', 'confirmed', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
          ['pending', 'paid'][Math.floor(Math.random() * 2)],
          ['normal', 'high', 'urgent'][Math.floor(Math.random() * 3)],
          `Order untuk keperluan operasional ${supplier.supplier_name}`
        ]
      );
      
      const orderId = orderResult.insertId;
      let totalAmount = 0;
      
      // Add 1-4 items per order
      const numItems = Math.floor(Math.random() * 4) + 1;
      for (let j = 0; j < numItems; j++) {
        const item = items[Math.floor(Math.random() * items.length)];
        const quantity = Math.floor(Math.random() * 100) + 10;
        const unitPrice = item.unit_price;
        
        await connection.execute(
          `INSERT INTO supply_chain_order_items (
            order_id, item_id, quantity, unit_price, delivered_quantity, item_status
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId, item.id, quantity, unitPrice, 
            Math.random() > 0.5 ? quantity : Math.floor(quantity * 0.8),
            ['pending', 'partial', 'delivered'][Math.floor(Math.random() * 3)]
          ]
        );
        
        totalAmount += quantity * unitPrice;
      }
      
      // Update order total
      await connection.execute(
        'UPDATE supply_chain_orders SET total_amount = ? WHERE id = ?',
        [totalAmount, orderId]
      );
    }
    
    console.log('✅ Supply chain orders seeded');
  });
}

async function seedInventoryMovements() {
  return await withConnection(async (connection) => {
    console.log('Seeding inventory movements...');
    
    const [items] = await connection.execute('SELECT id, current_stock FROM supply_chain_items');
    const [users] = await connection.execute('SELECT id FROM users LIMIT 5');
    
    for (const item of items) {
      const numMovements = Math.floor(Math.random() * 10) + 5; // 5-14 movements per item
      let currentStock = 0;
      
      for (let i = 0; i < numMovements; i++) {
        const movementDate = new Date();
        movementDate.setDate(movementDate.getDate() - (numMovements - i) * 7);
        
        const movementType = i < 3 ? 'in' : ['in', 'out', 'adjustment'][Math.floor(Math.random() * 3)];
        const referenceType = movementType === 'in' ? 'purchase' : 
                             movementType === 'out' ? 'consumption' : 'adjustment';
        
        const quantity = movementType === 'in' ? 
                        Math.floor(Math.random() * 500) + 100 :
                        Math.floor(Math.random() * 100) + 10;
        
        const previousStock = currentStock;
        currentStock = movementType === 'in' ? currentStock + quantity : 
                      movementType === 'out' ? Math.max(0, currentStock - quantity) : 
                      quantity;
        
        const unitCost = Math.floor(Math.random() * 50000) + 10000;
        
        await connection.execute(
          `INSERT INTO inventory_movements (
            item_id, movement_type, quantity, reference_type, previous_stock,
            new_stock, unit_cost, total_cost, movement_date, notes, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id, movementType, quantity, referenceType, previousStock,
            currentStock, unitCost, quantity * unitCost,
            movementDate.toISOString().split('T')[0],
            `${movementType === 'in' ? 'Penerimaan' : movementType === 'out' ? 'Pengeluaran' : 'Penyesuaian'} stok`,
            users[Math.floor(Math.random() * users.length)].id
          ]
        );
      }
      
      // Update final stock
      await connection.execute(
        'UPDATE supply_chain_items SET current_stock = ? WHERE id = ?',
        [currentStock, item.id]
      );
    }
    
    console.log('✅ Inventory movements seeded');
  });
}

// Optimized batch data seeding with smaller chunks
async function seedSatelliteAndWeatherData() {
  return await withConnection(async (connection) => {
    console.log('Seeding satellite and weather data (30 days)...');
    
    const batchSize = 5; // Process 5 kabupaten at a time
    const days = 30; // Reduce to 30 days to prevent timeout
    
    for (let i = 0; i < kabupatenJatim.length; i += batchSize) {
      const batch = kabupatenJatim.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(kabupatenJatim.length/batchSize)}...`);
      
      const satelliteValues = [];
      const weatherValues = [];
      
      for (const kabupaten of batch) {
        for (let day = days; day >= 0; day--) {
          const date = new Date();
          date.setDate(date.getDate() - day);
          const dateStr = date.toISOString().split('T')[0];
          
          // Generate realistic data with seasonal variation
          const baseNDVI = 0.65 + Math.sin(day * 0.1) * 0.15;
          const seasonalTemp = 28 + Math.sin(day * 0.017) * 6;
          
          // Satellite data
          satelliteValues.push([
            kabupaten.name, dateStr, '12:00:00',
            Math.max(0.1, Math.min(0.9, baseNDVI)).toFixed(3),
            Math.max(0.05, baseNDVI - 0.15).toFixed(3),
            Math.min(0.95, baseNDVI + 0.15).toFixed(3),
            Math.max(0.1, Math.min(0.7, baseNDVI * 0.8)).toFixed(3),
            (seasonalTemp + (Math.random() - 0.5) * 4).toFixed(2),
            (Math.random() * 25 * (day % 7 < 2 ? 2 : 0.5)).toFixed(2),
            (Math.random() * 30 + 45).toFixed(2),
            (Math.random() * 60).toFixed(2),
            (Math.random() * 10 + 88).toFixed(2),
            (Math.random() * 15 + 85).toFixed(2),
            Math.random() > 0.3 ? 'Landsat-8' : 'Sentinel-2',
            'L2'
          ]);
          
          // Weather data
          const avgTemp = seasonalTemp + (Math.random() - 0.5) * 3;
          const humidity = Math.max(40, Math.min(95, 100 - avgTemp * 1.5 + (Math.random() - 0.5) * 20));
          
          weatherValues.push([
            kabupaten.name,
            `Stasiun BMKG ${kabupaten.name}`,
            `BMKG_${kabupaten.name.toUpperCase()}`,
            dateStr, '14:00:00',
            avgTemp.toFixed(1),
            Math.max(15, avgTemp - Math.random() * 8).toFixed(1),
            Math.min(40, avgTemp + Math.random() * 8).toFixed(1),
            humidity.toFixed(1),
            (Math.random() * 30 * (humidity > 80 ? 2 : 0.3)).toFixed(2),
            (Math.random() * 15 + 2).toFixed(1),
            (Math.random() * 360).toFixed(1),
            (Math.random() * 30 + 1000).toFixed(1),
            Math.max(1, Math.min(12, Math.floor(avgTemp / 3) + Math.random() * 3)),
            Math.random() > 0.7 ? 'Hujan' : Math.random() > 0.5 ? 'Berawan' : 'Cerah',
            (Math.random() * 20 + 5).toFixed(1),
            'BMKG'
          ]);
        }
      }
      
      // Batch insert satellite data
      if (satelliteValues.length > 0) {
        const satelliteSQL = `
          INSERT INTO satellite_data 
          (kabupaten, data_date, data_time, ndvi_avg, ndvi_min, ndvi_max, evi_avg, 
           land_surface_temp, rainfall_mm, soil_moisture, cloud_coverage, 
           confidence_score, coverage_percentage, satellite_source, processing_level) 
          VALUES ?
        `;
        await connection.query(satelliteSQL, [satelliteValues]);
      }
      
      // Batch insert weather data
      if (weatherValues.length > 0) {
        const weatherSQL = `
          INSERT INTO weather_data 
          (kabupaten, station_name, station_id, data_date, data_time,
           temperature_avg, temperature_min, temperature_max, humidity_avg,
           rainfall_mm, wind_speed, wind_direction, pressure_hpa, uv_index,
           weather_condition, visibility_km, data_source) 
          VALUES ?
        `;
        await connection.query(weatherSQL, [weatherValues]);
      }
      
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} completed`);
    }
    
    console.log('✅ Satellite and weather data seeded');
  });
}

async function seedSystemAlerts() {
  return await withConnection(async (connection) => {
    console.log('Seeding system alerts...');
    
    const alerts = [
      { type: 'weather', severity: 'medium', title: 'Potensi Hujan Lebat', message: 'Prediksi hujan 20-30mm dalam 6 jam ke depan' },
      { type: 'satellite', severity: 'low', title: 'NDVI Menurun Sedikit', message: 'Penurunan NDVI terdeteksi di beberapa area' },
      { type: 'system', severity: 'info', title: 'Update Data Satelit', message: 'Data terbaru berhasil diproses' },
      { type: 'inventory', severity: 'high', title: 'Stok Rendah Pupuk NPK', message: 'Stok pupuk NPK di bawah batas minimum' },
      { type: 'crop', severity: 'medium', title: 'Deteksi Hama Potensial', message: 'Pola cuaca mendukung perkembangan hama wereng' }
    ];
    
    for (let i = 0; i < 30; i++) {
      const kabupaten = kabupatenJatim[i % kabupatenJatim.length];
      const alert = alerts[i % alerts.length];
      const alertTime = new Date();
      alertTime.setHours(alertTime.getHours() - Math.floor(Math.random() * 72));
      
      await connection.execute(`
        INSERT INTO system_alerts (
          alert_type, severity, title, message, kabupaten, location_details,
          recommended_action, priority_score, alert_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        alert.type, alert.severity, alert.title, alert.message,
        kabupaten.name, `Kecamatan ${kabupaten.name}`,
        'Monitoring dan tindak lanjut sesuai SOP',
        alert.severity === 'critical' ? 90 : alert.severity === 'high' ? 80 : 
        alert.severity === 'medium' ? 60 : alert.severity === 'low' ? 40 : 20,
        alertTime
      ]);
    }
    
    console.log('✅ System alerts seeded');
  });
}

async function seedMitraPartners() {
  return await withConnection(async (connection) => {
    console.log('Seeding mitra partners...');
    
    const partners = [
      { name: 'Dinas Pertanian Jawa Timur', code: 'DISPERTA_JATIM', type: 'government', city: 'Surabaya', lat: -7.2504, lng: 112.7688 },
      { name: 'Balai Penelitian Tanaman Pangan', code: 'BALITBANGTAN', type: 'research', city: 'Malang', lat: -7.9826, lng: 112.6308 },
      { name: 'Institut Teknologi Sepuluh Nopember', code: 'ITS_SURABAYA', type: 'academic', city: 'Surabaya', lat: -7.2574, lng: 112.7954 },
      { name: 'Universitas Brawijaya', code: 'UB_MALANG', type: 'academic', city: 'Malang', lat: -7.9519, lng: 112.6141 },
      { name: 'BMKG Jawa Timur', code: 'BMKG_JATIM', type: 'government', city: 'Surabaya', lat: -7.2575, lng: 112.7521 }
    ];
    
    for (const partner of partners) {
      await connection.execute(`
        INSERT INTO mitra_partners (
          partner_name, partner_code, partner_type, city, latitude, longitude,
          contact_email, contact_phone, description, services_offered, rating
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        partner.name, partner.code, partner.type, partner.city,
        partner.lat, partner.lng,
        `info@${partner.code.toLowerCase()}.go.id`,
        `+62-31-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        `Partner strategis dalam pengembangan pertanian modern`,
        JSON.stringify(['Konsultasi', 'Pelatihan', 'Penelitian']),
        4.5 + Math.random() * 0.5
      ]);
    }
    
    console.log('✅ Mitra partners seeded');
  });
}

async function seedUserSettings() {
  return await withConnection(async (connection) => {
    console.log('Seeding user settings...');
    
    const [users] = await connection.execute('SELECT id FROM users LIMIT 10');
    const defaultSettings = {
      notifications: { emailNotifications: true, pushNotifications: true, weatherAlerts: true },
      privacy: { profileVisibility: 'private', dataSharing: false, analyticsOptIn: true },
      preferences: { language: 'id', timezone: 'Asia/Jakarta', theme: 'light' }
    };
    
    for (const user of users) {
      for (const [settingType, settings] of Object.entries(defaultSettings)) {
        for (const [key, value] of Object.entries(settings)) {
          await connection.execute(`
            INSERT INTO user_settings (user_id, setting_type, setting_key, setting_value)
            VALUES (?, ?, ?, ?)
          `, [user.id, settingType, key, JSON.stringify(value)]);
        }
      }
    }
    
    console.log('✅ User settings seeded');
  });
}

async function main() {
  console.log('🌱 Starting SAMIKNA Enhanced Database Seeding...');
  console.log('================================================');
  
  try {
    console.log('\n📊 Creating enhanced database schema...');
    await createTables();
    
    console.log('\n👥 Seeding users...');
    await seedUsers();
    
    console.log('\n🏢 Seeding suppliers...');
    await seedSuppliers();
    
    console.log('\n📦 Seeding inventory items...');
    await seedSupplyChainItems();
    
    console.log('\n🌾 Seeding agricultural fields...');
    await seedAgriculturalFields();
    
    console.log('\n📋 Seeding crop activities...');
    await seedCropActivities();
    
    console.log('\n🚚 Seeding supply chain orders...');
    await seedSupplyChainOrders();
    
    console.log('\n📈 Seeding inventory movements...');
    await seedInventoryMovements();
    
    console.log('\n🛰️ Seeding satellite & weather data...');
    await seedSatelliteAndWeatherData();
    
    console.log('\n🚨 Seeding system alerts...');
    await seedSystemAlerts();
    
    console.log('\n🤝 Seeding mitra partners...');
    await seedMitraPartners();
    
    console.log('\n⚙️ Seeding user settings...');
    await seedUserSettings();
    
    console.log('\n================================================');
    console.log('🎉 SAMIKNA Enhanced Database seeding completed successfully!');
    console.log('================================================');
    
    console.log('\n🔐 Sample Login Credentials:');
    console.log('============================');
    kabupatenJatim.slice(0, 5).forEach(kabupaten => {
      console.log(`${kabupaten.name} | ${kabupaten.name}Admin2024!`);
    });
    console.log('... and 25 more kabupaten with same pattern');
    
    console.log('\n✨ Enhanced Features Available:');
    console.log('===============================');
    console.log('🛰️ Satellite Monitoring (30 days data)');
    console.log('🌦️ Weather Integration (BMKG)');
    console.log('🌾 Advanced Crop Management');
    console.log('📦 Complete Supply Chain System');
    console.log('📈 Inventory Movement Tracking');
    console.log('🚚 Order Management & Tracking');
    console.log('🚨 Intelligent Alert System');
    console.log('📊 Comprehensive Analytics');
    console.log('👥 User Management');
    console.log('🤝 Partner Network');
    console.log('⚙️ User Settings & Preferences');
    
    console.log('\n🚀 Ready to run: npm run dev');
    
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the enhanced seeder
if (require.main === module) {
  main();
}

module.exports = {
  createTables,
  seedUsers,
  seedSuppliers,
  seedSupplyChainItems,
  seedAgriculturalFields,
  seedCropActivities,
  seedSupplyChainOrders,
  seedInventoryMovements,
  seedSatelliteAndWeatherData,
  seedSystemAlerts,
  seedMitraPartners,
  seedUserSettings
};