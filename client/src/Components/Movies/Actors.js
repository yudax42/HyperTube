import React from 'react';
import ActorCard from './ActorCard';

export default function Actors( props ) {

    if ( !props.list || props.list.length  === 0 )
        return null;
    

    const actors =  props.list.map( (actor, index ) => {
        if ( actor.profile_path !== null )
            return  <ActorCard key={ index } title={ actor.name } cover={ `https://image.tmdb.org/t/p/w500${ actor.profile_path }` } />
        else
            return  <ActorCard key={ index } title={ actor.name } />

    })
    
    return (
        <div className="actors">
            <div className="row no-gutters">
               { actors }
            </div>
        </div>
    )
}
