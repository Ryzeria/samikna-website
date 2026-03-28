import React from 'react';
import SafeImage from '../ui/SafeImage';

export default function ProfileHeader({ profileData, profileImage, onImageUpload }) {
  const profile = profileData?.profile;
  const statistics = profileData?.statistics;
  const initial = profile?.kabupaten?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-4 right-4 opacity-20">
        <div className="w-20 h-20 text-6xl">🛰️</div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white/30">
              {profileImage ? (
                <SafeImage src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{initial}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-110">
              <span className="text-sm">📷</span>
              <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
            </label>
          </div>

          {/* User info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {profile?.fullName || profile?.kabupaten || 'Administrator'}
            </h1>
            <p className="text-blue-100 mb-1">{profile?.position || 'Agricultural Administrator'}</p>
            <p className="text-blue-200 text-sm">{profile?.department || 'Department of Agriculture'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm justify-center md:justify-start">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Active</span>
              </div>
              <span>🌱 Agricultural Tech</span>
              <span>📍 {profile?.kabupaten || 'Indonesia'}</span>
            </div>
          </div>

          {/* Quick stats */}
          {statistics && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{statistics.accountAge || 0}</div>
                <div className="text-blue-100 text-sm">Days</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{statistics.profileCompleteness || 0}%</div>
                <div className="text-blue-100 text-sm">Complete</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{statistics.dataUsage?.daysActive || 0}</div>
                <div className="text-blue-100 text-sm">Active</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
