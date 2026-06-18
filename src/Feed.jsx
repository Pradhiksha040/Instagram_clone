import Stories from './Stories';
import Posts from './Posts';

function Feed() {
  return (
    <div className="w-100">
      <Stories />
      <Posts />
    </div>
  );
}

export default Feed;
