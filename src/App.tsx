import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Auth from './pages/Auth';
import AdminIndex from './pages/admin/Index';
import PostsIndex from './pages/admin/posts/Index';
import PostEditor from './pages/admin/posts/Editor';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layouts/AdminLayout';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminIndex />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/posts" element={
            <ProtectedRoute>
              <AdminLayout>
                <PostsIndex />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/new" element={
            <ProtectedRoute>
              <AdminLayout>
                <PostEditor />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <PostEditor />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;