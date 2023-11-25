import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, onValue, ref, remove, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAxveigxfxYbu9ZuN7BUXxY2o-mVwtcbi0",
    authDomain: "vedaj-631f5.firebaseapp.com",
    databaseURL: "https://vedaj-631f5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vedaj-631f5",
    storageBucket: "vedaj-631f5.appspot.com",
    messagingSenderId: "619328524013",
    appId: "1:619328524013:web:0392f099a030c8b0ed46e4"
  };

class Server{
    app = initializeApp(firebaseConfig);
    auth = getAuth(this.app)
    database = getDatabase();
    refDatabase = ref(this.database);
    analytics = getAnalytics(this.app);
    userCredentials;
    uid;
    refUser;
    isUserTeacher;
    userName;
    activeRoomCode;
    refActiveRoom;
    roomData;

    logInEmail = async (email, password) => {
        try{
            email = email.trim();
            password = password.trim();

            this.userCredentials = (await signInWithEmailAndPassword(this.auth, email, password)).user;
            this.uid = this.userCredentials.uid;
            this.refUser = ref(this.database, '/users/' + this.uid);
            sessionStorage.setItem('refUser', this.refUser);
            sessionStorage.setItem('userCredentials', this.userCredentials);
            sessionStorage.setItem('uid', this.userCredentials.uid);

            this.isUserTeacher = await this.getIsUserTeacher();
            sessionStorage.setItem('isUserTeacher', this.isUserTeacher);

            this.userName = await this.getUserName();
            sessionStorage.setItem('userName', this.userName);

            return 'OK';
        }
        catch(e){
            console.log(e);
            return e.code;
        } 
    }

