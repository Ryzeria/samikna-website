import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth, useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/apiClient';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileForm from '../../components/profile/ProfileForm';
import SecurityTab from '../../components/profile/SecurityTab';
import NotificationSettings from '../../components/profile/NotificationSettings';
import PrivacySettings from '../../components/profile/PrivacySettings';
import SystemPreferences from '../../components/profile/SystemPreferences';
import DataManagement from '../../components/profile/DataManagement';

const TABS = [
  { id: 'profile',       label: 'Profile Information' },
  { id: 'security',      label: 'Security & Password' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy',       label: 'Privacy Settings' },
  { id: 'preferences',   label: 'System Preferences' },
  { id: 'data',          label: 'Data Management' },
];

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', position: '',
    department: '', address: '', bio: '', website: '', organization: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true, pushNotifications: true, weatherAlerts: true,
    satelliteUpdates: true, cropReminders: true, reportDigest: false,
    marketingEmails: false, smsNotifications: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private', dataSharing: false, analyticsOptIn: true,
    locationTracking: false, activityLog: true
  });

  const [systemPreferences, setSystemPreferences] = useState({
    language: 'id', timezone: 'Asia/Jakarta', dateFormat: 'DD/MM/YYYY',
    temperatureUnit: 'celsius', theme: 'light', autoSave: true
  });

  useEffect(() => {
    if (user?.id) {
      loadProfileData(user.id);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadProfileData = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiFetch(`/api/profile?userId=${userId}&type=profile`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to fetch profile data');
      }

      const { profile, settings } = result.data;
      setProfileData(result.data);
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
      if (settings?.notifications) setNotificationSettings((p) => ({ ...p, ...settings.notifications }));
      if (settings?.privacy) setPrivacySettings((p) => ({ ...p, ...settings.privacy }));
      if (settings?.preferences) setSystemPreferences((p) => ({ ...p, ...settings.preferences }));
      setProfileImage(profile.profileImage);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/api/profile?userId=${user.id}&type=profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
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
      const result = await res.json();
      if (res.ok && result.success) {
        await refreshUser();
        await loadProfileData(user.id);
        showMsg('success', 'Profile berhasil diupdate!');
      } else {
        showMsg('error', result.error?.message || 'Gagal mengupdate profile');
      }
    } catch {
      showMsg('error', 'Gagal mengupdate profile. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showMsg('error', 'Password baru dan konfirmasi tidak cocok!');
    }
    setSaving(true);
    try {
      const res = await apiFetch(`/api/profile?userId=${user.id}&type=password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordChange(false);
        showMsg('success', 'Password berhasil diubah!');
      } else {
        showMsg('error', result.error?.message || 'Gagal mengubah password!');
      }
    } catch {
      showMsg('error', 'Gagal mengubah password!');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsUpdate = async (settingType, settings) => {
    try {
      const res = await apiFetch(`/api/profile?userId=${user.id}&type=settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingType, settings }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showMsg('success', `Pengaturan ${settingType} berhasil disimpan!`);
      } else {
        showMsg('error', result.error?.message || 'Gagal menyimpan pengaturan!');
      }
    } catch {
      showMsg('error', 'Gagal menyimpan pengaturan!');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showMsg('error', 'Ukuran file maksimal 5MB!');
    if (!file.type.startsWith('image/')) return showMsg('error', 'File harus berupa gambar!');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target.result);
      showMsg('success', 'Foto profile berhasil diupload!');
    };
    reader.readAsDataURL(file);
  };

  const exportUserData = () => {
    try {
      const data = {
        profile: profileData?.profile || {},
        settings: { notifications: notificationSettings, privacy: privacySettings, preferences: systemPreferences },
        statistics: profileData?.statistics || {},
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SAMIKNA_UserData_${user?.username}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMsg('success', 'Data berhasil diekspor!');
    } catch {
      showMsg('error', 'Gagal mengekspor data!');
    }
  };

  const clearCache = () => {
    ['cached_dashboard_data', 'cached_crop_data', 'cached_supply_data'].forEach((k) =>
      localStorage.removeItem(k)
    );
    showMsg('success', 'Cache berhasil dihapus!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Loading profile data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <ProfileHeader
            profileData={profileData}
            profileImage={profileImage}
            onImageUpload={handleImageUpload}
          />

          {/* Status message */}
          {message.content && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <span>{message.type === 'success' ? '✅' : '❌'}</span>
              {message.content}
            </motion.div>
          )}

          {/* Stale-data warning */}
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

          {/* Main card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab nav */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto px-6">
                {TABS.map((tab) => (
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

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <ProfileForm
                  profileData={profileData}
                  formData={formData}
                  setFormData={setFormData}
                  saving={saving}
                  onSubmit={handleProfileUpdate}
                  onReset={() => user && loadProfileData(user.id)}
                />
              )}

              {activeTab === 'security' && (
                <SecurityTab
                  profileData={profileData}
                  passwordData={passwordData}
                  setPasswordData={setPasswordData}
                  saving={saving}
                  showPasswordChange={showPasswordChange}
                  setShowPasswordChange={setShowPasswordChange}
                  onSubmit={handlePasswordChange}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationSettings
                  settings={notificationSettings}
                  setSettings={setNotificationSettings}
                  onSave={() => handleSettingsUpdate('notifications', notificationSettings)}
                />
              )}

              {activeTab === 'privacy' && (
                <PrivacySettings
                  settings={privacySettings}
                  setSettings={setPrivacySettings}
                  onSave={() => handleSettingsUpdate('privacy', privacySettings)}
                />
              )}

              {activeTab === 'preferences' && (
                <SystemPreferences
                  preferences={systemPreferences}
                  setPreferences={setSystemPreferences}
                  onSave={() => handleSettingsUpdate('preferences', systemPreferences)}
                />
              )}

              {activeTab === 'data' && (
                <DataManagement
                  profileData={profileData}
                  notificationSettings={notificationSettings}
                  privacySettings={privacySettings}
                  systemPreferences={systemPreferences}
                  user={user}
                  onExport={exportUserData}
                  onClearCache={clearCache}
                />
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ProfilePage);
