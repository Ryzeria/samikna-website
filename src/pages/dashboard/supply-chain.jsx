import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiTruck, HiCube, HiCash, HiClock, HiExclamation,
  HiPlus, HiSearch, HiFilter, HiDownload, HiRefresh,
  HiEye, HiPencil, HiTrash, HiCheck, HiX, HiCalendar,
  HiLocationMarker, HiPhone, HiMail, HiStar, HiTrendingUp
} from 'react-icons/hi';
import { 
  FaSeedling, FaFlask, FaTractor, FaBoxes, FaIndustry,
  FaShippingFast, FaWarehouse, FaHandshake, FaChartLine,
  FaMapMarkedAlt, FaQrcode, FaFileInvoiceDollar
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const SupplyChainManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [supplyChainData, setSupplyChainData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        loadSupplyChainData(parsedUser);
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

  const loadSupplyChainData = async (userData = user) => {
    if (!userData) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/supply-chain?userId=${userData.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSupplyChainData(result.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch supply chain data');
      }
      
    } catch (error) {
      console.error('Error loading supply chain data:', error);
      setError(error.message);
      
      // Fallback to minimal dummy data if API fails
      setSupplyChainData(generateFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = () => ({
    overview: {
      totalItems: 0,
      totalValue: 0,
      activeSuppliers: 0,
      pendingOrders: 0,
      deliveredToday: 0,
      qualityScore: 94.2,
      onTimeDelivery: 92.3,
      costSavings: 15.7
    },
    inventory: [],
    suppliers: [],
    orders: [],
    analytics: {
      categoryDistribution: { seeds: 35, fertilizers: 28, pesticides: 18, equipment: 12, others: 7 },
      monthlySpending: [],
      supplierPerformance: {
        avgDeliveryTime: 5.2,
        qualityCompliance: 94.8,
        costEfficiency: 15.7,
        sustainabilityScore: 87.3
      }
    }
  });

  const handleCreateItem = async (itemData) => {
    try {
      const response = await fetch(`/api/supply-chain?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'create_item', data: itemData })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowAddForm(false);
        loadSupplyChainData(); // Reload data
        alert('Item created successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to create item'}`);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: HiCube },
    { id: 'inventory', label: 'Inventory Management', icon: FaWarehouse },
    { id: 'suppliers', label: 'Supplier Network', icon: FaHandshake },
    { id: 'orders', label: 'Order Tracking', icon: HiTruck },
    { id: 'analytics', label: 'Analytics & Reports', icon: FaChartLine }
  ];

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 border-green-200',
      good: 'bg-blue-100 text-blue-800 border-blue-200',
      adequate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-red-100 text-red-800 border-red-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      seeds: FaSeedling,
      fertilizers: FaFlask,
      pesticides: FaFlask,
      equipment: FaTractor,
      tools: FaBoxes,
      others: FaBoxes
    };
    return icons[category] || FaBoxes;
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

  const filteredInventory = supplyChainData?.inventory?.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (loading && !supplyChainData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Loading supply chain data...</p>
            <p className="text-gray-400 text-sm mt-2">Synchronizing with inventory systems</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !supplyChainData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiExclamation className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 text-lg mb-2">Failed to load supply chain data</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => loadSupplyChainData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <title>Supply Chain Management - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Comprehensive supply chain management for agricultural operations" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <FaShippingFast className="absolute top-4 right-4 w-24 h-24" />
              <FaIndustry className="absolute bottom-4 left-4 w-20 h-20" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    Supply Chain Management - {user?.kabupaten}
                  </h1>
                  <p className="text-indigo-100 text-lg mb-4">
                    Comprehensive agricultural supply chain orchestration platform
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Real-time Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaQrcode className="w-4 h-4" />
                      <span>Digital Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiTrendingUp className="w-4 h-4" />
                      <span>AI Optimization</span>
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
                    Add Item
                  </motion.button>
                  
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                    <HiDownload className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => loadSupplyChainData()}
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
                title: 'Total Items',
                value: supplyChainData?.overview?.totalItems || 0,
                unit: 'Items',
                icon: HiCube,
                color: 'blue',
                change: '+12 this month',
                trend: 'up'
              },
              {
                title: 'Total Value',
                value: ((supplyChainData?.overview?.totalValue || 0) / 1000000000).toFixed(1),
                unit: 'Billion IDR',
                icon: HiCash,
                color: 'green',
                change: `+${supplyChainData?.overview?.costSavings?.toFixed(1) || 15.7}% savings`,
                trend: 'up'
              },
              {
                title: 'Active Suppliers',
                value: supplyChainData?.overview?.activeSuppliers || 0,
                unit: 'Partners',
                icon: FaHandshake,
                color: 'purple',
                change: `${supplyChainData?.overview?.onTimeDelivery?.toFixed(1) || 96.5}% reliability`,
                trend: 'up'
              },
              {
                title: 'Delivery Performance',
                value: supplyChainData?.overview?.onTimeDelivery?.toFixed(1) || 0,
                unit: '% On-time',
                icon: HiClock,
                color: 'indigo',
                change: '+2.3% improvement',
                trend: 'up'
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
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
                      {typeof metric.value === 'number' ? 
                        metric.value < 1 ? metric.value.toFixed(1) : metric.value.toLocaleString() 
                        : metric.value
                      }
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
                        ? 'border-indigo-500 text-indigo-600'
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
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaWarehouse className="w-5 h-5 text-blue-600" />
                        Inventory Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Items</span>
                          <span className="font-bold text-gray-900">{supplyChainData?.overview?.totalItems || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Low Stock Items</span>
                          <span className="font-bold text-red-600">
                            {supplyChainData?.inventory?.filter(item => item.status === 'low').length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Value</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(supplyChainData?.overview?.totalValue || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <HiTruck className="w-5 h-5 text-green-600" />
                        Delivery Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">On-time Delivery</span>
                          <span className="font-bold text-green-600">
                            {supplyChainData?.overview?.onTimeDelivery?.toFixed(1) || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Delivered Today</span>
                          <span className="font-bold text-blue-600">
                            {supplyChainData?.overview?.deliveredToday || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Pending Orders</span>
                          <span className="font-bold text-yellow-600">
                            {supplyChainData?.overview?.pendingOrders || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaChartLine className="w-5 h-5 text-purple-600" />
                        Performance Metrics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Quality Score</span>
                          <span className="font-bold text-purple-600">
                            {supplyChainData?.overview?.qualityScore?.toFixed(1) || 94.2}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cost Savings</span>
                          <span className="font-bold text-green-600">
                            {supplyChainData?.overview?.costSavings?.toFixed(1) || 15.7}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Suppliers</span>
                          <span className="font-bold text-indigo-600">
                            {supplyChainData?.overview?.activeSuppliers || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Recent Supply Chain Activity</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Latest Deliveries</h4>
                        {supplyChainData?.orders?.filter(order => order.status === 'delivered').slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <HiCheck className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.supplierName}</p>
                            </div>
                            <span className="text-sm text-green-600 font-medium">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-gray-500">
                            <HiTruck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No recent deliveries</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Low Stock Alerts</h4>
                        {supplyChainData?.inventory?.filter(item => item.status === 'low' || item.status === 'critical').slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <HiExclamation className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.itemName}</p>
                              <p className="text-sm text-gray-600">Stock: {item.currentStock} {item.unit}</p>
                            </div>
                            <span className="text-sm text-red-600 font-medium capitalize">{item.status}</span>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-gray-500">
                            <FaWarehouse className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No low stock alerts</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
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
                        placeholder="Search inventory by name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="adequate">Adequate</option>
                        <option value="low">Low Stock</option>
                        <option value="critical">Critical</option>
                      </select>
                      
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <HiFilter className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inventory Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredInventory.length > 0 ? filteredInventory.map((item) => {
                      const CategoryIcon = getCategoryIcon(item.category);
                      const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;
                      
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <CategoryIcon className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{item.itemName}</h3>
                                <p className="text-xs text-gray-500">{item.sku}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Current Stock</span>
                              <span className="font-medium">{item.currentStock} {item.unit}</span>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Stock Level</span>
                                <span>{stockPercentage.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    stockPercentage > 70 ? 'bg-green-500' :
                                    stockPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Value</span>
                              <span className="font-bold text-green-600">{formatCurrency(item.totalValue)}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Location</span>
                              <span className="font-medium">{item.location || 'Not specified'}</span>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Last Updated</span>
                              <span>{formatDate(item.lastUpdated)}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium">
                              <HiEye className="w-3 h-3 inline mr-1" />
                              View
                            </button>
                            <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium">
                              <HiPencil className="w-3 h-3 inline mr-1" />
                              Edit
                            </button>
                          </div>
                        </motion.div>
                      );
                    }) : (
                      <div className="col-span-full text-center py-12">
                        <FaWarehouse className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Inventory Items</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first inventory item.</p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Add Item
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Suppliers Tab */}
              {activeTab === 'suppliers' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {supplyChainData?.suppliers?.length > 0 ? supplyChainData.suppliers.map((supplier) => (
                      <div key={supplier.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{supplier.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{supplier.category}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <HiStar className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-gray-900">{supplier.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                            <p className="font-bold text-gray-900">{supplier.totalOrders}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">On-time Delivery</p>
                            <p className="font-bold text-green-600">{supplier.onTimeDelivery}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Quality Score</p>
                            <p className="font-bold text-blue-600">{supplier.qualityScore}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Payment Terms</p>
                            <p className="font-medium text-gray-600">{supplier.paymentTerms}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <HiLocationMarker className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{supplier.city}, {supplier.province}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <HiPhone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{supplier.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <HiMail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{supplier.email}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {supplier.certification?.map((cert, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                            View Details
                          </button>
                          <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                            New Order
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full text-center py-12">
                        <FaHandshake className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Suppliers</h3>
                        <p className="text-gray-600">Add suppliers to manage your supply chain network.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    {supplyChainData?.orders?.length > 0 ? supplyChainData.orders.map((order) => (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.supplierName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order Date</p>
                            <p className="font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Expected Delivery</p>
                            <p className="font-medium text-gray-900">{formatDate(order.expectedDelivery)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                            <p className="font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Priority</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              order.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.priority}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-600">
                                  {item.quantity} {item.unit} × {formatCurrency(item.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                            Track Order
                          </button>
                          <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                            View Invoice
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <HiTruck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders</h3>
                        <p className="text-gray-600">Start by creating your first order.</p>
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
                      <h3 className="font-bold text-gray-900 mb-4">Category Distribution</h3>
                      <div className="space-y-3">
                        {Object.entries(supplyChainData?.analytics?.categoryDistribution || {}).map(([category, percentage]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-indigo-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(supplyChainData?.analytics?.supplierPerformance || {}).map(([metric, value]) => (
                          <div key={metric} className="text-center">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">
                              {typeof value === 'number' ? value.toFixed(1) : value}
                              {metric.includes('Time') ? ' days' : 
                               metric.includes('Score') || metric.includes('Compliance') || metric.includes('Efficiency') ? '%' : ''}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {metric.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Monthly Spending Trend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {supplyChainData?.analytics?.monthlySpending?.map((data, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-1">
                            {formatCurrency(data.amount)}
                          </div>
                          <div className="text-sm text-gray-600">{data.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Item Detail Modal */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedItem(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedItem.itemName}</h2>
                      <p className="text-gray-600">{selectedItem.sku}</p>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Current Stock</label>
                        <p className="text-xl font-bold text-gray-900">{selectedItem.currentStock} {selectedItem.unit}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Stock Range</label>
                        <p className="text-gray-900">Min: {selectedItem.minStock} | Max: {selectedItem.maxStock}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Unit Price</label>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(selectedItem.pricePerUnit)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Value</label>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(selectedItem.totalValue)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Supplier</label>
                        <p className="text-gray-900">{selectedItem.supplier}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Storage Location</label>
                        <p className="text-gray-900">{selectedItem.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Quality Grade</label>
                        <p className="text-gray-900">{selectedItem.qualityGrade || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Tracking Code</label>
                        <p className="text-gray-900 font-mono">{selectedItem.trackingCode || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Update Stock
                    </button>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Reorder
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Print QR
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Item Modal */}
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
                    <h2 className="text-2xl font-bold text-gray-900">Add New Inventory Item</h2>
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
                    const itemData = {
                      item_name: formData.get('item_name'),
                      category: formData.get('category'),
                      sku: formData.get('sku'),
                      current_stock: parseFloat(formData.get('current_stock')),
                      min_stock: parseFloat(formData.get('min_stock')),
                      max_stock: parseFloat(formData.get('max_stock')),
                      unit: formData.get('unit'),
                      unit_price: parseFloat(formData.get('unit_price')),
                      storage_location: formData.get('storage_location'),
                      supplier_id: formData.get('supplier_id')
                    };
                    handleCreateItem(itemData);
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Name
                        </label>
                        <input
                          type="text"
                          name="item_name"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter item name..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                          <option value="">Select Category</option>
                          <option value="seeds">Seeds</option>
                          <option value="fertilizers">Fertilizers</option>
                          <option value="pesticides">Pesticides</option>
                          <option value="equipment">Equipment</option>
                          <option value="tools">Tools</option>
                          <option value="others">Others</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          name="sku"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="SKU-001"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit of Measure
                        </label>
                        <input
                          type="text"
                          name="unit"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="kg, liter, unit"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Stock
                        </label>
                        <input
                          type="number"
                          name="current_stock"
                          step="0.01"
                          min="0"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Min Stock
                        </label>
                        <input
                          type="number"
                          name="min_stock"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="10"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Stock
                        </label>
                        <input
                          type="number"
                          name="max_stock"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="1000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price (IDR)
                        </label>
                        <input
                          type="number"
                          name="unit_price"
                          step="0.01"
                          min="0"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="35000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Storage Location
                        </label>
                        <input
                          type="text"
                          name="storage_location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Gudang A-1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {loading ? 'Creating...' : 'Create Item'}
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

export default withAuth(SupplyChainManagement);