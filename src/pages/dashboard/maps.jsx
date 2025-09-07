import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  HiLocationMarker, HiEye, HiEyeOff, HiRefresh,
  HiAdjustments, HiDownload, HiInformationCircle,
  HiCalendar, HiClock, HiCloud
} from 'react-icons/hi';
import { 
  FaSatellite, FaEye, FaLeaf, FaThermometerHalf, 
  FaTint, FaCloudRain, FaGlobe, FaLayerGroup
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const MapsPage = () => {
  const [user, setUser] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [showLegend, setShowLegend] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);
  const [satelliteData, setSatelliteData] = useState([]);
  const [weatherOverlay, setWeatherOverlay] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('ndvi');

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    generateSatelliteData();

    // Simulate Google Earth Engine loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 2000);
  }, []);

  const generateSatelliteData = () => {
    const areas = [];
    for (let i = 1; i <= 20; i++) {
      areas.push({
        id: i,
        name: `Area ${String.fromCharCode(65 + Math.floor((i-1)/5))}-${((i-1) % 5) + 1}`,
        coordinates: {
          lat: -7.9826 + (Math.random() - 0.5) * 0.2,
          lng: 112.6308 + (Math.random() - 0.5) * 0.2
        },
        satellite: {
          ndvi: (Math.random() * 0.6 + 0.2).toFixed(3),
          evi: (Math.random() * 0.4 + 0.1).toFixed(3),
          landSurfaceTemp: (Math.random() * 15 + 20).toFixed(1),
          soilMoisture: Math.floor(Math.random() * 40 + 30),
          cloudCover: Math.floor(Math.random() * 30)
        },
        weather: {
          temperature: Math.floor(Math.random() * 8 + 26),
          humidity: Math.floor(Math.random() * 20 + 70),
          rainfall: (Math.random() * 10).toFixed(1),
          windSpeed: (Math.random() * 15 + 5).toFixed(1)
        },
        cropType: ['padi', 'jagung', 'kedelai'][Math.floor(Math.random() * 3)],
        health: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : 'moderate',
        lastUpdate: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    }
    setSatelliteData(areas);
  };

  const mapLayers = [
    { id: 'satellite', name: 'True Color', icon: FaSatellite, description: 'Landsat 8/9 Natural Color' },
    { id: 'ndvi', name: 'NDVI', icon: FaLeaf, description: 'Normalized Difference Vegetation Index' },
    { id: 'thermal', name: 'Thermal', icon: FaThermometerHalf, description: 'Land Surface Temperature' },
    { id: 'moisture', name: 'Soil Moisture', icon: FaTint, description: 'Surface Soil Moisture' },
    { id: 'precipitation', name: 'Precipitation', icon: FaCloudRain, description: 'Rainfall Data from CHIRPS' }
  ];

  const analysisTools = [
    { id: 'ndvi', name: 'Vegetation Analysis', icon: FaLeaf, color: 'green' },
    { id: 'change', name: 'Change Detection', icon: FaEye, color: 'blue' },
    { id: 'classification', name: 'Land Classification', icon: FaLayerGroup, color: 'purple' },
    { id: 'timeseries', name: 'Time Series', icon: HiCalendar, color: 'orange' }
  ];

  const legendItems = [
    { color: 'bg-green-500', label: 'NDVI > 0.6 (Healthy Vegetation)', range: 'Excellent' },
    { color: 'bg-yellow-500', label: 'NDVI 0.4-0.6 (Moderate Vegetation)', range: 'Good' },
    { color: 'bg-orange-500', label: 'NDVI 0.2-0.4 (Sparse Vegetation)', range: 'Moderate' },
    { color: 'bg-red-500', label: 'NDVI < 0.2 (Bare Soil/Water)', range: 'Poor' },
    { color: 'bg-blue-500', label: 'Water Bodies', range: 'N/A' },
    { color: 'bg-gray-500', label: 'Urban/Built-up', range: 'N/A' }
  ];

  const handleAreaClick = (area) => {
    setSelectedArea(area);
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNDVIColor = (ndvi) => {
    const value = parseFloat(ndvi);
    if (value > 0.6) return 'bg-green-500';
    if (value > 0.4) return 'bg-yellow-500';
    if (value > 0.2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Head>
        <title>Satellite Maps - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Peta monitoring satelit dan remote sensing untuk analisis pertanian" />
      </Head>

      <DashboardLayout>
        <div className="h-[calc(100vh-12rem)] flex flex-col">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-2xl shadow-lg p-6 text-white"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <FaSatellite className="w-8 h-8" />
                  Satellite Remote Sensing - {user?.kabupaten}
                </h1>
                <p className="text-blue-100">
                  Monitoring pertanian dengan teknologi satelit Google Earth Engine
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Landsat 8/9 Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaGlobe className="w-3 h-3" />
                    <span>Google Earth Engine</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiClock className="w-3 h-3" />
                    <span>Last Update: {new Date().toLocaleTimeString('id-ID')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Layer Selector */}
                <div className="bg-white/20 rounded-lg p-1">
                  {mapLayers.slice(0, 3).map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        activeLayer === layer.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                      title={layer.description}
                    >
                      <layer.icon className="w-4 h-4 inline mr-1" />
                      {layer.name}
                    </button>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLegend(!showLegend)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title={showLegend ? 'Hide legend' : 'Show legend'}
                  >
                    {showLegend ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWeatherOverlay(!weatherOverlay)}
                    className={`p-2 rounded-lg transition-colors ${
                      weatherOverlay 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    title="Toggle weather overlay"
                  >
                    <HiCloud className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateSatelliteData}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Refresh satellite data"
                  >
                    <HiRefresh className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Export satellite imagery"
                  >
                    <HiDownload className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Content */}
          <div className="flex-1 relative bg-white rounded-b-2xl shadow-lg overflow-hidden">
            <div className="flex h-full">
              
              {/* Main Map Area */}
              <div className="flex-1 relative">
                {!mapLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1.5, repeat: Infinity }
                        }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-600 text-lg font-medium">Loading Google Earth Engine...</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Connecting to satellite data for {user?.kabupaten}
                      </p>
                      <div className="mt-4 bg-blue-50 rounded-lg p-3 max-w-md mx-auto">
                        <p className="text-blue-800 text-xs">
                          🛰️ Fetching latest Landsat 8/9 imagery<br/>
                          📡 Processing NDVI and vegetation indices<br/>
                          🌤️ Integrating weather data overlay
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    {/* Google Earth Engine Iframe */}
                    <iframe
                      src={user?.earthEngineUrl || 'about:blank'}
                      className="w-full h-full border-0"
                      title="Google Earth Engine Satellite Map"
                      onError={() => console.log('Error loading Google Earth Engine')}
                    />
                    
                    {/* Analysis Tools Overlay */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Analysis Tools</h4>
                        <div className="space-y-2">
                          {analysisTools.map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => setAnalysisMode(tool.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors ${
                                analysisMode === tool.id
                                  ? `bg-${tool.color}-100 text-${tool.color}-700 border border-${tool.color}-200`
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <tool.icon className="w-3 h-3" />
                              {tool.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Weather Overlay */}
                    {weatherOverlay && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <HiCloud className="w-4 h-4 text-blue-500" />
                            Weather Layer
                          </h4>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Temperature: 28°C</div>
                            <div>Humidity: 78%</div>
                            <div>Rainfall: 5.2mm</div>
                            <div>Cloud Cover: 15%</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay with area markers */}
                    <div className="absolute inset-0 pointer-events-none">
                      {satelliteData.map((area, index) => (
                        <motion.div
                          key={area.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${15 + (index % 6) * 14}%`,
                            top: `${15 + Math.floor(index / 6) * 18}%`
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAreaClick(area)}
                            className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all ${
                              getNDVIColor(area.satellite.ndvi)
                            } ${
                              selectedArea?.id === area.id ? 'ring-4 ring-blue-300' : ''
                            }`}
                            title={`${area.name} - NDVI: ${area.satellite.ndvi}`}
                          />
                          {selectedArea?.id === area.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 text-xs whitespace-nowrap z-10"
                            >
                              <div className="font-medium">{area.name}</div>
                              <div>NDVI: {area.satellite.ndvi}</div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
                
                {/* Legend */}
                {showLegend && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border-b border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HiInformationCircle className="w-4 h-4" />
                      NDVI Legend
                    </h3>
                    <div className="space-y-2">
                      {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-700">{item.label}</div>
                            <div className="text-xs text-gray-500">Health: {item.range}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Layer Controls */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 border-b border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-3">Satellite Layers</h3>
                  <div className="space-y-2">
                    {mapLayers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                          activeLayer === layer.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <layer.icon className="w-4 h-4" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{layer.name}</div>
                          <div className="text-xs opacity-75">{layer.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Selected Area Detail */}
                {selectedArea && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 border-b border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{selectedArea.name}</h3>
                      <button
                        onClick={() => setSelectedArea(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Location Info */}
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <HiLocationMarker className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">Location</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Crop: {selectedArea.cropType}</div>
                          <div>Health: <span className={`px-2 py-1 rounded-full text-xs ${getHealthColor(selectedArea.health)}`}>
                            {selectedArea.health}
                          </span></div>
                          <div className="mt-1 text-xs">
                            Lat: {selectedArea.coordinates.lat.toFixed(4)}<br/>
                            Lng: {selectedArea.coordinates.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>

                      {/* Satellite Indices */}
                      <div className="bg-white rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FaSatellite className="w-4 h-4 text-blue-500" />
                          Satellite Indices
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{selectedArea.satellite.ndvi}</div>
                            <div className="text-xs text-gray-600">NDVI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{selectedArea.satellite.evi}</div>
                            <div className="text-xs text-gray-600">EVI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">{selectedArea.satellite.landSurfaceTemp}°C</div>
                            <div className="text-xs text-gray-600">LST</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-cyan-600">{selectedArea.satellite.soilMoisture}%</div>
                            <div className="text-xs text-gray-600">Soil Moisture</div>
                          </div>
                        </div>
                      </div>

                      {/* Weather Data */}
                      <div className="bg-white rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <HiCloud className="w-4 h-4 text-blue-500" />
                          Weather Data
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Temperature:</span>
                            <span className="font-medium">{selectedArea.weather.temperature}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Humidity:</span>
                            <span className="font-medium">{selectedArea.weather.humidity}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rainfall:</span>
                            <span className="font-medium">{selectedArea.weather.rainfall}mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wind Speed:</span>
                            <span className="font-medium">{selectedArea.weather.windSpeed} km/h</span>
                          </div>
                        </div>
                      </div>

                      {/* Last Update */}
                      <div className="text-xs text-gray-500 text-center">
                        Last updated: {new Date(selectedArea.lastUpdate).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Area Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Area Summary ({satelliteData.length})
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {satelliteData.map((area) => (
                      <motion.button
                        key={area.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAreaClick(area)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedArea?.id === area.id
                            ? 'bg-blue-100 border-blue-200'
                            : 'bg-white hover:bg-gray-50'
                        } border`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{area.name}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getNDVIColor(area.satellite.ndvi)}`}></div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getHealthColor(area.health)}`}>
                              {area.health}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 capitalize mb-2">{area.cropType}</div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>NDVI: {area.satellite.ndvi}</span>
                          <span>LST: {area.satellite.landSurfaceTemp}°C</span>
                          <span>Moisture: {area.satellite.soilMoisture}%</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Export Options */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <h4 className="font-medium text-gray-900 mb-3">Export Options</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Export Satellite Data
                    </button>
                    <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Generate NDVI Report
                    </button>
                    <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Download Imagery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(MapsPage);