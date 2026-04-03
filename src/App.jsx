import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
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
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
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

      {/* Temporary footer for PhonePe KYC Legal checks */}
      <footer className="w-full mt-auto border-t border-white/10 pt-6 pb-6 text-center text-sm text-gray-500 bg-dark">
        <div className="flex justify-center gap-6 mb-2">
          <Link to="/terms" className="hover:text-primary transition">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
          <Link to="/refund" className="hover:text-primary transition">Refund Policy</Link>
        </div>
        <p>© 2026 Amit's Advisory. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
