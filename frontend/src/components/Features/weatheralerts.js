import React, { useState, useEffect } from "react";
import axios from "axios";
import { WiCloud, WiDaySunny, WiRain, WiSnow, WiUmbrella } from "react-icons/wi"; 

const WeatherAlerts = () => {
  const [weatherData, setWeatherData] = useState(null); 
  const [icon, setIcon] = useState(null);
  const [precipitation, setPrecipitation] = useState("");
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1e3dc443a4b08d06b39b348e5d51c661&units=metric`
        );
        const data = response.data;

        
        if (data && data.weather && data.main) {
          setWeatherData({
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            date: new Date().toLocaleDateString(),
          });

          
          setIcon(getWeatherIcon(data.weather[0].main, data.main.temp));

          
          if (data.weather[0].main === "Rain" || data.weather[0].main === "Drizzle") {
            setPrecipitation("Expect rain soon");
          } else if (data.weather[0].main === "Snow") {
            setPrecipitation("Expect snow soon");
          } else {
            setPrecipitation("No precipitation expected soon");
          }
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data.");
      }
    };

    const handleGeolocation = (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(latitude, longitude);
    };

    const handleError = (error) => {
      setError("Unable to retrieve your location");
      console.error("Error accessing geolocation:", error);
    };

    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeolocation, handleError);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

 
  const getWeatherIcon = (main, temp) => {
    switch (main) {
      case "Clouds":
        return <WiCloud size={64} />;
      case "Clear":
        return <WiDaySunny size={64} />;
      case "Rain":
        return <WiRain size={64} />;
      case "Snow":
        return <WiSnow size={64} />;
      case "Haze":
      case "Mist":
      case "Fog":
        return <WiCloud size={64} />;
      default:
        return <WiUmbrella size={64} />;
    }
  };

  if (error) {
    return <div>{error}</div>; 
  }

  if (!weatherData) {
    
    return <div>Loading...</div>;
  }

  return (
    <div className="weather-container" style={styles.container}>
      <h1 style={styles.header}>Weather - Notify</h1>
      <div style={styles.icon}>{icon}</div>
      <div className="weather-info" style={styles.weatherInfo}>
        <h2 style={styles.description}>{weatherData.description}</h2>
        <p>Temperature: {weatherData.temperature}°C</p>
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Date: {weatherData.date}</p>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "500px",
    textAlign: "center",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  icon: {
    fontSize: "3rem",
    margin: "10px 0",
  },
  weatherInfo: {
    fontSize: "1.2rem",
  },
  description: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

export default WeatherAlerts;
