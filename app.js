/**
 * @author Léo Unbekandt
 */

 var express = require('express');
 var app = express();
 var request = require('request');
 var func = require('./func.js');

 app.use(express.static(__dirname + '/public'));

 app.set('view engine', 'jade');

 app.get('/', function (req, res) {
 	var ip = req.ip;


 	// Synced version avoids callback hell.
 	var sync = require("./gensync");
	// If an `error` object is passed to resume it will throw an exception, so you probably want to try/catch around them!
	sync(function*(resume) {
		var loc = yield func.getLocationFromIP(ip, resume);
		var weather = yield func.getWeatherForLocation(loc, resume);

		res.render('index', {location: loc.city, temp: weather.current_observation.temp_c  })
	});	

	// res.render('index', { location: response.city });
})

 var server = app.listen(process.env.PORT || 3000, function () {
 	var host = server.address().address
 	var port = server.address().port
 	console.log('App listening at http://%s:%s', host, port)
 })

