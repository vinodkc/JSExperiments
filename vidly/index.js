const express = require('express');

//Middle wares
const config = require('config')
const helmet = require('helmet');
const logger = require("./Logger.js");
const authenticate = require('./Authenticator')

const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());

console.log('Application name ' + config.get('name') )
console.log('Mail server  ' + config.get('mail.server'))
console.log('Mail password ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    const morgan = require('morgan');
    app.use(morgan('tiny'));
    console.log('Morgan enabled')
}

app.use(express.static('./public'));
app.use(logger);
app.use(authenticate);

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
  ];


const schema = {
    name : Joi.string().min(3).required()
   };

function validateGenre(genre) {   
    return Joi.validate(genre, schema);
}

function getGenre(id)  {
    const  int_id = parseInt(id);
    return genres.find(c => c.id == int_id);
}


//Routes
app.get('/', (req,res) => {
 res.send("Vidly")
});

app.get('/api/genres', (req, res) => {
        res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = getGenre(req.params.id)

    if (!genre) {
        res.status(404).send("Genre not found");
    } else {
        res.send(genre);
    }
});

app.post('/api/genres', (req, res) => {

    const {error} = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const genre = {
      id : genres.length + 1 , 
      name : req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {

    const {error} = validateGenre(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    const genre = getGenre(req.params.id)
    if (!genre) {
        res.status(400).send(`No genre found with name ${genre}`);
    } else {
        genre.name = req.body.name;
        res.send(genre);
    }

});

app.delete('/api/genres/:id', (req, res) => {
    const genre = getGenre(req.params.id)
       if (!genre) {
        res.status(400).send(`No genre found for id  name ${req.params.id}`);
    } else {
        const index = genres.indexOf(genre);
        genres.splice(index, 1);
        res.send(genre);
    }

});

//Start Server 
const port = process.env.PORT || 3000
app.listen(port, () => {
console.log(`Listening on port ${port}`);
});