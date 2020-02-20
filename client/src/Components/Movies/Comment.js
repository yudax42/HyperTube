import React, { Fragment } from 'react';

export default function Comment( props ) {
    return (
        <Fragment>
            <div className="comment-card">
                <div className="profile-picture" style={{ backgroundImage: `url(${ props.image })`}} onClick={ () => props.visit(props.author) } />
                <div className="comment-message">
                    <p className="username">{ props.author }</p>
                    <p className="content">{ props.data }</p>
                </div>
            </div>
            <div className="comment-footer">
                <div className="Like" onClick={ () => props.like( props.commentId ) }>{ (props.likes !== 1 ) ? props.likes + ' likes': props.likes + ' like' }</div>
            </div>    
        </Fragment>
    )
}
