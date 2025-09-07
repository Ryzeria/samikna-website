import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiStar, HiChevronLeft, HiChevronRight, HiQuoteLeft, HiPlay } from 'react-icons/hi';
import { FaUser, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const testimonials = [
    {
      id: 1,
      name: "Bapak Suharto",
      position: "Ketua Gapoktan Maju Sejahtera",
      location: "Malang, Jawa Timur",
      avatar: "/images/testimonials/petani-suharto.jpg",
      category: "petani",
      rating: 5,
      testimonial: "Platform SAMIKNA benar-benar revolusioner! Dengan monitoring satelit, saya bisa tahu kondisi seluruh lahan tanpa harus keliling. Data cuaca yang akurat membantu saya merencanakan jadwal tanam yang optimal. Hasil panen meningkat 35% sejak menggunakan platform ini!",
      highlight: "Hasil panen meningkat 35%",
      benefits: ["Satellite monitoring", "Weather forecasting", "Yield optimization"]
    },
    {
      id: 2,
      name: "Dr. Ir. Siti Aminah, M.Sc",
      position: "Peneliti Senior Balitbangtan",
      location: "Bogor, Jawa Barat",
      avatar: "/images/testimonials/peneliti-siti.jpg",
      category: "peneliti",
      rating: 5,
      testimonial: "Sebagai peneliti, saya sangat terkesan dengan akurasi data satelit SAMIKNA. Platform analytics-nya sangat user-friendly dan memberikan insight mendalam untuk riset pertanian kami. Data historis 10 tahun ke belakang sangat berharga untuk analisis trend iklim.",
      highlight: "Data historis 10 tahun sangat berharga",
      benefits: ["High accuracy satellite data", "Historical analysis", "Research-grade analytics"]
    },
    {
      id: 3,
      name: "Ibu Mariam",
      position: "Petani Organik",
      location: "Kediri, Jawa Timur",
      avatar: "/images/testimonials/petani-mariam.jpg",
      category: "petani",
      rating: 5,
      testimonial: "Saya yang awam teknologi pun bisa menggunakan dashboard SAMIKNA dengan mudah. Notifikasi cuaca ekstrem sangat membantu melindungi tanaman organik saya. Fitur rekomendasi jadwal penyiraman berdasarkan prediksi cuaca sangat akurat.",
      highlight: "Dashboard mudah digunakan",
      benefits: ["User-friendly dashboard", "Weather alerts", "Smart recommendations"]
    },
    {
      id: 4,
      name: "Agus Santoso, S.P",
      position: "Penyuluh Pertanian Lapangan",
      location: "Jombang, Jawa Timur",
      avatar: "/images/testimonials/penyuluh-agus.jpg",
      category: "penyuluh",
      rating: 5,
      testimonial: "SAMIKNA sangat membantu pekerjaan saya sebagai PPL. Saya bisa monitor kondisi lahan banyak kelompok tani sekaligus melalui satelit. Laporan otomatis dan analisis kondisi tanaman memudahkan saya memberikan rekomendasi yang tepat kepada petani.",
      highlight: "Monitor banyak lahan sekaligus",
      benefits: ["Multi-farm monitoring", "Automated reports", "Expert recommendations"]
    },
    {
      id: 5,
      name: "Prof. Dr. Bambang Hermanto",
      position: "Dekan Fakultas Pertanian UNAIR",
      location: "Surabaya, Jawa Timur",
      avatar: "/images/testimonials/profesor-bambang.jpg",
      category: "akademisi",
      rating: 5,
      testimonial: "Implementasi teknologi satelit dan remote sensing dalam platform SAMIKNA menunjukkan potensi besar untuk transformasi agrikultur Indonesia. Platform ini sangat cocok untuk research dan practical implementation dengan data yang reliable.",
      highlight: "Potensi besar transformasi agrikultur",
      benefits: ["Satellite technology", "Research potential", "Agricultural transformation"]
    },
    {
      id: 6,
      name: "Bapak Joko Susilo",
      position: "Direktur PT. Agro Makmur",
      location: "Pasuruan, Jawa Timur",
      avatar: "/images/testimonials/direktur-joko.jpg",
      category: "industri",
      rating: 5,
      testimonial: "ROI dari investasi platform SAMIKNA sangat menguntungkan. Fitur supply chain management membantu mengoptimalkan distribusi hasil panen. Prediksi hasil yang akurat memudahkan perencanaan produksi dan inventory management.",
      highlight: "ROI platform sangat menguntungkan",
      benefits: ["High ROI", "Supply chain optimization", "Production planning"]
    }
  ];

  const stats = [
    { number: "98%", label: "Kepuasan Pengguna", icon: "😊" },
    { number: "4.9/5", label: "Rating Platform", icon: "⭐" },
    { number: "500+", label: "Review Positif", icon: "👍" }
  ];

  const categories = [
    { id: 'all', label: 'Semua', count: testimonials.length },
    { id: 'petani', label: 'Petani', count: testimonials.filter(t => t.category === 'petani').length },
    { id: 'peneliti', label: 'Peneliti', count: testimonials.filter(t => t.category === 'peneliti').length },
    { id: 'penyuluh', label: 'Penyuluh', count: testimonials.filter(t => t.category === 'penyuluh').length },
    { id: 'industri', label: 'Industri', count: testimonials.filter(t => t.category === 'industri').length }
  ];

  const filteredTestimonials = selectedCategory === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredTestimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredTestimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentSlide(0);
    setIsAutoPlaying(true);
  };

  if (filteredTestimonials.length === 0) return null;

  const currentTestimonial = filteredTestimonials[currentSlide];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-blue-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-10 right-1/3 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white shadow-md px-6 py-3 rounded-full mb-6 hover:shadow-lg transition-all duration-300">
            <HiStar className="w-5 h-5 text-yellow-500 animate-spin" style={{animationDuration: '3s'}} />
            <span className="text-green-700 font-semibold">Testimoni Platform</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Apa Kata{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Pengguna Platform
            </span>
            {' '}SAMIKNA?
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ribuan petani, peneliti, dan praktisi pertanian telah merasakan manfaat 
            nyata dari platform SAMIKNA untuk mengoptimalkan manajemen pertanian mereka.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium group-hover:text-gray-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 shadow-md hover:shadow-lg'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Main Testimonial Display */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left Side - User Info & Visual */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 lg:p-12 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <div className="relative z-10">
                  {/* Quote Icon */}
                  <FaQuoteLeft className="w-12 h-12 text-white/30 mb-6" />
                  
                  {/* User Avatar */}
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto lg:mx-0 ring-4 ring-white/20">
                    <Image
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-24 h-24 bg-white/20 rounded-full hidden items-center justify-center backdrop-blur-sm">
                      <FaUser className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold mb-2">{currentTestimonial.name}</h3>
                    <p className="text-green-100 font-medium mb-1">{currentTestimonial.position}</p>
                    <p className="text-green-200 text-sm mb-4">{currentTestimonial.location}</p>
                    
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start gap-1 mb-6">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <HiStar key={i} className="w-5 h-5 text-yellow-300" />
                      ))}
                    </div>
                    
                    {/* Benefits Tags */}
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {currentTestimonial.benefits.map((benefit, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Testimonial Content */}
              <div className="p-8 lg:p-12">
                <div className="h-full flex flex-col justify-center">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {currentTestimonial.category.charAt(0).toUpperCase() + currentTestimonial.category.slice(1)}
                  </div>
                  
                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "{currentTestimonial.testimonial}"
                  </blockquote>

                  {/* Highlight Box */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      {currentTestimonial.highlight}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Testimoni {currentSlide + 1} dari {filteredTestimonials.length}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${((currentSlide + 1) / filteredTestimonials.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="group w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
            >
              <HiChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
            </button>
            
            {/* Slide Indicators */}
            <div className="flex gap-3">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-green-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="group w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
            >
              <HiChevronRight className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
            </button>
          </div>

          {/* Auto-play Control */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isAutoPlaying 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HiPlay className={`w-4 h-4 ${isAutoPlaying ? 'animate-pulse' : ''}`} />
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Dipercaya oleh Komunitas Pertanian Indonesia
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "🏆", title: "Best Platform", subtitle: "Agritech Award 2024", color: "yellow" },
              { icon: "🌱", title: "1000+ Users", subtitle: "Aktif Menggunakan", color: "green" },
              { icon: "📊", title: "95% Akurasi", subtitle: "Prediksi Satelit", color: "blue" },
              { icon: "🔧", title: "24/7 Support", subtitle: "Platform Support", color: "purple" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-xs">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ingin Menjadi Bagian dari Testimoni Selanjutnya?
            </h3>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan petani yang telah merasakan manfaat 
              platform SAMIKNA untuk mengoptimalkan manajemen dan produktivitas pertanian mereka.
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Coba Platform Sekarang →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;