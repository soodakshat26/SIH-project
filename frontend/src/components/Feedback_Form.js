import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './feedback_form.css';
export default function Feedback_Form() {
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
        <div className="container mt-5 feedback-form-container">
            <h2 className="text-center mb-4">We Value Your Feedback</h2>
            <form onSubmit={handleSubmit} onReset={handleReset} className="p-4 shadow rounded bg-light">
                <div className="form-group">
                    <label>Name :</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name" 
                        value={feedback.name}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group">
                    <label>Email :</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={feedback.email}
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group">
                    <label>Rate Your Experience:</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        name="rating" 
                        value={feedback.rating}
                        min="1" max="10"
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Favorite Feature:</label>
                    <select 
                        className="form-control" 
                        name="favoriteFeature" 
                        value={feedback.favoriteFeature}
                        onChange={handleChange}
                    >
                        <option value="">Select...</option>
                        <option value="recommendations">Recommendations</option>
                        <option value="UI">User Interface</option>
                        <option value="both">Both</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Comments</label>
                    <textarea 
                        className="form-control" 
                        name="improvements" 
                        value={feedback.improvements}
                        onChange={handleChange} 
                        rows="3"
                        placeholder="What specifically did you like?"
                    />
                </div>
                <div className="form-group">
                    <label>Would you recommend this app?</label><br />
                    <div className="form-check form-check-inline">
                        <input 
                            type="radio" 
                            name="recommend" 
                            value="yes" 
                            checked={feedback.recommend === 'yes'}
                            onChange={handleChange}
                            className="form-check-input"
                        /> Yes
                    </div>
                    <div className="form-check form-check-inline">
                        <input 
                            type="radio" 
                            name="recommend" 
                            value="no" 
                            checked={feedback.recommend === 'no'}
                            onChange={handleChange}
                            className="form-check-input"
                        /> No
                    </div>
                </div>
                <div className="form-group">
                    <label>Destination Visited:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="lastDestination" 
                        value={feedback.lastDestination}
                        onChange={handleChange} 
                        placeholder="E.g., Paris, Rome..."
                    />
                </div>
                <div className="form-group">
                    <label>How Crowded was the Destination?</label>
                    <select 
                        className="form-control" 
                        name="crowdedness" 
                        value={feedback.crowdedness}
                        onChange={handleChange}
                    >
                        <option value="">Select...</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Optional Travel Blog (250 words max):</label>
                    <textarea 
                        className="form-control" 
                        name="blog" 
                        value={feedback.blog}
                        onChange={handleChange} 
                        rows="6"
                        maxLength="1500"
                        placeholder="Share your travel experience here..."
                    />
                    <small className="form-text text-muted">
                        You can write up to 250 words.
                    </small>
                </div>
                <div className="d-flex justify-content-between">
                    <button type="reset" className="btn btn-secondary">Reset</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    );
}

