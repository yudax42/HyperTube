import React from 'react';
import PropTypes from 'prop-types';

export default function Mirror( props ) {
    return (
        <div className="col-12 col-sm-12 col-md-6 col-lg-4 mt-5">
            <div className="mirror" onClick={ () => { props.Play( props.Hash ) } }>
                <p>Peers <span> { props.Peers } </span></p>
                <p>Seeds <span> { props.Seeds } </span></p>
                <p>Size <span> { props.Size } </span></p>
            </div>
        </div>
    )
}

Mirror.propTypes = {
    Peers: PropTypes.number.isRequired,
    Seeds: PropTypes.number.isRequired,
    Size: PropTypes.string.isRequired
};