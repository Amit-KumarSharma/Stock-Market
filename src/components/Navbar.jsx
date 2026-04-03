import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../firebase/auth';
import { ShieldAlert, TrendingUp, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, hasActivePlan } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <TrendingUp className="text-accent w-8 h-8" />
          <span className="text-2xl font-display font-bold text-white tracking-tight">Amit's <span className="text-accent">Advisory</span></span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/performance" className="text-gray-300 hover:text-white transition-colors">Performance</Link>
          
          {user ? (
            <>
              <Link to="/my-plan" className="text-primary hover:text-primary/80 transition-colors font-medium">My Plan</Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-primary hover:text-accent transition-colors font-medium">
                  <ShieldAlert className="w-4 h-4" /> Admin
                </Link>
              )}
              
              <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-6">
                {!isAdmin && (
                  <span className={`text-xs px-2 py-1 rounded-full border ${hasActivePlan() ? 'bg-secondary/20 border-secondary/50 text-secondary' : 'bg-white/5 border-white/20 text-gray-400'}`}>
                    {hasActivePlan() ? 'Premium Active' : 'Free Plan'}
                  </span>
                )}
                <button onClick={handleLogout} className="text-gray-400 hover:text-danger transition-colors flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/" className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-full font-medium transition-colors">
              Login to Start
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
