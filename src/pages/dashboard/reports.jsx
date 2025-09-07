import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  HiDocumentReport, HiDownload, HiCalendar, HiFilter,
  HiChartBar, HiTrendingUp, HiTrendingDown, HiEye,
  HiPrinter, HiMail, HiRefresh, HiClipboardList
} from 'react-icons/hi';
import { 
  FaLeaf, FaSatellite, FaCloud, FaChartLine, 
  FaFileExcel, FaFilePdf, FaFileImage, FaWheat
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const ReportsPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    generateReportData();
  }, [dateRange]);

  const generateReportData = () => {
    setLoading(true);
    setTimeout(() => {
      setReportData({
        summary: {
          totalArea: 2847,
          monitoredFields: 145,
          satelliteImages: 89,
          weatherStations: 12,
          avgNDVI: 0.68,
          avgTemp: 28.4,
          totalRainfall: 234.5,
          cropHealthScore: 87.3
        },
        trends: {
          ndvi: { current: 0.68, previous: 0.65, change: '+4.6%', trend: 'up' },
          temperature: { current: 28.4, previous: 29.2, change: '-2.7%', trend: 'down' },
          rainfall: { current: 234.5, previous: 198.3, change: '+18.3%', trend: 'up' },
          cropHealth: { current: 87.3, previous: 84.1, change: '+3.8%', trend: 'up' }
        },
        satelliteAnalysis: {
          landCover: {
            agriculture: 68.5,
            forest: 22.3,
            urban: 6.8,
            water: 2.4
          },
          vegetationHealth: {
            excellent: 34.2,
            good: 41.8,
            moderate: 18.7,
            poor: 5.3
          },
          changeDetection: {
            newAgriculture: 45.2,
            deforestation: 8.7,
            urbanExpansion: 12.4,
            wetlandLoss: 3.1
          }
        },
        weatherAnalysis: {
          temperature: { avg: 28.4, min: 22.1, max: 35.7, trend: 'stable' },
          precipitation: { total: 234.5, days: 18, intensity: 'moderate', distribution: 'uneven' },
          humidity: { avg: 78.2, morning: 85.6, afternoon: 70.8 },
          windSpeed: { avg: 8.5, max: 18.3, direction: 'SW' }
        },
        cropManagement: {
          activities: { completed: 23, ongoing: 12, planned: 18 },
          areas: { planted: 1247.5, harvested: 892.3, maintained: 658.2 },
          costs: {
            total: 245000000,
            perHectare: 175000,
            categories: { seeds: 65000000, fertilizers: 89000000, pesticides: 34000000, equipment: 57000000 }
          }
        },
        supplyChain: {
          inventory: {
            seeds: { value: 45000000, status: 'adequate' },
            fertilizers: { value: 78000000, status: 'good' },
            pesticides: { value: 23000000, status: 'low' },
            equipment: { value: 156000000, status: 'excellent' }
          },
          suppliers: { active: 23, performance: 87.5, onTimeDelivery: 92.3 }
        },
        recommendations: [
          {
            category: 'Satellite Analysis',
            priority: 'high',
            title: 'Optimalisasi Area NDVI Rendah',
            description: 'Area dengan NDVI < 0.5 di sektor C-7 memerlukan perhatian khusus',
            action: 'Aplikasi pupuk nitrogen dan sistem irigasi tambahan',
            impact: 'Peningkatan produktivitas hingga 15%',
            cost: 'Rp 25.000.000'
          },
          {
            category: 'Weather',
            priority: 'medium',
            title: 'Antisipasi Musim Hujan',
            description: 'Prediksi curah hujan tinggi dalam 2 bulan ke depan',
            action: 'Persiapan sistem drainase dan jadwal tanam',
            impact: 'Pencegahan kerugian akibat banjir',
            cost: 'Rp 15.000.000'
          },
          {
            category: 'Crop Management',
            priority: 'medium',
            title: 'Diversifikasi Varietas Padi',
            description: 'Ketergantungan tinggi pada varietas IR64',
            action: 'Introduksi varietas tahan hama dan perubahan iklim',
            impact: 'Peningkatan resiliensi produksi',
            cost: 'Rp 35.000.000'
          },
          {
            category: 'Supply Chain',
            priority: 'low',
            title: 'Optimalisasi Inventori Pestisida',
            description: 'Stock pestisida menipis, perlu reorder',
            action: 'Pemesanan pestisida organik 500L',
            impact: 'Kontinuitas pengendalian hama',
            cost: 'Rp 12.500.000'
          }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const tabs = [
    { id: 'overview', label: 'Executive Summary', icon: HiChartBar },
    { id: 'satellite', label: 'Satellite Analysis', icon: FaSatellite },
    { id: 'weather', label: 'Weather Analysis', icon: FaCloud },
    { id: 'crops', label: 'Crop Management', icon: FaLeaf },
    { id: 'supply', label: 'Supply Chain', icon: HiClipboardList },
    { id: 'recommendations', label: 'AI Recommendations', icon: HiTrendingUp }
  ];

  const dateRanges = [
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '30days', label: '30 Hari Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun Terakhir' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const exportFormats = [
    { format: 'pdf', label: 'PDF Report', icon: FaFilePdf, color: 'red' },
    { format: 'excel', label: 'Excel Data', icon: FaFileExcel, color: 'green' },
    { format: 'image', label: 'Image Charts', icon: FaFileImage, color: 'blue' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <HiTrendingUp className="w-4 h-4 text-green-500" /> : 
      <HiTrendingDown className="w-4 h-4 text-red-500" />;
  };

  const exportReport = async (format) => {
    console.log(`Exporting ${format} report for ${user?.kabupaten}...`);
    alert(`Laporan ${format.toUpperCase()} sedang diproses dan akan dikirim ke email Anda.`);
  };

  if (loading || !reportData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Generating comprehensive reports...</p>
            <p className="text-gray-400 text-sm mt-2">Analyzing satellite data & weather patterns</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Comprehensive Reports - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Laporan komprehensif monitoring satelit dan analisis pertanian" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <FaSatellite className="absolute top-4 right-4 w-24 h-24" />
              <FaChartLine className="absolute bottom-4 left-4 w-20 h-20" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    Laporan Komprehensif {user?.kabupaten}
                  </h1>
                  <p className="text-blue-100 text-lg mb-4">
                    Analisis terintegrasi data satelit, cuaca, dan manajemen pertanian
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaSatellite className="w-4 h-4" />
                      <span>Remote Sensing Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCloud className="w-4 h-4" />
                      <span>Weather Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaLeaf className="w-4 h-4" />
                      <span>Crop Intelligence</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {dateRanges.map((range) => (
                      <option key={range.value} value={range.value} className="text-gray-900">
                        {range.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    {exportFormats.map((format) => (
                      <motion.button
                        key={format.format}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => exportReport(format.format)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
                        title={format.label}
                      >
                        <format.icon className="w-4 h-4" />
                        <span className="hidden md:inline">{format.format.toUpperCase()}</span>
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateReportData}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                    title="Refresh Data"
                  >
                    <HiRefresh className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Area Terpantau',
                value: reportData.summary.totalArea,
                unit: 'Hektar',
                change: reportData.trends.ndvi.change,
                trend: reportData.trends.ndvi.trend,
                icon: HiDocumentReport,
                color: 'blue'
              },
              {
                title: 'Avg NDVI',
                value: reportData.summary.avgNDVI,
                unit: '',
                change: reportData.trends.ndvi.change,
                trend: reportData.trends.ndvi.trend,
                icon: FaSatellite,
                color: 'green'
              },
              {
                title: 'Avg Temperature',
                value: reportData.summary.avgTemp,
                unit: '°C',
                change: reportData.trends.temperature.change,
                trend: reportData.trends.temperature.trend,
                icon: FaCloud,
                color: 'orange'
              },
              {
                title: 'Crop Health Score',
                value: reportData.summary.cropHealthScore,
                unit: '%',
                change: reportData.trends.cropHealth.change,
                trend: reportData.trends.cropHealth.trend,
                icon: FaLeaf,
                color: 'emerald'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </span>
                    {stat.unit && <span className="text-gray-500 text-sm">{stat.unit}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Key Performance Indicators</h3>
                      <div className="space-y-4">
                        {Object.entries(reportData.trends).map(([key, data]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 font-medium">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {typeof data.current === 'number' ? data.current.toLocaleString() : data.current}
                              </span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                data.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {data.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Vegetation Health Improving</p>
                            <p className="text-sm text-gray-600">NDVI naik 4.6% menunjukkan kesehatan tanaman membaik</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Optimal Weather Conditions</p>
                            <p className="text-sm text-gray-600">Curah hujan dan suhu dalam rentang ideal untuk pertumbuhan</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Supply Chain Efficiency</p>
                            <p className="text-sm text-gray-600">On-time delivery rate mencapai 92.3%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Satellite Analysis Tab */}
              {activeTab === 'satellite' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Land Cover Distribution</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.satelliteAnalysis.landCover).map(([type, percentage]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    type === 'agriculture' ? 'bg-green-500' :
                                    type === 'forest' ? 'bg-emerald-600' :
                                    type === 'urban' ? 'bg-gray-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Vegetation Health Status</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.satelliteAnalysis.vegetationHealth).map(([status, percentage]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{status}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    status === 'excellent' ? 'bg-green-600' :
                                    status === 'good' ? 'bg-green-400' :
                                    status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Land Use Changes</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.satelliteAnalysis.changeDetection).map(([change, area]) => (
                          <div key={change} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 text-sm">
                              {change.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-medium">{area} Ha</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Weather Analysis Tab */}
              {activeTab === 'weather' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(reportData.weatherAnalysis).map(([category, data]) => (
                      <div key={category} className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4 capitalize flex items-center gap-2">
                          <FaCloud className="w-4 h-4 text-blue-500" />
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="capitalize text-gray-700 text-sm">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="font-medium">
                                {typeof value === 'number' ? value.toFixed(1) : value}
                                {category === 'temperature' && typeof value === 'number' ? '°C' : ''}
                                {category === 'precipitation' && key !== 'days' && key !== 'intensity' && key !== 'distribution' ? 'mm' : ''}
                                {category === 'humidity' && typeof value === 'number' ? '%' : ''}
                                {category === 'windSpeed' && typeof value === 'number' && key !== 'direction' ? ' km/h' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Crop Management Tab */}
              {activeTab === 'crops' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Activities Overview</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(reportData.cropManagement.activities).map(([status, count]) => (
                          <div key={status} className="text-center">
                            <div className={`text-2xl font-bold mb-1 ${
                              status === 'completed' ? 'text-green-600' :
                              status === 'ongoing' ? 'text-blue-600' : 'text-yellow-600'
                            }`}>
                              {count}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">{status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Area Summary</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.cropManagement.areas).map(([type, area]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{type}</span>
                            <span className="font-medium">{area} Ha</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Cost Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          Rp {(reportData.cropManagement.costs.total / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-sm text-gray-600">Total Investment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          Rp {(reportData.cropManagement.costs.perHectare / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600">Per Hectare</div>
                      </div>
                      <div className="col-span-2">
                        <div className="space-y-2">
                          {Object.entries(reportData.cropManagement.costs.categories).map(([category, cost]) => (
                            <div key={category} className="flex items-center justify-between text-sm">
                              <span className="capitalize text-gray-700">{category}</span>
                              <span className="font-medium">Rp {(cost / 1000000).toFixed(1)}M</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Supply Chain Tab */}
              {activeTab === 'supply' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Inventory Status</h4>
                      <div className="space-y-4">
                        {Object.entries(reportData.supplyChain.inventory).map(([item, data]) => (
                          <div key={item} className="flex items-center justify-between">
                            <div>
                              <span className="capitalize text-gray-700 font-medium">{item}</span>
                              <div className="text-sm text-gray-500">
                                Rp {(data.value / 1000000).toFixed(1)}M
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              data.status === 'excellent' ? 'bg-green-100 text-green-800' :
                              data.status === 'good' ? 'bg-blue-100 text-blue-800' :
                              data.status === 'adequate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {data.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Supplier Performance</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Active Suppliers</span>
                          <span className="font-bold text-2xl text-blue-600">
                            {reportData.supplyChain.suppliers.active}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Performance Score</span>
                          <span className="font-bold text-2xl text-green-600">
                            {reportData.supplyChain.suppliers.performance}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">On-time Delivery</span>
                          <span className="font-bold text-2xl text-emerald-600">
                            {reportData.supplyChain.suppliers.onTimeDelivery}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Recommendations</h3>
                    <p className="text-gray-600">
                      Rekomendasi berbasis analisis satelit, data cuaca, dan pola pertanian
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {reportData.recommendations.map((rec, index) => (
                      <div key={index} className={`border rounded-xl p-6 ${getPriorityColor(rec.priority)}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPriorityColor(rec.priority)}`}>
                              {rec.priority} Priority
                            </span>
                            <span className="text-sm font-medium text-gray-600">{rec.category}</span>
                          </div>
                          <span className="text-sm text-gray-500">{rec.cost}</span>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-900 text-lg">{rec.title}</h4>
                          <p className="text-gray-700">{rec.description}</p>
                          
                          <div className="bg-white/50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Recommended Action:</h5>
                            <p className="text-gray-700 mb-3">{rec.action}</p>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Expected Impact:</span>
                                <p className="text-sm text-green-700">{rec.impact}</p>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                  Implement
                                </button>
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                                  Learn More
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => exportReport('pdf')}
                className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors font-semibold"
              >
                <FaFilePdf className="w-5 h-5" />
                Generate Full PDF Report
              </button>
              
              <button 
                onClick={() => exportReport('excel')}
                className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                <FaFileExcel className="w-5 h-5" />
                Export Data to Excel
              </button>
              
              <button className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                <HiMail className="w-5 h-5" />
                Email Report
              </button>
              
              <button className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold">
                <HiCalendar className="w-5 h-5" />
                Schedule Auto Report
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Reports akan dikirim ke: {user?.email}</p>
              <p>Untuk laporan khusus, hubungi tim support di admin@samikna.id</p>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ReportsPage);