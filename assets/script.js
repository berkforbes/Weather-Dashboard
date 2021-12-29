// MomentJS date and time
var dateAndTime = moment().format('MMMM Do YYYY, h:mm a')

// Search button gets user input for city location
$("#search-btn").on("click", function(event) {
    event.preventDefault();

    var citySearch = $("#city-search").val().trim();
    

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
    var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=44671d4dd26dc86b18a7b64bfa869339`;
    

    fetch(weatherApiUrl)
        .then(function(response) {
            // request was succesful
            if (response.ok) {
                response.json().then(function(userCity) {
                    console.log(userCity);
                // Allow weather display and empty any current forecast
                $("#weather-display").css("display", "block")
                $("#current-weather").empty();
                
                // var for openweather icon
                var weatherIcon = userCity.weather[0].icon;
                var weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

                // Display forecast and current city info w icon then temp, humidity, wind, UVI
                var cityForecast = $(`<h2 id="current-weather">  ${userCity.name} ${dateAndTime} <img src="${weatherIconURL}" alt="${userCity.weather[0].description}" /></h2>
                
                <h3>Temperature: ${userCity.main.temp}</h3>
                <h3>Humidity: ${userCity.main.humidity}</h3>
                <h3>Wind Speed: ${userCity.main.current.wind_speed}</h3>
                <h3>UV Index: </h3>

                `);

                $("#current-weather").append(cityForecast) 
                
                var lat = userCity.coord.lat;
                var lon = userCity.coord.lon;
                var UVIApi = `https://api.openweathermap.org/data/2.5/onecall{current.uvi}?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=44671d4dd26dc86b18a7b64bfa869339`

                fetch(UVIApi)
                .then(function(response) {
                // request was succesful
                if (response.ok) {
                response.json().then(function(uviData) {
                console.log(uviData);

                    });
                   
                }

            })   
        });
    }
})
}