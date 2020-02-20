import React from 'react';
import PropTypes from 'prop-types';

function ActorCard( props ) {
    if ( !props.title )
        return null;
    if ( props.cover )
        return (
            <div
                className="col-lg-2 col-md-3 col-sm-4 col-6 actor-card"
                style={{ backgroundImage: `url(${ props.cover })`}}
            >
                <div className="title">
                    <p>{ props.title }</p>
                </div>
            </div>
        )
    else {
        return (
            <div
                className="col-lg-2 col-md-3 col-sm-4 col-6 actor-card"
            >
                <div className="title">
                    <p>{ props.title }</p>
                </div>
            </div>
        )
    }
}

ActorCard.propTypes = {
    title: PropTypes.string.isRequired,
};

export default ActorCard;