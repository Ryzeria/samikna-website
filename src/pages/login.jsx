import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  HiUser, HiLockClosed, HiEye, HiEyeOff, 
  HiShieldCheck, HiLocationMarker, HiGlobe
} from 'react-icons/hi';
import { FaLeaf, FaSatellite, FaCloud } from 'react-icons/fa';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('samikna_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.username.trim() || !formData.password) {
      setError('Username dan password wajib diisi');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim().toLowerCase(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth data
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('samikna_token', data.token);
        storage.setItem('samikna_user', JSON.stringify(data.user));
        
        // Clear form
        setFormData({ username: '', password: '' });
        
        // Redirect with success message
        router.push('/dashboard?login=success');
      } else {
        setError(data.message || 'Login gagal. Periksa kembali kredensial Anda.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Administrator - SAMIKNA Platform</title>
        <meta name="description" content="Login ke platform SAMIKNA untuk monitoring pertanian berbasis satelit dan remote sensing" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-20 h-20 bg-green-200/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-32 h-32 bg-blue-200/15 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              x: [-30, 30, -30],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-40 left-20 w-24 h-24 bg-emerald-200/25 rounded-full blur-xl"
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side - Platform Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left space-y-8 px-4"
          >
            {/* Logo and Branding */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex items-center"
                >
                  <FaSatellite className="h-12 w-12 text-blue-600 mr-2" />
                  <FaLeaf className="h-10 w-10 text-green-600" />
                </motion.div>
              </div>
              <div className="ml-4">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  SAMIKNA
                </h1>
                <p className="text-gray-600 font-medium">Satellite Agricultural Monitoring Platform</p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Platform Monitoring<br />
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Pertanian Satelit
                </span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Akses dashboard administrasi untuk monitoring pertanian berbasis teknologi remote sensing 
                dan data satelit real-time untuk kabupaten di Jawa Timur.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: FaSatellite,
                  title: "Remote Sensing",
                  desc: "Data satelit Landsat & Sentinel",
                  color: "blue"
                },
                {
                  icon: FaCloud,
                  title: "Weather Integration",
                  desc: "Data cuaca dan iklim BMKG",
                  color: "indigo"
                },
                {
                  icon: FaLeaf,
                  title: "Crop Analytics",
                  desc: "Analisis NDVI dan kesehatan tanaman",
                  color: "green"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap justify-center lg:justify-start gap-8"
            >
              {[
                { number: "38", label: "Kabupaten/Kota", suffix: "" },
                { number: "1000+", label: "Lahan Terpantau", suffix: "Ha" },
                { number: "24/7", label: "Monitoring", suffix: "" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {stat.number}
                    <span className="text-lg text-gray-600 ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 w-full max-w-lg mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Administrator Login
                </h3>
                <p className="text-gray-600">
                  Masuk dengan akun administrator kabupaten
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Username Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Username Kabupaten
                  </label>
                  <div className="relative group">
                    <HiLocationMarker className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nama kabupaten (contoh: malang, surabaya)"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Password
                  </label>
                  <div className="relative group">
                    <HiLockClosed className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password administrator"
                      className="w-full pl-12 pr-14 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm text-gray-900"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <HiEyeOff className="w-5 h-5" />
                      ) : (
                        <HiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Lupa password?
                  </a>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <HiShieldCheck className="w-5 h-5" />
                      <span>Masuk ke Dashboard</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Sistem terhubung dengan:
                  </p>
                  <div className="flex justify-center items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Google Earth Engine
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      BMKG Weather API
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Satellite Data
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Butuh bantuan teknis?{' '}
                    <a href="mailto:admin@samikna.id" className="text-blue-600 hover:underline">
                      admin@samikna.id
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 mx-auto transition-colors group"
              >
                <motion.span
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ←
                </motion.span>
                <span className="group-hover:underline">Kembali ke Homepage</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;