var librato = require('librato-node');
var email = 'cvnoob@gmail.com';
var token = '5bb6729c3e13085b004f038c547ce27b79b609f51215008bd9cb8ff95ed5d04';
librato.configure({email: email, token: token});
//librato.start();

//process.once('SIGINT', function() {
//  librato.stop(); // stop optionally takes a callback
//});
librato.increment('CPU Metric');
librato.timing('CPU Metric', 500);
librato.measure('CPU Metric', 3829);
