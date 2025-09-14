/**
 * Dashboard Monitoring Kesehatan Tanaman
 * Google Earth Engine - User Friendly Version
 * Kabupaten Tuban, Jawa Timur
 */

// ===========================
// KONFIGURASI AWAL
// ===========================

// Load shapefile kabupaten
var kabupaten = ee.FeatureCollection('projects/ee-samikna/assets/BatasKabupaten');
var tuban = kabupaten.filter(ee.Filter.and(
  ee.Filter.eq('WADMKK', 'Tuban'),
  ee.Filter.eq('WADMPR', 'Jawa Timur')
));

// Kabupaten sekitar untuk inset map
var jatim = kabupaten.filter(ee.Filter.eq('WADMPR', 'Jawa Timur'));

// Set map center ke Tuban
Map.centerObject(tuban, 11);
Map.setOptions('HYBRID');

// Variabel global
var currentIndex = 'NDVI';
var currentImage = null;
var currentDate = '2025-08-01';

// ===========================
// DEFINISI INDEKS DAN INTERPRETASI
// ===========================

var indexDefinitions = {
  'NDVI': {
    name: 'Kesehatan Tanaman',
    description: 'Mengukur tingkat kehijauan dan kesehatan tanaman. Semakin hijau, semakin sehat.',
    icon: '🌿',
    unit: '',
    ranges: [
      {min: -1, max: 0, label: 'Bukan tanaman', color: '#8b4513'},
      {min: 0, max: 0.2, label: 'Tanaman stress/sakit', color: '#ff0000'},
      {min: 0.2, max: 0.4, label: 'Tanaman kurang sehat', color: '#ffa500'},
      {min: 0.4, max: 0.6, label: 'Tanaman sehat', color: '#90ee90'},
      {min: 0.6, max: 1, label: 'Tanaman sangat sehat', color: '#006400'}
    ]
  },
  'EVI': {
    name: 'Kualitas Vegetasi',
    description: 'Versi lebih akurat dari NDVI untuk daerah dengan vegetasi lebat.',
    icon: '🌱',
    unit: '',
    ranges: [
      {min: -1, max: 0, label: 'Bukan vegetasi', color: '#8b4513'},
      {min: 0, max: 0.2, label: 'Vegetasi buruk', color: '#ff0000'},
      {min: 0.2, max: 0.4, label: 'Vegetasi sedang', color: '#ffa500'},
      {min: 0.4, max: 0.6, label: 'Vegetasi baik', color: '#90ee90'},
      {min: 0.6, max: 1, label: 'Vegetasi sangat baik', color: '#006400'}
    ]
  },
  'SAVI': {
    name: 'Kondisi Tanah & Vegetasi',
    description: 'Mengukur vegetasi dengan memperhitungkan pengaruh tanah terbuka.',
    icon: '🌾',
    unit: '',
    ranges: [
      {min: -1, max: 0, label: 'Tanah kosong', color: '#8b4513'},
      {min: 0, max: 0.2, label: 'Sedikit vegetasi', color: '#d2691e'},
      {min: 0.2, max: 0.4, label: 'Vegetasi sedang', color: '#f0e68c'},
      {min: 0.4, max: 0.6, label: 'Vegetasi cukup', color: '#90ee90'},
      {min: 0.6, max: 1, label: 'Vegetasi padat', color: '#228b22'}
    ]
  },
  'LSWI': {
    name: 'Kandungan Air Daun',
    description: 'Mendeteksi jumlah air dalam daun tanaman. Penting untuk irigasi.',
    icon: '💧',
    unit: '',
    ranges: [
      {min: -0.5, max: -0.2, label: 'Sangat kering', color: '#8b0000'},
      {min: -0.2, max: 0, label: 'Kering', color: '#ff4500'},
      {min: 0, max: 0.2, label: 'Cukup air', color: '#87ceeb'},
      {min: 0.2, max: 0.4, label: 'Kandungan air baik', color: '#4682b4'},
      {min: 0.4, max: 0.5, label: 'Kandungan air tinggi', color: '#000080'}
    ]
  },
  'CWSI': {
    name: 'Stress Air Tanaman',
    description: 'Mendeteksi apakah tanaman kekurangan air atau tidak.',
    icon: '💦',
    unit: '',
    ranges: [
      {min: -0.5, max: -0.2, label: 'Stress berat', color: '#8b0000'},
      {min: -0.2, max: 0, label: 'Stress sedang', color: '#ff6347'},
      {min: 0, max: 0.2, label: 'Sedikit stress', color: '#ffd700'},
      {min: 0.2, max: 0.4, label: 'Tidak stress', color: '#90ee90'},
      {min: 0.4, max: 0.5, label: 'Kondisi optimal', color: '#006400'}
    ]
  },
  'NDMI': {
    name: 'Kelembaban Tanaman',
    description: 'Mengukur tingkat kelembaban dalam tanaman untuk monitoring kekeringan.',
    icon: '🌊',
    unit: '',
    ranges: [
      {min: -0.5, max: -0.2, label: 'Sangat kering', color: '#8b0000'},
      {min: -0.2, max: 0, label: 'Kering', color: '#ff6347'},
      {min: 0, max: 0.2, label: 'Kelembaban normal', color: '#87ceeb'},
      {min: 0.2, max: 0.4, label: 'Lembab', color: '#4169e1'},
      {min: 0.4, max: 0.5, label: 'Sangat lembab', color: '#000080'}
    ]
  },
  'LST': {
    name: 'Suhu Permukaan',
    description: 'Mengukur suhu permukaan tanah dalam Celsius. Penting untuk deteksi heat stress.',
    icon: '🌡️',
    unit: '°C',
    ranges: [
      {min: 15, max: 25, label: 'Dingin (<25°C)', color: '#0000ff'},
      {min: 25, max: 30, label: 'Sejuk (25-30°C)', color: '#87ceeb'},
      {min: 30, max: 35, label: 'Hangat (30-35°C)', color: '#ffd700'},
      {min: 35, max: 40, label: 'Panas (35-40°C)', color: '#ff8c00'},
      {min: 40, max: 50, label: 'Sangat panas (>40°C)', color: '#ff0000'}
    ]
  },
  'CVI': {
    name: 'Kandungan Klorofil',
    description: 'Mengukur tingkat klorofil yang menunjukkan kemampuan fotosintesis tanaman.',
    icon: '🍃',
    unit: '',
    ranges: [
      {min: 0, max: 2, label: 'Klorofil sangat rendah', color: '#8b4513'},
      {min: 2, max: 4, label: 'Klorofil rendah', color: '#daa520'},
      {min: 4, max: 6, label: 'Klorofil sedang', color: '#9acd32'},
      {min: 6, max: 8, label: 'Klorofil tinggi', color: '#32cd32'},
      {min: 8, max: 10, label: 'Klorofil sangat tinggi', color: '#006400'}
    ]
  },
  'CHIRPS': {
    name: 'Curah Hujan Bulanan',
    description: 'Total curah hujan dalam satu bulan (mm). Data dari satelit cuaca.',
    icon: '🌧️',
    unit: 'mm',
    ranges: [
      {min: 0, max: 50, label: 'Sangat kering (<50mm)', color: '#8b4513'},
      {min: 50, max: 100, label: 'Kering (50-100mm)', color: '#daa520'},
      {min: 100, max: 150, label: 'Normal (100-150mm)', color: '#87ceeb'},
      {min: 150, max: 200, label: 'Basah (150-200mm)', color: '#4169e1'},
      {min: 200, max: 300, label: 'Sangat basah (>200mm)', color: '#000080'}
    ]
  },
  'SMoist': {
    name: 'Kelembaban Tanah',
    description: 'Perkiraan kelembaban tanah dari data vegetasi. Penting untuk irigasi.',
    icon: '🏜️',
    unit: '',
    ranges: [
      {min: -0.5, max: -0.2, label: 'Sangat kering', color: '#8b0000'},
      {min: -0.2, max: 0, label: 'Kering', color: '#ff6347'},
      {min: 0, max: 0.2, label: 'Lembab sedang', color: '#90ee90'},
      {min: 0.2, max: 0.4, label: 'Lembab baik', color: '#4169e1'},
      {min: 0.4, max: 0.5, label: 'Jenuh air', color: '#000080'}
    ]
  }
};

