from flask import Flask, request, jsonify
import os
import pandas as pd
import numpy as np
import pickle
import tensorflow as tf
import cv2
from PIL import Image
from numpy.linalg import norm
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
from geopy.distance import geodesic
from flask_cors import CORS
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input

app = Flask(__name__)
CORS(app)

# Sample data (place this inside the same app.py file)
places_data = pd.DataFrame({
    'place': [
        'India Gate', 'Qutub Minar', 'Hauz Khas Village', 'Lotus Temple', 'Adventure Island',
        'Red Fort', 'Humayun Tomb', 'Jama Masjid', 'Lodhi Garden', 'Connaught Place',
        'Akshardham Temple', 'Dilli Haat', 'Garden of Five Senses', 'National Rail Museum',
        'Kingdom of Dreams', 'Chandni Chowk', 'DLF CyberHub', 'Rashtrapati Bhavan',
        'Agrasen ki Baoli', 'National Museum', 'Sarojini Nagar Market', 'Select Citywalk Mall',
        'Nehru Planetarium', 'Raj Ghat', 'Jantar Mantar', 'ISKCON Temple', 'National Zoological Park',
        'Delhi Ridge', 'Bangla Sahib Gurudwara', 'Safdarjung Tomb', 'Majnu Ka Tila', 'Jhandewalan',
        'Sunder Nursery','Khan Market', 'Ski India'
    ],
    'type': [
        'romantic', 'historical', 'romantic', 'spiritual', 'adventurous',
        'historical', 'historical', 'historical', 'romantic', 'romantic',
        'spiritual', 'cultural', 'romantic', 'educational', 'entertainment',
        'historical', 'entertainment', 'historical', 'historical', 'educational',
        'shopping', 'shopping', 'educational', 'historical', 'historical', 'spiritual',
        'wildlife', 'adventurous', 'spiritual', 'historical','romantic', 'spiritual',
        'romantic', 'shopping' , 'entertainment'
    ],
    'best_time': [
        'day', 'day', 'night', 'day', 'day',
        'day', 'day', 'day', 'morning', 'night',
        'day', 'night', 'evening', 'morning', 'evening',
        'day', 'evening', 'day', 'day', 'day',
        'day', 'evening', 'day', 'morning', 'day', 'day',
        'day', 'morning', 'morning', 'day','night','morning',
        'morning' , 'night' , 'day'
    ],
    'rating': [
        4.5, 4.7, 4.3, 4.8, 4.1,
        4.6, 4.5, 4.4, 4.5, 4.7,
        4.9, 4.4, 4.6, 4.2, 4.8,
        4.6, 4.9, 4.7, 4.5, 4.2,
        4.3, 4.6, 4.4, 4.1, 4.7, 4.5,
        4.3, 4.4, 4.8, 4.5, 4.7,
        4.5, 4.6, 4.7, 4.7
    ],
    'budget': [
        'low', 'low', 'medium', 'medium', 'high',
        'low', 'medium', 'low', 'low', 'medium',
        'medium', 'medium', 'medium', 'low', 'high',
        'low', 'high', 'medium', 'low', 'low',
        'low', 'high', 'medium', 'low', 'low', 'medium',
        'medium', 'medium', 'medium', 'medium', 'medium',
        'low', 'low' , 'medium' , 'high'
    ],
    'location': [
        (28.6129, 77.2294), (28.5245, 77.1855), (28.5495, 77.2036), (28.5535, 77.2591), (28.7238, 77.1135),
        (28.6562, 77.2410), (28.5933, 77.2507), (28.6507, 77.2334), (28.5931, 77.2197), (28.6304, 77.2177),
        (28.6127, 77.2773), (28.5733, 77.2075), (28.5134, 77.1975), (28.5850, 77.1814), (28.4679, 77.0689),
        (28.6505, 77.2303), (28.4950, 77.0895), (28.6143, 77.1994), (28.6261, 77.2250), (28.6119, 77.2193),
        (28.5773, 77.1963), (28.5283, 77.2190), (28.6038, 77.1981), (28.6406, 77.2495), (28.6271, 77.2166),
        (28.7293, 77.0970), (28.6067, 77.2454), (28.6162, 77.1687), (28.6259, 77.2090), (28.5893, 77.2106),
        (28.7014, 77.2282), (28.6481, 77.2042), (28.5969, 77.2453), (28.6002, 77.2268), (28.5672, 77.3209)
    ],
    'crowded': [
        'medium', 'low', 'high', 'low', 'high',
        'medium', 'medium', 'medium', 'low', 'high',
        'medium', 'medium', 'low', 'low', 'high',
        'high', 'high', 'low', 'low', 'low',
        'high', 'medium', 'low', 'low', 'low', 'low',
        'medium', 'low', 'medium', 'low', 'high', 'medium',
        'medium', 'medium', 'low'
    ],
    'crime_rate': [
        2, 3, 5, 2, 4,
        3, 2, 4, 1, 6,
        1, 3, 2, 2, 5,
        5, 3, 2, 2, 2,
        4, 3, 1, 3, 3, 1,
        2, 3, 2, 3, 2, 2,
        2, 2, 1
    ],
    'doesSituationAllow': [
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1
    ]
})

