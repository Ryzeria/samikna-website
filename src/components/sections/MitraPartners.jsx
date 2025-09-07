import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiUsers, HiGlobe, HiTrendingUp, HiHeart } from 'react-icons/hi';
import { FaHandshake, FaLeaf, FaUniversity, FaIndustry } from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn } from '../animations/motionVariants';

const MitraPartners = () => {
  // Data mitra dengan path gambar yang sesuai
  const mitraLogos = [
    { name: 'Dinas Pertanian Jawa Timur', logo: '/images/mitra/dinas-pertanian-jatim.png', category: 'government' },
    { name: 'Kementerian Pertanian RI', logo: '/images/mitra/kementerian-pertanian.png', category: 'government' },
    { name: 'Institut Teknologi Sepuluh Nopember', logo: '/images/mitra/its-surabaya.png', category: 'education' },
    { name: 'Universitas Brawijaya', logo: '/images/mitra/universitas-brawijaya.png', category: 'education' },
    { name: 'BPPT', logo: '/images/mitra/bppt.png', category: 'research' },
    { name: 'LAPAN', logo: '/images/mitra/lapan.png', category: 'research' },
    { name: 'PT. Pupuk Indonesia', logo: '/images/mitra/pupuk-indonesia.png', category: 'industry' },
    { name: 'PT. Petrokimia Gresik', logo: '/images/mitra/petrokimia-gresik.png', category: 'industry' },
    { name: 'Indofood', logo: '/images/mitra/indofood.png', category: 'industry' },
    { name: 'Syngenta', logo: '/images/mitra/syngenta.png', category: 'industry' }
  ];

  const partnerStats = [
    { number: '50+', label: 'Mitra Aktif', icon: FaHandshake },
    { number: '15', label: 'Kabupaten Jatim', icon: HiGlobe },
    { number: '1000+', label: 'Petani Terdaftar', icon: HiUsers },
    { number: '5000+', label: 'Lahan Terpantau', icon: FaLeaf }
  ];

  const partnerCategories = [
    {
      title: 'Instansi Pemerintah',
      icon: HiUsers,
      description: 'Kerjasama dengan dinas pertanian dan instansi terkait',
      count: '12 Instansi',
      color: 'blue'
    },
    {
      title: 'Institusi Penelitian',
      icon: FaUniversity,
      description: 'Kolaborasi riset dan pengembangan teknologi',
      count: '8 Institusi',
      color: 'green'
    },
    {
      title: 'Industri Pertanian',
      icon: FaIndustry,
      description: 'Partnership dengan perusahaan agribisnis',
      count: '15 Perusahaan',
      color: 'yellow'
    },
    {
      title: 'Kelompok Tani',
      icon: FaLeaf,
      description: 'Implementasi langsung di tingkat petani',
      count: '200+ Kelompok',
      color: 'emerald'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      yellow: 'from-yellow-500 to-orange-500',
      emerald: 'from-emerald-500 to-teal-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="mitra" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-secondary-300 rounded-full blur-3xl"></div>
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
            <FaHandshake className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-medium">Mitra & Partnership</span>
          </motion.div>
          
          <motion.h2
            variants={textVariant(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Mitra{' '}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Strategis
            </span>
            {' '}SAMIKNA
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Bersama mitra terpercaya, SAMIKNA menghadirkan solusi pertanian cerdas 
            yang terintegrasi untuk kemajuan agrikultur Indonesia.
          </motion.p>
        </motion.div>

        {/* Partner Statistics */}
        <motion.div
          variants={staggerContainer(0.2, 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {partnerStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={bounceIn(0.3 + index * 0.1)}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Logos Marquee */}
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 overflow-hidden bg-white rounded-2xl shadow-lg py-8"
        >
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0 bg-primary-600 text-white px-6 py-3 rounded-r-lg font-semibold">
              Dipercaya Oleh Mitra Strategis
            </div>
            <div className="flex-1 bg-gradient-to-r from-primary-100 to-transparent h-1"></div>
          </div>
          
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              {mitraLogos.map((mitra, index) => (
                <div
                  key={index}
                  className="mx-8 flex-shrink-0 h-16 w-40 bg-gray-50 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer group p-4"
                >
                  <Image
                    src={mitra.logo}
                    alt={mitra.name}
                    width={120}
                    height={60}
                    className="max-h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {mitraLogos.map((mitra, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="mx-8 flex-shrink-0 h-16 w-40 bg-gray-50 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer group p-4"
                >
                  <Image
                    src={mitra.logo}
                    alt={mitra.name}
                    width={120}
                    height={60}
                    className="max-h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Partner Categories */}
        <motion.div
          variants={staggerContainer(0.2, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {partnerCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 0.2 * (index + 1))}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(category.color)} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {category.description}
              </p>
              <div className="text-primary-600 font-semibold text-sm">
                {category.count}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Benefits */}
        <motion.div
          variants={fadeIn('up', 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Mengapa Bermitra dengan SAMIKNA?
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: HiTrendingUp,
                    title: 'Peningkatan Produktivitas',
                    desc: 'Data-driven farming untuk hasil panen optimal'
                  },
                  {
                    icon: HiGlobe,
                    title: 'Jangkauan Luas',
                    desc: 'Network yang tersebar di seluruh Jawa Timur'
                  },
                  {
                    icon: FaLeaf,
                    title: 'Teknologi Terdepan',
                    desc: 'Satelit dan AI untuk pertanian berkelanjutan'
                  },
                  {
                    icon: HiHeart,
                    title: 'Dukungan Penuh',
                    desc: 'Training, maintenance, dan support 24/7'
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn('right', 0.7 + index * 0.1)}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="bg-gradient-to-br from-primary-100 to-emerald-100 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
                  <FaHandshake className="w-16 h-16 text-primary-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Mari Bermitra!
                </h4>
                <p className="text-gray-600 mb-6">
                  Bergabunglah dengan ekosistem pertanian cerdas SAMIKNA
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Hubungi Kami
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeIn('up', 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center p-8 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Tertarik Menjadi Mitra SAMIKNA?
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Bergabunglah dengan network mitra SAMIKNA dan rasakan manfaat 
            teknologi pertanian cerdas untuk kemajuan agrikultur Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Daftar Mitra
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
            >
              Download Proposal
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MitraPartners;