import Feed from './Feed';
import Suggestions from './Suggestions';

function App() {
  return (
    <div className="d-flex w-100 gap-4 justify-content-center" style={{ maxWidth: '935px' }}>
      <div className="flex-grow-1" style={{ maxWidth: '470px' }}>
        <Feed />
      </div>
      <Suggestions />
    </div>
  );
}

export default App;
