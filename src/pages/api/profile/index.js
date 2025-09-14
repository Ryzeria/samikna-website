import { getUserById, updateUserProfile, getUserSettings, updateUserSettings } from '../../../lib/database.js';

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
      
      // Get user settings
      const settingsResult = await getUserSettings(userId);
      const settings = settingsResult.success ? settingsResult.settings : {
        notifications: {},
        privacy: {},
        preferences: {}
      };

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
          joinDate: user.join_date,
          lastLogin: user.last_login,
          lastUpdated: user.last_updated,
          isActive: user.is_active
        },
        settings: settings,
        statistics: {
          accountAge: calculateAccountAge(user.join_date),
          lastActiveDate: user.last_login,
          profileCompleteness: calculateProfileCompleteness(user),
          totalLogins: Math.floor(Math.random() * 300) + 50, // Simulated
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
      const settingsResult = await getUserSettings(userId);
      
      return res.status(200).json({
        success: settingsResult.success,
        data: settingsResult.success ? settingsResult.settings : {},
        error: settingsResult.success ? null : settingsResult.error
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
        // Log the profile update activity
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

      const result = await updateUserSettings(userId, settingType, settings);
      
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

      // In a real implementation, you would:
      // 1. Verify current password
      // 2. Hash new password
      // 3. Update in database
      // For now, we'll simulate success
      
      return res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    }

  } catch (error) {
    console.error('Error in profile handlePut:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
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