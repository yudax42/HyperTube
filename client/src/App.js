import React, { Fragment, Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

//Components
import HomePage from './Components/Home/HomePage';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ResetPassword from './Components/Resetpassword/ResetPassword';
import NewPassword from './Components/Resetpassword/NewPassword';
import Movies from './Components/Movies/Movies';
import Profile from './Components/Profile/Profile';
import EditProfile from './Components/Profile/EditProfile';
import EditPassword from './Components/Profile/EditPassword';
import Confirm from './Components/Register/Confirm';
import LoginoAuth from './Components/Login/LoginoAuth';

import axios from 'axios';
import MoviePage from './Components/Movies/MoviePage';

class App extends Component {

  async componentDidMount () {
    try {
      const result = await axios.get('/api/user');
      if ( result.status === 200 )
        this.props.Authenticate(1);
      else 
        this.props.Authenticate(0);
    } catch ( e ) {
      this.props.Authenticate(0);
    }
  }

  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={ HomePage }/>
            <Route exact path="/login" component={ Login }/>
            <Route exact path="/login/oauth/:platform" component={ LoginoAuth }/>
            <Route exact path="/register" component={ Register }/>
            <Route exact path="/validate/:token" component={ Confirm }/>
            <Route exact path="/resetpassword/" component={ ResetPassword }/>
            <Route exact path="/resetpassword/:token" component={ NewPassword }/>
            <Route exact path="/movies" component={ Movies }/>
            <Route exact path="/movie/:code" component={ MoviePage }/>
            <Route exact path="/profile" component={ Profile }/>
            <Route exact path="/profile/:id" component={ Profile }/>
            <Route exact path="/settings/password" component={ EditPassword }/>
            <Route exact path="/settings" component={ EditProfile }/>
            <Route exact path="/*" component={ HomePage }/>
          </Switch>
        </BrowserRouter>
        <Footer/>
      </Fragment>
    );
  }
}

const mapDispatchToProps = ( dispatch ) => {
  return ({
    Authenticate : ( status ) => {
      dispatch ({ type : 'AUTHENTICATE', payload : status })
    }
  })
}

export default connect( null, mapDispatchToProps )( App );

