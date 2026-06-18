import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ 
  isCollapsed, 
  onSearchToggle, 
  onNotificationsToggle, 
  activeSearch, 
  activeNotifications, 
  theme, 
  toggleTheme,
  closeDrawers
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleNavigation = (path) => {
    closeDrawers();
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Instagram Logo */}
      <div 
        className="sidebar-logo cursor-pointer" 
        onClick={() => handleNavigation('/')}
        style={{ cursor: 'pointer' }}
      >
        {!isCollapsed ? (
          <img 
            className="logo-img" 
            src="/src/assets/insta.png" 
            alt="Instagram" 
          />
        ) : (
          <div className="text-center py-2">
            <i className="bi bi-instagram fs-4"></i>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        <div 
          className={`menu-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => handleNavigation('/')}
        >
          <i className={isActive('/') ? "bi bi-house-fill" : "bi bi-house"}></i>
          <span>Home</span>
        </div>

        <div 
          className={`menu-item ${activeSearch ? 'active' : ''}`}
          onClick={onSearchToggle}
        >
          <i className={activeSearch ? "bi bi-search-heart-fill" : "bi bi-search"}></i>
          <span>Search</span>
        </div>

        <div 
          className={`menu-item ${isActive('/explore') ? 'active' : ''}`}
          onClick={() => handleNavigation('/explore')}
        >
          <i className={isActive('/explore') ? "bi bi-compass-fill" : "bi bi-compass"}></i>
          <span>Explore</span>
        </div>

        <div 
          className={`menu-item ${isActive('/reels') ? 'active' : ''}`}
          onClick={() => handleNavigation('/reels')}
        >
          <i className={isActive('/reels') ? "bi bi-play-btn-fill" : "bi bi-play-btn"}></i>
          <span>Reels</span>
        </div>

        <div 
          className={`menu-item ${isActive('/messages') ? 'active' : ''}`}
          onClick={() => handleNavigation('/messages')}
        >
          <i className={isActive('/messages') ? "bi bi-chat-dots-fill" : "bi bi-chat-dots"}></i>
          <span>Messages</span>
        </div>

        <div 
          className={`menu-item ${activeNotifications ? 'active' : ''}`}
          onClick={onNotificationsToggle}
        >
          <i className={activeNotifications ? "bi bi-heart-fill" : "bi bi-heart"}></i>
          <span>Notifications</span>
        </div>

        {/* We will handle Create post directly, clicking it can trigger a modal. 
            We will bind this to a custom event or a router search parameter, 
            e.g. ?create=true so any page can open the Create modal! */}
        <div 
          className="menu-item"
          onClick={() => {
            closeDrawers();
            navigate('?create=true');
          }}
        >
          <i className="bi bi-plus-square"></i>
          <span>Create</span>
        </div>

        <div 
          className={`menu-item ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => handleNavigation('/profile')}
        >
          <i className={isActive('/profile') ? "bi bi-person-circle" : "bi bi-person"}></i>
          <span>Profile</span>
        </div>
      </div>

      {/* Footer Items (More dropdown) */}
      <div className="sidebar-footer" style={{ position: 'relative' }}>
        {showMoreMenu && (
          <div 
            className="position-absolute bg-dark text-white border border-secondary rounded p-2" 
            style={{ 
              bottom: '100%', 
              left: isCollapsed ? '10px' : '0', 
              width: isCollapsed ? '180px' : '100%',
              zIndex: 110,
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div 
              className="p-2 menu-item fs-7 rounded d-flex align-items-center gap-2 hover-bg"
              onClick={toggleTheme}
              style={{ cursor: 'pointer' }}
            >
              <i className={theme === 'dark' ? "bi bi-sun fs-6" : "bi bi-moon fs-6"} style={{ margin: 0 }}></i>
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div 
              className="p-2 menu-item fs-7 rounded d-flex align-items-center gap-2 hover-bg"
              onClick={() => {
                setShowMoreMenu(false);
                alert("Redirecting to mock Threads app...");
              }}
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-threads fs-6" style={{ margin: 0 }}></i>
              <span>Threads</span>
            </div>
            <hr className="my-1 border-secondary" />
            <div 
              className="p-2 menu-item fs-7 rounded text-danger d-flex align-items-center gap-2 hover-bg"
              onClick={() => {
                setShowMoreMenu(false);
                alert("Logged out (mock)");
              }}
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-box-arrow-right fs-6" style={{ margin: 0 }}></i>
              <span>Log out</span>
            </div>
          </div>
        )}

        <div 
          className="menu-item"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <i className="bi bi-list"></i>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;