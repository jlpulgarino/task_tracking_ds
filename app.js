var env = process.env.NODE_ENV || "development";
var config = require('./config/');

var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Used for passport
var flash    = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var moment = require('moment');
//Template
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var wrap = require('gulp-wrap');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var minifyCss = require('gulp-cssnano');
var minifyJs = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-htmlmin');
var service = require('gulp-service');

var paths = {
    scripts: 'src/js/**/*.*',
    styles: 'src/less/**/*.*',
    images: 'src/img/**/*.*',
    templates: 'src/templates/**/*.html',
    index: 'src/index.html',
    bower_fonts: 'src/components/**/*.{ttf,woff,eof,svg}',
};



moment.locale('es');

var app = express();

/*var jobs = require('./services/cron');*/

var DEFAULT_MAX_AGE = 60 * 60 * 1000;


//jobs.iniciarTrabajos();
/*app.use(function(req, res, next) {
	if (req.originalUrl.indexOf("index") > -1)
		console.log("X-Frame-Options REQUEST URL:", req.originalUrl);
	res.setHeader('X-Frame-Options', "Deny");
	next();
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
 require('./config/passport')(passport); // pass passport for configuration

if (config.server.allowCORS) {
    var cors = require('cors');
    app.use(cors({
        origin: 'http://localhost:3000',
				credentials: true
    }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/views')));


//used for passport
app.use(session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: app.get('env') !== 'development',
        httpOnly: true,
        maxAge: DEFAULT_MAX_AGE
    },
    rolling: true
}));

// Put it before use static routes to visualize GETs of resources
app.use(logger('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    //console.log("Tiempo de sesión I", req.session.cookie);
    /*req.session.cookie.expires = new Date(Date.now() + DEFAULT_MAX_AGE);
    req.session.save(function(err) {
    	// session saved
    });*/
    req.session.touch();
    //console.log("Tiempo de sesión F", req.session.cookie);
    next();
});

app.use('/', require('./routes/index'));
fs
    .readdirSync("./routes")
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var name = file.replace('.js', '');
        app.use('/api/' + name, require('./routes/' + file));
    });

//Template
/*
app.use(function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat'],
        }))
        .pipe(gulp.dest('dist/'));
});

app.use(function() {
    return gulp.src(paths.bower_fonts)
        .pipe(rename({
            dirname: '/fonts'
        }))
        .pipe(gulp.dest('dist/lib'));
});

app.use(function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});

app.use(function() {
    return gulp.src(paths.scripts)
        .pipe(minifyJs())
        .pipe(concat('dashboard.min.js'))
        .pipe(gulp.dest('dist/js'));
});

app.use(function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});


app.use(function() {
    return gulp.src(paths.templates)
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist/templates'));
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
    console.error("ERROR APP: ", err.message, err.stack);
    res.status(err.status || 520);
    res.send({
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
    });
});


module.exports = app;
