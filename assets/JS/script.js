// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

//Variables
var currentForecast = $("#weather-information")
var futureForecast = $("#weather-station");
var searchBtn = $("#location-search");
var temp = $("#temp");
var humid = $("#humid");
var wind = $("#wind");
var uv = $("#uv");
var uniqueKey = "2be38a9e275be7fe8b472479d420fa22";

//Get Weather
function weatherConditions(cityName, fn) {
  $.ajax("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",US&limit=5&appid=" + uniqueKey)
  .done(function(data) {
    var lat
    var lon

    if (data.length > 0) {
      lat=data[0].lat;
      lon=data[0].lon;
    }
    $.ajax("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + uniqueKey)
    .done(function(weatherData) {
      fn( {
        temperature: weatherData.current.temp,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_speed,
        uvIndex: weatherData.current.uvi,
        forecast: weatherData.daily.slice(0,5)
      });
    });
  })
  .fail(function(error){
    console.log(error);
  })
};

//Function to Display the Weather 
function displayWeatherData(weatherInfo) {
  temp.text(weatherInfo.temperature);
  humid.text(weatherInfo.humidity);
  wind.text(weatherInfo.windSpeed);
  uv.text(weatherInfo.uvIndex);

  if (uv >= 0 && uv <= 2) {
    uv.css("background-color", "#3EA72D").css("color", "white");
} else if (uv >= 3 && uv <= 5) {
    uv.css("background-color", "#FFF300");
} else if (uv >= 6 && uv <= 7) {
    uv.css("background-color", "#F18B00");
} else if (uv >= 8 && uv <= 10) {
    uv.css("background-color", "#E53210").css("color", "white");
} else {
    uv.css("background-color", "#B567A4").css("color", "white"); 
};  


  futureForecast.children("div").each(function(i) {
    $(".date", this).text(moment.unix(weatherInfo.forecast[i].dt).format("MM/DD/YYYY"));
    $(".temperature", this).text(weatherInfo.forecast[i].temp.max);
    $(".w-speed", this).text(weatherInfo.forecast[i].wind_speed);
    $(".humidity", this).text(weatherInfo.forecast[i].humidity);
  })

};


//Search Button Functionality
searchBtn.on("click", function(event) {
    var citySearch = $("#search-city").val();
    event.preventDefault();
    
    $("span").show();
    $("span").css("display", "inline")

    weatherConditions(citySearch,function(data){
      displayWeatherData(data);
    });

})

