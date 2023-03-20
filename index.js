// Client-side code will send the location and metric
// So eventually this will be where the API call exists and from here... I will send that back to the client as a JSON file
require('dotenv').config()

api_key = process.env.API_KEY

const express = require('express')
const app = express()
app.listen(3000, () => console.log('Listening at 3000'))
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

app.get('/weather/:locinfo', async (request, response) => {
    //console.log(params)
    const params = request.params.locinfo.split(',')
    const loc = params[0]
    const unit = params[1]

    const api_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&key=${api_key}&contentType=json`

    const fetch_response = await fetch(api_url)
    const json = await fetch_response.json()
    response.json(json)
})