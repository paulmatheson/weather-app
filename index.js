require('dotenv').config()
const express = require('express');
api_key = process.env.API_KEY

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.get('/weather/:locinfo', async (request, response) => {

    const params = request.params.locinfo.split(',')
    const loc = params[0]
    const unit = params[1]

    const api_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&key=${api_key}&contentType=json`

    const fetch_response = await fetch(api_url)
    const json = await fetch_response.json()
    response.json(json)
})