smart_pool_df = pd.DataFrame([
    {'Name': 'Amit Sharma', 'Phone_Number': '9876543210', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6139, 77.2090), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Priya Gupta', 'Phone_Number': '9123456789', 'User_Type': 'couple', 'Budget': 'high', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.7041, 77.1025), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Rohan Kumar', 'Phone_Number': '9345678901', 'User_Type': 'family', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5355, 77.3910), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Anjali Singh', 'Phone_Number': '9456789012', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.4595, 77.0266), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Vikas Jain', 'Phone_Number': '9567890123', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'yes', 'Drinker': 'yes', 'Current_Coordinates': (28.7041, 77.1025), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Rajiv Mehra', 'Phone_Number': '9678901234', 'User_Type': 'single', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.7041, 77.1025), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Simran Kaur', 'Phone_Number': '9789012345', 'User_Type': 'couple', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'yes', 'Current_Coordinates': (28.6139, 77.2090), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Sourabh Verma', 'Phone_Number': '9890123456', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.4595, 77.0266), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Neha Sharma', 'Phone_Number': '9912345678', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5355, 77.3910), 'Destination': 'India Gate', 'Departure_Time': 14},
    {'Name': 'Karan Patel', 'Phone_Number': '9823456789', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.6139, 77.2090), 'Destination': 'India Gate', 'Departure_Time': 14},

    # 10 users going to Red Fort
    {'Name': 'Ayesha Khan', 'Phone_Number': '8834567890', 'User_Type': 'single', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6562, 77.2410), 'Destination': 'Red Fort', 'Departure_Time': 14},
    {'Name': 'Rahul Yadav', 'Phone_Number': '8745678901', 'User_Type': 'couple', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.6538, 77.2410), 'Destination': 'Red Fort', 'Departure_Time': 14},
    {'Name': 'Pooja Agarwal', 'Phone_Number': '8656789012', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6448, 77.2340), 'Destination': 'Red Fort', 'Departure_Time': 14},
    {'Name': 'Arjun Mehta', 'Phone_Number': '8567890123', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.6425, 77.2285), 'Destination': 'Red Fort', 'Departure_Time': 14},
    {'Name': 'Isha Verma', 'Phone_Number': '8478901234', 'User_Type': 'couple', 'Budget': 'high', 'Smoker': 'yes', 'Drinker': 'yes', 'Current_Coordinates': (28.6578, 77.2409), 'Destination': 'Red Fort', 'Departure_Time': 14},

    # More users with different destinations (Qutub Minar, Lotus Temple, Akshardham, etc.)
    {'Name': 'Devika Rao', 'Phone_Number': '8112233445', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5244, 77.1855), 'Destination': 'Qutub Minar', 'Departure_Time': 14},
    {'Name': 'Suraj Pandey', 'Phone_Number': '9223344556', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5254, 77.1854), 'Destination': 'Qutub Minar', 'Departure_Time': 14},
    {'Name': 'Ankit Rawat', 'Phone_Number': '8112233445', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5125, 77.1855), 'Destination': 'Qutub Minar', 'Departure_Time': 14},
    {'Name': 'Tara Sehgal', 'Phone_Number': '9223344556', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5135, 77.1850), 'Destination': 'Qutub Minar', 'Departure_Time': 14},
    # Continue similarly for Lotus Temple, Akshardham, Humayun’s Tomb, Jantar Mantar

    # Users going to India Gate
    {'Name': 'Varun Singh', 'Phone_Number': '9876000001', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6129, 77.2100), 'Destination': 'India Gate', 'Departure_Time': 12},
    {'Name': 'Deepika Rao', 'Phone_Number': '9123101010', 'User_Type': 'family', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.7045, 77.1030), 'Destination': 'India Gate', 'Departure_Time': 13},
    {'Name': 'Vivek Pandey', 'Phone_Number': '9345602020', 'User_Type': 'single', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5359, 77.3900), 'Destination': 'India Gate', 'Departure_Time': 18},
    {'Name': 'Ruchi Jain', 'Phone_Number': '9456793030', 'User_Type': 'couple', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.4590, 77.0260), 'Destination': 'India Gate', 'Departure_Time': 15},
    {'Name': 'Nikhil Kapoor', 'Phone_Number': '9567804040', 'User_Type': 'single', 'Budget': 'low', 'Smoker': 'yes', 'Drinker': 'yes', 'Current_Coordinates': (28.7042, 77.1035), 'Destination': 'India Gate', 'Departure_Time': 16},

    # Users going to Red Fort
    {'Name': 'Swati Bhatia', 'Phone_Number': '9678905050', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.6570, 77.2408), 'Destination': 'Red Fort', 'Departure_Time': 10},
    {'Name': 'Kunal Deshmukh', 'Phone_Number': '9789016060', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'yes', 'Current_Coordinates': (28.6540, 77.2415), 'Destination': 'Red Fort', 'Departure_Time': 14},
    {'Name': 'Rhea Sharma', 'Phone_Number': '9890127070', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.6455, 77.2355), 'Destination': 'Red Fort', 'Departure_Time': 12},
    {'Name': 'Akash Kumar', 'Phone_Number': '9912348080', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6412, 77.2299), 'Destination': 'Red Fort', 'Departure_Time': 15},

    # Users going to Qutub Minar
    {'Name': 'Rajesh Gupta', 'Phone_Number': '9812349090', 'User_Type': 'family', 'Budget': 'low', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5259, 77.1857), 'Destination': 'Qutub Minar', 'Departure_Time': 9},
    {'Name': 'Shruti Patel', 'Phone_Number': '9910120111', 'User_Type': 'couple', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5130, 77.1852), 'Destination': 'Qutub Minar', 'Departure_Time': 11},
    {'Name': 'Manish Mehta', 'Phone_Number': '9822222222', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'yes', 'Current_Coordinates': (28.5128, 77.1859), 'Destination': 'Qutub Minar', 'Departure_Time': 10},
    {'Name': 'Radhika Jain', 'Phone_Number': '9933333333', 'User_Type': 'family', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.5141, 77.1856), 'Destination': 'Qutub Minar', 'Departure_Time': 12},

    # Users going to Lotus Temple
    {'Name': 'Mohan Sinha', 'Phone_Number': '8122333444', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5530, 77.2590), 'Destination': 'Lotus Temple', 'Departure_Time': 10},
    {'Name': 'Kavya Arora', 'Phone_Number': '8222333555', 'User_Type': 'couple', 'Budget': 'high', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5534, 77.2585), 'Destination': 'Lotus Temple', 'Departure_Time': 13},
    {'Name': 'Sameer Nair', 'Phone_Number': '8322333666', 'User_Type': 'family', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5526, 77.2586), 'Destination': 'Lotus Temple', 'Departure_Time': 14},

    # Users going to Akshardham
    {'Name': 'Sunita Verma', 'Phone_Number': '8422333777', 'User_Type': 'family', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.6130, 77.2780), 'Destination': 'Akshardham', 'Departure_Time': 13},
    {'Name': 'Aarav Khanna', 'Phone_Number': '8522333888', 'User_Type': 'single', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6120, 77.2778), 'Destination': 'Akshardham', 'Departure_Time': 16},

    # Users going to Humayun's Tomb
    {'Name': 'Ravi Tripathi', 'Phone_Number': '8622333999', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5937, 77.2509), 'Destination': 'Humayun\'s Tomb', 'Departure_Time': 10},
    {'Name': 'Leena Chaudhary', 'Phone_Number': '8722333000', 'User_Type': 'family', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.5935, 77.2515), 'Destination': 'Humayun\'s Tomb', 'Departure_Time': 12},

    # Users going to Humayun's Tomb
    {'Name': 'Manish Verma', 'Phone_Number': '9123456788', 'User_Type': 'couple', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5933, 77.2507), 'Destination': 'Humayun\'s Tomb', 'Departure_Time': 15},
    {'Name': 'Suman Singh', 'Phone_Number': '8234567891', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5941, 77.2505), 'Destination': 'Humayun\'s Tomb', 'Departure_Time': 16},
    {'Name': 'Kunal Kapoor', 'Phone_Number': '8345678902', 'User_Type': 'single', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5943, 77.2510), 'Destination': 'Humayun\'s Tomb', 'Departure_Time': 14},

    # Users going to Jantar Mantar
    {'Name': 'Ravi Chopra', 'Phone_Number': '8456789013', 'User_Type': 'couple', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.6271, 77.2166), 'Destination': 'Jantar Mantar', 'Departure_Time': 15},
    {'Name': 'Aarti Mehta', 'Phone_Number': '8567890124', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6275, 77.2160), 'Destination': 'Jantar Mantar', 'Departure_Time': 16},
    {'Name': 'Akash Jain', 'Phone_Number': '8678901235', 'User_Type': 'single', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6279, 77.2170), 'Destination': 'Jantar Mantar', 'Departure_Time': 14},

    # Users going to Akshardham
    {'Name': 'Varun Malhotra', 'Phone_Number': '8789012346', 'User_Type': 'family', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.6127, 77.2773), 'Destination': 'Akshardham', 'Departure_Time': 14},
    {'Name': 'Pallavi Desai', 'Phone_Number': '8890123457', 'User_Type': 'couple', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6129, 77.2770), 'Destination': 'Akshardham', 'Departure_Time': 15},
    {'Name': 'Anirudh Chawla', 'Phone_Number': '8901234568', 'User_Type': 'single', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6130, 77.2780), 'Destination': 'Akshardham', 'Departure_Time': 16},

    # Users going to Jama Masjid
    {'Name': 'Sana Qureshi', 'Phone_Number': '8123456789', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'no', 'Current_Coordinates': (28.6507, 77.2334), 'Destination': 'Jama Masjid', 'Departure_Time': 14},
    {'Name': 'Faiz Ahmed', 'Phone_Number': '8234567890', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.6509, 77.2330), 'Destination': 'Jama Masjid', 'Departure_Time': 15},
    {'Name': 'Nida Khan', 'Phone_Number': '8345678901', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.6510, 77.2332), 'Destination': 'Jama Masjid', 'Departure_Time': 16},

    # Users going to Lodhi Gardens
    {'Name': 'Ishaan Bhalla', 'Phone_Number': '8456789012', 'User_Type': 'single', 'Budget': 'medium', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5911, 77.2193), 'Destination': 'Lodhi Gardens', 'Departure_Time': 14},
    {'Name': 'Megha Arora', 'Phone_Number': '8567890123', 'User_Type': 'family', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5915, 77.2190), 'Destination': 'Lodhi Gardens', 'Departure_Time': 15},
    {'Name': 'Nikhil Grover', 'Phone_Number': '8678901234', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5918, 77.2191), 'Destination': 'Lodhi Gardens', 'Departure_Time': 16},

    # Users going to Lotus Temple
    {'Name': 'Shivam Reddy', 'Phone_Number': '8789012345', 'User_Type': 'family', 'Budget': 'medium', 'Smoker': 'yes', 'Drinker': 'no', 'Current_Coordinates': (28.5535, 77.2588), 'Destination': 'Lotus Temple', 'Departure_Time': 14},
    {'Name': 'Tina Kapoor', 'Phone_Number': '8890123456', 'User_Type': 'single', 'Budget': 'high', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5537, 77.2590), 'Destination': 'Lotus Temple', 'Departure_Time': 15},
    {'Name': 'Rohit Sethi', 'Phone_Number': '8901234567', 'User_Type': 'couple', 'Budget': 'low', 'Smoker': 'no', 'Drinker': 'yes', 'Current_Coordinates': (28.5538, 77.2595), 'Destination': 'Lotus Temple', 'Departure_Time': 16},
])

