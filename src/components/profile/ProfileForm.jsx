import React from 'react';

export default function ProfileForm({ profileData, formData, setFormData, saving, onSubmit, onReset }) {
  const profile = profileData?.profile;
  const field = (key, label, type = 'text', extra = {}) => (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        type={type}
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...extra}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">👤 Informasi Profil</h3>
        <div className="text-sm text-gray-500">
          Last updated:{' '}
          {profile?.lastUpdated
            ? new Date(profile.lastUpdated).toLocaleDateString('id-ID')
            : 'Never'}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">👤 Informasi Dasar</h4>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                value={profile?.username || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-gray-500 text-sm mt-1">Username tidak dapat diubah</p>
            </div>

            {field('fullName', 'Nama Lengkap *', 'text', { required: true })}
            {field('email', '📧 Email *', 'email', { required: true })}
            {field('phone', '📞 Nomor Telepon', 'tel', { placeholder: '+62 812 3456 7890' })}
          </div>

          {/* Professional info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">🏢 Informasi Profesi</h4>

            <div>
              <label className="block text-gray-700 font-medium mb-2">📍 Kabupaten</label>
              <input
                type="text"
                value={profile?.kabupaten || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
              />
            </div>

            {field('position', 'Jabatan')}
            {field('department', 'Departemen')}
            {field('website', '🌐 Website', 'url', { placeholder: 'https://example.com' })}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">📍 Alamat</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Alamat lengkap kantor atau tempat tinggal"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">✏️ Bio / Deskripsi</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
            onClick={onReset}
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Menyimpan...
              </>
            ) : (
              '💾 Simpan Perubahan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
