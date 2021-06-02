require("dotenv").config();
const UsersModel = require("../models/users");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

module.exports.encodedToken = (id, email, role) => {
  return jwt.sign(
    {
      id: id,
      iss: email,
      sub: role,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    jwt_secret
  );
};

module.exports.verifyToken = (token) => {
  return jwt.verify(token, jwt_secret);
};

module.exports.register = async(data)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const user = new UsersModel(data);
        await user.save()
    }catch(err) {
        throw new Error(err)
    }
};

module.exports.login = async (email, password) => {
    const user = await UsersModel.findOne({ email: email});
    if ((user && user.facebookId !==null) || (user && user.googleId !== null)) {
        throw new Error(
            "Sign in with Google or Facebook please!"
        );
    } else if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (user && result == true &&user .status === true) {
            return {
                userInfo: user,
                token: this.encodedToken(user.id, user.email, user.role),
            };
        }
        if (user && result == true && user.status === false) {
            throw new Error("Fail to Login");
        }
    } else {
        return undefined;
    }
};

module.exports.findUserByEmail = async (email) => {
    const user = await UsersModel.findOne({email: email});
    return user;
}

module.exports.forgetPassword = async (_id, newPassword) => {
    try {
        const salt = await bcrypt.gensalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);
        await User.updateOne({_id: id }, { password: newPassword});
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports.changePassword = async (userId, curentPassword, newPassword) => {
    const user = await User.FindOne({_id: userId});
    const comparePassword = bcrypt.compareSync(curentPassword, user.password);
    if (comparePassword == true) {
        const salt = await bcrypt.gensalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);
        user.password = newPassword;
        await user.save();
        return true;
    }
    return false;
};

module.exports.getMe = async (id) => {
    const me = await user.FindById(id);
    return me;
};

module.exports.findUserByGoogleId = async (googleId) => {
    const user = await User.FindOne({ googleId: googleId});
    return user;
};

module.exports.findUserByFacebookId = async (facebookId) => {
    const user = await User.FindOne({ facebookId: facebookId});
    return user;
};




