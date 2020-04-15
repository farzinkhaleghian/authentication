const Joi = require('@hapi/joi');
const config = require('config');
const mongoose = require('mongoose');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');


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

userSchema.methods.generateAuthToken = function() {  
  return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
}
const User = mongoose.model('User', userSchema);

function validateUser(user){
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .required(),
    password: passwordComplexity({
      "min": 6,
      "max": 1024,
      "lowerCase": 1,
      "upperCase": 1,
      "numeric": 1,
      "symbol": 1,
      "requirementCount": 2
    }),

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
