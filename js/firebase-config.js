// ╔══════════════════════════════════════════════════╗
// ║  Firebase konfiqurasiyası                         ║
// ║  console.firebase.google.com → Layihə → Ayarlar  ║
// ╚══════════════════════════════════════════════════╝
const firebaseConfig = {
  apiKey: "AIzaSyCfQcSQRzkMEPatTOeJ5on9eVPKZSywbHc",
  authDomain: "derman-2ba9b.firebaseapp.com",
  projectId: "derman-2ba9b",
  storageBucket: "derman-2ba9b.firebasestorage.app",
  messagingSenderId: "957997391368",
  appId: "1:957997391368:web:81bc206b88923b8da5bbbd",
  measurementId: "G-PF5SM3BSR8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
