from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from pickle import load

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# If you want to limit CORS to specific origins, you can use:
# CORS(app, origins=["http://localhost:3000"])

# Load the saved model
model = load(open('finalized_model_multivariate.sav', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Ensure that feature names match exactly as seen during model training
    df = pd.DataFrame({
        'Relative Compactness': [data['relativeCompactness']],
        'Surface Area': [data['surfaceArea']],
        'Roof Area': [data['roofArea']],
        'Overall Height': [data['overallHeight']],
        'Orientation': [data['orientation']],
        'Glazing Area': [data['glazingArea']],
        'Glazing Area Distribution': [data['glazingAreaDistribution']]
    })

    # Continue with scaling and prediction...


    # Rest of your code...


    # Load training data for scaling
    X_train = pd.read_csv('EPB_data.csv')
    scaler = MinMaxScaler()
    scaler.fit(X_train.drop(columns=['Heating Load']))

    # Scale new data and make predictions
    scaled_data = scaler.transform(df)
    prediction = model.predict(scaled_data)

    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Listen on all interfaces

