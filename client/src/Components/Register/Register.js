import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { validateRegisterData } from '../Helpers/Validator';
import GuestRoute from '../Helpers/GuestRoute';
import axios from 'axios';

export default class Register extends Component {

    constructor ( props ) {
        super( props );
        this.state = {
            status : 0,
            statusMessage: '',
            username : '',
            fname : '',
            lname : '',
            email : '',
            password : '',
            passwordConfirmation : '',
            errors : {
                username : '',
                fname : '',
                lname : '',
                email : '',
                password : '',
                passwordConfirmation : ''
            }
        }
    }

    register =  () => {
        try {
            axios.post('/api/user', {
                username: this.state.username,
                mail: this.state.email,
                lastName: this.state.lname,
                firstName: this.state.fname,
                password: this.state.password,
                passwordRe: this.state.passwordConfirmation
            })
            .then( res => {
                if ( res.status === 200 ) {
                    if ( res.data.success )
                        this.setState({
                            status : 1,
                            statusMessage : 'Your account has been created successfully please check your email to confirm your account'
                        })
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



    goBack = () => {
        const { history } = this.props;
        if ( history )
            history.push('/');
    }

    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        let result = '';
        if ( targetName === 'passwordConfirmation' )
            result = validateRegisterData( targetName, targetValue, this.state.password );
        else 
            result = validateRegisterData( targetName, targetValue );
        await this.setState({ [targetName] : targetValue });
        if ( this.state.errors[targetName] !== result ) {
            let { errors } = this.state;
            errors[ targetName ] = result;
            this.setState({ errors });
        }
    }

    onSubmit = () => {
        const error = this.checkErrors();
        const emptyData =  this.checkData();
        if ( !error && !emptyData )
            this.register();
    }

    checkData = () => {
        let error = 0;
        const keys = Object.keys( this.state );
        keys.forEach( key => {
            if ( key !== 'errors' && key !== 'statusMessage' && key !== 'status' && this.state[key] === '' )
                error = 1;
            else if ( this.state.passwordConfirmation !== this.state.password )
                error = 1;
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
            <div className="Registerpage">
                <GuestRoute/>
                <button className="h-btn-close" onClick={ this.goBack }><i className="far fa-times"></i></button>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 m-auto">
                            <div className="h-input-card">
                                <div className="content mt-5">
                                        <p className="h-logo-main mt-5">Hyper<span>Tube</span></p>
                                        {
                                            ( this.state.status !== 0 )
                                            ? <div className={`h-status-response ${this.state.status === 1? 'h-success': 'h-failure'}` }> { this.state.statusMessage } </div>
                                            : null
                                        }

                                        <input type="text" className="form-control mt-5 h-input" name="username" placeholder="Username" value={ this.state.username } onChange={ this.onChange }/>
                                        { this.renderError( 'username' ) }
                                        <input type="text" className="form-control mt-5 h-input" name="fname" placeholder="First name" value={ this.state.fname } onChange={ this.onChange }/>
                                        { this.renderError( 'fname' ) }
                                        <input type="text" className="form-control mt-5 h-input" name="lname" placeholder="Last name" value={ this.state.lname } onChange={ this.onChange }/>
                                        { this.renderError( 'lname' ) }
                                        <input type="email" className="form-control mt-5 h-input" name="email" placeholder="Email" value={ this.state.email } onChange={ this.onChange }/>
                                        { this.renderError( 'email' ) }
                                        <input type="password" className="form-control mt-5 h-input" name="password" placeholder="Password" value={ this.state.password } onChange={ this.onChange }/>
                                        { this.renderError( 'password' ) }
                                        <input type="password" className="form-control mt-5 h-input" name="passwordConfirmation" placeholder="Password confirmation" value={ this.state.passwordConfirmation } onChange={ this.onChange }/>
                                        { this.renderError( 'passwordConfirmation' ) }
                                        <button className="h-btn-sblock h-btn-primary mt-5" onClick={ this.onSubmit }> Register </button>
                                        <small className="h-links mt-4">
                                            Already have an account?
                                            <Link to ="/Login" className="h-link"> login here.</Link>
                                            <br/>
                                            <a href="/api/user/google" className="h-link"> Sign up using google, </a>
                                            <a href="/api/user/intra" className="h-link"> Sign up using intra </a>
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
