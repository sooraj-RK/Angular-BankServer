// import mongoose

const mongoose = require("mongoose")

// state connection string
mongoose.connect('mongodb://localhost:27017/bankServer', { useNewUrlParser: true })


const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: String,
    balance: Number,
    transaction: []
})

module.exports = {
    User
}