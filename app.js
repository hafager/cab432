/**
 * @author Léo Unbekandt
 */

var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  var ip = req.ip;
  var request = require('request');
  request('freegeoip.net/json/' + ip, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('index', { address: body });
    }
  })
  res.render('index', { address: ip });
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})

