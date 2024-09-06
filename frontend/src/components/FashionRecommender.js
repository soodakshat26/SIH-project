import React, { useState } from 'react';
import axios from 'axios';

export default function FashionRecommender() {
  const [file, setFile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data.recommendations);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#3a7dff]">Find Your Vibe</h1>
        
        {/* File Input */}
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="mb-4 w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        
        {/* Upload Button */}
        <button 
          onClick={handleUpload} 
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
        >
          Upload and Predict
        </button>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Images:</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {recommendations.map((rec, index) => (
                <img 
                  key={index} 
                  src={`images/${rec}`} 
                  alt="recommendation" 
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
