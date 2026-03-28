import React from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function NotificationSettings({ settings, setSettings, onSave }) {
  const set = (key) => (val) => setSettings({ ...settings, [key]: val });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">🔔 Pengaturan Notifikasi</h3>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan Pengaturan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">📢 Notifikasi Umum</h4>
          <ToggleSwitch checked={settings.emailNotifications} onChange={set('emailNotifications')} label="Email Notifications" description="Terima notifikasi via email" />
          <ToggleSwitch checked={settings.pushNotifications} onChange={set('pushNotifications')} label="Push Notifications" description="Notifikasi browser/mobile" />
          <ToggleSwitch checked={settings.smsNotifications} onChange={set('smsNotifications')} label="SMS Notifications" description="Notifikasi via SMS" />
          <ToggleSwitch checked={settings.reportDigest} onChange={set('reportDigest')} label="Report Digest" description="Ringkasan laporan mingguan" />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">🌾 Notifikasi Pertanian</h4>
          <ToggleSwitch checked={settings.weatherAlerts} onChange={set('weatherAlerts')} label="Weather Alerts" description="Peringatan cuaca ekstrem" />
          <ToggleSwitch checked={settings.satelliteUpdates} onChange={set('satelliteUpdates')} label="Satellite Updates" description="Update data satelit baru" />
          <ToggleSwitch checked={settings.cropReminders} onChange={set('cropReminders')} label="Crop Reminders" description="Pengingat aktivitas tanaman" />
          <ToggleSwitch checked={settings.marketingEmails} onChange={set('marketingEmails')} label="Marketing Emails" description="Info produk dan promosi" />
        </div>
      </div>
    </div>
  );
}
