import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavbarDefault extends Component {
    render() {
        return (

            <nav className="navbar navbar-dark navbar-expand-lg h-navbar h-navbar-abs">
                <div className="container">
                    <Link to="/" className="navbar-brand logo">Hyper<span>Tube</span></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ml-auto">
                            <Link to="/Register" className="nav-item nav-link h-nav-btn">Register</Link>
                            <Link to="/login" className="nav-item nav-link h-nav-btn h-btn-primary">Login</Link>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}
