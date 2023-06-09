require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const { ConnectDatabase } = require("./models/person");
const { Person } = require("./database/ProjectModels");
ConnectDatabase();


morgan.token('body', req => {
    if(req.method == "POST")
        return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(cors());
app.use(express.static('build'))
app.use(express.json());

app.get("/api/info", (request, response, next) => {
    Person.find({}).then(persons => {
        let day = new Date();
        let fullDate = `Year: ${day.getFullYear()}, month: ${day.getMonth()}, day: ${day.getDate()} \n Time: ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
        response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${fullDate}</p>`);
    }).
    catch(error => next(error));
    
});

app.get("/api/persons", (request, response, next) => {
    Person.find({}).then(persons => {response.json(persons)})
    .catch(error => next(error))
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end()}})
    .catch(error => next(error))
});

app.post(`/api/persons`, (request, response, next) => {
    const body = request.body;

    if(!body.name) {
        return response.status(400).json({error : `name is missing`});
    } else if(!body.number){
        return response.status(400).json({error : `number is missing`});
    } 

    const person = new Person({
        name : body.name,
        number : body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
    .catch(error => next(error))
});

app.delete(`/api/persons/:id`, (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`);
});