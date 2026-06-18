import { useState } from 'react';

function Reels() {
  const [reels, setReels] = useState([
    {
      id: 'r1',
      username: 'travel_guru',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      caption: 'Waking up to this Maldives beauty is a dream! 🏝️✨ #maldives #travelgoals #ocean',
      audio: 'Original Audio - travel_guru',
      likes: 12450,
      comments: 342,
      liked: false,
      saved: false
    },
    {
      id: 'r2',
      username: 'foodie_vibes',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      media: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
      caption: 'Best Tonkotsu Ramen in Tokyo! The broth was cooked for 24 hours. 🍜🤤 #tokyofood #ramen #foodporn',
      audio: 'Original Audio - Tokyo Eats',
      likes: 8520,
      comments: 195,
      liked: false,
      saved: false
    },
    {
      id: 'r3',
      username: 'emma_watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      media: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      caption: 'Mechanical keyboard typing sound is so satisfying. ASMR coding edition 💻⌨️ #setup #coding #mechanicalkeyboard',
      audio: 'Satisfying ASMR Lo-Fi Beats',
      likes: 21900,
      comments: 890,
      liked: false,
      saved: false
    }
  ]);

  const [isMuted, setIsMuted] = useState(true);

  const handleLike = (id) => {
    setReels(prev => prev.map(reel => {
      if (reel.id === id) {
        return {
          ...reel,
          liked: !reel.liked,
          likes: reel.liked ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleSave = (id) => {
    setReels(prev => prev.map(reel => {
      if (reel.id === id) {
        return { ...reel, saved: !reel.saved };
      }
      return reel;
    }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="reels-container">
        {reels.map((reel) => (
          <div key={reel.id} className="reel-card">
            {/* Reel Media Wrapper */}
            <div className="reel-media-wrapper">
              <img 
                src={reel.media} 
                alt="Reel background" 
                className="reel-img" 
              />
            </div>

            {/* Mute toggle overlay indicator */}
            <button 
              className="position-absolute bg-dark bg-opacity-50 text-white rounded-circle border-0 d-flex align-items-center justify-content-center"
              style={{ top: '16px', right: '16px', width: '36px', height: '36px', zIndex: 20 }}
              onClick={() => setIsMuted(!isMuted)}
            >
              <i className={isMuted ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill"}></i>
            </button>

            {/* Engagement column */}
            <div className="reel-actions-column">
              <div className="reel-action-item" onClick={() => handleLike(reel.id)}>
                <i className={`bi ${reel.liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                <span>{reel.likes.toLocaleString()}</span>
              </div>

              <div className="reel-action-item" onClick={() => alert("Comments for this reel: \n" + reel.caption)}>
                <i className="bi bi-chat"></i>
                <span>{reel.comments}</span>
              </div>

              <div className="reel-action-item" onClick={() => alert("Reel link copied to clipboard!")}>
                <i className="bi bi-send"></i>
              </div>

              <div className="reel-action-item" onClick={() => handleSave(reel.id)}>
                <i className={`bi ${reel.saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
              </div>

              <div className="reel-action-item" onClick={() => alert("More options clicked")}>
                <i className="bi bi-three-dots"></i>
              </div>
            </div>

            {/* Overlay description details */}
            <div className="reel-overlay-content">
              <div className="reel-user-row">
                <img src={reel.avatar} alt={reel.username} className="reel-avatar" />
                <span className="reel-username">{reel.username}</span>
                <button className="reel-follow-btn" onClick={() => alert("Followed " + reel.username)}>Follow</button>
              </div>

              <p className="reel-caption">{reel.caption}</p>

              <div className="reel-audio-row">
                <i className="bi bi-music-note-beamed"></i>
                <span>{reel.audio}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reels;
