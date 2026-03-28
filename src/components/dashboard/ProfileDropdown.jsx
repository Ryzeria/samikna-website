import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiDownload } from 'react-icons/hi';
import { FaShieldAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';

function ProfileDropdown({ user, darkMode, show, onToggle, onClose, onNavigate, onLogout }) {
  const dm = darkMode;
  const initial = user?.kabupaten?.charAt(0)?.toUpperCase() || 'U';

  const navigate = (path) => { onNavigate(path); onClose(); };

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className="hidden md:block text-right">
          <p className={`text-sm font-medium capitalize ${dm ? 'text-white' : 'text-gray-900'}`}>
            {user?.kabupaten || 'User'}
          </p>
          <p className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.department || 'Dinas Pertanian'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onToggle}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
        >
          <span className="text-white font-bold text-sm">{initial}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 mt-2 w-64 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border z-50`}
          >
            <div className={`p-4 border-b ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{initial}</span>
                </div>
                <div>
                  <p className={`font-medium ${dm ? 'text-white' : 'text-gray-900'}`}>
                    {user?.fullName || user?.kabupaten || 'Administrator'}
                  </p>
                  <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user?.email || 'admin@samikna.id'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {[
                { icon: HiUser, label: 'My Profile', path: '/dashboard/profile' },
                { icon: FaShieldAlt, label: 'Security Settings', path: '/dashboard/profile?tab=security' },
                { icon: FaBell, label: 'Notification Settings', path: '/dashboard/profile?tab=notifications' },
                { icon: HiDownload, label: 'Export Data', path: '/dashboard/reports' },
              ].map(({ icon: Icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    dm ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}

              <hr className={`my-2 ${dm ? 'border-gray-700' : 'border-gray-200'}`} />

              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProfileDropdown);
