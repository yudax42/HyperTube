import React, { Component } from 'react';
import { validateEmail } from '../Helpers/Validator';
import GuestRoute from '../Helpers/GuestRoute';
import axios from 'axios';

export default class ResetPassword extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            status : 0,
            statusMessage: '',
            email : '',
            error : ''
        }
    }

    goBack = () => {
        const { history } = this.props;
        if ( history )
            history.push('/');
    }


    reset = () => {
        try {
            axios.post('api/user/reset/password', {
                mail: this.state.email
            })
            .then( res => {
                if ( res.status === 200 ) {
                    if ( res.data.success )
                        this.setState({
                            status : 1,
                            statusMessage : 'We\'ve sent you an email with the recovery link to your email address'
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


    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        const result = validateEmail( targetValue );
        await this.setState({ [targetName] : targetValue });
        if ( this.state.error !== result ) {
            this.setState({ error : result });
        }
    }

    onSubmit = () => {
        const error = this.checkErrors();
        const emptyData =  this.checkData();
        if ( !error && !emptyData )
            this.reset();
    }

    checkData = () => {
        if ( this.state.email  === '' )
            return 1;
        else 
            return 0;
    }

    checkErrors = () => {
        if ( this.state.error === '' )
            return 0;
        else
            return 1;
    }

    renderError = ( fieldName ) => {
        if ( this.state.error )
            return <small className="form-text h-error">{ this.state.error }</small>
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
                                        <input type="email" className="form-control mt-5 h-input" placeholder="Email" name="email" onChange={ this.onChange } value={ this.state.email }/>
                                        { this.renderError('email') }
                                        <small className="h-links mt-4"> Please Enter your email address</small>
                                        <button className="h-btn-sblock h-btn-primary mt-5" onClick={ this.onSubmit }> Reset </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
