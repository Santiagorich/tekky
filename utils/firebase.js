import { getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBvnhh1tfalJo2a4llWcRKq4u8-zuoDP80",
    authDomain: "tekky-dd9c7.firebaseapp.com",
    projectId: "tekky-dd9c7",
    storageBucket: "tekky-dd9c7.appspot.com",
    messagingSenderId: "687067575293",
    appId: "1:687067575293:web:a9539014646e6634c7df94",
    measurementId: "G-CP91C3HKYZ"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore();