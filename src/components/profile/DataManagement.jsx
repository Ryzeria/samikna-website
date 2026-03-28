import React from 'react';

export default function DataManagement({ profileData, notificationSettings, privacySettings, systemPreferences, user, onExport, onClearCache }) {
  const statistics = profileData?.statistics;
  const profile = profileData?.profile;

  return (
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
            onClick={onExport}
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
            onClick={onClearCache}
            className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            🧹 Clear Cache
          </button>
        </div>
      </div>

      {statistics && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">📈 Data Usage Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: statistics.dataUsage?.storageUsed || '0 MB', label: 'Storage Used', color: 'blue' },
              { value: statistics.dataUsage?.apiCalls || 0, label: 'API Calls', color: 'green' },
              { value: statistics.dataUsage?.reportsGenerated || 0, label: 'Reports', color: 'purple' },
              { value: statistics.dataUsage?.daysActive || 0, label: 'Days Active', color: 'orange' },
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center p-4 bg-white rounded-lg">
                <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Activity Summary</h5>
            <div className="text-sm text-gray-600 space-y-1">
              {[
                ['Last login', profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString('id-ID') : 'Never'],
                ['Profile updated', profile?.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString('id-ID') : 'Never'],
                ['Account created', profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('id-ID') : 'Unknown'],
                ['Total logins', statistics.totalLogins || 0],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span>{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
