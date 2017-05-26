var is_debug = true;
var provider = "local";


// APP ========================================
$(function(){
  showSection("loading")
  init();
})


function init(){
  getPosition()
}


function showSection(section){
  $("section").hide()
  $("#"+section).show()
}




function getPosition(){
  debug("finding position...")
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
  debug("getting weather from "+provider+" of lat:" + lat+", lng: "+lng)

  if(provider=="local") {
    var data = $.getJSON("./data.json").done(function( data ) {
      debug(data)
      renderWeather(data)
    })
  }

  if(provider=="openweathermap") {
    var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&units=metric&lat="+lat+"&lon="+lng+"&appid=dbbdeadef8050288e718d9ed34cac7df"
    $.getJSON(url)
    .done(function( data ) {
      //debug(data)
      renderWeather(data)
    })
    .fail(function() {
      debug( "error" );
    })
    .always(function() {
      debug( "complete" );
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
      debug(data)
    })
    $.getJSON(url, function(data) {
       debug(data);
       //$('#weather').html('and the temperature is: ' + data.currently.temperature);
     });
  }
}


function renderWeather(data){
  //debug(data)
  showSection("weather")
  /* rendershowTemp("temp")*/
  if(data){
    for(var i in data.list) {
      var element = $(".row .condition")
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
    $(".row .condition").addClass("col-md-12")
    $("#weather #forecast  .condition .icon").addClass("col-md-12 col-md-offset-0")
  } else {
    alert("sorry, no weather info!")
  }
}


function debug(obj){
  console.log(obj)
}
