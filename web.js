var express = require("express");
app = express();
var logfmt = require("logfmt");
app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/client'));
var port = Number(80);

app.listen(port, function() {
    console.log("Listening on " + port);
});