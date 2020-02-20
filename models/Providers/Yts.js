const axios = require('axios');
const cloudscraper = require('cloudscraper');

module.exports = class YTS {
    constructor() 
    {
    }

    static async generateInfos(movie)
    {
        try
        {
            let torrents = [];
            (movie.torrents).forEach(torrent =>
            {
                torrents.push({
                    hash : torrent.hash,
                    quality: torrent.quality,
                    peers: torrent.peers,
                    seeds: torrent.seeds,
                    size : (torrent.size_bytes / 1073741824).toFixed(2) + "GB",
                });
            });
            const URL = `https://api.themoviedb.org/3/movie/${movie.imdb_code}/credits?api_key=e27a6c2c1ad87aeb79b889b05ef6b766`;
            const actorsInfos = (await axios.get(URL)).data;
            const infos = {

                
                title:movie.title,

                
                description:movie.summary,
                year:movie.year,
                rating:movie.rating,
                imdb_code:movie.imdb_code,
                cast: actorsInfos.cast,
                crew: actorsInfos.crew,
                genres:movie.genres,
                poster:"https://img.yts.mx" + (movie.large_cover_image).substr(14,(movie.large_cover_image).length),
                torrents:torrents

            }
            return infos;
        }
        catch(err)
        {
            const infos = {
                title:movie.title,
                description:movie.synopsis,
                year:movie.year,
                rating:movie.percentage,
                imdb_code:movie.imdb_id,
                cast: [],
                crew: [],
                genres:movie.genres,
                poster:movie.images.poster,
                torrents:torrents
            }
            return infos;
        }
    }

    static makeThumbnail(movies)
    {
        // to solve cloudflare access
        let imgBaseUrl = `https://img.yts.mx`;
        let result = [];
        movies.forEach(movie => {
            let imgUrl = (movie.large_cover_image).substr(14,(movie.large_cover_image).length);
            let movieData = {
                title:movie.title,
                imdb_code: movie.imdb_code,
                productionYear:movie.year,
                poster: imgBaseUrl+imgUrl,
                imdb_grade: movie.rating,
                genres: movie.genres
            };
            result.push(movieData);
        });
        return(result);
    }

    static async listMovies(pageNumber,sort,genre)
    {
        (typeof genre == "undefined") ? genre = '' : genre = genre;
        (sort == "seeds") ? sort = "download_count" : sort = sort;
        try
        {
            let URL         = `https://yts.mx/api/v2/list_movies.json?limit=50&page=${pageNumber}&genre=${genre}&sort_by=${sort}`;
            let result      = JSON.parse(await cloudscraper.get(URL));
            // to solve scrapper problem for the first request
            result          = JSON.parse(await cloudscraper.get(URL)).data.movies;

            if(typeof result != "undefined" && result.length > 0)
                return this.makeThumbnail(result);
            else
                return [];
        }
        catch(error)
        {
            return [];
        }
    }

    static async searchMovies(movie_title,page)
    {
        try
        {
            let URL = `https://yts.mx/api/v2/list_movies.json?page=${page}sort_by=title&query_term=${movie_title}`;
            let result = JSON.parse(await cloudscraper.get(URL)).data.movies;
                result          = JSON.parse(await cloudscraper.get(URL)).data.movies;

            if(typeof result != "undefined" && result.length > 0)
                return this.makeThumbnail(result);
            else
                return [];
        }
        catch(error)
        {
            return [];
        }

    }

    static async getMovieInfos(imdb_code)
    {
        try
        {
            let URL = `https://yts.mx/api/v2/list_movies.json?sort_by=seeds&query_term=${imdb_code}`;
            let result = JSON.parse(await cloudscraper.get(URL)).data.movies;
            if(result.length >= 1)
                return this.generateInfos(result[0]);
            else
                return -1;
        }
        catch(err)
        {
            return -1;
        }
    }
}
