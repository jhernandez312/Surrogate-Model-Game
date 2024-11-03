from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from pickle import load

app = Flask(__name__)
CORS(app)

# Load the saved models
model_heating = load(open('xgbr_best_Y1_1.sav', 'rb'))  # Model for heating load
model_cooling = load(open('xgbr_best_Y2.sav', 'rb'))    # Model for cooling load

# Load pre-fitted label encoders (these should match the encoders used during training)
label_encoders = {
    'X1_Type': LabelEncoder(),
    'X3_Shape': LabelEncoder(),
    'X13_EnergyCode': LabelEncoder(),
    'X14_HVAC': LabelEncoder()
}

# Fit encoders with categories as used during training
label_encoders['X1_Type'].fit(['SmallHotel', 'Retail', 'Office', 'Warehouse', 'StripMall', 'Outpatient',
                               'FullServiceRestaurant', 'QuickServiceRestaurant', 'LargeHotel', 
                               'PrimarySchool', 'Hospital', 'SecondarySchool'])
label_encoders['X3_Shape'].fit(['Wide rectangle', 'L shape', 'T shape'])
label_encoders['X13_EnergyCode'].fit(['ComStock 90.1-2007', 'ComStock DOE Ref 1980-2004', 'ComStock 90.1-2004', 'ComStock DOE Ref Pre-1980'])
label_encoders['X14_HVAC'].fit(['Small Packaged Unit', 'Multizone CAV/VAV', 'Zone-by-Zone', 'Residential Style Central Systems'])

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Convert the incoming JSON data to a DataFrame
    df = pd.DataFrame({
        'X1_Type': [data['Building_Type']],
        'X3_Shape': [data['Building_Shape']],
        'X5_Orientation': [data['Orientation']],
        'X6_Height': [data['Building_Height']],
        'X7_Stories': [data['Building_Stories']],
        'X9_WallArea': [data['Wall_Area']],
        'X10_WindowArea': [data['Window_Area']],
        'X12_RoofArea': [data['Roof_Area']],
        'X13_EnergyCode': [data['energy_code']],
        'X14_HVAC': [data['hvac_category']],
    })

    # Apply label encoders to categorical columns
    for col, encoder in label_encoders.items():
        df[col] = encoder.transform(df[col])

    # Scale numeric features (if needed, uncomment the scaler code above)
    scaled_data = df

    # Make predictions
    heating_load_prediction = model_heating.predict(scaled_data) / (data['Roof_Area'] * data['Building_Stories'])
    cooling_load_prediction = model_cooling.predict(scaled_data) / (data['Roof_Area'] * data['Building_Stories'])

    # Return both predictions as JSON
    return jsonify({
        'heating_load_prediction': heating_load_prediction.tolist(),
        'cooling_load_prediction': cooling_load_prediction.tolist()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)