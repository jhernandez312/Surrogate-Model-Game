from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from pickle import load
 
app = Flask(__name__)
CORS(app)
 
# Load the saved model
model = load(open('xgbr_model_Y1.sav', 'rb'))
 
# Load pre-fitted label encoders and scaler (these should be fitted with the training data)
label_encoders = {
    'X1_Type': LabelEncoder(),
    'X2_Shape': LabelEncoder(),
    'X10_EnergyCode': LabelEncoder(),
    'X12_HVAC': LabelEncoder()
}
 
# Fit encoders with categories as used during training (example categories provided)
label_encoders['X1_Type'].fit([
    "Warehouse",
    "StripMall",
    "Retail",
    "QuickServiceRestaurant",
    "Hospital",
    "SmallOffice",
    "Outpatient",
    "Office",
    "FullServiceRestaurant",
    "SmallHotel",
    "SecondarySchool",
    "LargeHotel",
    "Office",
    "PrimarySchool"
])  # Replace with actual categories
label_encoders['X2_Shape'].fit(['Wide rectangle', 'L shape', 'T shape'])    # Replace with actual categories
label_encoders['X10_EnergyCode'].fit(['ComStock 90.1-2007', 'ComStock DOE Ref 1980-2004', 'ComStock 90.1-2004', 'ComStock DOE Ref Pre-1980'])  # Replace with actual categories
label_encoders['X12_HVAC'].fit(['Small Packaged Unit', 'Multizone CAV/VAV', 'Zone-by-Zone', 'Residential Style Central Systems'])  # Replace with actual categories
 
# Load scaler and fit on training data (e.g., EPB_data.csv)
#scaler = MinMaxScaler()
#X_train = pd.read_csv('EPB_data.csv')  # Replace with actual path to training data
#scaler.fit(X_train.drop(columns=['Heating Load']))
 
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
 
    # Convert the incoming JSON data to a DataFrame
    df = pd.DataFrame({
        'X1_Type': [data['Building_Type']],
        'X2_Shape': [data['Building_Shape']],
        'X3_Orientation': [data['Orientation']],
        'X5_Stories': [data['Building_Stories']],
        'X6_WallArea': [data['Wall_Area']],
        'X7_WindowArea': [data['Window_Area']],
        'X8_WWR': [data['WWR']],
        'X9_RoofArea': [data['Roof_Area']],
        'X10_EnergyCode': [data['energy_code']],
        'X12_HVAC': [data['hvac_category']],
        'X13_Length': [data['Length']],
        'X14_Width': [data['Width']],
        'X15_FloorHeight': [data['Floor_Height']],
        'Building_Height': [data['Building_Height']]
    })
 
    # Apply label encoding for categorical variables
    for col, encoder in label_encoders.items():
        df[col] = encoder.transform(df[col])
 
    # Scale numeric features
    scaled_data = df
    print(df)
    # Make prediction
    prediction = model.predict(scaled_data)
    print(prediction)
    # Return prediction as JSON
    return jsonify({'prediction': prediction.tolist()})
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)