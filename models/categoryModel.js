const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Category = mongoose.model('Category', new Schema({
    name: {type: String, required: true},
    posts: {type: Array, required: true}
  }))

module.exports = Category