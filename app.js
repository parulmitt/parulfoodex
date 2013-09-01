//Parul Foodex App

var express     = require('express');
var nodemailer  = require('nodemailer');
var http        = require('http');
var MemoryStore = require('connect').session.MemoryStore;
var app         = express();
var dbPath      = 'mongodb://localhost/parulfoodex';
var fs          = require('fs');
var events      = require('events');

// http server
app.server      = http.createServer(app);

// event dispatcher
var eDispatcher = new events.EventEmitter();
app.addEventListener = function ( eventName, callback ) {
  eDispatcher.on(eventName, callback);
};
app.removeEListener = function( eventName, callback ) {
  eDispatcher.removeListener( eventName, callback );	
};
app.triggerE = function( eventName, eventOptions ) {
  eDispatcher.emit( eventName, eventOptions );
};

//   session store for sharing between methods
app.sessionStore = new MemoryStore();

// Importing data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Importing models
var models = {
  Account: require('./models/Account')(app, config, mongoose, nodemailer)
};

app.configure(function(){
  app.sessionSecret = 'Parul Foodex secret key';
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid',
    store: app.sessionStore
  }));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)(app, models);
});

app.get('/', function(req, res){
  res.render('index.jade');
});

app.post('/contacts/find', function(req, res) {
  var searchStr = req.param('searchStr', null);
  if ( null == searchStr ) {
    res.send(400);
    return;
  }

  models.Account.findByString(searchStr, function onSearchDone(err,accounts) {
    if (err || accounts.length == 0) {
      res.send(404);
    } else {
      res.send(accounts);
    }
  });
});

app.server.listen(8080);
console.log("Parul Foodex is listening to the port 8080........");
