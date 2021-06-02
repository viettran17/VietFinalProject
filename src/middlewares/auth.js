const { required } = require('joi');
const User = require('../models/users');
const { verifyToken } = require('../services/users');
const authMiddleware = (required) => {
    return (req, res, next) => {
        if (!req.headers.authorization) {
            if (required) {
                res.status(401).send('Token not found');
            } else {
                next();
            }
        }
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decideObj = verifyToken(token);
            const id = decideObj.id;
            User.findOne({ _id: id })
                .exec()
                .then((user) => {
                    req.user = user._docs;
                    next();
                })
                .catch((error) => {
                    res.status(401).send("User not found");
                });
        } catch {
          if (required) {
              res.status(401).send("Invalid token");
          } else {
              next();
          }
        }
    };
};

const authAdmin = () => {
    return (req, res, next) => {
        if (req.user.role === "ADMIN") {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized"});
        }
    };
};
module.exports = { authMiddleware, authAdmin };