// ===========================
// FUNGSI PERHITUNGAN INDEKS
// ===========================

function calculateIndices(image) {
  // Cloud masking
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  
  image = image.updateMask(mask).divide(10000);
  
  // Calculate indices
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var evi = image.expression(
    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
    {
      'NIR': image.select('B8'),
      'RED': image.select('B4'),
      'BLUE': image.select('B2')
    }
  ).rename('EVI');
  
  var savi = image.expression(
    '((NIR - RED) / (NIR + RED + 0.5)) * 1.5',
    {
      'NIR': image.select('B8'),
      'RED': image.select('B4')
    }
  ).rename('SAVI');
  
  var lswi = image.normalizedDifference(['B8', 'B11']).rename('LSWI');
  var ndmi = image.normalizedDifference(['B8', 'B11']).rename('NDMI');
  
  var cvi = image.expression(
    '(NIR / GREEN) * (RED / GREEN)',
    {
      'NIR': image.select('B8'),
      'RED': image.select('B4'),
      'GREEN': image.select('B3')
    }
  ).rename('CVI');
  
  // CWSI sebagai proxy dari SWIR bands
  var cwsi = image.normalizedDifference(['B11', 'B12']).rename('CWSI');
  
  // Soil Moisture proxy dari NDVI dan LST relationship
  var smoist = image.normalizedDifference(['B8', 'B12']).rename('SMoist');
  
  return image.addBands([ndvi, evi, savi, lswi, ndmi, cvi, cwsi, smoist])
              .copyProperties(image, ['system:time_start']);
}

