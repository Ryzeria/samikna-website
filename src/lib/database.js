import mysql from 'mysql2/promise';

// Enhanced MariaDB Configuration for SAMIKNA Platform
const dbConfig = {
  host: process.env.DB_HOST || 'srv566.hstgr.io',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u722506862_samikna',
  password: process.env.DB_PASS || 'S@m1Kn4!',
  database: process.env.DB_NAME || 'u722506862_samikna',
  ssl: false,
  connectTimeout: 30000,
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
  debug: false,
  // MariaDB compatibility settings
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return (field.string() === '1'); // 1 = true, 0 = false
    }
    return next();
  }
};

// Create connection pool for better performance
let pool = null;

export async function createPool() {
  if (!pool) {
    try {
      console.log('Creating SAMIKNA database connection pool...');
      pool = mysql.createPool({
        ...dbConfig,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 30000,
        timeout: 30000,
        reconnect: true,
        idleTimeout: 300000
      });
      
      console.log('Database pool created successfully');
      
      // Test the pool
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('Database pool test successful');
      
      return pool;
    } catch (error) {
      console.error('Failed to create database pool:', error);
      throw error;
    }
  }
  return pool;
}

export async function connectDB() {
  try {
    console.log('Connecting to SAMIKNA database:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Test connection with satellite monitoring query
    await connection.execute('SELECT 1 as connection_test');
    console.log('Database connected successfully for satellite monitoring');
    
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Try alternative connection methods
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('Trying alternative connection methods...');
      
      // Alternative with different SSL settings
      try {
        const altConfig = {
          ...dbConfig,
          ssl: { rejectUnauthorized: false }
        };
        const connection = await mysql.createConnection(altConfig);
        await connection.execute('SELECT 1 as test');
        console.log('Connected using alternative SSL config');
        return connection;
      } catch (altError) {
        console.log('Alternative connection failed:', altError.message);
      }
    }
    
    const detailedError = new Error(`SAMIKNA database connection failed: ${error.message}`);
    detailedError.originalError = error;
    detailedError.connectionDetails = {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      code: error.code,
      errno: error.errno
    };
    
    throw detailedError;
  }
}

// Enhanced test connection for satellite data
export async function testConnection() {
  let connection = null;
  try {
    console.log('Testing SAMIKNA satellite monitoring database connection...');
    connection = await connectDB();
    
    // Test basic connectivity
    const [basicTest] = await connection.execute('SELECT 1 as test, NOW() as db_time, VERSION() as db_version');
    console.log('Basic connection test successful:', basicTest[0]);
    
    // Test satellite data tables
    const tables = ['users', 'satellite_data', 'weather_data', 'crop_activities', 'supply_chain', 'mitra_partners'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const [tableTest] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (tableTest.length > 0) {
          const [countTest] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
          tableStatus[table] = {
            exists: true,
            count: countTest[0].count
          };
          console.log(`Table ${table}: ${countTest[0].count} records`);
        } else {
          tableStatus[table] = { exists: false, count: 0 };
          console.log(`Table ${table}: NOT EXISTS`);
        }
      } catch (tableError) {
        tableStatus[table] = { exists: false, error: tableError.message };
        console.log(`Table ${table}: ERROR - ${tableError.message}`);
      }
    }
    
    return { 
      success: true, 
      message: 'SAMIKNA database connection successful',
      testResult: basicTest[0],
      tableStatus,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    
    return { 
      success: false, 
      message: `SAMIKNA database connection failed: ${error.message}`,
      errorCode: error.code,
      details: error.connectionDetails || {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database
      },
      timestamp: new Date().toISOString()
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (closeError) {
        console.log('Error closing connection:', closeError.message);
      }
    }
  }
}

// Initialize satellite monitoring database
export async function initializeDatabase() {
  let connection = null;
  try {
    console.log('Initializing SAMIKNA satellite monitoring database...');
    connection = await connectDB();
    
    // Create users table for satellite monitoring access
    const createUserTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
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
        is_active BOOLEAN DEFAULT TRUE,
        INDEX idx_username (username),
        INDEX idx_kabupaten (kabupaten)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    // Create satellite data table
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
        INDEX idx_kabupaten_date (kabupaten, data_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    // Create weather data table
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
        INDEX idx_kabupaten_date (kabupaten, data_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createUserTableSQL);
    await connection.execute(createSatelliteTableSQL);
    await connection.execute(createWeatherTableSQL);
    
    console.log('SAMIKNA satellite monitoring tables created/verified');
    
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, message: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get satellite data for specific kabupaten
export async function getSatelliteData(kabupaten, dateRange = 30) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const query = `
      SELECT * FROM satellite_data 
      WHERE kabupaten = ? 
      AND data_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY data_date DESC
      LIMIT 100
    `;
    
    const [results] = await connection.execute(query, [kabupaten, dateRange]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get weather data for specific kabupaten
export async function getWeatherData(kabupaten, dateRange = 30) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const query = `
      SELECT * FROM weather_data 
      WHERE kabupaten = ? 
      AND data_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY data_date DESC, data_time DESC
      LIMIT 100
    `;
    
    const [results] = await connection.execute(query, [kabupaten, dateRange]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Close database connections
export async function closeDB() {
  try {
    if (pool) {
      console.log('Closing SAMIKNA database pool...');
      await pool.end();
      pool = null;
      console.log('Database pool closed');
    }
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}