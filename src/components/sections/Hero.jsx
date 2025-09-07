import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlay, HiArrowRight, HiStar, HiCheckCircle } from 'react-icons/hi';
import { FaSatellite, FaChartLine, FaCloudSun, FaSeedling } from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn } from '../animations/motionVariants';

const Hero = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const features = [
    { icon: FaSatellite, text: "Monitoring Satelit" },
    { icon: FaCloudSun, text: "Data Cuaca Real-time" },
    { icon: FaChartLine, text: "Analisis Prediktif" },
    { icon: FaSeedling, text: "Manajemen Lengkap" }
  ];

  const stats = [
    { number: "50K+", label: "Hektar Terpantau" },
    { number: "95%", label: "Akurasi Prediksi" },
    { number: "24/7", label: "Monitoring Aktif" }
  ];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
      
      {/* Clean Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="grad2" cx="80%" cy="20%" r="40%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.08"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#grad1)"/>
            <circle cx="1000" cy="150" r="200" fill="url(#grad2)"/>
            <circle cx="800" cy="600" r="120" fill="url(#grad1)"/>
          </svg>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-200/15 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-12">
          
          {/* Left Content */}
          <motion.div
            variants={staggerContainer(0.2, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div 
              variants={bounceIn(0.2)}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <HiStar className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                Platform Monitoring Satelit Terdepan
              </span>
              <HiArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={textVariant(0.4)} className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">SAMIKNA:</span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                  Platform Monitoring
                </span>
                <br />
                <span className="text-gray-800">Pertanian Berbasis Satelit</span>
              </h1>
              
              <motion.p 
                variants={fadeIn('up', 0.6)}
                className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed"
              >
                Platform manajemen pertanian lengkap berbasis teknologi satelit dan remote sensing. 
                Pantau kondisi lahan, cuaca, dan kelola seluruh siklus pertanian dari pembibitan 
                hingga rantai pasok dalam satu dashboard terintegrasi.
              </motion.p>
            </motion.div>

            {/* Features */}
            <motion.div 
              variants={fadeIn('up', 0.7)}
              className="flex flex-wrap gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={bounceIn(0.8 + index * 0.1)}
                  className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <feature.icon className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeIn('up', 0.8)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:bg-primary-700"
              >
                <span>Akses Dashboard</span>
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-primary-300 transition-all"
              >
                <HiPlay className="w-5 h-5 text-primary-600" />
                <span>Lihat Demo Platform</span>
              </motion.button>
            </motion.div>

            {/* Email Signup */}
            <motion.form 
              variants={fadeIn('up', 0.9)}
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email untuk akses platform SAMIKNA"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-secondary-500 text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors shadow-md hover:shadow-lg"
              >
                Daftar
              </motion.button>
            </motion.form>

            {/* Stats */}
            <motion.div 
              variants={fadeIn('up', 1.0)}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={bounceIn(1.1 + index * 0.1)}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary-600">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Clean Dashboard Illustration */}
          <motion.div
            variants={fadeIn('left', 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Main Dashboard Preview */}
              <motion.div
                variants={fadeIn('up', 0.6)}
                className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-100"
              >
                {/* Dashboard Screen */}
                <div className="aspect-[4/3] bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl shadow-lg overflow-hidden relative">
                  {/* Header Bar */}
                  <div className="bg-gray-800 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-white text-sm font-medium">SAMIKNA Dashboard</div>
                    <div className="text-green-400 text-sm">🟢 Online</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 space-y-4">
                    {/* Map Placeholder */}
                    <div className="bg-green-800 rounded-lg p-4 h-32">
                      <div className="text-white text-sm mb-2">Satellite View - Jawa Timur</div>
                      <div className="grid grid-cols-3 gap-2 h-20">
                        <div className="bg-green-600 rounded opacity-80"></div>
                        <div className="bg-yellow-600 rounded opacity-80"></div>
                        <div className="bg-green-700 rounded opacity-80"></div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-800 rounded p-3 text-center">
                        <div className="text-white text-lg font-bold">85%</div>
                        <div className="text-green-300 text-xs">Health Score</div>
                      </div>
                      <div className="bg-blue-800 rounded p-3 text-center">
                        <div className="text-white text-lg font-bold">23°C</div>
                        <div className="text-blue-300 text-xs">Temperature</div>
                      </div>
                      <div className="bg-yellow-800 rounded p-3 text-center">
                        <div className="text-white text-lg font-bold">12%</div>
                        <div className="text-yellow-300 text-xs">Moisture</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Feature Cards */}
                <motion.div
                  variants={bounceIn(0.8)}
                  className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <FaSatellite className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Satelit Aktif</span>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={bounceIn(1.0)}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                >
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary-600">Real-time</div>
                    <div className="text-xs text-gray-500">Data Update</div>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={bounceIn(1.2)}
                  className="absolute top-1/2 -right-6 bg-white rounded-xl p-3 shadow-lg border border-gray-100 transform -translate-y-1/2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Online</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 w-20 h-20 bg-primary-300/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-secondary-300/20 rounded-full blur-lg"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        variants={fadeIn('up', 1.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;