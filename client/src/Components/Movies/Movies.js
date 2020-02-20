import React, { Component } from 'react';

import Navbar from '../Navbar/Navbar';
import Protected from '../Helpers/Protected';
import axios from 'axios';
import MoviesList from './MoviesList';
import { Link } from 'react-router-dom';
import { validateSearchData } from '../Helpers/Validator';

export default class Movies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            sortFilter: 'seeds',
            movies: [],
            movie: '',
            search: '',
            error: '',
            canScroll : 1,
            filter : '',
            currentMovie: ''
        }
    }

    async componentDidMount() {
        await this.loadMovies();
        window.addEventListener('scroll', async () => {
            if ( this.state.canScroll )
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
                    await this.loadMovies();
        });
    }

    playMovie = async (movieCode) => {
        if (movieCode && movieCode !== '')
            this.props.history.push(`/movie/${movieCode}`);
    }

    loadMovies = async () => {
        try {
            const result = await axios.get(`/api/movies?page=${this.state.currentPage }&sort=${ this.state.sortFilter }&genre=${ this.state.filter }`);
            if (result.data.data && result.data.data.length > 0) {
                const newMovies = [...this.state.movies, ...result.data.data];
                await this.setState({ movies: newMovies, currentPage: this.state.currentPage + 1 });
                return result.data.data.length;
            }
        } catch (e) {

        }
    }

    onChange = async(e) => { 
        try {
            const targetName  = e.target.name;
            const targetValue = e.target.value;
            let result = '';
            await this.setState({ [targetName] : targetValue });
            if ( targetName === 'search' )
                result = validateSearchData( targetValue );
            if ( targetName === 'search' && this.state.error !== result )
                await this.setState({ error: result });
            if ( targetName === 'filter' || targetName === 'sortFilter' ) {
                await this.setState({ currentPage: 1, movies:[] });
                await this.loadMovies();
            }

        } catch ( er ) {

        }
    }
    
    renderError = ( ) => {
        if ( this.state.error )
            return <small className="form-text h-error h-t-center t-center">{ this.state.error }</small>
        return null;
    }

    search = async() => {
        try {
            if ( !this.state.error && this.state.search !== '' ) {
                const result = await axios.get(`/api/search?title=${ this.state.search }`);
                if ( result.status === 200 ) {
                    if ( result.data.data )
                        await this.setState({ movies : result.data.data, canScroll : 0 });
                    else
                        await this.setState({ canScroll : 1 });
                }
            }
        } catch( e ) {

        } 

    }

    render() {
        return (
            <div>
                { (this.state.movie !== '') ? <Link to={`/movie/${this.state.movie}`} /> : null}
                <Protected />
                <Navbar />
                <div className="load-more" onClick={ this.loadMovies }> <i className="fas fa-spinner"></i> </div>
                <div className="search-container">
                    <div className="container">
                        <p className="h-title">Looking for a movie?</p>
                        <div className="row">
                            <div className="col-8 col-sm-8 col-md-6 col-lg-4 m-auto">
                                <div className="content">
                                    <input
                                        type="text"
                                        className="form-control h-input h-search mb-1"
                                        placeholder="Movie name"
                                        value={ this.state.search } 
                                        name="search"
                                        onChange={ this.onChange } 
                                    />
                                    { this.renderError( ) }
                                    {
                                        ( this.state.canScroll === 1 ) ?
                                        <div className="t-center">
                                        <select className="h-input-select mt-4" onChange={ this.onChange } name='sortFilter' defaultValue="sortBy">
                                            <option disabled >sortBy</option>
                                            <option>seeds</option>
                                            <option>title</option>
                                            <option>rating</option>
                                        </select>
                                        <select className="h-input-select mt-4" onChange={ this.onChange } name="filter" defaultValue="filterBy">
                                            <option disabled >All</option>
                                            <option>Action</option>
                                            <option>Adventure</option>
                                            <option>Animation</option>
                                            <option>Biography</option>
                                            <option>Comedy</option>
                                            <option>Crime</option>
                                            <option>Documentary</option>
                                            <option>Drama</option>
                                            <option>Family</option>
                                            <option>Fantasy</option>
                                            <option>History</option>
                                            <option>Horror</option>
                                            <option>Music</option>
                                            <option>Musical</option>
                                            <option>Mystery</option>
                                            <option>Romance</option>
                                            <option>Sci-Fi</option>
                                            <option>Sport</option>
                                            <option>Thriller</option>
                                            <option>War</option> 
                                            <option>Western</option>
                                        </select>
                                    </div>
                                    : null 
                                }
                                <button className="btn h-btn-primary h-fsize-1 mt-5" onClick={ this.search }> Search </button>
                                </div>
                            </div>
                        </div>







                    </div>
                </div>
        
                <MoviesList movies={this.state.movies} play={this.playMovie} />
            </div >
        )
    }
}
