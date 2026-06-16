import React, { useEffect, useState } from 'react';
import { useParams,Link ,useNavigate} from 'react-router-dom';

function ViewStory() {
  const { id ,tot } = useParams();
  const [story, setStory] = useState(null);

  const navigate = useNavigate();

useEffect(() => {
  fetch(`http://localhost:3000/story/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setStory(data);
    })
    .catch(err => console.log(err));
}, [id]);


  if (Number(id) > Number(tot) || Number(id)<=0) {
    navigate('/');
  }

  return (
    <div>
      {story ? (<div className='d-flex justify-content-center align-items-center'>
            <Link to={`/Story/${Number(id)-1}/${tot}`}><i className="bi bi-arrow-left-circle-fill"></i></Link>
            <img className="vh-100 "src={story.image} alt="" />
            <Link to={`/Story/${Number(id)+1}/${tot}`}><i className="bi bi-arrow-right-circle-fill"></i></Link>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default ViewStory;