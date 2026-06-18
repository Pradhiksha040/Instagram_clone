import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    username: '',
    name: '',
    profile_pic: '',
    bio: '',
    website: ''
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Fetch profile
    axios.get('http://localhost:3000/profile')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const prof = res.data[0];
          setProfile(prof);
          setEditForm({
            username: prof.username || '',
            name: prof.name || '',
            profile_pic: prof.profile_pic || '',
            bio: prof.bio || '',
            website: prof.website || ''
          });
        }
      })
      .catch(err => console.log(err));

    // Fetch followers
    axios.get('http://localhost:3000/followers')
      .then(res => setFollowers(res.data))
      .catch(err => console.log(err));

    // Fetch all posts
    axios.get('http://localhost:3000/posts')
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => console.log(err));
  }, [refreshTrigger]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!profile) return;

    axios.put(`http://localhost:3000/profile/${profile.id}`, {
      ...profile,
      ...editForm
    })
    .then(res => {
      setProfile(res.data);
      setIsEditModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    })
    .catch(err => console.log("Failed to update profile:", err));
  };

  const handleUnFollow = (id) => {
    axios.delete(`http://localhost:3000/followers/${id}`)
      .then(() => {
        setRefreshTrigger(prev => prev + 1);
      })
      .catch(err => console.log(err));
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios.delete(`http://localhost:3000/posts/${postId}`)
        .then(() => {
          // Decrement profile post count
          if (profile) {
            axios.put(`http://localhost:3000/profile/${profile.id}`, {
              ...profile,
              postsCount: Math.max(0, (profile.postsCount || 1) - 1)
            }).catch(err => console.log(err));
          }
          setSelectedPost(null);
          setRefreshTrigger(prev => prev + 1);
        })
        .catch(err => console.log(err));
    }
  };

  // Filter posts
  // 1. User posts (uploaded by current username)
  const userPosts = posts.filter(p => p.user.username === (profile ? profile.username : 'pradhiksha040'));
  // 2. Saved posts (bookmarked by current user)
  const savedPosts = posts.filter(p => p.savedByCurrentUser === true);

  return (
    <div className="w-100" style={{ maxWidth: '935px', paddingBottom: '40px' }}>
      
      {/* Profile Header Details */}
      {profile && (
        <div className="row align-items-center mb-5 mt-4">
          <div className="col-4 col-md-3 text-center">
            <img
              src={profile.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
              className="rounded-circle border border-secondary"
              alt="Profile"
              style={{ width: '130px', height: '130px', objectFit: 'cover' }}
            />
          </div>
          
          <div className="col-8 col-md-9 px-4">
            {/* Username Row */}
            <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
              <h4 className="m-0 fw-semibold">{profile.username}</h4>
              <button 
                className="btn btn-sm btn-secondary fw-semibold px-3 border-0"
                style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </button>
              <button 
                className="btn btn-sm btn-secondary fw-semibold px-3 border-0"
                style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                onClick={() => alert("Settings toggled")}
              >
                Ad Tools
              </button>
            </div>

            {/* Stats Row */}
            <div className="d-flex gap-4 mb-3 fs-6">
              <div>
                <span className="fw-bold me-1">{userPosts.length}</span> posts
              </div>
              <div style={{ cursor: 'pointer' }} onClick={() => setIsFollowersModalOpen(true)}>
                <span className="fw-bold me-1">{followers.length}</span> followers
              </div>
              <div>
                <span className="fw-bold me-1">{profile.followingCount || 0}</span> following
              </div>
            </div>

            {/* Bio Row */}
            <div className="fw-semibold mb-1">{profile.name}</div>
            <div className="text-secondary" style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.4' }}>
              {profile.bio}
            </div>
            {profile.website && (
              <a 
                href={`https://${profile.website}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-decoration-none fw-semibold fs-7 mt-2 d-inline-block"
                style={{ color: 'var(--text-link)' }}
              >
                <i className="bi bi-link-45deg"></i> {profile.website}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="profile-grid-tabs">
        <div 
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <i className="bi bi-grid-3x3"></i>
          <span>Posts</span>
        </div>
        <div 
          className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <i className="bi bi-bookmark"></i>
          <span>Saved</span>
        </div>
        <div 
          className={`profile-tab ${activeTab === 'tagged' ? 'active' : ''}`}
          onClick={() => setActiveTab('tagged')}
        >
          <i className="bi bi-person-bounding-box"></i>
          <span>Tagged</span>
        </div>
      </div>

      {/* Profile Photo Grid */}
      <div className="row g-2 mt-2">
        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            userPosts.map(post => (
              <div key={post.id} className="col-4">
                <div className="explore-item rounded" onClick={() => setSelectedPost(post)}>
                  <img src={post.image} alt="post" className="explore-img" />
                  <div className="explore-overlay">
                    <span><i className="bi bi-heart-fill"></i> {post.likes}</span>
                    <span><i className="bi bi-chat-fill"></i> {post.comments ? post.comments.length : 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-camera fs-1 mb-2 d-block"></i>
              No Posts Yet
            </div>
          )
        )}

        {activeTab === 'saved' && (
          savedPosts.length > 0 ? (
            savedPosts.map(post => (
              <div key={post.id} className="col-4">
                <div className="explore-item rounded" onClick={() => setSelectedPost(post)}>
                  <img src={post.image} alt="saved post" className="explore-img" />
                  <div className="explore-overlay">
                    <span><i className="bi bi-heart-fill"></i> {post.likes}</span>
                    <span><i className="bi bi-chat-fill"></i> {post.comments ? post.comments.length : 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-bookmark fs-1 mb-2 d-block"></i>
              No Saved Posts
            </div>
          )
        )}

        {activeTab === 'tagged' && (
          <div className="col-12 text-center py-5 text-muted">
            <i className="bi bi-person-bounding-box fs-1 mb-2 d-block"></i>
            Photos of you
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="custom-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h5 className="modal-title">Edit Profile</h5>
              <button className="custom-modal-close" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>
            <div className="custom-modal-body">
              <div className="mb-3">
                <label className="form-label text-secondary fs-7">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control bg-dark text-white border-secondary"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary fs-7">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  className="form-control bg-dark text-white border-secondary"
                  value={editForm.username}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary fs-7">Profile Picture URL</label>
                <input 
                  type="text" 
                  name="profile_pic" 
                  className="form-control bg-dark text-white border-secondary"
                  value={editForm.profile_pic}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary fs-7">Bio</label>
                <textarea 
                  name="bio" 
                  className="form-control bg-dark text-white border-secondary"
                  rows="3"
                  value={editForm.bio}
                  onChange={handleEditChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary fs-7">Website</label>
                <input 
                  type="text" 
                  name="website" 
                  className="form-control bg-dark text-white border-secondary"
                  value={editForm.website}
                  onChange={handleEditChange}
                />
              </div>
              <button className="btn btn-primary w-100 mt-2" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="custom-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="custom-modal-container" style={{ maxWidth: '850px', height: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header py-2">
              <h6 className="m-0 fw-bold">Post Details</h6>
              <button className="custom-modal-close" onClick={() => setSelectedPost(null)}>&times;</button>
            </div>
            <div className="h-100 m-0 p-0">
              <div className="row h-100 g-0">
                <div className="col-7 bg-black d-flex align-items-center justify-content-center overflow-hidden">
                  <img 
                    src={selectedPost.image} 
                    alt="post" 
                    className={`w-100 h-100 object-fit-cover ${selectedPost.filterClass || 'filter-normal'}`} 
                  />
                </div>
                <div className="col-5 d-flex flex-column" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)' }}>
                  {/* Post User Header */}
                  <div className="d-flex align-items-center gap-2 p-3 border-bottom border-secondary" style={{ borderColor: 'var(--border-color) !important' }}>
                    <img 
                      src={selectedPost.user.profile_pic} 
                      alt="pic" 
                      className="rounded-circle" 
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <span className="fw-bold">{selectedPost.user.username}</span>
                    
                    {/* Delete option if it's own post */}
                    {selectedPost.user.username === (profile ? profile.username : 'pradhiksha040') && (
                      <button 
                        className="btn btn-sm btn-link text-danger ms-auto p-0 text-decoration-none"
                        onClick={() => handleDeletePost(selectedPost.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    )}
                  </div>

                  {/* Caption & Comments List */}
                  <div className="flex-grow-1 p-3 overflow-y-auto" style={{ maxHeight: '320px' }}>
                    <div className="d-flex gap-2 mb-3">
                      <span className="fw-bold">{selectedPost.user.username}</span>
                      <span className="text-secondary">{selectedPost.caption}</span>
                    </div>

                    {selectedPost.comments && selectedPost.comments.map(c => (
                      <div key={c.id} className="d-flex gap-2 mb-2 fs-7">
                        <span className="fw-bold">{c.username}</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Likes Summary */}
                  <div className="p-3 border-top border-secondary mt-auto" style={{ borderColor: 'var(--border-color) !important' }}>
                    <div className="fw-bold">{selectedPost.likes} likes</div>
                    <small className="text-muted fs-8">Posted recently</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {isFollowersModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsFollowersModalOpen(false)}>
          <div className="custom-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h5 className="modal-title">Followers</h5>
              <button className="custom-modal-close" onClick={() => setIsFollowersModalOpen(false)}>&times;</button>
            </div>
            <div className="custom-modal-body d-flex flex-column gap-3">
              {followers.length > 0 ? (
                followers.map(follower => (
                  <div key={follower.id} className="d-flex align-items-center gap-3">
                    <img 
                      src={follower.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                      alt={follower.username} 
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div className="fw-bold">{follower.username}</div>
                      <div className="text-muted fs-7">{follower.name}</div>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleUnFollow(follower.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-muted text-center py-4">No followers yet</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;