
/**************************************************************
************ Install relevant libraries ***********************
***************************************************************/

// Express: a web framework to use HTTP methods like GET, POST, PUT, DELETE
const express = require('express');
// Library to read data from a form
const bodyParser = require('body-parser');
// Library to read all GET, POST requests made by users
const morgan = require('morgan');
// Library to fetch APIs
const request = require('request');
const async = require('async');
// instantiate express
const app = express();
// templating engine
const expressHbs = require('express-handlebars');
// in-memory store
const session = require('express-session');
// datastore for session
const MongoStore = require('connect-mongo')(session);
// renders messages to the user when user enters info in fields
const flash = require('express-flash')



// set engine
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: 'hbs' })); // see (must match) ../layouts/layouts.hbs
app.set('view engine', 'hbs');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // parser to read JSON datatype
app.use(bodyParser.urlencoded({ extended: false})); // reads all characters computer can read
app.use(morgan('dev')); // reads all requests user has
// must set session if want to use flash
app.use(session({
  resave: true, // save session in session store
  saveUninitialized: true,
  secret: "albusajsjsj",
  store: new MongoStore({ url: 'mongodb://admin:adminpw@ds159662.mlab.com:59662/alchemynewsletter' })
}));
app.use(flash());

// api key
// --url 'https://us16.api.mailchimp.com/3.0/lists/411a1a90a9/members

app.route('/')
  .get((req, res, next) => {
    res.render('main/home', { message: req.flash('success') });
  })
  .post((req, res, next) => {
    // capture user's email
    // console.log(req.body.email);
    request({
      url: 'https://us16.api.mailchimp.com/3.0/lists/411a1a90a9/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser 7cfd3e00e3e5bc0102c8fd2f0162897d-us16',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address': req.body.email,
        'status': 'subscribed'
      }
    }, function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Email successfully submitted');
        res.redirect('/');
      }
    });
  });


// assign port; handle error
app.listen(3030, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on Port 3030")
  }
});
