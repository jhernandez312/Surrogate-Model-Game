from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from pickle import load

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the saved model
model = load(open('models/finalized_model_multivariate.sav', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    try:
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

        # Load training data for scaling
        X_train = pd.read_csv('data/EPB_data.csv')
        scaler = MinMaxScaler()
        scaler.fit(X_train.drop(columns=['Heating Load']))

        # Scale new data and make predictions
        scaled_data = scaler.transform(df)
        prediction = model.predict(scaled_data)

        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Listen on all interfaces
