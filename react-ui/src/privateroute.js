import React, { Component } from 'react-dom';
import {
    Route,
    Redirect
} from 'react-router-dom'
import { firebaseStore } from './firebase.js';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        firebaseStore.store.signedIn ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
            )
    )} />
)

export default PrivateRoute;