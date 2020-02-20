import React from 'react';
import Comment from './Comment';

export default function Comments( props ) {
    if ( props.commentsList ) {
        const commentsList = props.commentsList.map((comment, index) => {
            return (
                <Comment 
                    key={ index }
                    commentId={ comment._id }
                    data={ comment.body }
                    author={ comment.author.username }
                    image={ comment.author.imagePath }
                    likes={ comment.votes.length }
                    like={ props.like } 
                    visit={ props.visit }
                />
            ) 
        })
        if ( commentsList.length !== 0)
        return (
            <div className="comments">
                <div className="container">
                    { commentsList }
                </div>
            </div>
        )
        else
            return null;
    } else 
        return null;
}
