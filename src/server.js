import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, onValue, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD3Nyj6UN_64FKEY-YguEapyvlSMKNYPaE",
    authDomain: "spc-ea23f.firebaseapp.com",
    projectId: "spc-ea23f",
    storageBucket: "spc-ea23f.appspot.com",
    messagingSenderId: "506152064055",
    appId: "1:506152064055:web:c1546bf753777cb177dbb2",
    measurementId: "G-0JX5QE8MEY",
    databaseURL: 'https://spc-ea23f-default-rtdb.europe-west1.firebasedatabase.app/'
  };

class Server{
    app = initializeApp(firebaseConfig);
    auth = getAuth(this.app)
    database = getDatabase();
    refDatabase = ref(this.database);
    analytics = getAnalytics(this.app);
    userCredentials;
    refUser = sessionStorage.getItem('refUser');
    isUserTeacher = sessionStorage.getItem('isUserTeacher');

    logInEmail = async (email, password) => {
        try{
            this.userCredentials =  (await signInWithEmailAndPassword(this.auth, email, password)).user;
            this.refUser = ref(this.database, '/users/' + this.userCredentials.uid);
            sessionStorage.setItem('userCredentials', this.userCredentials);
            sessionStorage.setItem('refUser', this.refUser);

            this.isUserTeacher = await this.getIsUserTeacher();
            sessionStorage.setItem('isUserTeacher', this.isUserTeacher);

            return 'OK';
        }
        catch(e){
            console.log(e);
            return e.code;
        } 
    }

    signUpEmail = async (email, password, name, isTeacher) => {
        try{
            this.userCredentials = (await createUserWithEmailAndPassword(this.auth, email, password)).user;
            this.refUser = ref(this.database, '/users/' + this.userCredentials.uid);
            sessionStorage.setItem('userCredentials', this.userCredentials);
            sessionStorage.setItem('refUser', this.refUser);

            set(this.refUser, {
                fullName: name,
                isTeacher: isTeacher
            });

            this.isUserTeacher = await this.getIsUserTeacher();
            sessionStorage.setItem('isUserTeacher', this.isUserTeacher);

            return 'OK';
        }
        catch(e){
            console.log(e);
            return e.code;
        }
    }

    async getIsUserTeacher(){
        let responce = false;

        try {
            await get(child(this.refUser, '/isTeacher'))
            .then((snapshot) => {
                responce = snapshot.val();
            })
        } catch(e){
            console.log(e);
        }
        
        return responce;
    }

    async getUserName(){
        let responce = 'Full Name';

        try {
            await get(child(this.refUser, '/fullName'))
            .then((snapshot) => {
                responce = snapshot.val();
            })
        } catch(e){
            console.log(e);
        }
        
        return responce;
    }
}

export default new Server();

