import { useState, useEffect } from 'react';
import axios from 'axios';

// Hardcoded explore grid images to supplement the current posts
const explorePresets = [
  { id: 'exp1', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600', likes: 1420, comments: 88, category: 'Tech' },
  { id: 'exp2', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600', likes: 980, comments: 45, category: 'Food' },
  { id: 'exp3', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600', likes: 2150, comments: 120, category: 'Travel' },
  { id: 'exp4', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600', likes: 830, comments: 34, category: 'Style' },
  { id: 'exp5', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600', likes: 3400, comments: 290, category: 'Art' },
  { id: 'exp6', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600', likes: 1980, comments: 67, category: 'Nature' },
  { id: 'exp7', image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=600', likes: 1210, comments: 55, category: 'Nature' },
  { id: 'exp8', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600', likes: 2890, comments: 140, category: 'Travel' },
  { id: 'exp9', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600', likes: 950, comments: 41, category: 'Tech' }
];

function Explore() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/posts')
      .then(res => {
        // Map db posts to fit explore grid format
        const dbPosts = res.data.map(p => ({
          id: p.id,
          image: p.image,
          likes: p.likes || 0,
          comments: p.comments ? p.comments.length : 0,
          category: 'All'
        }));
        setPosts([...dbPosts, ...explorePresets]);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setPosts(explorePresets);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Travel', 'Tech', 'Food', 'Style', 'Art', 'Nature'];

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory || p.category === 'All');

  return (
    <div className="w-100" style={{ maxWidth: '935px' }}>
      {/* Category Pills */}
      <div className="d-flex justify-content-start gap-2 mb-4 overflow-auto py-2" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn rounded-pill px-4 py-2 fw-semibold fs-7 border-0`}
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-primary)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="explore-grid">
          {filteredPosts.map((post, index) => (
            <div key={post.id + '-' + index} className="explore-item rounded">
              <img 
                src={post.image} 
                alt="Explore item" 
                className="explore-img"
              />
              <div className="explore-overlay">
                <span>
                  <i className="bi bi-heart-fill"></i> {post.likes}
                </span>
                <span>
                  <i className="bi bi-chat-fill"></i> {post.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
