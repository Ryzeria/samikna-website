import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiHome, HiMap, HiChat, HiDocumentReport, HiUser,
  HiMenu, HiX, HiLogout, HiBell, HiSearch, HiCog,
  HiClipboardList, HiTruck
} from 'react-icons/hi';
import { FaLeaf, FaSeedling, FaRobot, FaSatellite } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HiHome,
      description: 'Overview & Analytics'
    },
    { 
      name: 'Peta Satelit', 
      href: '/dashboard/maps', 
      icon: FaSatellite,
      description: 'Remote Sensing Maps'
    },
    { 
      name: 'Manajemen Tanaman', 
      href: '/dashboard/crop-management', 
      icon: FaSeedling,
      description: 'Crop Activities'
    },
    { 
      name: 'Supply Chain', 
      href: '/dashboard/supply-chain', 
      icon: HiTruck,
      description: 'Logistik & Rantai Pasok'
    },
    { 
      name: 'AI Chatbot', 
      href: '/dashboard/chatbot', 
      icon: FaRobot,
      description: 'Assistant Pertanian'
    },
    { 
      name: 'Laporan', 
      href: '/dashboard/reports', 
      icon: HiDocumentReport,
      description: 'Reports & Analytics'
    },
    { 
      name: 'Profil', 
      href: '/dashboard/profile', 
      icon: HiUser,
      description: 'Account Settings'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('samikna_token');
    localStorage.removeItem('samikna_user');
    sessionStorage.removeItem('samikna_token');
    sessionStorage.removeItem('samikna_user');
    router.push('/login');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
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

      {/* Desktop Sidebar - Always Visible */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200 bg-white">
            <div className="relative">
              <FaSatellite className="h-8 w-8 text-blue-600" />
              <FaLeaf className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold text-gray-800">SAMIKNA</h2>
              <p className="text-xs text-gray-500">Agricultural Platform</p>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {user?.kabupaten ? `Kabupaten ${user.kabupaten}` : 'User'}
                </p>
                <p className="text-xs text-gray-600">{user?.position || 'Administrator'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const isActive = router.pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 border-l-4 border-blue-500 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-6 bg-blue-500 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Satelit Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Data Sync</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Weather API</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="px-3 py-4 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                <HiCog className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Pengaturan</div>
                <div className="text-xs opacity-75">System Settings</div>
              </div>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <HiLogout className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Logout</div>
                <div className="text-xs opacity-75">Sign out account</div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 40 }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Mobile Logo with Close Button */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="relative">
                <FaSatellite className="h-8 w-8 text-blue-600" />
                <FaLeaf className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold text-gray-800">SAMIKNA</h2>
                <p className="text-xs text-gray-500">Agricultural Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile User Info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {user?.kabupaten ? `Kabupaten ${user.kabupaten}` : 'User'}
                </p>
                <p className="text-xs text-gray-600">{user?.position || 'Administrator'}</p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const isActive = router.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Mobile Bottom Actions */}
          <div className="px-3 py-4 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <HiCog className="w-4 h-4 mr-3" />
              Pengaturan
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <HiLogout className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Mobile menu button & Search */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-4"
              >
                <HiMenu className="h-6 w-6" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari data satelit, laporan, atau aktivitas..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Quick Actions */}
              <div className="hidden lg:flex items-center space-x-2">
                <button
                  onClick={() => router.push('/dashboard/maps')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Lihat Peta Satelit"
                >
                  <FaSatellite className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/dashboard/chatbot')}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="AI Assistant"
                >
                  <FaRobot className="w-4 h-4" />
                </button>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiBell className="h-5 w-5" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {user?.kabupaten || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.department || 'Dinas Pertanian'}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <span className="text-white font-bold text-sm">
                    {user?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Dashboard</span>
            {router.pathname !== '/dashboard' && (
              <>
                <span>/</span>
                <span className="capitalize text-gray-900">
                  {router.pathname.split('/').pop()?.replace('-', ' ')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6 bg-gray-50 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <div className="flex items-center space-x-2">
                <FaSatellite className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">SAMIKNA Platform v2.0</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>Data terakhir:</span>
                <span className="text-green-600 font-medium">
                  {new Date().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>© 2024 SAMIKNA. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;