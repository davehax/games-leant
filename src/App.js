import React, { Component } from 'react';
import logo from './logo.svg';
import firebase from './firebase.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            currentItem: '',
            items: []
        }

        
    }

    componentDidMount() {}
    componentWillUnmount() {}

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
        </p>
            </div>
        );
    }
}

export default App;
