import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavbarDefault from './NavbarDefault';
import NavbarMain from './NavbarMain';

class Navbar extends Component {
    render() {
        if ( this.props.isLogged  )
            return <NavbarMain/>
        else
            return <NavbarDefault/>
    }
}

const mapStateToProps = ( state ) => state;

export default connect( mapStateToProps )( Navbar );