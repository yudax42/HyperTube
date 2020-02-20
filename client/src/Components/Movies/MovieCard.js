import React  from 'react';
import PropTypes from 'prop-types';


function MovieCard( props ) {


    if ( !props.title || !props.play )
        return null;

    if ( props.cover )
        return (
            <div
                className="col-lg-2 col-md-3 col-sm-4 col-6 movie-card"
                style={{ backgroundImage: `url(${ props.cover })`}}
            >
                <div className="data">
                </div>
                <div className="data">
                    <p className="movie-title">{ props.title }</p>
                    <p className="production-year">Prod-Year: <span> { props.year } </span></p>
                    <p className="imdb-rating">Rating: <span> { props.rating }</span></p>
                    <p className="imdb-rating">Imdb_code: <span> { props.code } </span></p>
                    <p className="imdb-rating">Seen: <span> { props.watched ? "Yes": "No" } </span></p>
                    <div className="btn-play" onClick={ () => props.play( props.code ) } > Watch </div>

                </div>
                <div className="title">
                    <p>{ props.title }</p>
                </div>
            </div>
        )
    else
        return (
            <div
                className="col-lg-2 col-md-3 col-sm-4 col-6 movie-card"
            >
                <div className="data">
                </div>
                <div className="data">
                    <p className="movie-title">{ props.title }</p>
                    <p className="production-year">Prod-Year: <span> { props.year } </span></p>
                    <p className="imdb-rating">Rating: <span> { props.rating }</span></p>
                    <p className="imdb-rating">Imdb_code: <span> { props.code } </span></p>
                    <p className="imdb-rating">Seen: <span> { props.watched ? "Yes": "No" } </span></p>
                    <div className="btn-play" onClick={ () => props.play( props.code ) } > Watch </div>

                </div>
                <div className="title">
                    <p>{ props.title }</p>
                </div>
            </div>
        )
}

MovieCard.propTypes = {
    play: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired
};

export default MovieCard;