# Load feature vectors and filenames
feature_list = np.array(pickle.load(open('featurevector.pkl', 'rb')))
filenames = pickle.load(open('filenames.pkl', 'rb'))

# Load the pre-trained model
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False
model = tf.keras.Sequential([
    model,
    GlobalMaxPooling2D()
])

# Function to calculate distance
def calculate_distance(user_location, place_location):
    return geodesic((user_location['latitude'], user_location['longitude']), place_location).kilometers
@app.route('/')
def home():
    return "Flask backend is working!"
# Define the API route
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_location = data['user_location']  # User location passed as (lat, lon)
    user_preferences = data['preferences']  # Preferences such as {"placeType": "historical", "visitTime": "day", "budget": "medium", "crowded": "medium"}

    # Format user preferences into a single string
    user_pref_string = f"{user_preferences['placeType']} {user_preferences['visitTime']} {user_preferences['budget']} {user_preferences['crowded']}"

    # Filter the places
    filtered_places_data = places_data[places_data['doesSituationAllow'] == 1].copy()
    filtered_places_data['distance'] = filtered_places_data['location'].apply(lambda loc: calculate_distance(user_location, loc))

    # Combine features into a content descriptor
    filtered_places_data['content'] = (filtered_places_data['type'] + " ") * 3 + filtered_places_data['best_time'] + " " + filtered_places_data['budget'] + " " + filtered_places_data['crowded']

    # Vectorize the content
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(filtered_places_data['content'])

    # Calculate similarity
    user_pref_vector = tfidf.transform([user_pref_string])
    similarity_scores = cosine_similarity(user_pref_vector, tfidf_matrix).flatten()

    # Normalize distance and crime rate
    filtered_places_data['distance_score'] = (1 / (filtered_places_data['distance'] + 1))
    filtered_places_data['crime_rate_score'] = (10 - filtered_places_data['crime_rate']) / 10

    # Calculate final similarity score
    filtered_places_data['similarity_score'] = (
        similarity_scores * 0.35 +  # Increased weight for cosine similarity
        filtered_places_data['distance_score'] * 0.20 +  # Adjusted distance weight
        filtered_places_data['rating'] / 5 * 0.20 +  # Normalized rating weight
        filtered_places_data['crime_rate_score'] * 0.15 +  # Crime rate weight
        filtered_places_data['doesSituationAllow'] * 0.10  # Current situation weight
    )

    # Sort by similarity score
    sorted_places = filtered_places_data.sort_values(by='similarity_score', ascending=False)

    # Get top 5 recommendations
    recommendations = sorted_places[['place', 'type', 'similarity_score', 'best_time', 'budget', 'crowded','distance', 'location']].head(5).to_dict(orient='records')
    
    return jsonify(recommendations)

