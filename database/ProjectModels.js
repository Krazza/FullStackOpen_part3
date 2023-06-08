const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name : String,
    number : String
})

const Person = mongoose.model("Person", personSchema);

module.exports = {
    Person : Person,
}