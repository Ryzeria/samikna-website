import React from 'react';

export default function SecurityTab({ profileData, passwordData, setPasswordData, saving, showPasswordChange, setShowPasswordChange, onSubmit }) {
  const profile = profileData?.profile;
  const statistics = profileData?.statistics;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">🔒 Keamanan & Password</h3>

      {/* Password change section */}
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
          <form onSubmit={onSubmit} className="space-y-4 mt-4 pt-4 border-t border-gray-200">
            {[
              { key: 'currentPassword', label: 'Password Saat Ini' },
              { key: 'newPassword', label: 'Password Baru' },
              { key: 'confirmPassword', label: 'Konfirmasi Password Baru' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-gray-700 font-medium mb-2">{label}</label>
                <input
                  type="password"
                  value={passwordData[key]}
                  onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {key === 'newPassword' && (
                  <p className="text-gray-500 text-sm mt-1">
                    Minimal 8 karakter, harus mengandung huruf besar, kecil, angka, dan simbol
                  </p>
                )}
              </div>
            ))}
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

      {/* Account info */}
      {profile && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">📊 Informasi Akun</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tanggal Bergabung</p>
              <p className="font-medium">
                {profile.joinDate
                  ? new Date(profile.joinDate).toLocaleDateString('id-ID')
                  : 'Tidak tersedia'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Login Terakhir</p>
              <p className="font-medium">
                {profile.lastLogin
                  ? new Date(profile.lastLogin).toLocaleString('id-ID')
                  : 'Tidak tersedia'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status Akun</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profile.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Profile Completeness</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${statistics?.profileCompleteness || 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{statistics?.profileCompleteness || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
