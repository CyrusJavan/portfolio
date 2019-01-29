const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining document schema
// NoSQL db's like Mongo do not use a schema at the database level
// However, it's a good idea to define a schema at the application level
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('users', UserSchema);