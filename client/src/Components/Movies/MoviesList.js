import React from 'react';
import MovieCard from './MovieCard';

export default function MoviesList( props ) {
    
    if ( !props.movies || props.movies.length === 0 )
        return null;
    
    const movies = props.movies.map(( movie, index )=> {
        if ( movie.poster )
            return (
                <MovieCard 
                    key={ index }
                    title={ movie.title }
                    cover={ movie.poster }
                    code={ movie.imdb_code }
                    year={ movie.productionYear }
                    rating={ movie.imdb_grade }
                    play={ props.play }
                    watched={ movie.watched }
                />
            )
        else
            return (
                <MovieCard 
                    key={ index }
                    title={ movie.title }
                    code={ movie.imdb_code }
                    year={ movie.productionYear }
                    rating={ movie.imdb_grade }
                    play={ props.play }
                    watched={ movie.watched }
                />
            )   
    })
            
    return (
        <div className="row no-gutters">
            { movies }
        </div>
    )
}
