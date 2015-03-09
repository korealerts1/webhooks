var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var rollbar = require('rollbar');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(rollbar.errorHandler('411d986e3f3547e6ac504f0106392f8e'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.render('index.html');
});
app.post('/', function(req, res){
    var errorName = req.body.errorName || 'Standard error';
    var level = req.body.errorLevel || 'info';
    function FinalTesting(message) {
      this.name = message||'Rollbar';
      this.message = 'Rollbar random error';
    }
    FinalTesting.prototype = Object.create(Error.prototype);
    FinalTesting.prototype.constructor = FinalTesting;
    function reportError(name, level){
        var callback = function(errors){
            if (errors){
                console.log("Error occurred while reporting");
            }
            else {
                console.log("Successfully reported error to Rollbar");
            }
        };
        try {
            throw new FinalTesting(name);
        } catch(e) {
            rollbar.handleErrorWithPayloadData(e, {level: level}, req, callback);
        }
    }
    reportError(errorName);
    res.send('success');
});
var server = app.listen(3500, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Rollbar app listening at http://%s:%s', host, port);
});
