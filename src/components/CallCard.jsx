import React from 'react';
import { Lock, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const CallCard = ({ call, onUpgrade }) => {
  const { hasActivePlan, isAdmin } = useAuth();
  
  // A call is "locked" if it's active AND the user doesn't have an active plan AND user is not admin
  const isLocked = call.status === 'active' && !hasActivePlan() && !isAdmin;

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-accent border-accent bg-accent/10';
      case 'target_hit': return 'text-secondary border-secondary bg-secondary/10';
      case 'sl_hit': return 'text-danger border-danger bg-danger/10';
      default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'target_hit': return <CheckCircle2 className="w-4 h-4" />;
      case 'sl_hit': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch(e) {
      return 'Recent';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative glass-card p-6 overflow-hidden ${isLocked ? 'blur-[2px] select-none' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-display font-bold">{call.asset_name}</h3>
          <div className="flex items-center gap-3 mt-1">
             <p className="text-sm text-gray-400 uppercase tracking-wider">{call.category}</p>
             <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(call.created_at)}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(call.status)}`}>
          {getStatusIcon(call.status)}
          {formatStatus(call.status)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
          <p className="text-xs text-gray-500 mb-1">ENTRY</p>
          <p className="font-mono font-medium">{call.entry_price || '-'}</p>
        </div>
        <div className="bg-secondary/10 rounded-lg p-3 text-center border border-secondary/20">
          <p className="text-xs text-secondary/70 mb-1">TARGET</p>
          <p className="font-mono font-medium text-secondary">{call.target_price || '-'}</p>
        </div>
        <div className="bg-danger/10 rounded-lg p-3 text-center border border-danger/20">
          <p className="text-xs text-danger/70 mb-1">SL</p>
          <p className="font-mono font-medium text-danger">{call.stop_loss || '-'}</p>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-darker/60 backdrop-blur-[4px]">
          <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-3 border border-primary/50">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-lg font-bold mb-1">Premium Call Locked</h4>
          <p className="text-sm text-gray-300 mb-4 px-8 text-center">Upgrade your plan to see active entry & targets</p>
          <button 
            onClick={onUpgrade}
            className="bg-primary hover:bg-primary/80 transition-colors px-6 py-2 rounded-full font-medium text-sm"
          >
            Unlock Premium Calls
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CallCard;
