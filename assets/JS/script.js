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

  var weatherUv = parseFloat(weatherInfo.uvIndex);

  if (weatherUv >= 0 && weatherUv <= 2) {
    uv.css("background-color", "green").css("color", "white");
  } else if (weatherUv >= 3 && weatherUv <= 5) {
      uv.css("background-color", "yellow");
  } else if (weatherUv >= 6 && weatherUv <= 7) {
      uv.css("background-color", "orange");
  } else if (weatherUv >= 8 && weatherUv <= 10) {
      uv.css("background-color", "red").css("color", "white");
  } else {
      uv.css("background-color", "purple").css("color", "white"); 
  };  

  var tempColor = parseFloat(weatherInfo.temperature);

  if (tempColor >= 0 && tempColor <= 39) {
    temp.css("color", "blue").css("-webkit-text-stroke", "blue").css("border-bottom", "solid", "black", "5px");
  } else if (tempColor >= 40 && tempColor <= 59) {
    temp.css("color", "orange").css("-webkit-text-stroke", "orange").css("border-bottom", "solid", "black", "5px");
  } else if (tempColor >= 60 && tempColor <= 79) {
    temp.css("color", "yellow").css("-webkit-text-stroke", "yellow").css("border-bottom", "solid", "black", "5px");
  } else if (tempColor >= 80 && tempColor <= 100) {
    temp.css("color", "red").css("-webkit-text-stroke", "red").css("border-bottom", "solid", "black", "5px");
  } else {
    temp.css("color", "purple").css("-webkit-text-stroke", "purple").css("border-bottom", "solid", "black", "5px");
  }

  futureForecast.children("div").each(function(i) {
    $(".date", this).text(moment.unix(weatherInfo.forecast[i].dt).format("MM/DD/YYYY"));
    $(".date").css("font-weight", "bold").css("border-bottom", "solid", "black", "5px");
    $(".temperature", this).text(weatherInfo.forecast[i].temp.max);
    $(".w-speed", this).text(weatherInfo.forecast[i].wind_speed);
    $(".humidity", this).text(weatherInfo.forecast[i].humidity);

    var futureTempColor = parseFloat(weatherInfo.forecast[i].temp_max);

    if (futureTempColor >= 0 && futureTempColor <= 39) {
      $(".temperature").css("color", "blue").css("-webkit-text-stroke", "blue").css("border-bottom", "solid", "black", "5px");
    } else if (futureTempColor >= 40 && futureTempColor <= 60) {
      $(".temperature").css("color", "orange").css("-webkit-text-stroke", "orange").css("border-bottom", "solid", "black", "5px");
    } else if (futureTempColor >= 61 && futureTempColor <= 80) {
      $(".temperature").css("color", "yellow").css("-webkit-text-stroke", "yellow").css("border-bottom", "solid", "black", "5px");
    } else if (futureTempColor >= 81 && futureTempColor <= 100) {
      $(".temperature").css("color", "red").css("-webkit-text-stroke", "red").css("border-bottom", "solid", "black", "5px");
    } else {
      $(".temperature").css("color", "purple").css("-webkit-text-stroke", "purple").css("border-bottom", "solid", "black", "5px");
    }
  })
};

//Search Button Functionality
searchBtn.on("click", function(event) {
  var citySearch = $("#search-city").val();
  event.preventDefault();

  $("span").show();
  $("span").css("display", "inline");

  var cacheData = localStorage.getItem(citySearch);

  if ((cacheData)) {
    displayWeatherData(JSON.parse(cacheData));
  } else {
    weatherConditions(citySearch,function(data) {
      localStorage.setItem(citySearch, JSON.stringify(data));
      displayWeatherData(data);
    });
  }
});


