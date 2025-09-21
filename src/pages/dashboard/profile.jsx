import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Form data states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    bio: '',
    website: '',
    organization: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weatherAlerts: true,
    satelliteUpdates: true,
    cropReminders: true,
    reportDigest: false,
    marketingEmails: false,
    smsNotifications: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsOptIn: true,
    locationTracking: false,
    activityLog: true
  });

  const [systemPreferences, setSystemPreferences] = useState({
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    temperatureUnit: 'celsius',
    theme: 'light',
    autoSave: true
  });

  // Initialize data
  useEffect(() => {
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        loadProfileData(parsed.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Invalid user data');
        setLoading(false);
      }
    } else {
      setError('No user data found');
      setLoading(false);
    }
  }, []);

  // Load profile data from API
  const loadProfileData = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/profile?userId=${userId}&type=profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const profile = result.data.profile;
        const settings = result.data.settings;
        
        setProfileData(result.data);
        
        // Update form data
        setFormData({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          position: profile.position || '',
          department: profile.department || '',
          address: profile.address || '',
          bio: profile.bio || '',
          website: profile.website || '',
          organization: profile.organization || ''
        });

        // Update settings
        if (settings.notifications) {
          setNotificationSettings(prev => ({ ...prev, ...settings.notifications }));
        }

        if (settings.privacy) {
          setPrivacySettings(prev => ({ ...prev, ...settings.privacy }));
        }

        if (settings.preferences) {
          setSystemPreferences(prev => ({ ...prev, ...settings.preferences }));
        }

        setProfileImage(profile.profileImage);

      } else {
        throw new Error(result.error || 'Failed to fetch profile data');
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show message helper
  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validation
      if (!formData.fullName || !formData.email) {
        showMessage('error', 'Nama lengkap dan email wajib diisi!');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showMessage('error', 'Format email tidak valid!');
        return;
      }

      const response = await fetch(`/api/profile?userId=${user.id}&type=profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          department: formData.department,
          address: formData.address,
          bio: formData.bio,
          website: formData.website,
          organization: formData.organization,
          profile_image: profileImage
        }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedUser = { 
          ...user, 
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          lastUpdated: new Date().toISOString() 
        };
        
        localStorage.setItem('samikna_user', JSON.stringify(updatedUser));
        sessionStorage.setItem('samikna_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        await loadProfileData(user.id);
        showMessage('success', 'Profile berhasil diupdate!');
      } else {
        showMessage('error', result.error || 'Gagal mengupdate profile');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Gagal mengupdate profile. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage('error', 'Semua field password wajib diisi!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Password baru dan konfirmasi tidak cocok!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password minimal 8 karakter!');
      return;
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(passwordData.newPassword)) {
      showMessage('error', 'Password harus mengandung huruf besar, kecil, angka, dan simbol!');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/profile?userId=${user.id}&type=password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordChange(false);
        showMessage('success', 'Password berhasil diubah!');
      } else {
        showMessage('error', result.error || 'Gagal mengubah password!');
      }

    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('error', 'Gagal mengubah password!');
    } finally {
      setSaving(false);
    }
  };

  // Handle settings update
  const handleSettingsUpdate = async (settingType, settings) => {
    try {
      const response = await fetch(`/api/profile?userId=${user.id}&type=settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingType, settings }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage('success', `Pengaturan ${settingType} berhasil disimpan!`);
      } else {
        showMessage('error', result.error || 'Gagal menyimpan pengaturan!');
      }

    } catch (error) {
      console.error('Error updating settings:', error);
      showMessage('error', 'Gagal menyimpan pengaturan!');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'Ukuran file maksimal 5MB!');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showMessage('error', 'File harus berupa gambar!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        showMessage('success', 'Foto profile berhasil diupload!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Export user data
  const exportUserData = () => {
    try {
      const userData = {
        profile: profileData?.profile || {},
        settings: {
          notifications: notificationSettings,
          privacy: privacySettings,
          preferences: systemPreferences
        },
        statistics: profileData?.statistics || {},
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SAMIKNA_UserData_${user?.username}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showMessage('success', 'Data berhasil diekspor!');
    } catch (error) {
      showMessage('error', 'Gagal mengekspor data!');
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'security', label: 'Security & Password' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy Settings' },
    { id: 'preferences', label: 'System Preferences' },
    { id: 'data', label: 'Data Management' }
  ];

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange, label, description, disabled = false }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
      disabled ? 'bg-gray-100 opacity-50' : 'bg-gray-50 hover:bg-gray-100'
    }`}>
      <div>
        <p className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{label}</p>
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : checked 
              ? 'bg-blue-600' 
              : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Loading profile data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error && !profileData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <p className="text-gray-600 text-lg mb-2">Failed to load profile</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => user && loadProfileData(user.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Profile Settings - {profileData?.profile?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Pengaturan profil dan konfigurasi akun SAMIKNA" />
      </Head>

      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-20">
              <div className="w-20 h-20 text-6xl">🛰️</div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white/30">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white">
                        {profileData?.profile?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-110">
                    <span className="text-sm">📷</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {profileData?.profile?.fullName || profileData?.profile?.kabupaten || 'Administrator'}
                  </h1>
                  <p className="text-blue-100 mb-1">{profileData?.profile?.position || 'Agricultural Administrator'}</p>
                  <p className="text-blue-200 text-sm">{profileData?.profile?.department || 'Department of Agriculture'}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🌱 Agricultural Tech</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📍 {profileData?.profile?.kabupaten || 'Indonesia'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                {profileData?.statistics && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{profileData.statistics.accountAge || 0}</div>
                      <div className="text-blue-100 text-sm">Days</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{profileData.statistics.profileCompleteness || 0}%</div>
                      <div className="text-blue-100 text-sm">Complete</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold">{profileData.statistics.dataUsage?.daysActive || 0}</div>
                      <div className="text-blue-100 text-sm">Active</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Alert */}
          {message.content && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              } transition-all duration-300`}
            >
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              {message.content}
            </motion.div>
          )}

          {/* Error Banner */}
          {error && profileData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800">Warning: Some data may be cached due to connectivity issues.</span>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">👤 Informasi Profil</h3>
                    <div className="text-sm text-gray-500">
                      Last updated: {profileData?.profile?.lastUpdated ? 
                        new Date(profileData.profile.lastUpdated).toLocaleDateString('id-ID') : 'Never'}
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 border-b pb-2">👤 Informasi Dasar</h4>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Username</label>
                          <input
                            type="text"
                            value={profileData?.profile?.username || ''}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                          <p className="text-gray-500 text-sm mt-1">Username tidak dapat diubah</p>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Nama Lengkap *</label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">📧 Email *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">📞 Nomor Telepon</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+62 812 3456 7890"
                          />
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 border-b pb-2">🏢 Informasi Profesi</h4>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">📍 Kabupaten</label>
                          <input
                            type="text"
                            value={profileData?.profile?.kabupaten || ''}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Jabatan</label>
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Departemen</label>
                          <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">🌐 Website</label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">📍 Alamat</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Alamat lengkap kantor atau tempat tinggal"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">✏️ Bio / Deskripsi</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Ceritakan tentang diri Anda dan pekerjaan Anda..."
                      />
                      <p className="text-gray-500 text-sm mt-1">{formData.bio.length}/500 karakter</p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => user && loadProfileData(user.id)}
                        disabled={saving}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            💾 Simpan Perubahan
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">🔒 Keamanan & Password</h3>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">🔑 Ubah Password</h4>
                        <p className="text-gray-600 text-sm">Update password untuk keamanan akun</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showPasswordChange 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {showPasswordChange ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>

                    {showPasswordChange && (
                      <form onSubmit={handlePasswordChange} className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Password Saat Ini</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Password Baru</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <p className="text-gray-500 text-sm mt-1">
                            Minimal 8 karakter, harus mengandung huruf besar, kecil, angka, dan simbol
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Konfirmasi Password Baru</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {saving ? 'Mengubah...' : 'Ubah Password'}
                        </button>
                      </form>
                    )}
                  </div>

                  {profileData?.profile && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">📊 Informasi Akun</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                          <p className="font-medium">{
                            profileData.profile.joinDate ? 
                            new Date(profileData.profile.joinDate).toLocaleDateString('id-ID') : 'Tidak tersedia'
                          }</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Login Terakhir</p>
                          <p className="font-medium">{
                            profileData.profile.lastLogin ? 
                            new Date(profileData.profile.lastLogin).toLocaleString('id-ID') : 'Tidak tersedia'
                          }</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status Akun</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profileData.profile.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {profileData.profile.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Profile Completeness</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${profileData?.statistics?.profileCompleteness || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{profileData?.statistics?.profileCompleteness || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">🔔 Pengaturan Notifikasi</h3>
                    <button
                      onClick={() => handleSettingsUpdate('notifications', notificationSettings)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Simpan Pengaturan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">📢 Notifikasi Umum</h4>

                      <ToggleSwitch
                        checked={notificationSettings.emailNotifications}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked
                        })}
                        label="Email Notifications"
                        description="Terima notifikasi via email"
                      />

                      <ToggleSwitch
                        checked={notificationSettings.pushNotifications}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: checked
                        })}
                        label="Push Notifications"
                        description="Notifikasi browser/mobile"
                      />

                      <ToggleSwitch
                        checked={notificationSettings.smsNotifications}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: checked
                        })}
                        label="SMS Notifications"
                        description="Notifikasi via SMS"
                      />

                      <ToggleSwitch
                        checked={notificationSettings.reportDigest}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          reportDigest: checked
                        })}
                        label="Report Digest"
                        description="Ringkasan laporan mingguan"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">🌾 Notifikasi Pertanian</h4>

                      <ToggleSwitch
                        checked={notificationSettings.weatherAlerts}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          weatherAlerts: checked
                        })}
                        label="Weather Alerts"
                        description="Peringatan cuaca ekstrem"
                      />

                      <ToggleSwitch
                        checked={notificationSettings.satelliteUpdates}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          satelliteUpdates: checked
                        })}
                        label="Satellite Updates"
                        description="Update data satelit baru"
                      />

                      <ToggleSwitch
                        checked={notificationSettings.cropReminders}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          cropReminders: checked
                        })}
                        label="Crop Reminders"
                        description="Pengingat aktivitas tanaman"
                      />

                      <ToggleSwitch
                        checked={notificationSettings.marketingEmails}
                        onChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: checked
                        })}
                        label="Marketing Emails"
                        description="Info produk dan promosi"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">🛡️ Pengaturan Privasi</h3>
                    <button
                      onClick={() => handleSettingsUpdate('privacy', privacySettings)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Simpan Pengaturan
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">👁️ Visibilitas Profil</h4>
                      <div className="space-y-3">
                        {[
                          { value: 'public', label: 'Public', desc: 'Profil dapat dilihat siapa saja' },
                          { value: 'organization', label: 'Organization Only', desc: 'Hanya anggota organisasi' },
                          { value: 'private', label: 'Private', desc: 'Hanya Anda yang dapat melihat' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option.value}
                              checked={privacySettings.profileVisibility === option.value}
                              onChange={(e) => setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value
                              })}
                              className="text-blue-600"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{option.label}</p>
                              <p className="text-sm text-gray-600">{option.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <ToggleSwitch
                        checked={privacySettings.dataSharing}
                        onChange={(checked) => setPrivacySettings({
                          ...privacySettings,
                          dataSharing: checked
                        })}
                        label="Data Sharing"
                        description="Berbagi data dengan mitra penelitian"
                      />

                      <ToggleSwitch
                        checked={privacySettings.analyticsOptIn}
                        onChange={(checked) => setPrivacySettings({
                          ...privacySettings,
                          analyticsOptIn: checked
                        })}
                        label="Analytics Opt-in"
                        description="Membantu meningkatkan layanan"
                      />

                      <ToggleSwitch
                        checked={privacySettings.locationTracking}
                        onChange={(checked) => setPrivacySettings({
                          ...privacySettings,
                          locationTracking: checked
                        })}
                        label="Location Tracking"
                        description="Lacak lokasi untuk fitur berbasis lokasi"
                      />

                      <ToggleSwitch
                        checked={privacySettings.activityLog}
                        onChange={(checked) => setPrivacySettings({
                          ...privacySettings,
                          activityLog: checked
                        })}
                        label="Activity Logging"
                        description="Simpan log aktivitas untuk analisis"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">⚙️ Preferensi Sistem</h3>
                    <button
                      onClick={() => handleSettingsUpdate('preferences', systemPreferences)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Simpan Pengaturan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Bahasa</label>
                        <select
                          value={systemPreferences.language}
                          onChange={(e) => setSystemPreferences({
                            ...systemPreferences,
                            language: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="id">Bahasa Indonesia</option>
                          <option value="en">English</option>
                          <option value="jv">Bahasa Jawa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Zona Waktu</label>
                        <select
                          value={systemPreferences.timezone}
                          onChange={(e) => setSystemPreferences({
                            ...systemPreferences,
                            timezone: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Asia/Jakarta">WIB (UTC+7)</option>
                          <option value="Asia/Makassar">WITA (UTC+8)</option>
                          <option value="Asia/Jayapura">WIT (UTC+9)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Format Tanggal</label>
                        <select
                          value={systemPreferences.dateFormat}
                          onChange={(e) => setSystemPreferences({
                            ...systemPreferences,
                            dateFormat: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Unit Suhu</label>
                        <select
                          value={systemPreferences.temperatureUnit}
                          onChange={(e) => setSystemPreferences({
                            ...systemPreferences,
                            temperatureUnit: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="celsius">Celsius (°C)</option>
                          <option value="fahrenheit">Fahrenheit (°F)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Tema</label>
                        <select
                          value={systemPreferences.theme}
                          onChange={(e) => setSystemPreferences({
                            ...systemPreferences,
                            theme: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto (System)</option>
                        </select>
                      </div>

                      <div className="pt-4">
                        <ToggleSwitch
                          checked={systemPreferences.autoSave}
                          onChange={(checked) => setSystemPreferences({
                            ...systemPreferences,
                            autoSave: checked
                          })}
                          label="Auto Save"
                          description="Simpan perubahan secara otomatis"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Manajemen Data</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📥</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Export Data</h4>
                          <p className="text-sm text-gray-600">Download semua data Anda</p>
                        </div>
                      </div>
                      <button
                        onClick={exportUserData}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📤 Export All Data
                      </button>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🗑️</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Clear Cache</h4>
                          <p className="text-sm text-gray-600">Hapus data cache lokal</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.removeItem('cached_dashboard_data');
                          localStorage.removeItem('cached_crop_data');
                          localStorage.removeItem('cached_supply_data');
                          showMessage('success', 'Cache berhasil dihapus!');
                        }}
                        className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        🧹 Clear Cache
                      </button>
                    </div>
                  </div>

                  {profileData?.statistics && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">📈 Data Usage Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {profileData.statistics.dataUsage?.storageUsed || '0 GB'}
                          </div>
                          <div className="text-sm text-gray-600">Storage Used</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {profileData.statistics.dataUsage?.apiCalls || 0}
                          </div>
                          <div className="text-sm text-gray-600">API Calls</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {profileData.statistics.dataUsage?.reportsGenerated || 0}
                          </div>
                          <div className="text-sm text-gray-600">Reports</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {profileData.statistics.dataUsage?.daysActive || 0}
                          </div>
                          <div className="text-sm text-gray-600">Days Active</div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Activity Summary</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Last login:</span>
                            <span>{profileData.profile.lastLogin ? 
                              new Date(profileData.profile.lastLogin).toLocaleString('id-ID') : 'Never'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Profile updated:</span>
                            <span>{profileData.profile.lastUpdated ? 
                              new Date(profileData.profile.lastUpdated).toLocaleDateString('id-ID') : 'Never'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Account created:</span>
                            <span>{profileData.profile.joinDate ? 
                              new Date(profileData.profile.joinDate).toLocaleDateString('id-ID') : 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total logins:</span>
                            <span>{profileData.statistics.totalLogins || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ProfilePage);