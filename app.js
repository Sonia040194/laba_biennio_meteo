/*--------------*/
/*---LOADING----*/
/*--------------*/

$(document).ready(function() {

  var counter = 0;
  var c = 0;
  var i = setInterval(function(){
      $(".loading-page .counter h1").html(c + "%");
      $(".loading-page .counter hr").css("width", c + "%");
      //$(".loading-page .counter").css("background", "linear-gradient(to right, #f60d54 "+ c + "%,#0d0d0d "+ c + "%)");

    /*
    $(".loading-page .counter h1.color").css("width", c + "%");
    */
    counter++;
    c++;

    if(counter == 101) {
        clearInterval(i);
    }
  }, 50);
});




/*----------*/
/*---APP----*/
/*----------*/

var is_debug = false;
var provider = "openweathermap";

$(function(){
  showSection("loading")
  init();
})


function init(){
  //alert("ciao")
  getPosition()
}


function showSection(section){
  $("section").hide()
  $("#"+section).show()
}


function getPosition(){
  debug("find position...")
  if(is_debug){ // if debug use fake location
    getWeather(45.559394399999995, 10.2037211)
  } else {
    navigator.geolocation.getCurrentPosition(function(position) {
      debug(position)
      getWeather(position.coords.latitude,position.coords.longitude)
    });
  }
}


function getWeather(lat, lng) {

  if(is_debug) {
    var data = $.getJSON("./data.json").done(function( data ) {
      //console.log(data)
      renderWeather(data)
    })
    return
  }

  debug("getting weather from "+provider+" of lat:" + lat+", lng: "+lng)
  if(provider=="openweathermap") {
    var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&units=metric&lat="+lat+"&lon="+lng+"&appid=dbbdeadef8050288e718d9ed34cac7df"
    $.getJSON(url)
    .done(function( data ) {
      //console.log(data)
      renderWeather(data)
    })
    .fail(function() {
      console.log( "error" );
    })
    .always(function() {
      console.log( "complete" );
    });
  }
  if(provider=="simpleweather") {
    $.simpleWeather({
      location: lat+","+lng,
      woeid: '',
      unit: 'c',
      success: function(w){
        renderWeather(w)
      },
      error: function(){
        debug("ERROR! receiving meteo")
      }
    })
  }
  if(provider=="darksky") {
    /**/
    var url = "https://api.darksky.net/forecast/00c7658658103952f0566b7c8d854765/"+lat+","+lng
    $.getJSON(url)
    .done(function( data ) {
      console.log(data)
    })
    $.getJSON(url, function(data) {
       console.log(data);
       //$('#weather').html('and the temperature is: ' + data.currently.temperature);
     });
  }
}

function renderWeather(data){
  //console.log(data)
  showSection("weather")
  /* rendershowTemp("temp")*/
  if(data){
    for(var i in data.list) {
      var element = $(".row > .condition")
      element.find(".city .value").text(data.city.name)
      if(i!=0) element = element.clone().appendTo( "#forecast" ); // duplicate condition
      condition = data.list[i]
      var date = new Date(condition.dt*1000);
      day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
      element.find(".icon i").addClass("wi-owm-"+condition.weather[0].id)
      element.find(".date .value").text(day)
      element.find(".temp .min .value").text(condition.temp.min +" °C - ") .unit="Celsius"
      element.find(".temp .max .value").text(condition.temp.max + " °C ")
      element.find(".wind .value").text(condition.speed+"ms")
      element.find(".humidity .value").text(condition.humidity+"%")
      element.find(".clouds .value").text(condition.clouds+"%")
      element.find(".description .value").text(condition.weather[0].description)
      element.find(".morn .value").text(condition.temp.morn + " °C ")
      element.find(".day .value").text(condition.temp.day + " °C ")
      element.find(".eve .value").text(condition.temp.eve + " °C ")
      element.find(".night .value").text(condition.temp.night + " °C ")
    }
    $(".row > .condition").addClass("col-md-12")
    $("#weather #forecast > .condition .icon").addClass("col-md-12 col-md-offset-0")
  } else {
    alert("sorry, no weather info!")
  }
}

/*
function rendershowTemp(temp){
  var date = new Date();
  var hours = date.getHours();
  var moment = "night";
  if(hours >= 7) moment = "morn"
  if(hours >= 12) moment = "day"
  if(hours >= 20) moment = "eve"
  if(hours >= 22) moment = "night"
  var showTemp = element.find(".showTemp .value").text(condition.temp.+"moment")
  console.log(showTemp)
}
*/


/*
  renderhaivogliadi("ico")
  function renderhaivogliadi(ico){
  var sunny = ["wi-day-sunny", "wi-day-sunny-overcast", "wi-hot", "wi-day-light-wind"];
  var cloudy = ["wi-day-cloudy", "wi-day-cloudy-gusts", "wi-day-cloudy-windy", "wi-day-fog", "wi-day-windy", "wi-day-cloudy-high"];
  var rain = ["wi-day-hail", "wi-day-haze", "wi-day-rain", "wi-day-rain-mix", "wi-day-rain-wind", "wi-day-showers", "wi-day-sleet", "wi-day-sprinkle"];
  var thunderstorm = ["wi-day-lightning", "wi-day-sleet-storm", "wi-day-snow-thunderstorm", "wi-day-storm-showers", "wi-day-thunderstorm"];
  var snow = ["wi-day-snow", "wi-day-snow-wind"];
  var eclipse = ["wi-solar-eclipse"];
  if (icon = sunny) icon= "wi-day-sunny"
  if (icon = cloudy) icon= "wi-day-cloudy"
  if (icon = rain) icon= "wi-day-rain"
  if (icon = thunderstorm) icon= "wi-day-thunderstorm"
  if (icon = snow) icon= "wi-day-snow"
  if (icon = eclipse) icon= "wi-solar-eclipse"
  var renderhaivogliadi = element.find("per avere il" +"" +"a" + "" + dovrai aspettare + "" + "giorni").text(condition.ico.+"icon")
  console.log(ico)
}
*/

function debug(obj){
  console.log(obj)
}
