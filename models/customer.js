const Joi = require('joi');
const mongoose = require('mongoose');

const Employee = mongoose.model('Employee', new mongoose.Schema({
  id: {
    type: Number,
    required : true
  },
  user_id : {
    type : Number,
    required : true
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
}));

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    email: Joi.boolean()
  };

  return true
}

exports.Employee = Employee; 
exports.validate = validateCustomer;