import mysql from 'mysql2/promise';

// Enhanced MariaDB Configuration for SAMIKNA Platform
const dbConfig = {
  host: process.env.DB_HOST || 'srv566.hstgr.io',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u722506862_samikna',
  password: process.env.DB_PASS || 'S@m1Kn4!',
  database: process.env.DB_NAME || 'u722506862_samikna',
  ssl: false,
  connectTimeout: 60000,
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: false,
  dateStrings: false,
  debug: false,
  multipleStatements: false,
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return (field.string() === '1');
    }
    return next();
  }
};

// Connection pool for better performance
let pool = null;

export async function createPool() {
  if (!pool) {
    try {
      console.log('Creating SAMIKNA database connection pool...');
      pool = mysql.createPool({
        ...dbConfig,
        connectionLimit: 15,
        queueLimit: 0,
        reconnect: true,
        idleTimeout: 300000,
        maxReconnects: 3,
        reconnectDelay: 2000
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
    console.log('Connecting to SAMIKNA database...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Test connection
    await connection.execute('SELECT 1 as connection_test');
    console.log('Database connected successfully');
    
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('Trying alternative connection methods...');
      
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
    
    throw new Error(`SAMIKNA database connection failed: ${error.message}`);
  }
}

// ===================== USER MANAGEMENT =====================

export async function authenticateUser(username, password) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const [users] = await connection.execute(
      `SELECT id, username, password, kabupaten, full_name, email, phone, 
              position, department, earth_engine_url, is_active, last_login 
       FROM users WHERE username = ? AND is_active = TRUE`,
      [username]
    );
    
    if (users.length === 0) {
      return { success: false, message: 'User not found or inactive' };
    }
    
    const user = users[0];
    
    // Import bcrypt for password verification
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, message: 'Invalid password' };
    }
    
    // Update last login
    await connection.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    // Remove password from response
    delete user.password;
    
    return { success: true, user };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getUserById(userId) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const [users] = await connection.execute(
      `SELECT id, username, kabupaten, full_name, email, phone, position, 
              department, address, bio, website, organization, profile_image,
              earth_engine_url, join_date, last_login, is_active 
       FROM users WHERE id = ?`,
      [userId]
    );
    
    return users.length > 0 ? { success: true, user: users[0] } : { success: false };
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function updateUserProfile(userId, profileData) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const {
      full_name, email, phone, position, department, address, 
      bio, website, organization, profile_image
    } = profileData;
    
    await connection.execute(
      `UPDATE users SET 
        full_name = ?, email = ?, phone = ?, position = ?, department = ?,
        address = ?, bio = ?, website = ?, organization = ?, profile_image = ?,
        last_updated = NOW(), updated_at = NOW()
       WHERE id = ?`,
      [full_name, email, phone, position, department, address, bio, website, organization, profile_image, userId]
    );
    
    return { success: true, message: 'Profile updated successfully' };
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== USER SETTINGS =====================

export async function getUserSettings(userId, settingType = null) {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = 'SELECT setting_type, setting_key, setting_value FROM user_settings WHERE user_id = ?';
    let params = [userId];
    
    if (settingType) {
      query += ' AND setting_type = ?';
      params.push(settingType);
    }
    
    const [settings] = await connection.execute(query, params);
    
    const organizedSettings = {};
    for (const setting of settings) {
      if (!organizedSettings[setting.setting_type]) {
        organizedSettings[setting.setting_type] = {};
      }
      organizedSettings[setting.setting_type][setting.setting_key] = JSON.parse(setting.setting_value);
    }
    
    return { success: true, settings: organizedSettings };
    
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function updateUserSettings(userId, settingType, settings) {
  let connection = null;
  try {
    connection = await connectDB();
    
    await connection.beginTransaction();
    
    for (const [key, value] of Object.entries(settings)) {
      await connection.execute(
        `INSERT INTO user_settings (user_id, setting_type, setting_key, setting_value) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()`,
        [userId, settingType, key, JSON.stringify(value), JSON.stringify(value)]
      );
    }
    
    await connection.commit();
    return { success: true, message: 'Settings updated successfully' };
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating user settings:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== SATELLITE DATA =====================

export async function getSatelliteData(kabupaten, dateRange = 30, limit = 100) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const query = `
      SELECT 
        data_date, data_time, ndvi_avg, ndvi_min, ndvi_max, evi_avg,
        land_surface_temp, rainfall_mm, soil_moisture, cloud_coverage,
        confidence_score, coverage_percentage, satellite_source, processing_level
      FROM satellite_data 
      WHERE kabupaten = ? 
        AND data_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY data_date DESC, data_time DESC
      LIMIT ?
    `;
    
    const [results] = await connection.execute(query, [kabupaten, dateRange, limit]);
    
    // Calculate statistics
    const stats = calculateSatelliteStats(results);
    
    return { 
      success: true, 
      data: results,
      statistics: stats,
      metadata: {
        kabupaten,
        dateRange,
        recordCount: results.length,
        generated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getLatestSatelliteData(kabupaten) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const [results] = await connection.execute(
      `SELECT * FROM satellite_data 
       WHERE kabupaten = ? 
       ORDER BY data_date DESC, data_time DESC 
       LIMIT 1`,
      [kabupaten]
    );
    
    return results.length > 0 ? { success: true, data: results[0] } : { success: false };
    
  } catch (error) {
    console.error('Error fetching latest satellite data:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

function calculateSatelliteStats(data) {
  if (!data || data.length === 0) return null;
  
  const stats = {
    ndvi: { avg: 0, min: 1, max: 0, trend: 'stable' },
    temperature: { avg: 0, min: 100, max: -100, trend: 'stable' },
    soilMoisture: { avg: 0, min: 100, max: 0, trend: 'stable' },
    cloudCoverage: { avg: 0, min: 100, max: 0, trend: 'stable' }
  };
  
  let ndviSum = 0, tempSum = 0, moistureSum = 0, cloudSum = 0;
  
  for (const item of data) {
    // NDVI calculations
    if (item.ndvi_avg !== null) {
      ndviSum += parseFloat(item.ndvi_avg);
      stats.ndvi.min = Math.min(stats.ndvi.min, parseFloat(item.ndvi_avg));
      stats.ndvi.max = Math.max(stats.ndvi.max, parseFloat(item.ndvi_avg));
    }
    
    // Temperature calculations
    if (item.land_surface_temp !== null) {
      tempSum += parseFloat(item.land_surface_temp);
      stats.temperature.min = Math.min(stats.temperature.min, parseFloat(item.land_surface_temp));
      stats.temperature.max = Math.max(stats.temperature.max, parseFloat(item.land_surface_temp));
    }
    
    // Soil moisture calculations
    if (item.soil_moisture !== null) {
      moistureSum += parseFloat(item.soil_moisture);
      stats.soilMoisture.min = Math.min(stats.soilMoisture.min, parseFloat(item.soil_moisture));
      stats.soilMoisture.max = Math.max(stats.soilMoisture.max, parseFloat(item.soil_moisture));
    }
    
    // Cloud coverage calculations
    if (item.cloud_coverage !== null) {
      cloudSum += parseFloat(item.cloud_coverage);
      stats.cloudCoverage.min = Math.min(stats.cloudCoverage.min, parseFloat(item.cloud_coverage));
      stats.cloudCoverage.max = Math.max(stats.cloudCoverage.max, parseFloat(item.cloud_coverage));
    }
  }
  
  const count = data.length;
  stats.ndvi.avg = (ndviSum / count).toFixed(3);
  stats.temperature.avg = (tempSum / count).toFixed(2);
  stats.soilMoisture.avg = (moistureSum / count).toFixed(2);
  stats.cloudCoverage.avg = (cloudSum / count).toFixed(2);
  
  // Calculate trends (simplified)
  if (data.length >= 2) {
    const recent = data[0];
    const previous = data[Math.floor(data.length / 2)];
    
    stats.ndvi.trend = recent.ndvi_avg > previous.ndvi_avg ? 'up' : recent.ndvi_avg < previous.ndvi_avg ? 'down' : 'stable';
    stats.temperature.trend = recent.land_surface_temp > previous.land_surface_temp ? 'up' : recent.land_surface_temp < previous.land_surface_temp ? 'down' : 'stable';
    stats.soilMoisture.trend = recent.soil_moisture > previous.soil_moisture ? 'up' : recent.soil_moisture < previous.soil_moisture ? 'down' : 'stable';
    stats.cloudCoverage.trend = recent.cloud_coverage > previous.cloud_coverage ? 'up' : recent.cloud_coverage < previous.cloud_coverage ? 'down' : 'stable';
  }
  
  return stats;
}

// ===================== WEATHER DATA =====================

export async function getWeatherData(kabupaten, dateRange = 30, limit = 100) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const query = `
      SELECT 
        data_date, data_time, station_name, temperature_avg, temperature_min, 
        temperature_max, humidity_avg, rainfall_mm, wind_speed, wind_direction,
        pressure_hpa, uv_index, weather_condition, visibility_km, data_source
      FROM weather_data 
      WHERE kabupaten = ? 
        AND data_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY data_date DESC, data_time DESC
      LIMIT ?
    `;
    
    const [results] = await connection.execute(query, [kabupaten, dateRange, limit]);
    
    // Calculate weather statistics
    const stats = calculateWeatherStats(results);
    
    return { 
      success: true, 
      data: results,
      statistics: stats,
      metadata: {
        kabupaten,
        dateRange,
        recordCount: results.length,
        generated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getCurrentWeather(kabupaten) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const [results] = await connection.execute(
      `SELECT * FROM weather_data 
       WHERE kabupaten = ? 
       ORDER BY data_date DESC, data_time DESC 
       LIMIT 1`,
      [kabupaten]
    );
    
    return results.length > 0 ? { success: true, data: results[0] } : { success: false };
    
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

function calculateWeatherStats(data) {
  if (!data || data.length === 0) return null;
  
  const stats = {
    temperature: { avg: 0, min: 100, max: -100 },
    humidity: { avg: 0, min: 100, max: 0 },
    rainfall: { total: 0, avg: 0, days: 0 },
    windSpeed: { avg: 0, max: 0 },
    pressure: { avg: 0, min: 2000, max: 0 }
  };
  
  let tempSum = 0, humiditySum = 0, rainfallSum = 0, windSum = 0, pressureSum = 0;
  let rainyDays = 0;
  
  for (const item of data) {
    if (item.temperature_avg !== null) {
      tempSum += parseFloat(item.temperature_avg);
      stats.temperature.min = Math.min(stats.temperature.min, parseFloat(item.temperature_min || item.temperature_avg));
      stats.temperature.max = Math.max(stats.temperature.max, parseFloat(item.temperature_max || item.temperature_avg));
    }
    
    if (item.humidity_avg !== null) {
      humiditySum += parseFloat(item.humidity_avg);
      stats.humidity.min = Math.min(stats.humidity.min, parseFloat(item.humidity_avg));
      stats.humidity.max = Math.max(stats.humidity.max, parseFloat(item.humidity_avg));
    }
    
    if (item.rainfall_mm !== null) {
      const rainfall = parseFloat(item.rainfall_mm);
      rainfallSum += rainfall;
      if (rainfall > 0.1) rainyDays++;
    }
    
    if (item.wind_speed !== null) {
      windSum += parseFloat(item.wind_speed);
      stats.windSpeed.max = Math.max(stats.windSpeed.max, parseFloat(item.wind_speed));
    }
    
    if (item.pressure_hpa !== null) {
      pressureSum += parseFloat(item.pressure_hpa);
      stats.pressure.min = Math.min(stats.pressure.min, parseFloat(item.pressure_hpa));
      stats.pressure.max = Math.max(stats.pressure.max, parseFloat(item.pressure_hpa));
    }
  }
  
  const count = data.length;
  stats.temperature.avg = (tempSum / count).toFixed(1);
  stats.humidity.avg = (humiditySum / count).toFixed(1);
  stats.rainfall.total = rainfallSum.toFixed(2);
  stats.rainfall.avg = (rainfallSum / count).toFixed(2);
  stats.rainfall.days = rainyDays;
  stats.windSpeed.avg = (windSum / count).toFixed(1);
  stats.pressure.avg = (pressureSum / count).toFixed(1);
  
  return stats;
}

// ===================== AGRICULTURAL FIELDS =====================

export async function getFieldsByUser(userId, kabupaten = null) {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = `
      SELECT 
        id, field_name, kabupaten, location_address, coordinates_lat, coordinates_lng,
        area_hectares, crop_type, crop_variety, planting_date, expected_harvest_date,
        growth_stage, health_score, current_ndvi, current_soil_moisture, 
        current_temperature, next_activity, owner_name, supervisor_name,
        field_status, field_notes, created_at, updated_at
      FROM agricultural_fields 
      WHERE user_id = ?
    `;
    
    let params = [userId];
    
    if (kabupaten) {
      query += ' AND kabupaten = ?';
      params.push(kabupaten);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [results] = await connection.execute(query, params);
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('Error fetching agricultural fields:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getFieldById(fieldId, userId = null) {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = 'SELECT * FROM agricultural_fields WHERE id = ?';
    let params = [fieldId];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const [results] = await connection.execute(query, params);
    
    return results.length > 0 ? { success: true, data: results[0] } : { success: false };
    
  } catch (error) {
    console.error('Error fetching field:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function createField(userId, fieldData) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const {
      field_name, kabupaten, location_address, coordinates_lat, coordinates_lng,
      area_hectares, crop_type, crop_variety, planting_date, expected_harvest_date,
      growth_stage, owner_name, supervisor_name, field_notes
    } = fieldData;
    
    const [result] = await connection.execute(
      `INSERT INTO agricultural_fields (
        user_id, field_name, kabupaten, location_address, coordinates_lat, coordinates_lng,
        area_hectares, crop_type, crop_variety, planting_date, expected_harvest_date,
        growth_stage, owner_name, supervisor_name, field_notes, field_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, field_name, kabupaten, location_address, coordinates_lat, coordinates_lng,
        area_hectares, crop_type, crop_variety, planting_date, expected_harvest_date,
        growth_stage || 'land_preparation', owner_name, supervisor_name, field_notes, 'active'
      ]
    );
    
    return { success: true, fieldId: result.insertId, message: 'Field created successfully' };
    
  } catch (error) {
    console.error('Error creating field:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== CROP ACTIVITIES =====================

export async function getCropActivities(userId, fieldId = null, dateRange = 30, limit = 100) {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = `
      SELECT 
        ca.*, af.field_name, af.crop_type
      FROM crop_activities ca
      LEFT JOIN agricultural_fields af ON ca.field_id = af.id
      WHERE ca.user_id = ?
    `;
    
    let params = [userId];
    
    if (fieldId) {
      query += ' AND ca.field_id = ?';
      params.push(fieldId);
    }
    
    if (dateRange) {
      query += ' AND ca.scheduled_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
      params.push(dateRange);
    }
    
    query += ' ORDER BY ca.scheduled_date DESC, ca.created_at DESC LIMIT ?';
    params.push(limit);
    
    const [results] = await connection.execute(query, params);
    
    // Parse JSON fields
    const activities = results.map(activity => ({
      ...activity,
      materials_used: activity.materials_used ? JSON.parse(activity.materials_used) : [],
      equipment_used: activity.equipment_used ? JSON.parse(activity.equipment_used) : []
    }));
    
    return { success: true, data: activities };
    
  } catch (error) {
    console.error('Error fetching crop activities:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function createCropActivity(userId, activityData) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const {
      field_id, activity_type, activity_title, activity_description, scheduled_date,
      duration_hours, area_hectares, materials_used, equipment_used, workers_count,
      supervisor_name, total_cost, priority_level, weather_conditions,
      activity_notes
    } = activityData;
    
    const [result] = await connection.execute(
      `INSERT INTO crop_activities (
        user_id, field_id, activity_type, activity_title, activity_description,
        scheduled_date, duration_hours, area_hectares, materials_used, equipment_used,
        workers_count, supervisor_name, total_cost, priority_level,
        weather_conditions, activity_notes, activity_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, field_id, activity_type, activity_title, activity_description,
        scheduled_date, duration_hours, area_hectares, 
        JSON.stringify(materials_used || []), JSON.stringify(equipment_used || []),
        workers_count || 1, supervisor_name, total_cost, priority_level || 'normal',
        weather_conditions, activity_notes, 'planned'
      ]
    );
    
    return { success: true, activityId: result.insertId, message: 'Activity created successfully' };
    
  } catch (error) {
    console.error('Error creating crop activity:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== SUPPLY CHAIN =====================

export async function getInventoryItems(userId, category = null, status = null, limit = 100) {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = `
      SELECT 
        sci.*, s.supplier_name, s.contact_person, s.rating
      FROM supply_chain_items sci
      LEFT JOIN suppliers s ON sci.supplier_id = s.id
      WHERE 1=1
    `;
    
    let params = [];
    
    if (category && category !== 'all') {
      query += ' AND sci.category = ?';
      params.push(category);
    }
    
    if (status && status !== 'all') {
      query += ' AND sci.stock_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY sci.updated_at DESC LIMIT ?';
    params.push(limit);
    
    const [results] = await connection.execute(query, params);
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getSuppliers(category = null, status = 'active') {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = 'SELECT * FROM suppliers WHERE 1=1';
    let params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (status && status !== 'all') {
      query += ' AND supplier_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY rating DESC, supplier_name ASC';
    
    const [results] = await connection.execute(query, params);
    
    // Parse JSON fields
    const suppliers = results.map(supplier => ({
      ...supplier,
      certifications: supplier.certifications ? JSON.parse(supplier.certifications) : []
    }));
    
    return { success: true, data: suppliers };
    
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function getSupplyChainOrders(userId, status = null, limit = 50) {
  let connection = null;
  try {
    connection = await connectDB();
    
    // Simplified query without the non-existent table
    let query = `
      SELECT 
        sco.*, s.supplier_name, s.contact_person, s.phone
      FROM supply_chain_orders sco
      LEFT JOIN suppliers s ON sco.supplier_id = s.id
      WHERE sco.user_id = ?
    `;
    
    let params = [userId];
    
    if (status && status !== 'all') {
      query += ' AND sco.order_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY sco.order_date DESC LIMIT ?';
    params.push(limit);
    
    const [results] = await connection.execute(query, params);
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('Error fetching supply chain orders:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== ALERTS & NOTIFICATIONS =====================

export async function getSystemAlerts(kabupaten = null, isActive = true, limit = 20) {
  let connection = null;
  try {
    connection = await connectDB();
    
    let query = `
      SELECT 
        id, alert_type, severity, title, message, kabupaten, location_details,
        recommended_action, priority_score, is_automated, alert_time, expires_at
      FROM system_alerts 
      WHERE 1=1
    `;
    
    let params = [];
    
    if (kabupaten) {
      query += ' AND kabupaten = ?';
      params.push(kabupaten);
    }
    
    if (isActive !== null) {
      query += ' AND is_active = ?';
      params.push(isActive);
    }
    
    query += ' ORDER BY priority_score DESC, alert_time DESC LIMIT ?';
    params.push(limit);
    
    const [results] = await connection.execute(query, params);
    
    return { success: true, data: results };
    
  } catch (error) {
    console.error('Error fetching system alerts:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

export async function createSystemAlert(alertData) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const {
      alert_type, severity, title, message, kabupaten, location_details,
      recommended_action, priority_score, is_automated
    } = alertData;
    
    const [result] = await connection.execute(
      `INSERT INTO system_alerts (
        alert_type, severity, title, message, kabupaten, location_details,
        recommended_action, priority_score, is_automated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alert_type, severity, title, message, kabupaten, location_details,
        recommended_action, priority_score || 50, is_automated || true
      ]
    );
    
    return { success: true, alertId: result.insertId, message: 'Alert created successfully' };
    
  } catch (error) {
    console.error('Error creating system alert:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== ANALYTICS & REPORTS =====================

export async function getDashboardOverview(userId, kabupaten) {
  let connection = null;
  try {
    connection = await connectDB();
    
    // Get various counts and metrics
    const [fieldStats] = await connection.execute(
      'SELECT COUNT(*) as total_fields, SUM(area_hectares) as total_area FROM agricultural_fields WHERE user_id = ?',
      [userId]
    );
    
    const [activityStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_activities,
        SUM(CASE WHEN activity_status = 'completed' THEN 1 ELSE 0 END) as completed_activities,
        SUM(CASE WHEN activity_status = 'ongoing' THEN 1 ELSE 0 END) as ongoing_activities,
        SUM(CASE WHEN activity_status = 'planned' THEN 1 ELSE 0 END) as planned_activities
       FROM crop_activities WHERE user_id = ?`,
      [userId]
    );
    
    const [alertStats] = await connection.execute(
      'SELECT COUNT(*) as active_alerts FROM system_alerts WHERE kabupaten = ? AND is_active = TRUE',
      [kabupaten]
    );
    
    const [inventoryStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_items,
        SUM(total_value) as total_value,
        SUM(CASE WHEN stock_status = 'low' OR stock_status = 'critical' THEN 1 ELSE 0 END) as low_stock_items
       FROM supply_chain_items`
    );
    
    // Get latest satellite data
    const satelliteData = await getLatestSatelliteData(kabupaten);
    
    // Get current weather
    const weatherData = await getCurrentWeather(kabupaten);
    
    return {
      success: true,
      data: {
        fields: fieldStats[0],
        activities: activityStats[0],
        alerts: alertStats[0],
        inventory: inventoryStats[0],
        satellite: satelliteData.success ? satelliteData.data : null,
        weather: weatherData.success ? weatherData.data : null,
        generated: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// ===================== UTILITY FUNCTIONS =====================

export async function testConnection() {
  let connection = null;
  try {
    console.log('Testing SAMIKNA enhanced database connection...');
    connection = await connectDB();
    
    const [basicTest] = await connection.execute('SELECT 1 as test, NOW() as db_time, VERSION() as db_version');
    console.log('Basic connection test successful:', basicTest[0]);
    
    // Test enhanced tables
    const tables = [
      'users', 'user_settings', 'agricultural_fields', 'crop_activities', 
      'satellite_data', 'weather_data', 'suppliers', 'supply_chain_items',
      'supply_chain_orders', 'system_alerts', 'mitra_partners', 'inquiries'
    ];
    
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
          console.log(`✓ Table ${table}: ${countTest[0].count} records`);
        } else {
          tableStatus[table] = { exists: false, count: 0 };
          console.log(`✗ Table ${table}: NOT EXISTS`);
        }
      } catch (tableError) {
        tableStatus[table] = { exists: false, error: tableError.message };
        console.log(`✗ Table ${table}: ERROR - ${tableError.message}`);
      }
    }
    
    return { 
      success: true, 
      message: 'SAMIKNA enhanced database connection successful',
      testResult: basicTest[0],
      tableStatus,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Enhanced connection test failed:', error);
    
    return { 
      success: false, 
      message: `SAMIKNA database connection failed: ${error.message}`,
      errorCode: error.code,
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