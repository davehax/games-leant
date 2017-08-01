import './App.css';
import firebase, { firebaseStore } from './firebase.js';
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.js';
import Header from './Header.js';
import GameViewAllPage, { GameViewSinglePage } from './GameView.js';
import GameEditSinglePage from './GameEdit.js';
import GameNewPage from './GameNew.js';
import LoginPage from './LoginPage.js';

// Our '404' class, I guess
class NoMatch extends Component {
    render() {
        return (
            <div>
                <h1>Uh oh, that's a miss!</h1>
                <p>Unfortunately that URL doesn't point to anything, yet.</p>
                <p>
                    <Link to="/games" className="btn">View all Games Leant</Link>
                </p>
            </div>
        )
    }
}

// Our APP! The big boss, the main man, here's the code to follow
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: !!firebase.auth().currentUser
        }

        this.onAuthStateChanged = this.onAuthStateChanged.bind(this); // not sure if needed?!
        this.getRedirectResultSuccess = this.getRedirectResultSuccess.bind(this);
        this.getRedirectResultError = this.getRedirectResultError.bind(this);        
    }

    componentDidMount() {
        // Result from Redirect auth flow.
        firebase.auth().getRedirectResult()
            .then(this.getRedirectResultSuccess)
            .catch(this.getRedirectResultError);

        // Listening for auth state changes.
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    getRedirectResultSuccess(result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            this.setState({
                accessToken: result.credential.accessToken,
                user: result.user
            });
        } else {
            // somethings gone wrong ? :/
        }
    }

    getRedirectResultError(error) {
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

    render(extra) {
        // Define a state object that mimics React Router 'this.props.location.state'
        let authRedirectState = {
            from: {
                pathname: window.location.pathname
            }
        };

        // If the pathname is equal to '/login' we must prevent a redirect loop by specifying to '/games' instead
        let lPathName = window.location.pathname.toLowerCase();
        if (lPathName === '/login' || lPathName === '/' || lPathName === '') {
            authRedirectState.from.pathname = '/games';
        }

        // App css classes
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
                            {/* Switch between our supported routes */}
                            <Switch>
                                <PrivateRoute path="/games/new" component={GameNewPage} />
                                <PrivateRoute path="/games/:id/edit" component={GameEditSinglePage} /> 
                                <PrivateRoute path="/games/:id" component={GameViewSinglePage} />
                                <PrivateRoute path="/games" component={GameViewAllPage} />
                                <Route path="/login" component={LoginPage} />
                                {/* If no route has been matched, let our users know */}
                                <Route component={NoMatch} />
                            </Switch>
                            
                            {/* force login -- we pass in a custom state object defined above */}
                                <Redirect to={{
                                pathname: '/login',
                                state: authRedirectState
                            }} /> 
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
