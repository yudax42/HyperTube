const initialState = {
    isLogged: false,
    lang: 'EN'
}

const log = ( state, status ) => {
    if ( status === 1 )
        return ({
            isLogged :  true,
            lang: state.lang            
        });
    else
        return ({
            isLogged :  false,
            lang: state.lang            
        });
}

// const changeLang = ( state, lang ) => {
//     if ( lang === "EN" || lang === "FR" )
//         return ({
//             isLogged :  state.isLogged,
//             lang: state.lang            
//         });
//     else
//         return state;
// }

function rootReducer( state = initialState, action ) {
    switch( action.type ) {
        case "AUTHENTICATE":
            return log( state, action.payload );
        default :
            return state;
    }
}

export default rootReducer;