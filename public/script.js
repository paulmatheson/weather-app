// Default variables
let loc = "Seattle"
let unit = "us"
let ws = "mph"
let currHour = 0
let dayNum = 0
let weeklyDays = document.querySelectorAll("h4.daySignifier")
let hourlyTimes = [1, 2, 3, 4, 5, 6, 7, 8]
let dayTxt = ''

// Document variables
const weeklyBtns = document.querySelectorAll("button.weekly")
const searchbtn = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const fbtn = document.getElementById("f-btn")
const cbtn = document.getElementById("c-btn")
const locTxt = document.getElementById("location")
const condTxt = document.getElementById("conditions")
const cTmpTxt = document.getElementById("curr-temp")
const flTxt = document.getElementById("feelslike")
const currIcon = document.getElementById("curr-image-container")
fbtn.disabled = true;

let chartInstance // declare a variable to hold the chart instance

async function start(dayNum, loc, unit) {
    try {
        const api_url = `/.netlify/functions/weather?locinfo=${loc},${unit}`;
        const response = await fetch(api_url)
        data = await response.json()

        // Location-dependant time
        const currentTime = new Date().toLocaleString("en-US", { timeZone: data.timezone })
        now = new Date(currentTime) // alter to adjust by day somehow
        day = now.getDate(dayNum)
        //console.log(day)
        hour = now.getHours() % 12 || 12; // convert to 12-hour clock
        minute = now.getMinutes().toString().padStart(2, '0'); // ensure two digits
        ampm = now.toLocaleTimeString('en-US', { hour12: true }).slice(-2); // extract last two characters

        // Holds the variables that will be the charts x-axis
        hourlyTimes = hourlyTimes.map((x, index) => {
            x = now.getHours() + index > 24 ? now.getHours() + index - 24 : now.getHours() + index
            x = `${x > 12 ? x - 12 : x} ${denoteMeridiem(x)}`
            return x;
        })

        // These are the temperatures at each hour
        const hourlyTemps = [] // declare hourlyTemps as a local variable
        for (let i = 0; i < 8; i++) {
            currHour = now.getHours() + i >= 24 ? now.getHours() + i - 24 : now.getHours() + i
            if (data.days[dayNum].hours[currHour]) {
                hourlyTemps.push(data.days[dayNum].hours[currHour].temp)
            } else {
                hourlyTemps.push(data.days[dayNum].hours[currHour - 1].temp)
            }
        }

        // Alter the printed day names in the weekly forecast
        weeklyDays.forEach((day, index) => {
            let printedDay = (now.getDay() + index) < 6 ? now.getDay() + index : now.getDay() + index - 6
            day.innerHTML = returnDay(printedDay)
        })

        // Data that refreshes based on location, time and the chosen date from the weekly forecast
        updateDayConditions(data.days, now)
        updateCurrentWeather(data, now, dayNum)
        updateWeeklyForecast(data.days, now)

        if (!chartInstance) { // check if chartInstance is undefined
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hourlyTimes,
                    datasets: [{
                        data: hourlyTemps,
                        fill: true,
                        borderColor: 'rgb(35, 122, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            suggestedMin: Math.min(...hourlyTemps) - 1,
                            suggestedMax: Math.max(...hourlyTemps) + 1,
                            ticks: {
                                stepSize: 2 // Set the spacing between tick marks to 5
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            })
        } else { // update chart data using the update() method
            chartInstance.data.datasets[0].data = hourlyTemps
            chartInstance.options.scales.y.suggestedMin = Math.min(...hourlyTemps) - 2
            chartInstance.options.scales.y.suggestedMax = Math.max(...hourlyTemps) + 2
            chartInstance.data.labels = hourlyTimes
            chartInstance.update()
        }


    } catch (error) {
        console.error(error)
    }
}

// define function that updates the current weather
function updateCurrentWeather(data, time, id) {

    if (id === 0) {

        locTxt.innerHTML = `<span class="text-secondary">Results for</span><strong> ${data.resolvedAddress} | <span id="day-txt">${returnDay(time.getDay())}</span> ${hour}:${minute} ${ampm}</strong>` // Location and time
        condTxt.innerHTML = data.currentConditions.conditions // Conditions
        cTmpTxt.innerHTML = `${Math.round(data.currentConditions.temp)}°` // Current Temperature
        flTxt.innerHTML = `Feels like: ${Math.round(data.currentConditions.feelslike)}°` // Feels like
        currIcon.innerHTML = returnIcon(data.currentConditions) // Associated Icon
    } else {
        cTmpTxt.innerHTML = `${Math.round(data.days[id].tempmax)}°`
        flTxt.innerHTML = `Feels like: ${Math.round(data.days[id].feelslike)}°`
        currIcon.innerHTML = returnIcon(data.days[id])
        condTxt.innerHTML = data.days[id].conditions
    }

}

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
    document.getElementById("minmax").innerHTML = `High: ${Math.round(data[dayNum].tempmax)}° Low: ${Math.round(data[dayNum].tempmin)}°`
    document.getElementById("precip").innerHTML = `Precipitation: ${Math.round(data[dayNum].precipprob)}%`
    document.getElementById("humidity").innerHTML = `Humidity: ${Math.round(data[dayNum].humidity)}%`
    document.getElementById("wind").innerHTML = `Wind: ${data[dayNum].windspeed} ${ws}`
}

