import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Target, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Performance = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'Calls'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const callsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Filter out active calls, keep only finished ones.
      setCalls(callsData.filter(c => c.status !== 'active'));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalFinished = calls.length;
  const targetHit = calls.filter(c => c.status === 'target_hit').length;
  const slHit = calls.filter(c => c.status === 'sl_hit').length;
  const accuracy = totalFinished > 0 ? ((targetHit / totalFinished) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-4">Historical Performance</h1>
        <p className="text-gray-400">Total transparency. Track every historical signal provided to our premium members.</p>
      </div>

      {loading ? (
        <div className="text-center">Calculating performance...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 flex items-center gap-4 border-t-2 border-t-accent">
              <div className="p-4 bg-accent/10 rounded-full text-accent">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Overall Accuracy</p>
                <h3 className="text-3xl font-bold">{accuracy}%</h3>
              </div>
            </div>
            
            <div className="glass-card p-6 flex items-center gap-4 border-t-2 border-t-secondary">
              <div className="p-4 bg-secondary/10 rounded-full text-secondary">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Targets Hit</p>
                <h3 className="text-3xl font-bold">{targetHit}</h3>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 border-t-2 border-t-danger">
              <div className="p-4 bg-danger/10 rounded-full text-danger">
                <TrendingDown className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Stop Loss Hit</p>
                <h3 className="text-3xl font-bold">{slHit}</h3>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-dark">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-gray-400 font-medium text-sm">Date</th>
                  <th className="p-4 text-gray-400 font-medium text-sm">Asset</th>
                  <th className="p-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="p-4 text-gray-400 font-medium text-sm">Entry / Target / SL</th>
                  <th className="p-4 text-gray-400 font-medium text-sm">Result</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={call.id} 
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-4 text-gray-300 text-sm">
                      {call.created_at ? new Date(call.created_at.toDate()).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 font-bold">{call.asset_name}</td>
                    <td className="p-4 text-sm text-gray-400">{call.category}</td>
                    <td className="p-4 font-mono text-xs text-gray-300 space-x-2">
                       <span>E: {call.entry_price}</span>
                       <span className="text-secondary">T: {call.target_price}</span>
                       <span className="text-danger">SL: {call.stop_loss}</span>
                    </td>
                    <td className="p-4">
                      {call.status === 'target_hit' ? (
                         <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded border border-secondary/30">Target Hit</span>
                      ) : (
                         <span className="bg-danger/20 text-danger text-xs px-2 py-1 rounded border border-danger/30">SL Hit</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {calls.length === 0 && (
               <div className="p-8 text-center text-gray-500">No historical data available yet.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Performance;
