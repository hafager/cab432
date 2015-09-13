/**
 * @author Haavard Magne Fagervoll
 */

var express = require('express');
var app = express();
var request = require('request');
var func = require('./func.js');
var bodyParser = require("body-parser");
var async = require('async');
var morgan = require('morgan');

//app.use(express.static('public'));
app.use('/static', express.static('public'));
app.use(morgan('dev'));


app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');

app.param('imdbId', function(req, res, next, imdbId) {
	if (imdbId.length === 9 && imdbId[0] === 't' && imdbId[1] === 't') {
		req.imdbId = imdbId; 
		next();
	}
});

app.param('txt', function(req, res, next, txt) {
	req.txt = txt;
	next();
});

app.locals.languages = {'English': 'en', 'Norwegian': 'no', 'Spanish': 'es', 'Chinese': 'ch', 'Japanese': 'jp', 'Swedish': 'swe', 'Danish': 'dk' }

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
		res.render('index')
	});	

	// res.render('index', { location: response.city });
})

app.post('/', function (req, res) {
	var movieSearch = req.body.movieSearch;
	
	try { var year = req.body.year } catch (error) { var year = null};

	try {
		func.searchMovie (movieSearch, year, function (error, body) {
			res.locals.movieArray = [];
			var movieList = body.Search;

			var sync = require("./gensync");
			sync(function*(resume) {
				try {
					var result = yield async.map(movieList, func.getMovieInfo, resume);
				} catch (error) {
					console.log(error)
				}
				try {
					var allMovies = yield async.map(result, func.classifyText, resume);
				} catch (error) {
					console.log(error);
				}
				console.log(allMovies);
			});

			for (var movie in movieList) {
				func.getMovieInfo(movieList[movie], function (err, data) {
					func.classifyText(data, function (err, data) {
					})
					res.locals.movieArray.push(data)
				});
			}
			res.render('index', {location: 'Sidney', temp: '37', movies: body});

			

			//res.render('index', {location: 'Sidney', temp: '37', movies: body});
		});
	} catch (error) {
		res.render('index', {location: 'Sidney', temp: '37', movies: error});
	}
});


app.get('/movie/:imdbId', function (req, res) {
	var id = req.params.imdbId
	func.getMovieInfo(id, function (err, data) {
		if (err) {
			res.status(404).send('Not found');
		} else {
			func.getTranslatorToken( function (err, token) {
				if (err) {
					res.status(500).send('Internal server error');
				} else {
					var auth = token.access_token;
					res.cookie('token', auth, { maxAge: 600000, httpOnly: false })
					res.render('movie', {movie: data, langs: app.locals.languages});
				};
			});
		}
	});
})

app.get('/translate/:txt', function (req, res) {
	var txt = req.params.txt.split('+').join(' ');
	func.getTranslatorToken(function (err, token) {
		func.translate(token, txt, 'en', 'no', function (err, data) {
			res.send(data);
		});
	});
	
});

app.get('*',function (req, res) {
	res.redirect('/');
})


var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App listening at http://%s:%s', host, port)
})

