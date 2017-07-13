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

// export!
export default firebase;