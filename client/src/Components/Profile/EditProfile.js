import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import { validateEditData } from '../Helpers/Validator';
import Protected from '../Helpers/Protected';
import axios from 'axios';

export default class EditProfile extends Component {


    constructor( props ){
        super( props );
        this.state = {
            id: -1,
            image: null,
            status : 0,
            statusMessage : '',
            username : '',
            fname : '',
            lname : '',
            email : '',
            lang: '',
            bio : '',
            errors : {
                username : '',
                fname : '',
                lname : '',
                email : '',
                bio : ''
            }
        }
    }

     async componentDidMount(){
        try {
            const result = await axios.get('/api/user')
            if ( result.status === 200 ) {
                const { username, fname, lname, email, bio, id, image, lang } = result.data;
                    await this.setState({
                        username,
                        fname,
                        lname,
                        email,
                        bio,
                        lang,
                        id,
                        image
                    });
            }
        } catch ( e ) {

        } 
    }

    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        const result = validateEditData( targetName, targetValue );
        await this.setState({ [targetName] : targetValue });
        if ( this.state.errors[targetName] !== result ) {
            let { errors } = this.state;
            errors[ targetName ] = result;
            this.setState({ errors });
        }
    }

    onChangeLang = async(e) => {
        const language = e.target.value;
        
        if (language === 'english' || language === 'french') {
            await this.setState({lang: language});

        }
    }

    updateData = async() => {
        let language =  this.state.lang === 'english' ? 'en' : 'fr';
        console.log(language);
        try {
            const result = await axios.patch('/api/user/',{
                username: this.state.username,
                lastName: this.state.lname,
                firstName: this.state.fname,
                mail: this.state.email,
                bio: this.state.bio,
                lang: language
            });
            if ( result.status === 200 ) {
                if ( result.data.success )
                    await this.setState({
                    status : 1,
                    statusMessage : 'Your profile data has been updated!'
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

    onSubmit = () => {
        const error = this.checkErrors();
        const emptyData =  this.checkData();
        if ( !error && !emptyData )
            this.updateData();
    }

    checkData = () => {
        let error = 0;
        const keys = Object.keys( this.state );
        keys.forEach( key => {
            if ( key !== 'errors' && key !== 'statusMessage' && key !== 'status' 
            && key !== 'id' && key !== 'image' && this.state[key] === '' )
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

    loadImage =  async() => {
        try {
            const result = await axios.get(`/api/user/image/${ this.state.id }`);
            if ( result.status === 200 )
                if ( result.data.image ) 
                await this.setState({ image : result.data.image  });
        } catch ( e ) {

        }
    }

    uploadImage = async( file ) => {
        try {
            const formdata = new FormData();
            formdata.append('image', file);
            const result = await axios.put('/api/user/image', formdata)
            if ( result.status === 200 ) {
                await this.loadImage();
                await this.setState({ statusMessage: "Your profile picture has been update", status: 1});
            }
            else 
                await this.setState({ statusMessage: "Can't update your profile picture", status: -1});
        } catch ( e ) {
            await this.setState({ statusMessage: "Something went wrong", status: -1});
        }
    }

    changeEvent = async (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        if (file){
            if (file.size < 5){
                await this.setState({ statusMessage: 'Worning! Please select a valid image', status: -1});
            }
            else {
                if (file.type.startsWith('image/')){
                    if (file.size <= 4000000){
                        fileReader.onloadend = async (e) => {
                            const img = new Image();
                            img.onload = async() => {
                                await this.uploadImage(file);
                            };
                            img.onerror = async() => {
                                await this.setState({ statusMessage: 'Worning! Please select a valid image', status: -1});
                            };
                            img.src = e.target.result;
                        };
                        fileReader.readAsDataURL(file);
                    } else {
                        await this.setState({ statusMessage: 'Worning! Image should be 4M at max', status: -1});
                    }
                } else {
                    await this.setState({ statusMessage: 'Worning! Please select a valid image', status: -1});
                }
            }
        }
    }

    render() {
        return (
            <div className="Editpage">
                <Protected/>
                <Navbar/>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-lg-6 col-md-8 col-12 m-auto">
                            <div className="h-input-card">
                                <div className="content mt-5">
                                        <p className="h-logo-main mt-5"><span>Settings</span></p>
                                        {
                                            ( this.state.status !== 0 )
                                            ? <div className={`h-status-response mb-5 ${this.state.status === 1? 'h-success': 'h-failure'}` }> { this.state.statusMessage } </div>
                                            : null
                                        }
                                        <div className="edit-profile-picture m-auto">
                                            <div className="picture" style={{ backgroundImage: `url(${ this.state.image })`}}>
                                                <input type="file" className="edit-input" id="inputGroupFile01" ref={(ref) => this.inputRef = ref} onChange={this.changeEvent} />
                                                <label className="edit-label" htmlFor="inputGroupFile01"></label>
                                            </div>
                                        </div>
                                        <input type="text" className="form-control mt-5 h-input" placeholder="Username" name="username" value={ this.state.username } onChange={ this.onChange }/>
                                        { this.renderError( 'username' ) }
                                        <input type="text" className="form-control mt-5 h-input" placeholder="First name" name="fname" value={ this.state.fname } onChange={ this.onChange }/>
                                        { this.renderError( 'fname' ) }
                                        <input type="text" className="form-control mt-5 h-input" placeholder="Last name" name="lname" value={ this.state.lname } onChange={ this.onChange }/>
                                        { this.renderError( 'lname' ) }
                                        <input type="email" className="form-control mt-5 h-input" placeholder="Email" name="email" value={ this.state.email } onChange={ this.onChange }/>
                                        { this.renderError( 'email' ) }
                                        <textarea  className="form-control mt-5 h-input h-text-area mt-5" name="bio" cols="30" rows="3" value={ this.state.bio } onChange={ this.onChange }></textarea>
                                        { this.renderError( 'bio' ) }
                                        <div className="t-center">
                                            <select className="h-input-select mt-4" onChange={ this.onChangeLang } name='sortFilter' defaultValue="sortBy">
                                                <option disabled >Prefered language</option>
                                                <option>{ this.state.lang === 'en' ? "english" : "french" }</option>
                                                <option>{ this.state.lang !== 'en' ? "english" : "french" }</option>
                                            </select>
                                        </div>
                                        <button className="h-btn-sblock h-btn-primary mt-5" onClick={ this.onSubmit } > Save </button>
                                        <small className="h-links mt-4"><Link to ="/settings/password" className="h-link">Change your password</Link></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
