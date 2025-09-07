import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiChartBar, HiShieldCheck, HiGlobeAlt, HiLightningBolt,
  HiCog, HiUsers, HiTrendingUp, HiEye
} from 'react-icons/hi';
import { FaSatellite, FaCloudSun, FaSeedling, FaChartLine, FaLeaf, FaTractor } from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn } from '../animations/motionVariants';

const About = () => {
  const benefits = [
    {
      icon: FaSatellite,
      title: "Monitoring Satelit",
      description: "Pantau kondisi lahan secara real-time menggunakan data satelit resolusi tinggi untuk analisis vegetasi dan kondisi tanah."
    },
    {
      icon: FaCloudSun,
      title: "Data Cuaca Terintegrasi",
      description: "Sistem peringatan dini cuaca dengan data meteorologi akurat untuk perencanaan aktivitas pertanian yang optimal."
    },
    {
      icon: FaChartLine,
      title: "Analisis Prediktif",
      description: "AI yang menganalisis pola historis untuk memprediksi hasil panen, kebutuhan pupuk, dan waktu optimal untuk aktivitas pertanian."
    },
    {
      icon: FaTractor,
      title: "Manajemen Lengkap",
      description: "Platform terintegrasi untuk mengelola seluruh siklus pertanian dari pembibitan, pemupukan, hingga rantai pasok."
    }
  ];

  const features = [
    {
      icon: FaSatellite,
      title: "Remote Sensing",
      value: "Monitoring berbasis satelit multispektral"
    },
    {
      icon: FaSeedling,
      title: "Crop Management",
      value: "Manajemen tanaman dari benih hingga panen"
    },
    {
      icon: FaChartLine,
      title: "Predictive Analytics",
      value: "Prediksi hasil dan optimasi produksi"
    },
    {
      icon: HiCog,
      title: "Supply Chain",
      value: "Manajemen rantai pasok terintegrasi"
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100 to-transparent"></div>
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
            className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6"
          >
            <FaLeaf className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-medium">Tentang SAMIKNA</span>
          </motion.div>
          
          <motion.h2
            variants={textVariant(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Platform{' '}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Pertanian Digital
            </span>
            {' '}Terdepan
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            SAMIKNA (Sistem Aplikasi Monitoring Kesehatan Tanaman) adalah platform manajemen pertanian 
            komprehensif yang mengintegrasikan teknologi satelit, data cuaca real-time, dan analytics 
            untuk memberikan solusi pertanian digital yang lengkap dan akurat.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Content - Main Description */}
          <motion.div
            variants={staggerContainer(0.2, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={fadeIn('right', 0.3)} className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Teknologi Satelit untuk Pertanian Berkelanjutan
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                Dengan memanfaatkan data satelit resolusi tinggi dan teknologi remote sensing, 
                SAMIKNA mampu memantau kondisi lahan, kesehatan tanaman, dan faktor lingkungan 
                secara real-time tanpa memerlukan instalasi perangkat fisik di lapangan.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Platform kami menggabungkan data cuaca, analisis vegetasi, dan machine learning 
                untuk memberikan insight yang actionable bagi petani, agronomis, dan stakeholder 
                pertanian dalam mengoptimalkan seluruh siklus produksi pertanian.
              </p>
            </motion.div>

            {/* Key Statistics */}
            <motion.div
              variants={fadeIn('right', 0.4)}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center p-6 bg-primary-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
                <div className="text-sm text-gray-600">Hektar Terpantau</div>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Monitoring Satelit</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeIn('right', 0.5)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Explore Platform</span>
                <HiEye className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual Representation */}
          <motion.div
            variants={fadeIn('left', 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Placeholder */}
            <div className="relative bg-gradient-to-br from-primary-100 to-emerald-100 rounded-2xl p-8 shadow-xl">
              <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-primary-200 rounded-full mx-auto flex items-center justify-center">
                    <FaSatellite className="w-12 h-12 text-primary-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Satellite Technology</div>
                    <div className="text-xs text-gray-400">
                      Replace with actual<br />
                      satellite monitoring image
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Feature Cards */}
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={bounceIn(0.6 + index * 0.1)}
                className={`absolute bg-white rounded-lg p-3 shadow-lg border border-gray-100 ${
                  index === 0 ? 'top-4 -right-4' :
                  index === 1 ? 'bottom-4 -left-4' :
                  index === 2 ? 'top-1/2 -right-6' :
                  'bottom-1/2 -left-6'
                }`}
              >
                <div className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-primary-600" />
                  <div className="text-xs">
                    <div className="font-medium text-gray-800">{feature.title}</div>
                    <div className="text-gray-500">{feature.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 0.2 * (index + 1))}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <benefit.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          variants={fadeIn('up', 0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Siap Mengoptimalkan Pertanian Anda?
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan petani yang telah merasakan manfaat teknologi SAMIKNA 
            untuk mengoptimalkan hasil panen dan efisiensi operasional pertanian mereka.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Mulai Sekarang
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;