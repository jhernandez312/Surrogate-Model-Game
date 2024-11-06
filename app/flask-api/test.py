# test_load_models.py
from joblib import load

try:
    model_heating = load('Model_Heating_1104/gbr_best_Y1_compat.joblib')
    model_cooling = load('Model_Cooling_1104/gbr_best_Y2_compat.joblib')
    print("Models loaded successfully.")
except Exception as e:
    print("Error loading models:", e)