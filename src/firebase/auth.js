import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

// Sign Up
export const registerUser = async (name, phone, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'Users', user.uid), {
      name,
      phone,
      email,
      role: 'user',
      plan_type: null,
      plan_expiry: null
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Log In
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Google Auth
export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, 'Users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create document if new user
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        phone: null,
        role: 'user',
        plan_type: null,
        plan_expiry: null
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Log Out
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Reset Password
export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};
