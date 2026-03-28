import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  FaSeedling, FaLeaf, FaCloud, FaSun, FaTint, FaMapMarkedAlt, FaClipboardList,
} from 'react-icons/fa';
import { FaThermometerHalf } from 'react-icons/fa';
import { getStatusColor, getPriorityColor } from '../../lib/cropUtils';

function CropOverviewTab({ cropData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Weather Widget */}
      {cropData?.weather && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCloud className="w-5 h-5 text-blue-600" />
            Current Weather Conditions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <FaThermometerHalf className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.windSpeed}km/h</div>
              <div className="text-sm text-gray-600">Wind Speed</div>
            </div>
            <div className="text-center">
              <FaSun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.uvIndex}</div>
              <div className="text-sm text-gray-600">UV Index</div>
            </div>
            <div className="text-center">
              <FaTint className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.humidity}%</div>
              <div className="text-sm text-gray-600">Humidity</div>
            </div>
            <div className="text-center">
              <FaCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.rainfall}mm</div>
              <div className="text-sm text-gray-600">Rainfall</div>
            </div>
            <div className="text-center">
              <FaLeaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{cropData.weather.current.temperature}°C</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities and Field Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {cropData?.activities?.length > 0 ? cropData.activities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(activity.priority)}`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.fieldName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500">
                <FaClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Field Status Summary</h3>
          <div className="space-y-3">
            {cropData?.fields?.length > 0 ? cropData.fields.slice(0, 3).map((field) => (
              <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  field.healthScore >= 85 ? 'bg-green-100' :
                  field.healthScore >= 70 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <FaSeedling className={`w-5 h-5 ${
                    field.healthScore >= 85 ? 'text-green-600' :
                    field.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{field.name}</p>
                  <p className="text-xs text-gray-600">{field.area} Ha • {field.variety}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{field.healthScore}%</div>
                  <div className="text-xs text-gray-500">Health</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500">
                <FaMapMarkedAlt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No fields registered</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default memo(CropOverviewTab);
