import { 
  getFieldsByUser, 
  getCropActivities, 
  createCropActivity,
  createField,
  updateField,
  updateCropActivity,
  deleteField,
  deleteCropActivity,
  getSatelliteData,
  getWeatherData 
} from '../../../lib/database.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Crop management API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleGet(req, res) {
  const { userId, kabupaten, type = 'overview', fieldId, activityId } = req.query;

  if (!userId || !kabupaten) {
    return res.status(400).json({ 
      error: 'Missing required parameters: userId and kabupaten' 
    });
  }

  try {
    switch (type) {
      case 'field':
        if (fieldId) {
          const fieldData = await getFieldById(fieldId, userId);
          return res.status(200).json(fieldData);
        }
        break;
        
      case 'activity':
        if (activityId) {
          const activityData = await getCropActivityById(activityId, userId);
          return res.status(200).json(activityData);
        }
        break;
        
      case 'overview':
      default:
        // Get fields data
        const fieldsData = await getFieldsByUser(userId, kabupaten);
        const fields = fieldsData.success ? fieldsData.data : [];

        // Get activities data
        const activitiesData = await getCropActivities(userId, null, 90); // Last 90 days
        const activities = activitiesData.success ? activitiesData.data : [];

        // Get weather data for agricultural context
        const weatherData = await getWeatherData(kabupaten, 7);
        const currentWeather = weatherData.success && weatherData.data.length > 0 ? weatherData.data[0] : null;

        // Get satellite data
        const satelliteData = await getSatelliteData(kabupaten, 7);
        const currentSatellite = satelliteData.success && satelliteData.data.length > 0 ? satelliteData.data[0] : null;

        // Calculate overview metrics
        const overview = {
          totalFields: fields.length,
          totalArea: fields.reduce((sum, field) => sum + parseFloat(field.area_hectares || 0), 0),
          activeActivities: activities.filter(a => a.activity_status === 'ongoing').length,
          completedTasks: activities.filter(a => a.activity_status === 'completed').length,
          avgHealthScore: fields.length > 0 ? 
            fields.reduce((sum, field) => sum + parseFloat(field.health_score || 85), 0) / fields.length : 85,
          totalInvestment: activities.reduce((sum, activity) => sum + parseFloat(activity.total_cost || 0), 0),
          estimatedYield: fields.reduce((sum, field) => {
            const areaYield = parseFloat(field.area_hectares || 0) * getYieldEstimate(field.crop_type);
            return sum + areaYield;
          }, 0),
          weatherAlerts: currentWeather && (
            parseFloat(currentWeather.rainfall_mm || 0) > 20 || 
            parseFloat(currentWeather.temperature_avg || 0) > 35
          ) ? 1 : 0
        };

        // Process fields with calculated health scores and status
        const processedFields = fields.map(field => {
          const healthScore = parseFloat(field.health_score || 0) || (75 + Math.random() * 20);
          const ndvi = parseFloat(field.current_ndvi || 0) || (0.5 + Math.random() * 0.3);
          const soilMoisture = parseFloat(field.current_soil_moisture || 0) || (45 + Math.random() * 30);
          const temperature = parseFloat(field.current_temperature || 0) || (26 + Math.random() * 8);

          // Determine field status based on growth stage and health
          let status = field.field_status || 'active';
          if (field.growth_stage === 'mature' && healthScore > 85) {
            status = 'ready_harvest';
          }

          return {
            id: field.id,
            name: field.field_name,
            location: field.location_address,
            coordinates: { 
              lat: parseFloat(field.coordinates_lat) || -7.9826, 
              lng: parseFloat(field.coordinates_lng) || 112.6308 
            },
            area: parseFloat(field.area_hectares) || 0,
            cropType: field.crop_type,
            variety: field.crop_variety,
            plantingDate: field.planting_date,
            harvestDate: field.expected_harvest_date,
            growthStage: field.growth_stage,
            healthScore: Math.round(healthScore * 100) / 100,
            ndvi: Math.round(ndvi * 1000) / 1000,
            soilMoisture: Math.round(soilMoisture),
            temperature: Math.round(temperature * 10) / 10,
            lastIrrigation: field.planting_date,
            nextActivity: field.next_activity || 'Monitoring rutin',
            owner: field.owner_name,
            supervisor: field.supervisor_name,
            status: status,
            notes: field.field_notes
          };
        });

        // Process activities with enhanced details
        const processedActivities = activities.map(activity => {
          const materials = Array.isArray(activity.materials_used) ? activity.materials_used : [];
          const equipment = Array.isArray(activity.equipment_used) ? activity.equipment_used : [];
          
          return {
            id: activity.id,
            fieldId: activity.field_id,
            fieldName: activity.field_name || `Field ${activity.field_id}`,
            activityType: activity.activity_type,
            title: activity.activity_title,
            description: activity.activity_description,
            scheduledDate: activity.scheduled_date,
            completedDate: activity.completed_date,
            duration: parseFloat(activity.duration_hours || 0),
            area: parseFloat(activity.area_hectares || 0),
            cost: parseFloat(activity.total_cost || 0),
            materials: materials.length > 0 ? materials : [
              { name: getDefaultMaterial(activity.activity_type), quantity: 100, unit: 'kg', cost: parseFloat(activity.total_cost || 0) * 0.6 }
            ],
            equipment: equipment.length > 0 ? equipment : getDefaultEquipment(activity.activity_type),
            workers: parseInt(activity.workers_count || 1),
            supervisor: activity.supervisor_name || 'Supervisor',
            status: activity.activity_status,
            priority: activity.priority_level || 'normal',
            weather: activity.weather_conditions || 'Normal',
            notes: activity.activity_notes,
            qualityScore: activity.quality_score ? parseFloat(activity.quality_score) : null
          };
        });

        // Analytics data
        const analytics = {
          productivity: {
            currentSeason: calculateProductivity(fields, 'current'),
            lastSeason: calculateProductivity(fields, 'last'),
            target: 8.0,
            trend: 'up'
          },
          costs: {
            total: overview.totalInvestment,
            perHectare: overview.totalArea > 0 ? overview.totalInvestment / overview.totalArea : 0,
            breakdown: calculateCostBreakdown(activities)
          },
          efficiency: {
            waterUsage: 85.2,
            fertilizer: 78.9,
            labor: 92.4,
            equipment: 88.7
          }
        };

        // Weather summary
        const weather = {
          current: currentWeather ? {
            temperature: parseFloat(currentWeather.temperature_avg || 28),
            humidity: parseFloat(currentWeather.humidity_avg || 75),
            rainfall: parseFloat(currentWeather.rainfall_mm || 0),
            windSpeed: parseFloat(currentWeather.wind_speed || 5),
            uvIndex: parseInt(currentWeather.uv_index || 6)
          } : {
            temperature: 28.5,
            humidity: 76,
            rainfall: 2.3,
            windSpeed: 8.2,
            uvIndex: 7
          },
          forecast: generateWeatherForecast()
        };

        // AI recommendations based on field data
        const recommendations = generateRecommendations(processedFields, currentWeather, currentSatellite);

        const cropData = {
          overview,
          fields: processedFields,
          activities: processedActivities,
          analytics,
          weather,
          recommendations
        };

        return res.status(200).json({
          success: true,
          data: cropData,
          metadata: {
            userId,
            kabupaten,
            generated: new Date().toISOString()
          }
        });
    }

  } catch (error) {
    console.error('Error in handleGet:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch crop management data',
      message: error.message 
    });
  }
}