function calculateLST(image) {
  var thermal = image.select('ST_B10').multiply(0.00341802).add(149.0).subtract(273.15);
  var qa = image.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0).and(qa.bitwiseAnd(1 << 4).eq(0));
  return thermal.updateMask(mask).rename('LST')
                .copyProperties(image, ['system:time_start']);
}

// ===========================
// PALETTE CONFIGURATION
// ===========================

var palettes = {
  'NDVI': ['#8b4513', '#ff0000', '#ffa500', '#90ee90', '#006400'],
  'EVI': ['#8b4513', '#ff0000', '#ffa500', '#90ee90', '#006400'],
  'SAVI': ['#8b4513', '#d2691e', '#f0e68c', '#90ee90', '#228b22'],
  'LSWI': ['#8b0000', '#ff4500', '#87ceeb', '#4682b4', '#000080'],
  'CWSI': ['#8b0000', '#ff6347', '#ffd700', '#90ee90', '#006400'],
  'NDMI': ['#8b0000', '#ff6347', '#87ceeb', '#4169e1', '#000080'],
  'LST': ['#0000ff', '#87ceeb', '#ffd700', '#ff8c00', '#ff0000'],
  'CVI': ['#8b4513', '#daa520', '#9acd32', '#32cd32', '#006400'],
  'CHIRPS': ['#8b4513', '#daa520', '#87ceeb', '#4169e1', '#000080'],
  'SMoist': ['#8b0000', '#ff6347', '#90ee90', '#4169e1', '#000080']
};

// ===========================
// MAIN CONTROL PANEL
// ===========================

var mainPanel = ui.Panel({
  widgets: [],
  style: {
    width: '320px',
    padding: '10px',
    position: 'top-right',
    backgroundColor: 'white'
  }
});

// Title with icon
mainPanel.add(ui.Label('🌱 MONITORING KESEHATAN TANAMAN', {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 5px 0'
}));

mainPanel.add(ui.Label('Kabupaten Tuban, Jawa Timur', {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: '0 0 10px 0'
}));

// Separator
mainPanel.add(ui.Panel({
  style: {height: '2px', backgroundColor: '#27ae60', margin: '5px 0 10px 0'}
}));

// Info Panel for selected index
var infoPanel = ui.Panel({
  style: {
    backgroundColor: '#ecf0f1',
    padding: '10px',
    margin: '5px 0'
  }
});
mainPanel.add(infoPanel);

// Parameter Selection Dropdown
mainPanel.add(ui.Label('Pilih Parameter:', {
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '10px 0 5px 0'
}));

