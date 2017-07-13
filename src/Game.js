import React, { Component } from 'react';
// import firebase from './firebase.js';
// import { Form, Field } from 'simple-react-forms';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
// let clone = require('clone');
import clone from 'clone';
let moment = require('moment');

class Game extends Component {
    constructor(props) {
        super(props);

        console.log(props);
        console.log(this.props);

        // Define our item model
        // let item = typeof (this.props.item) !== 'undefined' ? this.props.item : this.getGameModel();
        let item = this.getGameModel();
        if (typeof (this.props.item) !== 'undefined') {
            item = clone(this.props.item);
        }

        // Define our initial state
        this.state = {
            isEditing: this.props.isEditing,
            isEnteringEditing: true,
            item: item
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getItemFromState = this.getItemFromState.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /** Lifecycle functions **/

    componentDidMount() {}
    componentDidUpdate() {
        if (this.state.isEnteringEditing && this.state.isEditing) {
            this.refs.game.focus();
            this.setState({ isEnteringEditing: false });
        }
    }
    componentWillUnmount() {}

    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /** Class functions **/

    // Get an empty Game item
    getGameModel() {
        return {
            created: new moment(),
            modified: new moment(),
            game: '',
            person: '',
            platform: '',
            dateLeant: null,
            dateReturned: null
        }
    }

    // For data entry, we must convert some state properties into a new form
    getItemFromState() {
        let item = {
            created: new moment(this.state.item.created).toISOString(),
            modified: new moment().toISOString(),
            game: this.state.item.game,
            person: this.state.item.person,
            platform: this.state.item.platform,
            dateLeant: this.state.item.dateLeant === null ? null : this.state.item.dateLeant.toISOString(),
            dateReturned: this.state.item.dateReturned === null ? null : this.state.item.dateReturned.toISOString()
        }

        if (typeof (this.state.item.id) !== 'undefined') {
            item.id = this.state.item.id;
        }

        return item;
    }

    // start editing the current item
    startEdit(e) {
        e.preventDefault();
        this.setState({
            isEnteringEditing: true,
            isEditing: true
        });
    }

    cancelEdit(e) {
        e.preventDefault();
        // need to reset state
        this.setState({
            item: this.props.item,
            isEnteringEditing: false,
            isEditing: false
        });
    }

    // Handle the change of an input field
    handleChange(e) {
        e.persist(); // persist the synthetic event so we can access e.target -- still unsure why this is needed
        this.setState((prevState) => {
            prevState.item[e.target.name] = e.target.value;
            return prevState;
        });
    }

    // Handle 'save' button click
    handleSubmit(e) {
        e.preventDefault();

        // Pass data back up to a higher level
        this.props.onSave(this.getItemFromState());

        // wipe state if isNew === true
        if (this.props.isNew) {
            this.setState({ item: this.getGameModel() });
        }
        // otherwise leave editing mode
        else {
            this.setState({ 
                isEnteringEditing: false,
                isEditing: false
            });
        }
    }

    // Handle 'delete' button click
    handleDelete(e) {
        e.preventDefault();

        if (typeof (this.props.onDelete) === 'function') {
            if (window.confirm("This will permanently delete the item. Please confirm you wish to delete this item.")) {
                this.props.onDelete(this.getItemFromState());
            }
        }
    }

    render() {
        let cssClass = ["game-item"];

        if (this.props.isNew) {
            cssClass.push('is-new');
        }

        if (this.state.isEditing) {
            cssClass.push('is-editing');
        }



        return (
            // Our container
            <div className={cssClass.join(' ')}>
                <div className="game-item--title game-item--padding">
                    <h2>{this.props.isNew ? "Add a new item" : this.state.item.game }</h2>
                </div>
                {/* Form to hold our game item */}
                <form onSubmit={this.handleSubmit}>
                    <div className="game-item--padding">
                        {/* Game */}
                        <div className="game-item--data-row">
                            <label>
                                <span className="game-item--label">Game:</span>
                                <input type="text" name="game" ref="game" className="input" onChange={this.handleChange} value={this.state.item.game} disabled={!this.state.isEditing} />
                            </label>
                        </div>

                        {/* Person */}
                        <div className="game-item--data-row">
                            <label>
                                <span className="game-item--label">Person:</span>
                                <input type="text" name="person" className="input" onChange={this.handleChange} value={this.state.item.person} disabled={!this.state.isEditing} />
                            </label>
                        </div>

                        {/* Platform */}
                        <div className="game-item--data-row">
                            <label>
                                <span className="game-item--label">Platform:</span>
                                <input type="text" name="platform" className="input" onChange={this.handleChange} value={this.state.item.platform} disabled={!this.state.isEditing} />
                            </label>
                        </div>

                        {/* Date Leant */}
                        <div className="game-item--data-row">
                            <label>
                                <span className="game-item--label">Date Leant:</span>
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
                                        showClearDate={this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                    />
                            </label>

                        </div>

                        {/* Date Returned */}
                        <div className="game-item--data-row">
                            <label>
                                <span className="game-item--label">Date Returned:</span>
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
                                        showClearDate={this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                    />
                            </label>
                        </div>
                    </div>
                    <div className="game-item--padding game-item--button-row">
                        {/*Cancel button if we're in edit mode and this isn't a new item*/}
                        {this.state.isEditing && !this.props.isNew && (
                            <button onClick={this.cancelEdit} className="btn">Cancel</button>
                        )}
                        {/*Save button if we're in edit mode*/}
                        {this.state.isEditing && (
                            <button onClick={this.handleSubmit} className="btn btn--green">Save</button>
                        )}
                        {/*Edit button if this isn't a new item and we're not in edit mode*/}
                        {!this.props.isNew && !this.state.isEditing && (
                            <button onClick={this.startEdit} className="btn">Edit</button>
                        )}
                        {/*Delete button if this isn't a new item*/}
                        {!this.props.isNew && (
                            <button onClick={this.handleDelete} className="btn btn--red">Delete</button>
                        )}
                    </div>
                </form>
            </div>
        );
    }
}



export default Game;