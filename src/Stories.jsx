import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Stories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/story')
      .then(res => {
        setStories(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="stories-slider">
      {stories.length > 0 ? (
        stories.map((story) => (
          <Link
            to={`/Story/${story.id}/${stories.length}`}
            key={story.id}
            className="story-item"
          >
            <div className="story-ring">
              <div className="story-avatar-container">
                <img
                  src={story.user.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                  alt={story.user.username}
                  className="story-avatar"
                />
              </div>
            </div>
            <span className="story-username">{story.user.username}</span>
          </Link>
        ))
      ) : (
        // Mock skeleton load
        [1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="story-item placeholder-glow">
            <div className="story-ring border-secondary bg-dark" style={{ background: 'var(--border-color)' }}>
              <div className="story-avatar-container bg-dark"></div>
            </div>
            <div className="placeholder col-8 py-1 rounded mt-1 bg-secondary"></div>
          </div>
        ))
      )}
    </div>
  );
}

export default Stories;