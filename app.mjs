import './config.mjs'
import './db.mjs'
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import { db } from './db.mjs';
import {createRequire} from 'module';


// to get require() to work in ES6
const require = createRequire(import.meta.url);

require('./auth');
const passport = require('passport');


const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const Report = mongoose.model('Report');

const app = express();

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));


const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

/*
=====================
    FUNCITONS
=====================
*/

function filterPostsByKeyword(posts, keyword) {
  return posts.filter(post => post.title.toLowerCase().includes(keyword.toLowerCase()));
}

function addSummariesToPosts(posts) {
  return posts.map(post => {
    const content = post.content || ''; // Fallback to an empty string if content is undefined
    return {
      ...post.toObject(), // Convert Mongoose document to a plain object
      summary: content.split(" ").slice(0, 10).join(" ") + (content.length > 0 ? "..." : "")
    };
  });
}



/*
====================
      ROUTES
====================
*/

app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

app.get('/search', (req, res) => {
  const keyword = req.query.keyword; // Assuming the keyword is passed as a query parameter

  Post.find({})
    .then(posts => {
      const filteredPosts = filterPostsByKeyword(posts, keyword);
      res.render('searchResults', { posts: filteredPosts });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});


app.get('/', (req, res) => {
  Post.find(req.query)
    .then(posts => {
      const postsWithSummaries = addSummariesToPosts(posts);
      res.render('home', { posts: postsWithSummaries });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});


  app.get('/add-post', (req, res) => {
    res.render('addPost');
});

app.post('/add-post', (req, res) => {
    const newPost = new Post(req.body);
    newPost.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('An error occurred');
        }); 
});

app.get('/post/:postId', async (req, res) => {
  try {
      const post = await Post.findById(req.params.postId).populate('comments').exec();
      //res.send(post)
      res.render('viewPost', { post });
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
  }
});


app.get('/add-comment/:postId', (req, res) => {
  res.render('addComment', { postId: req.params.postId });
});


app.post('/add-comment/:postId', (req, res) => {
  const newComment = new Comment(req.body);
  newComment.save()
    .then(() => {
      return Post.findById(req.params.postId);
    })  
    .then((post) => {
      post.comments.unshift(newComment);
      return post.save();
    })
    .then(() => {
      res.redirect(`/post/${req.params.postId}`);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
});

app.get('/report-post/:postId', (req, res) => {
  res.render('reportPost', { postId: req.params.postId });
});


// ...

app.post('/report-post/:postId', async (req, res) => {
  try {
    const newReport = new Report({
      post: req.params.postId,
      reason: req.body.reason
    });
    await newReport.save();
    res.redirect('/'); // Or redirect to a 'report submitted' page
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// ...

app.get('/reported-posts', async (req, res) => {
  try {
    const reports = await Report.find().populate('post');
    res.render('reportedList', { reports });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// ...


// ...


app.listen(21121 ?? 3000);
