const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConfig = require('./db');
const cors = require('cors');
const expressValidator = require('express-validator')
var passport = require('passport');
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
const methodOverride = require('method-override');

const app = express();
 
var index = require('./routes/index')
var users = require('./routes/users')
var auth = require('./routes/auth');

mongoose.connect(dbConfig.DB, {useNewUrlParser: true, useFindAndModify: false}).then(
  ()=> {
    console.log('db is connected')
  },
  err=> {
    console.log('could not connect to db: ' + err)
  }
);

app.use(expressValidator());
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
    parameterLimit: 1000000
  })
);
app.set('view engine', 'ejs')
app.use(cors({origin: "*"}));
// app.use(bodyParser.json());



app.use(methodOverride(function(req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
 
app.use(cookieParser('keyboard cat'))
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())
 
app.use(passport.initialize());
app.use(passport.session());

 
app.use('/', index)
app.use('/users', users);
app.use('/auth', auth);

 
app.use((req, res, next) => {
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});