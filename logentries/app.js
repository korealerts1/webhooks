var logentries = require('le_node');
var log = logentries.logger({
  token:'LOGENTRIES_TOKEN'
});
// level specific methods like 'info', 'debug', etc.
log.info("I'm a Lumberjack and I'm OK");

// generic log method, also accepts JSON entries
log.log("debug", {sleep:"all night", work:"all day"});
