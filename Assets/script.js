$(document).ready(function () {

  // recents opened
  var open = false;

  //api key
  const apikey = "3dbd7567d6829a773ae96978861ebc2a";

  // array local storage
  var lsArray = JSON.parse(localStorage.getItem("Searched Cities"));
  if (!lsArray)
    lsArray = [];
  lsArray.sort();

  rebuildMenu();

  function rebuildMenu() {
    $(".dropdown-menu").empty()
    for (var i = 0; i < lsArray.length; i++) {
      $(".dropdown-menu").append("<li><a class='dropdown-item' href='#'>" + lsArray[i] + "</a></li>")
    }
    $(".dropdown-item").click(function buttonClick(e) {
      $(".form-control").val($(this).text());
      $(".btn").click();
      $(".dropdown-menu").slideUp();
      open = false;
    });
  }

  //button click for search
  $(".btn").click(function buttonClick(e) {
    var citySearched = $(".form-control").val();
    console.log(citySearched);
    if (citySearched)
      getResponse();
    return false;
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

 

  async function getResponse() {
    var citySearched = $(".form-control").val();
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearched + "&APPID=" + apikey;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      $("#allBoxes").hide();
      alert("City not found. Try again");
    }
    else {
      const data = await response.json(); 
      
      // Extracting data as a JSON Object from the response
      if (!data) {
        alert("No results found");
      }
      else {
        console.log(data);

        // City found
        $("#allBoxes").fadeIn();

        // Add to lsArray if not already there and store in local storage
        if (lsArray.indexOf(citySearched) === -1)
          lsArray.push(citySearched);
        lsArray.sort(); // sort it
        localStorage.setItem("Searched Cities", JSON.stringify(lsArray));

        // City name and today's weather
        $("#cityName").text(data.name + " - " + new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }));
        var farenheit = ((data.main.temp - 273.15) * 9 / 5 + 32)
        $("#temp").text("Temp: " + Math.round(farenheit) + "°F");
        $("#wind").text("Wind: " + data.wind.speed + "mph");
        $("#humidity").text("Humidity: " + data.main.humidity + "%");

        // Next 5 days
        var fetchTest = fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + citySearched + "&APPID=" + apikey)
          .then(response => response.json())
          .then(data => {
            for (var i = 0; i < 5; i++) {
              var farenheit2 = ((data.list[i * 8].main.temp - 273.15) * 9 / 5 + 32);
              $("#cityName" + i).text(new Date(data.list[i * 8].dt * 1000).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }));
              $("#temp" + i).text("Temp: " + Math.round(farenheit2) + "°F");
              $("#wind" + i).text("Wind: " + data.list[i * 8].wind.speed + "mph");
              $("#humidity" + i).text("Humidity: " + data.list[i * 8].main.humidity + "%");
            }
            rebuildMenu();
          });
          
      }
    }
  }
});