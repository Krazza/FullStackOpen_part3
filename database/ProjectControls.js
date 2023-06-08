const mongoose = require("mongoose");
const { Person } = require("./ProjectModels");

const SaveNewPerson = (name, number) =>{
    const person = new Person({
        name : name,
        number : number
    })

    person.save().then(result => {
        console.log("Person saved!", person);
        mongoose.connection.close();
    })
}

const GetPhonebook = () =>{
    Person
    .find({})
    .then(persons=> {
        console.log("Phonebook:");
        persons.forEach(person =>{
        console.log(`Name: ${person.name} | number: ${person.number}`);
        })
        mongoose.connection.close()})
}

module.exports = {
    SaveNewPerson,
    GetPhonebook
}