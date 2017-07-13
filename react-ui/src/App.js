import React, { Component } from 'react';
import firebase from './firebase.js';
import './App.css';
import Game from './Game.js';
import Profile from './Profile.js';
let moment = require('moment');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            accessToken: '',
            signedIn: false,
            currentItem: '',
            items: [],
            itemsRef: null,
            refKeyBase: '',
            hasError: false,
            error: null
        }

        this.onAuthStateChanged = this.onAuthStateChanged.bind(this); // not sure if needed?!
        this.getRedirectResultSuccess = this.getRedirectResultSuccess.bind(this);
        this.getRedirectResultError = this.getRedirectResultError.bind(this);

        this.addItem = this.addItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.removeItem = this.removeItem.bind(this);

        // Result from Redirect auth flow.
        firebase.auth().getRedirectResult()
            .then(this.getRedirectResultSuccess)
            .catch(this.getRedirectResultError);

        // Listening for auth state changes.
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    getRedirectResultSuccess(result) {
        console.log(result.user);
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
            console.log('if (user) {...}')
            

            // User is signed in.
            // var displayName = user.displayName;
            // var email = user.email;
            // var emailVerified = user.emailVerified;
            // var photoURL = user.photoURL;
            // var isAnonymous = user.isAnonymous;
            // var uid = user.uid;
            // var providerData = user.providerData;

            // Connect to FireBase 'Items'
            const refKey =  `games_${user.uid}`;
            let itemsRef = firebase.database().ref(refKey);

            // .on('value', func) will trigger as soon as the event handler is bound, 
            // and when any additional updates are made to 'Items'
            itemsRef.on('value', (snapshot) => {
                let items = snapshot.val();
                let newState = [];

                // let's see!
                console.log(snapshot.val());

                for (let item in items) {
                    let obj = {
                        id: item,
                        created: items[item].created,
                        modified: items[item].modified,
                        game: items[item].game,
                        person: items[item].person,
                        platform: items[item].platform,
                        dateLeant: items[item].dateLeant,
                        dateReturned: items[item].dateReturned
                    };

                    obj.dateLeant = this.toMoment(obj.dateLeant);
                    obj.dateReturned = this.toMoment(obj.dateReturned);

                    newState.push(obj);
                }

                newState = newState.sort((a, b) => {
                    return new moment(a.created) < new moment(b.created)
                });

                this.setState({
                    items: newState
                });
            });

            // Update state with signedIn, user and itemsRef
            this.setState({
                signedIn: true,
                user: user,
                itemsRef: itemsRef,
                refKeyBase: refKey
            });

        } else {

            // Unbind our event handler
            if (typeof(this.state.itemsRef) !== 'undefined' && this.state.itemsRef !== null) {
                this.state.itemsRef.off('value');
            }

            // User is signed out.
            this.setState({
                signedIn: false,
                user: null,
                items: [],
                itemsRef: null,
                refKeyBase: ''
            });
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

    addItem(item) {
        this.state.itemsRef.push(item);
    }

    editItem(item) {
        const itemRef = this.state.itemsRef.child(item.id);
        itemRef.update(item);
    }

    removeItem(item) {
        const itemRef = this.state.itemsRef.child(item.id);
        itemRef.remove();
    }

    toMoment(val) {
        if (typeof(val) !== 'undefined') {
            return new moment(new Date(val));
        }
        return null;
    }

    componentDidMount() { }
    componentWillUnmount() { }

    render() {
        let appClass = ['App'];
        if (this.state.signedIn) {
            appClass.push('App--signedin');
        }
        return (
            <div className={appClass.join(' ')}>
                <div className="App-authorisation">
                    <div className="App-body cf">
                        <div className="pull-left">
                            <h1>Games Leant</h1>
                        </div>
                        <div className="pull-right">
                            { this.state.signedIn && (
                                <Profile displayName={this.state.user.displayName} photoUrl={this.state.user.photoURL} photoAlt={this.state.user.displayName} />
                            ) }
                            <button className="btn" onClick={this.toggleSignIn}>{this.state.signedIn ? 'Sign out' : 'Sign in with Google'}</button>
                        </div>
                    </div>
                </div>
                <div className="App-body">
                    <div className="App-items">
                    {
                        this.state.signedIn && (
                            <Game isNew={true} isEditing={true} onSave={this.addItem} /> 
                        )
                    }
                    {
                        this.state.signedIn ? (
                            this.state.items.map((item) => {
                                return <Game key={item.id} item={item} isNew={false} isEditing={false} onSave={this.editItem} onDelete={this.removeItem} />
                            })
                        ) : (
                            <p>Please sign in to view items.</p>
                        )
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
