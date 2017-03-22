var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var state = require('express-state');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var passport = require('passport');
var mongoose = require('mongoose');

var hbs = require('./lib/exphbs'),
    routes = require('./routes'),
    middleware = require('./middleware'),
    config = require('./config'),
    utils = require('./lib/utils');

dotenv.load();

var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var dashboardController = require('./controllers/dashboard');
var backPanelController = require('./controllers/backpanel');
var tasksController = require('./controllers/tasks');

// Passport OAuth strategies
require('./config/passport');

var app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

//Setup Express App
state.extend(app);
app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
app.enable('view cache');

//Create an empty Data object and expose it to the client. This
//will be available on the client under App.Data.
app.set('state namespace', 'App');
app.expose({}, 'Data');

// Set Port
app.set('port', process.env.PORT || 80);

// Setup Logger
app.use(logger('dev'));

router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

// Parse cookies.
app.use(cookieParser());

// Setup Validation
app.use(expressValidator());

// Setup Method Override
app.use(methodOverride('_method'));

// Session Handling
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Flash Message Support
app.use(flash());

//GZip Support
app.use(compression());

// Specify the public directory.
app.use(express.static(config.dirs.pub));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// Use the router.
app.use(router);

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

router.get('/', HomeController.index);
router.get('/documentation', HomeController.documentation);
router.get('/account', userController.ensureAuthenticated, userController.accountGet);
router.put('/account', userController.ensureAuthenticated, userController.accountPut);
router.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/forgot', userController.forgotGet);
router.post('/forgot', userController.forgotPost);
router.get('/reset/:token', userController.resetGet);
router.post('/reset/:token', userController.resetPost);
router.get('/logout', userController.logout);
router.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
router.get('/dashboard', userController.ensureAuthenticated, dashboardController.index);
router.post('/dashboard/newToken', userController.ensureAuthenticated, dashboardController.newToken);
router.get('/backpanel', userController.ensureAdmin, backPanelController.index);
router.get('/backpanel/completed', userController.ensureAdmin, backPanelController.indexCompleted);
router.get('/backpanel/annotate/:id', userController.ensureAdmin, backPanelController.annotate);
router.post('/backpanel/complete/:id', userController.ensureAdmin, backPanelController.complete);

// API
router.post('/api/task/annotation', tasksController.newTask)

// The exposeTemplates() method makes the Handlebars templates that are inside /shared/templates/
// available to the client.
router.get('/', [middleware.exposeTemplates(), routes.render('home')]);

// Production error handler
if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}

// // Error handling middleware
// app.use(function(req, res, next) {
//     res.render('404', { status: 404, url: req.url });
// });

// app.use(function(err, req, res, next) {
//     res.render('500', {
//         status: err.status || 500,
//         error: err
//     });
// });


app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
