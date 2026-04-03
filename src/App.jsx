import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Performance from './pages/Performance';
import MyPlan from './pages/MyPlan';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <div className="w-full min-h-screen bg-darker text-gray-200">
      <Navbar />
      <main className="w-full pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/performance" element={<Performance />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-plan" 
            element={
              <ProtectedRoute>
                <MyPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
