import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import {
  HiPlus, HiClock, HiDownload, HiRefresh, HiExclamation, HiChartBar,
} from 'react-icons/hi';
import {
  FaSeedling, FaTractor, FaRobot, FaMapMarkedAlt, FaClipboardList,
  FaDollarSign, FaChartLine, FaFlask, FaTint, FaLeaf,
} from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { withAuth, useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/apiClient';
import CropOverviewTab from '../../components/crop-management/CropOverviewTab';
import FieldsTab from '../../components/crop-management/FieldsTab';
import ActivitiesTab from '../../components/crop-management/ActivitiesTab';
import RecommendationsTab from '../../components/crop-management/RecommendationsTab';
import AddCropModal from '../../components/crop-management/AddCropModal';
import EditFieldModal from '../../components/crop-management/EditFieldModal';
import EditActivityModal from '../../components/crop-management/EditActivityModal';

const TABS = [
  { id: 'overview',         label: 'Dashboard Overview',    icon: HiChartBar },
  { id: 'fields',           label: 'Field Management',      icon: FaMapMarkedAlt },
  { id: 'activities',       label: 'Activity Tracking',     icon: FaClipboardList },
  { id: 'analytics',        label: 'Performance Analytics', icon: FaChartLine },
  { id: 'recommendations',  label: 'AI Recommendations',    icon: FaRobot },
];

const ACTIVITY_TYPES = [
  { id: 'planting',     label: 'Penanaman',           icon: FaSeedling, color: 'green' },
  { id: 'fertilizing',  label: 'Pemupukan',            icon: FaFlask,    color: 'blue' },
  { id: 'irrigation',   label: 'Irigasi',              icon: FaTint,     color: 'cyan' },
  { id: 'pest_control', label: 'Pengendalian Hama',    icon: FaLeaf,     color: 'red' },
  { id: 'harvesting',   label: 'Panen',                icon: FaSeedling, color: 'yellow' },
  { id: 'monitoring',   label: 'Monitoring',           icon: FaTractor,  color: 'gray' },
];

const CROP_TYPES = [
  { id: 'padi',    label: 'Padi' },
  { id: 'jagung',  label: 'Jagung' },
  { id: 'kedelai', label: 'Kedelai' },
  { id: 'tebu',    label: 'Tebu' },
  { id: 'cabai',   label: 'Cabai' },
  { id: 'tomat',   label: 'Tomat' },
  { id: 'kentang', label: 'Kentang' },
  { id: 'other',   label: 'Lainnya' },
];

const GROWTH_STAGES = [
  { id: 'land_preparation', label: 'Persiapan Lahan' },
  { id: 'planting',         label: 'Penanaman' },
  { id: 'vegetative',       label: 'Vegetatif' },
  { id: 'flowering',        label: 'Berbunga' },
  { id: 'fruiting',         label: 'Berbuah' },
  { id: 'mature',           label: 'Matang' },
  { id: 'harvested',        label: 'Dipanen' },
];

const FALLBACK_DATA = {
  overview: { totalFields: 0, totalArea: 0, activeActivities: 0, completedTasks: 0, avgHealthScore: 85, totalInvestment: 0, estimatedYield: 0, weatherAlerts: 0 },
  fields: [],
  activities: [],
  analytics: { productivity: { currentSeason: 0, lastSeason: 0, target: 8.0, trend: 'stable' }, costs: { total: 0, perHectare: 0, breakdown: {} }, efficiency: { waterUsage: 85, fertilizer: 78, labor: 92, equipment: 88 } },
  weather: { current: { temperature: 28, humidity: 75, rainfall: 0, windSpeed: 8, uvIndex: 6 }, forecast: [] },
  recommendations: [],
};

const CropManagement = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeTab, setActiveTab]         = useState('overview');
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterCrop, setFilterCrop]       = useState('all');
  const [showAddForm, setShowAddForm]     = useState(false);
  const [addFormType, setAddFormType]     = useState('activity');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedField, setSelectedField]       = useState(null);
  const [cropData, setCropData]           = useState(null);
  const [lastUpdate, setLastUpdate]       = useState(new Date());

  // ─── Data loading ──────────────────────────────────────────────────────────

  const loadCropData = useCallback(async (userData = user) => {
    if (!userData) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/crop-management?userId=${userData.id}&kabupaten=${userData.kabupaten}`);
      const result = await res.json();
      if (result.success) {
        setCropData(result.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch crop management data');
      }
    } catch (err) {
      setError(err.message);
      setCropData(FALLBACK_DATA);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadCropData(user);
    else setLoading(false);
  }, [loadCropData, user]);

  // ─── CRUD handlers ─────────────────────────────────────────────────────────

  const handleCreateActivity = useCallback(async (formData) => {
    const activityData = {
      field_id:             parseInt(formData.get('field_id')),
      activity_type:        formData.get('activity_type'),
      activity_title:       formData.get('activity_title'),
      activity_description: formData.get('activity_description'),
      scheduled_date:       formData.get('scheduled_date'),
      duration_hours:       parseFloat(formData.get('duration_hours')) || 0,
      area_hectares:        parseFloat(formData.get('area_hectares')) || 0,
      workers_count:        parseInt(formData.get('workers_count')) || 1,
      total_cost:           parseFloat(formData.get('total_cost')) || 0,
      priority_level:       formData.get('priority_level'),
      supervisor_name:      formData.get('supervisor_name'),
      weather_conditions:   formData.get('weather_conditions'),
      activity_notes:       formData.get('activity_notes'),
      materials_used: [{
        name:     formData.get('material_name') || 'Material Utama',
        quantity: parseFloat(formData.get('material_quantity')) || 100,
        unit:     formData.get('material_unit') || 'kg',
        cost:     parseFloat(formData.get('material_cost')) || 0,
      }],
      equipment_used: (formData.get('equipment_used') || 'Alat Standar').split(',').map((e) => e.trim()),
    };
    try {
      const res = await apiFetch(`/api/crop-management?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'create_activity', data: activityData }),
      });
      const result = await res.json();
      if (result.success) {
        setShowAddForm(false);
        loadCropData();
        alert('Activity created successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to create activity'}`);
      }
    } catch {
      alert('Failed to create activity');
    }
  }, [user, loadCropData]);

  const handleCreateField = useCallback(async (formData) => {
    const fieldData = {
      field_name:            formData.get('field_name'),
      kabupaten:             user.kabupaten,
      location_address:      formData.get('location_address'),
      coordinates_lat:       parseFloat(formData.get('coordinates_lat')) || -7.9826,
      coordinates_lng:       parseFloat(formData.get('coordinates_lng')) || 112.6308,
      area_hectares:         parseFloat(formData.get('area_hectares')) || 0,
      crop_type:             formData.get('crop_type'),
      crop_variety:          formData.get('crop_variety'),
      planting_date:         formData.get('planting_date'),
      expected_harvest_date: formData.get('expected_harvest_date'),
      growth_stage:          formData.get('growth_stage') || 'land_preparation',
      owner_name:            formData.get('owner_name'),
      supervisor_name:       formData.get('supervisor_name'),
      field_notes:           formData.get('field_notes'),
    };
    try {
      const res = await apiFetch(`/api/crop-management?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'create_field', data: fieldData }),
      });
      const result = await res.json();
      if (result.success) {
        setShowAddForm(false);
        loadCropData();
        alert('Field created successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to create field'}`);
      }
    } catch {
      alert('Failed to create field');
    }
  }, [user, loadCropData]);

  const handleUpdateActivity = useCallback(async (activityId, formData) => {
    const activityData = {
      activity_title:       formData.get('activity_title'),
      activity_description: formData.get('activity_description'),
      scheduled_date:       formData.get('scheduled_date'),
      completed_date:       formData.get('completed_date'),
      duration_hours:       parseFloat(formData.get('duration_hours')) || 0,
      area_hectares:        parseFloat(formData.get('area_hectares')) || 0,
      workers_count:        parseInt(formData.get('workers_count')) || 1,
      total_cost:           parseFloat(formData.get('total_cost')) || 0,
      activity_status:      formData.get('activity_status'),
      priority_level:       formData.get('priority_level'),
      supervisor_name:      formData.get('supervisor_name'),
      weather_conditions:   formData.get('weather_conditions'),
      activity_notes:       formData.get('activity_notes'),
      quality_score:        parseFloat(formData.get('quality_score')) || null,
    };
    try {
      const res = await apiFetch(`/api/crop-management?userId=${user.id}&id=${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'update_activity', data: activityData }),
      });
      const result = await res.json();
      if (result.success) {
        setSelectedActivity(null);
        loadCropData();
        alert('Activity updated successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to update activity'}`);
      }
    } catch {
      alert('Failed to update activity');
    }
  }, [user, loadCropData]);

  const handleDeleteActivity = useCallback(async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      const res = await apiFetch(`/api/crop-management?userId=${user.id}&id=${activityId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'delete_activity' }),
      });
      const result = await res.json();
      if (result.success) {
        loadCropData();
        alert('Activity deleted successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to delete activity'}`);
      }
    } catch {
      alert('Failed to delete activity');
    }
  }, [user, loadCropData]);

  const handleUpdateField = useCallback(async (fieldId, formData) => {
    const fieldData = {
      field_name:            formData.get('field_name'),
      location_address:      formData.get('location_address'),
      coordinates_lat:       parseFloat(formData.get('coordinates_lat')) || null,
      coordinates_lng:       parseFloat(formData.get('coordinates_lng')) || null,
      area_hectares:         parseFloat(formData.get('area_hectares')),
      crop_variety:          formData.get('crop_variety'),
      expected_harvest_date: formData.get('expected_harvest_date'),
      growth_stage:          formData.get('growth_stage'),
      owner_name:            formData.get('owner_name'),
      supervisor_name:       formData.get('supervisor_name'),
      field_notes:           formData.get('field_notes'),
      field_status:          formData.get('field_status'),
    };
    try {
      const res = await apiFetch(`/api/crop-management?userId=${user.id}&id=${fieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'update_field', data: fieldData }),
      });
      const result = await res.json();
      if (result.success) {
        setSelectedField(null);
        loadCropData();
        alert('Field updated successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to update field'}`);
      }
    } catch {
      alert('Failed to update field');
    }
  }, [user, loadCropData]);

  const handleDeleteField = useCallback(async (fieldId) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    try {
      const res = await apiFetch(`/api/crop-management?userId=${user.id}&id=${fieldId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'delete_field' }),
      });
      const result = await res.json();
      if (result.success) {
        loadCropData();
        alert('Field deleted successfully!');
      } else {
        alert(`Error: ${result.message || 'Failed to delete field'}`);
      }
    } catch {
      alert('Failed to delete field');
    }
  }, [user, loadCropData]);

  const handleMarkActivityComplete = useCallback((activityId) => {
    const formData = new FormData();
    formData.set('activity_status', 'completed');
    formData.set('completed_date', new Date().toISOString().split('T')[0]);
    handleUpdateActivity(activityId, formData);
  }, [handleUpdateActivity]);

  // ─── Stable UI action handlers ─────────────────────────────────────────────

  const openAddActivity  = useCallback(() => { setAddFormType('activity'); setShowAddForm(true); }, []);
  const openAddField     = useCallback(() => { setAddFormType('field');    setShowAddForm(true); }, []);
  const closeAddForm     = useCallback(() => setShowAddForm(false), []);
  const closeFieldEdit   = useCallback(() => setSelectedField(null), []);
  const closeActivityEdit = useCallback(() => setSelectedActivity(null), []);
  const handleRefresh    = useCallback(() => loadCropData(), [loadCropData]);
  const navigateToChatbot = useCallback(() => router.push('/dashboard/chatbot'), [router]);
  const navigateToReports = useCallback(() => router.push('/dashboard/reports'), [router]);
  const handleViewField   = useCallback((id) => router.push(`/dashboard/maps?field=${id}`), [router]);

  // ─── Derived / memoised data ───────────────────────────────────────────────

  const filteredActivities = useMemo(() => {
    if (!cropData?.activities) return [];
    return cropData.activities.filter((activity) => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.fieldName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
      const matchesCrop   = filterCrop === 'all' ||
                           cropData.fields?.find((f) => f.id === activity.fieldId)?.cropType === filterCrop;
      return matchesSearch && matchesStatus && matchesCrop;
    });
  }, [cropData, searchQuery, filterStatus, filterCrop]);

  // ─── Loading / Error states ────────────────────────────────────────────────

  if (loading && !cropData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Loading crop management data...</p>
            <p className="text-gray-400 text-sm mt-2">Analyzing field conditions and activities</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !cropData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiExclamation className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 text-lg mb-2">Failed to load crop management data</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>Crop Management - {user?.kabupaten} | SAMIKNA</title>
        <meta name="description" content="Comprehensive crop management system with satellite monitoring and precision agriculture" />
      </Head>

      <DashboardLayout>
        <div className="space-y-6">

          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <FaSeedling className="absolute top-4 right-4 w-24 h-24" />
              <FaTractor className="absolute bottom-4 left-4 w-20 h-20" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    Smart Crop Management - {user?.kabupaten}
                  </h1>
                  <p className="text-green-100 text-lg mb-4">
                    Integrated precision agriculture with satellite monitoring and AI-driven insights
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaRobot className="w-4 h-4" />
                      <span>AI Recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkedAlt className="w-4 h-4" />
                      <span>{cropData?.overview?.totalFields || 0} Active Fields</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="w-4 h-4" />
                      <span>Updated: {lastUpdate.toLocaleTimeString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={openAddActivity}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add Activity
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={openAddField}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add Field
                  </motion.button>

                  <button
                    onClick={navigateToReports}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  >
                    <HiDownload className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <HiRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stale data warning */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <HiExclamation className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800">Warning: Some data may be cached due to connectivity issues.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Fields',      value: cropData?.overview?.totalFields || 0,                               unit: 'Fields',      icon: FaMapMarkedAlt, color: 'blue',   change: '+3 this season',            tab: 'fields' },
              { title: 'Total Area',         value: (cropData?.overview?.totalArea || 0).toFixed(1),                    unit: 'Hectares',    icon: FaSeedling,     color: 'green',  change: `Avg health: ${cropData?.overview?.avgHealthScore?.toFixed(0) || 85}%`, tab: 'analytics' },
              { title: 'Active Activities',  value: cropData?.overview?.activeActivities || 0,                          unit: 'Tasks',       icon: FaClipboardList,color: 'yellow', change: `${cropData?.overview?.completedTasks || 0} completed`, tab: 'activities' },
              { title: 'Total Investment',   value: ((cropData?.overview?.totalInvestment || 0) / 1000000).toFixed(1),  unit: 'Million IDR', icon: FaDollarSign,   color: 'purple', change: 'ROI tracking',              tab: 'analytics' },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                onClick={() => setActiveTab(metric.tab)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm font-medium">{metric.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className="text-gray-500 text-sm">{metric.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto px-6">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <CropOverviewTab cropData={cropData} />
              )}
              {activeTab === 'fields' && (
                <FieldsTab
                  fields={cropData?.fields}
                  onViewField={handleViewField}
                  onEditField={setSelectedField}
                  onDeleteField={handleDeleteField}
                  onAddField={openAddField}
                />
              )}
              {activeTab === 'activities' && (
                <ActivitiesTab
                  filteredActivities={filteredActivities}
                  fields={cropData?.fields}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterCrop={filterCrop}
                  setFilterCrop={setFilterCrop}
                  cropTypes={CROP_TYPES}
                  activityTypes={ACTIVITY_TYPES}
                  onEdit={setSelectedActivity}
                  onDelete={handleDeleteActivity}
                  onMarkComplete={handleMarkActivityComplete}
                  onAddActivity={openAddActivity}
                />
              )}
              {activeTab === 'recommendations' && (
                <RecommendationsTab
                  recommendations={cropData?.recommendations}
                  onNavigateToChatbot={navigateToChatbot}
                />
              )}
            </div>
          </motion.div>

          {/* Modals */}
          <AddCropModal
            show={showAddForm}
            formType={addFormType}
            fields={cropData?.fields}
            cropTypes={CROP_TYPES}
            activityTypes={ACTIVITY_TYPES}
            growthStages={GROWTH_STAGES}
            loading={loading}
            onClose={closeAddForm}
            onCreateActivity={handleCreateActivity}
            onCreateField={handleCreateField}
          />

          <EditFieldModal
            field={selectedField}
            growthStages={GROWTH_STAGES}
            loading={loading}
            onClose={closeFieldEdit}
            onSubmit={handleUpdateField}
          />

          <EditActivityModal
            activity={selectedActivity}
            loading={loading}
            onClose={closeActivityEdit}
            onSubmit={handleUpdateActivity}
          />

        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(CropManagement);
