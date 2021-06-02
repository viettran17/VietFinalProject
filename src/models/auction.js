const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    winner: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    player_name: {
        type: mongoose.Types.ObjectId,
        ref: "players"
    },
    start_price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    isSale: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true
})

const AuctionModel = mongoose.model("auction", auctionSchema, "auction");
module.exports = AuctionModel;