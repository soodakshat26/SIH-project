from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from geopy.distance import geodesic

app = Flask(__name__)

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

# Function to calculate distance
def calculate_distance(user_location, place_location):
    return geodesic(user_location, place_location).kilometers

# Define the API route
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_location = data['user_location']  # User location passed as (lat, lon)
    user_preferences = data['preferences']  # Preferences such as "historical day medium medium"

    # Filter the places
    filtered_places_data = places_data[places_data['doesSituationAllow'] == 1].copy()
    filtered_places_data['distance'] = filtered_places_data['location'].apply(lambda loc: calculate_distance(user_location, loc))

    # Combine features into a content descriptor
    filtered_places_data['content'] = (filtered_places_data['type'] + " ") * 3 + filtered_places_data['best_time'] + " " + filtered_places_data['budget'] + " " + filtered_places_data['crowded']

    # Vectorize the content
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(filtered_places_data['content'])

    # Calculate similarity
    user_pref_vector = tfidf.transform([user_preferences])
    similarity_scores = cosine_similarity(user_pref_vector, tfidf_matrix).flatten()

    # Normalize distance and crime rate
    filtered_places_data['distance_score'] = (1 / (filtered_places_data['distance'] + 1))
    filtered_places_data['crime_rate_score'] = (10 - filtered_places_data['crime_rate']) / 10

    # Calculate final similarity score
    filtered_places_data['similarity_score'] = (
        similarity_scores * 0.45 +
        filtered_places_data['distance_score'] * 0.1 +
        filtered_places_data['rating'] / 5 * 0.20 +
        filtered_places_data['crime_rate_score'] * 0.15 +
        filtered_places_data['doesSituationAllow'] * 0.10
    )

    # Sort by similarity score
    sorted_places = filtered_places_data.sort_values(by='similarity_score', ascending=False)

    # Get top 5 recommendations
    recommendations = sorted_places[['place', 'type', 'similarity_score', 'best_time', 'budget', 'crowded']].head(5).to_dict(orient='records')
    
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
