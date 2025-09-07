import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiUsers, HiTrendingUp, HiDatabase } from 'react-icons/hi';
import { FaMapMarkerAlt, FaLeaf, FaChartLine } from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn } from '../animations/motionVariants';

const DistributionMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Data distribusi mitra per kabupaten di Jawa Timur
  const regionData = [
    {
      id: 'malang',
      name: 'Kabupaten Malang',
      coordinates: [-7.9826, 112.6308],
      mitraCount: 45,
      lahanCount: 1200,
      petaniCount: 340,
      productivity: '+28%',
      status: 'active',
      color: '#059669'
    },
    {
      id: 'surabaya',
      name: 'Kota Surabaya',
      coordinates: [-7.2504, 112.7688],
      mitraCount: 32,
      lahanCount: 890,
      petaniCount: 180,
      productivity: '+22%',
      status: 'active',
      color: '#059669'
    },
    {
      id: 'jombang',
      name: 'Kabupaten Jombang',
      coordinates: [-7.5460, 112.2340],
      mitraCount: 28,
      lahanCount: 750,
      petaniCount: 210,
      productivity: '+31%',
      status: 'active',
      color: '#059669'
    },
    {
      id: 'kediri',
      name: 'Kabupaten Kediri',
      coordinates: [-7.8167, 112.0167],
      mitraCount: 35,
      lahanCount: 980,
      petaniCount: 290,
      productivity: '+25%',
      status: 'active',
      color: '#059669'
    },
    {
      id: 'pasuruan',
      name: 'Kabupaten Pasuruan',
      coordinates: [-7.6529, 112.9075],
      mitraCount: 22,
      lahanCount: 650,
      petaniCount: 150,
      productivity: '+19%',
      status: 'active',
      color: '#059669'
    },
    {
      id: 'sidoarjo',
      name: 'Kabupaten Sidoarjo',
      coordinates: [-7.4378, 112.7186],
      mitraCount: 18,
      lahanCount: 420,
      petaniCount: 120,
      productivity: '+15%',
      status: 'planning',
      color: '#f59e0b'
    },
    {
      id: 'gresik',
      name: 'Kabupaten Gresik',
      coordinates: [-7.1564, 112.6536],
      mitraCount: 15,
      lahanCount: 380,
      petaniCount: 95,
      productivity: '+12%',
      status: 'planning',
      color: '#f59e0b'
    },
    {
      id: 'tulungagung',
      name: 'Kabupaten Tulungagung',
      coordinates: [-8.0667, 111.9000],
      mitraCount: 0,
      lahanCount: 0,
      petaniCount: 0,
      productivity: '0%',
      status: 'planned',
      color: '#6b7280'
    }
  ];

  const totalStats = {
    totalMitra: regionData.reduce((sum, region) => sum + region.mitraCount, 0),
    totalLahan: regionData.reduce((sum, region) => sum + region.lahanCount, 0),
    totalPetani: regionData.reduce((sum, region) => sum + region.petaniCount, 0),
    avgProductivity: '+24%'
  };

  const statusColors = {
    active: '#059669',
    planning: '#f59e0b',
    planned: '#6b7280'
  };

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="distribution-map" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          variants={staggerContainer(0.2, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            variants={bounceIn(0.2)}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6"
          >
            <HiLocationMarker className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-medium">Sebaran Mitra</span>
          </motion.div>
          
          <motion.h2
            variants={textVariant(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Peta Sebaran{' '}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Mitra SAMIKNA
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Jelajahi distribusi mitra SAMIKNA di seluruh Jawa Timur dan lihat 
            dampak positif teknologi kami terhadap produktivitas pertanian di setiap region.
          </motion.p>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: HiUsers, label: 'Total Mitra', value: totalStats.totalMitra, suffix: '+' },
            { icon: FaLeaf, label: 'Lahan Terpantau', value: totalStats.totalLahan, suffix: ' Ha' },
            { icon: HiDatabase, label: 'Petani Aktif', value: totalStats.totalPetani, suffix: '+' },
            { icon: HiTrendingUp, label: 'Avg. Produktivitas', value: totalStats.avgProductivity, suffix: '' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={bounceIn(0.3 + index * 0.1)}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Interactive Map */}
          <motion.div
            variants={fadeIn('right', 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Peta Interaktif Jawa Timur</h3>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Aktif</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Planning</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Planned</span>
                  </div>
                </div>
              </div>
              
              {/* Map Container */}
              <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden">
                {!mapLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading Interactive Map...</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Simple SVG Map Placeholder */}
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      {/* Jawa Timur outline - simplified */}
                      <path
                        d="M50 150 L100 130 L150 140 L200 135 L250 145 L300 140 L350 150 L340 180 L320 200 L280 210 L220 205 L180 195 L140 185 L100 175 L60 170 Z"
                        fill="#f0f9ff"
                        stroke="#0891b2"
                        strokeWidth="2"
                      />
                      
                      {/* Region Markers */}
                      {regionData.map((region, index) => (
                        <g key={region.id}>
                          <circle
                            cx={80 + (index % 4) * 80}
                            cy={120 + Math.floor(index / 4) * 60}
                            r={region.status === 'active' ? '8' : region.status === 'planning' ? '6' : '4'}
                            fill={statusColors[region.status]}
                            className="cursor-pointer hover:opacity-80 transition-all"
                            onClick={() => setSelectedRegion(region)}
                          />
                          <text
                            x={80 + (index % 4) * 80}
                            y={140 + Math.floor(index / 4) * 60}
                            textAnchor="middle"
                            className="text-xs fill-gray-600 font-medium"
                          >
                            {region.name.split(' ')[1] || region.name.split(' ')[0]}
                          </text>
                        </g>
                      ))}
                    </svg>
                    
                    {/* Map Note */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs text-gray-600">
                        💡 Klik pada marker untuk melihat detail region
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Leaflet Map Integration Note */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Placeholder untuk integrasi Leaflet.js interactive map. 
                  Ganti dengan implementasi React-Leaflet yang sesungguhnya.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Region Details Panel */}
          <motion.div
            variants={fadeIn('left', 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Selected Region Info */}
            {selectedRegion ? (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaMapMarkerAlt className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">{selectedRegion.name}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedRegion.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedRegion.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedRegion.status.charAt(0).toUpperCase() + selectedRegion.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Jumlah Mitra</span>
                    <span className="font-bold text-primary-600">{selectedRegion.mitraCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Lahan Terpantau</span>
                    <span className="font-bold text-gray-900">{selectedRegion.lahanCount} Ha</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Petani Aktif</span>
                    <span className="font-bold text-gray-900">{selectedRegion.petaniCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Peningkatan Produktivitas</span>
                    <span className="font-bold text-green-600">{selectedRegion.productivity}</span>
                  </div>
                </div>
                
                {selectedRegion.status === 'active' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Lihat Detail Dashboard
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                <FaMapMarkerAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-500 mb-2">Pilih Region</h3>
                <p className="text-gray-400 text-sm">
                  Klik pada marker di peta untuk melihat detail informasi mitra di region tersebut.
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status Sebaran</h3>
              <div className="space-y-3">
                {[
                  { status: 'Aktif', count: regionData.filter(r => r.status === 'active').length, color: 'green' },
                  { status: 'Planning', count: regionData.filter(r => r.status === 'planning').length, color: 'yellow' },
                  { status: 'Planned', count: regionData.filter(r => r.status === 'planned').length, color: 'gray' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.color === 'green' ? 'bg-green-500' :
                        item.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-gray-600">{item.status}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.count} Region</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Regional Performance */}
        <motion.div
          variants={fadeIn('up', 0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Performa Regional Terbaik
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionData
              .filter(region => region.status === 'active')
              .sort((a, b) => parseInt(b.productivity) - parseInt(a.productivity))
              .slice(0, 3)
              .map((region, index) => (
                <motion.div
                  key={region.id}
                  variants={bounceIn(0.8 + index * 0.1)}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center relative overflow-hidden"
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                      🏆 TOP
                    </div>
                  )}
                  
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaChartLine className="w-8 h-8 text-primary-600" />
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2">{region.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">{region.productivity}</div>
                      <div className="text-gray-500">Produktivitas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{region.mitraCount}</div>
                      <div className="text-gray-500">Mitra</div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Future Expansion */}
        <motion.div
          variants={fadeIn('up', 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ekspansi ke Seluruh Indonesia
          </h3>
          <p className="text-primary-100 mb-6 max-w-3xl mx-auto">
            Setelah sukses di Jawa Timur, SAMIKNA berencana ekspansi ke provinsi lain 
            untuk mewujudkan pertanian cerdas di seluruh Indonesia.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { phase: 'Phase 1', target: 'Jawa Tengah & Yogyakarta', timeline: '2024 Q4' },
              { phase: 'Phase 2', target: 'Jawa Barat & Banten', timeline: '2025 Q2' },
              { phase: 'Phase 3', target: 'Sumatera & Sulawesi', timeline: '2025 Q4' }
            ].map((phase, index) => (
              <motion.div
                key={index}
                variants={bounceIn(0.9 + index * 0.1)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <h4 className="font-bold text-lg mb-2">{phase.phase}</h4>
                <p className="text-primary-100 text-sm mb-2">{phase.target}</p>
                <p className="text-xs text-primary-200">{phase.timeline}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Daftar Prioritas Ekspansi
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
            >
              Partnership Opportunity
            </motion.button>
          </div>
        </motion.div>

        {/* Implementation Guide */}
        <motion.div
          variants={fadeIn('up', 0.9)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Tertarik Mengimplementasikan SAMIKNA di Region Anda?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tim kami siap membantu survey lokasi, perencanaan implementasi, 
            dan pendampingan untuk memastikan kesuksesan program di region Anda.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
          >
            Konsultasi Implementasi
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default DistributionMap;