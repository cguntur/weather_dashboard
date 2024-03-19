var today = new Date();
var five_days_data = [];
var weatherHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
var city = "";

generate_countries_dropdown();
display_past_searched_places();
display_weather_for_past_places();

document.getElementById("form_submit").addEventListener("click", function(event){
  event.preventDefault();
  console.log("Button Clicked!");
  city = document.getElementById("city_input").value;
  var country = document.getElementById("select_country").value;
  fetch('https://api.openweathermap.org/geo/1.0/direct?q='+city+','+country+'&appid=50935aee1783372b16bb0fdccd4bd624',{
  }).then(function (response){
      return response.json();
  }).then(function(data){
    console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      console.log("City: " + city);
      get_current_weather_forecast(lat, lon);
      get_five_day_weather_forecast(lat, lon);
      create_past_search_list(city, country, lat,lon);
      
      var obj = weatherHistory.find(function(entry) { 
        console.log(entry);
        return entry.city === city; 
      });
      if (obj) {
        console.log("City already exists.");
        //obj.value = task;
      } else {
        weatherHistory.push({city: city, country: country, lat: lat, lon: lon});
      }

      localStorage.setItem("weatherHistory", JSON.stringify(weatherHistory));
  });
})

function get_current_weather_forecast(lat, lon){
  fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=50935aee1783372b16bb0fdccd4bd624&units=imperial&cnt=40',{
  })
  .then(function(response){
      return response.json();
  })
  .then(function (data) {
      display_current_weather_data(data);
  });
}

function get_five_day_weather_forecast(lat, lon){
  fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=imperial&cnt=40&appid=50935aee1783372b16bb0fdccd4bd624',{
  })
  .then(function(response){
      return response.json();
  })
  .then(function (data) {
      display_five_days_weather(data);
  });
}

function display_current_weather_data(data){
  Object.entries(data).forEach(([key, value]) => {
      if(key == "name"){
          var city_name = data.name;
          var current_temp = data.main.temp;
          var current_humidity = data.main.humidity;
          var current_wind = data.wind.speed;
          document.getElementById("city_name").textContent = city_name;
          document.querySelector(".temp").textContent = current_temp;
          document.querySelector(".humidity").textContent = current_humidity + "%";
          document.querySelector(".wind").textContent = current_wind + " mph";
      }
  });
}

function get_five_days_weather_details(data){
  Object.entries(data).forEach(([key, value]) => {
      var list = data.list;
      //console.log(list);
      
      Object.entries(list).forEach(([key, value]) => {
          var date = value.dt_txt;
          date = date.toString("YYYY-MM-DD");
          date = new Date(date).toLocaleDateString();

          for (i=0; i < list.length; i++) {
              if ((!list[i].hasOwnProperty(date))) {
                  five_days_data[date] = value;
              } 
          }
      })
  });
  return five_days_data;
}

function display_five_days_weather(data){
  var five_day_data = get_five_days_weather_details(data);
  Object.entries(five_day_data).forEach(([key, value]) => {
      var date = key;
      var max_temp = value.main.temp_max;
      var min_temp = value.main.temp_min;
      var humidity = value.main.humidity;
      var wind_speed = value.wind.speed;

      create_weather_card(date, max_temp, min_temp, humidity, wind_speed);
  });
  
}

function create_weather_card(date, max_temp, min_temp, humidity, wind_speed){
  var cardsEl = document.getElementById("five_day_weather");

  var cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  var cardSection = document.createElement("div");
  cardDiv.append(cardSection);
  cardSection.classList.add("card-section");
  
  var cardTitle = document.createElement("h4");
  cardSection.append(cardTitle);
  cardTitle.textContent = date;

  var tempIcon = document.createElement("img");
  tempIcon.classList.add("icon");

  var tempEl = document.createElement("p");
  tempEl.classList.add("temp");
  tempEl.textContent = max_temp;

  var windEl = document.createElement("p");
  windEl.classList.add("wind");
  windEl.textContent = wind_speed + "mph";

  var humidityEl = document.createElement("p");
  humidityEl.classList.add("humidity");
  humidityEl.textContent = humidity + "%";

  cardSection.append(tempIcon);
  cardSection.append(tempEl);
  cardSection.append(windEl);
  cardSection.append(humidityEl);

  cardsEl.append(cardDiv);
}

function generate_countries_dropdown(){
  fetch('https://restcountries.com/v3.1/all',{
      method: 'GET', //GET is the default.
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      RequestCache: 'redirect'
  })
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      Object.entries(data).forEach(([key, value]) => {
          var option = document.createElement("option");
          option.text = value.name.official;
          option.value = value.cca2;
          var select = document.getElementById("select_country");
          select.appendChild(option);
      });
  });
}

function display_past_searched_places(){
    Object.entries(weatherHistory).forEach(([key, cityData]) => {
        var city = cityData.city;
        var country = cityData.country;
        var lat = cityData.lat;
        var lon = cityData.lon;
        create_past_search_list(city, country, lat,lon);
    });
}

function create_past_search_list(city, country, lat,lon){
    var cityNamesEl = document.getElementById("city_names");
    var cityEl = document.createElement("li");
    cityEl.classList.add("past_city");
    cityEl.setAttribute("data-country", country);
    cityEl.setAttribute("data-lat", lat);
    cityEl.setAttribute("data-lon", lon);
    cityEl.textContent = city;
    cityNamesEl.append(cityEl);
}

function display_weather_for_past_places(){
    var cityElements = document.querySelectorAll(".past_city");
    for (let i = 0; i < cityElements.length; i++) {
        cityElements[i].addEventListener("click", function() {
            var lat = cityElements[i].dataset.lat;
            var lon = cityElements[i].dataset.lon;
            get_current_weather_forecast(lat, lon);
            get_five_day_weather_forecast(lat, lon);  
        });
    }
}