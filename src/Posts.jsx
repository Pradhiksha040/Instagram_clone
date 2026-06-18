import { useEffect, useState } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeHeartAnimation, setActiveHeartAnimation] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch profile for commenting username
    axios.get('http://localhost:3000/profile')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCurrentUser(res.data[0]);
        }
      })
      .catch(err => console.log(err));

    // Fetch posts
    axios.get('http://localhost:3000/posts')
      .then(res => {
        // Sort posts so that the newest appears first (descending by createdAt)
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleLike = (postId, forceLike = false) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likedByCurrentUser;
        if (alreadyLiked && forceLike) return post; // Double tap shouldn't unlike

        const updatedLikedState = forceLike ? true : !alreadyLiked;
        const updatedLikesCount = updatedLikedState 
          ? (alreadyLiked ? post.likes : post.likes + 1)
          : (alreadyLiked ? post.likes - 1 : post.likes);

        const updatedPost = {
          ...post,
          likedByCurrentUser: updatedLikedState,
          likes: updatedLikesCount
        };

        // Sync with API
        axios.put(`http://localhost:3000/posts/${postId}`, updatedPost)
          .catch(err => console.log("Failed to sync like with server:", err));

        return updatedPost;
      }
      return post;
    }));
  };

  const handleDoubleTap = (postId) => {
    // Trigger pop animation
    setActiveHeartAnimation(prev => ({ ...prev, [postId]: true }));
    handleLike(postId, true);

    // Hide animation after 800ms
    setTimeout(() => {
      setActiveHeartAnimation(prev => ({ ...prev, [postId]: false }));
    }, 800);
  };

  const handleBookmark = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedPost = {
          ...post,
          savedByCurrentUser: !post.savedByCurrentUser
        };

        // Sync with API
        axios.put(`http://localhost:3000/posts/${postId}`, updatedPost)
          .catch(err => console.log("Failed to sync bookmark with server:", err));

        return updatedPost;
      }
      return post;
    }));
  };

  const handleCommentSubmit = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: 'comment_' + Date.now(),
          username: currentUser ? currentUser.username : 'pradhiksha040',
          text: text.trim()
        };

        const updatedComments = [...(post.comments || []), newComment];
        const updatedPost = {
          ...post,
          comments: updatedComments
        };

        // Sync with API
        axios.put(`http://localhost:3000/posts/${postId}`, updatedPost)
          .catch(err => console.log("Failed to sync comment with server:", err));

        return updatedPost;
      }
      return post;
    }));

    // Clear input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentKeyPress = (e, postId) => {
    if (e.key === 'Enter') {
      handleCommentSubmit(postId);
    }
  };

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading Posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="post-container" key={post.id}>
            {/* Header */}
            <div className="post-header">
              <img 
                className="post-user-pic" 
                src={post.user.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                alt="Profile pic"
              />
              <div className="post-user-info">
                <a href="/profile" className="post-username">{post.user.username}</a>
                {post.location && <span className="post-location">{post.location}</span>}
              </div>
              <button className="post-options-btn" onClick={() => alert(`Options for post by ${post.user.username}`)}>
                <i className="bi bi-three-dots"></i>
              </button>
            </div>

            {/* Post Image with double-tap like animation */}
            <div 
              className="post-image-container"
              onDoubleClick={() => handleDoubleTap(post.id)}
            >
              <img 
                className={`post-img ${post.filterClass || 'filter-normal'}`} 
                src={post.image} 
                alt="post"
              />
              <div className={`heart-overlay ${activeHeartAnimation[post.id] ? 'animate' : ''}`}>
                <i className="bi bi-heart-fill"></i>
              </div>
            </div>

            {/* Action Bar */}
            <div className="post-actions">
              <button 
                className={`action-btn ${post.likedByCurrentUser ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <i className={post.likedByCurrentUser ? "bi bi-heart-fill" : "bi bi-heart"}></i>
              </button>

              <button 
                className="action-btn"
                onClick={() => document.getElementById(`comment-input-${post.id}`).focus()}
              >
                <i className="bi bi-chat"></i>
              </button>

              <button className="action-btn" onClick={() => alert("Link copied to clipboard!")}>
                <i className="bi bi-send"></i>
              </button>

              <button 
                className={`action-btn save-btn ${post.savedByCurrentUser ? 'saved' : ''}`}
                onClick={() => handleBookmark(post.id)}
              >
                <i className={post.savedByCurrentUser ? "bi bi-bookmark-fill" : "bi bi-bookmark"}></i>
              </button>
            </div>

            {/* Likes count */}
            <div className="post-likes">
              {post.likes ? post.likes.toLocaleString() : 0} likes
            </div>

            {/* Caption */}
            <div className="post-caption">
              <a href="/profile" className="post-caption-user">{post.user.username}</a>
              <span>{post.caption}</span>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="comments-list mt-2">
                {post.comments.length > 2 && (
                  <div 
                    className="comments-preview-btn" 
                    onClick={() => alert(`Viewing all ${post.comments.length} comments`)}
                  >
                    View all {post.comments.length} comments
                  </div>
                )}
                {post.comments.slice(-2).map((comment) => (
                  <div className="comment-item" key={comment.id}>
                    <span className="comment-user">{comment.username}</span>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Timestamp */}
            <div className="post-time">
              {formatTimeAgo(post.createdAt)}
            </div>

            {/* Inline Comment Field */}
            <div className="comment-input-container">
              <i className="bi bi-emoji-smile me-2 text-secondary fs-5 cursor-pointer"></i>
              <input 
                type="text" 
                id={`comment-input-${post.id}`}
                placeholder="Add a comment..." 
                className="comment-input"
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                onKeyPress={(e) => handleCommentKeyPress(e, post.id)}
              />
              <button 
                className={`comment-submit-btn ${(commentInputs[post.id] || '').trim() ? 'active' : ''}`}
                disabled={!(commentInputs[post.id] || '').trim()}
                onClick={() => handleCommentSubmit(post.id)}
              >
                Post
              </button>
            </div>

          </div>
        ))
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-camera text-muted fs-1 mb-3 d-block"></i>
          <p className="text-muted">No posts available. Be the first to share one!</p>
        </div>
      )}
    </div>
  );
}

export default Posts;
