var request = require('request');
var xmlParseString = require('xml2js').parseString;

/**
* Queries the API https://www.omdbapi.com/ for information about the provided movie
* Example: "https://www.omdbapi.com/?t=death+proof&y=&plot=long&r=json&type=movie"
* @params {string} movieId - The id of the movie
*/
exports.getMovieInfo = function (movieId, callback) {
	if (movieId.length !== 9) {
		movieId = movieId.imdbID;
	}

	var url = "https://www.omdbapi.com/?";
	var format = "r=json";
	var plot = "plot=full";
	var movieId = movieId;
	var movie = 'i=' + movieId.split(' ').join('+');

	var preparedUrl = url + format + "&" + plot + "&" + movie;
	console.log(preparedUrl);
	request( preparedUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
        		body = JSON.parse(body);
			} catch (error) {
				callback(Error("Response body is not valid JSON: " + body), null);
			return;
			}
			callback(null, body);
		} else {
			callback(Error(body.message), body);
		}
	});
}

/**
* Queries the API https://www.omdbapi.com/ for movies with the keyword(s)
* @params {string} queryString - The string of the query
*/
exports.searchMovie = function (queryString, callback) {
	var url = "https://www.omdbapi.com/?";
	var format = "r=json";
	var type = "type=movie";
	var query = 's=' + queryString.split(' ').join('+');

	var preparedUrl = url + format + "&" + query + '&' + type;
	console.log(preparedUrl);
	request( preparedUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
        		body = JSON.parse(body);
			} catch (error) {
				callback(Error("Response body is not valid JSON: " + body), null);
			return;
			}
			callback(null, body);
		} else {
			callback(Error(body.message), body);
		}
	});
}

/**
* Queries the API http://subsmax.com/api/10/ for subtitles for a movie in the selected language
* Example: "http://subsmax.com/api/10/the-dark-knight-en"
* @params {object} movie - The movie object
* @params {string} language - The language, country or language code for the chosen language
*/
exports.getSubtitle = function (movie, callback) {
	var language = movie.SelectedLanguage;
	var url = "http://subsmax.com/api/10/";
	var movieQuery = movie.Title.split(' ').join('-');

	var preparedUrl = url + movieQuery + '-' + language + '-' + movie.Year;
	console.log(preparedUrl);
	request( preparedUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			xmlParseString(body, function (err, result) {
				if (err) {
					callback(Error("Response body is not valid XML: " + body), null);
					return;
				} else {
					movie.Subtitles = result.SubsMaxAPI.items[0].item
					callback(null, movie);
				}
			});
		} else {
			callback(Error(body.message), body);
		}
	});	
}

/**
* Queries the API http://sentiment.vivekn.com/api/text/ with a text to get a sentiment analysis of the text
* @params {string} text - The text to be analysed
* Returns a json of the form: {"result": {"confidence": "99.9920", "sentiment": "Positive"} }
*/
exports.classifyText = function (movie, callback) {
	var text = movie.Plot;
	var apiUrl = "http://sentiment.vivekn.com/api/text/";
	var payload = 'txt="' + text + '"';
	console.log(payload);
	request.post({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url:     apiUrl,
		body:    payload
	}, function(error, response, body){
		if (!error && response.statusCode == 200) {
		try {
        		body = JSON.parse(body);
			} catch (error) {
				callback(Error("Response body is not valid JSON: " + body), null);
			return;
			}
			
			movie['Sentiment'] = body.result;
			callback(null, movie);
		} else {
			callback(Error(body.message), body);
		}
	});

}

/**
* Queries the API https://datamarket.accesscontrol.windows.net/v2/OAuth2-13 for a token to be able to use the translator API.
* The token is valid for 600 seconds.
* The parameter token.access_token has to be sent with the translate query.
*/
exports.getTranslatorToken = function (callback) {
	var apiUrl = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13";
	var clientSecret = "uShdwP8Hj5/UAr3TyHbOGSaERFl30Z4zkKWSBBP3i58=";
	var clientId = "92209877";
	var scope = "http://api.microsofttranslator.com";
	var grantType = "client_credentials";

	var payload = 'grant_type=' + grantType + '&client_id=' + encodeURIComponent(clientId) + '&client_secret=' + encodeURIComponent(clientSecret) + '&scope=' + scope;
	console.log(payload);
	request.post({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url:     apiUrl,
		body:    payload
	}, function(error, response, body){
		if (!error && response.statusCode == 200) {
			try {
		    		body = JSON.parse(body);
			} catch (error) {
					callback(Error("Response body is not valid JSON: " + body), null);
				return;
			}
			callback(null, body);
		} else {
			callback(Error(body.message), body);
		}
	});
}

/**
* Queries the API http://api.microsofttranslator.com/v2/Http.svc/Translate? for translations from one language to another
* @params {object} token - The token which is needed to acces the API.
* @params {string} text - The text which will be translated
* @params {string} from - The original language of the text
* @params {string} to - The language the text will be translated into
*/
exports.translate = function (token, text, from, to, callback) {
	var uri = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + encodeURIComponent(text) + "&from=" + from + "&to=" + to;
	var authToken = "Bearer" + " " + token.access_token;
	console.log(url);
	var options = {
		url: uri,
		headers: {
		'Authorization': authToken
		}
	};

	request( options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			xmlParseString(body, function (err, result) {
				if (err) {
					callback(Error("Response body is not valid XML: " + body), null);
					return;
				} else {
					var translation = result.string._;
					callback(null, translation);
				}
			});
		} else {
			callback(Error(body.message), body);
		}
	});	
}





