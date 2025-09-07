import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiMail, HiPhone, HiLocationMarker, HiClock,
  HiUser, HiOfficeBuilding, HiChat, HiPaperAirplane
} from 'react-icons/hi';
import { 
  FaWhatsapp, FaTelegram, FaInstagram, FaLinkedin,
  FaLeaf, FaHandshake, FaTools, FaQuestionCircle
} from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn } from '../animations/motionVariants';

const ContactInquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'product',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: 'product',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: HiPhone,
      title: 'Telepon',
      details: ['+62 31 5994251', '+62 31 5994252'],
      action: 'tel:+6231599425'
    },
    {
      icon: HiMail,
      title: 'Email',
      details: ['info@samikna.id', 'support@samikna.id'],
      action: 'mailto:info@samikna.id'
    },
    {
      icon: HiLocationMarker,
      title: 'Alamat',
      details: ['Gedung Teknik Geomatika ITS', 'Kampus ITS Sukolilo, Surabaya 60111'],
      action: 'https://maps.google.com/?q=ITS+Sukolilo+Surabaya'
    },
    {
      icon: HiClock,
      title: 'Jam Operasional',
      details: ['Senin - Jumat: 08.00 - 17.00', 'Sabtu: 08.00 - 12.00'],
      action: null
    }
  ];

  const inquiryTypes = [
    { value: 'product', label: 'Informasi Produk', icon: FaLeaf },
    { value: 'partnership', label: 'Kemitraan', icon: FaHandshake },
    { value: 'support', label: 'Technical Support', icon: FaTools },
    { value: 'other', label: 'Lainnya', icon: FaQuestionCircle }
  ];

  const socialMedia = [
    { icon: FaWhatsapp, name: 'WhatsApp', color: 'green', link: 'https://wa.me/6285234567890' },
    { icon: FaTelegram, name: 'Telegram', color: 'blue', link: 'https://t.me/samikna_id' },
    { icon: FaInstagram, name: 'Instagram', color: 'pink', link: 'https://instagram.com/samikna.id' },
    { icon: FaLinkedin, name: 'LinkedIn', color: 'indigo', link: 'https://linkedin.com/company/samikna' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'hover:bg-green-500',
      blue: 'hover:bg-blue-500',
      pink: 'hover:bg-pink-500',
      indigo: 'hover:bg-indigo-500'
    };
    return colors[color] || colors.green;
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-gray-50 relative overflow-hidden">
      
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
          className="text-center mb-12"
        >
          <motion.div
            variants={bounceIn(0.2)}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6"
          >
            <HiChat className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-medium">Hubungi Kami</span>
          </motion.div>
          
          <motion.h2
            variants={textVariant(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Kontak &{' '}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Product Inquiry
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Punya pertanyaan tentang SAMIKNA? Tim ahli kami siap membantu Anda 
            menemukan solusi pertanian cerdas yang tepat.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <motion.div
            variants={fadeIn('right', 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Kirim Pesan Anda
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Email *
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    No. Telepon
                  </label>
                  <div className="relative">
                    <HiPhone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Perusahaan/Instansi
                  </label>
                  <div className="relative">
                    <HiOfficeBuilding className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Nama perusahaan (opsional)"
                    />
                  </div>
                </div>
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-3 text-sm">
                  Jenis Inquiry *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {inquiryTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                        formData.inquiryType === type.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="inquiryType"
                        value={type.value}
                        checked={formData.inquiryType === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <type.icon className="w-4 h-4 mr-2" />
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Pesan *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Ceritakan kebutuhan atau pertanyaan Anda..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <HiPaperAirplane className="w-5 h-5" />
                    <span>Kirim Pesan</span>
                  </>
                )}
              </motion.button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
                >
                  ✅ Pesan berhasil dikirim! Tim kami akan menghubungi Anda dalam 24 jam.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={fadeIn('left', 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">
                          {item.action && idx === 0 ? (
                            <a href={item.action} className="hover:text-primary-600 transition-colors">
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">Ikuti Kami</h4>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-all ${getColorClasses(social.color)}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">Aksi Cepat</h4>
              <div className="space-y-3">
                <motion.a
                  href="https://wa.me/6285234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">WhatsApp Konsultasi</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <HiPhone className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Jadwalkan Meeting</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Bottom */}
        <motion.div
          variants={fadeIn('up', 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Butuh Konsultasi Langsung?
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Tim ahli kami siap memberikan konsultasi gratis untuk membantu Anda 
            memilih solusi SAMIKNA yang tepat sesuai kebutuhan lahan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://wa.me/6285234567890"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>WhatsApp Konsultasi</span>
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
            >
              Jadwalkan Meeting
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInquiry;