import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiRefresh, HiDownload, HiCog, HiX, 
  HiArrowsExpand, HiArrowLeft
} from 'react-icons/hi';
import { FaSatellite } from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const MapsPage = () => {
  const [user, setUser] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFloatingControls, setShowFloatingControls] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate Google Earth Engine loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 2000);
  }, []);

  const refreshMap = () => {
    setMapLoaded(false);
    setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      // Auto-hide controls when entering fullscreen
      setTimeout(() => setShowFloatingControls(false), 3000);
    } else {
      setShowFloatingControls(true);
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <Head>
          <title>Satellite Maps - {user?.kabupaten} | SAMIKNA</title>
        </Head>
        
        {/* Fullscreen Map */}
        <div className="w-full h-full relative">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-xl font-medium">Loading Google Earth Engine...</p>
                <p className="text-gray-300 text-sm mt-2">
                  Connecting to satellite data for {user?.kabupaten}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Google Earth Engine Iframe - Full Screen */}
              <iframe
                src={user?.earthEngineUrl || 'about:blank'}
                className="w-full h-full border-0"
                title="Google Earth Engine Satellite Map"
                onError={() => console.log('Error loading Google Earth Engine')}
              />
              
              {/* Floating Controls - Fullscreen */}
              <AnimatePresence>
                {showFloatingControls && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white">
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleFullscreen}
                          className="p-2 hover:bg-white/20 rounded-md transition-colors"
                          title="Exit fullscreen"
                        >
                          <HiArrowLeft className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={refreshMap}
                          className="p-2 hover:bg-white/20 rounded-md transition-colors"
                          title="Refresh"
                        >
                          <HiRefresh className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-white/20 rounded-md transition-colors"
                          title="Export"
                        >
                          <HiDownload className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowFloatingControls(false)}
                          className="p-2 hover:bg-white/20 rounded-md transition-colors"
                          title="Hide controls"
                        >
                          <HiX className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show controls when hidden */}
              {!showFloatingControls && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowFloatingControls(true)}
                  className="absolute top-4 left-4 z-10 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                  title="Show controls"
                >
                  <HiCog className="w-4 h-4" />
                </motion.button>
              )}

              {/* Location indicator */}
              <AnimatePresence>
                {showFloatingControls && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
                      <div className="flex items-center gap-2 text-sm">
                        <FaSatellite className="w-4 h-4" />
                        <span>{user?.kabupaten}</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Satellite Maps - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Peta monitoring satelit dan remote sensing untuk analisis pertanian" />
      </Head>

      <DashboardLayout>
        {/* Main Container - Maximum height */}
        <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Minimal Header Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaSatellite className="w-5 h-5" />
              <div>
                <h1 className="font-semibold text-sm">Satellite Remote Sensing</h1>
                <p className="text-xs text-blue-100">{user?.kabupaten} - Google Earth Engine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshMap}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                title="Refresh"
              >
                <HiRefresh className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-xs font-medium"
              >
                <HiArrowsExpand className="w-3 h-3 inline mr-1" />
                Fullscreen
              </motion.button>
            </div>
          </div>

          {/* Map Container - Takes all remaining space */}
          <div className="flex-1 relative">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Google Earth Engine</h2>
                  <p className="text-gray-600 mb-6">
                    Connecting to satellite data for {user?.kabupaten}
                  </p>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Fetching Landsat 8/9 imagery</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Processing NDVI vegetation data</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span>Loading agricultural analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Google Earth Engine Iframe - Full container */}
                <iframe
                  src={user?.earthEngineUrl || 'about:blank'}
                  className="w-full h-full border-0"
                  title="Google Earth Engine Satellite Map"
                  onError={() => console.log('Error loading Google Earth Engine')}
                />
                
                {/* Simple floating refresh button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={refreshMap}
                  className="absolute bottom-4 right-4 z-10 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors"
                  title="Refresh satellite data"
                >
                  <HiRefresh className="w-5 h-5 text-gray-700" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(MapsPage);