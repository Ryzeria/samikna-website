import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiLogout, HiCog } from 'react-icons/hi';
import { FaSatellite, FaLeaf } from 'react-icons/fa';

function NavItem({ item, isActive, darkMode, onClick }) {
  const dm = darkMode;
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
        isActive
          ? `${dm ? 'bg-blue-900 text-blue-300' : 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-700'} border-l-4 border-blue-500 shadow-sm`
          : `${dm ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
        isActive
          ? 'bg-blue-500 text-white'
          : `${dm ? 'bg-gray-700 text-gray-400 group-hover:bg-gray-600' : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'}`
      }`}>
        <item.icon className="w-4 h-4" />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium">{item.name}</div>
        <div className={`text-xs opacity-75 ${dm ? 'text-gray-400' : ''}`}>{item.description}</div>
      </div>
      {item.badge && (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          item.badge === 'Live' ? 'bg-red-100 text-red-600' :
          item.badge === 'AI'   ? 'bg-purple-100 text-purple-600' :
                                  'bg-blue-100 text-blue-600'
        }`}>
          {item.badge}
        </span>
      )}
      {isActive && (
        <motion.div layoutId="activeIndicator" className="w-1 h-6 bg-blue-500 rounded-full" />
      )}
    </motion.button>
  );
}

function Sidebar({ darkMode, sidebarOpen, setSidebarOpen, navigationItems, currentPath, user, handleLogout, onNavigate }) {
  const dm = darkMode;
  const initial = user?.kabupaten?.charAt(0)?.toUpperCase() || 'U';

  const BottomActions = ({ onSettingsClick, onLogoutClick }) => (
    <div className={`px-3 py-4 border-t ${dm ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
      <button
        onClick={onSettingsClick}
        className={`w-full flex items-center px-4 py-3 text-sm font-medium ${dm ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-xl transition-colors`}
      >
        <div className={`w-8 h-8 ${dm ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center mr-3`}>
          <HiCog className="w-4 h-4" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium">Settings</div>
          <div className={`text-xs opacity-75 ${dm ? 'text-gray-400' : ''}`}>Preferences</div>
        </div>
      </button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogoutClick}
        className={`w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 ${dm ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-xl transition-colors`}
      >
        <div className={`w-8 h-8 ${dm ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center mr-3`}>
          <HiLogout className="w-4 h-4" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium">Logout</div>
          <div className={`text-xs opacity-75 ${dm ? 'text-red-400' : ''}`}>Sign out</div>
        </div>
      </motion.button>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className={`flex min-h-0 flex-1 flex-col ${dm ? 'bg-gray-800' : 'bg-white'} border-r ${dm ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>

          {/* Logo */}
          <div className={`flex items-center px-6 py-6 border-b ${dm ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="relative">
              <FaSatellite className="h-8 w-8 text-blue-600" />
              <FaLeaf className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
            </div>
            <div className="ml-3">
              <h2 className={`text-xl font-bold ${dm ? 'text-white' : 'text-gray-800'}`}>SAMIKNA</h2>
              <p className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Agricultural Intelligence</p>
            </div>
          </div>

          {/* User info */}
          <div className={`px-6 py-4 border-b ${dm ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-green-50'}`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{initial}</span>
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-semibold capitalize truncate ${dm ? 'text-white' : 'text-gray-900'}`}>
                  {user?.kabupaten ? `Kabupaten ${user.kabupaten}` : 'User'}
                </p>
                <p className={`text-xs ${dm ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user?.position || 'Administrator'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className={`text-xs ${dm ? 'text-green-400' : 'text-green-600'}`}>Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={currentPath === item.href}
                darkMode={dm}
                onClick={item.onClick}
              />
            ))}
          </nav>

          {/* System status */}
          <div className={`px-6 py-4 border-t ${dm ? 'border-gray-700 bg-gray-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="space-y-2">
              {[
                { label: 'Satelit Status', color: 'green', text: 'Online' },
                { label: 'Data Sync', color: 'blue', text: 'Active', pulse: true },
                { label: 'Weather API', color: 'green', text: 'Connected' },
              ].map(({ label, color, text, pulse }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{label}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 bg-${color}-500 rounded-full${pulse ? ' animate-pulse' : ''}`} />
                    <span className={`text-${color}-600 font-medium`}>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BottomActions
            onSettingsClick={() => onNavigate('/dashboard/profile')}
            onLogoutClick={handleLogout}
          />
        </div>
      </div>

      {/* Mobile sidebar panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 40 }}
        className={`fixed inset-y-0 left-0 z-50 w-72 ${dm ? 'bg-gray-800' : 'bg-white'} shadow-xl lg:hidden`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Mobile header */}
          <div className={`flex items-center justify-between px-6 py-6 border-b ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <div className="relative">
                <FaSatellite className="h-8 w-8 text-blue-600" />
                <FaLeaf className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
              </div>
              <div className="ml-3">
                <h2 className={`text-xl font-bold ${dm ? 'text-white' : 'text-gray-800'}`}>SAMIKNA</h2>
                <p className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Agricultural Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 ${dm ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} rounded-lg hover:bg-gray-100`}
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => { item.onClick(); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? `${dm ? 'bg-blue-900 text-blue-300' : 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-700'}`
                      : `${dm ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isActive ? 'bg-blue-500 text-white' : `${dm ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs opacity-75 ${dm ? 'text-gray-400' : ''}`}>{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          <BottomActions
            onSettingsClick={() => { onNavigate('/dashboard/profile'); setSidebarOpen(false); }}
            onLogoutClick={handleLogout}
          />
        </div>
      </motion.div>
    </>
  );
}

export default memo(Sidebar);
