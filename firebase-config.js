import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAs4t400Vm9CpSXiSCJOcMwGDEe_eM68nw",
  authDomain: "chaves-pix-consultas.firebaseapp.com",
  projectId: "chaves-pix-consultas",
  storageBucket: "chaves-pix-consultas.firebasestorage.app",
  messagingSenderId: "187535302049",
  appId: "1:187535302049:web:346f03cb35acfb5c26ffe0"
};

export const app = initializeApp(firebaseConfig);