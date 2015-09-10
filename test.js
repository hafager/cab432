var request = require('request');
var xmlParseString = require('xml2js').parseString;


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

