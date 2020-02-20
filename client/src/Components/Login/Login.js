import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import { validateLoginData } from '../Helpers/Validator';
import axios from 'axios';
import { connect } from 'react-redux';
import GuestRoute from '../Helpers/GuestRoute';

class Login extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            status : 0,
            statusMessage : '',
            username : '',
            password : '',
            errors : {
                username : '',
                password : ''
            }
        }
    }

    goBack = () => {
        const { history } = this.props;
        if ( history )
            history.push('/');
    }

    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        const result = validateLoginData( targetName, targetValue );
        await this.setState({ [targetName] : targetValue });
        if ( this.state.errors[targetName] !== result ) {
            let { errors } = this.state;
            errors[ targetName ] = result;
            this.setState({ errors });
        }
    }

    login = () => {
        try {
            axios.post('api/user/login', {
                username: this.state.username,
                password: this.state.password
            })
            .then( res => {
                if ( res.status === 200 ) {
                    if ( res.data.success ) {
                        this.setState({
                            status : 1,
                            statusMessage : 'You have logged in successfully'
                        })
                        this.props.Authenticate();
                    }
                    else if ( res.data.error )
                        this.setState({
                            status : -1,
                            statusMessage : res.data.error 
                        })
                    else if ( res.data.errors ) {
                        let errors = '';
                        const keys = Object.keys( res.data.errors );
                        keys.forEach( key => {
                            errors += `${ res.data.errors[key] } `;
                        })
                        this.setState({
                            status : -1,
                            statusMessage : errors
                        })
                    }
                }
            })
            .catch( err => {
                this.setState({
                    status : -1,
                    statusMessage : "Something went wrong!"
                })
            });
        } catch ( e ) {
            this.setState({
                status : -1,
                statusMessage : "Couldn't connect to the server"
            })
        }
    }


    onSubmit = () => {
        const error = this.checkErrors();
        const emptyData =  this.checkData();
        if ( !error && !emptyData )
            this.login();
    }

    checkData = () => {
        let error = 1;
        const keys = Object.keys( this.state );
        keys.forEach( key => {
            if ( this.state.username && this.state.password )
                error = 0;
        })
        return error;
    }

    checkErrors = () => {
        let error = 0;
        const keys = Object.keys( this.state.errors );
        keys.forEach( key => {
            if ( this.state.errors[key] !== '' )
                error = 1;
        })
        return error;
    }

    renderError = ( fieldName ) => {
        if ( this.state.errors[ fieldName ] )
            return <small className="form-text h-error">{ this.state.errors[ fieldName ] }</small>
        return null;
    }

    render() {
        return (
            <div className="Loginpage">
                <GuestRoute />
                { ( this.props.isLogged === true )? <Redirect to='/'/> : null }
                <button className="h-btn-close" onClick={ this.goBack }><i className="far fa-times"></i></button>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 m-auto">
                            <div className="h-input-card">
                                <div className="content">
                                    <div className="h-logo-main">Hyper<span>Tube</span></div>
                                        {
                                            ( this.state.status !== 0 )
                                            ? <div className={`h-status-response ${this.state.status === 1? 'h-success': 'h-failure'}` }> { this.state.statusMessage } </div>
                                            : null
                                        }
                                        <input type="text" className="form-control mt-5 h-input" name='username' placeholder="Username" onChange={ this.onChange } value={ this.state.username }/>
                                        { this.renderError('username') }
                                        <input type="password" className="form-control mt-5 h-input" name='password' placeholder="Password" onChange={ this.onChange } value={ this.state.password }/>
                                        { this.renderError('password') }
                                        <button className="h-btn-sblock h-btn-primary mt-5" onClick={ this.onSubmit }> Login </button>
                                        <small className="h-links mt-4"> 
                                            <Link to="/Register" className="h-link">Create an account</Link>,
                                            <Link to="/Resetpassword" className="h-link"> Reset your password</Link>
                                            <br/>
                                            <a href="/api/user/google" className="h-link"> Login using google, </a>
                                            <a href="/api/user/intra" className="h-link"> Login using intra </a>
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

const mapStateToProps = ( state ) => state;

const mapDispatchToProps = ( dispatch ) => {
    return ({
        Authenticate : () => { 
            dispatch({ type: "AUTHENTICATE", payload : 1 })
        }
    }) 
}

export default connect( mapStateToProps, mapDispatchToProps)( Login );