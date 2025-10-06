// src/firebase/config.js
/**
 * Inicializa Firebase (Auth + Realtime Database)
 * - Reemplaza firebaseConfig con tus credenciales desde la consola Firebase.
 * - Exporta: app, auth, db (Realtime).
 */

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getDatabase } from "firebase/database";



const app = initializeApp(firebaseConfig);

// Auth con persistencia en AsyncStorage (persistirá sesión)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Realtime database
export const db = getDatabase(app);

export default app;
