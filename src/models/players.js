const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    ovr: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    season: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        default: 1,
    }
}, {
    timestamps: true
});

const PlayerModel = mongoose.model("players", playerSchema, "players");
module.exports = PlayerModel;