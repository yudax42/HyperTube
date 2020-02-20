import React from 'react';


const Tag = ( genre, index ) => {
    return <p key={ index } className="tag"> { genre } </p>
}



export default function Tags( props ) {
    
    const renderTags = () => {
        const tags  = props.genres.map( ( genre, index )  => {
            return Tag( genre, index );
        });
        return tags;
    }

    if ( props.genres.length !== 0)
        return(
            <div className="tags mt-4">
                { renderTags() }
            </div>
        )
    else 
        return null;
}

