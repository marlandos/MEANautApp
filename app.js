const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// lisätty koska tuli error: "
// Error: Login sessions require session support. Did you forget to use `express-session` middleware?
//     at SessionStrategy.authenticate (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/passport/lib/strategies/session.js:46:41)
//     at attempt (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/passport/lib/middleware/authenticate.js:369:16)
//     at authenticate (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/passport/lib/middleware/authenticate.js:370:7)
//     at Layer.handle [as handle_request] (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/express/lib/router/layer.js:95:5)
//     at trim_prefix (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/express/lib/router/index.js:323:13)
//     at /home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/express/lib/router/index.js:284:7
//     at Function.process_params (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/express/lib/router/index.js:341:12)
//     at next (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/express/lib/router/index.js:275:10)
//     at initialize (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/passport/lib/middleware/initialize.js:89:5)
//     at Layer.handle [as handle_request] (/home/marutzini/Asiakirjat/NodeProjektit/meanauthapp/node_modules/express/lib/router/layer.js:95:5)
// "
// https://stackoverflow.com/questions/22298033/nodejs-passport-error-oauthstrategy-requires-session-support
//const session = require('express-session');
//const { secret } = require('../config/database');
//"@types/express-session": "^1.17.4",
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log('connected to datab'+config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('errorii'+err);
});

const app = express();

const users = require('./routes/users');

const port = 3000;

app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
//app.use(passport.session());
//app.use(passport.authenticate('session'));



require('./config/passport')(passport);
app.use('/users', users);

app.get('/', (req, res) => {
    res.send('invalid endpoint');
});

app.listen(port, () => {
    console.log('serveri käynnissä'+port);
});