var express = require('express');
var bodyParser = require('body-parser');
var raygun = require('raygun');
var app = express();
var raygunClient = new raygun.Client().init({apiKey: 'OGPECjWo7B7eyKT8lwFbVg=='});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(raygunClient.expressHandler);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.render('index.html');
});
app.post('/', function(req, res){
    var errorName = req.body.errorName;
    function SridharNew(message) {
      this.name = message||'Error';
      this.message = 'Bugsnag random error';
    }
    SridharNew.prototype = Object.create(Error.prototype);
    SridharNew.prototype.constructor = SridharNew;
    function reportError(name){
        try {
            throw new SridharNew(name);
        } catch(e) {
            raygunClient.send(e, {level: 'warning'}, function(response){
                console.log('Reported ' + name +' to raygun');
            });
        }
    }
    reportError(errorName);
    res.send('success');
});
var server = app.listen(3500, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
