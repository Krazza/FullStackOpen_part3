require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { Person } = require("./database/ProjectModels");
const { URI } = require("./database/config");

const app = express();

morgan.token('body', req => {
    if(req.method == "POST")
        return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(cors());
app.use(express.static('build'))
app.use(express.json());

mongoose.set('strictQuery',false)
mongoose.connect(URI)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

let persons = [];

const GenerateID = () => {
    const newID = Math.floor(Math.random() * 100);
    return newID;
}

app.get("/api/info", (request, response) => {
    Person.find({}).then(persons => {
        let day = new Date();
        let fullDate = `Year: ${day.getFullYear()}, month: ${day.getMonth()}, day: ${day.getDate()} \n Time: ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
        response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${fullDate}</p>`);
    });
    
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
});

app.post(`/api/persons`, (request, response) => {
    const body = request.body;

    if(!body.name) {
        return response.status(400).json({error : `name is missing`});
    } else if(!body.number){
        return response.status(400).json({error : `number is missing`});
    } if(persons.some(person => person.name === body.name)){
        return response.status(409).json({error : `user is already present in the phonebook`});
    } 

    const person = new Person({
        name : body.name,
        number : body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
});

app.delete(`/api/persons/:id`, (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`);
});