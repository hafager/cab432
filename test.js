var request = require('request');
var xmlParseString = require('xml2js').parseString;
var func = require('./func.js')

var async = require('async');

 
var testMovies = [{ Title: 'The Dark Knight',
    Year: '2002',
    Rated: 'N/A',
    Released: 'N/A',
    Runtime: 'N/A',
    Genre: 'Documentary, Action',
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'Hulk Hogan, Freddie Blassie, Gerald Brisco, Pat Patterson',
    Plot: 'N/A',
    Language: 'English',
    Country: 'USA',
    Awards: 'N/A',
    Poster: 'N/A',
    Metascore: 'N/A',
    imdbRating: '7.9',
    imdbVotes: '146',
    imdbID: 'tt0365349',
    Type: 'movie',
    Response: 'True',
    Sentiment: { confidence: '50.0000', sentiment: 'Neutral' } },
  { Title: 'Hulk Hogan: The Ultimate Anthology',
    Year: '2006',
    Rated: 'N/A',
    Released: 'N/A',
    Runtime: '606 min',
    Genre: 'Sport',
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'Adnan Al-Kaissy, Lou Albano, Muhammad Ali, André the Giant',
    Plot: 'N/A',
    Language: 'English',
    Country: 'USA',
    Awards: 'N/A',
    Poster: 'N/A',
    Metascore: 'N/A',
    imdbRating: '7.3',
    imdbVotes: '134',
    imdbID: 'tt1045621',
    Type: 'movie',
    Response: 'True',
    Sentiment: { confidence: '50.0000', sentiment: 'Neutral' } } ]



var movies = [ { Title: 'The Incredible Hulk',
    Year: '2008',
    imdbID: 'tt0800080',
    Type: 'movie' },
  { Title: 'Hulk',
    Year: '2003',
    imdbID: 'tt0286716',
    Type: 'movie' },
  { Title: 'Hulk Vs.',
    Year: '2009',
    imdbID: 'tt1325753',
    Type: 'movie' },
  { Title: 'Planet Hulk',
    Year: '2010',
    imdbID: 'tt1483025',
    Type: 'movie' },
  { Title: 'The Incredible Hulk Returns',
    Year: '1988',
    imdbID: 'tt0095368',
    Type: 'movie' },
  { Title: 'The Trial of the Incredible Hulk',
    Year: '1989',
    imdbID: 'tt0098512',
    Type: 'movie' },
  { Title: 'The Death of the Incredible Hulk',
    Year: '1990',
    imdbID: 'tt0099387',
    Type: 'movie' },
  { Title: 'Iron Man & Hulk: Heroes United',
    Year: '2013',
    imdbID: 'tt3221698',
    Type: 'movie' },
  { Title: 'Hollywood Hulk Hogan: Hulk Still Rules',
    Year: '2002',
    imdbID: 'tt0365349',
    Type: 'movie' },
  { Title: 'Hulk Hogan: The Ultimate Anthology', Year: '2006', imdbID: 'tt1045621', Type: 'movie' } ];

console.log(movies);

var square = function (num, doneCallback) {
  // Call back with no error and the result of num * num
  
  return doneCallback(null, num.imdbID);
};

// Square each number in the array [1, 2, 3, 4]
async.map(movies, square, function (err, results) {
  // Square has been called on each of the numbers
  // so we're now done!
  console.log("Finished!");
  console.log(results);
});

// Square each number in the array [1, 2, 3, 4]
async.each([1, 2, 3, 4], square, function (err) {
  // Square has been called on each of the numbers
  // so we're now done!
  console.log("Finished!");
});


function movieInfo(movieList, callback) {
	var allMovies = []
	for (var movie in movieList) {
		//console.log(movieList[movie].Title);
		func.getMovieInfo(movieList[movie].imdbID, function (err, data) {
			func.classifyText(data.Plot, function (err, data) {
				//console.log(data)
			})
			allMovies.push(data);
			console.log(allMovies);
		});
		//console.log(allMovies);
	}
	callback(allMovies);
	//console.log(allMovies);
}
//console.log(movies[0].imdbID);
//movieInfo(movies, function (allMovies) {
//	console.log(allMovies);
//});


