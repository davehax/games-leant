import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';
import firebase, { firebaseStore } from './firebase.js';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
// let clone = require('clone');
import clone from 'clone';
let moment = require('moment');

// Create a moment object from a valid DateTime object or DateTime string
const toMoment = (val) => {
    if (typeof(val) !== 'undefined') {
        return new moment(new Date(val));
    }
    return null;
}

// Get our game item from a state item object
const getItemFromStateItem = (item) => {
    let o = {
        created: new moment(item.created).toISOString(),
        modified: new moment().toISOString(),
        game: item.game,
        person: item.person,
        platform: item.platform,
        dateLeant: item.dateLeant === null ? null : item.dateLeant.toISOString(),
        dateReturned: item.dateReturned === null ? null : item.dateReturned.toISOString()
    }

    if (typeof (item.id) !== 'undefined') {
        o.id = item.id;
    }

    return o;
}




// Page - Game View All
class GameViewAllPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            itemsRef: null
        };
    }

    componentDidMount() {
        if (firebaseStore.store.signedIn) {
            // Connect to FireBase 'games_uid'
            const refKey =  firebaseStore.getItemsPrefix();
            let itemsRef = firebase.database().ref(refKey);

            // .on('value', func) will trigger as soon as the event handler is bound, 
            // and when any additional updates are made to 'Items'
            itemsRef.on('value', (snapshot) => {
                let items = snapshot.val();
                let newState = [];

                // let's see!
                // console.log(snapshot.val());

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

                    obj.dateLeant = toMoment(obj.dateLeant);
                    obj.dateReturned = toMoment(obj.dateReturned);

                    newState.push(obj);
                }

                newState = newState.sort((a, b) => {
                    return new moment(a.created) < new moment(b.created)
                });

                console.log('Updating state with new data snapshot');
                this.setState({
                    items: newState
                });
            });

            // Update state with signedIn, user and itemsRef
            this.setState({
                itemsRef: itemsRef
            });
        }
    }

    componentWillUnmount() {
        // Unbind our event handler
        if (typeof(this.state.itemsRef) !== 'undefined' && this.state.itemsRef !== null) {
            this.state.itemsRef.off('value');
        }
    }

    render() {
        return (
            <div>
                <Link to="/games/new" className="btn btn--green">Add new item</Link>
            {this.state.items.length ? (
                <GameViewAll items={this.state.items} />
            ) : (<h3>Loading items...</h3>)}
            </div>
        )
    }
}





