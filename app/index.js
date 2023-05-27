//Includes Dependencies
var env = require('./config/env');
var auth = require('./auth');

//Includes Specific Libraries
var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

//Initializes App and Router
var app = express();
const router = express.Router();
const urlEncoder = bodyParser.urlencoded({ extended: true });
const bodyParserJSON = bodyParser.json();
var corsOptions = {
    origin: env.request_origin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

//Adds Controller Files
var UserController = require('./controllers/UserController');
var TaskController = require('./controllers/TaskController');
var ProjectController = require('./controllers/ProjectController');
var TeamController = require('./controllers/TeamController');

app.use(cors(corsOptions))

//Middleware for post requests.
app.post(urlEncoder, bodyParserJSON, (req, res, next) => next());
app.put(urlEncoder, bodyParserJSON, (req, res, next) => next());

/**
 * Middleware for all requests.
 */
app.use(function(req, res, next) 
{
    //Public URLs
    if (req.url == '/admin/users/login')
    { 
        next(); 
    }
    //Authenticated Area
    else 
    { 
        auth(req, res, next);
    }
});

//Defines Routes
app.use('/admin/users', UserController);
app.use('/admin/tasks', TaskController);
app.use('/member/tasks', TaskController);
app.use('/admin/projects', ProjectController);
app.use('/member/projects', ProjectController);
app.use('/admin/teams', TeamController);
//Listens
var server = app.listen(env.port, function() {
    console.log('Express server listening on port ' + env.port);
});

module.exports = app;