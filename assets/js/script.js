var defaultCity = "Salt Lake City"
var apiUrl = "https://api.openweathermap.org/data/2.5/"
var currentApi = "weather?"
var forecastApi = "forecast?"
var forecastExclude = "&exclude=minutely,hourly"
var apiKey = "&units=imperial&appid=8740010d5ce12cafca0e2a2a6e2bcf85"

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

    $("#location-title").text("Current Location")

    fetch (
        apiUrl + currentApi + "lat=" + lat + "&lon=" + lon + apiKey
    )
    .then (function(response){
        if (response.ok) {
            return response.json();
        } else {
            alert("Unable to find location")
        }
    })
    .then (function(data){
        renderCurrent(data)

        return fetch (
            apiUrl + forecastApi + "lat=" + lat + "&lon=" + lon + apiKey
        ) 
        .then (function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert("Unable to find location")
            }
        })
        .then (function(data){
            renderForecast(data)
        })
        .catch(function(error){
            alert("Unable to connect to GitHub")
        })
    })
  }
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    $("#location-title").text(defaultCity)
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
        console.log("Zip Code");
        locationTitle.text(search);
        getWeather(city, zip);
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
        getWeather(city, zip);
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

var renderCurrent = function(response) {
    var unixDate = response.dt;
    var milliDate = unixDate * 1000;
    var dateObj = new Date(milliDate);
    var convertedDate = dateObj.toLocaleString();
    console.log(convertedDate);
    // Render Date
    currentDate.text(convertedDate);
    locationTitle.text(response.name);
    currentTemp.text(response.main.temp);
    currentWeather.text(response.weather[0].main);
    currentWind.text(response.wind.speed + " mph")
    currentHumidity.text(response.main.humidity + "%");
    // currentUv.text(response.)

}

var renderForecast = function(response) {

}

var getWeather = function(city,zip) {
    if (city !== null) {
        fetch (
            apiUrl + currentApi + "q=" + city + apiKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            } else {
                alert("Unable to find location")
            }
        })
        .then (function(data){
            renderCurrent(data)
    
            return fetch (
                apiUrl + forecastApi + "q=" + city + apiKey
            ) 
            .then (function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Unable to find location")
                }
            })
            .then (function(data){
                renderForecast(data)
            })
            .catch(function(error){
                alert("Unable to connect to GitHub")
            })
        })
    } else if (zip !== null) {
        fetch (
            apiUrl + currentApi + "zip=" + zip + apiKey
        )
        .then (function(response){
            if (response.ok) {
                return response.json();
            } else {
                alert("Unable to find location")
            }
        })
        .then (function(data){
            renderCurrent(data)
    
            return fetch (
                apiUrl + forecastApi + "zip=" + zip + apiKey
            ) 
            .then (function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Unable to find location")
                }
            })
            .then (function(data){
                renderForecast(data)
            })
            .catch(function(error){
                alert("Unable to connect to GitHub")
            })
        })
    }
}

// var locationForecast = function(city, zip) {
//     if (city === null) {
//         fetch (
//         apiUrl + forecastApi + "zip=" + zip + apiKey
//         )
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(response){
//             renderForecast(response)
//         })
//     } else if (zip === null) {
//         fetch (
//             apiUrl + currentApi + "q=" + city + apiKey
//             )
//             .then(function(response){
//                 return response.json();
//             })
//             .then(function(response){
//                 renderForecast(response)
//             })
//     }    
// }

// var currentWeather = function(city, zip) {
//     if (city === null) {
//         fetch (
//         apiUrl + currentApi + "zip=" + zip + apiKey
//         )
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(response){
//             renderCurrent(response)
//         })
//     } else if (zip === null) {
//         fetch (
//             apiUrl + currentApi + "q=" + city + apiKey
//             )
//             .then(function(response){
//                 return response.json();
//             })
//             .then(function(response){
//                 renderCurrent(response)
//             })
//     }

// }

loadLocations();