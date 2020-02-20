import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class GuestRoute extends Component {
    constructor ( props ) {
        super( props );
        this.state = {
            Checked : 0,
        }
    }

    async componentDidMount(){
        try {
            const result = await axios.get('/api/user');
            if ( result.status === 200 )
                this.props.Authenticate();
            await this.setState({ Checked : 1 });
        } catch ( e ) {
            this.props.Logout();
            await this.setState({ Checked : 1 });
        }
    }

    render() {
        return (
            <Fragment>
                {
                    ( this.state.Checked === 1 && this.props.isLogged === true )? <Redirect to='/' /> : null
                }
            </Fragment>
        )
    }
}

const mapStateToProps = ( state ) => state;

const mapDispatchToProps = ( dispatch ) => {
    return ({
        Authenticate : ( state ) => {
            dispatch({ type : "AUTHENTICATE", payload : 1 })
        },
        Logout : () => {
            dispatch({ type : "AUTHENTICATE", payload : 0 })
        }
    })
}

export default connect( mapStateToProps, mapDispatchToProps )( GuestRoute );
