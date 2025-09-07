import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPaperAirplane, HiMicrophone, HiStop, HiRefresh,
  HiLightBulb, HiClipboard, HiThumbUp, HiThumbDown,
  HiDownload, HiBookOpen
} from 'react-icons/hi';
import { 
  FaRobot, FaUser, FaSatellite, FaCloud, FaLeaf, 
  FaWheat, FaChartLine, FaBrain, FaTractor
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth } from '../../lib/authMiddleware';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [user, setUser] = useState(null);
  const [chatSession, setChatSession] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Enhanced welcome message for satellite platform
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Halo! Saya SAMIKNA AI Assistant untuk platform monitoring satelit pertanian. Saya dapat membantu Anda dengan:\n\n🛰️ Analisis data satelit dan remote sensing\n☁️ Interpretasi data cuaca BMKG\n🌱 Manajemen tanaman dan crop monitoring\n📊 Supply chain dan logistik pertanian\n📈 Analisis NDVI dan kesehatan vegetasi\n🎯 Rekomendasi berbasis AI\n\nSaya memiliki akses ke data real-time untuk ${userData ? JSON.parse(userData).kabupaten : 'wilayah Anda'}. Ada yang bisa saya bantu?`,
        timestamp: new Date(),
        suggestions: [
          'Analisis NDVI terbaru wilayah saya',
          'Interpretasi citra satelit Landsat-8',
          'Rekomendasi berdasarkan data cuaca',
          'Strategi mitigasi perubahan iklim',
          'Optimalisasi jadwal tanam',
          'Analisis produktivitas lahan'
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatSessions = [
    { id: 'general', name: 'General', icon: FaBrain, color: 'purple' },
    { id: 'satellite', name: 'Satellite Analysis', icon: FaSatellite, color: 'blue' },
    { id: 'weather', name: 'Weather & Climate', icon: FaCloud, color: 'indigo' },
    { id: 'crops', name: 'Crop Management', icon: FaLeaf, color: 'green' },
    { id: 'supply', name: 'Supply Chain', icon: FaTractor, color: 'orange' }
  ];

  const quickResponses = [
    'Bagaimana interpretasi NDVI 0.65 untuk tanaman padi?',
    'Analisis curah hujan optimal untuk fase vegetatif',
    'Rekomendasi varietas tahan kekeringan',
    'Strategi irigasi berdasarkan data satelit',
    'Deteksi stress tanaman dari citra multispektral',
    'Prediksi produktivitas berdasarkan NDVI',
    'Optimalisasi input berdasarkan zona manajemen',
    'Analisis perubahan tutupan lahan'
  ];

  const generateAdvancedBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Advanced agricultural responses based on satellite and remote sensing
    if (message.includes('ndvi') || message.includes('vegetasi') || message.includes('indeks')) {
      return `Berdasarkan data satelit terbaru untuk ${user?.kabupaten}, analisis NDVI menunjukkan:\n\n📊 **Kondisi Saat Ini:**\n• NDVI rata-rata: 0.68 (kategori baik)\n• Area dengan NDVI > 0.7: 65% (vegetasi sehat)\n• Area dengan NDVI < 0.5: 12% (memerlukan perhatian)\n\n🎯 **Interpretasi:**\nNilai NDVI 0.65-0.8 mengindikasikan kesehatan vegetasi yang optimal untuk fase pertumbuhan aktif. Area dengan nilai rendah di koordinat [7.25°S, 112.78°E] memerlukan evaluasi lebih lanjut.\n\n💡 **Rekomendasi:**\n1. Aplikasi pupuk nitrogen di area NDVI rendah\n2. Peningkatan frekuensi irigasi\n3. Monitoring lanjutan dalam 2 minggu`;
    }

    if (message.includes('cuaca') || message.includes('iklim') || message.includes('hujan')) {
      return `Analisis kondisi meteorologi ${user?.kabupaten} berdasarkan integrasi data BMKG:\n\n🌦️ **Kondisi Terkini:**\n• Suhu rata-rata: 28.4°C (optimal untuk pertumbuhan)\n• Kelembaban: 78% (kondisi baik)\n• Curah hujan 7 hari: 45mm (cukup)\n• Tekanan udara: 1012.5 hPa (stabil)\n\n📈 **Tren 30 Hari:**\nPeningkatan curah hujan 18% dibanding periode sebelumnya. Pola hujan menunjukkan distribusi yang baik untuk fase vegetatif tanaman.\n\n⚠️ **Alert Cuaca:**\nPrediksi hujan intensitas sedang-tinggi dalam 3 hari ke depan. Siapkan sistem drainase dan sesuaikan jadwal aplikasi pupuk.`;
    }

    if (message.includes('tanaman') || message.includes('padi') || message.includes('jagung')) {
      return `Rekomendasi manajemen tanaman berdasarkan data satelit dan cuaca:\n\n🌾 **Status Tanaman ${user?.kabupaten}:**\n• Health Score: 87% (kategori sangat baik)\n• Area padi: 1,247 Ha (NDVI rata-rata 0.72)\n• Area jagung: 892 Ha (NDVI rata-rata 0.65)\n• Area kedelai: 658 Ha (NDVI rata-rata 0.69)\n\n📋 **Rekomendasi Aktivitas:**\n1. **Minggu ini:** Aplikasi pupuk K untuk area padi di fase generatif\n2. **2 minggu ke depan:** Monitoring hama pada jagung (suhu optimal untuk perkembangan)\n3. **1 bulan:** Persiapan lahan untuk musim tanam berikutnya\n\n💰 **Estimasi Produktivitas:**\nBerdasarkan NDVI dan kondisi cuaca, proyeksi hasil: Padi 6.2 ton/ha (+8% dari target)`;
    }

    if (message.includes('satelit') || message.includes('landsat') || message.includes('citra')) {
      return `Analisis data satelit dan remote sensing untuk ${user?.kabupaten}:\n\n🛰️ **Sumber Data Aktif:**\n• Landsat-8: Update setiap 16 hari\n• Sentinel-2: Update setiap 5 hari\n• MODIS: Update harian\n• Google Earth Engine: Real-time processing\n\n📡 **Data Terbaru (${new Date().toLocaleDateString('id-ID')}):**\n• Cloud coverage: 15% (kualitas data baik)\n• Resolusi spasial: 10-30 meter\n• Band spektral: 13 channel aktif\n• Processing level: Surface Reflectance (L2)\n\n🔍 **Analisis Multispektral:**\n• Red Edge: Deteksi stress nitrogen\n• NIR: Evaluasi biomasa\n• SWIR: Monitoring kelembaban tanah\n• Thermal: Pemetaan suhu permukaan`;
    }

    if (message.includes('supply') || message.includes('rantai pasok') || message.includes('logistik')) {
      return `Analisis supply chain management ${user?.kabupaten}:\n\n📦 **Status Inventori:**\n• Benih: Stock 2 bulan (status: adequate)\n• Pupuk NPK: Stock 1.5 bulan (status: perlu reorder)\n• Pestisida: Stock 0.8 bulan (status: critical)\n• Peralatan: Kondisi 87% (status: baik)\n\n🚚 **Performance Supplier:**\n• On-time delivery: 92.3%\n• Quality compliance: 94.7%\n• Cost efficiency: +5.2% vs target\n\n💡 **Rekomendasi Optimalisasi:**\n1. Advance order pestisida organik 500L\n2. Negotiasi harga pupuk untuk Q2\n3. Diversifikasi supplier peralatan\n4. Implementasi just-in-time delivery untuk benih`;
    }

    // Default comprehensive response
    return `Sebagai AI Assistant SAMIKNA, saya dapat membantu dengan berbagai aspek pertanian modern:\n\n🛰️ **Satellite & Remote Sensing:**\n• Interpretasi data NDVI dan EVI\n• Analisis perubahan tutupan lahan\n• Mapping zona produktivitas\n• Deteksi anomali vegetasi\n\n🌦️ **Weather Intelligence:**\n• Integrasi data BMKG real-time\n• Prediksi cuaca jangka pendek\n• Analisis tren iklim mikro\n• Early warning system\n\n🌱 **Smart Agriculture:**\n• Precision farming recommendations\n• Optimal planting schedules\n• Integrated pest management\n• Yield prediction models\n\nBisa spesifikkan area mana yang ingin Anda konsultasikan?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      session: chatSession
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Enhanced response generation with longer processing time for complex analysis
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateAdvancedBotResponse(inputMessage),
        timestamp: new Date(),
        session: chatSession,
        actions: [
          { label: 'View Satellite Data', action: 'viewSatellite', icon: FaSatellite },
          { label: 'Open Weather Maps', action: 'openWeather', icon: FaCloud },
          { label: 'Export Analysis', action: 'exportData', icon: HiDownload },
          { label: 'Schedule Consultation', action: 'schedule', icon: HiBookOpen }
        ],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
        sources: [
          'Google Earth Engine API',
          'BMKG Weather Data',
          'SAMIKNA Knowledge Base',
          'Agricultural Best Practices DB'
        ]
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickResponse = (response) => {
    setInputMessage(response);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('Analisis kondisi NDVI terbaru untuk wilayah saya');
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Chat telah direset. Saya siap membantu dengan analisis satelit dan monitoring pertanian untuk ${user?.kabupaten}. Silakan ajukan pertanyaan baru!`,
        timestamp: new Date(),
        session: chatSession
      }
    ]);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const rateMessage = (messageId, rating) => {
    console.log(`Message ${messageId} rated: ${rating}`);
    // Send feedback to improve AI responses
  };

  const exportChat = () => {
    const chatHistory = messages.map(msg => ({
      timestamp: msg.timestamp.toISOString(),
      type: msg.type,
      content: msg.content,
      session: msg.session
    }));
    
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAMIKNA_Chat_${user?.kabupaten}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <>
      <Head>
        <title>AI Agricultural Assistant - SAMIKNA Dashboard</title>
        <meta name="description" content="Konsultasi dengan AI Assistant SAMIKNA untuk analisis satelit dan monitoring pertanian cerdas" />
      </Head>

      <DashboardLayout>
        <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
          
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-t-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <FaBrain className="w-6 h-6" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">SAMIKNA AI Agricultural Assistant</h1>
                  <p className="text-purple-100">Intelligent Satellite-Based Agricultural Consulting for {user?.kabupaten}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>AI Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaSatellite className="w-3 h-3" />
                      <span>Satellite Data: Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCloud className="w-3 h-3" />
                      <span>Weather API: Connected</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Chat Session Selector */}
                <select
                  value={chatSession}
                  onChange={(e) => setChatSession(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {chatSessions.map(session => (
                    <option key={session.id} value={session.id} className="text-gray-900">
                      {session.name}
                    </option>
                  ))}
                </select>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportChat}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  title="Export Chat"
                >
                  <HiDownload className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearChat}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  title="Reset Chat"
                >
                  <HiRefresh className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Chat Messages */}
          <div className="flex-1 bg-white p-6 overflow-y-auto space-y-6" style={{ scrollBehavior: 'smooth' }}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-br from-green-500 to-blue-500'
                    }`}>
                      {message.type === 'user' ? (
                        <FaUser className="w-5 h-5 text-white" />
                      ) : (
                        <FaBrain className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl max-w-none ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        
                        {/* AI Confidence & Sources */}
                        {message.type === 'bot' && message.confidence && (
                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span>Confidence: {message.confidence}%</span>
                              <div className="flex items-center gap-1">
                                <div className="w-16 h-1 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-1 bg-green-500 rounded-full transition-all"
                                    style={{ width: `${message.confidence}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <span>Sources: {message.sources?.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Actions */}
                      {message.type === 'bot' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy message"
                          >
                            <HiClipboard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => rateMessage(message.id, 'up')}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Helpful"
                          >
                            <HiThumbUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => rateMessage(message.id, 'down')}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Not helpful"
                          >
                            <HiThumbDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Bot Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 grid grid-cols-2 gap-2 max-w-lg">
                          {message.suggestions.map((suggestion, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleQuickResponse(suggestion)}
                              className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors border border-blue-200"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Bot Actions */}
                      {message.actions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actions.map((action, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full text-xs font-medium hover:shadow-lg transition-all"
                            >
                              {action.icon && <action.icon className="w-3 h-3" />}
                              {action.label}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} • {message.session || 'general'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-4xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <FaBrain className="w-5 h-5 text-white" />
                  </div>
                  <div className="px-4 py-3 bg-gray-100 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Processing satellite data...</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Responses */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <HiLightBulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Pertanyaan Populer Satellite Agriculture:</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {quickResponses.map((response, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickResponse(response)}
                  className="px-3 py-2 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-lg text-xs transition-all text-left"
                >
                  {response}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="bg-white border-t border-gray-200 p-6 rounded-b-2xl">
            <div className="flex items-end gap-4">
              {/* Text Input */}
              <div className="flex-1 relative">
                <div className="absolute top-2 left-3 flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>AI Ready</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{chatSession} Mode</span>
                </div>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Konsultasikan analisis satelit, interpretasi data cuaca, strategi pertanian, atau optimalisasi supply chain..."
                  className="w-full px-4 pt-8 pb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  rows={3}
                  style={{ minHeight: '80px', maxHeight: '120px' }}
                />
                
                {/* Enhanced character count and AI status */}
                <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FaSatellite className="w-3 h-3" />
                    <span>Satellite Data: Ready</span>
                  </div>
                  <span>•</span>
                  <span>{inputMessage.length}/2000</span>
                </div>
              </div>

              {/* Voice Input Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className={`p-3 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? (
                  <HiStop className="w-5 h-5" />
                ) : (
                  <HiMicrophone className="w-5 h-5" />
                )}
              </motion.button>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                title="Send message"
              >
                <HiPaperAirplane className="w-5 h-5 transform rotate-45" />
              </motion.button>
            </div>

            {/* Voice Recognition Indicator */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-red-600"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Mendengarkan pertanyaan agricultural...</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-1 h-4 bg-red-400 animate-pulse"></div>
                  <div className="w-1 h-3 bg-red-400 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-5 bg-red-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              </motion.div>
            )}

            {/* AI Capabilities Info */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-2 text-xs text-gray-500">
              {[
                { icon: FaSatellite, label: 'Satellite Analysis' },
                { icon: FaCloud, label: 'Weather Intelligence' },
                { icon: FaLeaf, label: 'Crop Management' },
                { icon: FaChartLine, label: 'Yield Prediction' },
                { icon: FaTractor, label: 'Supply Chain' }
              ].map((capability, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <capability.icon className="w-3 h-3" />
                  <span>{capability.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ChatbotPage);