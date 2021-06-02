const express = require("express");
const routers = express.Router();
const { login, register, findUserByEmail } = require("../services/users");
const joi = require("joi");
const { authMiddleware } = require("../middlewares/auth");
// const axios = require("axios");
// const UsersModel = require("../models/user");
const gridMail = require("@sendgrid/mail");
// const generatePassword = require("generate-password");
gridMail.setApiKey(process.env.MAIL_KEY);

routers.get("/me", authMiddleware(true), (req, res, next) => {
  req.statusCode(200).json(req.user);
});
routers.post("/login", async (req, res, next) => {
  try {
    const bodySchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    const userData = await bodySchema.validateAsync(req.body);
    const user = await login(userData.email, userData.password);
    if (!user) {
      return res.status(400).json({ message: "Wrong username or password!" });
    }
    return res.status(200).json({ user: user.userInfo, token: user.token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

routers.post("/register", async (req, res, next) => {
  try {
    const bodySchema = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().required(),
        full_name: joi.string().required(),
        role: joi.string().required(),
        imageUrl: joi.string(),
      })
      .unknown();
    const userData = await bodySchema.validateAsync(req.body);
    const user = await findUserByEmail(userData.email);
    if (user != null) {
      return res.status(400).json({ message: "Email is already use" });
    }
    if (userData.error) {
      return res.status(400).json({ message: userData.error.message });
    }
    const usersave = await register(userData);
    if (usersave.status === 200) {
        console.log('Register success');
    }
    const msg = {
        from: 'quocviet3799@gmail.com', // Change to your verified sender
        to: 'viettqgch17138@fpt.edu.vn', // Change to your recipient
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
      gridMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    // gridMail
    //   .send({
    //     to: {
    //       email: userData.email,
    //     },
    //     // templateId: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    //     dynamicTemplateData: {
    //       full_name: userData.full_name,
    //     },
    //     from: {
    //       email: "quocviet3799@gmail.com",
    //       name: "Admin",
    //     },
    //   })
    //   .then(() => {
    //     return res.status(200).json({ user: userData, token: token });
    //   })
    //   .catch((err) => {
    //     return res.status(500).json({ message: err.message });
    //   });
    return res.status(200).json({ message: "Register successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = routers;
