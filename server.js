const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const session    = require('express-session');

require('./db/db');

app.use(session({
  secret: 'nyamissi',
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000', 'https://electricasa-v3-frontend.herokuapp.com/'],
  credentials: true,
  optionsSuccessStatus:200
}

app.use(cors(corsOptions));

const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');
const houseControllers = require('./controllers/houseControllers');

app.use('/api/v1/auth', authControllers);
app.use('/api/v1/users', userControllers);
app.use('/api/v1/house', houseControllers);


app.listen(process.env.PORT || 9000, () => {
  console.log('I am working...')
})
