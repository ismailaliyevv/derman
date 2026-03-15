// ╔══════════════════════════════════════════════════╗
// ║  Firebase konfiqurasiyası                         ║
// ║  console.firebase.google.com → Layihə → Ayarlar  ║
// ╚══════════════════════════════════════════════════╝
const firebaseConfig = {
  apiKey:            "BURAYA_API_KEY",
  authDomain:        "BURAYA.firebaseapp.com",
  projectId:         "BURAYA_PROJECT_ID",
  storageBucket:     "BURAYA.appspot.com",
  messagingSenderId: "BURAYA_SENDER_ID",
  appId:             "BURAYA_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