    signUpEmail = async (email, password, name, isTeacher) => {
        try{
            email = email.trim();
            name = name.trim();
            password = password.trim();

            this.userCredentials = (await createUserWithEmailAndPassword(this.auth, email, password)).user;
            this.uid = this.userCredentials.uid;
            this.refUser = ref(this.database, '/users/' + this.userCredentials.uid);
            sessionStorage.setItem('userCredentials', this.userCredentials);
            sessionStorage.setItem('uid', this.uid);
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
            });
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
                this.userName = responce;
            })
        } catch(e){
            console.log(e);
        }
        
        return responce;
    }

    async createRoom(code){
        try{
            code = code.trim();
            let isInUse = false;

            await get(child(this.refDatabase, `/rooms/${code}`))
            .then(snapshot => {
                if(snapshot.val() !== null && (new Date().getTime() - snapshot.val().creationDate <= 7200000 && snapshot.val().teacherName !== this.userName)){
                    isInUse = true;
                    return 'CODE IN USE';
                }
            });

            if(isInUse === true)
                return 'CODE IN USE';

            set(ref(this.database, `/rooms/${code}`), {
                code: code,
                teacherName: await this.userName,
                creationDate: new Date().getTime()
            })

            this.activeRoomCode = code;
            this.refActiveRoom = ref(this.database, '/rooms/'+code);
            
            this.roomData = await this.getRoomData();
            sessionStorage.setItem('roomData', this.roomData)

            this.subscribeOnRoomChanges((data) => {
                this.roomData = data;
                sessionStorage.setItem('roomData', data)
            });

            sessionStorage.setItem('activeRoomCode', this.activeRoomCode);
            sessionStorage.setItem('refActiveRoom', this.refActiveRoom);

            return 'OK';
        } catch(e){
            console.log(e);
        }
    }

    async joinRoom(code='error'){
        try{
            code = code.trim();

            let isInUse = true;

            await get(child(this.refDatabase, `/rooms/${code}`))
            .then(snapshot => {
                const data = snapshot.val();

                if(data === null){
                    isInUse = false;
                }
            });

            if(isInUse === false)
                return "THE CODE ISNT IN USE";

            this.activeRoomCode = code;
            this.refActiveRoom = ref(this.database, '/rooms/'+code);
            sessionStorage.setItem('activeRoomCode', this.activeRoomCode);
            sessionStorage.setItem('refActiveRoom', this.refActiveRoom);
    
            this.roomData = await this.getRoomData();
            sessionStorage.setItem('roomData', this.roomData)
    
            this.subscribeOnRoomChanges((data) => {
                this.roomData = data;
                sessionStorage.setItem('roomData', data)
            });
    
            return 'OK';
        } catch(e){
            console.log(e);
            return e;
        }
    }

    async getRoomData(){
        try{
            await get(child(this.refDatabase, `/rooms/${this.activeRoomCode}`))
            .then((snapshot) => {
                const data = snapshot.val();
    
                return data;
            });
        } catch(e){
            console.log(e);

            return {
                code: 'Error',
                teacherName: 'Error'
            }
        }
    }

    subscribeOnRoomChanges(onChange=(data)=>{}){
        try{
            onValue(child(this.refDatabase, `/rooms/${this.activeRoomCode}`), (snapshot) => {
                const data = snapshot.val();
    
                onChange(data);
            });
        } catch(e){
            console.log(e);
        }
    }

    async dissolveRoom(){
        try{
            remove(child(this.refDatabase, `/rooms/${this.activeRoomCode}`));

            sessionStorage.removeItem('activeRoomCode');
            sessionStorage.removeItem('refActiveRoom');
        } catch(e){
            console.log(e);
        }
    }

    async createTest(title='Empty title', questions=[]){
        try{
            let tests = [];

            await get(child(this.database, `/users/${this.uid}/materials`))
            .then(snapshot => {
                const data = snapshot.val();

                data === null
                ? tests = []
                : tests = data;
            });

            tests.push({
                fileTitle: title,
                questions: questions
            });

            set(ref(this.database, `/users/${this.uid}/tests`), tests);
        } catch(e){
            console.log(e);
        }
    }

    async useTest(title){
        try{
            let test = null;
            let usedTests = [];

            await get(child(this.refDatabase, `/users/${this.uid}/tests`))
            .then(snapshot => {
                const data = snapshot.val();

                if(data !== null && data !== undefined){
                    data.forEach(currentTest => {
                       if(currentTest.title === title)
                            test = currentTest;
                    });
                }
            });

            await get(child(this.refDatabase, `/rooms/${this.activeRoomCode}/tests`))
            .then(snapshot => {
                const data = snapshot.val();

                if(data !== null && data !== undefined){
                    usedTests = data;
                }
            });

            usedTests.push(test);

            set(ref(this.database, `/rooms/${this.activeRoomCode}/tests/`), usedTests);
        } catch(e){
            console.log(e);
        }
    }

    async unpublishTest(title=''){
        try{
            let usedTests = [];

            await get(child(this.refDatabase, `/rooms/${this.activeRoomCode}/tests`))
            .then(snapshot => {
                const data = snapshot.val();

                usedTests = data;

                usedTests = usedTests.filter(test => test.title !== title);
            });

            set(ref(this.database, `/rooms/${this.activeRoomCode}/tests/`), usedTests);
        } catch(e){
            console.log(e);
        }
    }

    async getTests(){
        try{
            await get(child(this.refDatabase, `/rooms/${this.activeRoomCode}/tests`))
            .then(snapshot => {
                const data = snapshot.val();
    
                if(data === null){
                    return [];
                } else {
                    return data;
                }
            });
        } catch(e){
            console.log(e);
            return [];
        }
    }

    async createMaterial(title='Untitled', description=null, image=null){
        try{
            let materials = [];

            await get(child(this.refDatabase, `/users/${this.uid}/materials`))
            .then(snapshot => {
                const data = snapshot.val();

                data === null
                ? materials = []
                : materials = data;
            })

            materials.push({
                title: title,
                description: description,
                image: image
            });

            set(ref(this.database, `/users/${this.uid}/materials`), materials);
        } catch(e){
            console.log(e);
        }
    }

    async useMaterial(title){
        try{
            let material = null;
            let usedMaterials = [];

            await get(child(this.refDatabase, `/users/${this.uid}/materials`))
            .then(snapshot => {
                const data = snapshot.val();

                if(data !== null && data !== undefined){
                    data.forEach(currentMaterial => {
                       if(currentMaterial.title === title)
                            material = currentMaterial;
                    });
                }
            });

            await get(child(this.refDatabase, `/rooms/${this.activeRoomCode}/materials`))
            .then(snapshot => {
                const data = snapshot.val();

                if(data !== null && data !== undefined){
                    usedMaterials = data;
                }
            });

            usedMaterials.push(material);

            set(ref(this.database, `/rooms/${this.activeRoomCode}/materials/`), usedMaterials);
        } catch(e){
            console.log(e);
        }
    }

    async unpublishMaterial(title=''){
        try{
            let usedMaterials = [];

            await get(child(this.refDatabase, `/rooms/${this.activeRoomCode}/materials`))
            .then(snapshot => {
                const data = snapshot.val();

                usedMaterials = data;

                usedMaterials = usedMaterials.filter(material => material.title !== title);
            });

            set(ref(this.database, `/rooms/${this.activeRoomCode}/materials/`), usedMaterials);
        } catch(e){
            console.log(e);
        }
    }

    getUserMaterials = new Promise((resolve, reject) => {
        try{
            get(child(this.refDatabase, `/users/${this.uid}/materials`))
            .then(snapshot => {
                const data = snapshot.val();

                if(data === null){
                    resolve([]);
                } else {
                    resolve(data);
                }
            });
        } catch(e){
            console.log(e);
            reject(e);
        }
    });
}

export default new Server();
