import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from keras.models import load_model
import os
import sys
import codecs

# Ensure the script uses UTF-8 encoding
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def main(venue, batting_team, bowling_team, striker, bowler):
    # Define paths
    model_path = r'C:\Users\nemal\OneDrive\Desktop\cricket\backend\datasets\ipl_score_predictor_model.h5'
    data_path = r'C:\Users\nemal\OneDrive\Desktop\cricket\backend\datasets\ipl_score.csv'

    try:
        # Load the saved model
        model = load_model(model_path)
    except FileNotFoundError as e:
        print(f"Error loading model: {e}")
        exit()

    # Load the data for encoding
    df = pd.read_csv(data_path, encoding='utf-8')

    # Create LabelEncoders
    venue_encoder = LabelEncoder()
    batting_team_encoder = LabelEncoder()
    bowling_team_encoder = LabelEncoder()
    striker_encoder = LabelEncoder()
    bowler_encoder = LabelEncoder()

    # Fit the LabelEncoders on the data
    df['venue'] = venue_encoder.fit_transform(df['venue'])
    df['bat_team'] = batting_team_encoder.fit_transform(df['bat_team'])
    df['bowl_team'] = bowling_team_encoder.fit_transform(df['bowl_team'])
    df['batsman'] = striker_encoder.fit_transform(df['batsman'])
    df['bowler'] = bowler_encoder.fit_transform(df['bowler'])

    # Create a MinMaxScaler instance and fit on the data
    X = df.drop(['total'], axis=1)  # Features
    scaler = MinMaxScaler().fit(X)

    # Encode the inputs
    try:
        decoded_venue = venue_encoder.transform([venue])[0]
        decoded_batting_team = batting_team_encoder.transform([batting_team])[0]
        decoded_bowling_team = bowling_team_encoder.transform([bowling_team])[0]
        decoded_striker = striker_encoder.transform([striker])[0]
        decoded_bowler = bowler_encoder.transform([bowler])[0]
    except ValueError as e:
        print(f"Encoding error: {e}")
        exit()

    # Prepare input array
    input_data = np.array([decoded_venue, decoded_batting_team, decoded_bowling_team, decoded_striker, decoded_bowler])
    input_data = pd.DataFrame(input_data.reshape(1, -1), columns=X.columns)
    input_data = scaler.transform(input_data)

    # Predict and print the score
    try:
        predicted_score = model.predict(input_data)
        predicted_score = int(predicted_score[0, 0])
        print(f"Predicted Score: {predicted_score}")
    except Exception as e:
        print(f"Prediction error: {e}")
        exit()

if __name__ == '__main__':
    batting_team = sys.argv[1]
    bowling_team = sys.argv[2]
    venue = sys.argv[3]
    striker = sys.argv[4]
    bowler = sys.argv[5]
    result = main(venue, batting_team, bowling_team, striker, bowler)