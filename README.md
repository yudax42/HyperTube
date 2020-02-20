# HyperTube

streaming site of videos downloaded via the BitTorrent protocol.

Trello : https://trello.com/b/d8ZBG7U1/hypertube-tasks


## movies api

=> Providers

https://yts.mx 

https://popcorntime-online.ch/ 

https://popcorntime.api-docs.io/


##### Routes Description

=> FOR HOME PAGE 

GET REQUEST

| End point     | Description                     |
| ------------- |:--------------------------------: 
| /api/movies   | Used to list out all the available movies and return thumbnails info sorted by seeds|

Endpoint Parameters


| Parameter  | Type     | Description                     |
| ------------- |---|:--------------------------------: |
| page    | Integer (Unsigned)	  |Used to see the next page of movies|
| lang    | "ar" "fr" "en" default is "en"	  |Used to set the language of the response|
| sort    | string(title or year or seeds or rating or date_added)	  |Sorts the results by choosen value|
| genre    | string	  |Used to filter by a given genre (See http://www.imdb.com/genre/ for full list)|

=> FOR SEARCH

GET REQUEST

| End point     | Description                     |
| ------------- |:--------------------------------: 
| /api/search   | Used to list out all the available movies for the name and return thumbnails sorted by names|


Endpoint Parameters


| Parameter  | Type     | Description                     |
| ------------- |---|:--------------------------------: |
| title    | string  |movie name|
| page    | Integer (Unsigned)	  |Used to see the next page of movies|
| lang    | "ar" "fr" "en" default is "en"	  |Used to set the language of the response|

=> FOR Movie info

GET REQUEST

| End point     | Description                     |
| ------------- |:--------------------------------: 
| /api/movieInfos   | Used to list out all the available infos for a movie and torrents|

Endpoint Parameters


| Parameter  | Type     | Description                     |
| ------------- |---|:--------------------------------: |
| imdb    | string  |movie imdb code|
| lang    | "ar" "fr" "en" default is "en"	  |Used to set the language of the response|

=> FOR Movie Streaming

GET REQUEST

| End point     | Description                     |
| ------------- |:--------------------------------: 
| /api/streamvideo   | Used to stream a video passing torrent hash you need to add is a source in video player|


Endpoint Parameters


| Parameter  | Type     | Description                     |
| ------------- |---|:--------------------------------: |
| hash    | string  |torrent hash|


#### Comment Section

==> Add new comment 

| End point | Method | Params | Type | Description |
|-----------|--------|------|--------|:-----------:|
| /api/comments | POST | movieId commentBody | Object | Insert new comment to a given movie -movieId : the movie where the comment is belong to -commentBody : the comment content|


==> Get movie comments 

| End point | method | Params | Type | Description |
|-----------|--------|--------|------|:-----------:|
| /api/comments | GET | movieId | mongo ObjectId | Fetch all the comments fot a give movie |


==> Vote for a comment

| End point | method | Params | Type | Description |
|-----------|--------|--------|------|:-----------:|
| /api/comments/vote | POST | CommentId | String | vote for a given comment |


#### Subtitles Section

==> Search and download movie subtitles

| End point | Method | Params | Type | Description |
|-----------|--------|------|--------|:-----------:|
| /api/subtitles/search | GET | imdbid | string | Search for subtitles to a given movie and serve an object with the avialable subtitles with thier path on the server to be downloaded |


==> Download Subtitles

| End point | method | Query | Type | Description |
|-----------|--------|--------|------|:-----------:|
| /api/subtitles/search| GET | path | string | Serve the subtitle file if it exist |
