
const now = new Date();
const hour = now.getHours() % 12 || 12; // convert to 12-hour clock
const minute = now.getMinutes().toString().padStart(2, '0'); // ensure two digits
const ampm = now.toLocaleTimeString('en-US', { hour12: true }).slice(-2); // extract last two characters


let hourlyTemps = document.querySelectorAll("p.hourly-temp")
let weeklyDays = document.querySelectorAll("h4.daySignifier")

let hoursDisplayed = [1, 2, 3, 4, 5, 6, 7]
hourlyTimes = hoursDisplayed.map((x, index) => {
    x = now.getHours() + index > 24 ? now.getHours() + index - 24 : now.getHours() + index
    x = `${x > 12 ? x - 12 : x} ${denoteMeridiem(x)}`
    return x;
})

const searchbtn = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const fbtn = document.getElementById("f-btn")
const cbtn = document.getElementById("c-btn")

let loc = "Seattle"
let unit = "us"

async function start() {
    console.log(loc)

    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&key=${'PQ9YJKTMGSX5K8C2LRH3A6T7F'}&contentType=json`)
    const data = await response.json()
    updateWeeklyForecast(data.days)
    updateCurrentWeather(data.currentConditions, data)
    updateDayConditions(data.days)
    updateHourlyTemps(data)
}

// define function that updates 
function updateCurrentWeather(current, data) {

    document.getElementById("location").innerHTML = `<span class="text-secondary">Results for</span><strong> ${data.resolvedAddress} | ${returnDay(now.getDay())} ${hour}:${minute} ${ampm}</strong>`
    document.getElementById("conditions").innerHTML = current.conditions
    document.getElementById("curr-temp").innerHTML = `${Math.round(current.temp)}°`
    document.getElementById("feelslike").innerHTML = `Feels like: ${Math.round(current.feelslike)}`
    document.getElementById("curr-image-container").innerHTML = returnIcon(current)

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: hourlyTimes,
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


}

start()

function returnIcon(data) {
    let icon = "Text"

    switch (data.icon) {
        case "partly-cloudy-day":
            icon = '<i class="fa-solid fa-cloud-sun"></i>';
            return icon;
        case "rain":
            icon = '<i class="fa-solid fa-cloud-rain"></i>';
            break;
        case "snow":
            icon = '<i class="fa-regular fa-snowflake"></i>';
            break;
        case "clear-day":
            icon = '<i class="fa-solid fa-sun"></i>';
            break;
        case "clear-night":
            icon = '<i class="fa-regular fa-moon"></i>';
            break;
        case "cloudy":
            icon = '<i class="fa-solid fa-cloud"></i>';
            break;
        case "partly-cloudy-night":
            icon = '<i class="fa-solid fa-cloud-moon"></i>'
            break;
    }
    return icon
}

function updateDayConditions(data) {
    document.getElementById("minmax").innerHTML = `High: ${Math.round(data[0].tempmax)} Low: ${Math.round(data[0].tempmin)}`
    document.getElementById("precip").innerHTML = `Precipitation: ${Math.round(data[0].precipprob)}%`
    document.getElementById("humidity").innerHTML = `Humidity: ${Math.round(data[0].humidity)}%`
    document.getElementById("wind").innerHTML = `Wind: ${data[1].windspeed} mp/h`
}

function updateWeeklyForecast(data) {
    //Update daily forecast icons
    document.querySelectorAll("span.forecast-icon").forEach((day, index) => {
        day.innerHTML = returnIcon(data[index])
    })

    //Update daily forecast numbers
    document.querySelectorAll("p.weekly-hilo").forEach((day, index) => {
        console.log(data)
        day.innerHTML = `<span>${Math.round(data[0 + index].tempmax)}°</span> / <span class="text-secondary">${Math.round(data[0 + index].tempmin)}°</span>`
    })
}

fbtn.addEventListener("click", changeUnit)
cbtn.addEventListener("click", changeUnit)
searchbtn.addEventListener("click", changeLocation)

function changeUnit(e) {
    if (e.target == cbtn) {
        unit = "metric"
        cbtn.disabled = true
        fbtn.disabled = false
    } else {
        unit = "us"
        cbtn.disabled = false
        fbtn.disabled = true
    }
    start()
}

function searchEnter(event) {
    if (event.keyCode == 13) {
        changeLocation()
    }
}

function changeLocation() {
    loc = searchInput.value
    start()
    searchInput.value = ""
}

function returnDay(date) {
    let day = ""
    switch (date) {
        case 0:
            day = "Sun";
            break;
        case 1:
            day = "Mon";
            break;
        case 2:
            day = "Tues";
            break;
        case 3:
            day = "Wed";
            break;
        case 4:
            day = "Thu";
            break;
        case 5:
            day = "Fri";
            break;
        case 6:
            day = "Sat";
    }
    return day
}

function denoteMeridiem(x) {
    if (x == 24) {
        return "AM"
    } else if (x >= 12) {
        return "PM"
    } else {
        return "AM"
    }
}



weeklyDays.forEach((day, index) => {
    let printedDay = (now.getDay() + index) < 6 ? now.getDay() + index : now.getDay() + index - 6
    day.innerHTML = returnDay(printedDay)
})


const ctx = document.getElementById('myChart');


