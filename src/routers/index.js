const express = require('express')
const routers= express.Router();

const authRouter = require('./auth');
routers.use('/auth', authRouter);

module.exports = routers;