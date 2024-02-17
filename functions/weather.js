// weather.js

require('dotenv').config();
const fetch = require('node-fetch');
const api_key = process.env.API_KEY;

exports.handler = async function (event, context) {
    try {
        const queryStringParameters = event.queryStringParameters;

        if (!queryStringParameters || !queryStringParameters.locinfo) {
            throw new Error('Invalid or missing locinfo parameter in the query string.');
        }

        const params = queryStringParameters.locinfo.split(',');
        const loc = params[0];
        const unit = params[1];

        // ... rest of your code ...

        return {
            statusCode: 200,
            body: JSON.stringify(json),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
        };
    }
};
