const mongoose = require("mongoose");
const { GetPhonebook, SaveNewPerson } = require("./ProjectControls");
const { URI } = require("./config");

if (process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

mongoose.set('strictQuery',false)
mongoose.connect(URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    });

if(process.argv.length === 3){
    console.log(GetPhonebook());
} else {
    SaveNewPerson(process.argv[3], process.argv[4]);
}



