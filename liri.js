//This loads the enviroment variables from the .env folder
require("dotenv").config();

//Import the keys.js file
var keys = require("./keys.js");

//Inquirer
var inquirer = require("inquirer");

//moment.js
var moment = require("moment");

//Axios
var axios = require("axios");

//Spotify
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

//This allows you to work with the files on your computer
var fs = require("fs");

//concert-this function

function concertThis(artistSearch) {
    // Run the get request via json using axios
    axios.get("https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp")
        .then(function (response) {

            var events = response.data;
            for (var i = 0; i < events.length; i++) {
                var venueName = events[i].venue.name;
                var venueLocation = events[i].venue.location;
                //Date
                var date = events[i].datetime;

                var momentDate = moment(date, "YYYY-MM-DDTHH:mm:ss");

                //Print information
                console.log("Name of Venue: " + venueName);
                console.log("Venue Location: " + venueLocation);
                console.log("Date of the Event: " + momentDate.format('MM/DD/YYYY'));

                //appends to the random.txt file
                fs.appendFile("log.txt", venueName + "\r" + venueLocation + "\r" + date + "\r", function (err) {
                    if (err) {
                        return console.log(err)
                    }
                })
            }
        }
        );
}

//spotify-this-song function

function spotifySong(songSearch) {
    spotify.search({ type: 'track', query: songSearch }, function (err, response) {

        var tracks = response.tracks.items;
        var artist = tracks[0].artists[0].name;
        var songTitle = tracks[0].name;
        var link = tracks[0].external_urls.spotify;
        var album = tracks[0].album.name;
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + artist);
        console.log("Song Title: " + songTitle);
        console.log("Web Link: " + link);
        console.log("Album: " + album);


        //show txt from random.txt if no song is entered

        //appends to the random.txt file
        fs.appendFile("log.txt", artist + "\r" + songTitle + "\r" + link + "\r" + album + "\r", function (err) {
            if (err) {
                return console.log(err)
            }
        })
    });
}

//movie-this 

function movieSearch(movieTitleSearch) {
    // Run the get request via json using axios
    axios.get("http://www.omdbapi.com/?t=" + movieTitleSearch + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {

            var movieTitle = response.data.Title;
            var movieRating = response.data.Rated;
            var rottenTomatoes = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var language = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;

            //Print information
            console.log("Title: " + movieTitle);
            console.log("IMBD Rating: " + movieRating);
            console.log("Rotten Tomatoes Rating: " + rottenTomatoes);
            console.log("Country Where the Movie was Produced: " + country);
            console.log("Language of the Movie: " + language);
            console.log("Actors in the Movie: " + actors);

            //appends to the random.txt file
            fs.appendFile("log.txt", movieTitle + "\r" + movieRating + "\r" + rottenTomatoes + "\r" + country + "\r"
                + language + "\r" + actors + "\r", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
        }
        );
}


//Inquirer
inquirer
    .prompt([
        //List of commands
        {
            type: "list",
            message: "Hello! Please choose one of the following:",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "commands"
        },
        {
            name: "searchQuery",
            message: "Please enter your search query here or press 'Enter' for do-what-it-says command:"
        }
    ]).then(function (inquirerResponse) {
       
        if (inquirerResponse.commands === "concert-this") {

            var artistSearch = inquirerResponse.searchQuery;
            concertThis(artistSearch);

        } else if (inquirerResponse.commands === "spotify-this-song") {

            var songSearch = inquirerResponse.searchQuery;

            if (songSearch === "") {
                songSearch = "The Sign";
            }
            spotifySong(songSearch);

        } else if (inquirerResponse.commands === "movie-this") {

            var movieTitleSearch = inquirerResponse.searchQuery;

            if (movieTitleSearch === "") {
                movieTitleSearch = "Mr. Nobody";
            }

            movieSearch(movieTitleSearch);

        } else if (inquirerResponse.commands === "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) {
                    return console.log(err);
                } else {
                    var randomChoice = data.split("\n");
                    var randomNumber = Math.floor(Math.random() * randomChoice.length);
                    var queryDoWhat = randomChoice[randomNumber].split(",")[1];
                    var commandDoWhat = randomChoice[randomNumber].split(",")[0];
                    if (commandDoWhat === "spotify-this-song") {
                        spotifySong(queryDoWhat);
                    } else if (commandDoWhat === "movie-this") {
                        movieSearch(queryDoWhat);
                    } else if (commandDoWhat === "concert-this") {
                        concertThis(queryDoWhat);
                    }
                }
            })

        }


    });