function updateWeeklyForecast(data) {
    //Update daily forecast icons
    document.querySelectorAll("span.forecast-icon").forEach((day, index) => {
        day.innerHTML = returnIcon(data[index])
    })

    //Update daily forecast numbers
    document.querySelectorAll("p.weekly-hilo").forEach((day, index) => {
        day.innerHTML = `<span>${Math.round(data[0 + index].tempmax)}°</span> / <span class="text-secondary">${Math.round(data[0 + index].tempmin)}°</span>`
    })

    if (dayNum == 0) {
        weeklyBtns.forEach(btn => {
            if (btn.id == 0) {
                btn.disabled = true
                btn.classList.remove("button")
            } else {
                btn.disabled = false;
                btn.classList.add("button")
            }
        })
    }
}

fbtn.addEventListener("click", changeUnit)
cbtn.addEventListener("click", changeUnit)
searchbtn.addEventListener("click", changeLocation)

function changeUnit(e) {
    if (e.target == cbtn) {
        unit = "metric"
        ws = "kmh"
        cbtn.disabled = true
        fbtn.disabled = false
    } else {
        unit = "us"
        ws = "mph"
        cbtn.disabled = false
        fbtn.disabled = true
    }
    start(dayNum, loc, unit)
}

function searchEnter(event) {
    if (event.keyCode == 13) {
        changeLocation()
    }
}

function changeLocation() {
    loc = searchInput.value
    dayNum = 0
    start(dayNum, loc, unit)
    searchInput.value = ""
    hourlyTemps = []
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

weeklyBtns.forEach(button => {
    button.addEventListener("click", function () {
        document.getElementById("day-txt").innerHTML = this.children[0].innerHTML

        weeklyBtns.forEach(btn => {
            if (btn.disabled == true) {
                btn.disabled = false
                btn.classList.add("button")
            }
        })
        this.disabled = true
        setTimeout(() => {
            this.classList.remove("button")
        }, 300)

        dayNum = parseInt(this.id)
        start(dayNum, loc, unit)
        // remove disabled from current
        // add class of button to transitioned
        // remove class of button to the trasionee
        // add disabled to transitionee
        // re-run the start() function with the changed times
    })
})

document.getElementById("trigger-popup").addEventListener("click", function () {
    document.getElementById("pop").style.display = 'flex'
})

document.getElementById("popupCloseButton").addEventListener("click", function () {
    document.getElementById("pop").style.display = 'none'
})

const ctx = document.getElementById('myChart');

start(dayNum, loc, unit)