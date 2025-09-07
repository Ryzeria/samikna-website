import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiMenu, HiX, HiLogin } from 'react-icons/hi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: "#home", label: "Beranda" },
    { href: "#about", label: "Tentang" },
    { href: "#products", label: "Produk" },
    { href: "#specifications", label: "Spesifikasi" },
    { href: "#testimonials", label: "Testimoni" },
    { href: "#mitra", label: "Mitra" },
    { href: "#contact", label: "Kontak" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href) => {
    setActiveLink(href);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo with Image */}
          <div className="flex items-center cursor-pointer group">
            <div className="relative">
              {/* Replace this with actual logo image */}
              <Image
                src="/images/logo/samikna-logo.png"
                alt="SAMIKNA Logo"
                width={40}
                height={40}
                className="object-contain group-hover:scale-110 transition-transform"
                priority
                // Fallback if image doesn't exist
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback icon */}
              <div className="w-10 h-10 bg-primary-600 rounded-lg items-center justify-center text-white font-bold text-lg hidden">
                🌱
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-primary-700 transition-colors">
                SAMIKNA
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                Platform Pertanian Berbasis Satelit
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                  activeLink === link.href
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform origin-left transition-transform duration-200 ${
                  activeLink === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </a>
            ))}
          </div>

          {/* Login Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            <a
              href="/login"
              className="hidden md:flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <HiLogin className="w-4 h-4 mr-2" />
              <span className="font-medium">Login</span>
            </a>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    activeLink === link.href
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Mobile Login Button */}
              <a
                href="/login"
                className="flex items-center px-3 py-2 mt-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <HiLogin className="w-4 h-4 mr-2" />
                <span className="font-medium">Login Dashboard</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;