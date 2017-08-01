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

export { 
    toMoment,
    getItemFromStateItem
};