var today = new Date();
console.log("Today: " + today.toLocaleDateString());
//dateStr.toLocaleDateString()

generate_countries_dropdown();

document.getElementById("form_submit").addEventListener("click", function(event){
  event.preventDefault();
  console.log("Button Clicked!");
  var city = document.getElementById("city_input").value;
  var country = document.getElementById("select_country").value;
  console.log("Country: " + country);

  fetch('https://api.openweathermap.org/geo/1.0/direct?q='+city+','+country+'&appid=50935aee1783372b16bb0fdccd4bd624',{
  }).then(function (response){
      return response.json();
  }).then(function(data){
      var lat = data[0].lat;
      var lon = data[0].lon;
      get_current_weather_forecast(lat, lon);
      get_five_day_weather_forecast(lat, lon);
  });
})

function get_current_weather_forecast(lat, lon){
  fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=50935aee1783372b16bb0fdccd4bd624&units=imperial&cnt=40',{
  })
  .then(function(response){
      return response.json();
  })
  .then(function (data) {
      //console.log(data);
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
      console.log(data);
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

function display_five_days_weather(data){
  Object.entries(data).forEach(([key, value]) => {
  });
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
      console.log(data[0].cca2);
      console.log(data[0].name.official);
      Object.entries(data).forEach(([key, value]) => {
          var option = document.createElement("option");
          option.text = value.name.official;
          option.value = value.cca2;
          var select = document.getElementById("select_country");
          select.appendChild(option);
      });
  });
}