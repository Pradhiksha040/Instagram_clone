import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ViewStory from './ViewStory.jsx';
import Profile from './Profile.jsx';
import Explore from './Explore.jsx';
import Reels from './Reels.jsx';
import Messages from './Messages.jsx';
import Layout from './components/Layout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><App /></Layout>
  },
  {
    path: '/Story/:id/:tot',
    element: <ViewStory />
  },
  {
    path: '/profile',
    element: <Layout><Profile /></Layout>
  },
  {
    path: '/explore',
    element: <Layout><Explore /></Layout>
  },
  {
    path: '/reels',
    element: <Layout><Reels /></Layout>
  },
  {
    path: '/messages',
    element: <Layout><Messages /></Layout>
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);