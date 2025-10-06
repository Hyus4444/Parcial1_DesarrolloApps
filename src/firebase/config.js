
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyB8JLIio4kquywzLVv3NVInDOFqPZLNRjg",
  authDomain: "recetasapp2025.firebaseapp.com",
  databaseURL: "https://recetasapp2025-default-rtdb.firebaseio.com",
  projectId: "recetasapp2025",
  storageBucket: "recetasapp2025.firebasestorage.app",
  messagingSenderId: "285175978309",
  appId: "1:285175978309:web:0ad26f2fe61f8c3c5e062c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
