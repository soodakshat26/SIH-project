import React, { useState } from 'react';
import axios from 'axios';
import './recommender_form.css'; // Assuming you want to keep custom styles

export default function RecommendationForm() {
    const [form, setForm] = useState({
        placeType: '',
        visitTime: '',
        budget: '',
        crowded: 'low',
    });
    const [location, setLocation] = useState(null);
    const [recommendations, setRecommendations] = useState([]); // State to hold recommendations

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                setLocation(userLocation);
                sendToNodeBackend(userLocation);
            }, (error) => {
                console.error("Error fetching location: ", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const sendToNodeBackend = async (userLocation) => {
        try {
            const response = await axios.post('http://localhost:5000/recommend', {
                user_location: userLocation,
                preferences: form
            });
            console.log('Node Backend Response:', response.data);
            setRecommendations(response.data); // Update state with recommendations
        } catch (error) {
            console.error('Error sending data to Node.js backend:', error);
        }
    };

    const handleReset = () => {
        setForm({
            placeType: '',
            visitTime: '',
            budget: '',
            crowded: 'low',
        });
        setRecommendations([]); // Clear recommendations on reset
    };

    return (
        <div className="max-w-lg mx-auto mt-10">
            <div className="bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#3a7dff]">Travel Recommendation Inputs</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Type of Place:</label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            name="placeType"
                            value={form.placeType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            <option value="romantic">Romantic</option>
                            <option value="spiritual">Spiritual</option>
                            <option value="educational">Educational</option>
                            <option value="shopping">Shopping</option>
                            <option value="historic">Historic</option>
                            <option value="adventurous">Adventurous</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="wildlife">Wildlife</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Time of the Day:</label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            name="visitTime"
                            value={form.visitTime}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            <option value="morning">Morning</option>
                            <option value="day">Day</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Budget:</label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select...</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600">
                            Submit
                        </button>
                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </form>

                {/* Display recommendations */}
                {recommendations.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-center mb-4">Recommended Places</h3>
                        <ul className="space-y-4">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="p-4 border rounded-lg shadow-sm">
                                    <strong>Place:</strong> {rec.place}<br />
                                    <strong>Type:</strong> {rec.type}<br />
                                    <strong>Distance from current:</strong> {rec.distance}<br />
                                    <strong>Description:</strong> Crowded: {rec.crowded}, Budget: {rec.budget}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
