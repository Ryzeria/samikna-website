import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiHome, HiMap, HiChat, HiDocumentReport, HiUser, HiMenu, HiX, 
  HiLogout, HiBell, HiSearch, HiCog, HiClipboardList, HiTruck,
  HiRefresh, HiDownload, HiEye, HiSun, HiMoon, HiGlobe,
  HiInformationCircle, HiSupport, HiQuestionMarkCircle
} from 'react-icons/hi';
import { 
  FaLeaf, FaSeedling, FaRobot, FaSatellite, FaCloud, FaTractor,
  FaChartLine, FaMapMarkedAlt, FaFileAlt, FaUsers, FaCog,
  FaShieldAlt, FaBell, FaLanguage, FaSignOutAlt
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    satellite: 'connected',
    weather: 'connected',
    ai: 'online'
  });

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

    // Load theme preference
    const savedTheme = localStorage.getItem('samikna_theme');
    setDarkMode(savedTheme === 'dark');

    // Simulate real-time system monitoring
    const statusInterval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));
    }, 30000);

    return () => clearInterval(statusInterval);
  }, []);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HiHome,
      description: 'Overview & Analytics',
      badge: null,
      onClick: () => router.push('/dashboard')
    },
    { 
      name: 'Peta Satelit', 
      href: '/dashboard/maps', 
      icon: FaSatellite,
      description: 'Remote Sensing Maps',
      badge: 'Live',
      onClick: () => router.push('/dashboard/maps')
    },
    { 
      name: 'Manajemen Tanaman', 
      href: '/dashboard/crop-management', 
      icon: FaSeedling,
      description: 'Crop Activities',
      badge: '12',
      onClick: () => router.push('/dashboard/crop-management')
    },
    { 
      name: 'Supply Chain', 
      href: '/dashboard/supply-chain', 
      icon: HiTruck,
      description: 'Logistik & Rantai Pasok',
      badge: null,
      onClick: () => router.push('/dashboard/supply-chain')
    },
    { 
      name: 'AI Chatbot', 
      href: '/dashboard/chatbot', 
      icon: FaRobot,
      description: 'Assistant Pertanian',
      badge: 'AI',
      onClick: () => router.push('/dashboard/chatbot')
    },
    { 
      name: 'Laporan', 
      href: '/dashboard/reports', 
      icon: HiDocumentReport,
      description: 'Reports & Analytics',
      badge: null,
      onClick: () => router.push('/dashboard/reports')
    },
    { 
      name: 'Profil', 
      href: '/dashboard/profile', 
      icon: HiUser,
      description: 'Account Settings',
      badge: null,
      onClick: () => router.push('/dashboard/profile')
    }
  ];

  const quickActions = [
    {
      name: 'Generate Report',
      icon: HiDocumentReport,
      color: 'blue',
      onClick: () => router.push('/dashboard/reports')
    },
    {
      name: 'View Satellite',
      icon: FaSatellite,
      color: 'green',
      onClick: () => router.push('/dashboard/maps')
    },
    {
      name: 'Ask AI',
      icon: FaRobot,
      color: 'purple',
      onClick: () => router.push('/dashboard/chatbot')
    },
    {
      name: 'Add Activity',
      icon: HiClipboardList,
      color: 'orange',
      onClick: () => router.push('/dashboard/crop-management')
    }
  ];

  const notificationItems = [
    {
      id: 1,
      type: 'weather',
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in 2 hours',
      time: '5 min ago',
      urgent: true
    },
    {
      id: 2,
      type: 'system',
      title: 'Data Sync Complete',
      message: 'Satellite data updated successfully',
      time: '15 min ago',
      urgent: false
    },
    {
      id: 3,
      type: 'crop',
      title: 'Crop Health Alert',
      message: 'NDVI decrease detected in Sector C-7',
      time: '1 hour ago',
      urgent: false
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('samikna_token');
    localStorage.removeItem('samikna_user');
    sessionStorage.removeItem('samikna_token');
    sessionStorage.removeItem('samikna_user');
    router.push('/login');
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('samikna_theme', newTheme ? 'dark' : 'light');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'weather': return FaCloud;
      case 'system': return FaCog;
      case 'crop': return FaLeaf;
      default: return HiBell;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SAMIKNA Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className={`flex min-h-0 flex-1 flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
          
          {/* Logo Section */}
          <div className={`flex items-center px-6 py-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="relative">
              <FaSatellite className="h-8 w-8 text-blue-600" />
              <FaLeaf className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
            </div>
            <div className="ml-3">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>SAMIKNA</h2>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agricultural Intelligence</p>
            </div>
          </div>

          {/* User Info Section */}
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-green-50'}`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} capitalize truncate`}>
                  {user?.kabupaten ? `Kabupaten ${user.kabupaten}` : 'User'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user?.position || 'Administrator'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const isActive = router.pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.onClick}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group ${
                    isActive
                      ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-700'} border-l-4 border-blue-500 shadow-sm`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : `${darkMode ? 'bg-gray-700 text-gray-400 group-hover:bg-gray-600' : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'}`
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs opacity-75 ${darkMode ? 'text-gray-400' : ''}`}>{item.description}</div>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.badge === 'Live' ? 'bg-red-100 text-red-600' :
                      item.badge === 'AI' ? 'bg-purple-100 text-purple-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
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

          {/* System Status Section */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`${darkMode ? 'text-gray-600' : 'text-gray-600'}`}>Satelit Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`${darkMode ? 'text-gray-600' : 'text-gray-600'}`}>Data Sync</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`${darkMode ? 'text-gray-600' : 'text-gray-600'}`}>Weather API</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className={`px-3 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
            <button 
              onClick={() => router.push('/dashboard/profile')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-xl transition-colors`}
            >
              <div className={`w-8 h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center mr-3`}>
                <HiCog className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Settings</div>
                <div className={`text-xs opacity-75 ${darkMode ? 'text-gray-400' : ''}`}>Preferences</div>
              </div>
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 ${darkMode ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-xl transition-colors`}
            >
              <div className={`w-8 h-8 ${darkMode ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center mr-3`}>
                <HiLogout className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Logout</div>
                <div className={`text-xs opacity-75 ${darkMode ? 'text-red-400' : ''}`}>Sign out</div>
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
        className={`fixed inset-y-0 left-0 z-50 w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl lg:hidden`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          
          {/* Mobile Header */}
          <div className={`flex items-center justify-between px-6 py-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <div className="relative">
                <FaSatellite className="h-8 w-8 text-blue-600" />
                <FaLeaf className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
              </div>
              <div className="ml-3">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>SAMIKNA</h2>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agricultural Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} rounded-lg hover:bg-gray-100`}
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const isActive = router.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-700'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs opacity-75 ${darkMode ? 'text-gray-400' : ''}`}>{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Mobile Bottom Actions */}
          <div className={`px-3 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
            <button 
              onClick={() => router.push('/dashboard/profile')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:bg-gray-100 rounded-xl transition-colors`}
            >
              <HiCog className="w-4 h-4 mr-3" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 ${darkMode ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-xl transition-colors`}
            >
              <HiLogout className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        
        {/* Top Navigation Bar */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-4 lg:px-6 py-3 sticky top-0 z-40`}>
          <div className="flex items-center justify-between">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <HiMenu className="h-6 w-6" />
              </button>

              {/* Enhanced Search Bar */}
              <div className="hidden md:flex items-center">
                <form onSubmit={handleSearch} className="relative">
                  <HiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search data, reports, fields..."
                    className={`pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </form>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              </button>

              {/* Quick Action Buttons */}
              <div className="hidden lg:flex items-center space-x-2">
                <button
                  onClick={() => router.push('/dashboard/maps')}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  title="View Satellite Maps"
                >
                  <FaSatellite className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/dashboard/chatbot')}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:text-green-400 hover:bg-green-900' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
                  title="AI Assistant"
                >
                  <FaRobot className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/dashboard/reports')}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:text-purple-400 hover:bg-purple-900' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}
                  title="Generate Reports"
                >
                  <HiDocumentReport className="w-4 h-4" />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
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

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border z-50`}
                    >
                      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notificationItems.map((item) => {
                          const IconComponent = getNotificationIcon(item.type);
                          return (
                            <div key={item.id} className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  item.urgent 
                                    ? 'bg-red-100 text-red-600' 
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {item.title}
                                    </h4>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {item.time}
                                    </span>
                                  </div>
                                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {item.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className={`p-4 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                        >
                          View All Notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-right">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                      {user?.kabupaten || 'User'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.department || 'Dinas Pertanian'}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowProfile(!showProfile)}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                  >
                    <span className="text-white font-bold text-sm">
                      {user?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </motion.button>
                </div>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border z-50`}
                    >
                      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.kabupaten?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user?.fullName || user?.kabupaten || 'Administrator'}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user?.email || 'admin@samikna.id'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => {
                            router.push('/dashboard/profile');
                            setShowProfile(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <HiUser className="w-4 h-4" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            router.push('/dashboard/profile?tab=security');
                            setShowProfile(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FaShieldAlt className="w-4 h-4" />
                          Security Settings
                        </button>
                        <button
                          onClick={() => {
                            router.push('/dashboard/profile?tab=notifications');
                            setShowProfile(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FaBell className="w-4 h-4" />
                          Notification Settings
                        </button>
                        <button
                          onClick={() => {
                            router.push('/dashboard/reports');
                            setShowProfile(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <HiDownload className="w-4 h-4" />
                          Export Data
                        </button>
                        <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfile(false);
                          }}
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
            </div>
          </div>
        </header>

        {/* Enhanced Breadcrumb */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 lg:px-6 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => router.push('/dashboard')}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                Dashboard
              </button>
              {router.pathname !== '/dashboard' && (
                <>
                  <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>/</span>
                  <span className={`capitalize font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {router.pathname.split('/').pop()?.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Last updated: {new Date().toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <button
                onClick={() => window.location.reload()}
                className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                title="Refresh page"
              >
                <HiRefresh className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className={`p-4 lg:p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Enhanced Footer */}
        <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-4 lg:px-6 py-6`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <FaSatellite className="w-4 h-4 text-blue-600" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  SAMIKNA Platform v2.1.0
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Data source:</span>
                <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                  Google Earth Engine, BMKG, AI Analytics
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Coverage:</span>
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                  {user?.kabupaten || 'Indonesia'} Region
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className={`flex items-center space-x-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <button
                  onClick={() => router.push('/dashboard/profile?tab=data')}
                  className="hover:underline"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => router.push('/dashboard/chatbot')}
                  className="hover:underline"
                >
                  Support
                </button>
                <button
                  onClick={() => window.open('https://docs.samikna.id', '_blank')}
                  className="hover:underline"
                >
                  Documentation
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  © 2024 SAMIKNA Agricultural Intelligence
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Powered by Google Earth Engine • BMKG Weather Data • AI-Driven Agricultural Intelligence
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
              Platform optimized for precision agriculture and sustainable farming practices
            </p>
          </div>
        </footer>
      </div>

      {/* Click outside handlers */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}
      {showProfile && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;