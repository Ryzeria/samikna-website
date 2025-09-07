import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiDesktopComputer, HiCloud, HiDeviceMobile, HiShieldCheck,
  HiCloudUpload, HiDatabase, HiGlobe, HiChartBar
} from 'react-icons/hi';
import { 
  FaSatellite, FaCloudSun, FaSeedling, FaWarehouse,
  FaRocket, FaShield, FaMobile, FaDesktop, FaLeaf
} from 'react-icons/fa';
import { fadeIn, textVariant, staggerContainer, bounceIn } from '../animations/motionVariants';

const Specifications = () => {
  const [activeTab, setActiveTab] = useState('satellite');

  const tabs = [
    { id: 'satellite', label: 'Satellite Data', icon: FaSatellite },
    { id: 'platform', label: 'Platform Features', icon: HiDesktopComputer },
    { id: 'analytics', label: 'Analytics & AI', icon: HiChartBar },
    { id: 'integration', label: 'Integration', icon: HiCloud }
  ];

  const specifications = {
    satellite: {
      title: "Spesifikasi Data Satelit",
      subtitle: "Data satelit berkualitas tinggi untuk monitoring presisi tinggi",
      items: [
        {
          category: "Satellite Imagery",
          icon: FaSatellite,
          specs: [
            { label: "Spatial Resolution", value: "30cm - 10m", unit: "pixel" },
            { label: "Temporal Resolution", value: "Daily - Weekly", unit: "update" },
            { label: "Spectral Bands", value: "Multispectral (4-12)", unit: "bands" },
            { label: "Coverage Area", value: "Global", unit: "coverage" },
            { label: "Data Sources", value: "Landsat, Sentinel, Planet", unit: "" }
          ]
        },
        {
          category: "Vegetation Indices",
          icon: FaSeedling,
          specs: [
            { label: "NDVI Analysis", value: "0.1 - 1.0", unit: "range" },
            { label: "EVI Enhanced", value: "Advanced calculation", unit: "" },
            { label: "SAVI Soil-Adjusted", value: "Real-time processing", unit: "" },
            { label: "LAI Leaf Area", value: "Automated extraction", unit: "" },
            { label: "Update Frequency", value: "Every 3-7 days", unit: "" }
          ]
        },
        {
          category: "Weather Data",
          icon: FaCloudSun,
          specs: [
            { label: "Temperature Range", value: "-50°C to +60°C", unit: "°C" },
            { label: "Humidity Range", value: "0% to 100%", unit: "RH" },
            { label: "Precipitation", value: "0-500mm/day", unit: "rainfall" },
            { label: "Wind Speed", value: "0-200 km/h", unit: "speed" },
            { label: "Forecast Range", value: "14 days", unit: "ahead" }
          ]
        },
        {
          category: "Data Processing",
          icon: HiDatabase,
          specs: [
            { label: "Processing Time", value: "<4 hours", unit: "from acquisition" },
            { label: "Cloud Filtering", value: "Automatic", unit: "removal" },
            { label: "Atmospheric Correction", value: "Applied", unit: "" },
            { label: "Georeferencing", value: "Sub-pixel accuracy", unit: "" },
            { label: "Quality Assessment", value: "Automated scoring", unit: "" }
          ]
        }
      ]
    },
    platform: {
      title: "Spesifikasi Platform",
      subtitle: "Platform digital terintegrasi untuk manajemen pertanian lengkap",
      items: [
        {
          category: "Web Dashboard",
          icon: FaDesktop,
          specs: [
            { label: "Browser Support", value: "Chrome, Firefox, Safari, Edge", unit: "" },
            { label: "Response Time", value: "<2 seconds", unit: "page load" },
            { label: "Concurrent Users", value: "10,000+", unit: "simultaneous" },
            { label: "Uptime SLA", value: "99.9%", unit: "guaranteed" },
            { label: "Data Refresh", value: "Real-time", unit: "updates" }
          ]
        },
        {
          category: "Mobile Application",
          icon: FaMobile,
          specs: [
            { label: "Platform Support", value: "iOS 12+, Android 8+", unit: "" },
            { label: "Offline Mode", value: "7 days", unit: "cached data" },
            { label: "Push Notifications", value: "Instant", unit: "alerts" },
            { label: "GPS Integration", value: "High accuracy", unit: "positioning" },
            { label: "Camera Integration", value: "Field documentation", unit: "" }
          ]
        },
        {
          category: "Data Management",
          icon: HiDatabase,
          specs: [
            { label: "Storage Capacity", value: "Unlimited", unit: "cloud storage" },
            { label: "Data Retention", value: "10+ years", unit: "historical" },
            { label: "Backup Frequency", value: "Real-time", unit: "automatic" },
            { label: "Export Formats", value: "CSV, GeoTIFF, Shapefile, PDF", unit: "" },
            { label: "Data Security", value: "Enterprise-grade", unit: "encryption" }
          ]
        },
        {
          category: "User Management",
          icon: HiShieldCheck,
          specs: [
            { label: "User Roles", value: "5+ predefined", unit: "roles" },
            { label: "Permission System", value: "Granular control", unit: "" },
            { label: "Multi-tenancy", value: "Organization-based", unit: "" },
            { label: "SSO Integration", value: "SAML, OAuth 2.0", unit: "" },
            { label: "Audit Logging", value: "Complete activity", unit: "tracking" }
          ]
        }
      ]
    },
    analytics: {
      title: "Analytics & AI Capabilities",
      subtitle: "Analisis prediktif dan machine learning untuk insight mendalam",
      items: [
        {
          category: "Predictive Analytics",
          icon: HiChartBar,
          specs: [
            { label: "Yield Prediction", value: "85-95%", unit: "accuracy" },
            { label: "Weather Forecasting", value: "14 days", unit: "ahead" },
            { label: "Disease Detection", value: "Early warning", unit: "system" },
            { label: "Growth Modeling", value: "Crop-specific", unit: "algorithms" },
            { label: "Market Price", value: "Trend analysis", unit: "" }
          ]
        },
        {
          category: "Machine Learning",
          icon: FaRocket,
          specs: [
            { label: "Algorithm Type", value: "Deep Neural Networks", unit: "" },
            { label: "Training Data", value: "10+ years", unit: "historical" },
            { label: "Model Updates", value: "Monthly", unit: "refinement" },
            { label: "Accuracy Improvement", value: "Continuous", unit: "learning" },
            { label: "Custom Models", value: "Available", unit: "on request" }
          ]
        },
        {
          category: "Crop Intelligence",
          icon: FaSeedling,
          specs: [
            { label: "Crop Database", value: "500+", unit: "varieties" },
            { label: "Growth Stages", value: "Automated detection", unit: "" },
            { label: "Stress Indicators", value: "Multi-factor analysis", unit: "" },
            { label: "Recommendation Engine", value: "AI-powered", unit: "suggestions" },
            { label: "ROI Calculator", value: "Real-time", unit: "analysis" }
          ]
        },
        {
          category: "Supply Chain Analytics",
          icon: FaWarehouse,
          specs: [
            { label: "Demand Forecasting", value: "90%+", unit: "accuracy" },
            { label: "Inventory Optimization", value: "Real-time", unit: "tracking" },
            { label: "Price Monitoring", value: "Multi-market", unit: "analysis" },
            { label: "Logistics Planning", value: "Route optimization", unit: "" },
            { label: "Quality Tracking", value: "End-to-end", unit: "traceability" }
          ]
        }
      ]
    },
    integration: {
      title: "Integration & Connectivity",
      subtitle: "Konektivitas seamless dengan sistem dan platform eksternal",
      items: [
        {
          category: "API Specifications",
          icon: HiCloudUpload,
          specs: [
            { label: "REST API", value: "v3.0", unit: "version" },
            { label: "GraphQL Support", value: "Available", unit: "" },
            { label: "Webhook Support", value: "Real-time", unit: "events" },
            { label: "Rate Limiting", value: "10,000 req/hour", unit: "" },
            { label: "API Documentation", value: "Interactive", unit: "OpenAPI 3.0" }
          ]
        },
        {
          category: "Third-party Integration",
          icon: HiGlobe,
          specs: [
            { label: "ERP Systems", value: "SAP, Oracle, Microsoft", unit: "" },
            { label: "Accounting Software", value: "QuickBooks, Xero", unit: "" },
            { label: "Weather Services", value: "Multiple providers", unit: "" },
            { label: "Market Data", value: "Real-time feeds", unit: "" },
            { label: "Government APIs", value: "Agricultural departments", unit: "" }
          ]
        },
        {
          category: "Cloud Infrastructure",
          icon: HiCloud,
          specs: [
            { label: "Cloud Provider", value: "AWS, Azure, GCP", unit: "multi-cloud" },
            { label: "Data Centers", value: "Global", unit: "distribution" },
            { label: "Scalability", value: "Auto-scaling", unit: "" },
            { label: "Load Balancing", value: "Intelligent", unit: "routing" },
            { label: "CDN Support", value: "Global edge", unit: "locations" }
          ]
        },
        {
          category: "Security & Compliance",
          icon: FaShield,
          specs: [
            { label: "Data Encryption", value: "AES-256", unit: "at rest & transit" },
            { label: "Compliance", value: "SOC 2, ISO 27001", unit: "" },
            { label: "Access Control", value: "Multi-factor auth", unit: "" },
            { label: "Network Security", value: "VPN, Firewall", unit: "" },
            { label: "Privacy", value: "GDPR compliant", unit: "" }
          ]
        }
      ]
    }
  };

  return (
    <section id="specifications" className="py-16 md:py-24 bg-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-secondary-200 rounded-full blur-3xl"></div>
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
            <span className="text-primary-700 font-medium">Spesifikasi Platform</span>
          </motion.div>
          
          <motion.h2
            variants={textVariant(0.3)}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Spesifikasi{' '}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Platform Lengkap
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeIn('up', 0.4)}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Detail spesifikasi teknis komprehensif platform SAMIKNA, mulai dari data satelit, 
            fitur platform, hingga capabilities analytics dan AI untuk pertanian digital.
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Tab Header */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {specifications[activeTab].title}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {specifications[activeTab].subtitle}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specifications[activeTab].items.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn('up', 0.2 * (index + 1))}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{item.category}</h4>
                </div>

                {/* Specs List */}
                <div className="space-y-4">
                  {item.specs.map((spec, specIndex) => (
                    <div
                      key={specIndex}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-gray-600 font-medium">{spec.label}</span>
                      <div className="text-right">
                        <span className="text-gray-900 font-bold">{spec.value}</span>
                        {spec.unit && (
                          <span className="text-gray-500 text-sm ml-1">{spec.unit}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Capabilities */}
        <motion.div
          variants={fadeIn('up', 0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Platform Capabilities & Standards
          </h3>
          <p className="text-primary-100 mb-8 max-w-3xl mx-auto">
            Platform SAMIKNA memenuhi standar internasional untuk keamanan data, 
            performa, dan integrasi dengan sistem enterprise.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'ISO 27001', desc: 'Information Security' },
              { name: 'SOC 2 Type II', desc: 'Security & Availability' },
              { name: 'GDPR Compliant', desc: 'Data Privacy' },
              { name: '99.9% Uptime', desc: 'Service Level Agreement' }
            ].map((cert, index) => (
              <motion.div
                key={index}
                variants={bounceIn(0.8 + index * 0.1)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <HiShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-lg">{cert.name}</div>
                <div className="text-primary-100 text-sm">{cert.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation & Support */}
        <motion.div
          variants={fadeIn('up', 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Butuh Dokumentasi Teknis atau Demo Platform?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Download dokumentasi API, panduan integrasi, dan akses demo platform 
            untuk evaluasi lebih mendalam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              Download API Docs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-primary-300 hover:text-primary-600 transition-all"
            >
              Request Demo Access
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Specifications;