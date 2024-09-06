import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SmartPool() {
  const [userType, setUserType] = useState('single');
  const [budget, setBudget] = useState('medium');
  const [smoker, setSmoker] = useState('no');
  const [drinker, setDrinker] = useState('yes');
  const [destination, setDestination] = useState('India Gate');
  const [departureTime, setDepartureTime] = useState(14);
  const [currentCoordinates, setCurrentCoordinates] = useState([28.6139, 77.2090]); // Default coordinates
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState('');

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentCoordinates([position.coords.latitude, position.coords.longitude]);
        },
        error => {
          console.error("Error getting location, using default coordinates.", error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMatches([]);
    setMessage('');

    const userInput = {
      User_Type: userType,
      Budget: budget,
      Smoker: smoker,
      Drinker: drinker,
      Current_Coordinates: currentCoordinates,
      Destination: destination,
      Departure_Time: parseInt(departureTime)
    };

    try {
      const response = await axios.post('http://127.0.0.1:5001/smartPool', userInput);
      if (response.data.error) {
        setMessage(response.data.error);
      } else {
        setMatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMessage('An error occurred while fetching matches.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#3a7dff]">Smart Pool System</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg max-w-xl mx-auto space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">User Type:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="single">Single</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Budget:</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Smoker:</label>
          <select
            value={smoker}
            onChange={(e) => setSmoker(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Drinker:</label>
          <select
            value={drinker}
            onChange={(e) => setDrinker(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Destination:</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="India Gate">India Gate</option>
            <option value="Red Fort">Red Fort</option>
            <option value="Qutub Minar">Qutub Minar</option>
            <option value="Lotus Temple">Lotus Temple</option>
            <option value="Akshardham">Akshardham</option>
            <option value="Humayun's Tomb">Humayun's Tomb</option>
            <option value="Jantar Mantar">Jantar Mantar</option>
            <option value="Jama Masjid">Jama Masjid</option>
            <option value="Lodhi Gardens">Lodhi Gardens</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Departure Time (24 Hour):</label>
          <input
            type="number"
            min="0"
            max="23"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Find Matches
        </button>
      </form>

      {message && <p className="text-red-500 text-center mt-4">{message}</p>}

      {matches.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-center mb-4">Top 3 Matches:</h2>
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Phone Number</th>
                <th className="py-2 px-4">User Type</th>
                <th className="py-2 px-4">Budget</th>
                <th className="py-2 px-4">Smoker</th>
                <th className="py-2 px-4">Drinker</th>
                <th className="py-2 px-4">Departure Time</th>
                <th className="py-2 px-4">Destination</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{match.Name}</td>
                  <td className="py-2 px-4">{match.Phone_Number}</td>
                  <td className="py-2 px-4">{match.User_Type}</td>
                  <td className="py-2 px-4">{match.Budget}</td>
                  <td className="py-2 px-4">{match.Smoker}</td>
                  <td className="py-2 px-4">{match.Drinker}</td>
                  <td className="py-2 px-4">{match.Departure_Time}</td>
                  <td className="py-2 px-4">{match.Destination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
