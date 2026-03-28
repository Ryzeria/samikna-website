import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell } from 'react-icons/hi';
import { FaCloud, FaCog, FaLeaf } from 'react-icons/fa';

const iconByType = { weather: FaCloud, system: FaCog, crop: FaLeaf };

function NotificationsDropdown({ items, count, darkMode, show, onToggle, onClose }) {
  const dm = darkMode;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`relative p-2 rounded-lg transition-colors ${dm ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <HiBell className="h-5 w-5" />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
          >
            {count}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 mt-2 w-80 ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border z-50`}
          >
            <div className={`p-4 border-b ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold ${dm ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.map((item) => {
                const Icon = iconByType[item.type] || HiBell;
                return (
                  <div
                    key={item.id}
                    className={`p-4 border-b ${dm ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.urgent ? 'bg-red-100 text-red-600' : dm ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-sm ${dm ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                          <span className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{item.time}</span>
                        </div>
                        <p className={`text-sm mt-1 ${dm ? 'text-gray-300' : 'text-gray-600'}`}>{item.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`p-4 text-center border-t ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={onClose}
                className={`text-sm font-medium ${dm ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
              >
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(NotificationsDropdown);