var indexSelect = ui.Select({
  items: [
    {label: '🌿 NDVI - Kesehatan Tanaman', value: 'NDVI'},
    {label: '🌱 EVI - Kualitas Vegetasi', value: 'EVI'},
    {label: '🌾 SAVI - Kondisi Tanah & Vegetasi', value: 'SAVI'},
    {label: '💧 LSWI - Kandungan Air Daun', value: 'LSWI'},
    {label: '💦 CWSI - Stress Air Tanaman', value: 'CWSI'},
    {label: '🌊 NDMI - Kelembaban Tanaman', value: 'NDMI'},
    {label: '🌡️ LST - Suhu Permukaan', value: 'LST'},
    {label: '🍃 CVI - Kandungan Klorofil', value: 'CVI'},
    {label: '🌧️ CHIRPS - Curah Hujan', value: 'CHIRPS'},
    {label: '🏜️ Kelembaban Tanah', value: 'SMoist'}
  ],
  value: 'NDVI',
  style: {width: '100%'},
  onChange: function(value) {
    currentIndex = value;
    updateInfo();
    updateVisualization();
  }
});
mainPanel.add(indexSelect);

// Month Selection - Updated for 2025
mainPanel.add(ui.Label('Pilih Bulan Analisis:', {
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '10px 0 5px 0'
}));

var monthSelect = ui.Select({
  items: [
    {label: '🌸 Januari 2025', value: '2025-01-01'},
    {label: '🌺 Februari 2025', value: '2025-02-01'},
    {label: '🌻 Maret 2025', value: '2025-03-01'},
    {label: '🌼 April 2025', value: '2025-04-01'},
    {label: '🌷 Mei 2025', value: '2025-05-01'},
    {label: '☀️ Juni 2025', value: '2025-06-01'},
    {label: '🌞 Juli 2025', value: '2025-07-01'},
    {label: '🌾 Agustus 2025', value: '2025-08-01'},
    {label: '🍂 September 2025', value: '2025-09-01'},
    {label: '🍁 Oktober 2025', value: '2025-10-01'},
    {label: '🍄 November 2025', value: '2025-11-01'},
    {label: '❄️ Desember 2025', value: '2025-12-01'}
  ],
  value: '2025-08-01',
  style: {width: '100%'},
  onChange: function(value) {
    currentDate = value;
    updateVisualization();
  }
});
mainPanel.add(monthSelect);

// Statistics Display
mainPanel.add(ui.Panel({
  style: {height: '1px', backgroundColor: '#bdc3c7', margin: '10px 0'}
}));

mainPanel.add(ui.Label('📊 Hasil Analisis Area:', {
  fontSize: '13px',
  fontWeight: 'bold',
  margin: '5px 0'
}));

var statsPanel = ui.Panel({
  style: {
    backgroundColor: '#f8f9fa',
    padding: '8px',
    margin: '5px 0'
  }
});
mainPanel.add(statsPanel);

// Help text
mainPanel.add(ui.Label('💡 Klik pada peta untuk melihat grafik lokasi', {
  fontSize: '11px',
  color: '#95a5a6',
  fontStyle: 'italic',
  margin: '10px 0 0 0'
}));

// ===========================
// LEGEND PANEL  
// ===========================

var legendPanel = ui.Panel({
  widgets: [],
  style: {
    width: '200px',
    padding: '10px',
    position: 'bottom-left',
    backgroundColor: 'white',
    margin: '0 0 220px 0'
  }
});

legendPanel.add(ui.Label('📍 Keterangan Warna', {
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 5px 0'
}));

var legendContent = ui.Panel();
legendPanel.add(legendContent);

// ===========================
// INSET MAP PANEL
// ===========================

var insetPanel = ui.Panel({
  widgets: [],
  style: {
    width: '200px',
    height: '200px',
    padding: '5px',
    position: 'bottom-left',
    backgroundColor: 'white'
  }
});

insetPanel.add(ui.Label('🗺️ Peta Lokasi', {
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '0 0 5px 0'
}));

// Create inset map
var insetMap = ui.Map();
insetMap.style().set({
  width: '190px',
  height: '160px'
});
insetMap.setCenter(112.1, -6.9, 7);
insetMap.setControlVisibility({all: false});

// Add layers to inset map
insetMap.addLayer(jatim.style({
  color: '#666666',
  fillColor: '#00000010',
  width: 0.5
}), {}, 'Jawa Timur');

