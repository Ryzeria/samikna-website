import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiCube, HiDesktopComputer, HiCloud, HiChartBar, 
  HiArrowRight, HiStar, HiCheckCircle,
  HiEye, HiDownload, HiCog
} from 'react-icons/hi';
import { 
  FaSatellite, FaCloudSun, FaSeedling, FaChartLine,
  FaTractor, FaWarehouse, FaMobile, FaDesktop
} from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn, cardHover } from '../animations/motionVariants';

const Products = () => {
  const [activeProduct, setActiveProduct] = useState(0);

  const products = [
    {
      id: 1,
      name: "SAMIKNA Satellite Monitor",
      category: "Remote Sensing Platform",
      price: "Mulai Rp 15.000.000/tahun",
      image: "/images/product/satellite-monitoring.jpg",
      rating: 4.9,
      reviews: 125,
      description: "Platform monitoring berbasis satelit dengan analisis multispektral untuk pemantauan kesehatan tanaman, kondisi lahan, dan estimasi hasil panen secara real-time.",
      features: [
        "Monitoring satelit resolusi tinggi",
        "Analisis NDVI dan kesehatan tanaman",
        "Deteksi stress dan penyakit tanaman",
        "Estimasi biomassa dan hasil panen",
        "Historical data dan trend analysis",
        "Alert system otomatis"
      ],
      specs: {
        "Resolusi Satelit": "30cm - 10m",
        "Update Data": "Harian/Mingguan",
        "Coverage Area": "Unlimited",
        "Data History": "10 tahun kebelakang",
        "Format Output": "GeoTIFF, Shapefile, CSV",
        "API Access": "REST API & WebGIS"
      },
      icon: FaSatellite,
      color: "blue"
    },
    {
      id: 2,
      name: "SAMIKNA Weather Intelligence",
      category: "Cuaca & Iklim",
      price: "Mulai Rp 8.500.000/tahun",
      image: "/images/product/weather-intelligence.jpg",
      rating: 4.8,
      reviews: 87,
      description: "Platform cuaca komprehensif dengan prediksi akurat, early warning system, dan analisis iklim untuk optimasi aktivitas pertanian dan mitigasi risiko.",
      features: [
        "Prediksi cuaca 14 hari ke depan",
        "Early warning system cuaca ekstrem",
        "Analisis pola iklim historis",
        "Rekomendasi jadwal tanam dan panen",
        "Optimasi jadwal penyiraman",
        "Integration dengan kalender pertanian"
      ],
      specs: {
        "Akurasi Prediksi": "85-95%",
        "Forecast Range": "14 hari",
        "Update Frequency": "Setiap 3 jam",
        "Data Points": "Suhu, Kelembaban, Angin, Hujan",
        "Coverage": "Seluruh Indonesia",
        "Historical Data": "30 tahun"
      },
      icon: FaCloudSun,
      color: "yellow"
    },
    {
      id: 3,
      name: "SAMIKNA Crop Management",
      category: "Manajemen Tanaman",
      price: "Mulai Rp 25.000.000/tahun",
      image: "/images/product/crop-management.jpg",
      rating: 4.9,
      reviews: 156,
      description: "Platform manajemen lengkap untuk seluruh siklus pertanian dari perencanaan, pembibitan, pemupukan, hingga panen dengan AI-powered recommendations.",
      features: [
        "Perencanaan rotasi tanaman",
        "Manajemen pembibitan dan nursery",
        "Jadwal pemupukan dan pestisida",
        "Tracking pertumbuhan tanaman",
        "Prediksi hasil dan kualitas panen",
        "Cost analysis dan profitability"
      ],
      specs: {
        "Crop Database": "500+ jenis tanaman",
        "Growth Tracking": "Weekly monitoring",
        "Fertilizer Database": "1000+ produk",
        "ROI Analysis": "Real-time calculation",
        "Mobile Access": "iOS & Android",
        "Offline Mode": "Limited features"
      },
      icon: FaSeedling,
      color: "green"
    },
    {
      id: 4,
      name: "SAMIKNA Supply Chain",
      category: "Rantai Pasok",
      price: "Mulai Rp 35.000.000/tahun",
      image: "/images/product/supply-chain.jpg",
      rating: 4.7,
      reviews: 98,
      description: "Platform manajemen rantai pasok terintegrasi dari farm-to-table, inventory management, distribution planning, dan market analytics untuk optimasi profitabilitas.",
      features: [
        "Inventory management real-time",
        "Distribution planning & logistics",
        "Market price monitoring",
        "Demand forecasting",
        "Supplier & buyer management",
        "Quality control tracking"
      ],
      specs: {
        "Inventory Tracking": "Real-time",
        "Market Data": "50+ komoditas",
        "Logistics Partners": "100+ carriers",
        "Forecasting Accuracy": "90%+",
        "Integration": "ERP/Accounting systems",
        "Reporting": "Custom dashboards"
      },
      icon: FaWarehouse,
      color: "purple"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      yellow: "from-yellow-500 to-orange-500",
      purple: "from-purple-500 to-pink-500"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary-300 rounded-full blur-3xl"></div>
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
            <HiDesktopComputer className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-medium">Platform SAMIKNA</span>
          </motion.div>
          
          <motion.h2
            variants={textVariant(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Solusi{' '}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Digital Platform
            </span>
            {' '}Terlengkap
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Rangkaian platform SAMIKNA dirancang khusus untuk memenuhi kebutuhan pertanian modern 
            dengan teknologi satelit, AI analytics, dan manajemen terintegrasi end-to-end.
          </motion.p>
        </motion.div>

        {/* Platform Categories Filter */}
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Semua Platform', 'Remote Sensing', 'Weather Analytics', 'Crop Management', 'Supply Chain'].map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white text-gray-600 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-primary-50 hover:text-primary-600 border border-gray-200"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeIn('up', 0.2 * (index + 1))}
              whileHover="hover"
              className="group cursor-pointer"
              onClick={() => setActiveProduct(index)}
            >
              <motion.div
                variants={cardHover}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Icons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                      <HiEye className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                    <HiStar className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-primary-600 font-medium">{product.category}</span>
                    <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <HiCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm font-bold text-primary-600">{product.price}</div>
                      <div className="text-xs text-gray-500">Lisensi tahunan</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-md"
                    >
                      Detail
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Platform Detail */}
        <motion.div
          variants={fadeIn('up', 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Platform Preview */}
            <div className="relative h-96 lg:h-auto">
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(products[activeProduct].color)} opacity-10`}></div>
              <div className="relative h-full">
                <Image
                  src={products[activeProduct].image}
                  alt={products[activeProduct].name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Floating Info Cards */}
              <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                <div className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{products[activeProduct].rating}</span>
                  <span className="text-gray-500 text-sm">({products[activeProduct].reviews})</span>
                </div>
              </div>
            </div>

            {/* Platform Details */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <span className="text-primary-600 font-medium text-sm">{products[activeProduct].category}</span>
                <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                  {products[activeProduct].name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {products[activeProduct].description}
                </p>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Fitur Utama:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products[activeProduct].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Spesifikasi:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(products[activeProduct].specs).map(([key, value], idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">{key}:</span>
                      <span className="text-gray-900 text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {products[activeProduct].price}
                  </div>
                  <div className="text-gray-500 text-sm">Sudah termasuk support & maintenance</div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <HiDownload className="w-5 h-5" />
                    <span>Demo Platform</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-primary-300 hover:text-primary-600 transition-all"
                  >
                    <span>Konsultasi</span>
                    <HiArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Navigation */}
        <motion.div
          variants={fadeIn('up', 0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex justify-center gap-2 mt-8"
        >
          {products.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveProduct(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeProduct === index ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeIn('up', 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Butuh Solusi Platform Custom?
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Tim developer kami siap membantu Anda mengembangkan solusi platform SAMIKNA 
            yang disesuaikan dengan kebutuhan spesifik organisasi Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Konsultasi Platform
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
            >
              Request Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;