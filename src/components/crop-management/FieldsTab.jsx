import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';
import { FaSeedling, FaMapMarkedAlt } from 'react-icons/fa';
import { getStatusColor } from '../../lib/cropUtils';

function FieldsTab({ fields, onViewField, onEditField, onDeleteField, onAddField }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {fields?.length > 0 ? fields.map((field) => (
          <motion.div
            key={field.id}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => onViewField(field.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{field.name}</h3>
                <p className="text-sm text-gray-600">{field.location || 'Location not specified'}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(field.status)}`}>
                {field.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Area</p>
                <p className="font-bold text-gray-900">{field.area} Ha</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Health Score</p>
                <p className={`font-bold ${
                  field.healthScore >= 85 ? 'text-green-600' :
                  field.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {field.healthScore}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Growth Stage</p>
                <p className="font-medium text-gray-900 capitalize">{field.growthStage || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">NDVI</p>
                <p className="font-bold text-blue-600">{field.ndvi || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Crop:</span>
                <span className="font-medium capitalize">{field.cropType} - {field.variety || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supervisor:</span>
                <span className="font-medium">{field.supervisor || 'Not assigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Activity:</span>
                <span className="font-medium text-blue-600">{field.nextActivity}</span>
              </div>
            </div>

            {field.notes && (
              <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">{field.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onViewField(field.id); }}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <HiEye className="w-3 h-3 inline mr-1" />
                View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEditField(field); }}
                className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <HiPencil className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <HiTrash className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-12">
            <FaMapMarkedAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Registered</h3>
            <p className="text-gray-600 mb-4">Start by adding your first agricultural field to begin monitoring.</p>
            <button
              onClick={onAddField}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Field
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default memo(FieldsTab);
