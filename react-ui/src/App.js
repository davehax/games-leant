import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import PrivateRoute from './privateroute.js';
import firebase, { firebaseStore } from './firebase.js';
import './App.css';
import { GameViewAllPage, GameViewSinglePage, GameEditSinglePage, GameNewPage } from './Game.js';
// import Profile from './Profile.js';
import Header from './Header.js';
let moment = require('moment');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: !!firebase.auth().currentUser
        }

        this.onAuthStateChanged = this.onAuthStateChanged.bind(this); // not sure if needed?!
        this.getRedirectResultSuccess = this.getRedirectResultSuccess.bind(this);
        this.getRedirectResultError = this.getRedirectResultError.bind(this);

        // Result from Redirect auth flow.
        firebase.auth().getRedirectResult()
            .then(this.getRedirectResultSuccess)
            .catch(this.getRedirectResultError);

        // Listening for auth state changes.
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    getRedirectResultSuccess(result) {
        console.log('Getting redirect result - success');
        console.log(result);
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            this.setState({
                accessToken: result.credential.accessToken,
                user: result.user
            });
        } else {
            // somethings gone wrong ? :/
        }
        // The signed-in user info.
        // var user = result.user;
    }

    getRedirectResultError(error) {
        console.log('Getting redirect result - error');
        // Handle Errors here.
        var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;

        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }

        this.setState({
            hasError: true,
            error: error
        });
    }

    onAuthStateChanged(user) {
        console.log('Auth state changed');
        if (user) {
            firebaseStore.setUser(user);

            this.setState({
                signedIn: true
            });

        } else {
            firebaseStore.resetAll();

            // User is signed out.
            this.setState({
                signedIn: false
            });
        }
    }

    toggleSignIn() {
        firebaseStore.toggleSignIn();
    }

    render() {
        let appClass = ['App'];
        if (this.state.signedIn) {
            appClass.push('App--signedin');
        }
        return (
            <BrowserRouter>
                <div className={appClass.join(' ')}>
                    <Header toggleSignIn={this.toggleSignIn} signedIn={this.state.signedIn} user={firebaseStore.store.user} />
                    <div className="App-body">
                        <div className="App-items">
                            {this.state.signedIn ? (
                                <div>
                                    <Switch>
                                        <Route path="/games/new" component={GameNewPage} />
                                        <Route path="/games/:id/edit" component={GameEditSinglePage} /> 
                                        <Route path="/games/:id" component={GameViewSinglePage} />
                                        <Route path="/games" component={GameViewAllPage} />
                                    </Switch>
                                    <Redirect to="/games" />
                                </div>
                            ) : (
                                <Redirect to="/" />
                            )}
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
