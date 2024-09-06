import React, { useState } from 'react';
import './LocalGuide.css';

const LocalGuide = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        expertise: '',
        languages: '',
        availability: '',
        profilePicture: null,
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profilePicture: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };

    return (
        <div className="local-guide-container">
            <div className="hero-banner">
                <h1>Partner with Local Guides</h1>
                <p>Join us and offer your unique guiding services to travelers!</p>
            </div>

            <form className="guide-registration-form" onSubmit={handleSubmit}>
                <h2>Guide Registration Form</h2>

                <label>
                    Full Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Areas of Expertise:
                    <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleInputChange}
                        placeholder="e.g., Cultural, Adventure, Food"
                    />
                </label>

                <label>
                    Languages Spoken:
                    <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        placeholder="e.g., English, Spanish, French"
                    />
                </label>

                <label>
                    Availability:
                    <input
                        type="text"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        placeholder="e.g., Weekdays, Weekends"
                    />
                </label>

                <label>
                    Upload Profile Picture:
                    <input
                        type="file"
                        name="profilePicture"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>

                <label>
                    Description of Services:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the tours or experiences you offer"
                    ></textarea>
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default LocalGuide;
