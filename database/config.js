require("dotenv").config({ path: "../.env" })

const userName = encodeURIComponent(process.env.ATLAS_U)
const password = encodeURIComponent(process.env.ATLAS_P)
const uri = `mongodb+srv://${userName}:${password}@fullstackopen.yllslkv.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

module.exports = {
    URI : uri
}