const mysql = require('mysql2/promise');

// Database configuration - MariaDB optimized for SAMIKNA Platform
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

async function testDatabaseConnection() {
  console.log('SAMIKNA Satellite Platform - Database Connection Test');
  console.log('====================================================\n');

  console.log('Connection Configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}\n`);

  let connection = null;

  try {
    // Test 1: Basic Connection
    console.log('Test 1: Establishing connection...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connection established successfully');

    // Test 2: Database Version
    console.log('\nTest 2: Getting database version...');
    const [versionResult] = await connection.execute('SELECT VERSION() as db_version');
    console.log(`Database version: ${versionResult[0].db_version}`);

    // Test 3: Basic functionality test
    console.log('\nTest 3: Testing basic functionality...');
    const [testResult] = await connection.execute('SELECT 1 as test_value');
    console.log(`✅ Basic test passed: ${testResult[0].test_value}`);

    // Test 4: Current time
    console.log('\nTest 4: Getting current time...');
    const [timeResult] = await connection.execute('SELECT NOW() as db_time');
    console.log(`Current time: ${timeResult[0].db_time}`);

    // Test 5: Check Tables for SAMIKNA Platform
    console.log('\nTest 5: Checking SAMIKNA database structure...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`Found ${tables.length} tables:`);
    
    const expectedTables = ['users', 'satellite_data', 'weather_data', 'crop_activities', 'supply_chain', 'mitra_partners', 'inquiries'];
    
    if (tables.length > 0) {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        const isExpected = expectedTables.includes(tableName);
        console.log(`   ${isExpected ? '✅' : '➡️'} ${tableName}`);
      });
    } else {
      console.log('   (No tables found - run npm run db:init to create SAMIKNA schema)');
    }

    // Test 6: Users Table Check (SAMIKNA Admin Accounts)
    const usersTableExists = tables.some(table => Object.values(table)[0] === 'users');
    
    if (usersTableExists) {
      console.log('\nTest 6: SAMIKNA Users table analysis...');
      
      // Check table structure
      const [structure] = await connection.execute('DESCRIBE users');
      console.log('Users table structure:');
      structure.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
      });

      // Count users by kabupaten
      const [userCount] = await connection.execute('SELECT COUNT(*) as user_count FROM users');
      console.log(`\nTotal users in database: ${userCount[0].user_count}`);

      // Show sample kabupaten users
      if (userCount[0].user_count > 0) {
        const [sampleUsers] = await connection.execute(`
          SELECT username, kabupaten, position, last_login, is_active 
          FROM users 
          ORDER BY created_at DESC 
          LIMIT 10
        `);
        console.log('Sample SAMIKNA admin accounts:');
        sampleUsers.forEach(user => {
          const status = user.is_active ? '✅ Active' : '❌ Inactive';
          const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString() : 'Never';
          console.log(`   - ${user.username} (${user.kabupaten}) - ${user.position || 'Admin'} - ${status} - Last: ${lastLogin}`);
        });
      } else {
        console.log('No users found in database');
        console.log('   Run: npm run db:seed to create SAMIKNA admin accounts');
      }
    } else {
      console.log('\nUsers table does not exist');
      console.log('   Run: npm run db:init to create the SAMIKNA platform tables');
    }

    // Test 7: Satellite Data Table Check
    const satelliteTableExists = tables.some(table => Object.values(table)[0] === 'satellite_data');
    
    if (satelliteTableExists) {
      console.log('\nTest 7: Satellite data table analysis...');
      const [satelliteCount] = await connection.execute('SELECT COUNT(*) as count FROM satellite_data');
      const [recentData] = await connection.execute(`
        SELECT kabupaten, AVG(ndvi_avg) as avg_ndvi, COUNT(*) as data_points 
        FROM satellite_data 
        GROUP BY kabupaten 
        ORDER BY data_points DESC 
        LIMIT 5
      `);
      
      console.log(`Total satellite data records: ${satelliteCount[0].count}`);
      if (recentData.length > 0) {
        console.log('Sample NDVI data by kabupaten:');
        recentData.forEach(data => {
          console.log(`   - ${data.kabupaten}: NDVI ${data.avg_ndvi?.toFixed(3) || 'N/A'} (${data.data_points} records)`);
        });
      }
    }

    // Test 8: Weather Data Table Check
    const weatherTableExists = tables.some(table => Object.values(table)[0] === 'weather_data');
    
    if (weatherTableExists) {
      console.log('\nTest 8: Weather data table analysis...');
      const [weatherCount] = await connection.execute('SELECT COUNT(*) as count FROM weather_data');
      const [recentWeather] = await connection.execute(`
        SELECT kabupaten, AVG(temperature_avg) as avg_temp, COUNT(*) as data_points 
        FROM weather_data 
        WHERE data_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY kabupaten 
        ORDER BY data_points DESC 
        LIMIT 5
      `);
      
      console.log(`Total weather data records: ${weatherCount[0].count}`);
      if (recentWeather.length > 0) {
        console.log('Recent weather data (7 days):');
        recentWeather.forEach(data => {
          console.log(`   - ${data.kabupaten}: ${data.avg_temp?.toFixed(1) || 'N/A'}°C avg (${data.data_points} records)`);
        });
      }
    }

    // Test 9: Performance Test
    console.log('\nTest 9: Database performance test...');
    const start = Date.now();
    await connection.execute(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [dbConfig.database]);
    const end = Date.now();
    console.log(`✅ Query executed in ${end - start}ms`);

    // Test 10: MariaDB Specific Features
    console.log('\nTest 10: MariaDB feature compatibility check...');
    try {
      const [mariadbInfo] = await connection.execute('SELECT @@version_comment as db_type, @@version as version');
      console.log(`Database type: ${mariadbInfo[0].db_type}`);
      console.log(`Version: ${mariadbInfo[0].version}`);
      
      // Check if InnoDB is available (required for SAMIKNA)
      const [engines] = await connection.execute('SHOW ENGINES');
      const innodbEngine = engines.find(engine => engine.Engine === 'InnoDB');
      if (innodbEngine) {
        console.log(`✅ InnoDB Engine: ${innodbEngine.Support}`);
      }

      // Check charset support
      const [charset] = await connection.execute('SELECT @@character_set_database as charset');
      console.log(`Database charset: ${charset[0].charset}`);
      
    } catch (infoError) {
      console.log('⚠️  Could not get MariaDB info (non-critical)');
    }

    // Test 11: SAMIKNA Platform Readiness
    console.log('\nTest 11: SAMIKNA Platform readiness check...');
    
    const platformTables = {
      users: usersTableExists,
      satellite_data: satelliteTableExists,
      weather_data: weatherTableExists,
      crop_activities: tables.some(table => Object.values(table)[0] === 'crop_activities'),
      supply_chain: tables.some(table => Object.values(table)[0] === 'supply_chain'),
      mitra_partners: tables.some(table => Object.values(table)[0] === 'mitra_partners')
    };

    const readyTables = Object.values(platformTables).filter(exists => exists).length;
    const totalTables = Object.keys(platformTables).length;
    
    console.log(`SAMIKNA Platform readiness: ${readyTables}/${totalTables} core tables`);
    Object.entries(platformTables).forEach(([table, exists]) => {
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
    });

    if (readyTables === totalTables) {
      console.log('\n🎉 SAMIKNA Platform is fully ready!');
    } else {
      console.log(`\n⚠️  Run 'npm run db:seed' to complete SAMIKNA platform setup`);
    }

    console.log('\n====================================================');
    console.log('All database tests completed successfully!');
    console.log('SAMIKNA Satellite Agricultural Platform is ready');
    console.log('====================================================');

    return { 
      success: true, 
      message: 'All SAMIKNA database tests passed', 
      version: versionResult[0].db_version,
      platformReadiness: `${readyTables}/${totalTables}`,
      tablesReady: readyTables === totalTables
    };

  } catch (error) {
    console.error('\n❌ SAMIKNA Database test failed:', error.message);
    console.error('\nError Details:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Errno: ${error.errno}`);
    console.error(`   SQL State: ${error.sqlState}`);
    if (error.sqlMessage) {
      console.error(`   SQL Message: ${error.sqlMessage}`);
    }

    // Provide specific troubleshooting for SAMIKNA
    console.log('\nTroubleshooting for SAMIKNA Platform:');
    
    switch (error.code) {
      case 'ENOTFOUND':
        console.log('   - Check if Hostinger hostname "srv566.hstgr.io" is accessible');
        console.log('   - Verify your internet connection');
        console.log('   - Check Hostinger control panel for database server status');
        break;
        
      case 'ECONNREFUSED':
        console.log('   - Verify port 3306 is open and accessible');
        console.log('   - Check if MariaDB server is running on Hostinger');
        console.log('   - Verify database service status in Hostinger control panel');
        break;
        
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('   - Verify username: u722506862_samikna');
        console.log('   - Check password in Hostinger database section');
        console.log('   - Ensure database user has full permissions');
        console.log('   - Try accessing via phpMyAdmin first to verify credentials');
        break;
        
      case 'ETIMEDOUT':
        console.log('   - Connection timeout - server may be overloaded');
        console.log('   - Try again in a few minutes');
        console.log('   - Consider increasing timeout in database config');
        break;
        
      case 'ER_BAD_DB_ERROR':
        console.log('   - Database "u722506862_samikna" does not exist');
        console.log('   - Create database in Hostinger control panel');
        console.log('   - Verify database name matches exactly');
        break;

      default:
        console.log(`   - Unknown error code: ${error.code}`);
        console.log('   - Check Hostinger control panel for any maintenance notices');
        console.log('   - Contact Hostinger support if issue persists');
        console.log('   - Verify all database credentials in .env.local');
    }

    return { 
      success: false, 
      error: error.message, 
      code: error.code,
      platform: 'SAMIKNA'
    };

  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('\n🔒 Database connection closed');
      } catch (closeError) {
        console.log(`\n⚠️  Error closing connection: ${closeError.message}`);
      }
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((result) => {
      if (result.success) {
        console.log('\n✅ SAMIKNA Database test completed successfully!');
        if (result.tablesReady) {
          console.log('🚀 Ready to run: npm run dev');
        } else {
          console.log('⚡ Next step: npm run db:seed');
        }
        process.exit(0);
      } else {
        console.log('\n❌ SAMIKNA Database test failed!');
        console.log('Fix the issues above before proceeding');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Unexpected error in SAMIKNA database test:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection };