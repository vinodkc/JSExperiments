const express = require('express');

//Middle wares
const config = require('config')
const helmet = require('helmet');
const logger = require("./middleware/Logger");
const authenticate = require('./middleware/Authenticator');
const debug = require('debug')('app:startup');

//routes
const genre = require('./routes/genres');
const home  = require('./routes/home');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());

//map routes
app.use('/', home)
app.use('/api/genres', genre)

debug('Application name ' + config.get('name') )
debug('Mail server  ' + config.get('mail.server'))
debug('Mail password ' + config.get('mail.password'));

/*
if (genre.get('env') === 'development') {
    const morgan = require('morgan');
    genre.use(morgan('tiny'));
    debug('Morgan enabled')
}*/


app.use(express.static('./public'));
app.use(logger);
app.use(authenticate);

//Start Server 
const port = process.env.PORT || 3000
app.listen(port, () => {
debug(`Listening on port ${port}`);
});