var defaultCity = "Salt Lake City"
var apiUrl = "https://api.openweathermap.org/data/2.5/"
var currentApi = "weather?"
var forecastApi = "onecall?"
var forecastExclude = "&exclude=minutely,hourly"
var apiKey = "&units=imperial&appid=8740010d5ce12cafca0e2a2a6e2bcf85"

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

    fetch(
        apiUrl + forecastApi + "lat=" + lat + "&lon=" + lon + forecastExclude + apiKey
    )
    .then(function(response){
        return response.json();
    })
    .then(function(response){

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
        locationSearch(city, zip);
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
        locationSearch(city, zip);
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


var locationSearch = function(city, zip) {
    console.log("City: ", city,"ZIP: ", zip);
}

var currentWeather = function(response) {
    console.log(response);
}

loadLocations();