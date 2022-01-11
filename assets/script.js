// MomentJS date and time
var dateAndTime = moment().format("MMMM Do YYYY, h:mm a");

// Search button gets user input for city location
$("#search-btn").on("click", function (event) {
  let citySearchHistory = [];
  let citySearches = JSON.parse(localStorage.getItem('city'));
  citySearchHistory = citySearches

  event.preventDefault();

  var citySearch = $("#city-search").val().trim();
  citySearchHistory.push(citySearch)
  if (citySearch) {
    getCityForecast(citySearch);

    //Clear search
    $("#city-search").val("");
  } else {
    //alert if invalid or empty search
    alert("Please Enter a Valid City or Zipcode");
  }
  // Store city search to local storage
  localStorage.setItem("city", JSON.stringify(citySearchHistory));
});

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
          $(`<h2 id="current-weather">  ${citySearch.name} ${dateAndTime} <img src="${weatherIconURL}" alt="${citySearch.weather[0].description}" /></h2>
                
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
            console.log(uviData)
            
            var {uvi} = uviData.current;
            var uv = document.querySelector("#uv-index")
            uv.innerHTML = `<h3 id="uv-index uv-status-color" class="px-2 py-2">UV Index: ${uvi}</h3>`;
            console.log({uvi})

          // UV will change background color based on result; green, orange, violet
          if ({uvi} >= 0 && {uvi} <= 3) {
              $("#uv-status-color").css("background-color", "green").css("color", "white");
          } else if ({uvi} >= 3.1 && {uvi} <= 7) {
              $("#uv-status-color").css("background-color", "orange");
          } else {
              $("#uv-status-color").css("background-color", "violet").css("color", "white"); 
          };

                    // loop for 5-day forecast
                    for (let i = 1; i < 6; i++) {
                      var cityDetails = {
                        date: uviData.daily[i].dt,
                        icon: uviData.daily[i].weather[0].icon,
                        temp: uviData.daily[i].temp.day,
                        humidity: uviData.daily[i].humidity
                      };
          
                      var currently = moment.unix(cityDetails.date).format("MM/DD/YYYY");
                      var weatherIconURL = `<img src="https://openweathermap.org/img/w/${cityDetails.icon}.png" alt="${uviData.daily[i].weather[0].main}" />`;
          
                    // display date, weather icon, temp, and humidity
                      var futureDisplay = $(`
                      <div class="pl-3">
                              <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                                  <div class="card-body">
                                      <h5>${currently}</h5>
                                      <p>${weatherIconURL}</p>
                                      <p>Temperature: ${cityDetails.temp} °F</p>
                                      <p>Humidity: ${cityDetails.humidity}\%</p>
                                  </div>
                              </div>
                          <div>
                      `);
          
                      $("#5day-forecast").append(futureDisplay);

          };
          })

        }
          })
            
          }
        }
      })
        }
      ;
    
  
  ;
;
