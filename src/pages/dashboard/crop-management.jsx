import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  HiPlus, HiSearch, HiFilter, HiCalendar, HiClock, HiLocationMarker,
  HiEye, HiPencil, HiTrash, HiCheck, HiX, HiDownload, HiRefresh,
  HiExclamation, HiInformationCircle, HiChartBar, HiTrendingUp,
  HiStar, HiPlay, HiPause, HiCamera, HiCog
} from 'react-icons/hi';
import { 
  FaSeedling, FaLeaf, FaWheat, FaTractor, FaFlask, FaThermometerHalf,
  FaTint, FaCloud, FaSun, FaRobot, FaMapMarkedAlt, FaClipboardList,
  FaDollarSign, FaChartLine, FaCalendarAlt, FaFileAlt
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const CropManagement = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCrop, setFilterCrop] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        loadCropData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Invalid user data');
        setLoading(false);
      }
    } else {
      setError('No user data found');
      setLoading(false);
    }
  }, []);

  const loadCropData = async (userData = user) => {
    if (!userData) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/crop-management?userId=${userData.id}&kabupaten=${userData.kabupaten}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCropData(result.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch crop management data');
      }
      
    } catch (error) {
      console.error('Error loading crop management data:', error);
      setError(error.message);
      
      // Fallback to minimal dummy data if API fails
      setCropData(generateFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = () => ({
    overview: {
      totalFields: 0,
      totalArea: 0,
      activeActivities: 0,
      completedTasks: 0,
      avgHealthScore: 85,
      totalInvestment: 0,
      estimatedYield: 0,
      weatherAlerts: 0
    },
    fields: [],
    activities: [],
    analytics: {
      productivity: { currentSeason: 0, lastSeason: 0, target: 8.0, trend: 'stable' },
      costs: { total: 0, perHectare: 0, breakdown: {} },
      efficiency: { waterUsage: 85, fertilizer: 78, labor: 92, equipment: 88 }
    },
    weather: {
      current: { temperature: 28, humidity: 75, rainfall: 0, windSpeed: 8, uvIndex: 6 },
      forecast: []
    },
    recommendations: []
  });

  const handleCreateActivity = async (activityData) => {
    try {
      const response = await fetch(`/api/crop-management?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'create_activity', data: activityData })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowAddForm(false);
        loadCropData(); // Reload data
        alert('Activity created successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to create activity'}`);
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create activity');
    }
  };

  const handleCreateField = async (fieldData) => {
    try {
      const response = await fetch(`/api/crop-management?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'create_field', data: fieldData })
      });

      const result = await response.json();
      
      if (result.success) {
        loadCropData(); // Reload data
        alert('Field created successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to create field'}`);
      }
    } catch (error) {
      console.error('Error creating field:', error);
      alert('Failed to create field');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: HiChartBar },
    { id: 'fields', label: 'Field Management', icon: FaMapMarkedAlt },
    { id: 'activities', label: 'Activity Tracking', icon: FaClipboardList },
    { id: 'analytics', label: 'Performance Analytics', icon: FaChartLine },
    { id: 'recommendations', label: 'AI Recommendations', icon: FaRobot }
  ];

  const activityTypes = [
    { id: 'planting', label: 'Penanaman', icon: FaSeedling, color: 'green' },
    { id: 'fertilizing', label: 'Pemupukan', icon: FaFlask, color: 'blue' },
    { id: 'irrigation', label: 'Irigasi', icon: FaTint, color: 'cyan' },
    { id: 'pest_control', label: 'Pengendalian Hama', icon: FaLeaf, color: 'red' },
    { id: 'harvesting', label: 'Panen', icon: FaWheat, color: 'yellow' },
    { id: 'monitoring', label: 'Monitoring', icon: FaTractor, color: 'gray' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      urgent: 'bg-red-100 text-red-800 border-red-200',
      ready_harvest: 'bg-purple-100 text-purple-800 border-purple-200',
      ongoing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      planned: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      normal: 'bg-blue-500',
      low: 'bg-gray-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredActivities = cropData?.activities?.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.fieldName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    const matchesCrop = filterCrop === 'all' || 
                       cropData.fields?.find(field => field.id === activity.fieldId)?.cropType === filterCrop;
    return matchesSearch && matchesStatus && matchesCrop;
  }) || [];

  const handleViewField = (fieldId) => {
    router.push(`/dashboard/maps?field=${fieldId}`);
  };

  if (loading && !cropData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Loading crop management data...</p>
            <p className="text-gray-400 text-sm mt-2">Analyzing field conditions and activities</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !cropData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiExclamation className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 text-lg mb-2">Failed to load crop management data</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => loadCropData()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Crop Management - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Comprehensive crop management system with satellite monitoring and precision agriculture" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <FaSeedling className="absolute top-4 right-4 w-24 h-24" />
              <FaTractor className="absolute bottom-4 left-4 w-20 h-20" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    Smart Crop Management - {user?.kabupaten}
                  </h1>
                  <p className="text-green-100 text-lg mb-4">
                    Integrated precision agriculture with satellite monitoring and AI-driven insights
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaRobot className="w-4 h-4" />
                      <span>AI Recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkedAlt className="w-4 h-4" />
                      <span>{cropData?.overview?.totalFields || 0} Active Fields</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="w-4 h-4" />
                      <span>Updated: {lastUpdate.toLocaleTimeString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add Activity
                  </motion.button>
                  
                  <button 
                    onClick={() => router.push('/dashboard/reports')}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  >
                    <HiDownload className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => loadCropData()}
                    disabled={loading}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2">
                <HiExclamation className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800">Warning: Some data may be cached due to connectivity issues.</span>
              </div>
            </motion.div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Fields',
                value: cropData?.overview?.totalFields || 0,
                unit: 'Fields',
                icon: FaMapMarkedAlt,
                color: 'blue',
                change: '+3 this season',
                onClick: () => setActiveTab('fields')
              },
              {
                title: 'Total Area',
                value: (cropData?.overview?.totalArea || 0).toFixed(1),
                unit: 'Hectares',
                icon: FaSeedling,
                color: 'green',
                change: `Avg health: ${cropData?.overview?.avgHealthScore?.toFixed(0) || 85}%`,
                onClick: () => setActiveTab('analytics')
              },
              {
                title: 'Active Activities',
                value: cropData?.overview?.activeActivities || 0,
                unit: 'Tasks',
                icon: FaClipboardList,
                color: 'yellow',
                change: `${cropData?.overview?.completedTasks || 0} completed`,
                onClick: () => setActiveTab('activities')
              },
              {
                title: 'Total Investment',
                value: ((cropData?.overview?.totalInvestment || 0) / 1000000).toFixed(1),
                unit: 'Million IDR',
                icon: FaDollarSign,
                color: 'purple',
                change: 'ROI tracking',
                onClick: () => setActiveTab('analytics')
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                onClick={metric.onClick}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">{metric.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </span>
                    <span className="text-gray-500 text-sm">{metric.unit}</span>
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
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
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
                  {/* Weather Widget */}
                  {cropData?.weather && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCloud className="w-5 h-5 text-blue-600" />
                        Current Weather Conditions
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <FaThermometerHalf className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.temperature}°C</div>
                          <div className="text-sm text-gray-600">Temperature</div>
                        </div>
                        <div className="text-center">
                          <FaTint className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.humidity}%</div>
                          <div className="text-sm text-gray-600">Humidity</div>
                        </div>
                        <div className="text-center">
                          <FaCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.rainfall}mm</div>
                          <div className="text-sm text-gray-600">Rainfall</div>
                        </div>
                        <div className="text-center">
                          <FaLeaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.windSpeed}km/h</div>
                          <div className="text-sm text-gray-600">Wind Speed</div>
                        </div>
                        <div className="text-center">
                          <FaSun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.uvIndex}</div>
                          <div className="text-sm text-gray-600">UV Index</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Activities and Field Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Recent Activities</h3>
                      <div className="space-y-3">
                        {cropData?.activities?.slice(0, 4).map((activity) => (
                          <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(activity.priority)}`} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                              <p className="text-xs text-gray-600">{activity.fieldName}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-gray-500">
                            <FaClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No recent activities</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Field Status Summary</h3>
                      <div className="space-y-3">
                        {cropData?.fields?.slice(0, 3).map((field) => (
                          <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              field.healthScore >= 85 ? 'bg-green-100' :
                              field.healthScore >= 70 ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <FaSeedling className={`w-5 h-5 ${
                                field.healthScore >= 85 ? 'text-green-600' :
                                field.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{field.name}</p>
                              <p className="text-xs text-gray-600">{field.area} Ha • {field.variety}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">{field.healthScore}%</div>
                              <div className="text-xs text-gray-500">Health</div>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-gray-500">
                            <FaMapMarkedAlt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No fields registered</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Fields Tab */}
              {activeTab === 'fields' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {cropData?.fields?.length > 0 ? cropData.fields.map((field) => (
                      <motion.div
                        key={field.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => handleViewField(field.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{field.name}</h3>
                            <p className="text-sm text-gray-600">{field.location || 'Location not specified'}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(field.status)}`}>
                            {field.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Area</p>
                            <p className="font-bold text-gray-900">{field.area} Ha</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Health Score</p>
                            <p className={`font-bold ${
                              field.healthScore >= 85 ? 'text-green-600' :
                              field.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {field.healthScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Growth Stage</p>
                            <p className="font-medium text-gray-900 capitalize">{field.growthStage || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">NDVI</p>
                            <p className="font-bold text-blue-600">{field.ndvi || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Crop:</span>
                            <span className="font-medium capitalize">{field.cropType} - {field.variety || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Supervisor:</span>
                            <span className="font-medium">{field.supervisor || 'Not assigned'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Activity:</span>
                            <span className="font-medium text-blue-600">{field.nextActivity}</span>
                          </div>
                        </div>

                        {field.notes && (
                          <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                            <p className="text-sm text-yellow-800">{field.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewField(field.id);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <HiEye className="w-3 h-3 inline mr-1" />
                            View Map
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedActivity(field);
                            }}
                            className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <HiPencil className="w-3 h-3 inline mr-1" />
                            Manage
                          </button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="col-span-full text-center py-12">
                        <FaMapMarkedAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Registered</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first agricultural field to begin monitoring.</p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add Field
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative">
                      <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="planned">Planned</option>
                      </select>
                      
                      <select
                        value={filterCrop}
                        onChange={(e) => setFilterCrop(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">All Crops</option>
                        <option value="padi">Padi</option>
                        <option value="jagung">Jagung</option>
                        <option value="kedelai">Kedelai</option>
                        <option value="tebu">Tebu</option>
                        <option value="cabai">Cabai</option>
                      </select>
                    </div>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-4">
                    {filteredActivities.length > 0 ? filteredActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        layout
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${
                              activityTypes.find(type => type.id === activity.activityType)?.color || 'gray'
                            }-100`}>
                              {(() => {
                                const ActivityIcon = activityTypes.find(type => type.id === activity.activityType)?.icon || FaClipboardList;
                                return <ActivityIcon className={`w-6 h-6 text-${
                                  activityTypes.find(type => type.id === activity.activityType)?.color || 'gray'
                                }-600`} />;
                              })()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{activity.title}</h3>
                              <p className="text-sm text-gray-600">{activity.fieldName} • {activity.area} Ha</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(activity.priority)}`} />
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{activity.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Scheduled Date</p>
                            <p className="font-medium text-gray-900">{formatDate(activity.scheduledDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Duration</p>
                            <p className="font-medium text-gray-900">{activity.duration} hours</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Workers</p>
                            <p className="font-medium text-gray-900">{activity.workers} people</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Cost</p>
                            <p className="font-bold text-green-600">{formatCurrency(activity.cost)}</p>
                          </div>
                        </div>

                        <div className="border-t pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Materials Required</h4>
                            <div className="space-y-1">
                              {activity.materials?.length > 0 ? activity.materials.map((material, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{material.name}</span>
                                  <span className="text-gray-600">
                                    {material.quantity} {material.unit} • {formatCurrency(material.cost)}
                                  </span>
                                </div>
                              )) : (
                                <p className="text-sm text-gray-500">No materials specified</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Equipment & Notes</h4>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Equipment:</strong> {activity.equipment?.length > 0 ? activity.equipment.join(', ') : 'Not specified'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <strong>Supervisor:</strong> {activity.supervisor}
                            </div>
                            {activity.notes && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                                {activity.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => setSelectedActivity(activity)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <HiEye className="w-3 h-3 inline mr-1" />
                            View Details
                          </button>
                          {activity.status !== 'completed' && (
                            <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                              <HiCheck className="w-3 h-3 inline mr-1" />
                              Mark Complete
                            </button>
                          )}
                          <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                            <HiPencil className="w-3 h-3 inline mr-1" />
                            Edit
                          </button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-12">
                        <FaClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first crop activity.</p>
                        <button
                          onClick={() => {
                            setAddFormType('activity');
                            setShowAddForm(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add Activity
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Productivity Analysis</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Season Yield</span>
                          <span className="text-2xl font-bold text-green-600">
                            {cropData?.analytics?.productivity?.currentSeason || 0} ton/ha
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Last Season</span>
                          <span className="font-medium text-gray-900">
                            {cropData?.analytics?.productivity?.lastSeason || 0} ton/ha
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Target</span>
                          <span className="font-medium text-blue-600">
                            {cropData?.analytics?.productivity?.target || 8.0} ton/ha
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(100, ((cropData?.analytics?.productivity?.currentSeason || 0) / (cropData?.analytics?.productivity?.target || 8.0)) * 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          Progress: {(((cropData?.analytics?.productivity?.currentSeason || 0) / (cropData?.analytics?.productivity?.target || 8.0)) * 100).toFixed(1)}% of target
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                      <div className="space-y-3">
                        {Object.entries(cropData?.analytics?.costs?.breakdown || {}).map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{ width: `${Math.min(100, (amount / (cropData?.analytics?.costs?.total || 1)) * 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">Total Investment</span>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(cropData?.analytics?.costs?.total || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600">Cost per Hectare</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(cropData?.analytics?.costs?.perHectare || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Efficiency Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.entries(cropData?.analytics?.efficiency || {}).map(([metric, score]) => (
                        <div key={metric} className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-3">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-gray-200"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
                                className={`${
                                  score >= 85 ? 'text-green-500' :
                                  score >= 70 ? 'text-yellow-500' : 'text-red-500'
                                } transition-all duration-1000`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-900">{score}%</span>
                            </div>
                          </div>
                          <p className="text-gray-600 font-medium text-sm capitalize">
                            {metric.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FaRobot className="w-5 h-5 text-purple-600" />
                      AI-Powered Agricultural Recommendations
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Based on satellite data analysis, weather patterns, and crop performance metrics
                    </p>
                  </div>

                  <div className="space-y-4">
                    {cropData?.recommendations?.length > 0 ? cropData.recommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        whileHover={{ scale: 1.01 }}
                        className={`border rounded-xl p-6 ${
                          rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                          rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                          'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              rec.type === 'irrigation' ? 'bg-blue-100' :
                              rec.type === 'fertilizer' ? 'bg-green-100' :
                              rec.type === 'pest_control' ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                              {rec.type === 'irrigation' && <FaTint className="w-5 h-5 text-blue-600" />}
                              {rec.type === 'fertilizer' && <FaFlask className="w-5 h-5 text-green-600" />}
                              {rec.type === 'pest_control' && <FaLeaf className="w-5 h-5 text-red-600" />}
                            </div>
                            <div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {rec.priority} Priority
                              </span>
                              <p className="text-sm text-gray-600 mt-1">{rec.field}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{formatCurrency(rec.cost)}</span>
                        </div>

                        <h4 className="font-bold text-gray-900 text-lg mb-2">{rec.title}</h4>
                        <p className="text-gray-700 mb-4">{rec.description}</p>
                        
                        <div className="bg-white/70 rounded-lg p-4 mb-4">
                          <h5 className="font-semibold text-gray-900 mb-2">Recommended Action:</h5>
                          <p className="text-gray-700 mb-3">{rec.action}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-600">Expected Benefit:</span>
                              <p className="text-sm text-green-700 font-medium">{rec.expectedBenefit}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Timeframe:</span>
                              <p className="text-sm text-blue-700 font-medium">{rec.timeframe}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Implement Recommendation
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                            Learn More
                          </button>
                          <button 
                            onClick={() => router.push('/dashboard/chatbot')}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                          >
                            Ask AI
                          </button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-12">
                        <FaRobot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
                        <p className="text-gray-600">AI recommendations will appear here based on your field data and conditions.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Add Activity Modal */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Activity</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const activityData = {
                      field_id: formData.get('field_id'),
                      activity_type: formData.get('activity_type'),
                      activity_title: formData.get('activity_title'),
                      activity_description: formData.get('activity_description'),
                      scheduled_date: formData.get('scheduled_date'),
                      duration_hours: parseFloat(formData.get('duration_hours')) || 0,
                      workers_count: parseInt(formData.get('workers_count')) || 1,
                      total_cost: parseFloat(formData.get('total_cost')) || 0,
                      priority_level: formData.get('priority_level'),
                      supervisor_name: formData.get('supervisor_name'),
                      activity_notes: formData.get('activity_notes')
                    };
                    handleCreateActivity(activityData);
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Activity Type
                        </label>
                        <select name="activity_type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option value="">Select Activity</option>
                          {activityTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field
                        </label>
                        <select name="field_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option value="">Select Field</option>
                          {cropData?.fields?.map((field) => (
                            <option key={field.id} value={field.id}>{field.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activity Title
                      </label>
                      <input
                        type="text"
                        name="activity_title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter activity title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="activity_description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Describe the activity..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Scheduled Date
                        </label>
                        <input
                          type="date"
                          name="scheduled_date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="8"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workers Needed
                        </label>
                        <input
                          type="number"
                          name="workers_count"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="6"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Cost (IDR)
                        </label>
                        <input
                          type="number"
                          name="total_cost"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="5000000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority Level
                        </label>
                        <select name="priority_level" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supervisor Name
                        </label>
                        <input
                          type="text"
                          name="supervisor_name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Supervisor name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="activity_notes"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Additional notes..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {loading ? 'Creating...' : 'Create Activity'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(CropManagement);