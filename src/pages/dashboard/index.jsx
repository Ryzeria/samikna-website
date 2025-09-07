import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  HiTrendingUp, HiTrendingDown, HiEye, HiDownload,
  HiRefresh, HiCalendar, HiLocationMarker, HiInformationCircle
} from 'react-icons/hi';
import { 
  FaSatellite, FaCloud, FaThermometerHalf, FaTint, 
  FaLeaf, FaSeedling, FaChartLine, FaGlobe
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        overview: {
          totalArea: 2847,
          monitoredFields: 145,
          activeWeatherStations: 12,
          lastSatellitePass: '2 jam yang lalu',
          dataQuality: 94.2
        },
        satellite: {
          ndvi: {
            current: 0.65,
            previous: 0.62,
            trend: 'up',
            status: 'optimal'
          },
          landSurfaceTemp: {
            current: 28.4,
            previous: 29.1,
            trend: 'down',
            unit: '°C'
          },
          soilMoisture: {
            current: 67.2,
            previous: 64.8,
            trend: 'up',
            unit: '%'
          },
          cloudCoverage: {
            current: 15.3,
            previous: 22.1,
            trend: 'down',
            unit: '%'
          }
        },
        weather: {
          temperature: { current: 29, min: 24, max: 34, unit: '°C' },
          humidity: { current: 78, unit: '%' },
          rainfall: { today: 5.2, yesterday: 12.8, unit: 'mm' },
          windSpeed: { current: 8.5, direction: 'SW', unit: 'km/h' },
          pressure: { current: 1012.3, unit: 'hPa' },
          uvIndex: { current: 7, level: 'High' }
        },
        crops: {
          healthScore: 85.3,
          riceFields: { area: 1247, health: 87 },
          cornFields: { area: 892, health: 82 },
          soybeanFields: { area: 708, health: 89 }
        },
        alerts: [
          {
            id: 1,
            type: 'weather',
            severity: 'medium',
            title: 'Potensi Hujan Lebat',
            message: 'Prediksi hujan 20-30mm dalam 6 jam ke depan',
            location: 'Kecamatan Singosari',
            time: '30 menit yang lalu'
          },
          {
            id: 2,
            type: 'satellite',
            severity: 'low',
            title: 'NDVI Menurun Sedikit',
            message: 'Penurunan NDVI 0.02 di area blok C-7',
            location: 'Desa Purwodadi',
            time: '2 jam yang lalu'
          },
          {
            id: 3,
            type: 'system',
            severity: 'info',
            title: 'Update Data Satelit',
            message: 'Data Landsat-8 terbaru tersedia untuk analisis',
            location: 'Seluruh wilayah',
            time: '4 jam yang lalu'
          }
        ],
        recentActivity: [
          { action: 'Analisis NDVI completed', time: '10 menit yang lalu', status: 'success' },
          { action: 'Weather data synchronized', time: '15 menit yang lalu', status: 'success' },
          { action: 'Satellite image processed', time: '1 jam yang lalu', status: 'success' },
          { action: 'Monthly report generated', time: '3 jam yang lalu', status: 'info' }
        ]
      });
      
      setLoading(false);
      setLastUpdate(new Date());
    }, 1500);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <HiTrendingUp className="w-4 h-4 text-green-500" /> : 
      <HiTrendingDown className="w-4 h-4 text-red-500" />;
  };

  if (loading || !dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Memuat data satelit dan cuaca...</p>
            <p className="text-gray-400 text-sm mt-2">Menghubungkan ke Google Earth Engine</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - {user?.kabupaten} | SAMIKNA Platform</title>
        <meta name="description" content={`Dashboard monitoring satelit untuk ${user?.kabupaten}`} />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-green-600 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4">
                <FaSatellite className="w-24 h-24" />
              </div>
              <div className="absolute bottom-4 left-4">
                <FaGlobe className="w-20 h-20" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    Selamat Datang, {user?.kabupaten ? `Kabupaten ${user.kabupaten.charAt(0).toUpperCase() + user.kabupaten.slice(1)}` : 'Administrator'}
                  </h1>
                  <p className="text-blue-100 text-lg mb-4">
                    Platform Monitoring Pertanian Berbasis Satelit & Remote Sensing
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Sistem Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaSatellite className="w-4 h-4" />
                      <span>Terakhir Update: {lastUpdate.toLocaleTimeString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="today" className="text-gray-900">Hari Ini</option>
                    <option value="7days" className="text-gray-900">7 Hari</option>
                    <option value="30days" className="text-gray-900">30 Hari</option>
                    <option value="90days" className="text-gray-900">3 Bulan</option>
                  </select>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadDashboardData}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                    title="Refresh Data"
                  >
                    <HiRefresh className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: 'Total Area Pantau',
                value: dashboardData.overview.totalArea,
                unit: 'Ha',
                icon: FaGlobe,
                color: 'blue',
                change: '+5.2%'
              },
              {
                title: 'Lahan Terpantau',
                value: dashboardData.overview.monitoredFields,
                unit: 'Lokasi',
                icon: FaLeaf,
                color: 'green',
                change: '+12 lokasi'
              },
              {
                title: 'Stasiun Cuaca',
                value: dashboardData.overview.activeWeatherStations,
                unit: 'Aktif',
                icon: FaCloud,
                color: 'indigo',
                change: '100% uptime'
              },
              {
                title: 'Kualitas Data',
                value: dashboardData.overview.dataQuality,
                unit: '%',
                icon: FaSatellite,
                color: 'purple',
                change: '+2.1%'
              },
              {
                title: 'Satelit Terakhir',
                value: dashboardData.overview.lastSatellitePass,
                unit: '',
                icon: FaSatellite,
                color: 'emerald',
                change: 'Landsat-8'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs font-medium">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </span>
                    {stat.unit && <span className="text-gray-500 text-xs">{stat.unit}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Satellite Data Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaSatellite className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Data Satelit & Remote Sensing</h2>
                  <p className="text-gray-600 text-sm">Real-time dari Google Earth Engine</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  <HiEye className="w-4 h-4 inline mr-1" />
                  View Details
                </button>
                <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  <HiDownload className="w-4 h-4 inline mr-1" />
                  Export
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(dashboardData.satellite).map(([key, data], index) => {
                const titles = {
                  ndvi: 'NDVI (Vegetation Index)',
                  landSurfaceTemp: 'Suhu Permukaan Tanah',
                  soilMoisture: 'Kelembaban Tanah',
                  cloudCoverage: 'Tutupan Awan'
                };
                
                const icons = {
                  ndvi: FaLeaf,
                  landSurfaceTemp: FaThermometerHalf,
                  soilMoisture: FaTint,
                  cloudCoverage: FaCloud
                };
                
                const Icon = icons[key];
                
                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-900 text-sm">{titles[key]}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {data.current}{data.unit || ''}
                        </span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(data.trend)}
                          <span className={`text-xs font-medium ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {((data.current - data.previous) / data.previous * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Previous: {data.previous}{data.unit || ''}
                      </div>
                      
                      {data.status && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.status === 'optimal' ? 'bg-green-100 text-green-800' : 
                          data.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.status === 'optimal' ? 'Optimal' : data.status}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Weather Data & Google Earth Engine Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weather Data Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaCloud className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Data Meteorologi</h2>
                  <p className="text-gray-600 text-sm">Terintegrasi dengan BMKG</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: 'Suhu Udara',
                    current: dashboardData.weather.temperature.current,
                    range: `${dashboardData.weather.temperature.min}-${dashboardData.weather.temperature.max}`,
                    unit: dashboardData.weather.temperature.unit,
                    icon: FaThermometerHalf,
                    color: 'red'
                  },
                  {
                    title: 'Kelembaban',
                    current: dashboardData.weather.humidity.current,
                    unit: dashboardData.weather.humidity.unit,
                    icon: FaTint,
                    color: 'blue'
                  },
                  {
                    title: 'Curah Hujan',
                    current: dashboardData.weather.rainfall.today,
                    previous: dashboardData.weather.rainfall.yesterday,
                    unit: dashboardData.weather.rainfall.unit,
                    icon: FaCloud,
                    color: 'indigo'
                  },
                  {
                    title: 'UV Index',
                    current: dashboardData.weather.uvIndex.current,
                    level: dashboardData.weather.uvIndex.level,
                    icon: FaSeedling,
                    color: 'yellow'
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{item.title}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {item.current}{item.unit}
                    </p>
                    {item.range && (
                      <p className="text-xs text-gray-500">Range: {item.range}{item.unit}</p>
                    )}
                    {item.level && (
                      <p className="text-xs text-yellow-600 font-medium">{item.level}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Google Earth Engine Map Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaGlobe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Peta Satelit</h2>
                    <p className="text-gray-600 text-sm">Google Earth Engine</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.open(user?.earthEngineUrl, '_blank')}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  Buka Peta Lengkap
                </button>
              </div>
              
              <div className="relative">
                {user?.earthEngineUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={user.earthEngineUrl}
                      className="w-full h-full"
                      title="Google Earth Engine Preview"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <FaGlobe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Google Earth Engine belum dikonfigurasi</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Alerts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Alerts Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <HiInformationCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Alerts & Notifications</h3>
                </div>
                <span className="text-sm text-gray-500">{dashboardData.alerts.length} active</span>
              </div>

              <div className="space-y-4">
                {dashboardData.alerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-xl p-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <span className="text-xs opacity-75">{alert.time}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <HiLocationMarker className="w-3 h-3" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              </div>

              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Crop Health Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaSeedling className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kesehatan Tanaman Overview</h2>
                <p className="text-gray-600 text-sm">Berdasarkan analisis satelit dan data cuaca</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {dashboardData.crops.healthScore}%
                </div>
                <p className="text-gray-600 font-medium">Overall Health Score</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${dashboardData.crops.healthScore}%` }}
                  />
                </div>
              </div>

              {Object.entries(dashboardData.crops).filter(([key]) => key !== 'healthScore').map(([crop, data]) => (
                <div key={crop} className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {data.area} Ha
                  </div>
                  <p className="text-gray-600 text-sm font-medium capitalize mb-2">
                    {crop.replace('Fields', '')}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-600">Health:</span>
                    <span className={`text-sm font-bold ${
                      data.health >= 85 ? 'text-green-600' : 
                      data.health >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {data.health}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(Dashboard);