insetMap.addLayer(tuban.style({
  color: '#ff0000',
  fillColor: '#ff000040',
  width: 2
}), {}, 'Tuban');

insetPanel.add(insetMap);

// ===========================
// UPDATE FUNCTIONS
// ===========================

function updateInfo() {
  infoPanel.clear();
  var def = indexDefinitions[currentIndex];
  
  infoPanel.add(ui.Label(def.icon + ' ' + def.name, {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '0 0 5px 0'
  }));
  
  infoPanel.add(ui.Label(def.description, {
    fontSize: '11px',
    color: '#34495e',
    margin: '0'
  }));
}

function updateLegend() {
  legendContent.clear();
  var def = indexDefinitions[currentIndex];
  
  // Add classification with color boxes
  def.ranges.forEach(function(range) {
    var colorBox = ui.Label('██', {
      color: range.color,
      fontSize: '12px',
      margin: '0 5px 0 0'
    });
    
    var labelText = ui.Label(range.label, {
      fontSize: '10px',
      margin: '2px 0'
    });
    
    var row = ui.Panel({
      widgets: [colorBox, labelText],
      layout: ui.Panel.Layout.flow('horizontal'),
      style: {margin: '2px 0'}
    });
    
    legendContent.add(row);
  });
  
  if (def.unit) {
    legendContent.add(ui.Label('Satuan: ' + def.unit, {
      fontSize: '10px',
      fontStyle: 'italic',
      color: '#7f8c8d',
      margin: '5px 0 0 0'
    }));
  }
}

function updateVisualization() {
  // Clear existing layers
  Map.layers().reset();
  
  // Add boundary
  Map.addLayer(tuban.style({
    color: '#f39c12',
    fillColor: '00000000',
    width: 2
  }), {}, 'Batas Kabupaten Tuban');
  
  // Update panels
  updateInfo();
  updateLegend();
  
  statsPanel.clear();
  statsPanel.add(ui.Label('⏳ Menganalisis data...', {
    fontSize: '11px',
    fontStyle: 'italic'
  }));
  
  // Date range
  var startDate = ee.Date(currentDate);
  var endDate = startDate.advance(1, 'month');
  
  // Load imagery based on index
  if (currentIndex === 'CHIRPS') {
    var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
      .filterDate(startDate, endDate)
      .filterBounds(tuban)
      .sum()
      .clip(tuban);
    
    currentImage = chirps.rename('CHIRPS').set('system:time_start', startDate.millis());
    var vizParams = {
      min: 0,
      max: 300,
      palette: palettes['CHIRPS']
    };
    Map.addLayer(currentImage, vizParams, 'Curah Hujan');
    calculateAndDisplayStats(currentImage, 'CHIRPS');
    
  } else if (currentIndex === 'LST') {
    var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate(startDate, endDate)
      .filterBounds(tuban)
      .filter(ee.Filter.lt('CLOUD_COVER', 20))
      .map(calculateLST)
      .median()
      .clip(tuban);
    
    currentImage = landsat.set('system:time_start', startDate.millis());
    var vizParams = {
      min: 15,
      max: 50,
      palette: palettes['LST']
    };
    Map.addLayer(currentImage, vizParams, 'Suhu Permukaan');
    calculateAndDisplayStats(currentImage, 'LST');
    
  } else {
    // Sentinel-2 for vegetation indices
    var sentinel = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterDate(startDate, endDate)
      .filterBounds(tuban)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
      .map(calculateIndices)
      .median()
      .clip(tuban);
    
    currentImage = sentinel.set('system:time_start', startDate.millis());
    
    // Get min/max from definition
    var def = indexDefinitions[currentIndex];
    var minVal = def.ranges[0].min;
    var maxVal = def.ranges[def.ranges.length - 1].max;
    
    var vizParams = {
      min: minVal,
      max: maxVal,
      palette: palettes[currentIndex]
    };
    
    Map.addLayer(currentImage.select(currentIndex), vizParams, def.name);
    calculateAndDisplayStats(currentImage, currentIndex);
  }
}

