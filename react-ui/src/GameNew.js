import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase, { firebaseStore } from './firebase.js';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import clone from 'clone';
import { getItemFromStateItem } from './Util.js';
let moment = require('moment');

// Game new page
class GameNewPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemsRef: null,
            hasSaved: false
        }

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        if (firebaseStore.store.signedIn) {
            let itemsPrefix = firebaseStore.getItemsPrefix();
            let itemsRef = firebase.database().ref(itemsPrefix);

            this.setState({
                itemsRef: itemsRef
            });
        }
    }

    componentWillUnmount() {
        if (this.state.itemsRef !== null) {
            // need to remove any handlers? do so here
        }
    }

    add(item) {
        if (this.state.itemsRef !== null) {
            this.state.itemsRef.push(getItemFromStateItem(item)).then(() => {
                this.setState({
                    hasSaved: true
                })
            });
        }
    }

    render() {
        return (
            <div>
                {this.state.hasSaved ? (
                    <Redirect to="/games" />
                ) : (
                        <GameNew history={this.props.history} save={this.add} />
                    )}
            </div>
        )
    }
}

// Game new 
class GameNew extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: {
                game: '',
                person: '',
                platform: '',
                dateLeant: null,
                dateReturned: null
            }
        }

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Handle the change of an input field
    handleChange(e) {
        e.persist(); // persist the synthetic event so we can access e.target -- still unsure why this is needed
        this.setState((prevState) => {
            prevState.item[e.target.name] = e.target.value;
            return prevState;
        });
    }

    // save
    save(e) {
        e && e.preventDefault();
        let item = clone(this.state.item);
        item.created = new moment();
        this.props.save(item);
    }

    render() {
        let className = ['game', 'game--new'];

        return (
            <div className={className.join(' ')}>
                <form onSubmit={this.add}>
                    <h3 className="game--title">{this.state.item.game}</h3>
                    <div className="game--edit-container">
                        <h3>New Item</h3>
                        {/* GAME  */}
                        <div className="game--edit-item">
                            <label>
                                <span>Game</span>
                                <input name="game" type="text" value={this.state.item.game} onChange={this.handleChange} required />
                            </label>
                        </div>

                        {/* PERSON  */}
                        <div className="game--edit-item">
                            <label>
                                <span>Person</span>
                                <input name="person" type="text" value={this.state.item.person} onChange={this.handleChange} required />
                            </label>
                        </div>

                        {/* PLATFORM  */}
                        <div className="game--edit-item">
                            <label>
                                <span>Platform</span>
                                <input name="platform" type="text" value={this.state.item.platform} onChange={this.handleChange} required />
                            </label>
                        </div>

                        {/* DATE LEANT  */}
                        <div className="game--edit-item">
                            <label>
                                <span>Date Leant</span>
                                <SingleDatePicker
                                    id="DateLeant"
                                    date={this.state.item.dateLeant}
                                    onDateChange={(date) => this.setState((prevState) => {
                                        prevState.item.dateLeant = date;
                                        return prevState;
                                    })}
                                    focused={this.state.dateLeantFocused}
                                    onFocusChange={({ focused }) => this.setState({ dateLeantFocused: focused })}
                                    displayFormat='DD/MM/YYYY'
                                    isOutsideRange={() => false}
                                    numberOfMonths={1}
                                    required={true}
                                    showClearDate={true}
                                />
                            </label>
                        </div>

                        {/* DATE RETURNED  */}
                        <div className="game--edit-item">
                            <label>
                                <span>Date Returned</span>
                                <SingleDatePicker
                                    id="DateReturned"
                                    date={this.state.item.dateReturned}
                                    onDateChange={(date) => this.setState((prevState) => {
                                        prevState.item.dateReturned = date;
                                        return prevState;
                                    })}
                                    focused={this.state.dateReturnedFocused}
                                    onFocusChange={({ focused }) => this.setState({ dateReturnedFocused: focused })}
                                    isOutsideRange={() => false}
                                    numberOfMonths={1}
                                    required={false}
                                    showClearDate={true}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="game--toolbar cf">
                        <div className="pull-right">
                            <button onClick={this.props.history.goBack} className="btn">Cancel</button>
                            <button onClick={this.save} className="btn btn--green">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default GameNewPage;