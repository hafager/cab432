/**
 * @author Léo Unbekandt
 */

var express = require('express');
var app = express();
var request = require('request');
var func = require('./func.js');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function (req, res) {
	var ip = req.ip;
	var movieSearch = "the dark knight";
	var beerId = "17102";

	//func.getMovieInfo(movieSearch, function (error, data) {
	//	console.log(data);
	//});

	// Synced version avoids callback hell.
	var sync = require("./gensync");
	// If an `error` object is passed to resume it will throw an exception, so you probably want to try/catch around them!
	sync(function*(resume) {
		try {
			var loc = yield func.getLocationFromIP(ip, resume);
		} catch (error) {
			console.log(error);
		}
		try {
			var weather = yield func.getWeatherForLocation(loc, resume);
		} catch (error) {
			console.log(error);
		}
		//try {
		//	var beer = yield func.getBeerInfo(beerId, resume);
		//} catch (error) {
		//	console.log(error);
		//}
		console.log(beer);
		console.log(beer.response.beer.brewery);


		// res.render('index', {location: loc.city, temp: weather.current_observation.temp_c, director: movie.Director, rating: movie.imdbRating  })
		res.render('index', {location: loc.city, temp: weather.current_observation.temp_c, image: beer.response.beer.beer_label })
	});	

	// res.render('index', { location: response.city });
})

var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App listening at http://%s:%s', host, port)
})

