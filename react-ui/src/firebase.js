import firebase from 'firebase';
// Initialize Firebase
const config = {
    apiKey: "AIzaSyD_7WZOHBwP38eNWEyvAaMRldlSPCml1_Q",
    authDomain: "cruddy-bbc56.firebaseapp.com",
    databaseURL: "https://cruddy-bbc56.firebaseio.com",
    projectId: "cruddy-bbc56",
    storageBucket: "cruddy-bbc56.appspot.com",
    messagingSenderId: "889081571259"
};

firebase.initializeApp(config);

// noob store before learning redux
class _firebaseStore {
    constructor() {
        // this.store = this._getStore();
        this.resetAll();
    }

    _getStore() {
        return {
            signedIn: false,
            user: null
        };
    }

    setUser(user) {
        this.store.user = user;
        this.store.signedIn = true;
    }

    resetAll() {
        this.store = this._getStore();
    }

    // some helpers
    getItemsPrefix() {
        if (this.store.user !== null) {
            return `games_${this.store.user.uid}`;
        }
        else {
            return '';
        }
    }

    toggleSignIn() {
        if (!firebase.auth().currentUser) {
            // Create Google Authentication provider
            var provider = new firebase.auth.GoogleAuthProvider();
            // Add provider scope
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            // Sign in
            firebase.auth().signInWithRedirect(provider);
        } else {
            // Sign out
            firebase.auth().signOut();
        }
    }
}

const firebaseStore = new _firebaseStore();

// export!
export default firebase;
export { firebaseStore };