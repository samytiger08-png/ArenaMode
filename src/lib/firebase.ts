// Firebase config and helpers for Firestore database connection
import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order } from '../types';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

export async function fetchOrdersFromFirebase(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    const list: Order[] = [];
    snapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id } as Order);
    });
    
    // Sort in memory by createdAt descending
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (list.length === 0) {
      // Seed initial orders so the database has something on first launch
      const { INITIAL_ORDERS } = await import('../data');
      for (const ord of INITIAL_ORDERS) {
        await saveOrderToFirebase(ord);
        list.push(ord);
      }
      // Re-sort just in case
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  } catch (err) {
    console.error("Error fetching orders from Firebase:", err);
    return [];
  }
}

export async function saveOrderToFirebase(order: Order): Promise<void> {
  try {
    const cleanOrder = { ...order };
    await setDoc(doc(db, 'orders', order.id), cleanOrder);
    console.log(`Order ${order.id} saved to Firebase successfully.`);
  } catch (err) {
    console.error(`Error saving order ${order.id} to Firebase:`, err);
    throw err;
  }
}

export async function updateOrderInFirebase(orderId: string, updatedFields: Partial<Order>): Promise<void> {
  try {
    const orderDoc = doc(db, 'orders', orderId);
    await updateDoc(orderDoc, updatedFields);
    console.log(`Order ${orderId} updated in Firebase successfully.`);
  } catch (err) {
    console.error(`Error updating order ${orderId} in Firebase:`, err);
    throw err;
  }
}

export async function deleteOrderFromFirebase(orderId: string): Promise<void> {
  try {
    const orderDoc = doc(db, 'orders', orderId);
    await deleteDoc(orderDoc);
    console.log(`Order ${orderId} deleted from Firebase successfully.`);
  } catch (err) {
    console.error(`Error deleting order ${orderId} from Firebase:`, err);
    throw err;
  }
}
