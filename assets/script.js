// MomentJS date and time
var dateAndTime = moment().format('MMMM Do YYYY, h:mm a')

// Search button gets user input for city location
$("#search-btn").on("click", function(event) {
    event.preventDefault();

    var citySearch = $("#city-search").val().trim();
    console.log(citySearch)

    if (citySearch) {
        getCityForecast(citySearch);

        //Clear search
        $("#city-search").val("");
    } else {
        //alert if invalid or empty search
        alert("Please Enter a Valid City or Zipcode")
    }
// Store city search to local storage
localStorage.setItem("city", JSON.stringify());

});


// Fetch openweather API
var getCityForecast = function(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=44671d4dd26dc86b18a7b64bfa869339`;

    fetch(apiUrl)
        .then(function(response) {
            // request was succesful
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                // Allow weather display and empty any current forecast
                $("#weather-display").css("display", "block")
                $("#current-weather").empty();
                
                // var for openweather icon
                var weatherIcon = data.weather[0].icon;
                var weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

                // Display forecast and current city info
                var cityForecast = $(`<h2 id="city-forecast"> ${data.name} ${dateAndTime} <img src="${weatherIconURL}" alt="${data.weather[0].description}" /> </h2>`);
                $("#current-weather").append(cityForecast) 
                });
            }

        });
}

