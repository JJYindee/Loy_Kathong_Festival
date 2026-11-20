import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  increment,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { INITIAL_CONTESTANTS } from '../utils/initialData';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION_NAME = 'krathongs';

/**
 * Seed initial 20 krathongs into Firestore if collection is empty
 */
export async function seedInitialKrathongs() {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    if (snap.empty) {
      console.log('Seeding initial 20 krathongs to Firestore...');
      for (const item of INITIAL_CONTESTANTS) {
        await setDoc(doc(db, COLLECTION_NAME, item.id), {
          ...item,
          createdAt: Date.now()
        });
      }
      console.log('Successfully seeded initial krathongs.');
    }
  } catch (err) {
    console.warn('Error checking/seeding Firestore krathongs:', err);
  }
}

/**
 * Subscribe to real-time changes in Krathongs collection
 * @param {Function} onUpdate - callback receiving updated array of krathongs
 * @param {Function} onError - error callback
 * @returns {Function} unsubscribe function
 */
export function subscribeToKrathongs(onUpdate, onError) {
  const q = query(collection(db, COLLECTION_NAME));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort by createdAt or timestamp if present
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onUpdate(items);
    },
    (error) => {
      console.error('Firestore snapshot listener error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Save new Krathong with compressed photo to Firestore
 */
export async function saveKrathongToFirestore(krathongData) {
  const krathongRef = doc(db, COLLECTION_NAME, krathongData.id);
  await setDoc(krathongRef, {
    ...krathongData,
    createdAt: Date.now()
  });
  return krathongData;
}

/**
 * Atomically increment vote in Firestore
 */
export async function incrementVoteInFirestore(krathongId) {
  const krathongRef = doc(db, COLLECTION_NAME, krathongId);
  await updateDoc(krathongRef, {
    votes: increment(1)
  });
}
