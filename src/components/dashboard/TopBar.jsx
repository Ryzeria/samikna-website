import React, { memo } from 'react';
import { HiMenu, HiSearch, HiSun, HiMoon, HiDocumentReport, HiRefresh } from 'react-icons/hi';
import { FaSatellite, FaRobot } from 'react-icons/fa';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';

/**
 * TopBar — sticky dashboard header.
 *
 * Wrapped in React.memo so it only re-renders when its own props change.
 * All function props (toggleTheme, onSearch, onToggle*, onClose*, etc.)
 * are created with useCallback in DashboardLayout, guaranteeing stable
 * references across parent re-renders.
 */
function TopBar({
  darkMode,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  onSearch,
  toggleTheme,
  notificationItems,
  notificationCount,
  showNotifications,
  onToggleNotifications,
  onCloseNotifications,
  user,
  showProfile,
  onToggleProfile,
  onCloseProfile,
  handleLogout,
  currentPath,
  onNavigate,
}) {
  const dm = darkMode;

  return (
    <>
      {/* Header */}
      <header className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-4 lg:px-6 py-3 sticky top-0 z-40`}>
        <div className="flex items-center justify-between">

          {/* Left — hamburger + search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${dm ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <HiMenu className="h-6 w-6" />
            </button>

            <div className="hidden md:flex items-center">
              <form onSubmit={onSearch} className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search data, reports, fields..."
                  className={`pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-sm ${
                    dm
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </form>
            </div>
          </div>

          {/* Right — theme toggle, quick links, dropdowns */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${dm ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              title={dm ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dm ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Quick links */}
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { icon: FaSatellite,      title: 'View Satellite Maps',  path: '/dashboard/maps',    hover: 'blue' },
                { icon: FaRobot,          title: 'AI Assistant',         path: '/dashboard/chatbot', hover: 'green' },
                { icon: HiDocumentReport, title: 'Generate Reports',     path: '/dashboard/reports', hover: 'purple' },
              ].map(({ icon: Icon, title, path, hover }) => (
                <button
                  key={path}
                  onClick={() => onNavigate(path)}
                  title={title}
                  className={`p-2 rounded-lg transition-colors ${
                    dm
                      ? `text-gray-300 hover:text-${hover}-400 hover:bg-${hover}-900`
                      : `text-gray-600 hover:text-${hover}-600 hover:bg-${hover}-50`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <NotificationsDropdown
              items={notificationItems}
              count={notificationCount}
              darkMode={dm}
              show={showNotifications}
              onToggle={onToggleNotifications}
              onClose={onCloseNotifications}
            />

            <ProfileDropdown
              user={user}
              darkMode={dm}
              show={showProfile}
              onToggle={onToggleProfile}
              onClose={onCloseProfile}
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className={`${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 lg:px-6 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => onNavigate('/dashboard')}
              className={`${dm ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Dashboard
            </button>
            {currentPath !== '/dashboard' && (
              <>
                <span className={`${dm ? 'text-gray-500' : 'text-gray-400'}`}>/</span>
                <span className={`capitalize font-medium ${dm ? 'text-white' : 'text-gray-900'}`}>
                  {currentPath.split('/').pop()?.replace('-', ' ')}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated:{' '}
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={() => window.location.reload()}
              className={`p-1 rounded ${dm ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              title="Refresh page"
            >
              <HiRefresh className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(TopBar);
