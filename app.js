var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var colors = require('colors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var url = require('url');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var models  = require('./models');
var routes = require('./routes/routes');
var api = require('./routes/api');


/* OLD SERIALZATION WITH DB
// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id).then(function(user) {
    console.log(user.get({plain: true}));
    console.log("deserializing the user".green);
    if (!user) { 
      return done(null, false, { message: 'Unknown user ' + username }); 
    }
    return done(null, user);
  }).catch(function(error) {
    // Ooops, do some error-handling
    return done(error);
  })
});
*/

passport.serializeUser(function(user, done){
  var sessionUser = { id: user.id, username: user.username, email: user.email}
  done(null, sessionUser)
});

passport.deserializeUser(function(sessionUser, done){
  // The sessionUser object is different from the user mongoose collection
  // it's actually req.session.passport.user and comes from the session collection
  console.log(colors.green('Deserialized User is '+sessionUser.username));
  console.log(colors.green('Deserialized ID is '+sessionUser.id));
  console.log(colors.green('Deserialized email is '+sessionUser.email));

  done(null, sessionUser)
});


// Use the LocalStrategy within Passport.
passport.use(new LocalStrategy(
  function(username, password, done) {      
    // search for attributes
    models.User.findOne({ 
      where: {'username': username} 
    }).then(function(user) {
      if (!user) {
        //console.log("Login failed: Not a user".red); 
        return done(null, false, { message: 'Unknown user ' + username }); 
      }
      if (user.password != password) { 
        //console.log("Login failed: Wrong password".red); 
        return done(null, false, { message: 'Invalid password' }); 
      }
      console.log("Login succeeded".green); 
      return done(null, user);
    }).catch(function(error) {
      // Ooops, do some error-handling
      return done(error);
    })
  }
));




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var redisURL = url.parse(process.env.REDISCLOUD_URL);
//console.log(colors.red("Redi password: " + redisURL.auth.split(/:/)[1]));
app.use(session({
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisURL.auth.split(/:/)[1]
  }),
  secret: 'af7GJfn57fsAhb67'
}));
// Remember Me middleware
app.use( function (req, res, next) {
  if ( req.method == 'POST' && req.url == '/api/login' ) {
    // 30*24*60*60*1000 Rememeber 'me' for 30 days
    req.session.cookie.maxAge = 2592000000;
  }
  next();
});
app.use(flash());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Sets up the routers
app.use('/', routes);

app.post('/api/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login-signup',
                                   failureFlash: true })
);

app.get('/logout', function(req, res){
  req.logout();
  console.log("Logged out successfully".green);
  res.redirect('/');
});

app.use('/api', api);

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


module.exports = app;
