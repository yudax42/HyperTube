import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GuestRoute from '../Helpers/GuestRoute';
import { connect } from 'react-redux';

class LoginoAuth extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            status : 0,
            statusMessage : 'Connecting...'
        }
    }

    goBack = () => {
        const { history } = this.props;
        if ( history )
            history.push('/');
    }

    login = ( platform, code ) => {
        try {
            axios.get(`/api/user/${ platform }/auth${ code }`)
            .then( res => {
                if ( res.status === 200 ) {
                    this.setState({ status : 1, statusMessage : "Connected!"});
                    this.props.Authenticate(1);
                }
                else {
                    this.setState({ status : -1, statusMessage : "Cannot authorize"});
                }
            })
            .catch( err => {
                this.setState({ status : -1, statusMessage : "Cannot authorize"});
            });
        } catch ( e ) {
            this.setState({ status : -1, statusMessage : "Cannot connect please try again later!"});
        }
    }

    componentDidMount () {
        const platform = this.props.match.params.platform.toLowerCase();
        if ( platform === "intra" || platform === "google" ) {
            const code = window.location.search;
            this.login( platform, code );
        }
        else {
            this.setState({ status : -1 , statusMessage : "Invalid option" })
        }
    }

    render() {
        return (
            <div className="Loginpage">
                <GuestRoute/>
                <button className="h-btn-close" onClick={ this.goBack }><i className="far fa-times"></i></button>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 m-auto">
                            <div className="h-input-card">
                                <div className="content">
                                    <div className="h-logo-main">Hyper<span>Tube</span></div>
                                        <small className="h-links h-fsize mt-4"> 
                                            <p>{ this.state.statusMessage }</p>
                                            {
                                                (this.state.status === -1 )
                                                ? <small className="h-links">Try again <Link to ="/Login" className="h-link"> here.</Link></small>
                                                : null
                                            }
                                        </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return ({
        Authenticate : ( status ) => {
            dispatch({ type: 'AUTHENTICATE',  payload: status })
        }
    })
}

export default connect( null, mapDispatchToProps )(LoginoAuth);