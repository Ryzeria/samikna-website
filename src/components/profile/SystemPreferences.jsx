import React from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function SystemPreferences({ preferences, setPreferences, onSave }) {
  const set = (key) => (e) => setPreferences({ ...preferences, [key]: e.target.value });

  const select = (key, label, options) => (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <select
        value={preferences[key]}
        onChange={set(key)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(([val, text]) => (
          <option key={val} value={val}>{text}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">⚙️ Preferensi Sistem</h3>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan Pengaturan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {select('language', 'Bahasa', [
            ['id', 'Bahasa Indonesia'],
            ['en', 'English'],
            ['jv', 'Bahasa Jawa'],
          ])}
          {select('timezone', 'Zona Waktu', [
            ['Asia/Jakarta', 'WIB (UTC+7)'],
            ['Asia/Makassar', 'WITA (UTC+8)'],
            ['Asia/Jayapura', 'WIT (UTC+9)'],
          ])}
          {select('dateFormat', 'Format Tanggal', [
            ['DD/MM/YYYY', 'DD/MM/YYYY'],
            ['MM/DD/YYYY', 'MM/DD/YYYY'],
            ['YYYY-MM-DD', 'YYYY-MM-DD'],
          ])}
        </div>

        <div className="space-y-4">
          {select('temperatureUnit', 'Unit Suhu', [
            ['celsius', 'Celsius (°C)'],
            ['fahrenheit', 'Fahrenheit (°F)'],
          ])}
          {select('theme', 'Tema', [
            ['light', 'Light'],
            ['dark', 'Dark'],
            ['auto', 'Auto (System)'],
          ])}
          <div className="pt-4">
            <ToggleSwitch
              checked={preferences.autoSave}
              onChange={(val) => setPreferences({ ...preferences, autoSave: val })}
              label="Auto Save"
              description="Simpan perubahan secara otomatis"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
