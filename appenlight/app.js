/*
var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function (req, res) {
    res.render('index.html');
});

var server = app.listen(3500, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
*/
var restify = require("restify");
var Errormator = require("errormator");
var reporter = new Errormator({
    api_key: "6f4e7f5a250545418de44b1b2ad0b3e9"
});

var server = restify.createServer({
        name: "Test errormator",
        version: "1.0.0"
});

// Config the reporter
reporter.restify(server, {});

// More restify configuration like (server.use)
server.use(restify.requestLogger({}));
server.use(restify.authorizationParser());
server.use(restify.bodyParser({mapParams: false }));

server.get( "/fun", function(req, res, next){ 
    // Should not raise an error
    res.send({ok: true});
});

server.get( "/no_fun", function(req, res, next){ 
    // Will raise an error

    null.undefinedFunction();
    res.send({ok: false});
});
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.version);
});
