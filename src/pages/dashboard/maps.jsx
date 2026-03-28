import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiRefresh, HiDownload, HiCog, HiX,
  HiArrowsExpand, HiArrowLeft
} from 'react-icons/hi';
import { FaSatellite } from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth, useAuth } from '../../contexts/AuthContext';

// Build GEE URL from kabupaten name (fallback jika earthEngineUrl belum di-set)
const BASE_GEE = 'https://ee-samikna.projects.earthengine.app/view/';

const MapsPage = () => {
  const { user } = useAuth();
  const [mapLoaded, setMapLoaded]                 = useState(false);
  const [isFullscreen, setIsFullscreen]           = useState(false);
  const [showFloatingControls, setShowFloatingControls] = useState(true);
  const [iframeKey, setIframeKey]                 = useState(0); // force reload on refresh

  // Resolve map URL: ambil dari DB, fallback ke pola /view/{kabupaten}
  const mapUrl = user?.earthEngineUrl
    || (user?.kabupaten ? `${BASE_GEE}${user.kabupaten.toLowerCase()}` : null);

  useEffect(() => {
    setMapLoaded(false);
    const t = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(t);
  }, [iframeKey]);

  const refreshMap = () => {
    setMapLoaded(false);
    setIframeKey(k => k + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => {
      if (!prev) setTimeout(() => setShowFloatingControls(false), 3000);
      else setShowFloatingControls(true);
      return !prev;
    });
  };

  // ── Fullscreen mode ──────────────────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <Head>
          <title>Satellite Maps – {user?.kabupaten} | SAMIKNA</title>
        </Head>

        <div className="w-full h-full relative">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
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
              <iframe
                key={iframeKey}
                src={mapUrl}
                className="w-full h-full border-0"
                title="Google Earth Engine Satellite Map"
                allow="fullscreen"
                loading="lazy"
              />

              {/* Floating Controls */}
              <AnimatePresence>
                {showFloatingControls && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white flex items-center gap-1">
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/20 rounded-md transition-colors"
                        title="Keluar fullscreen"
                      >
                        <HiArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={refreshMap}
                        className="p-2 hover:bg-white/20 rounded-md transition-colors"
                        title="Refresh"
                      >
                        <HiRefresh className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowFloatingControls(false)}
                        className="p-2 hover:bg-white/20 rounded-md transition-colors"
                        title="Sembunyikan kontrol"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showFloatingControls && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowFloatingControls(true)}
                  className="absolute top-4 left-4 z-10 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                  title="Tampilkan kontrol"
                >
                  <HiCog className="w-4 h-4" />
                </motion.button>
              )}

              <AnimatePresence>
                {showFloatingControls && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white flex items-center gap-2 text-sm">
                      <FaSatellite className="w-4 h-4" />
                      <span className="capitalize">{user?.kabupaten}</span>
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1" />
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

  // ── Normal mode ──────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Satellite Maps – {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Peta monitoring satelit dan remote sensing untuk analisis pertanian" />
      </Head>

      <DashboardLayout>
        <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FaSatellite className="w-5 h-5" />
              <div>
                <h1 className="font-semibold text-sm">Satellite Remote Sensing</h1>
                <p className="text-xs text-blue-100 capitalize">
                  {user?.kabupaten} – Google Earth Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live
              </div>
              <button
                onClick={refreshMap}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                title="Refresh"
              >
                <HiRefresh className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-xs font-medium flex items-center gap-1"
              >
                <HiArrowsExpand className="w-3 h-3" />
                Fullscreen
              </button>
            </div>
          </div>

          {/* Map iframe */}
          <div className="flex-1 relative">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                      scale:  { duration: 2, repeat: Infinity }
                    }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Loading Google Earth Engine
                  </h2>
                  <p className="text-gray-600 mb-6 capitalize">
                    Connecting to satellite data for {user?.kabupaten}
                  </p>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto space-y-3">
                    {[
                      { color: 'bg-blue-500',   text: 'Fetching Landsat 8/9 imagery' },
                      { color: 'bg-green-500',  text: 'Processing NDVI vegetation data' },
                      { color: 'bg-orange-500', text: 'Loading agricultural analysis' },
                    ].map(({ color, text }) => (
                      <div key={text} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className={`w-2 h-2 ${color} rounded-full animate-pulse`} />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <iframe
                  key={iframeKey}
                  src={mapUrl}
                  className="w-full h-full border-0"
                  title="Google Earth Engine Satellite Map"
                  allow="fullscreen"
                  loading="lazy"
                />

                {/* Floating refresh button */}
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
