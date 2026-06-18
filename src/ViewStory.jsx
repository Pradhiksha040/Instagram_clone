import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewStory() {
  const { id, tot } = useParams();
  const [story, setStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Reset progress asynchronously to avoid set-state-in-effect warning
    const frameId = requestAnimationFrame(() => setProgress(0));

    // Fetch story details
    axios.get(`http://localhost:3000/story/${id}`)
      .then(res => {
        setStory(res.data);
      })
      .catch(err => {
        console.log(err);
        navigate('/');
      });

    return () => cancelAnimationFrame(frameId);
  }, [id, navigate]);

  // Handle progress timer ticking (5 seconds total: 50 ticks of 100ms)
  useEffect(() => {
    if (isPaused || !story) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Advance to next story
          const nextId = Number(id) + 1;
          if (nextId > Number(tot)) {
            navigate('/');
          } else {
            navigate(`/Story/${nextId}/${tot}`);
          }
          return 100;
        }
        return prev + 2; // Increments by 2% every 100ms (5000ms total)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, story, id, tot, navigate]);

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevId = Number(id) - 1;
    if (prevId <= 0) {
      navigate('/');
    } else {
      navigate(`/Story/${prevId}/${tot}`);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextId = Number(id) + 1;
    if (nextId > Number(tot)) {
      navigate('/');
    } else {
      navigate(`/Story/${nextId}/${tot}`);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`Story reply sent to ${story?.user?.username}: "${replyText}"`);
    setReplyText('');
    setIsPaused(false);
  };

  if (!story) {
    return (
      <div className="vh-100 bg-dark text-white d-flex align-items-center justify-content-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading Story...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{ backgroundColor: '#1a1a1a', userSelect: 'none' }}
      onClick={() => setIsPaused(!isPaused)}
    >
      <div 
        className="position-relative d-flex flex-column" 
        style={{ width: '100%', maxWidth: '420px', height: '95vh', maxHeight: '800px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress Bars Indicator */}
        <div 
          className="position-absolute w-100 px-3 d-flex gap-1" 
          style={{ top: '12px', zIndex: 100 }}
        >
          {Array.from({ length: Number(tot) }).map((_, idx) => {
            const index = idx + 1;
            let widthPercent = 0;
            if (index < Number(id)) widthPercent = 100;
            if (index === Number(id)) widthPercent = progress;
            return (
              <div 
                key={index} 
                className="flex-grow-1 bg-secondary rounded" 
                style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.35)' }}
              >
                <div 
                  className="bg-white rounded h-100" 
                  style={{ width: `${widthPercent}%`, transition: 'width 0.1s linear' }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Story User Header details */}
        <div 
          className="position-absolute w-100 px-3 d-flex align-items-center gap-2" 
          style={{ top: '24px', zIndex: 100, color: 'white' }}
        >
          <img 
            src={story.user.profile_pic} 
            alt="profile" 
            className="rounded-circle border border-white"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
          <span className="fw-bold fs-7">{story.user.username}</span>
          <span className="text-white-50 fs-8">5h</span>

          {/* Play/Pause Button */}
          <button 
            className="btn btn-link text-white ms-auto p-0 border-0" 
            onClick={() => setIsPaused(!isPaused)}
          >
            <i className={isPaused ? "bi bi-play-fill fs-5" : "bi bi-pause-fill fs-5"}></i>
          </button>

          {/* Close button */}
          <button 
            className="btn btn-link text-white p-0 border-0 ms-2"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Navigation arrow buttons (Desktop only) */}
        <button 
          className="btn position-absolute rounded-circle border-0 d-none d-md-flex align-items-center justify-content-center text-white"
          style={{ top: '50%', left: '-60px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.15)', width: '40px', height: '40px' }}
          onClick={handlePrev}
        >
          <i className="bi bi-chevron-left fs-5"></i>
        </button>

        <button 
          className="btn position-absolute rounded-circle border-0 d-none d-md-flex align-items-center justify-content-center text-white"
          style={{ top: '50%', right: '-60px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.15)', width: '40px', height: '40px' }}
          onClick={handleNext}
        >
          <i className="bi bi-chevron-right fs-5"></i>
        </button>

        {/* Story Media Frame */}
        <div 
          className="flex-grow-1 position-relative d-flex align-items-center justify-content-center cursor-pointer"
          style={{ backgroundColor: '#050505' }}
          onClick={(e) => {
            // Click left third to go back, right two-thirds to go forward
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 3) {
              handlePrev(e);
            } else {
              handleNext(e);
            }
          }}
        >
          <img 
            src={story.image} 
            alt="Story content" 
            className="w-100 h-100 object-fit-cover" 
          />
        </div>

        {/* Bottom Reply Panel */}
        <div 
          className="p-3 bg-black border-top border-secondary d-flex align-items-center"
          style={{ borderColor: 'rgba(255,255,255,0.15) !important' }}
        >
          <form className="d-flex w-100 gap-2" onSubmit={handleSendReply}>
            <input 
              type="text" 
              placeholder={`Reply to ${story.user.username}...`} 
              className="form-control rounded-pill bg-transparent text-white border-secondary fs-7 py-2 px-3"
              style={{ borderColor: 'rgba(255,255,255,0.3)', outline: 'none', boxShadow: 'none' }}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
            />
            {replyText.trim() && (
              <button 
                type="submit" 
                className="btn btn-link text-primary fw-semibold p-0 text-decoration-none"
              >
                Send
              </button>
            )}
          </form>
          <i className="bi bi-send text-white fs-5 ms-3 cursor-pointer" onClick={() => alert("Story shared!")}></i>
        </div>

      </div>
    </div>
  );
}

export default ViewStory;