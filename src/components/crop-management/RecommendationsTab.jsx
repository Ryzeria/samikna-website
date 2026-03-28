import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaTint, FaFlask, FaLeaf } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../../lib/cropUtils';

function RecommendationsTab({ recommendations, onNavigateToChatbot }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FaRobot className="w-5 h-5 text-purple-600" />
          AI-Powered Agricultural Recommendations
        </h3>
        <p className="text-gray-600 text-sm">
          Based on satellite data analysis, weather patterns, and crop performance metrics
        </p>
      </div>

      <div className="space-y-4">
        {recommendations?.length > 0 ? recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            whileHover={{ scale: 1.01 }}
            className={`border rounded-xl p-6 ${
              rec.priority === 'high' ? 'border-red-200 bg-red-50' :
              rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rec.type === 'irrigation' ? 'bg-blue-100' :
                  rec.type === 'fertilizer' ? 'bg-green-100' :
                  rec.type === 'pest_control' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {rec.type === 'irrigation' && <FaTint className="w-5 h-5 text-blue-600" />}
                  {rec.type === 'fertilizer' && <FaFlask className="w-5 h-5 text-green-600" />}
                  {rec.type === 'pest_control' && <FaLeaf className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{rec.field}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{formatCurrency(rec.cost)}</span>
            </div>

            <h4 className="font-bold text-gray-900 text-lg mb-2">{rec.title}</h4>
            <p className="text-gray-700 mb-4">{rec.description}</p>

            <div className="bg-white/70 rounded-lg p-4 mb-4">
              <h5 className="font-semibold text-gray-900 mb-2">Recommended Action:</h5>
              <p className="text-gray-700 mb-3">{rec.action}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="font-medium text-gray-900">{formatDate(rec.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="font-medium text-gray-900">{formatDate(rec.endDate)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Implement Recommendation
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Learn More
              </button>
              <button
                onClick={onNavigateToChatbot}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
              >
                Ask AI
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-12">
            <FaRobot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
            <p className="text-gray-600">AI recommendations will appear here based on your field data and conditions.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default memo(RecommendationsTab);
