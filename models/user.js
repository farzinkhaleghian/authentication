const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    minlength: 3,
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxLength: 255,
    unique: true

  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxLength: 1024
  },
  isAdmin: Boolean
});

const User = mongoose.model('User', userSchema);

function validateUser(user){
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),

    repeatPassword: Joi.ref('password'),

    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
  }).with('password', 'repeatPassword');
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
