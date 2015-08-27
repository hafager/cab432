var request = require('request');

exports.getLocationFromIP = function (ip, callback) {
	var url = 'http://freegeoip.net/';

	// http://freegeoip.net/json/{ip}
	// request( url + ip, function (error, response, body) {
	request('http://freegeoip.net/json/220.245.18.248', function (error, response, body) {
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
	var country_code = location.country_code;
	var city = location.city;
	var url = 'http://api.wunderground.com/api/4b52aa55f2243ff8/conditions/q/';

	// http://api.wunderground.com/api/4b52aa55f2243ff8/conditions/q/{country_code}/{city}.json
	var weather = request( url + country_code + '/' + city + '.json', function (error, response, body) {
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