const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const validate = require('./middlewares/regValidation');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Article = require('./models/Article')
// connecting mongoose
mongoose.connect('mongodb://localhost/blogdb', {useNewUrlParser: true})
  .then(() => console.log("connected to database"))
  .catch((err) => console.error(err))
// using body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
// static files
app.use(express.static(__dirname + '/public'));
// session middleware
app.use(session({secret: "dog cat", resave: false, saveUninitialized: true}))
// custom middlewares
app.use(require('./router/register')); // register Post route
app.use(require('./router/signin')); // signin Post route
app.use(require('./middlewares/isAuthenticated').declareUser);
app.use('*/user-*', require('./middlewares/isAuthenticated').checkUser)
app.use('*/article-*', require('./middlewares/isAuthenticated').checkUser)
// views
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')

// ---------------------------------------------------------------

// Start GET handling
app.get('/', function(req, res) {
  res.render('home', {
    signupErrs: req.session.validationErrors
  })
})

// signin
app.get('/signin', function(req, res) {
  res.render('signin', {
    errs: req.session.signinErrs,
    success: req.session.successSignup
  })
})

// create-article
app.get('/create-article/user-:userId', function(req, res) {
  if (!req.params.userId || req.params.userId == 'undefined') {
    return res.redirect('/signin')
  }

  User.findById(req.params.userId)
    .exec(function(err, user) {
      if (err) {
        console.error(err)
        return res.status(404).json({Error: err})
      }
      if (!user) {
        return console.error('require login')
      }

      res.render('create-article', {
        artErr: res.locals.articleError
      })
    })
})

// profile
app.get('/profile/user-:userId', function(req, res) {
  if (!req.params.userId || req.params.userId == 'undefined') {
    return res.redirect('/signin')
  }


  User.findById(req.params.userId)
    .exec(function(err, user) {
      if (err) {
        console.error(err)
        return res.status(404).json({Error: err})
      }
      if (!user) {
        return console.error('require login')
      }

      Article.find({author: user.name})
        .exec(function(err, articles) {
          res.render('profile', {
            user: user,
            articles: articles
          })
        })
    })
})

// article
app.get('/:author/article-:articleId', function(req, res) {
  
  User.findOne({name: req.params.author})
    .exec(function(err, user) {
      if (err) {
        return console.error(err)
      }
      if (!user) {
        return console.error('not found')
      }
      Article.findOne({_id: req.params.articleId})
        .exec(function(err, article) {
          if (err) {
            return console.error(err)
          }
          if (!article) {
            return console.error('article not found')
          }
          res.render('article', {
            author: req.params.author,
            article: article
          })    
        })
    })
})

// logout
app.get('/logout', function(req, res) {
  req.session.destroy()
  res.redirect('/')
})

// Start POST handling
app.post('/create-article/user-:userId', function(req, res) {
  const {title, articleBody} = req.body;
  if (!title || !articleBody) {    
    res.locals.articleError = 'title and body is required';
    return res.render('article-form')
  }

  User.findById(req.session.userSession)
    .exec(function(err, user) {
      if (err) {
        console.error(err)
        return res.status(404).json({Error: err})
      }
  
      if (!user) {
        return console.error('require login')
      }

      let article = new Article({
        author: user.name,
        title: title,
        articleBody: articleBody
      })
      
      article.save(function(err, article) {
        if (err) {
          return console.error(err)
        }
        res.redirect('/')
      })
    })


})
// End POST handling

app.listen(3000, function() {
    console.log("listening to 3000")
})