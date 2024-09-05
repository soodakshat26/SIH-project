const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackEntrySchema = new Schema({
    name: String,
    rating: Number,
    favoriteFeature: String,
    improvements: String,
    recommend: String,
    crowdedness: String,
    lastDestination: String,
    blog: { type: String, maxlength: 1500 },
}, { timestamps: true });

const feedbackSchema = new Schema({
    email: { type: String, required: true },
    feedbacks: [feedbackEntrySchema],
    credits: { type: Number, default: 0 },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
Feedback.createIndexes();
module.exports = Feedback;
