import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const ReportsPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

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
      const currentDate = new Date();
      const daysAgo = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : dateRange === '3months' ? 90 : 365;
      
      setReportData({
        metadata: {
          generatedAt: currentDate.toISOString(),
          dateRange: dateRange,
          location: user?.kabupaten || 'Unknown',
          dataQuality: 94.5,
          totalDataPoints: 15847
        },
        summary: {
          totalArea: 2847,
          monitoredFields: 145,
          satelliteImages: 89,
          weatherStations: 12,
          avgNDVI: 0.68,
          avgTemp: 28.4,
          totalRainfall: 234.5,
          cropHealthScore: 87.3,
          productivityIndex: 92.1,
          sustainabilityScore: 85.7
        },
        trends: {
          ndvi: { 
            current: 0.68, 
            previous: 0.65, 
            change: '+4.6%', 
            trend: 'up',
            weekly: [0.62, 0.64, 0.65, 0.67, 0.68],
            target: 0.70
          },
          temperature: { 
            current: 28.4, 
            previous: 29.2, 
            change: '-2.7%', 
            trend: 'down',
            weekly: [29.5, 29.2, 28.8, 28.6, 28.4],
            optimal: '26-30'
          },
          rainfall: { 
            current: 234.5, 
            previous: 198.3, 
            change: '+18.3%', 
            trend: 'up',
            weekly: [45, 62, 78, 89, 95],
            monthly_target: 200
          },
          cropHealth: { 
            current: 87.3, 
            previous: 84.1, 
            change: '+3.8%', 
            trend: 'up',
            weekly: [82, 84, 85, 86, 87],
            target: 90
          }
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
          },
          imageQuality: {
            cloudFree: 85.2,
            partialCloud: 12.3,
            cloudy: 2.5
          }
        },
        weatherAnalysis: {
          temperature: { 
            avg: 28.4, 
            min: 22.1, 
            max: 35.7, 
            trend: 'stable',
            extremeDays: 3,
            optimalDays: 23
          },
          precipitation: { 
            total: 234.5, 
            days: 18, 
            intensity: 'moderate', 
            distribution: 'uneven',
            droughtRisk: 'low',
            floodRisk: 'medium'
          },
          humidity: { 
            avg: 78.2, 
            morning: 85.6, 
            afternoon: 70.8,
            optimal: 75
          },
          windSpeed: { 
            avg: 8.5, 
            max: 18.3, 
            direction: 'SW',
            gustDays: 5
          }
        },
        cropManagement: {
          activities: { 
            completed: 23, 
            ongoing: 12, 
            planned: 18,
            overdue: 2
          },
          areas: { 
            planted: 1247.5, 
            harvested: 892.3, 
            maintained: 658.2,
            fallow: 89.5
          },
          costs: {
            total: 245000000,
            perHectare: 175000,
            categories: { 
              seeds: 65000000, 
              fertilizers: 89000000, 
              pesticides: 34000000, 
              equipment: 57000000 
            },
            efficiency: 87.5
          },
          yield: {
            predicted: 6.8,
            actual: 6.2,
            target: 6.5,
            efficiency: 95.4
          }
        },
        supplyChain: {
          inventory: {
            seeds: { value: 45000000, status: 'adequate', daysRemaining: 45 },
            fertilizers: { value: 78000000, status: 'good', daysRemaining: 67 },
            pesticides: { value: 23000000, status: 'low', daysRemaining: 12 },
            equipment: { value: 156000000, status: 'excellent', utilization: 92 }
          },
          suppliers: { 
            active: 23, 
            performance: 87.5, 
            onTimeDelivery: 92.3,
            qualityScore: 94.1
          },
          logistics: {
            avgDeliveryTime: 3.2,
            costPerTon: 125000,
            fuelEfficiency: 8.5,
            carbonFootprint: 2.3
          }
        },
        recommendations: [
          {
            id: 1,
            category: 'Satellite Analysis',
            priority: 'high',
            title: 'Optimalisasi Area NDVI Rendah',
            description: 'Area dengan NDVI < 0.5 di sektor C-7 memerlukan perhatian khusus untuk meningkatkan kesehatan vegetasi',
            action: 'Aplikasi pupuk nitrogen tambahan dan peningkatan sistem irigasi tetes',
            impact: 'Peningkatan produktivitas hingga 15% dan NDVI target 0.72',
            cost: 'Rp 25.000.000',
            timeline: '2-3 minggu',
            roi: '245%',
            urgency: 'Immediate'
          },
          {
            id: 2,
            category: 'Weather',
            priority: 'medium',
            title: 'Antisipasi Musim Hujan Intensif',
            description: 'Prediksi curah hujan tinggi dalam 2 bulan ke depan berdasarkan analisis pola iklim',
            action: 'Persiapan sistem drainase, penjadwalan ulang kegiatan tanam, dan proteksi tanaman',
            impact: 'Pencegahan kerugian akibat banjir dan optimalisasi manfaat air hujan',
            cost: 'Rp 15.000.000',
            timeline: '1 bulan',
            roi: '180%',
            urgency: 'Soon'
          },
          {
            id: 3,
            category: 'Crop Management',
            priority: 'medium',
            title: 'Diversifikasi Varietas Tanaman',
            description: 'Ketergantungan tinggi pada varietas IR64 menimbulkan risiko genetik',
            action: 'Introduksi varietas tahan hama dan adaptif perubahan iklim seperti Inpari 32',
            impact: 'Peningkatan resiliensi produksi dan adaptasi perubahan iklim',
            cost: 'Rp 35.000.000',
            timeline: '1 musim tanam',
            roi: '165%',
            urgency: 'Planned'
          },
          {
            id: 4,
            category: 'Supply Chain',
            priority: 'low',
            title: 'Optimalisasi Inventori Pestisida',
            description: 'Stock pestisida menipis dengan sisa 12 hari, perlu reorder dan diversifikasi supplier',
            action: 'Pemesanan pestisida organik 500L dan penambahan supplier alternatif',
            impact: 'Kontinuitas pengendalian hama dan pengurangan risiko supply',
            cost: 'Rp 12.500.000',
            timeline: '1 minggu',
            roi: '145%',
            urgency: 'This Week'
          }
        ],
        analytics: {
          kpi: {
            productivityGrowth: 12.5,
            costReduction: 8.3,
            sustainabilityImprovement: 15.7,
            techAdoption: 89.2
          },
          benchmarks: {
            industryAverage: {
              ndvi: 0.62,
              yield: 5.8,
              costPerHa: 195000,
              sustainability: 72
            },
            bestPractice: {
              ndvi: 0.75,
              yield: 7.2,
              costPerHa: 150000,
              sustainability: 95
            }
          }
        }
      });
      
      setLoading(false);
    }, 1500);
  };

  const tabs = [
    { id: 'overview', label: 'Executive Summary', icon: '📊' },
    { id: 'satellite', label: 'Satellite Analysis', icon: '🛰️' },
    { id: 'weather', label: 'Weather Analysis', icon: '🌤️' },
    { id: 'crops', label: 'Crop Management', icon: '🌾' },
    { id: 'supply', label: 'Supply Chain', icon: '🚛' },
    { id: 'recommendations', label: 'AI Recommendations', icon: '🤖' },
    { id: 'analytics', label: 'Advanced Analytics', icon: '📈' }
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
    { format: 'pdf', label: 'PDF Report', icon: '📄', color: 'red' },
    { format: 'excel', label: 'Excel Data', icon: '📊', color: 'green' },
    { format: 'csv', label: 'CSV Data', icon: '📋', color: 'blue' },
    { format: 'json', label: 'JSON Data', icon: '📁', color: 'purple' }
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
    return trend === 'up' ? '📈' : '📉';
  };

  const exportReport = async (format) => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `SAMIKNA_Report_${user?.kabupaten}_${timestamp}`;
      
      if (format === 'json') {
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // Generate CSV data
        const csvData = generateCSVData();
        const dataBlob = new Blob([csvData], {type: 'text/csv'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Simulate PDF/Excel generation
        alert(`Laporan ${format.toUpperCase()} sedang diproses dan akan dikirim ke email Anda dalam 5-10 menit.`);
      }
    } catch (error) {
      alert('Gagal mengekspor laporan. Silakan coba lagi.');
    } finally {
      setExportLoading(false);
    }
  };

  const generateCSVData = () => {
    const headers = ['Metric', 'Current', 'Previous', 'Change', 'Trend'];
    const rows = [
      ['NDVI', reportData.trends.ndvi.current, reportData.trends.ndvi.previous, reportData.trends.ndvi.change, reportData.trends.ndvi.trend],
      ['Temperature', reportData.trends.temperature.current, reportData.trends.temperature.previous, reportData.trends.temperature.change, reportData.trends.temperature.trend],
      ['Rainfall', reportData.trends.rainfall.current, reportData.trends.rainfall.previous, reportData.trends.rainfall.change, reportData.trends.rainfall.trend],
      ['Crop Health', reportData.trends.cropHealth.current, reportData.trends.cropHealth.previous, reportData.trends.cropHealth.change, reportData.trends.cropHealth.trend]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const scheduleReport = () => {
    const email = user?.email || 'admin@samikna.id';
    alert(`Laporan otomatis akan dikirim ke ${email} setiap minggu pada hari Senin pukul 08:00 WIB.`);
  };

  const shareReport = () => {
    const shareData = {
      title: `SAMIKNA Report - ${user?.kabupaten}`,
      text: `Laporan komprehensif pertanian ${user?.kabupaten} periode ${dateRange}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link laporan telah disalin ke clipboard!');
    }
  };

  if (loading || !reportData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">🛰️</div>
              <div className="absolute bottom-4 left-4 text-5xl">📊</div>
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
                      <span>🛰️ Remote Sensing Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌤️ Weather Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌾 Crop Intelligence</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <span>📅 Generated: {new Date(reportData.metadata.generatedAt).toLocaleString('id-ID')}</span>
                    <span className="ml-4">🎯 Data Quality: {reportData.metadata.dataQuality}%</span>
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
                      <button
                        key={format.format}
                        onClick={() => exportReport(format.format)}
                        disabled={exportLoading}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                        title={format.label}
                      >
                        <span>{format.icon}</span>
                        <span className="hidden md:inline">{format.format.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => generateReportData()}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                    title="Refresh Data"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Area Terpantau',
                value: reportData.summary.totalArea,
                unit: 'Hektar',
                change: reportData.trends.ndvi.change,
                trend: reportData.trends.ndvi.trend,
                icon: '🌍',
                color: 'blue'
              },
              {
                title: 'Avg NDVI',
                value: reportData.summary.avgNDVI,
                unit: '',
                change: reportData.trends.ndvi.change,
                trend: reportData.trends.ndvi.trend,
                icon: '🛰️',
                color: 'green'
              },
              {
                title: 'Avg Temperature',
                value: reportData.summary.avgTemp,
                unit: '°C',
                change: reportData.trends.temperature.change,
                trend: reportData.trends.temperature.trend,
                icon: '🌡️',
                color: 'orange'
              },
              {
                title: 'Crop Health Score',
                value: reportData.summary.cropHealthScore,
                unit: '%',
                change: reportData.trends.cropHealth.change,
                trend: reportData.trends.cropHealth.trend,
                icon: '🌾',
                color: 'emerald'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{stat.icon}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getTrendIcon(stat.trend)}</span>
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
              </div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
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
                            <p className="text-sm text-gray-600">NDVI naik {reportData.trends.ndvi.change} menunjukkan kesehatan tanaman membaik</p>
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
                            <p className="text-sm text-gray-600">On-time delivery rate mencapai {reportData.supplyChain.suppliers.onTimeDelivery}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Performance vs Targets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { 
                          metric: 'NDVI Score', 
                          current: reportData.trends.ndvi.current, 
                          target: reportData.trends.ndvi.target,
                          unit: ''
                        },
                        { 
                          metric: 'Crop Health', 
                          current: reportData.trends.cropHealth.current, 
                          target: reportData.trends.cropHealth.target,
                          unit: '%'
                        },
                        { 
                          metric: 'Yield Efficiency', 
                          current: reportData.cropManagement.yield.efficiency, 
                          target: 100,
                          unit: '%'
                        },
                        { 
                          metric: 'Cost Efficiency', 
                          current: reportData.cropManagement.costs.efficiency, 
                          target: 90,
                          unit: '%'
                        }
                      ].map((item, index) => {
                        const percentage = (item.current / item.target) * 100;
                        return (
                          <div key={index} className="bg-white rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">{item.metric}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold">{item.current}{item.unit}</span>
                              <span className="text-sm text-gray-500">Target: {item.target}{item.unit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  percentage >= 90 ? 'bg-green-500' : 
                                  percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {percentage.toFixed(1)}% of target achieved
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Satellite Analysis Tab */}
              {activeTab === 'satellite' && (
                <div className="space-y-6">
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
                              <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
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
                              <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Image Quality</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.satelliteAnalysis.imageQuality).map(([quality, percentage]) => (
                          <div key={quality} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">
                              {quality.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Change Detection */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Land Use Changes (Ha)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(reportData.satelliteAnalysis.changeDetection).map(([change, area]) => (
                        <div key={change} className="bg-white rounded-lg p-4 text-center">
                          <div className="text-lg font-bold text-gray-900">{area}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {change.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Analysis Tab */}
              {activeTab === 'weather' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(reportData.weatherAnalysis).map(([category, data]) => (
                      <div key={category} className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4 capitalize flex items-center gap-2">
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
                                {category === 'precipitation' && key !== 'days' && key !== 'intensity' && key !== 'distribution' && key !== 'droughtRisk' && key !== 'floodRisk' ? 'mm' : ''}
                                {category === 'humidity' && typeof value === 'number' ? '%' : ''}
                                {category === 'windSpeed' && typeof value === 'number' && key !== 'direction' && key !== 'gustDays' ? ' km/h' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crop Management Tab */}
              {activeTab === 'crops' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Activities Overview</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(reportData.cropManagement.activities).map(([status, count]) => (
                          <div key={status} className="text-center bg-white rounded-lg p-4">
                            <div className={`text-2xl font-bold mb-1 ${
                              status === 'completed' ? 'text-green-600' :
                              status === 'ongoing' ? 'text-blue-600' : 
                              status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {count}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">{status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Area Summary (Ha)</h4>
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
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          Rp {(reportData.cropManagement.costs.total / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-sm text-gray-600">Total Investment</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          Rp {(reportData.cropManagement.costs.perHectare / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600">Per Hectare</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {reportData.cropManagement.costs.efficiency}%
                        </div>
                        <div className="text-sm text-gray-600">Efficiency</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {reportData.cropManagement.yield.efficiency}%
                        </div>
                        <div className="text-sm text-gray-600">Yield Efficiency</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-3">Cost Breakdown</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(reportData.cropManagement.costs.categories).map(([category, cost]) => (
                          <div key={category} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="capitalize text-gray-700">{category}</span>
                              <span className="font-medium">Rp {(cost / 1000000).toFixed(1)}M</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Supply Chain Tab */}
              {activeTab === 'supply' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Inventory Status</h4>
                      <div className="space-y-4">
                        {Object.entries(reportData.supplyChain.inventory).map(([item, data]) => (
                          <div key={item} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div>
                              <span className="capitalize text-gray-700 font-medium">{item}</span>
                              <div className="text-sm text-gray-500">
                                Rp {(data.value / 1000000).toFixed(1)}M • {data.daysRemaining || data.utilization} {data.daysRemaining ? 'days' : '% utilization'}
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
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700">Active Suppliers</span>
                          <span className="font-bold text-2xl text-blue-600">
                            {reportData.supplyChain.suppliers.active}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700">Performance Score</span>
                          <span className="font-bold text-2xl text-green-600">
                            {reportData.supplyChain.suppliers.performance}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700">On-time Delivery</span>
                          <span className="font-bold text-2xl text-emerald-600">
                            {reportData.supplyChain.suppliers.onTimeDelivery}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700">Quality Score</span>
                          <span className="font-bold text-2xl text-purple-600">
                            {reportData.supplyChain.suppliers.qualityScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Logistics Performance</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(reportData.supplyChain.logistics).map(([metric, value]) => (
                        <div key={metric} className="text-center bg-white rounded-lg p-4">
                          <div className="text-lg font-bold text-gray-900">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                            {metric.includes('Time') ? ' days' : 
                             metric.includes('Cost') ? '' : 
                             metric.includes('Efficiency') ? ' km/L' : 
                             metric.includes('Carbon') ? ' ton CO2' : ''}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {metric.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Recommendations</h3>
                    <p className="text-gray-600">
                      Rekomendasi berbasis analisis satelit, data cuaca, dan pola pertanian
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {reportData.recommendations.map((rec) => (
                      <div key={rec.id} className={`border-2 rounded-xl p-6 ${getPriorityColor(rec.priority)} hover:shadow-lg transition-shadow`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getPriorityColor(rec.priority)}`}>
                              {rec.priority} Priority
                            </span>
                            <span className="text-sm font-medium text-gray-600">{rec.category}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {rec.urgency}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">ROI: {rec.roi}</div>
                            <div className="text-sm font-medium text-gray-700">{rec.cost}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 text-lg">{rec.title}</h4>
                          <p className="text-gray-700">{rec.description}</p>
                          
                          <div className="bg-white/70 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Recommended Action:</h5>
                            <p className="text-gray-700 mb-3">{rec.action}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Expected Impact:</span>
                                <p className="text-sm text-green-700">{rec.impact}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Timeline:</span>
                                <p className="text-sm text-blue-700">{rec.timeline}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Investment:</span>
                                <p className="text-sm text-purple-700">{rec.cost}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Implement Now
                              </button>
                              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                                Schedule Later
                              </button>
                              <button className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors">
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Key Performance Indicators</h4>
                      <div className="space-y-4">
                        {Object.entries(reportData.analytics.kpi).map(([kpi, value]) => (
                          <div key={kpi} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">
                              {kpi.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-bold text-lg text-green-600">+{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Benchmarking Analysis</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">vs Industry Average</h5>
                          <div className="space-y-2">
                            {Object.entries(reportData.analytics.benchmarks.industryAverage).map(([metric, value]) => (
                              <div key={metric} className="flex justify-between text-sm">
                                <span className="capitalize">{metric}</span>
                                <span>{typeof value === 'number' ? value.toLocaleString() : value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">vs Best Practice</h5>
                          <div className="space-y-2">
                            {Object.entries(reportData.analytics.benchmarks.bestPractice).map(([metric, value]) => (
                              <div key={metric} className="flex justify-between text-sm">
                                <span className="capitalize">{metric}</span>
                                <span>{typeof value === 'number' ? value.toLocaleString() : value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Predictive Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">6.8 ton/ha</div>
                        <div className="text-sm text-gray-600">Predicted Yield</div>
                        <div className="text-xs text-green-600 mt-1">+12% vs last season</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">87%</div>
                        <div className="text-sm text-gray-600">Success Probability</div>
                        <div className="text-xs text-blue-600 mt-1">High confidence</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">45 days</div>
                        <div className="text-sm text-gray-600">Est. Harvest</div>
                        <div className="text-xs text-orange-600 mt-1">Weather dependent</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => exportReport('pdf')}
                disabled={exportLoading}
                className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
              >
                📄 {exportLoading ? 'Generating...' : 'Generate Full PDF Report'}
              </button>
              
              <button 
                onClick={() => exportReport('excel')}
                disabled={exportLoading}
                className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
              >
                📊 Export Data to Excel
              </button>
              
              <button 
                onClick={scheduleReport}
                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                📅 Schedule Auto Report
              </button>
              
              <button 
                onClick={shareReport}
                className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
              >
                📤 Share Report
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
              <p>Reports akan dikirim ke: {user?.email || 'admin@samikna.id'}</p>
              <p>Data quality: {reportData.metadata.dataQuality}% • Total data points: {reportData.metadata.totalDataPoints.toLocaleString()}</p>
              <p>Untuk laporan khusus atau konsultasi, hubungi tim support di admin@samikna.id</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ReportsPage);