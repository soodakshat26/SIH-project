const mongoose = require("mongoose");
const { Schema } = mongoose;

const personSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amounts: {
        type: [Number],
        required: true,
        default: []
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    people: {
        type: [personSchema],
        required: true,
        default: []
    }
});

const User = mongoose.model("User", userSchema);
User.createIndexes();
module.exports = User;

