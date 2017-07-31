import React, { Component } from 'react';
import Profile from './Profile.js';

class Header extends Component {
    render() {
        return (
            <div className="App-authorisation">
                <div className="App-body cf">
                    <div className="pull-left">
                        <h1>Games Leant</h1>
                    </div>
                    <div className="pull-right">
                        { this.props.signedIn && (
                            <Profile displayName={this.props.user.displayName} photoUrl={this.props.user.photoURL} photoAlt={this.props.user.displayName} />
                        ) }
                        <button className="btn" onClick={this.props.toggleSignIn}>{this.props.signedIn ? 'Sign out' : 'Sign in with Google'}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;