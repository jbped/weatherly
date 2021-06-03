var defaultCity = "Salt Lake City"
var weatherApi = "https://api.openweathermap.org/data/2.5/onecall"
var locationApi = "https://api.openweathermap.org/geo/1.0/"
var forecastExclude = "&exclude=minutely,hourly,alerts"
var defaultUnits = "&units=imperial"
var apiKey = "&appid=8740010d5ce12cafca0e2a2a6e2bcf85"

// Current Weather DOM Selectors
var locationTitle = $("#location-title");
var currentTemp = $("#current-temp");
var currentDate = $("#current-date");
var currentWeather = $("#current-weather");
var currentWind = $("#current-wind");
var currentHumidity = $("#current-humidity");
var currentUv = $("#current-uv");

// Day 1 Forecast DOM Selectors
var dayOneTitle = $("#day-one-title");
var dayOneTemp = $("#day-one-temp-span");
var dayOneWind = $("#day-one-wind-span");
var dayOneHumidity = $("#day-one-humidity-span");

// Day 2 Forecast DOM Selectors
var dayTwoTitle = $("#day-two-title");
var dayTwoTemp = $("#day-two-temp-span");
var dayTwoWind = $("#day-two-wind-span");
var dayTwoHumidity = $("#day-two-humidity-span");

// Day 3 Forecast DOM Selectors
var dayThreeTitle = $("#day-three-title");
var dayThreeTemp = $("#day-three-temp-span");
var dayThreeWind = $("#day-three-wind-span");
var dayThreeHumidity = $("#day-three-humidity-span");

// Day 4 Forecast DOM Selectors
var dayFourTitle = $("#day-four-title");
var dayFourTemp = $("#day-four-temp-span");
var dayFourWind = $("#day-four-wind-span");
var dayFourHumidity = $("#day-four-humidity-span");

// Day 5 Forecast DOM Selectors
var dayFiveTitle = $("#day-five-title");
var dayFiveTemp = $("#day-five-temp-span");
var dayFiveWind = $("#day-five-wind-span");
var dayFiveHumidity = $("#day-five-humidity-span");

// CURRENT LOCATION -------------------------------------------- START
// On page load get current location or display default city
var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  
function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude;
    var lon = crd.longitude;

    // return (lat, lon)
    console.log('Your current position is:');
    console.log(`Latitude : ${lat}`);
    console.log(`Longitude: ${lon}`);

    locationTitle.text("Current Location")
    getWeather(lat, lon);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    var zipCode = null
    var city = defaultCity
    getLocation(defaultCity, zipCode)
  }

navigator.geolocation.getCurrentPosition(success, error, options);
// CURRENT LOCATION ---------------------------------------------- END

var loadLocations = function(){
    locationArr = JSON.parse(localStorage.getItem("locationArr"));

    if(!locationArr) {
        locationArr = [];
    };

    renderLocArr();
}

var saveLocations = function() {
    localStorage.setItem("locationArr",JSON.stringify(locationArr));
}

// Search Location
$("#search-form").submit(function(event){
    event.preventDefault();
    clearActiveBtn();
    var search =  $(this).children("#location-search").val().trim();
    $("#location-search").val("");
    locationLogic(search);
})

// Select Previous Loaction
$("#prev-loc-cont").click(function(target){
    var selectedBtn = $(target)[0].target;
    $(selectedBtn).siblings(".prev-loc").removeClass("active");
    $(selectedBtn).addClass("active");
    var search = selectedBtn.innerText;
    locationLogic(search);
})

// Location passed through from search or previous location button press, logic for identifying if it is a city or zip code
var locationLogic = function(search) {
    // If search is a zip code
    if(search > 10000 && search < 99999) {
        var city = null;
        var zip = search;
        getLocation(city, zip);
        locArrHandler(search);
    // If search is blank
    } else if (!search || search < 10000) {
        alert("Please provide a city or ZIP code in the search bar. Thank you!")
        console.log("No location provided in search bar")
    // If search is a city
    } else {
        var editCity = search.toLowerCase().split(" ");
        for (var i = 0; i < editCity.length; i++) {
            editCity[i] = editCity[i][0].toUpperCase() + editCity[i].substr(1);
        }
        var city = editCity.join(" ");
        var zip = null;
        locationTitle.text(city);
        getLocation(city, zip);
        locArrHandler(city);
    }
}

// Remove active button class from previous locations buttons
var clearActiveBtn = function(){
    $.each($(".prev-loc"), function(){
        $(this).removeClass("active");
    })
}

// Generate Location Array (maxes out at 5 items)
var locArrHandler = function(search) {
    // Skip duplicate values
    if (locationArr.includes(search)) {
        renderLocArr();
    } 
    // If array < 5 add search value to index[0]
    else if (locationArr.length < 5) {
        locationArr.unshift(search);
        console.log(locationArr);
        console.log("Array Length=",locationArr.length);
        renderLocArr();
        saveLocations();
    } 
    // If array === 5 remove last index item
    else if (locationArr.length === 5) {
        locationArr.pop();
        locationArr.unshift(search);
        console.log(locationArr);
        console.log("Array Length=",locationArr.length);
        renderLocArr();
        saveLocations();
    }
}

