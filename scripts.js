$(document).ready(function() {
  $('a').on('click', function(e){
    e.preventDefault();
    var pageRef = $(this).attr('href');
    callPage(pageRef);
  });

  callPage('landing.html');

  if(Cookies.get("visited") === undefined) {
    Cookies.set("visited", true, { expires: 7 });
    Cookies.set("units", {
      "temperatureUnit": "c", // Celsius
      "bloodPressureUnit": "eu", // kPa
      "distanceUnit": "km" // Kilometers
    }, { expires: 7 });
    Cookies.set("dyslexic", false, { expires: 7 });
    Cookies.set("highContrast", false, { expires: 7 });
    Cookies.set("shortcuts", false);

    Cookies.set("landingTiles", {
      "hRate": true,
      "bPressure": true,
      "aTemp": true,
      "bTemp": true,
      "stress": true,
      "sleep": true
    }, { expires: 7 });

    localStorage.setItem("hr", getRandom(50, 190));
    localStorage.setItem("bp", getRandom(120, 180));
    localStorage.setItem("hrBpInterval", 30);

    localStorage.setItem("lastInterval", setInterval(function() {
      localStorage.setItem("hr", getRandom(50, 190));
      localStorage.setItem("bp", getRandom(120, 180));
    }, localStorage.getItem("hrBpInterval") * 60 * 1000));

    localStorage.setItem("aTemp", getRandom(-10, 40));
    localStorage.setItem("bTemp", getRandom(32, 40));
    localStorage.setItem("tempInterval", 30);

    localStorage.setItem("lastTempInterval", setInterval(function() {
      localStorage.setItem("aTemp", getRandom(-10, 40));
      localStorage.setItem("bTemp", getRandom(32, 40));
    }, localStorage.getItem("tempInterval") * 60 * 1000));
  } else {
    if(localStorage.getItem("hrBpInterval") === null) {
      localStorage.setItem("hrBpInterval", 30);
    }

    if(localStorage.getItem("tempInterval") === null) {
      localStorage.setItem("tempInterval", 30);
    }
  }

  $(document).keypress(function(e) {
    if(e.which == 49) {
        if(Cookies.get("shortcuts") === "true") {
          callPage("heart-rate.html");
        }
    } else if(e.which == 50) {
      if(Cookies.get("shortcuts") === "true") {
        callPage("temperature.html");
      }
    } else if(e.which == 51) {
      if(Cookies.get("shortcuts") === "true") {
        callPage("location.html");
      }
    } else if(e.which == 52) {
      if(Cookies.get("shortcuts") === "true") {
        callPage("stress.html");
      }
    } else if(e.which == 53) {
      if(Cookies.get("shortcuts") === "true") {
        callPage("sleep.html");
      }
    } else if(e.which == 54) {
      if(Cookies.get("shortcuts") === "true") {
        callPage("settings.html");
      }
    } else if(e.which == 48) {
      if(Cookies.get("shortcuts") === "true") {
        callPage("landing.html");
      }
    }
  });

  if(Cookies.get("highContrast") === "true") {
    $( "<style id=\"highContrastStyle\">body { background-color: black; } .green { color: #885555; } a { color: #885555; } .topbar { color: black; } .notification { border-left-color: #442a2a; background-color: #885555; color: black; }</style>" ).appendTo( "head" );
  }

  if(Cookies.get("dyslexic") === "true") {
    $( "<style id=\"dyslexicStyle\">p, a, h2 { font-family: 'opendyslexic'; }</style>" ).appendTo( "head" );
  }

  updateHrBp();
  clearInterval(localStorage.getItem("lastInterval"));
  localStorage.setItem("lastInterval", setInterval(function() {
    updateHrBp();
  }, localStorage.getItem("hrBpInterval") * 60 * 1000));

  updateTemp();
  clearInterval(localStorage.getItem("lastTempInterval"));
  localStorage.setItem("lastTempInterval", setInterval(function() {
    updateTemp();
  }, localStorage.getItem("tempInterval") * 60 * 1000));
});

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

var tempConversion = (function() {
  var CtoF = function(degrees) {
    return (degrees * (9/5) + 32);
  };

  var FtoC = function(degrees) {
    return ((degrees - 32) * (5/9));
  };

  return {
    FtoC: FtoC,
    CtoF: CtoF
  };
})();

var bpConversion = (function() {
  var usToEu = function(mmgh) { //mmHg to kPa
    return (mmgh * 0.133322387415);
  };

  var euToUs = function(kpa) { // kPa to mmHg
    return (kpa / 0.133322387415);
  };

  return {
    usToEu: usToEu,
    euToUs: euToUs
  };
})();

