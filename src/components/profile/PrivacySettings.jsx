import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Profil dapat dilihat siapa saja' },
  { value: 'organization', label: 'Organization Only', desc: 'Hanya anggota organisasi' },
  { value: 'private', label: 'Private', desc: 'Hanya Anda yang dapat melihat' },
];

export default function PrivacySettings({ settings, setSettings, onSave }) {
  const set = (key) => (val) => setSettings({ ...settings, [key]: val });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">🛡️ Pengaturan Privasi</h3>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan Pengaturan
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">👁️ Visibilitas Profil</h4>
          <div className="space-y-3">
            {VISIBILITY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={opt.value}
                  checked={settings.profileVisibility === opt.value}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  className="text-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900">{opt.label}</p>
                  <p className="text-sm text-gray-600">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSwitch checked={settings.dataSharing} onChange={set('dataSharing')} label="Data Sharing" description="Berbagi data dengan mitra penelitian" />
          <ToggleSwitch checked={settings.analyticsOptIn} onChange={set('analyticsOptIn')} label="Analytics Opt-in" description="Membantu meningkatkan layanan" />
          <ToggleSwitch checked={settings.locationTracking} onChange={set('locationTracking')} label="Location Tracking" description="Lacak lokasi untuk fitur berbasis lokasi" />
          <ToggleSwitch checked={settings.activityLog} onChange={set('activityLog')} label="Activity Logging" description="Simpan log aktivitas untuk analisis" />
        </div>
      </div>
    </div>
  );
}
