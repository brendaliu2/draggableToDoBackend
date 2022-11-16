const express = require('express');
const app = express();

//Errors
const { NotFoundError } = require('./expressError');

//process JSON body
app.use(express.json());

//process traditional form data
app.use(express.urlencoded({ extended: true }));

// 404 Error Handler
app.use(function (req, res) {
  throw new NotFoundError();
});

// Error handler -> return JSON error message
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;