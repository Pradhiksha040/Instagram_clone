import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function CreatePostModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeFilter, setActiveFilter] = useState('filter-normal');
  const [caption, setCaption] = useState('');
  const [locationText, setLocationText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Preset stock images
  const presets = [
    { name: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Mountain Peak', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600' },
    { name: 'Cozy Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600' },
    { name: 'Delicious Ramen', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600' },
    { name: 'Foggy Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600' }
  ];

  const filterOptions = [
    { id: 'filter-normal', name: 'Normal' },
    { id: 'filter-grayscale', name: 'Grayscale' },
    { id: 'filter-sepia', name: 'Sepia' },
    { id: 'filter-saturate', name: 'Saturate' },
    { id: 'filter-warm', name: 'Warm' },
    { id: 'filter-cool', name: 'Cool' },
    { id: 'filter-vintage', name: 'Vintage' },
    { id: 'filter-invert', name: 'Invert' }
  ];

  useEffect(() => {
    // Fetch current user details
    axios.get('http://localhost:3000/profile')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCurrentUser(res.data[0]);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleClose = () => {
    // Navigate away from ?create=true
    const params = new URLSearchParams(location.search);
    params.delete('create');
    const newSearch = params.toString();
    navigate({
      pathname: location.pathname,
      search: newSearch ? `?${newSearch}` : ''
    });
    // Reset wizard
    setStep(1);
    setSelectedImage('');
    setActiveFilter('filter-normal');
    setCaption('');
    setLocationText('');
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePublish = () => {
    if (!selectedImage) return;

    const newPost = {
      user: {
        id: currentUser ? currentUser.id : 1,
        username: currentUser ? currentUser.username : 'pradhiksha040',
        name: currentUser ? currentUser.name : 'Pradhiksha M',
        profile_pic: currentUser ? currentUser.profile_pic : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
      },
      image: selectedImage,
      filterClass: activeFilter, // Store the filter to render it later
      caption: caption,
      likes: 0,
      likedByCurrentUser: false,
      savedByCurrentUser: false,
      location: locationText,
      createdAt: new Date().toISOString(),
      comments: []
    };

    axios.post('http://localhost:3000/posts', newPost)
      .then(() => {
        // Increment postsCount on profile if profile exists
        if (currentUser) {
          axios.put(`http://localhost:3000/profile/${currentUser.id}`, {
            ...currentUser,
            postsCount: (currentUser.postsCount || 0) + 1
          }).catch(err => console.log("Failed to update profile post count:", err));
        }
        
        handleClose();
        window.location.reload(); // Refresh to see the new post
      })
      .catch(err => {
        console.log(err);
        alert("Failed to share post. Make sure json-server is running.");
      });
  };

  const isCreateParam = new URLSearchParams(location.search).get('create') === 'true';

  if (!isCreateParam) return null;

  return (
    <div className="custom-modal-overlay" onClick={handleClose}>
      <div 
        className="custom-modal-container" 
        style={{ maxWidth: step > 1 ? '850px' : '550px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="custom-modal-header">
          {step > 1 && (
            <button className="btn text-white fs-5 p-0" onClick={handleBack} style={{ color: 'var(--text-primary)' }}>
              <i className="bi bi-arrow-left"></i>
            </button>
          )}
          <div className="custom-modal-title">
            {step === 1 && 'Create new post'}
            {step === 2 && 'Filters'}
            {step === 3 && 'Create post details'}
          </div>
          {step < 3 ? (
            <button 
              className={`btn text-primary fw-bold p-0 ${!selectedImage ? 'opacity-25' : ''}`}
              disabled={!selectedImage}
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button 
              className="btn text-primary fw-bold p-0"
              onClick={handlePublish}
            >
              Share
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-0 m-0" style={{ height: '500px' }}>
          {step === 1 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4">
              <i className="bi bi-images text-muted" style={{ fontSize: '64px' }}></i>
              <h5 className="my-3 text-center">Select an image URL or choose a template</h5>
              
              <input 
                type="text" 
                placeholder="Paste Image URL (e.g. https://images.unsplash.com/...)" 
                className="form-control mb-4 bg-dark text-white border-secondary w-75"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
              />

              <div className="w-100">
                <p className="text-secondary text-center fs-7 mb-2">Preset High-Quality Templates</p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedImage(preset.url)}
                      className={`btn btn-sm btn-outline-secondary ${selectedImage === preset.url ? 'bg-primary text-white border-primary' : ''}`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedImage && (
                <div className="mt-4 text-center">
                  <span className="text-success me-2"><i className="bi bi-check-circle-fill"></i> Image selected</span>
                  <button className="btn btn-sm btn-link text-danger" onClick={() => setSelectedImage('')}>Clear</button>
                </div>
              )}
            </div>
          ) : (
            <div className="wizard-grid">
              {/* Left Side: Preview */}
              <div className="wizard-preview-side">
                <img 
                  src={selectedImage} 
                  alt="Post preview" 
                  className={`wizard-preview-image ${activeFilter}`} 
                />
              </div>

              {/* Right Side: Step details */}
              <div className="wizard-form-side">
                {step === 2 ? (
                  <div>
                    <h6 className="text-secondary mb-3">Choose a filter</h6>
                    <div className="filters-grid">
                      {filterOptions.map((filter) => (
                        <div 
                          key={filter.id} 
                          className={`filter-option ${activeFilter === filter.id ? 'active' : ''}`}
                          onClick={() => setActiveFilter(filter.id)}
                        >
                          <img 
                            src={selectedImage} 
                            alt={filter.name} 
                            className={filter.id}
                          />
                          <span>{filter.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3 h-100">
                    {/* User header */}
                    <div className="d-flex align-items-center gap-2">
                      <img 
                        src={currentUser ? currentUser.profile_pic : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'} 
                        alt="Current user" 
                        className="rounded-circle"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                      />
                      <span className="fw-bold">{currentUser ? currentUser.username : 'pradhiksha040'}</span>
                    </div>

                    {/* Caption area */}
                    <textarea 
                      placeholder="Write a caption..." 
                      className="wizard-textarea"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    ></textarea>

                    {/* Location */}
                    <div className="input-group bg-dark border-secondary rounded">
                      <span className="input-group-text bg-transparent border-0 text-secondary">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input 
                        type="text" 
                        placeholder="Add location" 
                        className="form-control bg-transparent border-0 text-white"
                        style={{ outline: 'none', boxShadow: 'none' }}
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
