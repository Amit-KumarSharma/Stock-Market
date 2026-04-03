import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './config';

// ------------- CALLS -------------

export const addCall = async (callData) => {
  try {
    const docRef = await addDoc(collection(db, 'Calls'), {
      ...callData,
      created_at: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateCallStatus = async (callId, status) => {
  try {
    const callRef = doc(db, 'Calls', callId);
    await updateDoc(callRef, { status });
  } catch (error) {
    throw error;
  }
};

export const deleteCall = async (callId) => {
  try {
    const callRef = doc(db, 'Calls', callId);
    await deleteDoc(callRef);
  } catch (error) {
    throw error;
  }
};

export const getCalls = async () => {
  try {
    const q = query(collection(db, 'Calls'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// ------------- PLANS -------------

export const addPlan = async (planData) => {
  try {
    const docRef = await addDoc(collection(db, 'Plans'), {
      ...planData,
      is_active: true,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updatePlan = async (planId, planData) => {
  try {
    const planRef = doc(db, 'Plans', planId);
    await updateDoc(planRef, planData);
  } catch (error) {
    throw error;
  }
};

export const getPlans = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'Plans'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// ------------- USER HELPERS -------------

export const updateUserPlan = async (userId, planConfig) => {
  try {
    const userRef = doc(db, 'Users', userId);
    
    // Calculate expiry date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + planConfig.duration);
    
    await updateDoc(userRef, {
      plan_type: planConfig.plan_name,
      plan_expiry: currentDate.toISOString(), // Standardizing the format
    });
  } catch (error) {
    throw error;
  }
};

// ------------- BROADCASTS -------------

export const addBroadcast = async (message) => {
  try {
    const docRef = await addDoc(collection(db, 'Broadcasts'), {
      message,
      created_at: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const deleteBroadcast = async (broadcastId) => {
  try {
    const broadcastRef = doc(db, 'Broadcasts', broadcastId);
    await deleteDoc(broadcastRef);
  } catch (error) {
    throw error;
  }
};

export const getBroadcasts = async () => {
  try {
    const q = query(collection(db, 'Broadcasts'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};
