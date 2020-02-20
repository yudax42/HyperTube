import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


import Navbar from '../Navbar/Navbar';

class HomePage extends Component {
    render() {
        return (
            <div className="homepage">
                <Navbar/>
                <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12 col-12 h-section">
                                <div className="h-content">
                                    <h1 className='h-title'>Wecolme To Hypertube</h1>
                                    <p className="h-text">
                                        HyperTube is one of the best  free platforms that exists just to 
                                        provide you with a great movie watching experience, you can watch 
                                        the latest movies with all types drama comedy action  and  tv shows 
                                        with a high quality and speed we have a great list of the best 
                                        watched movies of all the time with no subscription charges.
                                        <br/> if u are new here join us now and let’s start watching your favorite movies :)
                                    </p>
                                    { ( this.props.isLogged ) ?
                                    <div className="row h-btn-holder">
                                        <Link to="/Movies" className="btn h-btn h-btn-primary h-fsize-1 mr-3"> Explore </Link>
                                    </div>
                                    :
                                    <div className="row h-btn-holder">
                                        <Link to="/Register" className="btn h-btn h-btn-secondary h-fsize-1 mr-3"> Register </Link>
                                        <Link to="/login" className="btn h-btn h-btn-primary h-fsize-1"> Login </Link>
                                    </div>
                                    }
                                </div>
                            </div> 
                        </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ( state ) => state; 

export default connect( mapStateToProps )( HomePage );