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
      "distanceUnit": "km" // KiloMeters
    }, { expires: 7 });
    Cookies.set("dyslexic", false, { expires: 7 });
    Cookies.set("highContrast", false, { expires: 7 });
    Cookies.set("shortcuts", false);
    console.log("registered cookie");
  } else {
    console.log("we have a cookie");
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
    $( "<style id=\"highContrastStyle\">body { background-color: black; } a { color: #885555; } .topbar { color: black; } .notification { border-left-color: #442a2a; background-color: #885555; color: black; }</style>" ).appendTo( "head" );
  }

  if(Cookies.get("dyslexic") === "true") {
    $( "<style id=\"dyslexicStyle\">p, a, h2 { font-family: 'opendyslexic'; }</style>" ).appendTo( "head" );
  }
});

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
      //console.log("page loaded successfully: ", response);
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
          $( "<style id=\"highContrastStyle\">body { background-color: black; } a { color: #885555; } .topbar { color: black; } .notification { border-left-color: #442a2a; background-color: #885555; color: black; }</style>" ).appendTo( "head" );
        } else {
          Cookies.set("highContrast", false);
          $("#highContrastStyle").remove();
        }
      });

      if(Cookies.get("shortcuts") === "true") {
        $("#shortcutsCheckbox").prop("checked", "true");
      } else {
        $("#shortcutsCheckbox").prop("checked", "false");
      }
      $("#shortcutsCheckbox").change(function() {
        if($("#shortcutsCheckbox").prop("checked") === false) {
          Cookies.set("shortcuts", false);
        } else {
          Cookies.set("shortcuts", true);
        }
      });
    } else if(pageRefInput === "heart-rate.html") {
      var tempCookie = Cookies.getJSON("units");
      if($("#bpUnit").text() === "mmHg") {
        if(tempCookie.bloodPressureUnit === "eu") {
          $("#bpValue").text( round(bpConversion.usToEu( $("#bpValue").text()), 1) );
          $("#bpUnit").text("kPa");
        }
      }
    } else if(pageRefInput === "temperature.html") {
      var tempCookie = Cookies.getJSON("units");
      if(tempCookie.temperatureUnit === "f") {
        $("#ambientTempValue").text( round(tempConversion.CtoF( $("#ambientTempValue").text()), 1) );
        $("#ambientTempUnit").html("&#8457;");

        $("#bodyTempValue").text( round(tempConversion.CtoF( $("#bodyTempValue").text()), 1) );
        $("#bodyTempUnit").html("&#8457;");
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
