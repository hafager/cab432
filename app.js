/**
 * @author Haavard Magne Fagervoll
 */

var express = require('express');
var app = express();
var request = require('request');
var func = require('./func.js');
var bodyParser = require("body-parser");
var async = require('async');


app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'jade');

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.param('imdbId', function(req, res, next, imdbId) {
	if (imdbId.length === 9 && imdbId[0] === 't' && imdbId[1] === 't') {
		req.imdbId = imdbId; 
		next();
	} else {
		res.redirect('/');
	}

});

app.get('/', function (req, res) {
	res.render('index')
})

/**
* Makes the movie search and queries movieinfo, subtitle and sentiment APPI.
* @todo Make subtitle- and sentiment API call asynchronous
* @todo Make the table of movies look nicer
* @todo Make the subtitle language dropdown update the subtitles if a search already has been done. And make it stick to the language you have chosen.
* @todo Adds some text explaining that it couldn't find any movies whe the search result is empty
*/
app.post('/', function (req, res) {
	var movieSearch = req.body.movieSearch;
	var selectedLanguage = req.body.selectLanguage;
	
	var sync = require("./gensync");
	sync(function*(resume) {
		try {
			var movieList = yield func.searchMovie(movieSearch, resume);

		} catch (error) {
			console.error(error.stack);
		}
		try {
			var result = yield async.map(movieList.Search, func.getMovieInfo, resume);
		} catch (error) {
			console.error(error.stack);

		}
		for (var item in result) {
			result[item].SelectedLanguage = selectedLanguage;
		};
		try {

			var subtitles = yield async.map(result, func.getSubtitle, resume);
		} catch (error) {
			console.error(error.stack);
		}
		try {
			var movies = yield async.map(subtitles, func.classifyText, resume);
		} catch (error) {
			console.error(error.stack);
		}
		res.render('index', { movies: movies, selectedLanguage: selectedLanguage });
	})
});

/**
* Renders the view for movie information
* @todo Show the result of the sentimental analysis of the movie
*/
app.get('/movie/:imdbId', function (req, res) {
	var id = req.params.imdbId
	func.getMovieInfo(id, function (err, data) {
		if (err) {
			console.error(err.stack);
			res.status(404).send('Not found');
		} else {
			func.getTranslatorToken( function (err, token) {
				if (err) {
					console.error(err.stack);
					res.status(500).send('Internal server error');
				} else {
					var auth = token.access_token;
					res.cookie('token', auth, { maxAge: 600000, httpOnly: false })
					res.render('movie', {movie: data});
				};
			});
		}
	});
})

app.get('/img/:imageId', function (req, res) {
	var imageId = req.params.imageId;
	request.get('http://ia.media-imdb.com/images/M/' + imageId).pipe(res)
});

app.get('*',function (req, res) {
	res.redirect('/');
})


var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('App listening at http://%s:%s', host, port)
})

