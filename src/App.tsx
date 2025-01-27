import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AdminIndex from './pages/admin/Index';
import PostsIndex from './pages/admin/posts/Index';
import PostEditor from './pages/admin/posts/Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/admin/posts" element={<PostsIndex />} />
        <Route path="/admin/posts/new" element={<PostEditor />} />
        <Route path="/admin/posts/:id/edit" element={<PostEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
