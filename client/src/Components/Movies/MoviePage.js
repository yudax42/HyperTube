import React, { Component } from 'react';
import axios from 'axios';

import Navbar from '../Navbar/Navbar';
import Tags from './Tags';
import Mirrors from './Mirrors';
import Comments from './Comments';
import Actors from './Actors';

import { validateComment } from '../Helpers/Validator';
import ReactPlayer from 'react-player';

import Protected from '../Helpers/Protected';

export default class MoviePage extends Component {
    
    constructor( props ) {
        super( props );
        this.state = {
            data: {},
            movie : '',
            comment: '',
            subtitles: [],
            error: '',
            checked : 0,
            commentsList: []
        }
    }

    async componentDidMount() {
        try {
            const code = this.props.match.params.code;
            const result = await axios.get(`/api/movieInfos?imdb=${ code }`)
            if ( !result.data.data )
                this.props.history.push('/movies');
            if ( result.data.data )
                await this.setState({ data : result.data.data });
            await this.loadComments();

            const res =  await axios.get(`/api/subtitles/search/${code}`);
            const { subtitles, preferedLang } = res.data;

            if (subtitles.length > 0) {
                const subs = [];
                subtitles.forEach(sub => {
                    let subtitle = {
                        kind: 'subtitles',
                        src: `/api/subtitles/load?path=${sub.path.split('/')[3]}`,
                        srcLang: sub.langShort
                    }
                    if (sub.langShort === preferedLang)
                        subtitle.default = true;
                    subs.push(subtitle);
                });
                this.setState({subtitles: subs});
            }
        } catch( e ) {

        }
    }

    playMovie = ( movie ) => {
        this.setState({ movie })
        this.setToWatched();
    }

    setToWatched = async() => {
        try {
            if ( this.props.match.params.code )
                await axios.post('/api/watch', {
                    imdbid: this.props.match.params.code
                })
                
        } catch ( e ) {

        }
    }

    onComment = async () => {
        try {
            if ( this.state.comment !== '' && this.state.error === '' ) {
                const result = await axios.post('/api/comments', {
                    imdbid: this.props.match.params.code,
                    commentBody: this.state.comment
                })
                if (result.status === 200 )
                    await this.loadComments();
                await this.setState({ comment : '' });
            }
        } catch ( e ) {

        } 
    }

    onChange = async(e) => {
        const targetName  = e.target.name;
        const targetValue = e.target.value;
        const result = validateComment( targetValue );
        await this.setState({ [targetName] : targetValue });
        if ( this.state.error !== result ) {
            this.setState({ error: result });
        }
    }

    renderError = ( ) => {
        if ( this.state.error )
            return <small className="form-text h-error m-auto d-block">{ this.state.error }</small>
        return null;
    }

    addToWatchLater = () => {
        alert('Please remember to watch this later.');
    }

    loadComments = async() => {
        try {
            const code = this.props.match.params.code;
            if ( code ) {
                const result = await axios.get(`/api/comments/${ code }`);
                await this.setState({ commentsList: result.data.comments });
            }
        } catch ( e ) {

        }
    }

    like = async( commentId ) => {
        try {
            const result = await axios.post('/api/comments/vote', {
                commentId
            })
            if ( result.status === 200 )
                this.loadComments();

        } catch {

        }
    }

    visit = ( username ) => {
        if ( username )
            this.props.history.push(`/profile/${ username }`);
    }

    render() {
        const code = this.props.match.params.code;
        const subtitles = this.state.subtitles;
        if ( Object.keys( this.state.data ).length === 0 )
            return null
        return (
            <div className="Moviespage">
                    <Protected/>
                    <Navbar/>
                    <div className="movie-container" style={ this.state.data.poster ? { backgroundImage: `url(${ this.state.data.poster })`} : {}}>
                        <div className="container">

                            <div className="row">
                                <div className="col-12 col-sm-8 col-md-6 col-lg-4 m-auto">
                                    <div className="movie-flyer" style={ this.state.data.poster ? { backgroundImage: `url(${ this.state.data.poster })`} : {}} /></div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-8 m-auto">
                                    <div className="movie-data">
                                        <h1 className="title">{ this.state.data.title }</h1>
                                        <p className="prodyear">Production year <span>{ this.state.data.year }</span></p>
                                        <p className="rating">Rating <span> { this.state.data.rating } </span></p>
                                        <p className="description"> { this.state.data.description } </p>
                                        <Tags genres={ this.state.data.genres }/>
                                        <button onClick={ this.addToWatchLater } className="btn h-btn h-btn-primary h-fsize-1 ml-0"> Add To Watch Later </button>
                                    </div>
                                </div>   

                            </div>
                        
                        </div>
                    </div>

                    <Actors list={ this.state.data.cast }/>

                    { (this.state.movie) ? 
                    <ReactPlayer url={`/api/streamvideo?hash=${this.state.movie}&imdbid=${code}`}  className="w-100 h-100" controls = {true}  config={{ file: {tracks: subtitles }}}  playing />
                    : null
                    }

                    <Mirrors 
                        data={
                            this.state.data.torrents
                        }
                        play={ this.playMovie }
                    />

                    <Actors list={ this.state.data.crew }/>



                        {/* //comments */}
                    <Comments commentsList={ this.state.commentsList } like={ this.like } visit={ this.visit }/>
                    <br/>
                    <div className="h-comment-new mb-5">
                        <div className="container">
                            <input type="text" placeholder="Comment" name="comment" value={ this.state.comment } onChange={ this.onChange }/>
                            { this.renderError() }
                            <button className="h-btn-bblock h-btn-primary mt-5" onClick={ this.onComment }> comment </button>
                        </div>
                    </div>

                </div>
        )
    }
}