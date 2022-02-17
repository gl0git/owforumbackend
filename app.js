var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./models/userModel')
const Post = require('./models/postModel')
const Category = require('./models/categoryModel')
const Comment = require('./models/commentModel')

const mongoDB = 'mongodb+srv://MongoDefault123:mongoguy123@cluster0.psbdm.mongodb.net/forum?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authenticateToken = (req, res, next) => {
  const token = req.headers.token 

  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      console.log(err)
      return res.status(403)
    }
    req.user = user
    next()
  })
}

app.get('/favicon.ico', (req, res) => {
  res.status(204);
})

app.get('/categories', (req, res) => {
  Category.find({}, (err, categories) => {
    if (err) {
      console.log(err); 
      res.status(500).send();
    } else {
      res.json({"categories": categories})
    }
  })
})

app.get('/', authenticateToken, (req, res) => {
  res.json({user: req.user})
})

app.get('/login', (req, res) => {
  res.render('log-in')
})

app.post('/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      return res.status(400).send()
    }
    if (!user) {
      return res.json({message: 'Incorrect Username'})
    }
    if (user.password != req.body.password) {
      return res.json({message: 'Incorrect Password'})
    } else {
      const user = { name: req.body.username, password: req.body.password }
      const accessToken = jwt.sign(user, 'secret')
      res.json({username: 'hello', accessToken: accessToken})
    }
  })
})

app.get('/signup', (req, res) => {
  res.render('sign-up')
})

app.post('/signup', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  }).save(err => {
    if (err) {
      return next(err)
    }
  })
})

app.get('/post/:id', (req, res) => {
  console.log(req.params.id)
  Post.find({_id: req.params.id}, (err, post) => {
    if (err) {
      console.log(err)
    }
    res.json({post: post[0]})
  })  
})

app.get('/:category', (req, res) => {
  Post.find({category: `${req.params.category}`}, (err, posts) => {
    if (err) {
      console.log(err)
    }
    console.log(req.params)
    console.log(posts)
    res.json({posts: posts})
  })
})

app.post('/:category/newpost', authenticateToken, (req, res) => {
  const post = new Post({
    username: req.user.name,
    date: new Date(),
    title: req.body.title,
    message: req.body.message,
    category: req.params.category
  }).save(err => {
    if (err) {
      return next(err)
    }
  })
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
