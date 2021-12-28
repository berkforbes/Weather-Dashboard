// Search button gets user input for city location
$("#search-btn").on("click", function(event) {
    event.preventDefault();

    var citySearch = $("#city-search").val().trim();
    console.log(citySearch)

    if (citySearch) {
        // call function to fetch weather API

        //Clear search
        $("#city-search").val("");
    } else {
        //alert if invalid or empty search
        alert("Please Enter a Valid City or Zipcode")
    }
});
