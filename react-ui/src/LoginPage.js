import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase, { firebaseStore } from './firebase.js';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: firebaseStore.store.user !== null
        }
    }

    componentDidMount() {
        // Wait for FireBase to async login
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebaseStore.setUser(user);
                this.setState({
                    isAuthenticated: true
                });
            }
            else {
                firebaseStore.resetAll();
                this.setState({
                    isAuthenticated: false
                });
            }
        });
    }

    // componentWillUnmount() {

    // }

    render(extra) {
        const { from } = this.props.location.state || { from: { pathname: '/games' } };

        if (this.state.isAuthenticated) {
            return (
                <Redirect to={from} />
            )
        }
        
        return (
            <span>Please login</span>
        )
    }
}

export default LoginPage