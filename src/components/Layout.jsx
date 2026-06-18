import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from './CreatePostModal';

function Layout({ children }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('insta-theme') || 'dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  // Notifications
  const notifications = [
    { id: 1, user: 'john_doe', action: 'liked your post', time: '2h', pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { id: 2, user: 'emma_watson', action: 'started following you', time: '5h', pic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
    { id: 3, user: 'travel_guru', action: 'commented: "Wow! 🌅"', time: '1d', pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' },
    { id: 4, user: 'foodie_vibes', action: 'liked your story', time: '2d', pic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' }
  ];

  // Handle Theme switching
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('insta-theme', newTheme);
  };

  // Fetch all searchable users
  useEffect(() => {
    axios.get('http://localhost:3000/suggestions')
      .then(res => {
        const sugg = res.data;
        axios.get('http://localhost:3000/followers')
          .then(res2 => {
            const followers = res2.data;
            // Merge unique users
            const combined = [...sugg, ...followers];
            const unique = combined.reduce((acc, current) => {
              const x = acc.find(item => item.username === current.username);
              if (!x) acc.push(current);
              return acc;
            }, []);
            setAllUsers(unique);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, []);

  // Filter search results
  const searchResults = searchQuery.trim() === ''
    ? []
    : allUsers.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSearchOpen(false);
  };

  const closeDrawers = () => {
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
  };

  const navigateToProfile = (username) => {
    closeDrawers();
    // Navigate to profile (for mock, go to user details or main profile if it's current user)
    if (username === 'pradhiksha040') {
      navigate('/profile');
    } else {
      // Just go to profile for demo, or show alert
      navigate('/profile');
    }
  };

  const isDrawerOpen = isSearchOpen || isNotificationsOpen;

  return (
    <div className="main-wrapper">
      <Sidebar 
        isCollapsed={isDrawerOpen} 
        onSearchToggle={toggleSearch}
        onNotificationsToggle={toggleNotifications}
        activeSearch={isSearchOpen}
        activeNotifications={isNotificationsOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        closeDrawers={closeDrawers}
      />

      {/* Search Drawer */}
      <div className={`drawer ${isSearchOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Search</h3>
          <input 
            type="text" 
            placeholder="Search" 
            className="drawer-search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="drawer-body">
          {searchQuery.trim() === '' ? (
            <div className="text-muted text-center py-5">
              <i className="bi bi-search fs-1 mb-2 d-block"></i>
              No recent searches
            </div>
          ) : searchResults.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {searchResults.map(user => (
                <div 
                  key={user.id || user.username} 
                  className="d-flex align-items-center gap-3 p-2 rounded cursor-pointer hover-bg"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigateToProfile(user.username)}
                >
                  <img 
                    src={user.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                    alt={user.username} 
                    className="rounded-circle"
                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold fs-6">{user.username}</div>
                    <div className="text-muted fs-7">{user.name || 'Instagram User'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted text-center py-5">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Notifications Drawer */}
      <div className={`drawer ${isNotificationsOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Notifications</h3>
        </div>
        <div className="drawer-body d-flex flex-column gap-3">
          {notifications.map(notif => (
            <div key={notif.id} className="d-flex align-items-center gap-3 p-2 rounded">
              <img 
                src={notif.pic} 
                alt={notif.user} 
                className="rounded-circle"
                style={{ width: '44px', height: '44px', objectFit: 'cover' }}
              />
              <div style={{ flexGrow: 1 }}>
                <span className="fw-bold me-1">{notif.user}</span>
                <span className="text-secondary">{notif.action}</span>
                <span className="text-muted ms-2 fs-7">{notif.time}</span>
              </div>
              <div 
                className="bg-primary rounded" 
                style={{ width: '8px', height: '8px' }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Pane */}
      <div 
        className="content-area"
        onClick={closeDrawers}
        style={{ marginLeft: isDrawerOpen ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
      >
        {children}
      </div>

      <CreatePostModal />
    </div>
  );
}

export default Layout;
