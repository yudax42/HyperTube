const axios = require('axios');


module.exports = class POPCORN {
    constructor() 
    {

    }

    static makeThumbnail(movies)
    {
        const result = [];
        movies.forEach(movie => {
            let movieData = {
                title:movie.title,
                imdb_code: movie.imdb,
                productionYear:movie.year,
                poster: movie.poster_big,
                imdb_grade: movie.rating,
                genres: movie.genres
            };
            result.push(movieData);
        });
        return(result);
    }


    static generateInfos(movie)
    {
        var torrents = [];
        (movie.items).forEach(torrent =>
        {
            torrents.push({
                hash : torrent.id,
                quality: torrent.quality,
                peers: torrent.torrent_peers,
                seeds: torrent.torrent_seeds,
                size : (torrent.size_bytes / 1073741824).toFixed(2) + "GB",
            });
        });

        const infos = {
            title:movie.title,
            description:movie.description,
            year:movie.year,
            rating:movie.rating,
            imdb_code:movie.imdb,
            genres:movie.genres,
            poster:movie.poster_big,
            torrents:torrents
        }
        return infos;
    }


    static async listMovies(pageNumber)
    {
        pageNumber == 0 ? pageNumber = 1 : pageNumber = pageNumber;
        try
        {
            let URL         = `https://api.apiumadomain.com/list?sort=seeds&short=1&cb=&quality=720p,1080p,3d&page=${pageNumber}`;
            let result      = (await axios.get(URL)).data.MovieList;

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

    static async searchMovies(movie_title,pageNumber)
    {
        pageNumber == 0 ? pageNumber = 1 : pageNumber = pageNumber;
        try
        {
            let URL = `https://api.apiumadomain.com/list?sort=seeds&short=1&cb=&quality=720p,1080p,3d&page=${pageNumber}&keywords=${movie_title}`;
            let result      = (await axios.get(URL)).data.MovieList;


            if(typeof result != "undefined" && result.length > 0)
            {
                let movieList   = this.makeThumbnail(result);
                // Sort by names
                movieList.sort(function(a, b) {
                    var x = a.title.toLowerCase(); 
                    var y = b.title.toLowerCase();
                    if(x < y) {
                        return -1;
                    }
                    if(x > y) {
                        return 1;
                    }
                    return 0;
                });
                return movieList;
            }
            else
                return [];
        }
        catch(err)
        {
            return [];
        }
    }
    static async getMovieInfos(imdb_code)
    {
        try
        {
            let URL = `https://api.apiumadomain.com/movie?cb=&quality=720p,1080p,3d&page=1&imdb=${imdb_code}`;
            let result = (await axios.get(URL)).data;
            let movieInfos = this.generateInfos(result);
            return movieInfos;
        }
        catch(err)
        {
            return -1;
        }
    }
}









