// MomentJS date and time
const dateAndTime = moment().format("MMMM Do YYYY");


// Fetch openweather API -- Gets called upon button click
var getCityForecast = function (citySearch) {
  var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=44671d4dd26dc86b18a7b64bfa869339`;

  fetch(weatherApiUrl).then(function (response) {
    // request was succesful
    if (response.ok) {
      response.json().then(function (citySearch) {
        console.log(citySearch);

        // Call function to get uvindex
        fiveDayAndUVI(citySearch.coord.lat, citySearch.coord.lon)

        // Allow weather display and empty any current forecast
        $("#weather-display").css("display", "block");
        $("#current-weather").empty();

        // var for openweather icon
        var weatherIcon = citySearch.weather[0].icon;
        var weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

        // Display forecast and current city info w icon then temp, humidity, wind, UVI
        var cityForecast =
          $(`<h2 id="current-weather class="current-cityDisplay">  ${citySearch.name} 
          <br>${dateAndTime}</br> <img src="${weatherIconURL}" alt="${citySearch.weather[0].description}" /></h2>
                
                <h3>Temperature: ${citySearch.main.temp}</h3>
                <h3>Humidity: ${citySearch.main.humidity}</h3>
                <h3>Wind Speed: ${citySearch.wind.speed}</h3>
                <h3 id="uv-index">UV Index: </h3>
                `);

        $("#current-weather").append(cityForecast);

      });

      var fiveDayAndUVI = function(lat, lon) {

      var fiveDayAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=44671d4dd26dc86b18a7b64bfa869339`;

      fetch(fiveDayAPI).then(function (response) {
        // request was succesful
        if (response.ok) {
          response.json().then(function (uviData) {
            
            var {uvi} = uviData.current;
            var uv = document.querySelector("#uv-index")
            uv.innerHTML = `<h3 id="uv-index" class="px-2 py-2 rounded">UV Index: ${uvi}</h3>`;
            console.log(uvi)

          // UV will change background color based on result; green, orange, violet
          if (uvi >= 0 && uvi <= 3) {
              $("#uv-index").css("background-color", "green").css("color", "white");
          } else if (uvi >= 3.1 && uvi <= 7) {
              $("#uv-index").css("background-color", "orange");
          } else {
              $("#uv-index").css("background-color", "violet").css("color", "white"); 
          };

          // Clear 5day forecast with new search
          $("#fiveDay-forecast").html("")

        // loop for 5-day forecast
          for (let i = 0; i < 5; i++) {
            var cityDetails = {
            date: uviData.daily[i].dt,
            icon: uviData.daily[i].weather[0].icon,
            temp: uviData.daily[i].temp.day,
            humidity: uviData.daily[i].humidity
            };
          
          var currently = moment.unix(cityDetails.date).format("MM/DD/YYYY");
          var weatherIconURL = `<img src="https://openweathermap.org/img/w/${cityDetails.icon}.png" alt="${uviData.daily[i].weather[0].main}" />`;
          
        // display date, weather icon, temp, and humidity
          var fiveDayDisplay = $(`
            <div class="pl-3">
               <div class="card pl-3 pt-3 mb-5 bg-primary text-light border border-2 border-dark text-center" style="width: 12rem;>
                <div class="card-body">
                  <h4>${currently}</h4>
                  <h4>${weatherIconURL}</h4>
                  <h6>Temperature: ${cityDetails.temp} °F</h6>
                  <h6>Humidity: ${cityDetails.humidity}\%</h6>
                </div>
              </div>
            <div>
              `);
            
          $("#fiveDay-forecast").append(fiveDayDisplay);
              };
            });
          };
        });         
      };
    };
  });
}

// Search button gets user input for city location
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  var citySearchHistory = [];

  // City-search input value has any extra spaces trimmed and saved as var
  var citySearch = $("#city-search").val().trim();

  if (citySearch) {
    getCityForecast(citySearch);
    //Clear search
    $("#city-search").val("");
    citySearchHistory.push(citySearch)
    var currentCitySearch = $(` <li class="city-list">${citySearch}</li>`)
    $('#search-history').append(currentCitySearch);
  } 
  else {
    //alert if invalid or empty search
    alert("Please Enter a Valid City");
  }
  // Store city search to local storage
  localStorage.setItem("city", JSON.stringify(citySearchHistory));
});

// Clicking on saved searches will update forecasts, current and 5day
$(document).on('click', ".city-list", function() {
  var savedCity = $(this).text();
  getCityForecast(savedCity)
});

// Most recent search will populate on refresh
$(document).ready(function(){
  citySearchHistory = JSON.parse(localStorage.getItem('city'));

  if (citySearchHistory !== null) {
    var previousSearchIndex = citySearchHistory.length -1;
    var previouslySearchedCity = citySearchHistory[previousSearchIndex];
    getCityForecast(previouslySearchedCity);
  }

  let citySearches = JSON.parse(localStorage.getItem('city'));
  citySearchHistory = citySearches
})



// Execute a function when the user releases a key on the keyboard
$("#city-search").on("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    $("#search-btn").click()
  }
});

