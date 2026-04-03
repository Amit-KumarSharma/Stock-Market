import React, { useState, useEffect } from 'react';
import { getCalls, addCall, updateCallStatus, deleteCall, getPlans, addPlan, updatePlan, addBroadcast, getBroadcasts, deleteBroadcast } from '../firebase/db';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const CATEGORIES = ['Equity', 'Options', 'Intraday', 'Swing', 'Commodity'];
const STATUSES = ['active', 'target_hit', 'sl_hit'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('calls');
  
  // States for Calls
  const [calls, setCalls] = useState([]);
  const [callForm, setCallForm] = useState({
    asset_name: '', category: 'Equity', entry_price: '', target_price: '', stop_loss: '', status: 'active'
  });

  // States for Plans
  const [plans, setPlans] = useState([]);
  const [planForm, setPlanForm] = useState({
    plan_name: '', price: '', duration: ''
  });

  // States for Broadcasts
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'calls') {
        const d = await getCalls();
        setCalls(d);
      } else if (activeTab === 'plans') {
        const p = await getPlans();
        setPlans(p);
      } else if (activeTab === 'broadcasts') {
        const b = await getBroadcasts();
        setBroadcasts(b);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleCallSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCall(callForm);
      toast.success('Call added successfully');
      setCallForm({ asset_name: '', category: 'Equity', entry_price: '', target_price: '', stop_loss: '', status: 'active' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add call');
    }
  };

  const handleDeleteCall = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await deleteCall(id);
      toast.success('Call deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete call');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateCallStatus(id, status);
      toast.success('Status updated');
      fetchData();
    } catch (error) {
       toast.error('Failed to update status');
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPlan({
        plan_name: planForm.plan_name,
        price: Number(planForm.price),
        duration: Number(planForm.duration),
      });
      toast.success('Plan added');
      setPlanForm({ plan_name: '', price: '', duration: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add plan');
    }
  };

  const togglePlanActive = async (id, currentStatus) => {
    try {
      await updatePlan(id, { is_active: !currentStatus });
      toast.success('Plan updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if(!broadcastMessage.trim()) return;
    try {
      await addBroadcast(broadcastMessage);
      toast.success('Broadcast sent instantly!');
      setBroadcastMessage('');
      fetchData();
    } catch (error) {
      toast.error('Failed to send broadcast');
    }
  };

  const handleDeleteBroadcast = async (id) => {
    if(!window.confirm("Remove this broadcast from all users?")) return;
    try {
      await deleteBroadcast(id);
      toast.success('Broadcast removed');
      fetchData();
    } catch(err) {
      toast.error('Could not delete broadcast');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-display font-bold mb-8 text-primary">Admin Control Panel</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('calls')}
          className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'calls' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}
        >
          Manage Calls
        </button>
        <button 
          onClick={() => setActiveTab('plans')}
          className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'plans' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}
        >
          Manage Plans
        </button>
        <button 
          onClick={() => setActiveTab('broadcasts')}
          className={`px-6 py-2 rounded-lg text-danger font-medium transition ${activeTab === 'broadcasts' ? 'bg-danger/20 border border-danger/50 text-danger' : 'bg-white/10 text-gray-400'}`}
        >
          Emergency Broadcast
        </button>
      </div>

      {activeTab === 'calls' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Call Form */}
          <div className="lg:col-span-1 glass-card p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Add New Call</h2>
            <form onSubmit={handleCallSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Asset Name</label>
                <input required type="text" value={callForm.asset_name} onChange={e => setCallForm({...callForm, asset_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="NIFTY OR BANKNIFTY" />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Category</label>
                <select value={callForm.category} onChange={e => setCallForm({...callForm, category: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Entry</label>
                  <input required type="text" value={callForm.entry_price} onChange={e => setCallForm({...callForm, entry_price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Target</label>
                  <input required type="text" value={callForm.target_price} onChange={e => setCallForm({...callForm, target_price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Stop Loss</label>
                <input required type="text" value={callForm.stop_loss} onChange={e => setCallForm({...callForm, stop_loss: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 mt-4">
                <Plus className="w-4 h-4" /> Publish Call
              </button>
            </form>
          </div>

          {/* List Calls */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Current Signals</h2>
            {calls.map(call => (
              <div key={call.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-lg">{call.asset_name} <span className="text-xs font-normal text-gray-400 ml-2">{call.category}</span></h3>
                  <div className="flex gap-4 mt-1 text-sm text-gray-300">
                    <span>Entry: <span className="text-white">{call.entry_price}</span></span>
                    <span>Tgt: <span className="text-secondary">{call.target_price}</span></span>
                    <span>SL: <span className="text-danger">{call.stop_loss}</span></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <select 
                    value={call.status} 
                    onChange={(e) => handleUpdateStatus(call.id, e.target.value)}
                    className="bg-dark border border-white/10 rounded-lg px-2 py-1 text-sm"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleDeleteCall(call.id)} className="text-danger hover:bg-danger/10 p-2 rounded-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid lg:grid-cols-3 gap-8">
           {/* Add Plan Form */}
           <div className="lg:col-span-1 glass-card p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Add New Plan</h2>
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Plan Name</label>
                <input required type="text" value={planForm.plan_name} onChange={e => setPlanForm({...planForm, plan_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="30 Days Prep" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Price (INR)</label>
                  <input required type="number" value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Duration (Days)</label>
                  <input required type="number" value={planForm.duration} onChange={e => setPlanForm({...planForm, duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 mt-4">
                <Plus className="w-4 h-4" /> Add Plan
              </button>
            </form>
          </div>

          {/* List Plans */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Available Plans</h2>
            {plans.map(plan => (
               <div key={plan.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{plan.plan_name}</h3>
                  <div className="text-sm text-gray-300 mt-1">₹{plan.price} for {plan.duration} days</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${plan.is_active ? 'bg-secondary/20 text-secondary border-secondary/50' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                    {plan.is_active ? 'Active' : 'Disabled'}
                  </span>
                  <button 
                    onClick={() => togglePlanActive(plan.id, plan.is_active)}
                    className="text-white hover:text-accent underline text-sm"
                  >
                    Toggle Activity
                  </button>
                </div>
               </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'broadcasts' && (
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 glass-card p-6 border-danger/50 bg-danger/10 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b border-danger/30 pb-2 text-danger">Send Global Alert</h2>
            <p className="text-sm text-gray-300 mb-4">This message will instantly appear on the dashboards of all users.</p>
            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-danger mb-1">Message</label>
                <textarea 
                  required 
                  value={broadcastMessage} 
                  onChange={e => setBroadcastMessage(e.target.value)} 
                  className="w-full bg-dark border border-danger/30 rounded-lg px-3 py-2 text-white h-24" 
                  placeholder="E.g. Market crashing! Close all intraday positions immediately!" 
                />
              </div>
              <button type="submit" className="w-full bg-danger hover:bg-danger/80 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4">
                Push Alert
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Active & Past Broadcasts</h2>
            {broadcasts.length === 0 && <p className="text-gray-400">No broadcasts found.</p>}
            {broadcasts.map(b => (
               <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-start gap-4">
                 <div>
                   <p className="font-medium text-lg">{b.message}</p>
                   <p className="text-xs text-gray-500 mt-2">
                     {b.created_at ? new Date(b.created_at.seconds * 1000).toLocaleString() : 'Just now'}
                   </p>
                 </div>
                 <button onClick={() => handleDeleteBroadcast(b.id)} className="text-gray-400 hover:text-danger">
                    <Trash2 className="w-5 h-5" />
                 </button>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
