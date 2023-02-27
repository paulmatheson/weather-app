fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/98199?unitGroup=metric&key=JXW9255N8RZ8H7BTWSULKLMXF&contentType=json")

let now = new Date()
let hourlyTimes = document.querySelectorAll("h4.hour")
let weeklyDays = document.querySelectorAll("h4.daySignifier")

function returnHour(date) {
    return date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
}

function returnDay(date) {
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
    if (x >= 12) {
        return "PM"
    } else {
        return "AM"
    }
}

hourlyTimes.forEach((hour, index) => {
    let hourTxt = returnHour(now) + index
    if (index == 0) {
        hour.innerHTML = "Now"
    } else {
        hour.innerHTML = `${(hourTxt > 12 ? hourTxt - 12 : hourTxt)} ${denoteMeridiem(hourTxt)}`
    }
})

weeklyDays.forEach((day, index) => {
    day.innerHTML = returnDay(now.getDay() + index)
})