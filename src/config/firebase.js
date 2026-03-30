import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
  persistence: Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
