import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './recommender_form.css';
import axios from 'axios';

export default function RecommendationForm() {
    const [form, setForm] = useState({
        placeType: '',
        visitTime: '',
        budget: '',
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
        });
        setRecommendations([]); // Clear recommendations on reset
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h2 className="text-center mb-4">Travel Recommendation Inputs</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type of Place:</label>
                        <select
                            className="form-control"
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
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Time of the Day:</label>
                        <select
                            className="form-control"
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
                    <div className="form-group">
                        <label>Budget:</label>
                        <select
                            className="form-control"
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
                        <button type="submit" className="btn btn-primary mr-2">Submit</button>
                        <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
                    </div>
                </form>

                {/* Display recommendations */}
                {recommendations.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-center">Recommended Places</h3>
                        <ul className="list-group">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>Place:</strong> {rec.placeName}<br />
                                    <strong>Description:</strong> {rec.description}<br />
                                    <strong>Address:</strong> {rec.address}<br />
                                    {/* Add other fields as necessary */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}



