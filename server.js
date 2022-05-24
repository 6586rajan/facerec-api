// this is the set up for the API

const express = require('express');
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');
const app = express();
// https://www.npmjs.com/package/bcryptjs vs https://www.npmjs.com/package/bcrypt-nodejs
const bcrypt = require('bcryptjs');
// https://www.npmjs.com/package/cors
const cors = require('cors');

// http://knexjs.org/#Installation-node
const knex = require('knex');

const signin = require('./Controllers/signin'); 
const register = require('./Controllers/register');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
    client: 'pg',
    connection: {
      connectionString : 'process.env.DATABASE_URL',  //postgresql-cylindrical-39400
    //   port : 5432,
    //   user : 'postgres',
    //   password : 'raghava1',
    //   database : 'Smart-Brain'
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

// need to state this to be able parse the request data.
app.use(express.json());
app.use(cors());
// what we need------------
//  / -> GET: a root node to check if the api is working
//  /signin -> POST: validate the username and password... return success/fail
//  /register -> POST: register user creds... return success/fail
//  /profile/:userId -> GET: profile values i.e number of times a user used the service...
//  /image -> PUT: return the updated profile

// temporary Database to store users
/* const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@example.com',
            password: bcrypt.hashSync("password", salt),
            entries: 0,
            joined: new Date()
        }
    ]
} */

// request to root to check connection
app.get('/', (req, res) => {
    res.json('this is a connection test');
})


// user authentication
app.post('/signin', (req, res)  => {signin.handleSignin(req, res, db, bcrypt)});

// register user with parameters
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleImageUrl(req, res)});


app.listen(process.env.PORT || 3000, () => {
    console.log(`API Server is running on port ${process.env.PORT}`);
})
