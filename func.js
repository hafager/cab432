var request = require('request');
var xmlParseString = require('xml2js').parseString;


/**
* Queries the API "http://ip-api.com/json/#" for location of the client from IP
* Example: "http://ip-api.com/json/#131.181.251.131"
* @params {object} location - A location
*/
exports.getLocationFromIP = function (ip, callback) {
	var url = 'http://ip-api.com/json/#';

	request( url + ip, function (error, response, body) {
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
* Queries the API "http://api.wunderground.com/api/4b52aa55f2243ff8/conditions/q/" for information about the weather at the location
* Example: "https://www.omdbapi.com/?t=death+proof&y=&plot=long&r=json&type=movie"
* @params {object} location - A location
*/
exports.getWeatherForLocation = function (location, callback) {
	var country_code = location.countryCode;
	var city = location.city;
	var url = 'http://api.wunderground.com/api/4b52aa55f2243ff8/conditions/q/';

	request( url + country_code + '/' + city + '.json', function (error, response, body) {
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
	var plot = "plot=long";
	var movieId = movieId;
	var movie = 'i=' + movieId.split(' ').join('+');

	var preparedUrl = url + format + "&" + plot + "&" + movie;
	
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
* @params {string} year - Optional. Year of the movie
*/
exports.searchMovie = function (queryString, year, callback) {
	var url = "https://www.omdbapi.com/?";
	var format = "r=json";
	var type = "type=movie";
	if (year) { var year = "y=" + year; } else { var year = ""; };
	var query = 's=' + queryString.split(' ').join('+');

	var preparedUrl = url + format + "&" + query + '&' + type + '&' + year;

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
* Queries the API https://api.untappd.com/v4/beer/info/ with the beer ID to get info about the beer
* Examle: https://api.untappd.com/v4/beer/info/467563?client_id=079890CF6A35244916A8774BC0CB33230B852BD5&client_secret=44E33A2D1CD33F5606E362932FAE66F1EEEF697C&compact=true"
* @params {string} beerId - The string of the query
*/
exports.getBeerInfo = function (beerId, callback) {
	var url = "https://api.untappd.com/v4/beer/info/";
	var clientId = "client_id=079890CF6A35244916A8774BC0CB33230B852BD5";
	var clientSecret = "client_secret=44E33A2D1CD33F5606E362932FAE66F1EEEF697C";
	var compact = "compact=false";

	var preparedUrl = url + beerId + "?" + clientId + "&" + clientSecret + "&" + compact;

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
* @params {string} movieQuery - The name of the movie
* @params {string} language - The language, country or language code for the chosen language
*/
exports.getSubtitle = function (movieQuery, language, callback) {
	var url = "http://subsmax.com/api/10/";
	var movie = movieQuery.split(' ').join('-');

	var preparedUrl = url + movie + '-' + language;

	console.log("Searching for subtitles for " + movieQuery + ' in language ' + language);
	request( preparedUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			xmlParseString(body, function (err, result) {
				if (err) {
					callback(Error("Response body is not valid XML: " + body), null);
					return;
				} else {
					callback(null, result);
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





