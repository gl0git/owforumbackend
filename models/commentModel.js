const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = mongoose.model('comment', new Schema({
    username: {type: String, required: true},
    date: {type: Date, required: true},
    message: {type: String, required: true},
    post: {type: String, required: true}
}))

module.exports = Comment