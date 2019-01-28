var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser("mysession"));
app.use(session({
	secret: "mysession", //与cookieParser中的一致
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	if (req.path == "/login" && req.body.username != null && req.body.password != null) {
		next();
	}
	else {
		if (req.path != "/login.html" && req.session.user == null) {
			res.redirect("/login.html");
		}
		else {
			next();
		}
	}
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;