// Game view single page
class GameViewSinglePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: null,
            itemRef: null
        };
    }

    componentDidMount() {
        if (firebaseStore.store.signedIn) {
            let itemsPrefix = firebaseStore.getItemsPrefix();
            let itemId = this.props.match.params.id;
            let itemRef = firebase.database().ref(`${itemsPrefix}/${itemId}`);

            itemRef.on('value', (snapshot) => {
                let item = snapshot.val();

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

    render() {
        return (
            <div>
                {this.state.item !== null && (
                    <GameViewDetail item={this.state.item} />
                )}
            </div>
        )
    }
}









// Game view all
class GameViewAll extends Component {
    render() {
        return (
            <div className="game-all">
                {this.props.items.map((item) => {
                    return <GameView key={item.id} item={item} />
                })}
            </div>
        )
    }
}

// Game view
class GameView extends Component {
    render() {
        let dateLeant = new moment(this.props.item.dateLeant).format("Do MMM, YYYY");
        let isReturned = typeof(this.props.item.dateReturned) !== 'undefined' && this.props.item.dateReturned !== null;
        let className = ['game', 'game--view'];
        if (isReturned) {
            className.push('game--returned');
        }

        return (
            <div className={className.join(' ')}>
                <h3 className="game--title">{this.props.item.game}</h3>
                <div className="game--meta-container">
                    <span className="game--meta">{this.props.item.person}</span>
                    <span>, </span>
                    <span className="game--meta">{dateLeant}</span>
                </div>
                <div className="game--toolbar cf">
                    <div className="pull-right">
                        <Link to={`/games/${this.props.item.id}`} className="btn">View Detail</Link>
                        <Link to={`/games/${this.props.item.id}/edit`} className="btn">Edit</Link>
                    </div>
                </div>
            </div>
        );
    }
}

class GameViewDetail extends Component {
    render() {
        let dateCreated = new moment(this.props.item.created).format("Do MMM, YYYY h:mm a")
        let dateModified = new moment(this.props.item.modified).format("Do MMM, YYYY h:mm a")
        let dateLeant = new moment(this.props.item.dateLeant).format("Do MMM, YYYY");
        let dateReturned = this.props.item.dateReturned === null ? "Not returned yet." : new moment(this.props.item.dateReturned).format("Do MMM, YYYY");
        let isReturned = typeof(this.props.item.dateReturned) !== 'undefined' && this.props.item.dateReturned !== null;
        let className = ['game', 'game--view', 'game--detail'];
        if (isReturned) {
            className.push('game--returned');
        }

        return (
            <div className={className.join(' ')}>
                <h3 className="game--title">{this.props.item.game}</h3>
                <div className="game--detail-container">
                     <div className="game--detail-item">
                        <span>id</span>
                        <span>{this.props.item.id}</span>
                    </div>
                    <div className="game--detail-item">
                        <span>Person</span>
                        <span>{this.props.item.person}</span>
                    </div>
                    <div className="game--detail-item">
                        <span>Date Leant</span>
                        <span>{dateLeant}</span>
                    </div>
                    <div className="game--detail-item">
                        <span>Date Returned</span>
                        <span>{dateReturned}</span>
                    </div>
                    <div className="game--detail-item">
                        <span>Platform</span>
                        <span>{this.props.item.platform}</span>
                    </div>
                    <div className="game--detail-item">
                        <span>Created</span>
                        <span>{dateCreated}</span>
                    </div>
                    <div className="game--detail-item">
                        <span>Modified</span>
                        <span>{dateModified}</span>
                    </div> 
                </div>
                <div className="game--toolbar cf">
                    <div className="pull-right">
                        <Link to="/games" className="btn">Cancel</Link>
                        <Link to={`/games/${this.props.item.id}/edit`} className="btn btn--green">Edit</Link>
                    </div>
                </div>
            </div>
        );
    }
}

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
        let dateLeant = new moment(this.props.item.dateLeant).format();
        let isReturned = typeof(this.props.item.dateReturned) !== 'undefined';
        let className = ['game', 'game--edit'];
        if (isReturned) {
            className.push('game--returned');
        }

        return (
            <div className={className.join(' ')}>
                <h3 className="game--title">{this.state.item.game}</h3>
                <div className="game--edit-container">
                    <div className="game--edit-item">
                        <label>
                            <span>Game</span>
                            <input name="game" type="text" value={this.state.item.game} onChange={this.handleChange} />
                        </label>
                    </div>

                    <div className="game--edit-item">
                        <label>
                            <span>Person</span>
                            <input name="person" type="text" value={this.state.item.person} onChange={this.handleChange} />
                        </label>
                    </div>

                    <div className="game--edit-item">
                        <label>
                            <span>Platform</span>
                            <input name="platform" type="text" value={this.state.item.platform} onChange={this.handleChange} />
                        </label>
                    </div>

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
                <h3 className="game--title">{this.state.item.game}</h3>
                <div className="game--edit-container">
                    <h3>New Item</h3>
                    <form onSubmit={this.add}>
                        <div className="game--edit-item">
                            <label>
                                <span>Game</span>
                                <input name="game" type="text" value={this.state.item.game} onChange={this.handleChange} />
                            </label>
                        </div>

                        <div className="game--edit-item">
                            <label>
                                <span>Person</span>
                                <input name="person" type="text" value={this.state.item.person} onChange={this.handleChange} />
                            </label>
                        </div>

                        <div className="game--edit-item">
                            <label>
                                <span>Platform</span>
                                <input name="platform" type="text" value={this.state.item.platform} onChange={this.handleChange} />
                            </label>
                        </div>

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
                    </form>
                </div>
                <div className="game--toolbar cf">
                    <div className="pull-right">
                        <button onClick={this.props.history.goBack} className="btn">Cancel</button>
                        <button onClick={this.save} className="btn btn--green">Save</button>
                    </div>
                </div>
            </div>
        );
    }
}

export {
    GameViewAllPage, 
    GameViewSinglePage,
    GameEditSinglePage,
    GameNewPage
};