function calculateAndDisplayStats(image, bandName) {
  var stats = image.select(bandName).reduceRegion({
    reducer: ee.Reducer.mean()
      .combine(ee.Reducer.min(), '', true)
      .combine(ee.Reducer.max(), '', true)
      .combine(ee.Reducer.percentile([25, 50, 75]), '', true),
    geometry: tuban,
    scale: 100,
    maxPixels: 1e9,
    bestEffort: true
  });
  
  stats.evaluate(function(result) {
    statsPanel.clear();
    
    if (result) {
      var mean = result[bandName + '_mean'];
      var def = indexDefinitions[bandName];
      
      // Determine condition based on mean value
      var condition = '';
      var conditionColor = '#27ae60';
      
      for (var i = 0; i < def.ranges.length; i++) {
        var range = def.ranges[i];
        if (mean >= range.min && mean <= range.max) {
          condition = range.label;
          conditionColor = range.color;
          break;
        }
      }
      
      // Display main condition
      statsPanel.add(ui.Label('Status: ' + condition, {
        fontSize: '13px',
        fontWeight: 'bold',
        color: conditionColor,
        margin: '5px 0'
      }));
      
      // Display statistics
      var formatValue = function(val) {
        if (!val) return 'N/A';
        if (def.unit === '°C' || def.unit === 'mm') {
          return val.toFixed(1) + ' ' + def.unit;
        }
        return val.toFixed(3) + ' ' + def.unit;
      };
      
      statsPanel.add(ui.Label('Rata-rata: ' + formatValue(mean), {
        fontSize: '11px',
        margin: '2px 0'
      }));
      
      statsPanel.add(ui.Label('Minimum: ' + formatValue(result[bandName + '_min']), {
        fontSize: '11px',
        margin: '2px 0'
      }));
      
      statsPanel.add(ui.Label('Maximum: ' + formatValue(result[bandName + '_max']), {
        fontSize: '11px',
        margin: '2px 0'
      }));
      
      // Add recommendation based on condition
      var recommendation = getRecommendation(bandName, mean);
      if (recommendation) {
        statsPanel.add(ui.Panel({
          style: {height: '1px', backgroundColor: '#bdc3c7', margin: '5px 0'}
        }));
        
        statsPanel.add(ui.Label('💬 Rekomendasi:', {
          fontSize: '11px',
          fontWeight: 'bold',
          margin: '5px 0 2px 0'
        }));
        
        statsPanel.add(ui.Label(recommendation, {
          fontSize: '10px',
          color: '#2c3e50',
          margin: '0'
        }));
      }
    }
  });
}

function getRecommendation(index, value) {
  if (!value) return '';
  
  switch(index) {
    case 'NDVI':
    case 'EVI':
      if (value < 0.2) return 'Tanaman memerlukan perhatian khusus. Periksa hama/penyakit dan nutrisi tanah.';
      if (value < 0.4) return 'Pertimbangkan pemberian pupuk dan peningkatan irigasi.';
      if (value < 0.6) return 'Kondisi tanaman baik. Lanjutkan perawatan rutin.';
      return 'Tanaman dalam kondisi prima. Pertahankan manajemen saat ini.';
    
    case 'LST':
      if (value > 35) return 'Suhu tinggi! Tingkatkan irigasi dan pertimbangkan naungan untuk tanaman sensitif.';
      if (value > 30) return 'Monitor kebutuhan air tanaman lebih sering.';
      return 'Suhu optimal untuk pertumbuhan tanaman.';
    
    case 'NDMI':
    case 'LSWI':
      if (value < 0) return 'Segera lakukan irigasi! Tanaman menunjukkan tanda kekeringan.';
      if (value < 0.2) return 'Tingkatkan frekuensi penyiraman.';
      return 'Kelembaban tanaman cukup baik.';
    
    case 'CWSI':
      if (value < 0) return 'Tanaman mengalami stress air. Segera lakukan irigasi.';
      if (value < 0.2) return 'Monitor kebutuhan air lebih sering.';
      return 'Tanaman tidak mengalami stress air.';
    
    case 'SMoist':
      if (value < 0) return 'Tanah terlalu kering. Lakukan irigasi segera.';
      if (value < 0.2) return 'Kelembaban tanah perlu ditingkatkan.';
      if (value > 0.4) return 'Tanah terlalu basah. Kurangi irigasi dan pastikan drainase baik.';
      return 'Kelembaban tanah optimal.';
    
    case 'CHIRPS':
      if (value < 50) return 'Curah hujan rendah. Siapkan sistem irigasi tambahan.';
      if (value > 200) return 'Curah hujan tinggi. Perhatikan drainase dan risiko penyakit jamur.';
      return 'Curah hujan normal untuk pertanian.';
    
    case 'CVI':
      if (value < 4) return 'Klorofil rendah. Pertimbangkan pemberian pupuk nitrogen.';
      if (value < 6) return 'Monitor nutrisi tanaman secara berkala.';
      return 'Kandungan klorofil baik. Fotosintesis optimal.';
    
    case 'SAVI':
      if (value < 0.2) return 'Tutupan vegetasi rendah. Pertimbangkan penanaman atau perbaikan lahan.';
      if (value < 0.4) return 'Tingkatkan kepadatan tanaman untuk hasil optimal.';
      return 'Tutupan vegetasi baik.';
    
    default:
      return '';
  }
}

