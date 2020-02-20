import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Protected from '../Helpers/Protected';
import axios from 'axios';

export default class Profile extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            id: -1,
            fname: '',
            lname: '',
            email: '',
            bio: '',
            image: ''
        }
    }


    async componentDidMount(){
        try {
            if ( this.props.match.params.id )
                await this.loadUserProfile( this.props.match.params.id );
            else
                await this.loadPersonalProfile();
        } catch (e) {
            await this.loadPersonalProfile();
        }
    }

    loadUserProfile = async( id ) => {
        try {
            const result = await axios.get(`/api/user/username/${ id }`)
            if ( result.status === 200 ) {
                const { username, firstName, lastName, bio, id ,image } = result.data;
                    await this.setState({
                        username,
                        fname: firstName,
                        lname: lastName,
                        bio,
                        id,
                        image
                    });
            }
        } catch ( e ) {
            this.props.history.push('/');
        } 
    }

    loadPersonalProfile = async() => {
        try {
            const result = await axios.get('/api/user')
            if ( result.status === 200 ) {
                const { username, fname, lname, bio, id ,image } = result.data;
                    await this.setState({
                        username,
                        fname,
                        lname,
                        bio,
                        id,
                        image
                    });
            }
        } catch ( e ) {

        } 
    }

    loadImage = async() => {
        try {
            const result = await axios.get(`/api/user/image/${ this.state.id }`);
            if ( result.status === 200 )
                if ( result.data.image ) 
                await this.setState({ image : result.data.image  });
        } catch ( e ) {

        }
    }

    render() {
        return (
            <div className="Profilepage">
                <Protected />
                <Navbar/>
                <div className="h-header-profile">
                </div>
                <div className="container">

                    <div className="profile-picture m-auto">
                        <div className="picture" style={{ backgroundImage: `url(${ this.state.image })`}}/>
                    </div>

                    <div className="content">
                            <div className="data">
                                <p className="name">{`${ this.state.fname } ${ this.state.lname }`}</p>
                                <p className="username">{ this.state.username }</p>
                                <p className="h-description">{ this.state.bio }</p>
                            </div>
                        </div>
                    </div>

                </div>
        )
    }
}
