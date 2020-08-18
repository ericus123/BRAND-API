
//VALIDATION 
const Joi = require('@hapi/joi');

//Register validation
const registerValidation = data => {
 const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
}); 


  // VALIDATING THE DATA BEFORE SAVING A USER
 return  schema.validate(data);
};
//Register validation
const loginValidation = data => {
    const schema = Joi.object({
       email: Joi.string().min(6).required().email(),
       password: Joi.string().min(6).required()
   }); 
     // VALIDATING THE DATA BEFORE SAVING A USER
    return  schema.validate(data);
   };
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
