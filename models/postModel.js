const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Post = mongoose.model('Post', new Schema({
    username: {type: String, required: true}, 
    date: {type: Date, required: true},
    title: {type: String, required: true},
    message: {type: String, required: true},
    category: {type: Object, required: true}
  }))

module.exports = Post