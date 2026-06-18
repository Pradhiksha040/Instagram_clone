import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Suggestions() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch profile
    axios.get('http://localhost:3000/profile')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProfile(res.data[0]);
        }
      })
      .catch(err => console.log(err));

    // Fetch suggestions
    axios.get('http://localhost:3000/suggestions')
      .then(res => {
        setSuggestions(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleFollow = (id) => {
    setSuggestions(prev =>
      prev.map(user => {
        if (user.id === id) {
          const updatedState = !user.followed;
          // Put update to json server to persist
          axios.put(`http://localhost:3000/suggestions/${id}`, {
            ...user,
            followed: updatedState
          }).catch(err => console.log(err));

          // Mock update following count on current profile
          if (profile) {
            const newFollowingCount = updatedState ? profile.followingCount + 1 : profile.followingCount - 1;
            axios.put(`http://localhost:3000/profile/${profile.id}`, {
              ...profile,
              followingCount: newFollowingCount
            })
            .then(res => setProfile(res.data))
            .catch(err => console.log(err));
          }

          return { ...user, followed: updatedState };
        }
        return user;
      })
    );
  };

  return (
    <div className="suggestions-sidebar">
      {/* Current User Row */}
      {profile ? (
        <div className="user-profile-row">
          <img
            className="user-profile-pic"
            src={profile.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
            alt="Profile pic"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          />
          <div className="user-profile-info" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <span className="username">{profile.username}</span>
            <span className="fullname">{profile.name}</span>
          </div>
          <button className="switch-btn" onClick={() => navigate('/profile')}>Switch</button>
        </div>
      ) : (
        <div className="placeholder-glow mb-4">
          <div className="placeholder col-12 py-3 rounded"></div>
        </div>
      )}

      {/* Suggestions Header */}
      <div className="suggestions-header">
        <span>Suggested for you</span>
        <span className="see-all" onClick={() => alert("Suggested contacts loaded")}>See All</span>
      </div>

      {/* Suggestion List */}
      {suggestions.length > 0 ? (
        <div className="d-flex flex-column">
          {suggestions.map((suggestion) => (
            <div className="suggestion-row" key={suggestion.id}>
              <img
                className="suggestion-pic"
                src={suggestion.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                alt="Profile pic"
              />
              <div className="suggestion-info">
                <span className="suggestion-username">{suggestion.username}</span>
                <span className="suggestion-subtitle">{suggestion.name || 'Suggested for you'}</span>
              </div>
              <button
                className={`follow-action-btn ${suggestion.followed ? 'following' : ''}`}
                onClick={() => handleFollow(suggestion.id)}
              >
                {suggestion.followed ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted text-center fs-7 py-3">
          No recommendations available
        </div>
      )}

      {/* Mini Footer */}
      <div className="mt-4 text-muted" style={{ fontSize: '11px', lineHeight: '1.4' }}>
        About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language • Meta Verified
        <div className="mt-3">© 2026 INSTAGRAM FROM META CLONE</div>
      </div>
    </div>
  );
}

export default Suggestions;