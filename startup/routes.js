const express = require('express');
const customers = require('../routes/customers');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/employee', customers);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}