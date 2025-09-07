import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiMail, HiPhone, HiLocationMarker, HiGlobe, HiArrowUp
} from 'react-icons/hi';
import { 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, 
  FaWhatsapp, FaYoutube, FaLeaf, FaSeedling
} from 'react-icons/fa';
import { fadeIn, textVariant } from '../animations/motionVariants';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visitorData, setVisitorData] = useState({
    total: 0,
    today: 0,
    thisMonth: 0
  });

  useEffect(() => {
    // Scroll to top button visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate visitor counter
    const totalVisitors = Math.floor(Math.random() * 5000) + 1000;
    const todayVisitors = Math.floor(Math.random() * 100) + 20;
    const monthlyVisitors = Math.floor(Math.random() * 1000) + 200;

    setVisitorData({
      total: totalVisitors,
      today: todayVisitors,
      thisMonth: monthlyVisitors
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyInfo = {
    name: "SAMIKNA",
    tagline: "Sistem Aplikasi Monitoring Kesehatan Tanaman",
    description: "Solusi IoT terdepan untuk pertanian cerdas dan berkelanjutan. Membantu petani meningkatkan produktivitas dengan teknologi monitoring real-time.",
    address: "Gedung Teknik Geomatika ITS, Kampus ITS Sukolilo, Surabaya 60111, Jawa Timur, Indonesia",
    phone: "+62 31 5994251",
    email: "info@samikna.id",
    website: "www.samikna.id",
    mapLink: "https://maps.google.com/maps?q=Departemen%20Teknik%20Geomatika%20ITS%20Sukolilo%20Surabaya&output=embed"
  };

  const footerLinks = {
    products: [
      { name: "Soil Sensor", href: "#products" },
      { name: "Weather Station", href: "#products" },
      { name: "Drone Monitoring", href: "#products" },
      { name: "IoT Gateway", href: "#products" }
    ],
    solutions: [
      { name: "Smart Farming", href: "#about" },
      { name: "Precision Agriculture", href: "#about" },
      { name: "Crop Monitoring", href: "#about" },
      { name: "Analytics Platform", href: "#about" }
    ],
    support: [
      { name: "Documentation", href: "#" },
      { name: "Training", href: "#" },
      { name: "Technical Support", href: "#contact" },
      { name: "FAQ", href: "#" }
    ],
    company: [
      { name: "Tentang Kami", href: "#about" },
      { name: "Tim", href: "#testimonials" },
      { name: "Mitra", href: "#mitra" },
      { name: "Kontak", href: "#contact" }
    ]
  };

  const socialLinks = [
    { icon: FaFacebookF, name: 'Facebook', href: 'https://facebook.com/samikna.id', color: 'hover:bg-blue-600' },
    { icon: FaTwitter, name: 'Twitter', href: 'https://twitter.com/samikna_id', color: 'hover:bg-blue-400' },
    { icon: FaLinkedinIn, name: 'LinkedIn', href: 'https://linkedin.com/company/samikna', color: 'hover:bg-blue-700' },
    { icon: FaInstagram, name: 'Instagram', href: 'https://instagram.com/samikna.id', color: 'hover:bg-pink-500' },
    { icon: FaWhatsapp, name: 'WhatsApp', href: 'https://wa.me/6285234567890', color: 'hover:bg-green-500' },
    { icon: FaYoutube, name: 'YouTube', href: 'https://youtube.com/@samikna', color: 'hover:bg-red-500' }
  ];

  const certifications = [
    "ISO 9001:2015",
    "CE Marking", 
    "FCC Certified",
    "IP67 Rating"
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500 to-emerald-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Company Info - Left Column */}
            <motion.div
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              {/* Logo */}
              <div className="flex items-center mb-4">
                <div className="relative">
                  <FaLeaf className="h-8 w-8 text-primary-400" />
                  <FaSeedling className="h-4 w-4 text-secondary-400 absolute -bottom-1 -right-1" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold text-white">{companyInfo.name}</h3>
                  <p className="text-gray-400 text-sm">{companyInfo.tagline}</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                {companyInfo.description}
              </p>

              {/* Social Media */}
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all ${social.color}`}
                    title={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* Visitor Counter */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 text-sm">Statistik Pengunjung</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hari ini:</span>
                    <span className="text-primary-400 font-medium">{visitorData.today.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bulan ini:</span>
                    <span className="text-primary-400 font-medium">{visitorData.thisMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-primary-400 font-medium">{visitorData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Links Sections - Center */}
            <motion.div
              variants={fadeIn('up', 0.3)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                
                {/* Products */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Produk</h4>
                  <ul className="space-y-2">
                    {footerLinks.products.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Solusi</h4>
                  <ul className="space-y-2">
                    {footerLinks.solutions.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Dukungan</h4>
                  <ul className="space-y-2">
                    {footerLinks.support.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Perusahaan</h4>
                  <ul className="space-y-2">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Contact Info & Map - Right Column */}
            <motion.div
              variants={fadeIn('up', 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Lokasi Kami</h4>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <HiLocationMarker className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {companyInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <HiPhone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <a href={`tel:${companyInfo.phone}`} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                    {companyInfo.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <HiMail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <a href={`mailto:${companyInfo.email}`} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                    {companyInfo.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <HiGlobe className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <a href={`https://${companyInfo.website}`} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                    {companyInfo.website}
                  </a>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={companyInfo.mapLink}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="SAMIKNA Location - Departemen Teknik Geomatika ITS"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                ></iframe>
              </div>
            </motion.div>
          </div>

          {/* Certifications */}
          <motion.div
            variants={fadeIn('up', 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 pt-8 border-t border-gray-800"
          >
            <div className="text-center">
              <h5 className="text-white font-medium mb-4">Sertifikasi & Standar</h5>
              <div className="flex flex-wrap justify-center gap-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 px-3 py-1 rounded-full text-gray-400 text-xs border border-gray-700 hover:border-primary-400 hover:text-primary-400 transition-all"
                  >
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeIn('up', 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="border-t border-gray-800 py-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>
                © {new Date().getFullYear()} SAMIKNA. All rights reserved.
              </p>
              <p className="mt-1">
                Built with 💚 for sustainable agriculture in Indonesia
              </p>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HiArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;