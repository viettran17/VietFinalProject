const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    full_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    imageUrl: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    facebookId: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const UsersModel = mongoose.model("users", usersSchema, "users");
module.exports = UsersModel;