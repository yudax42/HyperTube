import React, { Component } from 'react';
import { validateResetPassword } from '../Helpers/Validator';
import GuestRoute from '../Helpers/GuestRoute';
import axios from 'axios';

export default class NewPassword extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            status : 0,
            statusMessage : '',
            password : '',
            passwordConfirmation : '',
            token : '',
            errors : {
                password : '',
                passwordConfirmation : ''
            }
        }
    }

    componentDidMount () {
        if ( this.props.match.params.token )
            this.setState({ token : this.props.match.params.token })
    }

    goBack = () => {
        const { history } = this.props;
        if ( history )
            history.push('/');
    }

    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        const result = validateResetPassword( targetName, targetValue, this.state.password );
        await this.setState({ [targetName] : targetValue });
        if ( this.state.errors[targetName] !== result ) {
            let { errors } = this.state;
            errors[ targetName ] = result;
            this.setState({ errors });
        }
    }

    reset = () => {
        try {
            axios.patch('/api/user/reset/password', {
                token: this.state.token,
                password: this.state.password,
                passwordRe: this.state.passwordConfirmation
            })
            .then( res => {
                if ( res.status === 200 ) {
                    if ( res.data.success )
                        this.setState({
                            status : 1,
                            statusMessage : 'Your password has been changed'
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

    onSubmit = () => {
        const error = this.checkErrors();
        const emptyData =  this.checkData();
        if ( !error && !emptyData )
            this.reset();
    }

    checkData = () => {
        let error = 0;
        const keys = Object.keys( this.state );
        keys.forEach( key => {
            if ( key !== 'errors' && key !== 'status' && key !== 'statusMessage' && this.state[key] === '' )
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
            <div className="Resetpage">
                <GuestRoute/>
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

                                        <input type="password" className="form-control mt-5 h-input" placeholder="Password" name="password" onChange={ this.onChange } value={ this.state.password }/>
                                        { this.renderError('password') }
                                        <input type="password" className="form-control mt-5 h-input" placeholder="Password confirmation" name="passwordConfirmation" onChange={ this.onChange } value={ this.state.passwordConfirmation }/>
                                        { this.renderError('passwordConfirmation') }
                                        <button className="h-btn-sblock h-btn-primary mt-5" onClick={ this.onSubmit }> Save </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
