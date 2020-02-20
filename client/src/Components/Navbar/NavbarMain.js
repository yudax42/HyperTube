import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

class NavbarMain extends Component {

    logout = () => {
        try{
            axios.delete('/api/user/logout')
            .then( res => {
                this.props.Logout();
            })
            .catch( err => {
                this.props.Logout();
            })
        } catch ( e ) {
            this.props.Logout();
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark navbar-expand-lg h-navbar h-navbar-abs">
                    <div className="container">
                        <Link to="/" className="navbar-brand logo">Hyper<span>Tube</span></Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav ml-auto">
                                <NavLink to="/Movies" className="nav-item nav-link h-nav-btn">Movies</NavLink>
                                <NavLink to="/Profile" className="nav-item nav-link h-nav-btn">Profile</NavLink>
                                <NavLink to="/Settings" className="nav-item nav-link h-nav-btn">Settings </NavLink>
                                <button onClick={ this.logout } className="nav-item nav-link h-nav-btn h-btn-primary"> Logout </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return ({
        Logout : () => {
            dispatch({ type : 'AUTHENTICATE'});
        }
    });
}

export default connect( null, mapDispatchToProps )( NavbarMain );