import React, { memo } from 'react';

function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
      disabled ? 'bg-gray-100 opacity-50' : 'bg-gray-50 hover:bg-gray-100'
    }`}>
      <div>
        <p className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{label}</p>
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled ? 'bg-gray-200 cursor-not-allowed' : checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}

export default memo(ToggleSwitch);
