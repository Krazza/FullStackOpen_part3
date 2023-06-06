const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static('build'))
app.use(express.json());

morgan.token('body', req => {
    if(req.method == "POST")
        return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const GenerateID = () => {
    const newID = Math.floor(Math.random() * 100);
    return newID;
}

app.get("/api/info", (request, response) => {
    let day = new Date();
    let fullDate = `Year: ${day.getFullYear()}, month: ${day.getMonth()}, day: ${day.getDate()} \n Time: ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
    response.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${fullDate}</p>`);
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    
    if(person){
        response.json(person);
    } else {
        response.status(404).end();
    }
    
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

    const person = {
        id : GenerateID(),
        name : body.name,
        number : body.number
    }

    persons = persons.concat(person);
    response.json(person);
});

app.delete(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`);
});