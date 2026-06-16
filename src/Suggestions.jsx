import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Suggestions() {
    const [profile, setProfile] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/profile')
            .then(data => data.json())
            .then(data => setProfile(data))
            .catch(err => console.log(err));

        fetch('http://localhost:3000/suggestions')
            .then(data => data.json())
            .then(data => setSuggestions(data))
            .catch(err => console.log(err));
    }, []);
const handleFollow = (id) => {
    setSuggestions(prev =>
        prev.map(user =>
            user.id === id
                ? { ...user, followed: true }
                : user
        )
    );
};
    return (
        <div className='suggestions w-75 m-4'>
            {profile ? (
                <div className='d-flex'>
                    <img
                    className='dp rounded-circle'
                    src={profile[0].profile_pic}
                    alt="Profile pic"
                    />
                    <h5>{profile.username}</h5>
                    <small className='ms-auto text-primary'>switch</small>
                </div>
            ) : (
                <p>Loading</p>
            )}

            <div className='d-flex'>
                <p>Suggested for You</p>
                <b className='ms-auto'>See All</b>
            </div>

            {suggestions.length > 0 ? (
                <div>
                    {suggestions.map((suggestion) => (
                        <div className='my-1' key={suggestion.id}>
                            <div className='d-flex'>
                                <img
                                    className='dp rounded-circle'
                                    src={suggestion.profile_pic}
                                    alt="Profile pic"
                                />
                                <h5>{suggestion.username}</h5>
                                <button
                                    className='text-primary ms-auto'
                                    onClick={() => handleFollow(suggestion.id)}
                                >
                                    {suggestion.followed ? 'Following' : 'Follow'}
                                </button>                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    Loading
                </div>
            )}
        </div>
    );
}

export default Suggestions;