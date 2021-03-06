var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors= require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apisRouter = require('./routes/media');
var commentRouter = require('./routes/comment');
var mentorRouter = require('./routes/mentors');
const mongoose = require('mongoose');


const uri = 'mongodb+srv://viralshukhu:shukhu10@cluster0-jjzs7.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true});
mongoose.connection.on('open',()=>{
  console.log("Connected");
},
()=>{
  console.log("Failed");
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/media', apisRouter);
app.use('/api/comment', commentRouter);
app.use('/api/mentor', mentorRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
