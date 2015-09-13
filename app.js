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
	res.render('index')
})

app.post('/', function (req, res) {
	var movieSearch = req.body.movieSearch;
	
	try { var year = req.body.year } catch (error) { var year = null};

	var sync = require("./gensync");
	sync(function*(resume) {
		try {
			var movieList = yield func.searchMovie(movieSearch, year, resume);
		} catch (error) {
			console.log(error);
		}
		try {
			var result = yield async.map(movieList.Search, func.getMovieInfo, resume);
		} catch (error) {
			console.log(error)
		}
		try {
			var movies = yield async.map(result, func.classifyText, resume);
		} catch (error) {
			console.log(error);
		}

		res.render('index', { movies: movies });
	})
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

