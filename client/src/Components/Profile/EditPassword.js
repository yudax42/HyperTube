import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { validateChangePassword } from '../Helpers/Validator';
import axios from 'axios';
import Protected from '../Helpers/Protected';

export default class EditPassword extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            status: 0,
            statusMessage: '',
            oldPassword: '',
            password: '',
            passwordConfirmation: '',
            errors : {
                oldPassword: '',
                password: '',
                passwordConfirmation: ''
            } 
        }
    }

    changePassword = async () => {
        try {
            const result = await axios.patch('/api/user/password',{
                old: this.state.oldPassword,
                password: this.state.password,
                passwordRe: this.state.passwordConfirmation
            });
            if ( result.status === 200 ) {
                if ( result.data.success )
                    await this.setState({
                    status : 1,
                    statusMessage : 'Your password has been updated!'
                })
                else if ( result.data.error )
                    await this.setState({
                        status : -1,
                        statusMessage : result.data.error 
                    })
                else if ( result.data.errors ) {
                    let errors = '';
                    const keys = Object.keys( result.data.errors );
                    keys.forEach( key => {
                        errors += `${ result.data.errors[key] } `;
                    })
                    await this.setState({
                        status : -1,
                        statusMessage : errors
                    })
                }
            } else {
                await this.setState({
                    status : -1,
                    statusMessage : 'Somethimg wemt wrong!'
                })
            }
        } catch ( e ) {
            await this.setState({
                status : -1,
                statusMessage : 'Something went wrong!'
            })
        }
    
    }

    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        let result = '';
        if ( targetName === "passwordConfirmation" )
            result = validateChangePassword( targetName, targetValue, this.state.password );
        else 
            result = validateChangePassword( targetName, targetValue );
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
            this.changePassword();
    }

    checkData = () => {
        let error = 0;
        const keys = Object.keys( this.state );
        keys.forEach( key => {
            if ( key !== 'errors' && key !== 'statusMessage' && key !== 'status' && this.state[key] === '' )
                error = 1;
            else if ( this.state.password !== this.state.passwordConfirmation )
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
            <div className="Editpage">
                <Protected/>
                <Navbar/>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 m-auto">
                            <div className="h-input-card">
                                <div className="content">
                                        <p className="h-logo-main"><span>Settings</span></p>
                                        {
                                            ( this.state.status !== 0 )
                                            ? <div className={`h-status-response ${this.state.status === 1? 'h-success': 'h-failure'}` }> { this.state.statusMessage } </div>
                                            : null
                                        }
                                        <input type="password" className="form-control mt-5 h-input" placeholder="Old Password" name="oldPassword" value={ this.state.oldPassword } onChange={ this.onChange }/>
                                        { this.renderError('oldPassword') }
                                        <input type="password" className="form-control mt-5 h-input" placeholder="New Password" name="password" value={ this.state.password } onChange={ this.onChange }/>
                                        { this.renderError('password') }
                                        <input type="password" className="form-control mt-5 h-input" placeholder="Password Confirmation" name="passwordConfirmation" value={ this.state.passwordConfirmation } onChange={ this.onChange }/>
                                        { this.renderError('passwordConfirmation') }
                                        <button className="h-btn-sblock h-btn-primary mt-5" onClick={ this.onSubmit }> Change </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