@app.route('/smartPool', methods=['POST'])
def smart_pool():
    try:
        user_input = request.json

        filtered_df = smart_pool_df[smart_pool_df['Destination'] == user_input['Destination']].copy()
        filtered_df = filtered_df[(filtered_df['Departure_Time'] >= user_input['Departure_Time'] - 1) &
                                  (filtered_df['Departure_Time'] <= user_input['Departure_Time'] + 1)]
        
        if filtered_df.empty:
            return jsonify({"error": "No matches found within the departure time range."})
        
        # Encode categorical features with a separate LabelEncoder for each column
        label_encoders = {}
        for column in ['User_Type', 'Budget', 'Smoker', 'Drinker']:
            label_encoders[column] = LabelEncoder()
            filtered_df[column] = label_encoders[column].fit_transform(filtered_df[column])
            user_input[column] = label_encoders[column].transform([user_input[column]])[0]
        
        # Features to consider for similarity
        features = ['User_Type', 'Budget', 'Smoker', 'Drinker']
        
        # Convert the user input into a DataFrame
        user_df = pd.DataFrame([user_input])
        
        # Calculate cosine similarity for categorical features
        similarity_scores = cosine_similarity(user_df[features], filtered_df[features])
        
        # Calculate haversine distance for the current coordinates
        distance_weights = []
        for index, row in filtered_df.iterrows():
            user_coords = user_input['Current_Coordinates']
            row_coords = row['Current_Coordinates']
            distance = geodesic(user_coords, row_coords).kilometers
            normalized_distance = 1 / (1 + distance)  # Inverse relation, closer distances get higher weight
            distance_weights.append(normalized_distance)
        
        # Normalize distance weights and convert to numpy array
        distance_weights = np.array(distance_weights)
        
        # Combine cosine similarity and distance similarity
        # Weight for each: 70% categorical similarity and 30% distance similarity
        final_scores = (0.7 * similarity_scores[0]) + (0.3 * distance_weights)
        
        # Get top 3 matches based on combined score
        top_3_indices = np.argsort(final_scores)[-3:][::-1]
        
        # Get top 3 matches from the dataset
        top_3_matches = filtered_df.iloc[top_3_indices].copy()
        
        # Inverse transform the categorical features using the correct LabelEncoder for each column
        for column in ['User_Type', 'Budget', 'Smoker', 'Drinker']:
            top_3_matches[column] = top_3_matches[column].astype(int)  # Convert to integer type
            top_3_matches[column] = label_encoders[column].inverse_transform(top_3_matches[column])
        
        # Return the top 3 matches with original values
        return jsonify(top_3_matches[['Name', 'Phone_Number', 'User_Type', 'Budget', 'Smoker', 'Drinker', 'Departure_Time', 'Destination']].to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Function to extract features from the image
def extract_feature(img_path, model):
    try:
        # Use PIL to handle various image formats
        pil_image = Image.open(img_path).convert('RGB')  # Ensure it's in RGB format
        img = np.array(pil_image)

        # Convert to OpenCV format
        img = cv2.resize(img, (224, 224))
        expand_img = np.expand_dims(img, axis=0)
        pre_img = preprocess_input(expand_img)
        result = model.predict(pre_img).flatten()
        normalized = result / norm(result)
        return normalized
    except Exception as e:
        return None

# Function to find recommendations
def recommend(features, feature_list):
    neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)
    distances, indices = neighbors.kneighbors([features])
    return indices

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
    
    if file:
        if not os.path.exists('uploads'):
            os.makedirs('uploads')

        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)

        # Extract features
        features = extract_feature(file_path, model)
        if features is None:
            return jsonify({"error": "Feature extraction failed"}), 500

        # Recommend similar images
        indices = recommend(features, feature_list)

        # Return recommended filenames
        recommendations = [filenames[i] for i in indices[0]]
        return jsonify({"recommendations": recommendations}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=5001)