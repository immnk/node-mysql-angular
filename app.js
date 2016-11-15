
//This is the place where server is started.

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mysql = require('mysql');
var ejs = require('ejs');
var path = require('path');
var session = require('client-sessions');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// This is used to serve the static files from the app directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    cookieName: 'session',
    secret: 'mySecretKey',
    duration: 30*60*1000,
    active: 5*60*1000,
}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'userdata',
    multipleStatements: true
});

app.connection = connection;
app.connection.connect(function(err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
});
app.connection.query('USE userdata');
var routes = require("./routes/routes.js")(app);

// app.use('/js', express.static(__dirname + '/js'));
// app.use('/bower_components', express.static(__dirname + '/bower_components'));
// app.use('/css', express.static(__dirname + '/css'));
// app.use('/templates', express.static(__dirname + '/templates'));

// Load the home page on /
app.get('/', function(req, res) {
    ejs.renderFile('./views/homepage.ejs', function(err, result) {
        if (!err) {
            res.end(result);
        } else {
            res.end("An error occurred");
            console.log(err);
        }
    });
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function() {
    console.log("Listening on port %s...", server.address().port);
});
server.on('error', onError);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
