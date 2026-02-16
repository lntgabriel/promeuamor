// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCArO7kYnABuaEN4688Viv7OuOkBC-N6cw",
  authDomain: "prapessoaquemaisamo.firebaseapp.com",
  projectId: "prapessoaquemaisamo",
  storageBucket: "prapessoaquemaisamo.firebasestorage.app",
  messagingSenderId: "391716685885",
  appId: "1:391716685885:web:0fe6578b996d37a24cc254"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// AQUI ESTÁ O SEGREDO: precisa ter a palavra "export" antes!
export const db = getFirestore(app);
