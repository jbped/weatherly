var defaultCity = "Salt Lake City"
var apiUrl = "https://api.openweathermap.org/data/2.5/weather"
var apiKey = "&appid=8740010d5ce12cafca0e2a2a6e2bcf85"
var apiQuery = "?q="


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

    // fetch(
    //     apiUrl + "?lat=" + lat + "&lon=" + lon + apiKey
    // )
    // .then(function(response){
    //     return response.json();
    // })
    // .then(function(response){

    // })
  }
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    $("#location-title").text(defaultCity)
  }

navigator.geolocation.getCurrentPosition(success, error, options);
// CURRENT LOCATION ---------------------------------------------- END

// Search Location
$("#search-form").submit(function(event){
    event.preventDefault();
    var search =  $(this).children("#location-search").val().trim();
    $("#location-search").val("");
    if(search > 0 && search < 99999) {
        var city = null;
        var zip = search;
        console.log("Zip Code");
        locationSearch(city, zip);
        locArrHandler(search);
    } else if (!search) {
        alert("Please provide a city or ZIP code in the search bar. Thank you!")
        console.log("No location provided in search bar")
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
})

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

var renderLocArr = function() {
    var locationUl = $("<ul></ul>");
    for (var i = 0; i < locationArr.length; i++) {
        var location = $("<li></li>").attr("prev-loc", i).addClass('prev-loc-li');
        var locationText = $("<h4></h4>").text(locationArr[i]);
        location.append(locationText);
        locationUl.append(location);
    }
    $("#previous-search").html("")
    $("#previous-search").append(locationUl);
}

var locationSearch = function(city, zip) {
    console.log("City: ", city,"ZIP: ", zip);
}

var currentWeather = function(response) {
    console.log(response);
}

loadLocations();