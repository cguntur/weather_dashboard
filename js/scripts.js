  generate_countries_dropdown();

  document.getElementById("form_submit").addEventListener("click", function(event){
    event.preventDefault();
    var city = document.getElementById("city_input").value;
    var country = document.getElementById("select_country").value;
    console.log("Country: " + country);
    
    fetch('api.openweathermap.org/geo/1.0/direct?q='+city+','+country+'&appid=50935aee1783372b16bb0fdccd4bd624',{
    }).then(function (response){
        return response.json();
    }).then(function(data){
        //console.log(data);
        //console.log("Lat: " + data[0].lat);
        //console.log("Long: " + data[0].lon);
        var lat = data[0].lat;
        var lon = data[0].lon;
        return fetch('api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid=50935aee1783372b16bb0fdccd4bd624',{
        })
    }).then(function (response){
        return response.json();
    }).then(function(data){
        console.log(data);
    })
  })

  function get_lat(){

  }

  function get_long(){

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