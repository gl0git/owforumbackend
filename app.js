var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoDB = 'mongodb+srv://MongoDefault123:mongoguy123@cluster0.psbdm.mongodb.net/Forum?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({message: 'hello', password: 'hi'})
})

app.get('/login', (req, res) => {
  res.render('log-in')
})

app.post('/login', (req, res) => {

})

app.get('/signup', (req, res) => {
  res.render('sign-up')
})

app.post('/signup', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  }).save(err => {
    if (err) {
      return next(err)
    }
    res.redirect('/newpost')
  })
})

app.get('/newpost', (req, res) => {
  res.render('newpost')
})

app.get('/newcomment', (req, res) => {
  
})

app.post('/newcomment'), (req, res) => {

}

app.get('/:category', (req, res) => {
  res.render(`${req.params.category}`, {posts: req.params.category.posts})
})

const posts = []
app.post('/:category/newpost', (req, res) => {
  const post = new Post({
    username: req.body.username,
    date: new Date(),
    title: req.body.title,
    message: req.body.message,
    category: req.params.category
  })
  req.params.category.posts.push(post)
  res.redirect('/posts')
})

app.get('/post/:id'), (req, res) => {
  res.render('post', {post: req.params.id})
}

app.get('/posts', (req, res) => {
  res.render('posts', {posts: posts})
})

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