var distanceConversion = (function() {
  var kmToMi = function(dist) {
    return (dist / 1.609344);
  };

  var miToKm = function(dist) {
    return (dist * 1.609344);
  };

  return {
    kmToMi: kmToMi,
    miToKm: miToKm
  };
})();

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function callPage(pageRefInput) {
  $.ajax({
    url: pageRefInput,
    type: "GET",
    dataType:"text",
    // success: function(json) {
    //   $("<h1/>").text(json.title).appendTo("body");
    //   $("<div class=\"conetent\">").html(json.html).appendTo("body");
    // }
    success: function(response) {
      $('.innerContent').html(response);

	  var containers=$('.scaleContainer');
	  for (var i=0; i<containers.length; i++) {

		  var value = Number(containers[i].getAttribute("value"));
		  var max = Number(containers[i].getAttribute("max"));
		  var scale = Number(containers[i].getAttribute("scale"));
		  if (scale <= 0 || scale==NaN){
			  scale=1;
		  }
		  console.log(containers[i]+" "+value+" "+max+" "+containers[i].childNodes[1]);
		  //value * scaleContainer height * image width / (image height * scaled image width)
		  containers[i].childNodes[1].style.left="calc(50% - "+(value * scale * 150 * 600) / (75 * max) +"px)";
		  //(u * px * 1) / (1 * u) = px
	  }
	  $('.scaleContainer').prepend("<img src=\"arrow_down.svg\" style=\"position: absolute; height: 25px; left: calc(50% - 25px);\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" style=\"position: absolute; height: 100%; left: 0px\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" style=\"position: absolute; height: 100%; right: 0px; transform: scaleX(-1);\"></img>");

    if(pageRefInput === "settings.html") {
      var temp = Cookies.getJSON("units");

      $("#distanceSettings").val(temp.distanceUnit);
      $("#temperatureSettings").val(temp.temperatureUnit);
      $("#bloodPressureSettings").val(temp.bloodPressureUnit);

      $("#temperatureSettings").change(function() {
        var tempJson = Cookies.getJSON("units");
        Cookies.set("units", {
          "temperatureUnit": $("#temperatureSettings option:selected").val(),
          "bloodPressureUnit": tempJson.bloodPressureUnit,
          "distanceUnit": tempJson.distanceUnit
        });
      });

      $("#distanceSettings").change(function() {
        var tempJson = Cookies.getJSON("units");
        Cookies.set("units", {
          "temperatureUnit": tempJson.temperatureUnit,
          "bloodPressureUnit": tempJson.bloodPressureUnit,
          "distanceUnit": $("#distanceSettings option:selected").val()
        });
      });

      $("#bloodPressureSettings").change(function() {
        var tempJson = Cookies.getJSON("units");
        Cookies.set("units", {
          "temperatureUnit": tempJson.temperatureUnit,
          "bloodPressureUnit": $("#bloodPressureSettings option:selected").val(),
          "distanceUnit": tempJson.distanceUnit
        });
      });

      $("#toggleDyslexic").click(function() {
        if(Cookies.get("dyslexic") === "false") {
          Cookies.set("dyslexic", true);
          $( "<style id=\"dyslexicStyle\">p, a, h2 { font-family: 'opendyslexic'; }</style>" ).appendTo( "head" );
        } else {
          Cookies.set("dyslexic", false);
          $("#dyslexicStyle").remove();
        }
      });

      $("#toggleHighContrast").click(function() {
        if(Cookies.get("highContrast") === "false") {
          Cookies.set("highContrast", true);
          $( "<style id=\"highContrastStyle\">body { background-color: black; } .green { color: #885555; } a { color: #885555; } .topbar { color: black; } .notification { border-left-color: #442a2a; background-color: #885555; color: black; }</style>" ).appendTo( "head" );
        } else {
          Cookies.set("highContrast", false);
          $("#highContrastStyle").remove();
        }
      });

      if(Cookies.get("shortcuts") === "true") {
        $("#shortcutsCheckbox").prop("checked", true);
      } else {
        $("#shortcutsCheckbox").prop("checked", false);
      }
      $("#shortcutsCheckbox").change(function() {
        if($("#shortcutsCheckbox").prop("checked") === false) {
          Cookies.set("shortcuts", false);
        } else {
          Cookies.set("shortcuts", true);
        }
      });
    } else if(pageRefInput === "heart-rate.html") {
      doUpdateHrBp();

      $("#hrBpIntervalOutput").text(localStorage.getItem("hrBpInterval"));

      var tempCookie = Cookies.getJSON("units");

      if(tempCookie.bloodPressureUnit === "eu") {
        $("#bpOutput").text( round(bpConversion.usToEu( localStorage.getItem("bp")), 1) );
        $("#bpUnit").text("kPa");
      } else {
        $("#bpOutput").text(localStorage.getItem("bp"));
        $("#bpUnit").text("mmHg");
      }

      $( "#hrBpSlider" ).slider({
        min: 0.1,
        max: 100,
        orientation: "horizontal",
        step: 1,
        value: localStorage.getItem("hrBpInterval"),
        slide: function( event, ui ) {
                  localStorage.setItem("hrBpInterval", ui.value);
                  $("#hrBpIntervalOutput").text(ui.value);
                  clearInterval(localStorage.getItem("lastInterval"));
                  localStorage.setItem("lastInterval", setInterval(function() {
                    updateHrBp();
                  }, localStorage.getItem("hrBpInterval") * 60 * 1000));
               }
      });

      var landingJSON = Cookies.getJSON("landingTiles");
      if(landingJSON.hRate === true) {
        $("#hRateCheckbox").prop("checked", true);
      } else {
        $("#hRateCheckbox").prop("checked", false);
      }
      $("#hRateCheckbox").change(function() {
        if($("#hRateCheckbox").prop("checked") === false) {
          Cookies.set("landingTiles", {
            "hRate": false,
            "bPressure": landingJSON.bPressure,
            "aTemp": landingJSON.aTemp,
            "bTemp": landingJSON.bTemp,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        } else {
          Cookies.set("landingTiles", {
            "hRate": true,
            "bPressure": landingJSON.bPressure,
            "aTemp": landingJSON.aTemp,
            "bTemp": landingJSON.bTemp,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        }

        console.log(Cookies.getJSON("landingTiles"));
      });

      landingJSON = Cookies.getJSON("landingTiles");
      if(landingJSON.bPressure === true) {
        $("#bPressureCheckbox").prop("checked", true);
      } else {
        $("#bPressureCheckbox").prop("checked", false);
      }
      $("#bPressureCheckbox").change(function() {
        if($("#bPressureCheckbox").prop("checked") === false) {
          Cookies.set("landingTiles", {
            "hRate": landingJSON.hRate,
            "bPressure": false,
            "aTemp": landingJSON.aTemp,
            "bTemp": landingJSON.bTemp,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        } else {
          Cookies.set("landingTiles", {
            "hRate": landingJSON.hRate,
            "bPressure": true,
            "aTemp": landingJSON.aTemp,
            "bTemp": landingJSON.bTemp,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        }
      });
    } else if(pageRefInput === "temperature.html") {
      doUpdateTemp();

      $("#tempIntervalOutput").text(localStorage.getItem("tempInterval"));

      var tempCookie = Cookies.getJSON("units");
      if(tempCookie.temperatureUnit === "f") {
        $("#ambientTempValue").text( round(tempConversion.CtoF( localStorage.getItem("aTemp")), 1) );
        $("#ambientTempUnit").html("&#8457;");

        $("#bodyTempValue").text( round(tempConversion.CtoF( localStorage.getItem("bTemp")), 1) );
        $("#bodyTempUnit").html("&#8457;");
      }

      $( "#tempSlider" ).slider({
        min: 0.1,
        max: 100,
        orientation: "horizontal",
        step: 1,
        value: localStorage.getItem("tempInterval"),
        slide: function( event, ui ) {
                  localStorage.setItem("tempInterval", ui.value);
                  $("#tempIntervalOutput").text(ui.value);
                  clearInterval(localStorage.getItem("lastTempInterval"));
                  localStorage.setItem("lastTempInterval", setInterval(function() {
                    updateTemp();
                  }, localStorage.getItem("tempInterval") * 60 * 1000));
               }
      });

      var landingJSON = Cookies.getJSON("landingTiles");
      if(landingJSON.aTemp === true) {
        $("#aTempCheckbox").prop("checked", true);
      } else {
        $("#aTempCheckbox").prop("checked", false);
      }
      $("#aTempCheckbox").change(function() {
        if($("#aTempCheckbox").prop("checked") === false) {
          Cookies.set("landingTiles", {
            "hRate": landingJSON.hRate,
            "bPressure": landingJSON.bPressure,
            "aTemp": false,
            "bTemp": landingJSON.bTemp,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        } else {
          Cookies.set("landingTiles", {
            "hRate": landingJSON.hRate,
            "bPressure": landingJSON.bPressure,
            "aTemp": true,
            "bTemp": landingJSON.bTemp,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        }
      });

      landingJSON = Cookies.getJSON("landingTiles");
      if(landingJSON.aTemp === true) {
        $("#bTempCheckbox").prop("checked", true);
      } else {
        $("#bTempCheckbox").prop("checked", false);
      }
      $("#bTempCheckbox").change(function() {
        if($("#bTempCheckbox").prop("checked") === false) {
          Cookies.set("landingTiles", {
            "hRate": landingJSON.hRate,
            "bPressure": landingJSON.bPressure,
            "aTemp": landingJSON.bTemp,
            "bTemp": false,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        } else {
          Cookies.set("landingTiles", {
            "hRate": landingJSON.hRate,
            "bPressure": landingJSON.bPressure,
            "aTemp": landingJSON.aTemp,
            "bTemp": true,
            "stress": landingJSON.stress,
            "sleep": landingJSON.sleep
          });
        }
      });
    } else if(pageRefInput === "landing.html") {
      $(".ajaxLink").on('click', function(e){
        e.preventDefault();
        var pageRef = $(this).attr('href');
        callPage(pageRef);
      });

      var landingJSON = Cookies.getJSON("landingTiles");
      if(landingJSON.hRate) {
        $("#hrTile .value").text(localStorage.getItem("hr") + " BPM");
        $("#hrCol").css("display", "inline");
      } else {
        $("#hrCol").css("display", "none");
      }

      var tempJSON = Cookies.getJSON("units");
      if(landingJSON.bPressure) {
        $("#bpTile .value").text(tempJSON.bloodPressureUnit === "eu" ? round(bpConversion.usToEu(localStorage.getItem("bp")), 1) + " kPa" : localStorage.getItem("bp") + " mmHg");
        $("#bpCol").css("display", "inline");
      } else {
        $("#bpCol").css("display", "none");
      }

      if(landingJSON.aTemp) {
        $("#ambientTempTile .value").text(tempJSON.temperatureUnit === "f" ? round(tempConversion.CToF(localStorage.getItem("aTemp")), 1) + " F" : localStorage.getItem("aTemp") + " C"); //  TODO: add celsius and farenheight hex
        $("#aTempCol").css("display", "inline");
      } else {
        $("#aTempCol").css("display", "none");
      }
      if(landingJSON.aTemp) {
        $("#bodyTempTile .value").text(tempJSON.temperatureUnit === "f" ? round(tempConversion.CToF(localStorage.getItem("bTemp")), 1) + " F" : localStorage.getItem("bTemp") + " C"); //  TODO: add celsius and farenheight hex
        $("#bTempCol").css("display", "inline");
      } else {
        $("#bTempCol").css("display", "none");
      }
    }

    },
    error: function( error ) {
      console.log("the page was NOT loaded: ", error);
    },
    complete: function(xhr, status) {
      console.log("the request is complete.");
    }
  });
}

(function () {
  var clockElement = $("#clock");

  function updateClock (clock) {
    var clockElement = $("#clock");
    $(clockElement).text(new Date().toLocaleTimeString());
  }

  setInterval(function () {
      updateClock();
  }, 1000);

}());

var updateHrBp = function() {
  localStorage.setItem("hr", round(getRandom(50, 190), 1));

  localStorage.setItem("bp", round(getRandom(120, 180), 1));

  doUpdateHrBp();
};

var doUpdateHrBp = function() {
  var tempCookie = Cookies.getJSON("units");

  $("#hrOutput").text(localStorage.getItem("hr"));

  if(tempCookie.bloodPressureUnit === "eu") {
    $("#bpOutput").text( round(bpConversion.usToEu(localStorage.getItem("bp")), 1) );
    $("#bpUnit").text("kPa");
  } else {
    $("#bpOutput").text(localStorage.getItem("bp"));
    $("#bpUnit").text("mmHg");
  }
}

var updateTemp = function() {
  localStorage.setItem("aTemp", round(getRandom(-10, 40), 1));

  localStorage.setItem("bTemp", round(getRandom(32, 40), 1));

  doUpdateTemp();
}

var doUpdateTemp = function() {
  var tempCookie = Cookies.getJSON("units");

  if(tempCookie.bloodPressureUnit === "f") {
    $("#ambientTempValue").text( round(tempConversion.CToF(localStorage.getItem("bTemp")), 1) );
    $("#ambientTempUnit").text("F"); // TODO: add farenhight hex
  } else {
    $("#ambientTempValue").text(localStorage.getItem("aTemp"));
    $("#ambientTempUnit").text("C"); // TODO: add celsius hex
  }

  if(tempCookie.bloodPressureUnit === "f") {
    $("#bodyTempValue").text( round(tempConversion.CToF(localStorage.getItem("bTemp")), 1) );
    $("#bodyTempUnit").text("F"); // TODO: add farenhight hex
  } else {
    $("#bodyTempValue").text(localStorage.getItem("bTemp"));
    $("#bodyTempUnit").text("C"); // TODO: add celsius hex
  }
}
