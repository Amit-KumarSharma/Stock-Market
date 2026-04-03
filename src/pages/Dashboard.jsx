import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import CallCard from '../components/CallCard';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Rocket, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Equity', 'Options', 'Intraday', 'Swing', 'Commodity'];

const Dashboard = () => {
  const [calls, setCalls] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [latestBroadcast, setLatestBroadcast] = useState(null);
  const { user, hasActivePlan, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time listener for Calls
    const q = query(collection(db, 'Calls'), orderBy('created_at', 'desc'));
    const unsubscribeCalls = onSnapshot(q, (snapshot) => {
      const callsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCalls(callsData);
      setLoading(false);
    });

    // Real-time listener for Broadcasts
    const bQ = query(collection(db, 'Broadcasts'), orderBy('created_at', 'desc'), limit(1));
    const unsubBroadcast = onSnapshot(bQ, (snapshot) => {
      if (!snapshot.empty) {
        setLatestBroadcast({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setLatestBroadcast(null);
      }
    });

    return () => {
      unsubscribeCalls();
      unsubBroadcast();
    };
  }, []);

  const filteredCalls = activeCategory === 'All' 
    ? calls 
    : calls.filter(call => call.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Global Broadcast Banner */}
      {latestBroadcast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-danger/10 border border-danger/50 text-danger px-6 py-4 rounded-xl flex items-start gap-4 shadow-lg shadow-danger/5"
        >
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-lg mb-1 tracking-wide">EMERGENCY BROADCAST</h4>
            <p className="font-medium text-white">{latestBroadcast.message}</p>
            <p className="text-xs text-danger/70 mt-2">
              Posted: {latestBroadcast.created_at ? new Date(latestBroadcast.created_at.seconds * 1000).toLocaleString() : 'Just now'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Header section with User Plan Details */}
      <div className="flex flex-wrap justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold">Trading Signals</h1>
          <p className="text-gray-400 mt-2">Real-time market calls from our experts.</p>
        </div>
        
        {userData?.role !== 'admin' && (
          <div className="glass-card px-6 py-4 flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Current Plan</p>
              <p className="font-bold text-lg text-white">
                {hasActivePlan() ? userData?.plan_type : 'Free Version'}
              </p>
            </div>
            {!hasActivePlan() && (
              <button 
                onClick={() => navigate('/my-plan')}
                className="bg-accent hover:bg-accent/80 text-darker font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Rocket className="w-4 h-4" /> Upgrade
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              activeCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Calls Grid */}
      {loading ? (
        <div className="flex justify-center p-12">Loading signals...</div>
      ) : filteredCalls.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-gray-400">No {activeCategory !== 'All' ? activeCategory : ''} calls found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalls.map(call => (
            <CallCard key={call.id} call={call} onUpgrade={() => navigate('/my-plan')} />
          ))}
        </div>
      )}


    </div>
  );
};

export default Dashboard;
