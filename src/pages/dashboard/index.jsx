import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  HiTrendingUp, HiTrendingDown, HiEye, HiDownload, HiRefresh, 
  HiCalendar, HiLocationMarker, HiInformationCircle, HiCog,
  HiChartBar, HiGlobe, HiBell, HiPlay, HiPause, HiExclamation
} from 'react-icons/hi';
import { 
  FaSatellite, FaCloud, FaThermometerHalf, FaTint, FaLeaf, 
  FaSeedling, FaChartLine, FaGlobe, FaRobot, FaCamera,
  FaMapMarkedAlt, FaFileAlt, FaUsers, FaTractor, FaIndustry
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [satelliteConnected, setSatelliteConnected] = useState(true);
  const [weatherConnected, setWeatherConnected] = useState(true);

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
    
    // Auto-refresh functionality
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [selectedTimeRange, autoRefresh]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Simulate API call with real-world delays
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentDate = new Date();
      const mockData = {
        overview: {
          totalArea: 2847,
          monitoredFields: 145,
          activeWeatherStations: 12,
          lastSatellitePass: '2 jam yang lalu',
          dataQuality: 94.2,
          systemUptime: 99.7,
          activeAlerts: 3,
          completedTasks: 78
        },
        satellite: {
          ndvi: {
            current: 0.65 + (Math.random() * 0.1 - 0.05),
            previous: 0.62,
            trend: 'up',
            status: 'optimal',
            confidence: 96.8,
            coverage: 89.2
          },
          landSurfaceTemp: {
            current: 28.4 + (Math.random() * 4 - 2),
            previous: 29.1,
            trend: 'down',
            unit: '°C',
            confidence: 94.5
          },
          soilMoisture: {
            current: 67.2 + (Math.random() * 10 - 5),
            previous: 64.8,
            trend: 'up',
            unit: '%',
            confidence: 92.1
          },
          cloudCoverage: {
            current: 15.3 + (Math.random() * 20),
            previous: 22.1,
            trend: 'down',
            unit: '%',
            confidence: 98.2
          }
        },
        weather: {
          temperature: { 
            current: 29 + (Math.random() * 6 - 3), 
            min: 24, 
            max: 34, 
            unit: '°C',
            trend: 'stable'
          },
          humidity: { 
            current: 78 + (Math.random() * 20 - 10), 
            unit: '%',
            comfort: 'optimal'
          },
          rainfall: { 
            today: 5.2 + (Math.random() * 10), 
            yesterday: 12.8, 
            week: 45.6,
            unit: 'mm',
            prediction: 'light'
          },
          windSpeed: { 
            current: 8.5 + (Math.random() * 10), 
            direction: 'SW', 
            unit: 'km/h',
            gusts: 15.2
          },
          pressure: { 
            current: 1012.3 + (Math.random() * 10 - 5), 
            unit: 'hPa',
            trend: 'rising'
          },
          uvIndex: { 
            current: 7 + Math.floor(Math.random() * 4), 
            level: 'High',
            protection: 'required'
          }
        },
        crops: {
          healthScore: 85.3 + (Math.random() * 10 - 5),
          totalArea: 2847,
          riceFields: { area: 1247, health: 87, growth: 'vegetative', yield: 'good' },
          cornFields: { area: 892, health: 82, growth: 'flowering', yield: 'excellent' },
          soybeanFields: { area: 708, health: 89, growth: 'mature', yield: 'good' },
          activities: {
            completed: 23,
            ongoing: 12,
            planned: 18,
            overdue: 2
          }
        },
        alerts: [
          {
            id: 1,
            type: 'weather',
            severity: 'medium',
            title: 'Potensi Hujan Lebat',
            message: 'Prediksi hujan 20-30mm dalam 6 jam ke depan di sektor utara',
            location: 'Kecamatan Singosari, Blok A1-A5',
            time: '30 menit yang lalu',
            action: 'Siapkan sistem drainase dan tutup aktivitas outdoor',
            impact: 'medium',
            automated: true
          },
          {
            id: 2,
            type: 'satellite',
            severity: 'low',
            title: 'NDVI Menurun Sedikit',
            message: 'Penurunan NDVI 0.02 terdeteksi di area blok C-7, kemungkinan stress nitrogen',
            location: 'Desa Purwodadi, Blok C-7',
            time: '2 jam yang lalu',
            action: 'Lakukan soil test dan aplikasi pupuk nitrogen',
            impact: 'low',
            automated: true
          },
          {
            id: 3,
            type: 'system',
            severity: 'info',
            title: 'Update Data Satelit',
            message: 'Data Landsat-8 terbaru berhasil diproses dan tersedia untuk analisis',
            location: 'Seluruh wilayah monitoring',
            time: '4 jam yang lalu',
            action: 'Review hasil analisis di menu Satellite Maps',
            impact: 'positive',
            automated: false
          },
          {
            id: 4,
            type: 'equipment',
            severity: 'high',
            title: 'Maintenance Required',
            message: 'Traktor unit TR-003 memerlukan maintenance rutin dalam 48 jam',
            location: 'Gudang Equipment A',
            time: '6 jam yang lalu',
            action: 'Schedule maintenance dengan teknisi terdekat',
            impact: 'medium',
            automated: true
          }
        ],
        recentActivity: [
          { 
            action: 'NDVI Analysis completed for Sector A', 
            time: '10 menit yang lalu', 
            status: 'success',
            user: 'System Auto',
            details: 'Coverage: 245 Ha, Health Score: 87%'
          },
          { 
            action: 'Weather data synchronized from BMKG', 
            time: '15 menit yang lalu', 
            status: 'success',
            user: 'Weather API',
            details: '12 stations, 98% data quality'
          },
          { 
            action: 'Satellite image processed (Landsat-8)', 
            time: '1 jam yang lalu', 
            status: 'success',
            user: 'Google Earth Engine',
            details: 'Scene ID: LC08_L1TP_118065_20240115'
          },
          { 
            action: 'Monthly crop report generated', 
            time: '3 jam yang lalu', 
            status: 'info',
            user: user?.kabupaten || 'Admin',
            details: 'PDF exported, 45 pages'
          },
          { 
            action: 'Supply chain inventory updated', 
            time: '5 jam yang lalu', 
            status: 'success',
            user: 'Inventory System',
            details: '156 items synchronized'
          }
        ],
        quickActions: [
          {
            title: 'Satellite Analysis',
            description: 'View latest NDVI and vegetation health',
            icon: FaSatellite,
            color: 'blue',
            action: () => router.push('/dashboard/maps'),
            count: '89 images'
          },
          {
            title: 'Weather Forecast',
            description: '7-day weather prediction and alerts',
            icon: FaCloud,
            color: 'indigo',
            action: () => window.open('https://bmkg.go.id', '_blank'),
            count: '12 stations'
          },
          {
            title: 'Crop Management',
            description: 'Monitor activities and field operations',
            icon: FaLeaf,
            color: 'green',
            action: () => router.push('/dashboard/crop-management'),
            count: '12 active'
          },
          {
            title: 'AI Assistant',
            description: 'Get insights and recommendations',
            icon: FaRobot,
            color: 'purple',
            action: () => router.push('/dashboard/chatbot'),
            count: 'Online'
          }
        ],
        systemStatus: {
          satellite: {
            status: 'connected',
            lastUpdate: currentDate,
            nextPass: new Date(currentDate.getTime() + 4 * 60 * 60 * 1000),
            coverage: 89.2
          },
          weather: {
            status: 'connected',
            stationsActive: 12,
            dataQuality: 98.5,
            lastSync: new Date(currentDate.getTime() - 15 * 60 * 1000)
          },
          ai: {
            status: 'online',
            responseTime: 1.2,
            accuracy: 94.8,
            queriesProcessed: 1247
          }
        }
      };
      
      setDashboardData(mockData);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [router, user]);

  const handleQuickAction = (action) => {
    if (typeof action === 'function') {
      action();
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      info: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <HiTrendingUp className="w-4 h-4 text-green-500" /> : 
      trend === 'down' ?
      <HiTrendingDown className="w-4 h-4 text-red-500" /> :
      <HiChartBar className="w-4 h-4 text-blue-500" />;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    return date.toLocaleDateString('id-ID');
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
            <p className="text-gray-600 text-lg">Loading agricultural intelligence...</p>
            <p className="text-gray-400 text-sm mt-2">Connecting to satellite networks and weather systems</p>
            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <div>🛰️ Synchronizing with Google Earth Engine...</div>
              <div>🌦️ Fetching BMKG weather data...</div>
              <div>🌱 Processing crop health indicators...</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Agricultural Intelligence Dashboard - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content={`Comprehensive agricultural monitoring dashboard for ${user?.kabupaten} with satellite data, weather intelligence, and crop management`} />
        <meta name="keywords" content="agriculture, satellite monitoring, weather, crop management, NDVI, precision farming" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Enhanced Header Section */}
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
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FaLeaf className="w-32 h-32 opacity-30" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    Welcome to SAMIKNA Agricultural Intelligence
                  </h1>
                  <p className="text-lg mb-2">
                    {user?.kabupaten ? `Kabupaten ${user.kabupaten.charAt(0).toUpperCase() + user.kabupaten.slice(1)}` : 'Your Region'}
                  </p>
                  <p className="text-blue-100 text-lg mb-4">
                    Comprehensive satellite-based agricultural monitoring and precision farming platform
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${satelliteConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span>Satellite Network: {satelliteConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${weatherConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span>Weather API: {weatherConnected ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaSatellite className="w-4 h-4" />
                      <span>Last Update: {lastUpdate.toLocaleTimeString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <span>Data Quality: {dashboardData.overview.dataQuality}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="today" className="text-gray-900">Today</option>
                    <option value="7days" className="text-gray-900">7 Days</option>
                    <option value="30days" className="text-gray-900">30 Days</option>
                    <option value="90days" className="text-gray-900">3 Months</option>
                    <option value="1year" className="text-gray-900">1 Year</option>
                  </select>
                  
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`p-3 rounded-xl transition-colors ${autoRefresh ? 'bg-green-500/30' : 'bg-white/20'} hover:bg-white/30`}
                    title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
                  >
                    {autoRefresh ? <HiPlay className="w-5 h-5" /> : <HiPause className="w-5 h-5" />}
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadDashboardData}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                    title="Refresh Data"
                  >
                    <HiRefresh className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/dashboard/reports')}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                    title="Generate Report"
                  >
                    <HiDownload className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {dashboardData.quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action.action)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {action.count}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: 'Total Area Monitored',
                value: dashboardData.overview.totalArea,
                unit: 'Ha',
                icon: FaGlobe,
                color: 'blue',
                change: '+5.2%',
                trend: 'up'
              },
              {
                title: 'Active Fields',
                value: dashboardData.overview.monitoredFields,
                unit: 'Locations',
                icon: FaLeaf,
                color: 'green',
                change: '+12 new',
                trend: 'up'
              },
              {
                title: 'Weather Stations',
                value: dashboardData.overview.activeWeatherStations,
                unit: 'Active',
                icon: FaCloud,
                color: 'indigo',
                change: '100% uptime',
                trend: 'stable'
              },
              {
                title: 'Data Quality',
                value: dashboardData.overview.dataQuality.toFixed(1),
                unit: '%',
                icon: FaSatellite,
                color: 'purple',
                change: '+2.1%',
                trend: 'up'
              },
              {
                title: 'System Health',
                value: dashboardData.overview.systemUptime.toFixed(1),
                unit: '% Uptime',
                icon: HiCog,
                color: 'emerald',
                change: 'Excellent',
                trend: 'up'
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
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
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
                  <h2 className="text-xl font-bold text-gray-900">Satellite Intelligence & Remote Sensing</h2>
                  <p className="text-gray-600 text-sm">Real-time data from Google Earth Engine and multiple satellite sources</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push('/dashboard/maps')}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <HiEye className="w-4 h-4 inline mr-1" />
                  View Maps
                </button>
                <button 
                  onClick={() => router.push('/dashboard/reports')}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  <HiDownload className="w-4 h-4 inline mr-1" />
                  Export Data
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(dashboardData.satellite).map(([key, data], index) => {
                const titles = {
                  ndvi: 'NDVI (Vegetation Health)',
                  landSurfaceTemp: 'Land Surface Temperature',
                  soilMoisture: 'Soil Moisture Index',
                  cloudCoverage: 'Cloud Coverage'
                };
                
                const icons = {
                  ndvi: FaLeaf,
                  landSurfaceTemp: FaThermometerHalf,
                  soilMoisture: FaTint,
                  cloudCoverage: FaCloud
                };
                
                const colors = {
                  ndvi: 'green',
                  landSurfaceTemp: 'red',
                  soilMoisture: 'blue',
                  cloudCoverage: 'gray'
                };
                
                const Icon = icons[key];
                
                return (
                  <motion.div 
                    key={key} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className={`w-5 h-5 text-${colors[key]}-600`} />
                      <h3 className="font-semibold text-gray-900 text-sm">{titles[key]}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {data.current.toFixed(data.unit ? 1 : 2)}{data.unit || ''}
                        </span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(data.trend)}
                          <span className={`text-xs font-medium ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {((data.current - data.previous) / data.previous * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Previous: {data.previous.toFixed(data.unit ? 1 : 2)}{data.unit || ''}
                      </div>
                      
                      {data.confidence && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Confidence</span>
                            <span className="font-medium">{data.confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${data.confidence}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {data.status && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.status === 'optimal' ? 'bg-green-100 text-green-800' : 
                          data.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.status}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Weather Data & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weather Intelligence */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaCloud className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Weather Intelligence</h2>
                    <p className="text-gray-600 text-sm">Real-time BMKG integration & forecasting</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open('https://bmkg.go.id', '_blank')}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                >
                  View BMKG
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: 'Temperature',
                    current: dashboardData.weather.temperature.current.toFixed(1),
                    range: `${dashboardData.weather.temperature.min}-${dashboardData.weather.temperature.max}`,
                    unit: dashboardData.weather.temperature.unit,
                    icon: FaThermometerHalf,
                    color: 'red',
                    status: dashboardData.weather.temperature.trend
                  },
                  {
                    title: 'Humidity',
                    current: dashboardData.weather.humidity.current.toFixed(0),
                    unit: dashboardData.weather.humidity.unit,
                    icon: FaTint,
                    color: 'blue',
                    status: dashboardData.weather.humidity.comfort
                  },
                  {
                    title: 'Rainfall',
                    current: dashboardData.weather.rainfall.today.toFixed(1),
                    previous: dashboardData.weather.rainfall.yesterday.toFixed(1),
                    unit: dashboardData.weather.rainfall.unit,
                    icon: FaCloud,
                    color: 'indigo',
                    status: dashboardData.weather.rainfall.prediction
                  },
                  {
                    title: 'UV Index',
                    current: dashboardData.weather.uvIndex.current,
                    level: dashboardData.weather.uvIndex.level,
                    protection: dashboardData.weather.uvIndex.protection,
                    icon: FaSeedling,
                    color: 'yellow',
                    status: 'monitor'
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{item.title}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {item.current}{item.unit}
                    </p>
                    {item.range && (
                      <p className="text-xs text-gray-500">Range: {item.range}{item.unit}</p>
                    )}
                    {item.level && (
                      <p className="text-xs text-yellow-600 font-medium">{item.level}</p>
                    )}
                    {item.status && (
                      <p className="text-xs text-gray-500 capitalize">{item.status}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Today's Weather Summary</h4>
                <p className="text-sm text-blue-800">
                  Temperature optimal for crop growth. Light rainfall expected in afternoon. 
                  UV protection recommended for field workers. Wind conditions favorable for spraying activities.
                </p>
              </div>
            </motion.div>

            {/* System Status & Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <HiCog className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">System Performance</h2>
                  <p className="text-gray-600 text-sm">Real-time system health monitoring</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(dashboardData.systemStatus).map(([system, status]) => (
                  <div key={system} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status.status === 'connected' || status.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{system} System</p>
                        <p className="text-sm text-gray-600">
                          {system === 'satellite' && `Coverage: ${status.coverage}%`}
                          {system === 'weather' && `${status.stationsActive} stations active`}
                          {system === 'ai' && `Response time: ${status.responseTime}s`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status.status === 'connected' || status.status === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {status.status}
                      </span>
                      {system === 'satellite' && status.nextPass && (
                        <p className="text-xs text-gray-500 mt-1">
                          Next pass: {formatTimeAgo(status.nextPass)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {dashboardData.crops.activities.completed}
                  </div>
                  <div className="text-sm text-green-700">Tasks Completed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {dashboardData.crops.activities.ongoing}
                  </div>
                  <div className="text-sm text-blue-700">Active Tasks</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alerts and Activity Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Critical Alerts & Notifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <HiBell className="w-6 h-6 text-orange-600" />
                    {dashboardData.alerts.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{dashboardData.alerts.length}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Smart Alerts & Notifications
                  </h3>
                </div>
                <button
                  onClick={() => setAlertsExpanded(!alertsExpanded)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {alertsExpanded ? 'Show Less' : `View All (${dashboardData.alerts.length})`}
                </button>
              </div>

              <div className="space-y-3">
                {(alertsExpanded ? dashboardData.alerts : dashboardData.alerts.slice(0, 3)).map((alert) => (
                  <motion.div 
                    key={alert.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-xl p-4 ${getSeverityColor(alert.severity)} hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'high' ? 'bg-red-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        {alert.automated && (
                          <span className="px-1 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">AI</span>
                        )}
                      </div>
                      <span className="text-xs opacity-75">{alert.time}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <HiLocationMarker className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <button className="text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded transition-colors">
                        Action Required
                      </button>
                    </div>
                    {alert.action && (
                      <div className="mt-2 p-2 bg-white/30 rounded text-xs">
                        <strong>Recommended Action:</strong> {alert.action}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {dashboardData.alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No active alerts. All systems running smoothly!</p>
                </div>
              )}
            </motion.div>

            {/* Recent System Activity */}
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
                <h3 className="text-lg font-bold text-gray-900">Recent System Activity</h3>
              </div>

              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'info' ? 'bg-blue-500' : 
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                        <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => router.push('/dashboard/reports')}
                className="w-full mt-4 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                View Full Activity Log
              </button>
            </motion.div>
          </div>

          {/* Crop Health Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaSeedling className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Agricultural Health Overview</h2>
                  <p className="text-gray-600 text-sm">Comprehensive crop monitoring based on satellite analysis and field data</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/crop-management')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Manage Crops
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 30}`}
                      strokeDashoffset={`${2 * Math.PI * 30 * (1 - dashboardData.crops.healthScore / 100)}`}
                      className="text-green-600 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">
                      {dashboardData.crops.healthScore.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">Overall Health Score</p>
                <p className="text-sm text-green-600 mt-1">Excellent Condition</p>
              </div>

              {Object.entries(dashboardData.crops).filter(([key]) => key.includes('Fields')).map(([crop, data]) => (
                <motion.div 
                  key={crop} 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push('/dashboard/crop-management')}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {crop.includes('rice') && <FaSeedling className="w-6 h-6 text-green-600" />}
                    {crop.includes('corn') && <FaLeaf className="w-6 h-6 text-yellow-600" />}
                    {crop.includes('soybean') && <FaSeedling className="w-6 h-6 text-green-600" />}
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {data.area} Ha
                  </div>
                  <p className="text-gray-600 text-sm font-medium capitalize mb-2">
                    {crop.replace('Fields', '')} Fields
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs text-gray-600">Health:</span>
                      <span className={`text-xs font-bold ${
                        data.health >= 85 ? 'text-green-600' : 
                        data.health >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {data.health}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Growth: {data.growth} | Yield: {data.yield}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Completed Tasks', value: dashboardData.crops.activities.completed, color: 'green' },
                { label: 'Ongoing Activities', value: dashboardData.crops.activities.ongoing, color: 'blue' },
                { label: 'Planned Operations', value: dashboardData.crops.activities.planned, color: 'indigo' },
                { label: 'Overdue Tasks', value: dashboardData.crops.activities.overdue, color: 'red' }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 text-center">
                  <div className={`text-2xl font-bold text-${item.color}-600 mb-1`}>
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
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