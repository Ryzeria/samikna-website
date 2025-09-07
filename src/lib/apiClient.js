// lib/apiClient.js
// API client for static builds - connects to external API server

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // User methods
  async getProfile() {
    const token = this.getToken();
    return this.request('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(data) {
    const token = this.getToken();
    return this.request('/api/user/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Dashboard data methods
  async getDashboardData(timeRange = '7days') {
    const token = this.getToken();
    return this.request(`/api/dashboard/data?range=${timeRange}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getSatelliteData(kabupaten) {
    const token = this.getToken();
    return this.request(`/api/satellite/data?kabupaten=${kabupaten}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getWeatherData(kabupaten) {
    const token = this.getToken();
    return this.request(`/api/weather/data?kabupaten=${kabupaten}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Crop management methods
  async getCropActivities() {
    const token = this.getToken();
    return this.request('/api/crops/activities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createCropActivity(data) {
    const token = this.getToken();
    return this.request('/api/crops/activities', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Supply chain methods
  async getSupplyChainData() {
    const token = this.getToken();
    return this.request('/api/supply-chain', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createSupplyChainItem(data) {
    const token = this.getToken();
    return this.request('/api/supply-chain', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Reports methods
  async getReports(type, dateRange) {
    const token = this.getToken();
    return this.request(`/api/reports?type=${type}&range=${dateRange}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async exportReport(format, data) {
    const token = this.getToken();
    return this.request('/api/reports/export', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ format, data }),
    });
  }

  // Utility methods
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('samikna_token') || sessionStorage.getItem('samikna_token');
  }

  setToken(token, remember = false) {
    if (typeof window === 'undefined') return;
    
    if (remember) {
      localStorage.setItem('samikna_token', token);
    } else {
      sessionStorage.setItem('samikna_token', token);
    }
  }

  removeToken() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('samikna_token');
    sessionStorage.removeItem('samikna_token');
    localStorage.removeItem('samikna_user');
    sessionStorage.removeItem('samikna_user');
  }

  // Mock data methods (for development/testing when API is not available)
  async getMockData(endpoint) {
    // Return mock data based on endpoint
    const mockData = {
      '/api/dashboard/data': {
        overview: {
          totalArea: 2847,
          monitoredFields: 145,
          activeWeatherStations: 12,
          lastSatellitePass: '2 jam yang lalu',
          dataQuality: 94.2
        },
        // ... more mock data
      },
      // Add more mock endpoints as needed
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData[endpoint] || {});
      }, 500);
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual methods for easier use
export const {
  login,
  logout,
  getProfile,
  updateProfile,
  getDashboardData,
  getSatelliteData,
  getWeatherData,
  getCropActivities,
  createCropActivity,
  getSupplyChainData,
  createSupplyChainItem,
  getReports,
  exportReport,
} = apiClient;