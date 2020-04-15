
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const passwordComplexity = require('joi-password-complexity');
const {User} = require('../models/user');


router.post('/', async(req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password!'); 

  
  const token = user.generateAuthToken();
  res.send(token)
})

function validate(req){
  const schema = Joi.object({
    password: passwordComplexity({
      "min": 6,
      "max": 1024,
      "lowerCase": 1,
      "upperCase": 1,
      "numeric": 1,
      "symbol": 1,
      "requirementCount": 2
    }),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
  })
  return schema.validate(req);

}

module.exports = router;