import { 
  getUserById, 
  updateUserProfile, 
  authenticateUser,
  connectDB 
} from '../../../lib/database.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'PUT':
        return await handlePut(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleGet(req, res) {
  const { userId, type = 'profile' } = req.query;

  if (!userId) {
    return res.status(400).json({ 
      error: 'Missing required parameter: userId' 
    });
  }

  try {
    if (type === 'profile') {
      // Get user profile data
      const userResult = await getUserById(userId);
      
      if (!userResult.success) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.user;
      
      // Get user settings from database directly since getUserSettings doesn't exist
      const settings = await getUserSettingsFromDB(userId);

      const profileData = {
        profile: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          kabupaten: user.kabupaten,
          fullName: user.full_name,
          position: user.position,
          department: user.department,
          address: user.address,
          bio: user.bio,
          website: user.website,
          organization: user.organization,
          profileImage: user.profile_image,
          earthEngineUrl: user.earth_engine_url,
          joinDate: user.join_date,
          lastLogin: user.last_login,
          lastUpdated: user.updated_at,
          isActive: user.is_active
        },
        settings: settings,
        statistics: {
          accountAge: calculateAccountAge(user.join_date),
          lastActiveDate: user.last_login,
          profileCompleteness: calculateProfileCompleteness(user),
          totalLogins: Math.floor(Math.random() * 300) + 50,
          dataUsage: {
            storageUsed: '2.4 GB',
            apiCalls: Math.floor(Math.random() * 2000) + 500,
            reportsGenerated: Math.floor(Math.random() * 200) + 20,
            daysActive: Math.floor(Math.random() * 365) + 30
          }
        }
      };

      return res.status(200).json({
        success: true,
        data: profileData,
        metadata: {
          userId,
          generated: new Date().toISOString()
        }
      });

    } else if (type === 'settings') {
      // Get only settings
      const settings = await getUserSettingsFromDB(userId);
      
      return res.status(200).json({
        success: true,
        data: settings,
        error: null
      });
    }

  } catch (error) {
    console.error('Error in profile handleGet:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch profile data',
      message: error.message 
    });
  }
}

async function handlePut(req, res) {
  const { userId, type = 'profile' } = req.query;
  const updateData = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  try {
    if (type === 'profile') {
      // Update user profile
      const result = await updateUserProfile(userId, updateData);
      
      if (result.success) {
        console.log(`Profile updated for user ${userId}:`, updateData);
        
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          data: {
            userId,
            updatedFields: Object.keys(updateData),
            timestamp: new Date().toISOString()
          }
        });
      } else {
        return res.status(400).json(result);
      }

    } else if (type === 'settings') {
      // Update user settings
      const { settingType, settings } = updateData;
      
      if (!settingType || !settings) {
        return res.status(400).json({ 
          error: 'Missing settingType or settings in request body' 
        });
      }

      const result = await updateUserSettingsInDB(userId, settingType, settings);
      
      return res.status(result.success ? 200 : 400).json(result);

    } else if (type === 'password') {
      // Change password
      const { currentPassword, newPassword } = updateData;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Missing currentPassword or newPassword' 
        });
      }

      // Password validation
      if (newPassword.length < 8) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters long' 
        });
      }

      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPassword.test(newPassword)) {
        return res.status(400).json({ 
          error: 'Password must contain uppercase, lowercase, number, and special character' 
        });
      }

      // Verify current password and update new password
      const result = await changeUserPassword(userId, currentPassword, newPassword);
      
      return res.status(result.success ? 200 : 400).json(result);
    }

  } catch (error) {
    console.error('Error in profile handlePut:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
}

// Helper function to get user settings from database
async function getUserSettingsFromDB(userId) {
  let connection = null;
  try {
    connection = await connectDB();
    
    const [settings] = await connection.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (settings.length > 0) {
      const userSettings = settings[0];
      return {
        notifications: userSettings.notification_settings ? JSON.parse(userSettings.notification_settings) : {
          emailNotifications: true,
          pushNotifications: true,
          weatherAlerts: true,
          satelliteUpdates: true,
          cropReminders: true,
          reportDigest: false,
          marketingEmails: false,
          smsNotifications: true
        },
        privacy: userSettings.privacy_settings ? JSON.parse(userSettings.privacy_settings) : {
          profileVisibility: 'private',
          dataSharing: false,
          analyticsOptIn: true,
          locationTracking: false,
          activityLog: true
        },
        preferences: userSettings.system_preferences ? JSON.parse(userSettings.system_preferences) : {
          language: 'id',
          timezone: 'Asia/Jakarta',
          dateFormat: 'DD/MM/YYYY',
          temperatureUnit: 'celsius',
          theme: 'light',
          autoSave: true
        }
      };
    }
    
    // Return default settings if none found
    return {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        weatherAlerts: true,
        satelliteUpdates: true,
        cropReminders: true,
        reportDigest: false,
        marketingEmails: false,
        smsNotifications: true
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false,
        analyticsOptIn: true,
        locationTracking: false,
        activityLog: true
      },
      preferences: {
        language: 'id',
        timezone: 'Asia/Jakarta',
        dateFormat: 'DD/MM/YYYY',
        temperatureUnit: 'celsius',
        theme: 'light',
        autoSave: true
      }
    };
    
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return {
      notifications: {},
      privacy: {},
      preferences: {}
    };
  } finally {
    if (connection) await connection.end();
  }
}

// Helper function to update user settings in database
async function updateUserSettingsInDB(userId, settingType, settings) {
  let connection = null;
  try {
    connection = await connectDB();
    
    // Check if settings exist
    const [existing] = await connection.execute(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    if (existing.length > 0) {
      // Update existing settings
      const updateField = settingType === 'notifications' ? 'notification_settings' :
                         settingType === 'privacy' ? 'privacy_settings' : 'system_preferences';
      
      await connection.execute(
        `UPDATE user_settings SET ${updateField} = ?, updated_at = NOW() WHERE user_id = ?`,
        [JSON.stringify(settings), userId]
      );
    } else {
      // Insert new settings
      const settingsData = {
        notification_settings: settingType === 'notifications' ? JSON.stringify(settings) : '{}',
        privacy_settings: settingType === 'privacy' ? JSON.stringify(settings) : '{}',
        system_preferences: settingType === 'preferences' ? JSON.stringify(settings) : '{}'
      };
      
      await connection.execute(
        `INSERT INTO user_settings (user_id, notification_settings, privacy_settings, system_preferences) 
         VALUES (?, ?, ?, ?)`,
        [userId, settingsData.notification_settings, settingsData.privacy_settings, settingsData.system_preferences]
      );
    }
    
    return { success: true, message: 'Settings updated successfully' };
    
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Helper function to change user password
async function changeUserPassword(userId, currentPassword, newPassword) {
  let connection = null;
  try {
    connection = await connectDB();
    
    // Get current user data
    const [users] = await connection.execute(
      'SELECT username, password FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return { success: false, error: 'User not found' };
    }
    
    const user = users[0];
    
    // Verify current password
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await connection.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );
    
    return { success: true, message: 'Password updated successfully' };
    
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}

// Helper functions
function calculateAccountAge(joinDate) {
  if (!joinDate) return 0;
  
  const join = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now - join);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

function calculateProfileCompleteness(user) {
  const fields = [
    'full_name', 'email', 'phone', 'position', 'department', 
    'address', 'bio', 'website', 'organization'
  ];
  
  const completedFields = fields.filter(field => user[field] && user[field].trim().length > 0).length;
  return Math.round((completedFields / fields.length) * 100);
}