var translate = function (txt, callback) {
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
	    		console.log("Success");
	    		body = JSON.parse(body);
			} catch (error) {
				console.log("error");
				//callback(Error("Response body is not valid JSON: " + body), null);
			return;
			}
			translate(body, "Jeg heter Roger", "no", "en", function (error, data) {
				if (error) {
					console.log(error);
				} else {
					console.log(data);
				}
			});
			//console.log(body);
			//callback(null, body);
		} else {
			//callback(Error(body.message), body);
			console.log(Error(body.message), body);
		}
	});
};

// http%3a%2f%2fschemas.xmlsoap.org%2fws%2f2005%2f05%2fidentity%2fclaims%2fnameidentifier=92209877&http%3a%2f%2fschemas.microsoft.com%2faccesscontrolservice%2f2010%2f07%2fclaims%2fidentityprovider=https%3a%2f%2fdatamarket.accesscontrol.windows.net%2f&Audience=http%3a%2f%2fapi.microsofttranslator.com&ExpiresOn=1441705329&Issuer=https%3a%2f%2fdatamarket.accesscontrol.windows.net%2f&HMACSHA256=0%2fUfW1lHbayb2NadgnO1AdJnczAHy9%2bARZFgWwVa7ts%3d
// http%3a%2f%2fschemas.xmlsoap.org%2fws%2f2005%2f05%2fidentity%2fclaims%2fnameidentifier=92209877&http%3a%2f%2fschemas.microsoft.com%2faccesscontrolservice%2f2010%2f07%2fclaims%2fidentityprovider=https%3a%2f%2fdatamarket.accesscontrol.windows.net%2f&Audience=http%3a%2f%2fapi.microsofttranslator.com&ExpiresOn=1441705384&Issuer=https%3a%2f%2fdatamarket.accesscontrol.windows.net%2f&HMACSHA256=5NiC3M%2b0du8pwPejyGBJcMtAgeNJbwn2XdzI%2b1yT5gI%3d
var translate = function (token, text, from, to, callback) {
	console.log(token);
	var uri = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + encodeURIComponent(text) + "&from=" + from + "&to=" + to;
	var authToken = "Bearer" + " " + "http%3a%2f%2fschemas.xmlsoap.org%2fws%2f2005%2f05%2fidentity%2fclaims%2fnameidentifier=92209877&http%3a%2f%2fschemas.microsoft.com%2faccesscontrolservice%2f2010%2f07%2fclaims%2fidentityprovider=https%3a%2f%2fdatamarket.accesscontrol.windows.net%2f&Audience=http%3a%2f%2fapi.microsofttranslator.com&ExpiresOn=1441705329&Issuer=https%3a%2f%2fdatamarket.accesscontrol.windows.net%2f&HMACSHA256=0%2fUfW1lHbayb2NadgnO1AdJnczAHy9%2bARZFgWwVa7ts%3d";


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
					callback(Error("Response body is not valid JSON: " + body), null);
					return;
				} else {
					console.log(result.string)
					var translation = result.string._;
					console.log(translation)
					callback(null, translation);
				}
			});
		} else {
			callback(Error(body.message), body);
		}
	});	
}


var alt = [];

// var en function (callback) {
// 	callback("en");
// }
// var to function (callback) {
// 	callback("to");
// }
// var tre function (callback) {
// 	callback("tre");
// }

// var resultat function (err, data) {
// 	console.log(data)
// }


async.parallel([
  function(callback) {
    setTimeout(function() {
      console.log("Task 1");
      callback(null, 1);
    }, 500);
  },
  function(callback) {
    setTimeout(function() {
      console.log('Task 2');
      callback(null, 2);
    }, 200);
  },
  function(callback) {
    setTimeout(function() {
      console.log('Task 3');
      callback(null, 3);
    }, 100);
  }
], function(error, results) {
  console.log(results);
});

var func = require('./func.js');


var movieSearch = testMovies[0].Title;
var langCode = 'Norwegian';
testMovies[0].Subtitles = SelectedLanguage = 'Norvegian';

func.getSubtitle(testMovies[0], function (err, data) {
	console.log(data);
})











