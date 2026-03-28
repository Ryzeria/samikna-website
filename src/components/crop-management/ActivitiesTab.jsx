import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiEye, HiPencil, HiTrash, HiCheck } from 'react-icons/hi';
import { FaClipboardList } from 'react-icons/fa';
import { getStatusColor, getPriorityColor, formatDate, formatCurrency } from '../../lib/cropUtils';

function ActivitiesTab({
  filteredActivities,
  fields,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterCrop,
  setFilterCrop,
  cropTypes,
  activityTypes,
  onEdit,
  onDelete,
  onMarkComplete,
  onAddActivity,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="planned">Planned</option>
          </select>

          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Crops</option>
            {cropTypes.map((crop) => (
              <option key={crop.id} value={crop.id}>{crop.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? filteredActivities.map((activity) => {
          const actType = activityTypes.find((t) => t.id === activity.activityType);
          const ActivityIcon = actType?.icon || FaClipboardList;
          const iconColor = actType?.color || 'gray';

          return (
            <motion.div
              key={activity.id}
              layout
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${iconColor}-100`}>
                    <ActivityIcon className={`w-6 h-6 text-${iconColor}-600`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.fieldName} • {activity.area} Ha</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(activity.priority)}`} />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{activity.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Scheduled Date</p>
                  <p className="font-medium text-gray-900">{formatDate(activity.scheduledDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-medium text-gray-900">{activity.duration} hours</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Workers</p>
                  <p className="font-medium text-gray-900">{activity.workers} people</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Cost</p>
                  <p className="font-bold text-green-600">{formatCurrency(activity.cost)}</p>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Materials Required</h4>
                  <div className="space-y-1">
                    {activity.materials?.length > 0 ? activity.materials.map((material, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{material.name}</span>
                        <span className="text-gray-600">
                          {material.quantity} {material.unit} • {formatCurrency(material.cost)}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500">No materials specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Equipment & Notes</h4>
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Equipment:</strong> {activity.equipment?.length > 0 ? activity.equipment.join(', ') : 'Not specified'}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Supervisor:</strong> {activity.supervisor}
                  </div>
                  {activity.notes && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      {activity.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onEdit(activity)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <HiEye className="w-3 h-3 inline mr-1" />
                  View Details
                </button>
                {activity.status !== 'completed' && (
                  <button
                    onClick={() => onMarkComplete(activity.id)}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <HiCheck className="w-3 h-3 inline mr-1" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => onEdit(activity)}
                  className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <HiPencil className="w-3 h-3 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(activity.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <HiTrash className="w-3 h-3 inline mr-1" />
                  Delete
                </button>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-12">
            <FaClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first crop activity.</p>
            <button
              onClick={onAddActivity}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Activity
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default memo(ActivitiesTab);
