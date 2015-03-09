var raven = require('raven');

var client = new raven.Client('https://5cebe4da13d445a3a851caadfa32008d:482ff817487f4ed1a2ecad78a579fc5f@app.getsentry.com/38922');
client.patchGlobal();
// record a simple message
//client.captureMessage('new first message, trigger webhook!', {tags: {checking: 'checking'}});

// capture an exception
client.captureError(new Error('Uh oh!! Error Occurrened'));