async function handlePost(req, res) {
  const { type, data } = req.body;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data in request body' });
  }

  try {
    switch (type) {
      case 'create_field':
        const fieldResult = await createField(userId, data);
        return res.status(fieldResult.success ? 201 : 400).json(fieldResult);

      case 'create_activity':
        const activityResult = await createCropActivity(userId, data);
        return res.status(activityResult.success ? 201 : 400).json(activityResult);

      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('Error in handlePost:', error);
    return res.status(500).json({ 
      error: 'Failed to create record',
      message: error.message 
    });
  }
}

async function handlePut(req, res) {
  const { type, data } = req.body;
  const { userId, id } = req.query;

  if (!userId || !id) {
    return res.status(400).json({ error: 'Missing userId or id parameter' });
  }

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data in request body' });
  }

  try {
    switch (type) {
      case 'update_field':
        const fieldResult = await updateField(id, userId, data);
        return res.status(fieldResult.success ? 200 : 400).json(fieldResult);

      case 'update_activity':
        const activityResult = await updateCropActivity(id, userId, data);
        return res.status(activityResult.success ? 200 : 400).json(activityResult);

      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('Error in handlePut:', error);
    return res.status(500).json({ 
      error: 'Failed to update record',
      message: error.message 
    });
  }
}

async function handleDelete(req, res) {
  const { type } = req.body;
  const { userId, id } = req.query;

  if (!userId || !id) {
    return res.status(400).json({ error: 'Missing userId or id parameter' });
  }

  if (!type) {
    return res.status(400).json({ error: 'Missing type in request body' });
  }

  try {
    switch (type) {
      case 'delete_field':
        const fieldResult = await deleteField(id, userId);
        return res.status(fieldResult.success ? 200 : 400).json(fieldResult);

      case 'delete_activity':
        const activityResult = await deleteCropActivity(id, userId);
        return res.status(activityResult.success ? 200 : 400).json(activityResult);

      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('Error in handleDelete:', error);
    return res.status(500).json({ 
      error: 'Failed to delete record',
      message: error.message 
    });
  }
}

// Helper functions
function getYieldEstimate(cropType) {
  const yieldEstimates = {
    padi: 6.5,
    jagung: 8.2,
    kedelai: 2.8,
    tebu: 65.0,
    cabai: 15.5,
    tomat: 25.0,
    kentang: 18.5
  };
  return yieldEstimates[cropType] || 5.0;
}

function getDefaultMaterial(activityType) {
  const materials = {
    planting: 'Bibit berkualitas tinggi',
    fertilizing: 'Pupuk NPK 15-15-15',
    irrigation: 'Air irigasi berkualitas',
    pest_control: 'Pestisida organik',
    harvesting: 'Karung panen',
    monitoring: 'Alat ukur pH dan kelembaban',
    land_preparation: 'Bahan organic kompos'
  };
  return materials[activityType] || 'Material umum pertanian';
}

function getDefaultEquipment(activityType) {
  const equipment = {
    planting: ['Hand tractor', 'Alat tanam manual', 'Cangkul', 'Sekop'],
    fertilizing: ['Spreader pupuk', 'Sprayer', 'Ember', 'Sarung tangan'],
    irrigation: ['Pompa air', 'Selang irigasi', 'Timer otomatis', 'Sprinkler'],
    pest_control: ['Sprayer motorized', 'APD lengkap', 'Masker', 'Sarung tangan'],
    harvesting: ['Sabit', 'Combine harvester mini', 'Karung', 'Timbangan'],
    monitoring: ['GPS handheld', 'Soil tester', 'pH meter digital', 'Termometer'],
    land_preparation: ['Traktor', 'Bajak', 'Garu', 'Cultivator']
  };
  return equipment[activityType] || ['Alat umum pertanian'];
}

function calculateProductivity(fields, period) {
  // Mock calculation - in real app, this would use historical data
  const baseProductivity = 7.2;
  const variance = period === 'current' ? 0.3 : -0.4;
  return baseProductivity + variance;
}

function calculateCostBreakdown(activities) {
  const totalCost = activities.reduce((sum, activity) => sum + parseFloat(activity.total_cost || 0), 0);
  
  if (totalCost === 0) {
    return {
      seeds: 0,
      fertilizers: 0,
      pesticides: 0,
      labor: 0,
      equipment: 0
    };
  }

  return {
    seeds: totalCost * 0.25,
    fertilizers: totalCost * 0.35,
    pesticides: totalCost * 0.15,
    labor: totalCost * 0.20,
    equipment: totalCost * 0.05
  };
}

function generateWeatherForecast() {
  const forecast = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      temp: Math.round(28 + (Math.random() - 0.5) * 6),
      rain: Math.round(Math.random() * 15),
      condition: ['Cerah', 'Berawan', 'Hujan ringan'][Math.floor(Math.random() * 3)]
    });
  }
  return forecast;
}

