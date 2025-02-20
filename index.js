const express = require('express');
const app = express();
const db = require('./db');
const passport = require('./routes/auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = 3000;

const Person = require('./models/person');

app.use(passport.initialize()); 

const localAuthMiddleware = passport.authenticate('local', {session: false});

// get method for /
app.get('/',  function (req, res) {
    res.send('Welcome to our hotel');
});

//import the router files
const personRoutes = require('./routes/personRoutes');
const MenuItemRoutes = require('./routes/menuRoutes');


//use the router files
app.use('/person',  personRoutes);
app.use('/menu', MenuItemRoutes);


app.listen(3000, () => {
    console.log(`server started at port ${PORT}`);
});

















// if we make get req on /person after authorization adding 
// username and password so it have to return all data which
//  is in /person mean all person or it have to return that 
// user we entered by username or password?



// but this code return all users....also if we use wrong
//  password it shows un authorized instead of incorrect
//  password..short explanation