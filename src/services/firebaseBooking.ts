import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_BOOKING_SLOTS } from '@/constants';

const COLLECTION = 'timeslots';

export const getAvailableSlots = async (date: string): Promise<string[]> => {
  if (!db) {
    // eslint-disable-next-line no-console
    console.warn('Firestore not initialized; returning default booking slots.');
    return DEFAULT_BOOKING_SLOTS;
  }

  const ref = doc(db, COLLECTION, date);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data() as { booked?: string[]; slots?: string[] };
    const slots = data.slots || DEFAULT_BOOKING_SLOTS;
    const booked = data.booked || [];
    return slots.filter((s) => !booked.includes(s));
  }
  return DEFAULT_BOOKING_SLOTS;
};

export const bookSlot = async (date: string, time: string) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const ref = doc(db, COLLECTION, date);
  await setDoc(ref, { booked: arrayUnion(time) }, { merge: true });
};

export const cancelSlot = async (date: string, time: string) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const ref = doc(db, COLLECTION, date);
  await setDoc(ref, { booked: arrayRemove(time) }, { merge: true });
};
