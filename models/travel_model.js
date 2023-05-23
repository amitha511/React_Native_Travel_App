const mongoose = require("mongoose")

const travelSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Travel', travelSchema)