// ===========================
// TIME SERIES CHART PANEL
// ===========================

var chartPanel = ui.Panel({
  style: {
    width: '400px',
    padding: '10px',
    position: 'bottom-right',
    backgroundColor: 'white',
    shown: false
  }
});

// ===========================
// MAP CLICK HANDLER
// ===========================

Map.onClick(function(coords) {
  if (!currentImage) return;
  
  // Clear previous click point
  var layers = Map.layers();
  for (var i = layers.length() - 1; i >= 0; i--) {
    var layer = layers.get(i);
    if (layer.getName() === 'Titik Analisis') {
      layers.remove(layer);
    }
  }
  
  // Add click point
  var point = ee.Geometry.Point([coords.lon, coords.lat]);
  Map.addLayer(point, {color: '#ff0000'}, 'Titik Analisis');
  
  // Show and update chart panel
  chartPanel.style().set('shown', true);
  chartPanel.clear();
  
  chartPanel.add(ui.Label('📊 Analisis Temporal', {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 5px 0'
  }));
  
  chartPanel.add(ui.Label('📍 Lokasi: ' + coords.lon.toFixed(4) + ', ' + coords.lat.toFixed(4), {
    fontSize: '10px',
    color: '#7f8c8d',
    margin: '0 0 10px 0'
  }));
  
  chartPanel.add(ui.Label('⏳ Memuat grafik 6 bulan terakhir...', {
    fontSize: '11px',
    fontStyle: 'italic'
  }));
  
  // Calculate time series
  var endDate = ee.Date(currentDate).advance(1, 'month');
  var startDate = endDate.advance(-6, 'month');
  
  var timeSeries;
  var chartTitle = indexDefinitions[currentIndex].name + ' - 6 Bulan';
  
  if (currentIndex === 'CHIRPS') {
    // For CHIRPS, aggregate to monthly sums
    timeSeries = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
      .filterDate(startDate, endDate)
      .filterBounds(point)
      .map(function(image) {
        return image.set('system:time_start', image.date().millis());
      });
    
    // Aggregate to monthly
    var months = ee.List.sequence(0, 5);
    timeSeries = ee.ImageCollection.fromImages(
      months.map(function(m) {
        var start = startDate.advance(m, 'month');
        var end = start.advance(1, 'month');
        return ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
          .filterDate(start, end)
          .filterBounds(point)
          .sum()
          .set('system:time_start', start.millis());
      })
    );
      
  } else if (currentIndex === 'LST') {
    timeSeries = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterDate(startDate, endDate)
      .filterBounds(point)
      .filter(ee.Filter.lt('CLOUD_COVER', 30))
      .map(calculateLST)
      .select('LST');
      
  } else {
    // For Sentinel-2 indices
    timeSeries = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterDate(startDate, endDate)
      .filterBounds(point)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
      .map(calculateIndices)
      .select(currentIndex);
  }
  
  // Create chart
  var chart = ui.Chart.image.series({
    imageCollection: timeSeries,
    region: point,
    reducer: ee.Reducer.mean(),
    scale: 30
  }).setOptions({
    title: chartTitle,
    vAxis: {
      title: indexDefinitions[currentIndex].name + ' ' + indexDefinitions[currentIndex].unit,
      gridlines: {color: '#e0e0e0'}
    },
    hAxis: {
      title: 'Tanggal',
      gridlines: {color: '#e0e0e0'},
      format: 'MMM yyyy'
    },
    lineWidth: 2,
    pointSize: 4,
    colors: ['#27ae60'],
    height: 250,
    chartArea: {width: '75%', height: '65%'},
    backgroundColor: '#f8f9fa',
    legend: {position: 'none'},
    interpolateNulls: true
  });
  
  // Chart ready callback
  chart.style().set({shown: false});
  
  // Evaluate if we have data
  timeSeries.size().evaluate(function(size) {
    chartPanel.clear();
    
    chartPanel.add(ui.Label('📊 Analisis Temporal', {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '0 0 5px 0'
    }));
    
    chartPanel.add(ui.Label('📍 ' + coords.lon.toFixed(4) + ', ' + coords.lat.toFixed(4), {
      fontSize: '10px',
      color: '#7f8c8d',
      margin: '0 0 5px 0'
    }));
    
    if (size > 0) {
      chartPanel.add(chart);
      
      // Add interpretation
      var interpretPanel = ui.Panel({
        style: {
          backgroundColor: '#ecf0f1',
          padding: '5px',
          margin: '5px 0'
        }
      });
      
      interpretPanel.add(ui.Label('💡 Grafik menunjukkan perubahan ' + 
        indexDefinitions[currentIndex].name.toLowerCase() + ' selama 6 bulan terakhir', {
        fontSize: '10px',
        color: '#34495e'
      }));
      
      chartPanel.add(interpretPanel);
    } else {
      chartPanel.add(ui.Label('⚠️ Tidak ada data tersedia untuk lokasi ini', {
        fontSize: '11px',
        color: '#e74c3c',
        margin: '10px 0'
      }));
    }
    
    // Close button
    var closeButton = ui.Button({
      label: '✖ Tutup',
      style: {fontSize: '11px', margin: '5px 0 0 0'},
      onClick: function() {
        chartPanel.style().set('shown', false);
        // Remove click point
        var layers = Map.layers();
        for (var i = layers.length() - 1; i >= 0; i--) {
          var layer = layers.get(i);
          if (layer.getName() === 'Titik Analisis') {
            layers.remove(layer);
          }
        }
      }
    });
    chartPanel.add(closeButton);
  });
});

