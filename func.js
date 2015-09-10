var request = require('request');
var xmlParseString = require('xml2js').parseString;

exports.getLocationFromIP = function (ip, callback) {
	var url = 'http://freegeoip.net/';

	console.log("Requesting location for " + ip);
	// http://ip-api.com/json/#{ip}
	// http://freegeoip.net/json/{ip}
	// request( url + ip, function (error, response, body) {
	request('http://ip-api.com/json/#131.181.251.131', function (error, response, body) {
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

exports.getWeatherForLocation = function (location, callback) {
	var country_code = location.countryCode;
	var city = location.city;
	var url = 'http://api.wunderground.com/api/4b52aa55f2243ff8/conditions/q/';

	console.log("Requesting weather information for " + city);
	// http://api.wunderground.com/api/4b52aa55f2243ff8/conditions/q/{country_code}/{city}.json
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

exports.getMovieInfo = function (movieId, callback) {
	// "https://www.omdbapi.com/?t=death+proof&y=&plot=long&r=json&type=movie"
	var url = "https://www.omdbapi.com/?";
	var format = "r=json";
	var plot = "plot=long";
	var movie = 'i=' + movieId.split(' ').join('+');

	var preparedUrl = url + format + "&" + plot + "&" + movie;
	
	console.log("Requesting information for " + movie);
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

exports.searchMovie = function (queryString, year, callback) {
	var url = "https://www.omdbapi.com/?";
	var format = "r=json";
	var type = "type=movie";
	if (year) { var year = "y=" + year; } else { var year = ""; };
	var query = 's=' + queryString.split(' ').join('+');

	var preparedUrl = url + format + "&" + query + '&' + type + '&' + year;

	console.log("Searching for: " + queryString);
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

exports.getBeerInfo = function (beerId, callback) {
	// "https://api.untappd.com/v4/beer/info/467563?client_id=079890CF6A35244916A8774BC0CB33230B852BD5&client_secret=44E33A2D1CD33F5606E362932FAE66F1EEEF697C&compact=true"
	var url = "https://api.untappd.com/v4/beer/info/";
	var clientId = "client_id=079890CF6A35244916A8774BC0CB33230B852BD5";
	var clientSecret = "client_secret=44E33A2D1CD33F5606E362932FAE66F1EEEF697C";
	// "compact=false" will give a much richer json response
	var compact = "brewery=true";

	var preparedUrl = url + beerId + "?" + clientId + "&" + clientSecret + "&" + compact;
	console.log(preparedUrl);

	console.log("Requesting beer information for " + beerId);
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

exports.getSubtitle = function (movieQuery, language, callback) {
	// http://subsmax.com/api/10/the-dark-knight-en
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


//Returns a json of the form: {"result": {"confidence": "99.9920", "sentiment": "Positive"} }
exports.classifyText = function (text, callback) {
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
			callback(null, body);
		} else {
			callback(Error(body.message), body);
		}
	});

}

exports.translateText = function (text, lang, callback) {
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

// translate(token, "My name is Roger", "en", "no", function (error, data) {
// 	if (error) {
// 		console.log(error);
// 	} else {
// 		console.log(data);
// 	}
// });
var translate = function (token, text, from, to, callback) {
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





