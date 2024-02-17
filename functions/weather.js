// weather.js

require('dotenv').config();
const fetch = require('node-fetch');
const api_key = process.env.API_KEY;

exports.handler = async function (event, context) {
    try {
        const params = event.queryStringParameters.locinfo.split(',');
        const loc = params[0];
        const unit = params[1];

        const api_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&key=${api_key}&contentType=json`;

        const fetch_response = await fetch(api_url);
        const json = await fetch_response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(json),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}