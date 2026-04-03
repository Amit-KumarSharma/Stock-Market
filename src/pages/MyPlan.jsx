import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPlans, updateUserPlan } from '../firebase/db';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const MyPlan = () => {
  const { user, userData, hasActivePlan } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loadingObj, setLoadingObj] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const fetchedPlans = await getPlans();
            const activePlans = fetchedPlans.filter(p => p.is_active);
            activePlans.sort((a, b) => a.duration - b.duration);
            setPlans(activePlans);
        } catch (error) {
            console.error("Failed to fetch plans", error);
            toast.error("Failed to fetch available plans");
        } finally {
            setLoadingObj(false);
        }
    };
    fetchPlans();

    // Check if returning from PhonePe gateway
    const urlParams = new URLSearchParams(window.location.search);
    const tid = urlParams.get('transactionId');
    if (tid && urlParams.get('code') === 'PAYMENT_SUCCESS') {
      const verifyPayment = async () => {
        const loadingToast = toast.loading("Verifying your payment securely...");
        try {
          const res = await axios.get(`/api/phonepe-status?transactionId=${tid}`);
          if(res.data && res.data.code === 'PAYMENT_SUCCESS') {
             // Real server says success. Trust it.
             const planName = urlParams.get('plan');
             const dur = parseInt(urlParams.get('dur'), 10);
             
             await updateUserPlan(user.uid, { plan_name: planName, duration: dur });
             toast.success("Payment verified! Welcome to Premium.", { id: loadingToast });
             
             // Clean URL
             window.history.replaceState(null, '', window.location.pathname);
             setTimeout(() => window.location.reload(), 2000);
          } else {
             toast.error("Payment verification failed at gateway.", { id: loadingToast });
          }
        } catch(e) {
          toast.error("Status check failed.", { id: loadingToast });
        }
      };
      verifyPayment();
    } else if (urlParams.get('code')) {
        toast.error("Payment was not completed.");
    }
  }, [user]);

  const handlePayment = async (plan) => {
    const loadingToast = toast.loading('Connecting to PhonePe Secure Gateway...');
    try {
      const response = await axios.post('/api/phonepe-initiate', {
        plan_name: plan.plan_name,
        price: plan.price,
        duration: plan.duration,
        user_id: user.uid,
        phone: userData?.phone || '9999999999'
      });
      
      if (response.data.url) {
        // Redirect browser entirely to PhonePe
        window.location.href = response.data.url;
      } else {
        toast.error('Gateway failed to provide a checkout URL', { id: loadingToast });
      }
    } catch (error) {
      console.error("Payment API Error:", error.response?.data || error.message);
      const serverError = error.response?.data?.error || 'Could not connect to payment server';
      toast.error(serverError, { id: loadingToast });
    }
  };

  const getFormattedDate = (isoString) => {
      if (!isoString) return 'N/A';
      return new Date(isoString).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-display font-bold mb-8">My Subscription</h1>
      
      {/* Current Plan Card */}
      <div className="glass-card p-6 md:p-8 mb-12 border-l-4 border-l-primary">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Current Status</h2>
        {hasActivePlan() ? (
           <div>
               <div className="flex items-center gap-3 mb-2">
                   <h3 className="text-3xl font-display font-bold text-white">{userData?.plan_type}</h3>
                   {userData?.role === 'admin' && (
                       <span className="bg-danger/20 text-danger border border-danger/50 text-xs px-2 py-1 rounded-full uppercase">Admin Bypass</span>
                   )}
               </div>
               {userData?.role !== 'admin' && (
                   <p className="text-lg text-gray-400 mt-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      Your plan is active and will expire on <strong className="text-white">{getFormattedDate(userData?.plan_expiry)}</strong>
                   </p>
               )}
               {userData?.role === 'admin' && (
                   <p className="text-lg text-gray-400 mt-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      Admins have lifetime access to all features.
                   </p>
               )}
           </div>
        ) : (
           <div>
               <h3 className="text-3xl font-display font-bold text-white mb-2">Free Version</h3>
               <p className="text-lg text-danger mt-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> 
                  You do not have an active premium plan. Premium trading signals are locked!
               </p>
           </div>
        )}
      </div>

      {/* Upgrade Options List */}
      <div className="mb-6 mt-12 pb-2 text-center md:text-left">
           <h2 className="text-2xl font-bold">Upgrade & Extend</h2>
           <p className="text-gray-400">Select a plan to start receiving elite entries and fast targets right now.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          {loadingObj ? (
               <div className="text-center col-span-3">Loading available plans...</div>
          ) : plans.length === 0 ? (
               <div className="col-span-3 text-center text-gray-400">No premium plans available.</div>
          ) : (
               plans.map(plan => (
                 <div key={plan.id} className="glass border border-white/10 rounded-xl p-6 hover:border-primary transition group relative">
                     <h3 className="text-xl font-bold mb-2">{plan.plan_name}</h3>
                     <div className="flex items-end gap-1 mb-4">
                         <span className="text-3xl font-bold">₹{plan.price}</span>
                         <span className="text-gray-400 text-sm mb-1">/{plan.duration} days</span>
                     </div>
                     
                     <ul className="space-y-3 mb-8 text-sm text-gray-300">
                         <li className="flex gap-2 items-start">
                         <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> 
                         Access to all premium calls
                         </li>
                         <li className="flex gap-2 items-start">
                         <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> 
                         Real-time alerts & targets
                         </li>
                         <li className="flex gap-2 items-start">
                         <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> 
                         High accuracy setups
                         </li>
                     </ul>
                     
                     <button 
                         onClick={() => handlePayment(plan)}
                         className="w-full bg-white/10 group-hover:bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition overflow-hidden relative"
                     >
                         <CreditCard className="w-4 h-4" /> Go Premium
                     </button>
                 </div>
               ))
          )}
      </div>
    </div>
  );
};

export default MyPlan;
