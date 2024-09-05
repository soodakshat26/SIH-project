const express = require("express");
const database = require("./utils/db.js");
const cors = require("cors");
const axios = require("axios");
const { body, validationResult } = require('express-validator');
const User = require("./models/user-model.js");
const Feedback = require("./models/feedback-model.js");
const app = express();
const bodyParser = require('body-parser');
const api_key = '4a4b5b085b9ba73e3e3773d9297dda30';

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
async function getWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;
        const currentWeather = weatherData.weather[0].main; // Summary like 'Clear', 'Rain', etc.
        return currentWeather;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return null;
    }
}
app.post('/recommend', async (req, res) => {
    try {
        const { user_location, preferences } = req.body;
        const response = await axios.post('http://localhost:5001/recommend', {
            user_location,
            preferences
        })
        const recommendations = response.data;
        const filteredRecommendations = [];
        for (const place of recommendations) {
            const [lat, lon] = place.location;
            const weather = await getWeatherByCoordinates(lat, lon);
            if (weather && weather !== 'Rain') {
                filteredRecommendations.push(place);
            }
        }
        res.json(filteredRecommendations);
    } catch (error) {
        console.error('Error forwarding data to Flask backend or processing weather:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/submit-feedback', async (req, res) => {
    try {
        const { email, name, rating, favoriteFeature, improvements, recommend, crowdedness, lastDestination, blog } = req.body;
        let userFeedback = await Feedback.findOne({ email });
        if (!userFeedback) {
            userFeedback = new Feedback({
                email,
                feedbacks: [{
                    name,
                    rating,
                    favoriteFeature,
                    improvements,
                    recommend,
                    crowdedness,
                    lastDestination,
                    blog,
                }],
                credits: 500
            });
        } else {
            userFeedback.feedbacks.push({
                name,
                rating,
                favoriteFeature,
                improvements,
                recommend,
                crowdedness,
                lastDestination,
                blog,
            });
            userFeedback.credits += 500;
        }
        await userFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully and 500 credits added' });
    } catch (err) {
        console.error('Error submitting feedback or updating credits:', err);
        res.status(400).json({ error: 'Error submitting feedback or updating credits', details: err.message });
    }
});
app.get('/feedbacks', async (req, res) => {
    try {
        const feedbackDocs = await Feedback.find({}, { feedbacks: 1 });
        const feedbacks = feedbackDocs.flatMap(doc =>
            doc.feedbacks.map(entry => ({
                name: entry.name,
                improvements: entry.improvements
            }))
        );
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

app.get("/totals/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let totalExpenditure = 0;
        const personTotals = user.people.map(person => {
            const personTotal = person.amounts.reduce((sum, amount) => sum + amount, 0);
            totalExpenditure += personTotal;
            return { name: person.name, totalAmount: personTotal };
        });
        const numberOfPeople = user.people.length;
        const equalShare = totalExpenditure / numberOfPeople;
        const balances = personTotals.map(person => {
            return {
                name: person.name,
                totalAmount: person.totalAmount,
                balance: person.totalAmount - equalShare
            };
        });
        res.json({
            personTotals: balances,
            totalExpenditure,
            equalShare
        });
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.post("/", [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 2 }),
    body('amount', 'Enter a valid amount').isNumeric(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const person = user.people.find(p => p.name === req.body.name);
            if (person) {
                person.amounts.push(req.body.amount);
            } else {
                user.people.push({
                    name: req.body.name,
                    amounts: [req.body.amount],
                });
            }
            await user.save();
            return res.json(user);
        } else {
            const newUser = await User.create({
                email: req.body.email,
                people: [{
                    name: req.body.name,
                    amounts: [req.body.amount],
                }],
            });
            return res.json(newUser);
        }
    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

database().then(() => {
    app.listen(5000, () => {
        console.log("Server started on port 5000");
    });
});



