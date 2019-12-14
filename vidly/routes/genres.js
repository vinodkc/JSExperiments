const express = require('express');

const router  = express.Router();

const Joi = require('joi');


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
   
router.get('/', (req, res) => {
    res.send(genres);
});
router.get('/:id', (req, res) => {
    const genre = getGenre(req.params.id)

    if (!genre) {
        res.status(404).send("Genre not found");
    } else {
        res.send(genre);
    }
});

router.post('/', (req, res) => {

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

router.put('/:id', (req, res) => {

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

router.delete('/:id', (req, res) => {
    const genre = getGenre(req.params.id)
       if (!genre) {
        res.status(400).send(`No genre found for id  name ${req.params.id}`);
    } else {
        const index = genres.indexOf(genre);
        genres.splice(index, 1);
        res.send(genre);
    }

});

module.exports = router;
