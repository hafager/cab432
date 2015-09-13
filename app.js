/**
 * @author Léo Unbekandt
 */

var express = require('express');
var app = express();
var request = require('request');
var func = require('./func.js');
var bodyParser = require("body-parser");
var async = require('async');

//app.use(express.static('public'));
app.use('/static', express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');

app.param('imdbId', function(req, res, next, imdbId) {
	console.log(req.params)
	if (imdbId.length === 9 && imdbId[0] === 't' && imdbId[1] === 't') {
		req.imdbId = imdbId; 
		console.log('next');
		next();
	}
	console.log('fail')
});

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
		// try {
		// 	var loc = yield func.getLocationFromIP(ip, resume);
		// } catch (error) {
		// 	console.log(error);
		// }
		// try {
		// 	var weather = yield func.getWeatherForLocation(loc, resume);
		// } catch (error) {
		// 	console.log(error);
		// }
		//try {
		//	var beer = yield func.getBeerInfo(beerId, resume);
		//} catch (error) {
		//	console.log(error);
		//}
		//console.log(beer);
		//console.log(beer.response.beer.brewery);


		// res.render('index', {location: loc.city, temp: weather.current_observation.temp_c, director: movie.Director, rating: movie.imdbRating  })
		res.render('index', {location: 'Brisbane', temp: '39' })
	});	

	// res.render('index', { location: response.city });
})

app.post('/', function (req, res) {
	console.log(req.body);
	var movieSearch = req.body.movieSearch;
	
	try { var year = req.body.year } catch (error) { var year = null};

	try {
		func.searchMovie (movieSearch, year, function (error, body) {
			res.locals.movieArray = [];
			var movieList = body.Search;

			for (var movie in movieList) {
				console.log(movieList[movie].Title);
				func.getMovieInfo(movieList[movie].imdbID, function (err, data) {
					func.classifyText(data.Plot, function (err, data) {
						console.log(data)
					})
					res.locals.movieArray.push(data)
				});
			}
			console.log(res.locals.movieArray);
			res.render('index', {location: 'Sidney', temp: '37', movies: body});

			

			console.log(body.Search)
			//res.render('index', {location: 'Sidney', temp: '37', movies: body});
		});
	} catch (error) {
		res.render('index', {location: 'Sidney', temp: '37', movies: error});
	}
	
});

app.get('/test', function (req, res) {
	console.log('test');

	res.render('index');
});

app.get('/movie/:imdbId', function (req, res) {
	console.log(req);
	var id = req.params.imdbId
	func.getMovieInfo(id, function (err, data) {
		if (err) {
			res.status(404).send('Not found');
		} else {
			res.render('movie', {movie: data})
		}
	});
})


var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App listening at http://%s:%s', host, port)
})

