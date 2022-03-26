
const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser')
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
app.use(cookieParser());

// authenticate and login functions
// require the .env file

require('dotenv').config();


app.use(express.static('./public_html'));


TIMEOUT = 500000;
var sessions = {};

/**
 * This function checks whether an user has permission to be logged in
 * at that time. If the user stays more than 500 seconds, their
 * session gets deleted. We are using the setInterval function
 * to run this function every 2 seconds.
 *
 */
function filterSessions() {
  let now = Date.now();
  for (e in sessions) {
    if (sessions[e].time < (now - TIMEOUT)) {
      console.log("logged out");
      delete sessions[e];
    }
  }
}
setInterval(filterSessions, 2000);

/**
 * This function deletes an user from a session.
 * @param {String} username, username of the user
 */

function loggedOut(username){
  delete sessions[username];
}

/**
 * This function logs a user into the session by putting their username
 * and a session ID into the session.
 * @param {String} username , username of the user
 * @param {Number} sessionKey, a randomly generated number
 * @returns the session key
 */
function putSession(username, sessionKey) {
  if (username in sessions) {
    sessions[username] = {'key': sessionKey, 'time': Date.now()};
    return sessionKey;
  } else {
    let sessionKey = Math.floor(Math.random() * 1000);
    sessions[username] = {'key': sessionKey, 'time': Date.now()};
    return sessionKey;
  }
}

/**
 * This function checks if a user is legally in a session
 * @param {String} username , username of the user
 * @param {Number} sessionKey, a randomly generated number
 * @returns true/false based on the parameters
 */

function isValidSession(username, sessionKey) {
  if (username in sessions && sessions[username].key == sessionKey) {
    return true;
  }
  return false;
}

/**
 * This function uses cookies to check if the user is authenticated
 * or not
 * @param {*} req, HTTP request middleware function
 * @param {*} res, HTTP response middleware function
 * @param {*} next, callback argument for middleware function
 */
function authenticate(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
      let u = req.cookies.login.username;
      let key = req.cookies.login.key;
      if (isValidSession(u, key)) {
        putSession(u, key);
        res.cookie("login", {username: u, key:key}, {maxAge: TIMEOUT});
        next();
      } else {
        res.redirect('index.html');
      }
    } else {
      res.redirect('index.html');
    }
  }
  app.use('/welcome.html',authenticate);
/** HASHING CODE **/

/**
 * This function is used to get the hash + salt of a password using
 * the sha512 function
 * @param {String} password, password of the user
 * @param {Number} salt, a number to be added to the hash
 * @returns the hash of the password with salt
 */

function getHash(password, salt) {
  var cryptoHash = crypto.createHash('sha512');
  var toHash = password + salt;
  var hash = cryptoHash.update(toHash, 'utf-8').digest('hex');
  return hash;

}

/**
 * This function checks if the password is correct. It takes in the
 * account name and the password, uses getHash to hash and salt it,
 * then compares it with the found hash + salt from the database
 * @param {String} account, username of the user
 * @param {String} password , password of the user
 * @returns true/false value on whether the password is correct
 */

function isPasswordCorrect(account, password) {
  var hash = getHash(password, account.salt);
  return account.hash == hash;
}

/** END HASHING CODE **/

// all app.use calls go here

app.use(parser.text({type: '*/*'}));

app.use(parser.json())


// Create the schema
var Schema = mongoose.Schema;
var FreelancerSchema = new Schema({
  username: String,
  hash: String,
  salt: Number,
  name: String,
  personName: String,
  bio: String,
  contact: String,
  price: Number,
  class: String,
});
var Freelancer = mongoose.model('Freelancer', FreelancerSchema)

// mongodb code
const db  = mongoose.connection;
const mongoDBURL = process.env.MONGODB_URL;
mongoose.connect(mongoDBURL, { useNewUrlParser: true,
  useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// all get requests
app.get('/', (req, res) => { res.redirect('/index.html'); });
app.get('/testcookies', (req, res)=>{res.send(req.cookies);});

// this is a get request for logging in an user

app.get('/login/:username/:password/', (req, res) => {
  Freelancer.find({username : req.params.username}).exec(function(error, results) {
    if (results.length == 1) {
      //console.log(results[0]);
      var password = req.params.password;
      // checks password
      var correct = isPasswordCorrect(results[0], password);
      if (correct) {
        // puts the user in a session
          var sessionKey = putSession(req.params.username);
          res.cookie("login", {username: req.params.username, key:sessionKey},
          {maxAge: TIMEOUT});
          res.end(req.params.username);
      } else {
        res.end(false);
      }
    } else {
      res.end(false);
    }
  });
});

// this get request searches the database for matching service name,
// class of service, or name of the person themselves

app.get('/search/services/:keyWord', (req, res) => {
  Freelancer.find({ $or: [{name:{$regex: '.*'+req.params.keyWord+'.*'}},
  {class:{$regex: '.*'+req.params.keyWord+'.*'}},{bio:{$regex: '.*'+req.params.keyWord+'.*'}} ]})
    .exec(function (err, results) {
    if (err) return handleError(err);
    res.end(JSON.stringify(results));
  })
});

// this get request creates a new account that had not been created
// before. It also salts and hashes the password.

app.get('/create/:username/:password/:person/:name/:bio/:contact/:catagory/:price/',
(req, res) => {
  Freelancer.find({username : req.params.username}).exec(function(error, results) {
    if (!error && results.length == 0) {

      var salt = Math.floor(Math.random() * 1000000000000);
      var hash = getHash(req.params.password, salt);
      // new object S
      var free = new Freelancer({
        'username': req.params.username,
        'hash': hash,
        'salt': salt,
        'name': req.params.name,
        'personName': req.params.person,
        'bio': req.params.bio,
        'contact': req.params.contact,
        'class':req.params.catagory,
        'price': req.params.price

    });
    console.log(free);

    free.save(function (err) {
      if (err) { res.end('ERROR! Make sure you did not leave any fields empty.'); }
      else { res.end('Account created!')
    };
    });
  } else {
    res.end('Username already taken');
  }

  });
});
// this get request redirects the user to the welcome page after logging in
app.get('/welcome/', (req, res) => {
  Freelancer.findOne({username : req.cookies.login.username})
    .exec(function (err, results) {
    if (err) return handleError(err);
    res.end(JSON.stringify(results));
  })
});

// this get request allows the user to edit all their information in the database

app.get('/edit/:name/:personName/:catagory/:bio/:contact/:price', (req, res) => {

      Freelancer.findOneAndUpdate({username : req.cookies.login.username}, {
        'name': req.params.name,
        'personName': req.params.personName,
        'bio': req.params.bio,
        'contact': req.params.contact,
        'price': req.params.price,
        'class': req.params.catagory
      }, function (err, docs) {
        if (err){
            console.log(err);
        }
      })
  });
  //implement update document


// this get request is here for logging out users
app.get('/logout/', (req, res) => {
  console.log(req.cookies.login.username);
  loggedOut(req.cookies.login.username)
  res.end("logged out"); });


// Start the server!

app.listen(1234, () => { console.log('server has started'); });
//bug: doesnt show full description after creating new user
