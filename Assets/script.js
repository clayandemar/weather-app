
$(document).ready(function () {

  // recents opened
  var open = false;

  //api key
  const apikey = "3dbd7567d6829a773ae96978861ebc2a";

  // array local storage
  var lsArray = JSON.parse(localStorage.getItem("Searched Cities"));
  if (lsArray === null)
    lsArray = [];

    rebuildMenu();


  function rebuildMenu(){
  $(".dropdown-menu").empty()
    for (var i = 0; i < lsArray.length; i++) {
      $(".dropdown-menu").append("<li><a class='dropdown-item' href='#'>" + lsArray[i] + "</a></li>")
    }
  }

  // recents click on name of city function
  $(".dropdown-item").click(function buttonClick(e) {
    $(".form-control").val($(this).text());
    $(".btn").click();
    $(".dropdown-menu").slideUp();
    open = false;
    console.log($(this).text())
    
  });

  //button click for search
  $(".btn").click(function buttonClick(e) {
    var citySearched = $(".form-control").val();
    $("#allBoxes").fadeIn();
    


    //  const apiCity = fetch("https://api.openweathermap.org/data/2.5/weather?q=" + citySearched + "&APPID=3dbd7567d6829a773ae96978861ebc2a");
    var fetchTest = fetch("https://api.openweathermap.org/data/2.5/weather?q=" + citySearched + "&APPID=" + apikey)

      // .then
      .then(response => response.json())
      .then(data => {

        //JSON stringify set item
        if (lsArray.indexOf(citySearched) === -1)
          lsArray.push(citySearched);
        localStorage.setItem("Searched Cities", JSON.stringify(lsArray));
        console.log(lsArray);
      

        //todays weather
        var farenheit = ((data.main.temp - 273.15) * 9 / 5 + 32)

        $("#cityName").text(data.name + " - " + new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }));
        $("#temp").text("Temp: " + Math.round(farenheit) + "°F");
        $("#wind").text("Wind: " + data.wind.speed + "mph");
        $("#humidity").text("Humidity: " + data.main.humidity + "%");
        // next days
        fetchTest = fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + citySearched + "&APPID=" + apikey)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            for (var i = 0; i < 5; i++) {
              var farenheit2 = ((data.list[i * 8].main.temp - 273.15) * 9 / 5 + 32);
              $("#cityName" + i).text(new Date(data.list[i * 8].dt * 1000).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }));
              $("#temp" + i).text("Temp: " + Math.round(farenheit2) + "°F");
              $("#wind" + i).text("Wind: " + data.list[i * 8].wind.speed + "mph");
              $("#humidity" + i).text("Humidity: " + data.list[i * 8].main.humidity + "%");
            }
        
          });
      });
  });
  // recents dropdown
  $(".nav-link").click(function buttonClick(e) {
    if (open === false) {
      $(".dropdown-menu").slideDown();
      open = true;
    } else {
      $(".dropdown-menu").slideUp();
      open = false;
    }

  });

});