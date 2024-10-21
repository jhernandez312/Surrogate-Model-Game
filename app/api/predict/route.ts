import { NextResponse } from 'next/server';

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

        // Send the form data to the Flask API for prediction
        const response = await fetch('https://surrogate-model-game-1-vagb.onrender.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                relativeCompactness,
                surfaceArea,
                roofArea,
                overallHeight,
                orientation,
                glazingArea,
                glazingAreaDistribution,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get prediction from Flask API');
        }

        const result = await response.json();

        // Return the predictions as the response
        return NextResponse.json({ prediction: result.prediction });
    } catch (error) {
        console.error('Error during prediction:', error);
        return NextResponse.json({ error: 'Error during prediction' }, { status: 500 });
    }
}
