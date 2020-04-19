var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Recipe = require('./models/recipe'),
	seedDB = require('./seeds'),
	Comment = require('./models/comment'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	User = require('./models/user'),
	config = require('./config.json');

//Require route files
var commentRoutes = require('./routes/comments'),
	recipeRoutes = require('./routes/recipes'),
	indexRoutes = require('./routes/index');

//Localhost mongodb
mongoose
	.connect('mongodb://localhost/recipeApp', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to db');
	})
	.catch((err) => {
		console.log('error: ' + err.message);
	});

//MongoDB Atlas db
// mongoose
// 	.connect(config.database_url, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useFindAndModify: false,
// 		useCreateIndex: true
// 	})
// 	.then(() => {
// 		console.log('Connected to db');
// 	})
// 	.catch((err) => {
// 		console.log('error: ' + err.message);
// 	});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//Enable PUT requests
app.use(methodOverride('_method'));

//To seed the Database, uncomment following function, for details see file seeds.js
//seedDB();

//Passport configuration
app.use(
	require('express-session')({
		secret: config.session_secret,
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware that runs on every route - This adds the user object to every template
// req.user is either empty or containing username and id for the currently logged in user
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//Use routers
app.use(indexRoutes);
app.use(recipeRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, function() {
	console.log('RecipeApp listening on port' + process.env.PORT + ' ...');
});