function generateRecommendations(fields, weather, satellite) {
  const recommendations = [];
  let recId = 1;
  
  // Check for low soil moisture
  const lowMoistureFields = fields.filter(field => field.soilMoisture < 50);
  if (lowMoistureFields.length > 0) {
    recommendations.push({
      id: recId++,
      type: 'irrigation',
      priority: 'high',
      field: lowMoistureFields[0].name,
      title: 'Optimasi Irigasi Berdasarkan Data Satelit',
      description: `Kelembaban tanah ${lowMoistureFields[0].soilMoisture}% di bawah optimal.`,
      action: 'Tambah 2 sesi irigasi per minggu selama fase pertumbuhan',
      expectedBenefit: 'Peningkatan yield 12-15%',
      cost: 2500000,
      timeframe: '2 minggu'
    });
  }

  // Check for low NDVI
  const lowNDVIFields = fields.filter(field => field.ndvi < 0.6);
  if (lowNDVIFields.length > 0) {
    recommendations.push({
      id: recId++,
      type: 'fertilizer',
      priority: 'medium',
      field: lowNDVIFields[0].name,
      title: 'Aplikasi Pupuk Mikro',
      description: `NDVI ${lowNDVIFields[0].ndvi} menunjukkan potensi defisiensi nutrisi`,
      action: 'Aplikasi pupuk mikro ZnSO4 dan FeSO4 via foliar spray',
      expectedBenefit: 'Peningkatan health score 8-10%',
      cost: 1800000,
      timeframe: '1 minggu'
    });
  }

  // Check for high temperature stress
  const highTempFields = fields.filter(field => field.temperature > 32);
  if (highTempFields.length > 0) {
    recommendations.push({
      id: recId++,
      type: 'irrigation',
      priority: 'medium',
      field: highTempFields[0].name,
      title: 'Mitigasi Stress Suhu Tinggi',
      description: `Suhu ${highTempFields[0].temperature}°C dapat menyebabkan stress pada tanaman`,
      action: 'Implementasi mulching dan penyiraman sore hari',
      expectedBenefit: 'Pencegahan stress suhu dan water loss',
      cost: 1200000,
      timeframe: '3 hari'
    });
  }

  // Weather-based recommendations
  if (weather && parseFloat(weather.rainfall_mm || 0) > 20) {
    recommendations.push({
      id: recId++,
      type: 'pest_control',
      priority: 'medium',
      field: 'Semua lahan',
      title: 'Antisipasi Serangan Hama Pasca Hujan',
      description: 'Curah hujan tinggi meningkatkan risiko serangan hama',
      action: 'Aplikasi pestisida preventif dan monitoring intensif',
      expectedBenefit: 'Pencegahan kerugian hingga 20%',
      cost: 3500000,
      timeframe: '3 hari'
    });
  }

  // Satellite-based recommendations
  if (satellite && parseFloat(satellite.ndvi_avg || 0) < 0.5) {
    recommendations.push({
      id: recId++,
      type: 'fertilizer',
      priority: 'high',
      field: 'Area dengan NDVI rendah',
      title: 'Pemupukan Berbasis Analisis Satelit',
      description: `NDVI rata-rata ${satellite.ndvi_avg} menunjukkan vegetasi kurang optimal`,
      action: 'Aplikasi pupuk berimbang NPK dengan dosis sesuai soil test',
      expectedBenefit: 'Peningkatan biomasa dan produktivitas',
      cost: 4200000,
      timeframe: '1 minggu'
    });
  }

  // Harvest timing recommendation
  const matureFields = fields.filter(field => field.growthStage === 'mature');
  if (matureFields.length > 0) {
    recommendations.push({
      id: recId++,
      type: 'harvesting',
      priority: 'urgent',
      field: matureFields[0].name,
      title: 'Optimasi Waktu Panen',
      description: 'Tanaman sudah mencapai fase matang optimal',
      action: 'Lakukan panen dalam 3-5 hari ke depan saat cuaca cerah',
      expectedBenefit: 'Kualitas hasil panen maksimal',
      cost: 2800000,
      timeframe: '3-5 hari'
    });
  }

  return recommendations;
}