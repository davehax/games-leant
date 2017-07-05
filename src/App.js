import React, { Component } from 'react';
// import logo from './logo.svg';
import firebase from './firebase.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            accessToken: '',
            signedIn: false,
            currentItem: '',
            items: [],
            hasError: false,
            error: null
        }

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.onAuthStateChanged = this.onAuthStateChanged.bind(this); // not sure if needed?!

        this.getRedirectResultSuccess = this.getRedirectResultSuccess.bind(this);
        this.getRedirectResultError = this.getRedirectResultError.bind(this);

        // Result from Redirect auth flow.
        // [START getidptoken]
        firebase.auth().getRedirectResult()
            .then(this.getRedirectResultSuccess)
            .catch(this.getRedirectResultError);
        // [END getidptoken]


        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    getRedirectResultSuccess(result) {
        console.log(result.user);
        if (result.credential) {
            this.setState({
                accessToken: result.credential.accessToken,
                user: result.user
            });
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // [START_EXCLUDE]
            // document.getElementById('quickstart-oauthtoken').textContent = token;
        } else {
            // document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]
            // somethings gone wrong ? :/
        }
        // The signed-in user info.
        // var user = result.user;
    }

    getRedirectResultError(error) {
        // Handle Errors here.
        var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]

        this.setState({
            hasError: true,
            error: error
        });
    }

    onAuthStateChanged(user) {
        if (user) {
            this.setState({
                signedIn: true,
                user: user
            })

            // User is signed in.
            // var displayName = user.displayName;
            // var email = user.email;
            // var emailVerified = user.emailVerified;
            // var photoURL = user.photoURL;
            // var isAnonymous = user.isAnonymous;
            // var uid = user.uid;
            // var providerData = user.providerData;
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            // document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            // [END_EXCLUDE]
        } else {
            this.setState({
                signedIn: false,
                user: null
            });
            // User is signed out.
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            // document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
            // document.getElementById('quickstart-account-details').textContent = 'null';
            // document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]
        }
    }

    signIn() {

    }

    signOut() {

    }

    toggleSignIn() {
        if (!firebase.auth().currentUser) {
            // [START createprovider]
            var provider = new firebase.auth.GoogleAuthProvider();
            // [END createprovider]
            // [START addscopes]
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            // [END addscopes]
            // [START signin]
            firebase.auth().signInWithRedirect(provider);
            // [END signin]
        } else {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
        }
    }

    componentDidMount() { }
    componentWillUnmount() { }

    render() {
        return (
            <div className="App">
                <h1>Games Leant</h1>
                <button onClick={this.toggleSignIn}>{this.state.signedIn ? 'Sign out' : 'Sign in with Google'}</button>
            </div>
        );
    }
}

export default App;
