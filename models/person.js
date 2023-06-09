const mongoose = require('mongoose');
const { URI } = require("../database/config");


const ConnectDatabase = () => {
    mongoose.set('strictQuery', false);
    console.log('connecting to', URI);
    mongoose.connect(URI)
    .then(result => {
        console.log('connected to MongoDB')})
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)})
}

module.exports = { ConnectDatabase }