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

const CropManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cropActivities, setCropActivities] = useState([]);

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
      setCropActivities([
        {
          id: 1,
          fieldName: 'Sawah Blok A-1',
          cropType: 'padi',
          variety: 'IR64',
          activityType: 'planting',
          activityDate: '2024-01-15',
          description: 'Penanaman bibit padi varietas IR64',
          areaHectares: 12.5,
          costAmount: 15000000,
          status: 'completed'
        },
        {
          id: 2,
          fieldName: 'Sawah Blok B-3',
          cropType: 'padi',
          variety: 'Ciherang',
          activityType: 'fertilizing',
          activityDate: '2024-01-20',
          description: 'Aplikasi pupuk NPK dan pupuk organik',
          areaHectares: 8.2,
          costAmount: 3200000,
          status: 'ongoing'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data manajemen tanaman...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Manajemen Tanaman - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Sistem manajemen tanaman terintegrasi" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Manajemen Tanaman {user?.kabupaten}
                </h1>
                <p className="text-green-100">
                  Sistem manajemen aktivitas pertanian terintegrasi
                </p>
              </div>
              
              <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                <span>+</span>
                Tambah Aktivitas
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📋</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  +3 minggu ini
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Total Aktivitas</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{cropActivities.length}</span>
                  <span className="text-gray-500 text-sm">Kegiatan</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-xl">🌾</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  +12.5 Ha
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Area Terlibat</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">20.7</span>
                  <span className="text-gray-500 text-sm">Hektar</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">💰</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  Rp 18.2M
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Total Investasi</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">18.2</span>
                  <span className="text-gray-500 text-sm">Juta</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 text-xl">✅</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  50%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">Aktivitas Selesai</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">1</span>
                  <span className="text-gray-500 text-sm">Kegiatan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">Daftar Aktivitas</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {cropActivities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <span className="text-green-600 text-xl">🌱</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{activity.fieldName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="capitalize">{activity.cropType} - {activity.variety}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {activity.status === 'completed' ? 'Selesai' :
                           activity.status === 'ongoing' ? 'Berlangsung' : 'Direncanakan'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Tanggal Kegiatan</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(activity.activityDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Luas Area</p>
                        <p className="text-sm font-medium text-gray-900">{activity.areaHectares} Ha</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Biaya</p>
                        <p className="text-sm font-medium text-gray-900">
                          Rp {activity.costAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Jenis Aktivitas</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {activity.activityType === 'planting' ? 'Penanaman' : 
                           activity.activityType === 'fertilizing' ? 'Pemupukan' : activity.activityType}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 text-sm">{activity.description}</p>
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

export default withAuth(CropManagement);