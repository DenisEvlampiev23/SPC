import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBJKKSs62LUAhbd1jVTZur_olqJMSuAYi8",
  authDomain: "science-practical-conference.firebaseapp.com",
  projectId: "science-practical-conference",
  storageBucket: "science-practical-conference.appspot.com",
  messagingSenderId: "476439233165",
  appId: "1:476439233165:web:f4b3a4941ed7b3397cd8c4",
  measurementId: "G-M5D8Q81YQQ"
};


class Server{
    app = initializeApp(firebaseConfig);
    auth = getAuth(this.app)
    analytics = getAnalytics(this.app);
}

export default new Server();

