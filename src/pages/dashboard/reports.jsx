import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const ReportsPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        generateReportData(parsed);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [dateRange]);

  const generateReportData = async (userData) => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?userId=${userData.id}&kabupaten=${userData.kabupaten}&dateRange=${dateRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setReportData(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback to sample data if API fails
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    // Fallback sample data
    const currentDate = new Date();
    const daysAgo = parseInt(dateRange) || 30;
    
    setReportData({
      metadata: {
        generatedAt: currentDate.toISOString(),
        dateRange: `${dateRange} days`,
        location: user?.kabupaten || 'Unknown',
        dataQuality: 94.5,
        totalDataPoints: 15847
      },
      summary: {
        totalArea: 2847,
        monitoredFields: 145,
        avgNDVI: 0.68,
        avgTemperature: 28.4,
        completionRate: 87.3,
        productivityScore: 92.1,
        sustainabilityScore: 85.7,
        efficiencyScore: 89.4
      },
      trends: {
        ndvi: { 
          current: 0.68, 
          previous: 0.65, 
          change: '+4.6%', 
          trend: 'up'
        },
        temperature: { 
          current: 28.4, 
          previous: 29.2, 
          change: '-2.7%', 
          trend: 'down'
        },
        rainfall: { 
          current: 234.5, 
          previous: 198.3, 
          change: '+18.3%', 
          trend: 'up'
        },
        activities: {
          total: 55,
          completed: 23,
          ongoing: 12,
          planned: 20
        }
      },
      satelliteAnalysis: {
        ndviAnalysis: {
          excellent: 34.2,
          good: 41.8,
          moderate: 18.7,
          poor: 5.3
        },
        cloudCoverage: {
          clear: 85.2,
          partial: 12.3,
          cloudy: 2.5
        },
        dataQuality: '85.2',
        avgNDVI: '0.68',
        coverage: 89
      },
      weatherAnalysis: {
        temperature: { 
          avg: 28.4, 
          min: 22.1, 
          max: 35.7,
          extremeDays: 3
        },
        rainfall: { 
          total: 234.5, 
          days: 18, 
          avg: 13.0,
          maxDaily: 45.2
        },
        humidity: { 
          avg: 78.2, 
          min: 45.6, 
          max: 95.8
        },
        conditions: {
          sunny: 12,
          cloudy: 8,
          rainy: 10
        }
      },
      cropManagement: {
        overview: {
          totalFields: 145,
          totalArea: '2847.50',
          avgHealthScore: '87.3',
          totalActivities: 55
        },
        activities: {
          planting: 15,
          fertilizing: 12,
          harvesting: 8,
          maintenance: 20
        },
        costs: {
          total: 245000000,
          perHectare: 86100,
          byType: {
            seeds: 65000000,
            fertilizers: 89000000,
            pesticides: 34000000,
            equipment: 57000000
          }
        },
        performance: {
          completedActivities: 23,
          ongoingActivities: 12,
          plannedActivities: 20
        }
      },
      supplyChain: {
        inventory: {
          totalItems: 156,
          totalValue: 234000000,
          lowStockItems: 8,
          categories: {
            seeds: 45,
            fertilizers: 38,
            pesticides: 29,
            equipment: 44
          }
        },
        suppliers: {
          total: 23,
          active: 19,
          avgRating: 4.2
        },
        orders: {
          total: 67,
          totalValue: 189000000,
          pending: 5,
          completed: 58
        }
      },
      recommendations: [
        {
          id: 1,
          category: 'Satellite Analysis',
          priority: 'high',
          title: 'Optimalisasi Area NDVI Rendah',
          description: 'Area dengan NDVI < 0.5 di sektor C-7 memerlukan perhatian khusus',
          action: 'Aplikasi pupuk nitrogen tambahan dan peningkatan sistem irigasi',
          impact: 'Peningkatan produktivitas hingga 15%',
          cost: 'Rp 25,000,000',
          timeline: '2-3 minggu',
          urgency: 'Immediate'
        },
        {
          id: 2,
          category: 'Weather Management',
          priority: 'medium',
          title: 'Antisipasi Musim Hujan',
          description: 'Prediksi curah hujan tinggi dalam 2 bulan ke depan',
          action: 'Persiapan sistem drainase dan proteksi tanaman',
          impact: 'Pencegahan kerugian akibat banjir',
          cost: 'Rp 15,000,000',
          timeline: '1 bulan',
          urgency: 'Soon'
        }
      ],
      analytics: {
        kpi: {
          totalArea: 2847,
          monitoredFields: 145,
          avgNDVI: '0.68',
          avgTemperature: '28.4',
          completionRate: '87.3',
          productivityScore: 92,
          sustainabilityScore: 86,
          efficiencyScore: 89
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
      },
      alerts: [
        {
          id: 1,
          alert_type: 'weather',
          severity: 'medium',
          title: 'Cuaca Ekstrem Berpotensi',
          message: 'Prediksi hujan lebat dalam 48 jam ke depan'
        }
      ],
      charts: {
        ndviTrend: Array.from({length: 30}, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 0.6 + Math.random() * 0.2
        })),
        temperatureTrend: Array.from({length: 30}, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 26 + Math.random() * 8
        })),
        rainfallTrend: Array.from({length: 30}, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.random() * 50
        }))
      }
    });
  };

  const tabs = [
    { id: 'overview', label: 'Executive Summary' },
    { id: 'satellite', label: 'Satellite Analysis' },
    { id: 'weather', label: 'Weather Analysis' },
    { id: 'crops', label: 'Crop Management' },
    { id: 'supply', label: 'Supply Chain' },
    { id: 'recommendations', label: 'AI Recommendations' },
    { id: 'analytics', label: 'Advanced Analytics' }
  ];

  const dateRanges = [
    { value: '7', label: '7 Hari Terakhir' },
    { value: '30', label: '30 Hari Terakhir' },
    { value: '90', label: '3 Bulan Terakhir' },
    { value: '180', label: '6 Bulan Terakhir' },
    { value: '365', label: '1 Tahun Terakhir' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const exportFormats = [
    { format: 'pdf', label: 'PDF Report', icon: '📄', color: 'red' },
    { format: 'excel', label: 'Excel Data', icon: '📊', color: 'green' },
    { format: 'csv', label: 'CSV Data', icon: '📋', color: 'blue' },
    { format: 'json', label: 'JSON Data', icon: '📄', color: 'purple' }
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
      const response = await fetch(`/api/reports?userId=${user.id}&kabupaten=${user.kabupaten}&dateRange=${dateRange}&format=${format}`);
      
      if (response.ok) {
        if (format === 'json' || format === 'csv') {
          // Handle direct downloads
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          const timestamp = new Date().toISOString().split('T')[0];
          a.href = url;
          a.download = `SAMIKNA_Report_${user.kabupaten}_${timestamp}.${format}`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          // Handle async exports (PDF, Excel)
          const result = await response.json();
          if (result.success) {
            alert(result.message);
          }
        }
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengekspor laporan. Silakan coba lagi.');
    } finally {
      setExportLoading(false);
    }
  };

  const scheduleReport = async () => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule',
          userId: user.id,
          kabupaten: user.kabupaten,
          reportConfig: {
            frequency: 'weekly',
            format: 'pdf',
            email: user.email
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Laporan otomatis berhasil dijadwalkan. Email laporan akan dikirim setiap minggu ke ${user.email}`);
      }
    } catch (error) {
      console.error('Schedule error:', error);
      alert('Gagal menjadwalkan laporan otomatis.');
    }
  };

  const shareReport = () => {
    const shareData = {
      title: `SAMIKNA Report - ${user?.kabupaten}`,
      text: `Laporan komprehensif pertanian ${user?.kabupaten} periode ${dateRange} hari`,
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">🛰️</div>
              <div className="absolute bottom-4 left-4 text-5xl">📊</div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    📋 Laporan Komprehensif {user?.kabupaten}
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
                    onClick={() => generateReportData(user)}
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
                value: reportData.summary.avgTemperature,
                unit: '°C',
                change: reportData.trends.temperature.change,
                trend: reportData.trends.temperature.trend,
                icon: '🌡️',
                color: 'orange'
              },
              {
                title: 'Productivity Score',
                value: reportData.summary.productivityScore,
                unit: '%',
                change: '+5.2%',
                trend: 'up',
                icon: '📈',
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
                      <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Key Performance Indicators</h3>
                      <div className="space-y-4">
                        {Object.entries(reportData.trends).map(([key, data]) => {
                          if (typeof data !== 'object' || !data.current) return null;
                          return (
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
                                  {getTrendIcon(data.trend)} {data.change}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">✨ Quick Insights</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Vegetation Health Improving</p>
                            <p className="text-sm text-gray-600">NDVI naik {reportData.trends.ndvi.change} menunjukkan kesehatan tanaman membaik</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">Optimal Weather Conditions</p>
                            <p className="text-sm text-gray-600">Curah hujan dan suhu dalam rentang ideal untuk pertumbuhan</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-900">High Activity Completion</p>
                            <p className="text-sm text-gray-600">Tingkat penyelesaian aktivitas mencapai {reportData.summary.completionRate}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Performance vs Targets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { 
                          metric: 'NDVI Score', 
                          current: parseFloat(reportData.summary.avgNDVI), 
                          target: 0.75,
                          unit: ''
                        },
                        { 
                          metric: 'Productivity', 
                          current: reportData.summary.productivityScore, 
                          target: 95,
                          unit: '%'
                        },
                        { 
                          metric: 'Sustainability', 
                          current: reportData.summary.sustainabilityScore, 
                          target: 90,
                          unit: '%'
                        },
                        { 
                          metric: 'Efficiency', 
                          current: reportData.summary.efficiencyScore, 
                          target: 92,
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
                                className={`h-2 rounded-full transition-all ${
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
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">🛰️ Satellite Data Analysis</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📊 NDVI Health Distribution</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.satelliteAnalysis.ndviAnalysis).map(([status, percentage]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                status === 'excellent' ? 'bg-green-600' :
                                status === 'good' ? 'bg-green-400' :
                                status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              {status}
                            </span>
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
                      <h4 className="font-bold text-gray-900 mb-4">☁️ Cloud Coverage</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.satelliteAnalysis.cloudCoverage).map(([quality, percentage]) => (
                          <div key={quality} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">
                              {quality.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📈 Data Quality Metrics</h4>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {reportData.satelliteAnalysis.dataQuality}%
                          </div>
                          <div className="text-sm text-gray-600">Clear Images</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {reportData.satelliteAnalysis.avgNDVI}
                          </div>
                          <div className="text-sm text-gray-600">Average NDVI</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600 mb-1">
                            {reportData.satelliteAnalysis.coverage}
                          </div>
                          <div className="text-sm text-gray-600">Images Processed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Analysis Tab */}
              {activeTab === 'weather' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">🌤️ Weather Data Analysis</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(reportData.weatherAnalysis).map(([category, data]) => {
                      if (category === 'conditions') return null;
                      
                      const icons = {
                        temperature: '🌡️',
                        rainfall: '🌧️',
                        humidity: '💧'
                      };
                      const icon = icons[category] || '☀️';

                      return (
                        <div key={category} className="bg-gray-50 rounded-xl p-6">
                          <h4 className="font-bold text-gray-900 mb-4 capitalize">
                            {icon} {category}
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
                                  {category === 'rainfall' && key !== 'days' ? 'mm' : ''}
                                  {category === 'humidity' && typeof value === 'number' ? '%' : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">🌦️ Weather Conditions</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.weatherAnalysis.conditions).map(([condition, days]) => (
                          <div key={condition} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 flex items-center gap-2">
                              {condition === 'sunny' && '☀️'}
                              {condition === 'cloudy' && '☁️'}
                              {condition === 'rainy' && '🌧️'}
                              {condition}
                            </span>
                            <span className="font-medium">{days} days</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Crop Management Tab */}
              {activeTab === 'crops' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">🌾 Crop Management Analysis</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📊 Activities Overview</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(reportData.trends.activities).map(([status, count]) => (
                          <div key={status} className="text-center bg-white rounded-lg p-4">
                            <div className={`text-2xl font-bold mb-1 ${
                              status === 'completed' ? 'text-green-600' :
                              status === 'ongoing' ? 'text-blue-600' : 
                              status === 'planned' ? 'text-yellow-600' : 'text-gray-600'
                            }`}>
                              {count}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">{status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📍 Field Summary</h4>
                      <div className="space-y-3">
                        {Object.entries(reportData.cropManagement.overview).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-medium">
                              {value} {key.includes('Area') ? 'Ha' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">💰 Cost Analysis</h4>
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
                          {reportData.trends.activities.completed}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {reportData.summary.completionRate}%
                        </div>
                        <div className="text-sm text-gray-600">Efficiency</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-3">📊 Cost Breakdown</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(reportData.cropManagement.costs.byType).map(([category, cost]) => (
                          <div key={category} className="text-sm bg-white rounded-lg p-3">
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
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">🚛 Supply Chain Analysis</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📦 Inventory Status</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div>
                            <span className="text-gray-700 font-medium">Total Items</span>
                            <div className="text-sm text-gray-500">
                              Value: Rp {(reportData.supplyChain.inventory.totalValue / 1000000).toFixed(1)}M
                            </div>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">
                            {reportData.supplyChain.inventory.totalItems}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700 font-medium">Low Stock Items</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reportData.supplyChain.inventory.lowStockItems > 10 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reportData.supplyChain.inventory.lowStockItems}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">👥 Supplier Performance</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700 font-medium">Active Suppliers</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {reportData.supplyChain.suppliers.active}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700 font-medium">Average Rating</span>
                          <span className="text-2xl font-bold text-green-600">
                            {reportData.supplyChain.suppliers.avgRating.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-gray-700 font-medium">Total Orders</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {reportData.supplyChain.orders.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">🛒 Order Performance</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">
                          Rp {(reportData.supplyChain.orders.totalValue / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-sm text-gray-600">Total Value</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {reportData.supplyChain.orders.completed}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">
                          {reportData.supplyChain.orders.pending}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {((reportData.supplyChain.orders.completed / reportData.supplyChain.orders.total) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">🤖 AI-Powered Recommendations</h3>
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
                            <div className="text-sm text-gray-500">Cost: {rec.cost}</div>
                            <div className="text-sm font-medium text-gray-700">{rec.timeline}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 text-lg">{rec.title}</h4>
                          <p className="text-gray-700">{rec.description}</p>
                          
                          <div className="bg-white/70 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-2">🔬 Recommended Action:</h5>
                            <p className="text-gray-700 mb-3">{rec.action}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Expected Impact:</span>
                                <p className="text-sm text-green-700">{rec.impact}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Timeline:</span>
                                <p className="text-sm text-blue-700">{rec.timeline}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                ✅ Implement Now
                              </button>
                              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                                ⏰ Schedule Later
                              </button>
                              <button className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors">
                                👁️ Learn More
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
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">📊 Advanced Analytics</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📈 Key Performance Indicators</h4>
                      <div className="space-y-4">
                        {Object.entries(reportData.analytics.kpi).map(([kpi, value]) => (
                          <div key={kpi} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">
                              {kpi.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-bold text-lg text-green-600">
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">📊 Benchmarking Analysis</h4>
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
                    <h4 className="font-bold text-gray-900 mb-4">🔮 Predictive Analytics</h4>
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
              <p>📧 Reports akan dikirim ke: {user?.email || 'admin@samikna.id'}</p>
              <p>📊 Data quality: {reportData.metadata.dataQuality}% • 📈 Total data points: {reportData.metadata.totalDataPoints.toLocaleString()}</p>
              <p>Untuk laporan khusus atau konsultasi, hubungi tim support di admin@samikna.id</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ReportsPage);