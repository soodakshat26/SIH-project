import React, { useState } from "react";
import axios from "axios";
import './feedback_form.css';

export default function FeedbackForm() {
    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        rating: 0,
        favoriteFeature: '',
        improvements: '',
        recommend: '',
        crowdedness: '',
        lastDestination: '',
        blog: '',
    });

    const handleChange = (e) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const wordCount = feedback.blog.trim().split(/\s+/).length;
        if (wordCount > 250) {
            alert('Your blog exceeds the 250-word limit.');
            return;
        }

        axios.post('http://localhost:5000/submit-feedback', feedback)
            .then(response => {
                console.log('Feedback submitted:', response.data);
                setFeedback({
                    name: '',
                    email: '',
                    rating: 0,
                    favoriteFeature: '',
                    improvements: '',
                    recommend: '',
                    crowdedness: '',
                    lastDestination: '',
                    blog: '',
                });
            })
            .catch(error => {
                console.error('There was an error submitting the feedback:', error);
            });
    };

    const handleReset = () => {
        setFeedback({
            name: '',
            email: '',
            rating: 0,
            favoriteFeature: '',
            improvements: '',
            recommend: '',
            crowdedness: '',
            lastDestination: '',
            blog: '',
        });
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#3a7dff]">We Value Your Feedback</h2>
            <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                    <input 
                        type="text" 
                        name="name"
                        value={feedback.name} 
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input 
                        type="email" 
                        name="email"
                        value={feedback.email} 
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rate Your Experience:</label>
                    <input 
                        type="number" 
                        name="rating"
                        value={feedback.rating} 
                        min="1" max="10" 
                        onChange={handleChange} 
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Favorite Feature:</label>
                    <select 
                        name="favoriteFeature"
                        value={feedback.favoriteFeature} 
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select...</option>
                        <option value="UI">User Interface</option>
                        <option value="recommendations">Recommendations</option>
                        <option value="Expense_Splitting">Expense Splitting</option>
                        <option value="Weather_Alerts">Weather Alerts</option>
                        <option value="Local_Events">Local Events</option>
                        <option value="Local_Guides">Partner with Local Guides</option>
                        <option value="Hidden_Gems">Hidden Gems</option>
                        <option value="Place_Image">Find Place Using Image</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Comments:</label>
                    <textarea 
                        name="improvements" 
                        value={feedback.improvements}
                        onChange={handleChange} 
                        rows="3" 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="What specifically did you like?"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Would you recommend this app?</label>
                    <div className="mt-2 space-x-4">
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                name="recommend" 
                                value="yes"
                                checked={feedback.recommend === 'yes'} 
                                onChange={handleChange}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                name="recommend" 
                                value="no"
                                checked={feedback.recommend === 'no'} 
                                onChange={handleChange}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Destination Visited:</label>
                    <input 
                        type="text" 
                        name="lastDestination"
                        value={feedback.lastDestination} 
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="E.g., Paris, Rome..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">How Crowded was the Destination?</label>
                    <select 
                        name="crowdedness"
                        value={feedback.crowdedness} 
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select...</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Optional Travel Blog (250 words max):</label>
                    <textarea 
                        name="blog"
                        value={feedback.blog} 
                        onChange={handleChange} 
                        rows="6" 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Share your travel experience here..."
                    />
                    <small className="text-gray-500">You can write up to 250 words.</small>
                </div>
                <div className="flex justify-between">
                    <button type="reset" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Reset</button>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Submit</button>
                </div>
            </form>
        </div>
    );
}
