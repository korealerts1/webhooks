var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bugsnag = require('bugsnag');
//bugsnag.register("48d2b7a0513ed319c58013456ba749ef");
bugsnag.register("c9e4b90e8cba61a67a38dd86f15c4264");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.render('index.html');
});
app.post('/', function(req, res){
    var errorName = req.body.errorName;
    function SridharNew(message) {
      this.name = 'Error';
      this.message = message||'Bugsnag random error';
    }
    SridharNew.prototype = Object.create(Error.prototype);
    SridharNew.prototype.constructor = SridharNew;
    function reportError(name){
        try {
            throw new SridharNew(name);
        } catch(e) {
            bugsnag.notify(e);
            console.log('Reported ' + name +' to bugsnag');
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
