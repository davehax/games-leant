import React, { Component } from 'react';

class Profile extends Component {
    render() {
        return (
            <div className="profile">
                <span className="profile--name">{this.props.displayName}</span>
                <img className="profile--photo" src={this.props.photoUrl} alt={this.props.photoAlt} />
            </div>
        );
    }
}

export default Profile;