// Renders/appends the location array to the Previous Location Container
var renderLocArr = function() {
    var prevLocCont = $("#prev-loc-cont");
    prevLocCont.html("")
    for (var i = 0; i < locationArr.length; i++) {
        var location = $("<button></button>")
            .attr("id", "prev-loc-" + i)
            .addClass("list-group-item list-group-item-action prev-loc")
            .text(locationArr[i]);
        prevLocCont.append(location);
    }
}

var renderWeather = function(response) {
    var convertedCurrentDate = (new Date((response.current.dt) * 1000)).toLocaleString("en-US", {day:"numeric",month:"numeric",year:"numeric"});
    // Render Date
    currentDate.text(convertedCurrentDate);
    locationTitle.text(response.name);
    // Current Weather
    currentTemp.text(response.current.temp + "\xB0");
    currentWeather.text(response.current.weather[0].main);
    currentWind.text(response.current.wind_speed + " mph");
    currentHumidity.text(response.current.humidity + "%");
    currentUv.text(response.current.uvi);
    if (response.current.uvi > 8) {
        currentUv.addClass("severe-uv");
    } else if (response.current.uvi > 3 && response.current.uvi < 7) {
        currentUv.addClass("moderate-uv");
    } else if (response.current.uvi < 3) {
        currentUv.addClass("low-uv");
    }
    // Day 1 Weather
    dayOneDate = (new Date((response.daily[1].dt) * 1000)).toLocaleString("en-US", {day:"numeric",month:"numeric",year:"numeric"});
    dayOneTitle.text(dayOneDate);
    dayOneTemp.text(response.daily[1].temp.day +"\xB0");
    dayOneWind.text(response.daily[1].wind_speed + " mph");
    dayOneHumidity.text(response.daily[1].humidity + "%");
    // Day 2 Weather
    dayTwoDate = (new Date((response.daily[2].dt) * 1000)).toLocaleString("en-US", {day:"numeric",month:"numeric",year:"numeric"});
    dayTwoTitle.text(dayTwoDate);
    dayTwoTemp.text(response.daily[2].temp.day +"\xB0");
    dayTwoWind.text(response.daily[2].wind_speed + " mph");
    dayTwoHumidity.text(response.daily[2].humidity + "%");
    // Day 3 Weather
    dayThreeDate = (new Date((response.daily[3].dt) * 1000)).toLocaleString("en-US", {day:"numeric",month:"numeric",year:"numeric"});
    dayThreeTitle.text(dayThreeDate);
    dayThreeTemp.text(response.daily[3].temp.day +"\xB0");
    dayThreeWind.text(response.daily[3].wind_speed + " mph");
    dayThreeHumidity.text(response.daily[3].humidity + "%");
    // Day 4 Weather
    dayFourDate = (new Date((response.daily[4].dt) * 1000)).toLocaleString("en-US", {day:"numeric",month:"numeric",year:"numeric"});
    dayFourTitle.text(dayFourDate);
    dayFourTemp.text(response.daily[4].temp.day +"\xB0");
    dayFourWind.text(response.daily[4].wind_speed + " mph");
    dayFourHumidity.text(response.daily[4].humidity + "%");
    // Day 5 Weather
    dayFiveDate = (new Date((response.daily[5].dt) * 1000)).toLocaleString("en-US", {day:"numeric",month:"numeric",year:"numeric"});
    dayFiveTitle.text(dayFiveDate);
    dayFiveTemp.text(response.daily[5].temp.day +"\xB0");
    dayFiveWind.text(response.daily[5].wind_speed + " mph");
    dayFiveHumidity.text(response.daily[5].humidity + "%");


}

// var getLocation = function(city, zip) {
//     if (city !== null) {
//         fetch (
//             locationApi + "direct?q=" + city + apiKey
//         )
//         .then (function(response) {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 alert("Unable to find location")
//             }
//         })
//         .then (function(data){
//             var lat = data[0].lat;
//             var lon = data[0].lon;
//             console.log(lat, lon);
//             locationTitle.text(data[0].name);
//             getWeather(lat, lon);
//         })
//         .catch(function(error){
//             alert("Unable to connect to Open Weather 214")
//         })
//     }
//     else if (zip !== null) {
//         fetch (
//             locationApi + "zip?zip=" + zip + apiKey
//         )
//         .then (function(response) {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 alert("Unable to find location")
//             }
//         })
//         .then (function(data){
//             var lat = data.lat;
//             var lon = data.lon;
//             console.log(lat, lon);
//             locationTitle.text(data.name + " (" + zip + ")");
//             getWeather(lat, lon);
//         })
//         .catch(function(error){
//             alert("Unable to connect to Open Weather 234")
//         })
//     }
// }

// var getWeather = function(lat, lon) {
//     fetch (
//         weatherApi + "?lat=" + lat + "&lon=" + lon + forecastExclude + defaultUnits + apiKey
//     )
//     .then (function(response){
//         if (response.ok) {
//             return response.json();
//         } else {
//             alert("Unable to find location")
//         }
//     })
//     .then (function(data){
//         renderWeather(data)
//     })
//     // .catch(function(error){
//     //     alert("Unable to connect to Open Weather 254")
//     // })
// }

loadLocations();