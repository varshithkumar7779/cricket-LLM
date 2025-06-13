import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
import sys

def main(team1, team2, venue, toss_winner, toss_decision):
    a2 = pd.read_csv(r'C:\Users\nemal\OneDrive\Desktop\cricket\backend\datasets\a2_data.csv')

    # Prepare new data for prediction
    new_data = pd.DataFrame({
        'venue': [venue],
        'team1': [team1],
        'team2': [team2],
        'toss_winner': [toss_winner],
        'toss_decision': [toss_decision],
    })

    # Filtering data
    a1 = a2[((a2['team1'] == team1) & (a2['team2'] == team2)) | ((a2['team1'] == team2) & (a2['team2'] == team1))]

    # If 'venue' column does not exist in the filtered data, skip it
    if 'venue' in a1.columns and venue not in a1['venue'].values:
        a1 = a1.drop(columns=['venue'])

    a1 = a1.dropna()

    if len(a1) < 2:
        print("Not enough data to train the model.")
        return None

    le_venue = LabelEncoder()
    le_team1 = LabelEncoder()
    le_team2 = LabelEncoder()
    le_toss_winner = LabelEncoder()
    le_toss_decision = LabelEncoder()
    le_winner = LabelEncoder()

    # Only transform 'venue' if it exists in a1
    if 'venue' in a1.columns:
        a1['venue'] = le_venue.fit_transform(a1['venue'])
    a1['team1'] = le_team1.fit_transform(a1['team1'])
    a1['team2'] = le_team2.fit_transform(a1['team2'])
    a1['toss_winner'] = le_toss_winner.fit_transform(a1['toss_winner'])
    a1['toss_decision'] = le_toss_decision.fit_transform(a1['toss_decision'])
    a1['winner'] = le_winner.fit_transform(a1['winner'])

    X = a1.drop(columns=['winner', 'toss_effect'])
    y = a1['winner']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train the KNN model
    knn_model = KNeighborsClassifier()
    knn_model.fit(X_train, y_train)

    # Prepare new data for prediction
    if 'venue' in new_data.columns:
        if venue in le_venue.classes_:
            new_data['venue'] = le_venue.transform(new_data['venue'])
        else:
            new_data = new_data.drop(columns=['venue'])
    new_data['team1'] = le_team1.transform(new_data['team1'])
    new_data['team2'] = le_team2.transform(new_data['team2'])
    new_data['toss_winner'] = le_toss_winner.transform(new_data['toss_winner'])
    new_data['toss_decision'] = le_toss_decision.transform(new_data['toss_decision'])

    # Predict and return the result
    prediction_knn = knn_model.predict(new_data)
    winner_knn = le_winner.inverse_transform(prediction_knn)
    
    return winner_knn[0]

if __name__ == '__main__':
    team1 = sys.argv[1]
    team2 = sys.argv[2]
    venue = sys.argv[3]
    toss_winner = sys.argv[4]
    toss_decision = sys.argv[5]
    result = main(team1, team2, venue, toss_winner, toss_decision)
    if result is not None:
        print(result)