// ===========================
// INITIALIZATION
// ===========================

// Set map style
Map.style().set('cursor', 'crosshair');
Map.setControlVisibility({
  scaleControl: true,
  zoomControl: true,
  mapTypeControl: false,
  fullscreenControl: false,
  drawingToolsControl: false
});

// Add all panels
Map.add(mainPanel);
Map.add(legendPanel);
Map.add(insetPanel);
Map.add(chartPanel);

// Initialize with NDVI
updateInfo();
updateVisualization();

// ===========================
// PRINT INSTRUCTIONS
// ===========================

print('═══════════════════════════════════════');
print('🌱 DASHBOARD MONITORING KESEHATAN TANAMAN');
print('═══════════════════════════════════════');
print('');
print('📍 Lokasi: Kabupaten Tuban, Jawa Timur');
print('');
print('📖 CARA PENGGUNAAN:');
print('1. Pilih parameter dari dropdown menu');
print('2. Pilih bulan untuk melihat kondisi pada bulan tersebut');
print('3. Lihat hasil analisis dan rekomendasi di panel kanan');
print('4. Klik pada peta untuk melihat grafik perubahan 6 bulan');
print('');
print('📊 PARAMETER TERSEDIA:');
print('• NDVI/EVI: Kesehatan tanaman');
print('• SAVI: Kondisi tanah dan vegetasi');
print('• LSWI: Kandungan air daun');
print('• CWSI: Stress air tanaman');
print('• NDMI: Kelembaban tanaman');
print('• LST: Suhu permukaan');
print('• CVI: Kandungan klorofil');
print('• CHIRPS: Curah hujan');
print('• Kelembaban Tanah: Estimasi kelembaban tanah');
print('');
print('═══════════════════════════════════════');