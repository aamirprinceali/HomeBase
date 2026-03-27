import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your Firebase project config
// See README_SETUP.md for instructions on how to get these values
const firebaseConfig = {
  apiKey: 'AIzaSyD9ElaDICaAdrR3Rh7pp-Sy_bgA3C9xUe4',
  authDomain: 'homebase-bf641.firebaseapp.com',
  projectId: 'homebase-bf641',
  storageBucket: 'homebase-bf641.firebasestorage.app',
  messagingSenderId: '124933169382',
  appId: '1:124933169382:web:668c2aba8e6b7624a11b27',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
