var express = require('express');
var i18n = require('i18n');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var csrf = require('csurf');

var config = require('./config');
var router = require('./routes/users');

var app = express();

// configuration
app.config = config;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// db
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  // mongodb connected!
  console.log("mongodb", config.mongodb.uri, "connected");
});
// models
require('./models/models')(app, mongoose);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cryptoKey));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.cryptoKey,
  store: new mongoStore({ url: config.mongodb.uri })
}));

console.log(__dirname + '/locales');

// i18n
i18n.configure({
  locales:['en', 'zh'],
  directory: __dirname + '/locales',
  autoReload: true,
  updateFiles: false,
  objectNotation: true,
  queryParameter: 'lang'
});
app.use(i18n.init);

app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: { signed: true } }));
//app.use(csrf());

// locals
app.use(function(req, res, next) {
  res.cookie('_csrfToken', req.csrfToken());
  res.locals.user = {};
  res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
  res.locals.user.username = req.user && req.user.username;
  next();
});

// passport
require("./utils/passport/passport")(app, passport);

// router
app.use(express.static(path.join(__dirname, 'public')));
app.use('/blog', express.static(path.join(__dirname, 'linkgoBlog/public')));
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.utility = {};
app.utility.sendmail = require('./utils/sendmail');
app.utility.slugify = require('./utils/slugify');
app.utility.workflow = require('./utils/workflow');

app.listen(4000, function() {
});

module.exports = app;
