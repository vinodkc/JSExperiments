const express = require('express')
const Joi = require('joi');

const app = express();
app.use(express.json());

const courses = [
    {id:1, name:"English"},
    {id:2, name:"Hindi"},
    {id:13, name:"Malayalam"},

];


const schema = {
    name : Joi.string().min(3).required()
   };

function validateCourse(course) {   
    return Joi.validate(course, schema);
}

function getCourse(id)  {
    const  int_id = parseInt(id);
    return courses.find(c => c.id == int_id);
}


//Routes
app.get('/', (req,res) => {
 res.send("Hello World2")
});

app.get('/api/courses', (req, res) => {
        res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = getCourse(req.params.id)

    if (!course) {
        res.status(404).send("Course not found");
    } else {
        res.send(course);
    }
});

app.post('/api/courses', (req, res) => {

    const {error} = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const course = {
      id : courses.length + 1 , 
      name : req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {

    const {error} = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    const course = getCourse(req.params.id)
    if (!course) {
        res.status(400).send(`No course found with name ${course}`);
    } else {
        course.name = req.body.name;
        res.send(course);
    }

});

app.delete('/api/courses/:id', (req, res) => {
    const course = getCourse(req.params.id)
       if (!course) {
        res.status(400).send(`No course found for id  name ${req.params.id}`);
    } else {
        const index = courses.indexOf(course);
        courses.splice(index, 1);
        res.send(course);
    }

});

//Start Server 
const port = process.env.PORT || 3000
app.listen(port, () => {
console.log(`Listening on port ${port}`);
});