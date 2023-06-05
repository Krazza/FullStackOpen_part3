const express = require("express");
const app = express();

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

const PORT = 3005;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`);
})