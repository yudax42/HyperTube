import React from 'react';
import Mirror from './Mirror';


export default function Mirrors( props ) {

    const mirrors = props.data.map( ( mirror, index ) => {
        return (
            <Mirror key={ index } Peers={ mirror.peers } Seeds={ mirror.seeds } Size={ mirror.size } Play={ props.play } Hash={ mirror.hash }/>
        )
    });

    if ( props.data.length !== 0 )
    return (
        <div className="mirrors">    
            <div className="row">
                { mirrors }
            </div>
        </div>
    )
    return null;
}
