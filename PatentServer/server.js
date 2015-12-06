// import module
var http = require("http");
var express = require("express");
var hbs = require("hbs");
var app = express();

// instantiate express , server
//app.set('view engine','html');
app.engine('html',hbs.__express);



var routes = require("./routes")(app);
var server = http.createServer(app);


// Set Static Files 
app.use(express.static("PatentSearch"));



server.listen(8124,"10.120.30.18",function(){
	console.log("Server running at http://10.120.30.18:8124")
});



