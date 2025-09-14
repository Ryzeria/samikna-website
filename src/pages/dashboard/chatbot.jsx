import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPaperAirplane, HiMicrophone, HiStop, HiRefresh,
  HiLightBulb, HiClipboard, HiThumbUp, HiThumbDown,
  HiDownload, HiBookOpen, HiSparkles, HiCog
} from 'react-icons/hi';
import { 
  FaRobot, FaUser, FaSatellite, FaCloud, FaLeaf, 
  FaWheat, FaChartLine, FaBrain, FaTractor, FaGlobe
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
  const [selectedModel, setSelectedModel] = useState('advanced');
  const [chatHistory, setChatHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('samikna_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load chat history
    const savedHistory = localStorage.getItem('samikna_chat_history');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }

    // Enhanced welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `🌾 Selamat datang di SAMIKNA AI Assistant!

Saya adalah asisten AI canggih yang khusus dirancang untuk membantu dalam manajemen pertanian modern berbasis satelit. Berikut kemampuan saya:

🛰️ **Analisis Satelit & Remote Sensing:**
• Interpretasi data NDVI, EVI, dan indeks vegetasi lainnya
• Analisis citra multispektral Landsat-8/9 dan Sentinel-2
• Deteksi perubahan tutupan lahan dan anomali vegetasi
• Mapping zona produktivitas berbasis data satelit

🌤️ **Analisis Meteorologi:**
• Integrasi real-time data BMKG dan OpenWeather
• Prediksi cuaca jangka pendek dan menengah
• Analisis pola iklim mikro dan makro
• Early warning system untuk cuaca ekstrem

🌱 **Smart Agriculture Solutions:**
• Rekomendasi precision farming
• Optimalisasi jadwal tanam dan panen
• Manajemen hama terpadu (IPM)
• Prediksi hasil dan yield forecasting

📊 **Supply Chain & Analytics:**
• Optimalisasi rantai pasok
• Analisis biaya produksi
• Manajemen inventori cerdas
• Performance monitoring

Saya siap membantu analisis untuk wilayah ${userData ? JSON.parse(userData).kabupaten : 'Anda'}. Silakan ajukan pertanyaan atau pilih topik di bawah!`,
        timestamp: new Date(),
        suggestions: [
          'Analisis NDVI terbaru untuk lahan padi',
          'Rekomendasi jadwal tanam berdasarkan cuaca',
          'Deteksi stress tanaman dari citra satelit',
          'Prediksi produktivitas berdasarkan data historis',
          'Optimalisasi penggunaan pupuk nitrogen',
          'Strategi mitigasi risiko iklim'
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatSessions = [
    { id: 'general', name: 'General Assistant', icon: FaBrain, color: 'purple' },
    { id: 'satellite', name: 'Satellite Analysis', icon: FaSatellite, color: 'blue' },
    { id: 'weather', name: 'Weather & Climate', icon: FaCloud, color: 'indigo' },
    { id: 'crops', name: 'Crop Management', icon: FaLeaf, color: 'green' },
    { id: 'supply', name: 'Supply Chain', icon: FaTractor, color: 'orange' },
    { id: 'analytics', name: 'Data Analytics', icon: FaChartLine, color: 'red' }
  ];

  const aiModels = [
    { id: 'basic', name: 'Basic AI', description: 'Respons cepat untuk pertanyaan sederhana' },
    { id: 'advanced', name: 'Advanced AI', description: 'Analisis mendalam dengan multiple data sources' },
    { id: 'expert', name: 'Expert Mode', description: 'Konsultasi level ahli dengan reasoning kompleks' }
  ];

  const quickResponses = [
    'Analisis kondisi NDVI wilayah saya saat ini',
    'Interpretasi citra Landsat-8 terbaru',
    'Rekomendasi varietas padi tahan kekeringan',
    'Prediksi cuaca 7 hari ke depan',
    'Strategi irigasi precision farming',
    'Deteksi hama dari data spektral',
    'Optimalisasi aplikasi fertilizer',
    'Analisis ROI investasi pertanian',
    'Perencanaan musim tanam optimal',
    'Mitigasi risiko perubahan iklim'
  ];

  const generateAdvancedBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const responses = {
      ndvi: {
        content: `📊 **Analisis NDVI Terkini - ${user?.kabupaten}**

Berdasarkan data satelit Landsat-8 terbaru (${new Date().toLocaleDateString('id-ID')}):

🟢 **Status Vegetasi Optimal:**
• NDVI rata-rata: 0.72 (kategori sangat baik)
• Area dengan NDVI > 0.7: 68% dari total lahan
• Peningkatan 12% dibanding bulan lalu

🟡 **Area Perhatian Khusus:**
• Koordinat [-7.25°, 112.78°]: NDVI 0.45 (moderate stress)
• Kemungkinan defisiensi nitrogen atau stress air
• Rekomendasi: soil testing dan adjustmen irigasi

📈 **Tren Historis:**
• Pola NDVI konsisten dengan musim normal
• Prediksi puncak vegetasi dalam 2-3 minggu
• Potential yield: 6.8 ton/ha (+15% vs target)

🎯 **Actionable Insights:**
1. Tambah aplikasi nitrogen di area NDVI rendah
2. Monitoring intensif koordinat stress
3. Optimalisasi timing harvest berdasarkan NDVI curve`,
        actions: [
          { label: 'Lihat Peta NDVI', icon: FaSatellite, action: 'viewNDVIMap' },
          { label: 'Download Report', icon: HiDownload, action: 'downloadReport' },
          { label: 'Set Alert', icon: HiSparkles, action: 'setAlert' }
        ]
      },
      cuaca: {
        content: `🌤️ **Analisis Meteorologi Komprehensif**

Data terintegrasi BMKG + OpenWeather + Satellite:

**Kondisi Saat Ini:**
• Suhu: 28.5°C (ideal untuk pertumbuhan vegetatif)
• Kelembaban: 76% (optimal range)
• Tekanan: 1013.2 hPa (stabil)
• Angin: 12 km/h dari Tenggara

**Prediksi 7 Hari:**
• Hari 1-3: Cerah berawan, T: 26-32°C
• Hari 4-5: Hujan ringan 15-25mm
• Hari 6-7: Cerah, kondisi ideal untuk field activities

**Climate Impact Analysis:**
• El Niño weak signal terdeteksi
• Pola hujan 18% di atas normal seasonal
• Rekomendasi: adjust planting schedule +1 minggu

**Smart Recommendations:**
1. Window optimal untuk aplikasi pestisida: Hari 1-3
2. Persiapan drainase untuk hujan Hari 4-5
3. Timing ideal untuk harvest: Hari 6-7`,
        actions: [
          { label: 'Weather Forecast', icon: FaCloud, action: 'viewForecast' },
          { label: 'Climate Analysis', icon: FaGlobe, action: 'climateAnalysis' }
        ]
      }
    };

    // Smart response selection
    if (message.includes('ndvi') || message.includes('vegetasi') || message.includes('indeks')) {
      return responses.ndvi;
    } else if (message.includes('cuaca') || message.includes('iklim') || message.includes('hujan')) {
      return responses.cuaca;
    }

    // Default intelligent response
    return {
      content: `🤖 **SAMIKNA AI Analysis Ready**

Saya telah menganalisis pertanyaan Anda dan siap memberikan insight berbasis:

📡 **Real-time Data Sources:**
• Google Earth Engine API
• BMKG Weather Network
• OpenWeather Global
• NASA MODIS/Landsat
• Local IoT Sensors

🧠 **AI Capabilities Active:**
• Machine Learning Models: ✅
• Satellite Image Processing: ✅
• Weather Pattern Recognition: ✅
• Yield Prediction Algorithm: ✅
• Supply Chain Optimization: ✅

Untuk analisis yang lebih spesifik, silakan ajukan pertanyaan tentang:
• Kondisi lahan dan vegetasi
• Analisis data satelit
• Prediksi cuaca dan iklim
• Manajemen tanaman
• Optimalisasi supply chain
• Strategi precision farming

Atau gunakan quick responses di bawah untuk memulai konsultasi!`,
      actions: [
        { label: 'Satellite Analysis', icon: FaSatellite, action: 'satelliteMode' },
        { label: 'Weather Forecast', icon: FaCloud, action: 'weatherMode' },
        { label: 'Crop Consultation', icon: FaLeaf, action: 'cropMode' }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      session: chatSession,
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Add to chat history
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    localStorage.setItem('samikna_chat_history', JSON.stringify(newHistory));

    // Simulate AI processing time based on model
    const processingTime = selectedModel === 'expert' ? 3000 : selectedModel === 'advanced' ? 2000 : 1000;

    setTimeout(() => {
      const response = generateAdvancedBotResponse(inputMessage);
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        session: chatSession,
        model: selectedModel,
        actions: response.actions || [],
        confidence: Math.floor(Math.random() * 15) + 85, // 85-99% confidence
        sources: [
          'Google Earth Engine',
          'BMKG Weather API',
          'SAMIKNA Knowledge Base',
          'NASA Satellite Data',
          'OpenWeather Global'
        ],
        processingTime: `${processingTime/1000}s`
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Add bot response to history
      const updatedHistory = [...newHistory, botResponse];
      setChatHistory(updatedHistory);
      localStorage.setItem('samikna_chat_history', JSON.stringify(updatedHistory));
    }, processingTime);
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
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('Bagaimana kondisi NDVI di wilayah saya berdasarkan data satelit terbaru?');
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
        content: `Chat telah direset. SAMIKNA AI Assistant siap membantu dengan analisis satelit dan monitoring pertanian untuk ${user?.kabupaten}. 

🔄 Session baru dimulai dengan model: ${selectedModel}
📍 Lokasi: ${user?.kabupaten || 'Indonesia'}
🕐 Waktu: ${new Date().toLocaleString('id-ID')}

Silakan ajukan pertanyaan baru tentang:
• Analisis data satelit • Interpretasi cuaca • Manajemen tanaman • Supply chain optimization`,
        timestamp: new Date(),
        session: chatSession
      }
    ]);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
    toast.textContent = 'Pesan disalin ke clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  const exportChat = () => {
    const chatData = {
      user: user?.kabupaten,
      session: chatSession,
      model: selectedModel,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        confidence: msg.confidence,
        sources: msg.sources
      }))
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAMIKNA_Chat_${user?.kabupaten}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleActionClick = (action) => {
    switch(action) {
      case 'viewNDVIMap':
        window.open('/dashboard/maps?layer=ndvi', '_blank');
        break;
      case 'viewForecast':
        window.open('/dashboard/weather', '_blank');
        break;
      case 'downloadReport':
        window.open('/dashboard/reports?export=pdf', '_blank');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  return (
    <>
      <Head>
        <title>SAMIKNA AI Assistant - Smart Agricultural Consulting</title>
        <meta name="description" content="AI-powered agricultural assistant with satellite data integration" />
      </Head>

      <DashboardLayout>
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6">
          
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <FaBrain className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h1 className="text-lg font-bold">SAMIKNA AI Assistant</h1>
                    <p className="text-xs text-purple-100">
                      Intelligent Agricultural Consulting • {user?.kabupaten}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={chatSession}
                    onChange={(e) => setChatSession(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                  >
                    {chatSessions.map(session => (
                      <option key={session.id} value={session.id} className="text-gray-900">
                        {session.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <HiCog className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span>Model: {selectedModel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaSatellite className="w-3 h-3" />
                  <span>Satellite: Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCloud className="w-3 h-3" />
                  <span>Weather: Connected</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                          : 'bg-gradient-to-br from-green-500 to-blue-500'
                      }`}>
                        {message.type === 'user' ? (
                          <FaUser className="w-4 h-4 text-white" />
                        ) : (
                          <FaBrain className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl max-w-none ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                        }`}>
                          <div className="whitespace-pre-wrap leading-relaxed text-sm">
                            {message.content}
                          </div>
                          
                          {/* AI Metadata */}
                          {message.type === 'bot' && message.confidence && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                              <div className="flex items-center justify-between mb-1">
                                <span>Confidence: {message.confidence}%</span>
                                <span>Processing: {message.processingTime}</span>
                              </div>
                              <div className="text-xs">
                                Sources: {message.sources?.slice(0, 2).join(', ')}
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
                            >
                              <HiClipboard className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <HiThumbUp className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <HiThumbDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Bot Actions */}
                        {message.actions && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(action.action)}
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full text-xs font-medium hover:shadow-lg transition-all"
                              >
                                {action.icon && <action.icon className="w-3 h-3" />}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 grid grid-cols-2 gap-2 max-w-md">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQuickResponse(suggestion)}
                                className="text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs transition-colors border border-blue-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                      <FaBrain className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 bg-white rounded-2xl border border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {selectedModel === 'expert' ? 'Analyzing complex patterns...' : 
                         selectedModel === 'advanced' ? 'Processing satellite data...' : 
                         'Generating response...'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <HiLightBulb className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-700">Quick Agriculture Consultation:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {quickResponses.slice(0, 5).map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="flex-shrink-0 px-3 py-1 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-lg text-xs transition-all"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end gap-3">
                {/* Text Input */}
                <div className="flex-1 relative">
                  <div className="absolute top-2 left-3 flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span>AI Ready</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{chatSession} Mode</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Konsultasikan analisis satelit, interpretasi data cuaca, strategi pertanian..."
                    className="w-full px-4 pt-7 pb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all text-sm"
                    style={{ minHeight: '60px', maxHeight: '120px' }}
                  />
                  
                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>{inputMessage.length}/2000</span>
                  </div>
                </div>

                {/* Voice Input */}
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-xl transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <HiStop className="w-4 h-4" /> : <HiMicrophone className="w-4 h-4" />}
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <HiPaperAirplane className="w-4 h-4 transform rotate-45" />
                </button>
              </div>

              {/* Voice Recognition Indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-red-600"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">Mendengarkan pertanyaan...</span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-1 h-4 bg-red-400 animate-pulse" />
                    <div className="w-1 h-3 bg-red-400 animate-pulse" style={{animationDelay: '0.1s'}} />
                    <div className="w-1 h-5 bg-red-400 animate-pulse" style={{animationDelay: '0.2s'}} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-80 bg-white rounded-2xl shadow-lg p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">AI Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* AI Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    AI Model
                  </label>
                  <div className="space-y-2">
                    {aiModels.map((model) => (
                      <label key={model.id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="aiModel"
                          value={model.id}
                          checked={selectedModel === model.id}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{model.name}</div>
                          <div className="text-xs text-gray-500">{model.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chat Actions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Actions
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={exportChat}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <HiDownload className="w-4 h-4" />
                      Export Chat History
                    </button>
                    <button
                      onClick={clearChat}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      <HiRefresh className="w-4 h-4" />
                      Clear Chat
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Session Stats
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Messages:</span>
                      <span className="font-medium">{messages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session:</span>
                      <span className="font-medium capitalize">{chatSession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium capitalize">{selectedModel}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(ChatbotPage);