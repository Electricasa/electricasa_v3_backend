require('dotenv').config();
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const session    = require('express-session');
var methodOverride = require('method-override');

require('./db/db');

app.use(session({
  secret: 'nyamissi',
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000', 'https://electricasa-frontend.herokuapp.com', 'http://electricasa-frontend.herokuapp.com', 'https://myelectricasa.netlify.app', 'http://myelectricasa.netlify.app', 'http://myelectricasa.com', 'https://myelectricasa.com', 'https://www.myelectricasa.com/', 'http://www.myelectricasa.com/'],
  credentials: true,
  optionsSuccessStatus:200
}

app.use(cors(corsOptions));
app.use('/public', express.static('public'));

//Method Override
app.use(methodOverride('_method'));

// JWT authentication
app.use(require('./config/auth'));

const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');
const houseControllers = require('./controllers/houseControllers');
const roofControllers = require('./controllers/roofControllers');
const atticControllers = require('./controllers/atticControllers');
const spHeaterControllers = require('./controllers/spHeaterControllers');
const waHeaterControllers = require('./controllers/waHeaterControllers');
const utilityControllers = require('./controllers/utilityControllers');

app.use('/api/v1/auth', require('./routes/api/authRoutes'));
app.use('/api/v1/address', require('./routes/api/addressRoutes'));
app.use('/api/v1/users', userControllers);
app.use('/api/v1/house', houseControllers);
app.use('/api/v1/attic', atticControllers);
app.use('/api/v1/roof', roofControllers);
app.use('/api/v1/spHeater', spHeaterControllers);
app.use('/api/v1/waHeater', waHeaterControllers);
app.use('/api/v1/utility', utilityControllers);

app.listen(process.env.PORT || 9000, () => {
  console.log('I am working...')
});
