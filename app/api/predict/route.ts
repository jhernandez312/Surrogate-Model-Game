import { NextResponse } from 'next/server';
import { load } from 'pickle';
import * as pandas from 'pandas-js';
import * as fs from 'fs';
import * as path from 'path';
import { MinMaxScaler } from 'sklearn.preprocessing';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Extract form values sent from the client
        const {
            relativeCompactness,
            surfaceArea,
            roofArea,
            overallHeight,
            orientation,
            glazingArea,
            glazingAreaDistribution,
        } = data;

        // Prepare new data dictionary
        const new_data_dict = {
            'Relative Compactness': [relativeCompactness],
            'Surface Area': [surfaceArea],
            'Roof Area': [roofArea],
            'Overall Height': [overallHeight],
            'Orientation': [orientation],
            'Glazing Area': [glazingArea],
            'Glazing Area Distribution': [glazingAreaDistribution],
        };

        const new_data_df = new pandas.DataFrame(new_data_dict);

        // Load training data and the model
        const X_train_path = path.resolve('data/EPB_data.csv'); // Path to the CSV file
        const X_train = pandas.read_csv(X_train_path);

        const model_path = path.resolve('models/finalized_model_multivariate.sav'); // Path to the model
        const loaded_model = load(fs.readFileSync(model_path));

        // Fit the scaler on the training data
        const scaler = new MinMaxScaler();
        scaler.fit(X_train.drop(['Heating Load'], { axis: 1 }));

        // Scale the new data
        const new_X_scaled = scaler.transform(new_data_df);

        // Make predictions using the loaded model
        const predictions = loaded_model.predict(new_X_scaled);

        // Return the predictions as the response
        return NextResponse.json({ prediction: predictions[0] });
    } catch (error) {
        console.error('Error during prediction:', error);
        return NextResponse.json({ error: 'Error during prediction' }, { status: 500 });
    }
}
