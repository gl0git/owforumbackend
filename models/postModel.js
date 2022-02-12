const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Post = mongoose.model('Post', new Schema({
    username: {type: String, required: true}, 
    date: {type: String, required: true},
    title: {type: String, required: true},
    message: {type: String, required: true},
    category: {type: String, required: true}
  }))

module.exports = Post