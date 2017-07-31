import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase, { firebaseStore } from './firebase.js';

// // Result from Redirect auth flow.
// firebase.auth().getRedirectResult()
//     .then(this.getRedirectResultSuccess)
//     .catch(this.getRedirectResultError);

// // Listening for auth state changes.
// firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

// const onAuthStateChanged = (user) => {
//     console.log('Auth state changed');
//     if (user) {
//         firebaseStore.setUser(user);

//         ReactDOM.render(<App signedIn={true} />, document.getElementById('root'));

//     } else {
//         firebaseStore.resetAll();

//         ReactDOM.render(<App signedIn={false} />, document.getElementById('root'));
//     }
// }

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
