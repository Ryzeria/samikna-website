import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { withAuth } from '../../lib/authMiddleware';

// Import DashboardLayout with a fallback
let DashboardLayout;
try {
  DashboardLayout = require('../../components/dashboard/DashboardLayout').default;
} catch (error) {
  console.error('DashboardLayout import error:', error);
  // Fallback minimal layout
  DashboardLayout = ({ children }) => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold">SAMIKNA Dashboard</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

const SupplyChainManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supplyChainData, setSupplyChainData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('samikna_user') || sessionStorage.getItem('samikna_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Simulate loading
    setTimeout(() => {
      setSupplyChainData([
        {
          id: 1,
          productName: 'Benih Padi IR64',
          category: 'seed',
          supplierName: 'PT. Benih Nusantara',
          quantity: 500,
          unit: 'kg',
          pricePerUnit: 25000,
          totalCost: 12500000,
          orderDate: '2024-01-10',
          deliveryDate: '2024-01-15',
          status: 'delivered',
          qualityGrade: 'A',
          storageLocation: 'Gudang A-1'
        },
        {
          id: 2,
          productName: 'Pupuk NPK 15-15-15',
          category: 'fertilizer',
          supplierName: 'PT. Pupuk Kalimantan Timur',
          quantity: 2000,
          unit: 'kg',
          pricePerUnit: 8500,
          totalCost: 17000000,
          orderDate: '2024-01-18',
          deliveryDate: '2024-01-25',
          status: 'shipped',
          qualityGrade: 'Premium',
          storageLocation: 'Gudang B-2'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'input', label: 'Input Supplies' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'output', label: 'Output/Harvest' }
  ];

  const totalStats = {
    totalItems: supplyChainData.length,
    totalValue: supplyChainData.reduce((sum, item) => sum + item.totalCost, 0),
    pendingOrders: supplyChainData.filter(item => ['ordered', 'shipped'].includes(item.status)).length,
    deliveredItems: supplyChainData.filter(item => item.status === 'delivered').length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data supply chain...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Supply Chain - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Sistem manajemen rantai pasok pertanian terintegrasi" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Supply Chain Management {user?.kabupaten}
                </h1>
                <p className="text-blue-100">
                  Manajemen rantai pasok dari input hingga output pertanian
                </p>
              </div>
              
              <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                <span>+</span>
                Tambah Item
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🛒</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  +5 item baru
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Total Item</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{totalStats.totalItems}</span>
                  <span className="text-gray-500 text-sm">Items</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  Rp {totalStats.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Total Nilai</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {(totalStats.totalValue / 1000000).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">Juta</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">🚚</span>
                </div>
                <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-full">
                  Dalam proses
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{totalStats.pendingOrders}</span>
                  <span className="text-gray-500 text-sm">Orders</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 text-xl">✅</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  {Math.round((totalStats.deliveredItems / totalStats.totalItems) * 100)}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Items Diterima</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{totalStats.deliveredItems}</span>
                  <span className="text-gray-500 text-sm">Items</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Supply Chain Items */}
            <div className="p-6">
              <div className="space-y-4">
                {supplyChainData.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-blue-600 text-xl">
                            {item.category === 'seed' ? '🌱' : 
                             item.category === 'fertilizer' ? '🧪' : '📦'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{item.productName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">
                              {item.category === 'seed' ? 'Benih' :
                               item.category === 'fertilizer' ? 'Pupuk' : 'Lainnya'}
                            </span>
                            <span>•</span>
                            <span>{item.supplierName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        item.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status === 'delivered' ? 'Terkirim' :
                         item.status === 'shipped' ? 'Dalam Pengiriman' : 'Dipesan'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Kuantitas</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.quantity.toLocaleString()} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Harga/Unit</p>
                        <p className="text-sm font-medium text-gray-900">
                          Rp {item.pricePerUnit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Total Nilai</p>
                        <p className="text-sm font-medium text-gray-900">
                          Rp {item.totalCost.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Tgl Pesan</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(item.orderDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Tgl Kirim</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(item.deliveryDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📦 {item.storageLocation}</span>
                        <span>•</span>
                        <span>Grade: {item.qualityGrade}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                          Track
                        </button>
                        <button className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(SupplyChainManagement);