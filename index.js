var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require('./routes/index');

app.use('/', routes);


app.listen(3000, (err) =>{
	if (err) {
		console.log("err in listen");
		throw err;
	}
	console.log("Listening on port 3000");
});