import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  HiHome, HiDocumentReport, HiUser, HiTruck,
} from 'react-icons/hi';
import {
  FaSatellite, FaSeedling, FaRobot,
} from 'react-icons/fa';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const NOTIFICATION_ITEMS = [
  { id: 1, type: 'weather', title: 'Weather Alert',       message: 'Heavy rainfall expected in 2 hours',        time: '5 min ago',  urgent: true  },
  { id: 2, type: 'system',  title: 'Data Sync Complete',  message: 'Satellite data updated successfully',        time: '15 min ago', urgent: false },
  { id: 3, type: 'crop',    title: 'Crop Health Alert',   message: 'NDVI decrease detected in Sector C-7',      time: '1 hour ago', urgent: false },
];

const NOTIFICATION_COUNT = NOTIFICATION_ITEMS.filter((n) => n.urgent).length;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [darkMode, setDarkMode]               = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile]         = useState(false);
  const [mounted, setMounted]                 = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('samikna_theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  // ─── Stable navigation items ────────────────────────────────────────────
  // useMemo avoids recreating the array on every render; router identity is
  // stable across renders in Next.js.
  const navigationItems = useMemo(() => [
    { name: 'Dashboard',         href: '/dashboard',                 icon: HiHome,          description: 'Overview & Analytics',    badge: null,  onClick: () => router.push('/dashboard') },
    { name: 'Peta Satelit',      href: '/dashboard/maps',            icon: FaSatellite,     description: 'Remote Sensing Maps',     badge: 'Live',onClick: () => router.push('/dashboard/maps') },
    { name: 'Manajemen Tanaman', href: '/dashboard/crop-management', icon: FaSeedling,      description: 'Crop Activities',         badge: '12',  onClick: () => router.push('/dashboard/crop-management') },
    { name: 'Supply Chain',      href: '/dashboard/supply-chain',    icon: HiTruck,         description: 'Logistik & Rantai Pasok', badge: null,  onClick: () => router.push('/dashboard/supply-chain') },
    { name: 'AI Chatbot',        href: '/dashboard/chatbot',         icon: FaRobot,         description: 'Assistant Pertanian',     badge: 'AI',  onClick: () => router.push('/dashboard/chatbot') },
    { name: 'Laporan',           href: '/dashboard/reports',         icon: HiDocumentReport,description: 'Reports & Analytics',     badge: null,  onClick: () => router.push('/dashboard/reports') },
    { name: 'Profil',            href: '/dashboard/profile',         icon: HiUser,          description: 'Account Settings',        badge: null,  onClick: () => router.push('/dashboard/profile') },
  ], [router]);

  // ─── Stable callbacks ────────────────────────────────────────────────────
  // Using functional state updaters removes dependencies on current state,
  // so these callbacks never change identity — Sidebar/TopBar won't re-render
  // unless they actually need to.
  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('samikna_theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
      }
    },
    [router, searchQuery],
  );

  const handleLogout   = useCallback(() => logout(), [logout]);
  const handleNavigate = useCallback((path) => router.push(path), [router]);

  // Notification callbacks
  const toggleNotifications = useCallback(() => setShowNotifications((v) => !v), []);
  const closeNotifications  = useCallback(() => setShowNotifications(false), []);

  // Profile callbacks
  const toggleProfile = useCallback(() => setShowProfile((v) => !v), []);
  const closeProfile  = useCallback(() => setShowProfile(false), []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading SAMIKNA Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
        currentPath={router.pathname}
        user={user}
        handleLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      <div className="lg:pl-72">
        <TopBar
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          toggleTheme={toggleTheme}
          notificationItems={NOTIFICATION_ITEMS}
          notificationCount={NOTIFICATION_COUNT}
          showNotifications={showNotifications}
          onToggleNotifications={toggleNotifications}
          onCloseNotifications={closeNotifications}
          user={user}
          showProfile={showProfile}
          onToggleProfile={toggleProfile}
          onCloseProfile={closeProfile}
          handleLogout={handleLogout}
          currentPath={router.pathname}
          onNavigate={handleNavigate}
        />

        {/* Page content */}
        <main className={`p-4 lg:p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
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
                <span className="text-gray-500">Data source:</span>
                <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                  Google Earth Engine, BMKG, AI Analytics
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-500">Coverage:</span>
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                  {user?.kabupaten || 'Indonesia'} Region
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className={`flex items-center space-x-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <button onClick={() => router.push('/dashboard/profile?tab=data')} className="hover:underline">Privacy Policy</button>
                <button onClick={() => router.push('/dashboard/chatbot')} className="hover:underline">Support</button>
                <button onClick={() => window.open('https://docs.samikna.id', '_blank')} className="hover:underline">Documentation</button>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  © 2024 SAMIKNA Agricultural Intelligence
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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

      {/* Click-outside overlay — closes dropdowns when clicking elsewhere */}
      {showNotifications && (
        <div className="fixed inset-0 z-30" onClick={closeNotifications} />
      )}
      {showProfile && (
        <div className="fixed inset-0 z-30" onClick={closeProfile} />
      )}
    </div>
  );
}
