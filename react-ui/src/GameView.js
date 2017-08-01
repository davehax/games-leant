import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, { firebaseStore } from './firebase.js';
import { toMoment } from './Util.js';
let moment = require('moment');

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
                        dateLeant: toMoment(items[item].dateLeant),
                        dateReturned: toMoment(items[item].dateReturned)
                    };

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

// Game view all - view summary info of all games
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

// Game view - view summary info of a single game
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
                        <Link to={`/games/${this.props.item.id}/edit`} className="btn btn--green">Edit</Link>
                    </div>
                </div>
            </div>
        );
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

// Game View Detail - view the detail of a single game
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

export default GameViewAllPage;
export {
    GameViewSinglePage
};