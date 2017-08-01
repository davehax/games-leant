import React, { Component } from 'react';
import { Redirect} from 'react-router-dom';
import firebase, { firebaseStore } from './firebase.js';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import clone from 'clone';
import { toMoment, getItemFromStateItem } from './Util.js';

// Game edit single page
class GameEditSinglePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: null,
            itemRef: null,
            exists: true,
            hasSaved: false
        };

        // bind 'this' to our events
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        if (firebaseStore.store.signedIn) {
            let itemsPrefix = firebaseStore.getItemsPrefix();
            let itemId = this.props.match.params.id;
            let itemRef = firebase.database().ref(`${itemsPrefix}/${itemId}`);

            itemRef.on('value', (snapshot) => {
                let item = snapshot.val();

                if (typeof(item) !== 'undefined' && item !== null) {
                    this.setState({
                        item: {
                            id: itemId,
                            created: item.created,
                            modified: item.modified,
                            game: item.game,
                            person: item.person,
                            platform: item.platform,
                            dateLeant: toMoment(item.dateLeant),
                            dateReturned: toMoment(item.dateReturned)
                        }
                    });
                }
            });

            this.setState({
                itemRef: itemRef
            });
        }
    }

    componentWillUnmount() {
        if (this.state.itemRef !== null) {
            this.state.itemRef.off('value');
        }
    }

    // save
    save(item) {
        let saving = this.state.itemRef.update(item);
        saving.then((val) => {
            this.setState({
                hasSaved: true
            });
        }).catch((err) => {
            console.error(err);
        })
    }

    // delete 
    delete(e) {
        e && e.preventDefault();
        this.state.itemRef.off('value');
        this.state.itemRef.remove();
        this.setState({
            exists: false
        });
    }

    render() {
        if (!this.state.exists) {
            return (
                <Redirect to="/games" />
            )
        }

        if (this.state.hasSaved) {
            this.props.history.goBack();
        }

        return (
            <div>
                {this.state.item !== null && (
                    <GameEdit item={this.state.item} history={this.props.history} save={this.save} delete={this.delete} />
                )}
            </div>
        )
    }
}

// Game edit
class GameEdit extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            item: clone(this.props.item)
        }
    }

    // Handle the change of an input field
    handleChange(e) {
        e.persist(); // persist the synthetic event so we can access e.target -- still unsure why this is needed
        this.setState((prevState) => {
            prevState.item[e.target.name] = e.target.value;
            return prevState;
        });
    }

    // Save
    save(e) {
        e && e.preventDefault();
        this.props.save(this.getItemFromState());
    }

    // For data entry, we must convert some state properties into a new form
    getItemFromState() {
        return getItemFromStateItem(this.state.item);
    }
    
    render() {
        let isReturned = typeof(this.props.item.dateReturned) !== 'undefined';
        let className = ['game', 'game--edit'];
        if (isReturned) {
            className.push('game--returned');
        }

        return (
            <div className={className.join(' ')}>
                <h3 className="game--title">{this.state.item.game}</h3>
                <div className="game--edit-container">
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
                        <button onClick={this.props.delete} className="btn btn--red">Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default GameEditSinglePage;