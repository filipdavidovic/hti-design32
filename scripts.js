

var Conversion = {
	FtoC: function (degrees) {
		return (degrees * (9/5) + 32);
	},
	CtoF: function (degrees){
		return ((degrees - 32) * (5/9));
	},
	
	PtoH: function (mmhg) {
		return (kpa / 0.133322387415);
	},
	
	HtoP: function (mmhg) {
		return (mmgh * 0.133322387415);
	}
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

$(document).ready(function() {
  setCookieDefaults();
  $('a').on('click', function(e){
    e.preventDefault();
    var pageRef = $(this).attr('href');
    callPage(pageRef);
  });

  callPage('landing.html');
});

function setCookieDefaults() {
	if (Cookies.get('hr')===undefined){
		Cookies.set('hr', getRandom(80, 120));
	}
	if (Cookies.get('bp')===undefined){
		Cookies.set('bp', getRandom(60, 140));
	}
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
		updateUnits();
		updateGraphs();
		updateSettingLinks();
	  
    },
    error: function( error ) {
      console.log("the page was NOT loaded: ", error);
    },
    complete: function(xhr, status) {
      //console.log("the request is complete.");
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


function updateGraphs() {
	var containers=$('.scaleContainer');
	  for (var i=0; i<containers.length; i++) {

		  var value = Number(containers[i].getAttribute("value"));
		  if (isNaN(value)){
			  value = Cookies.get(containers[i].getAttribute("value"));
		  }
		  var max = Number(containers[i].getAttribute("max"));
		  var scale = Number(containers[i].getAttribute("scale"));
		  if (scale <= 0 || scale==NaN){
			  scale=1;
		  }
		  
		  var toDelete=[];
		  for (var j=0; j<containers[i].childNodes.length; j++){
			  if (containers[i].childNodes[j].nodeType==1 && containers[i].childNodes[j].getAttribute("temp")=="True") {
				  toDelete.push(containers[i].childNodes[j]);
			  }
		  }
		  for (var j=0; j<toDelete.length; j++){
			  containers[i].remove(toDelete[j]);
		  }
		  //value * scaleContainer height * image width / (image height * scaled image width)
		  containers[i].childNodes[1].style.left="calc(50% - "+(value * scale * 150 * 600) / (75 * max) +"px)";
		  //(u * px * 1) / (1 * u) = px
	  }
	  $('.scaleContainer').prepend("<img src=\"arrow_down.svg\" style=\"position: absolute; height: 25px; left: calc(50% - 25px);\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" style=\"position: absolute; height: 100%; left: 0px\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" style=\"position: absolute; height: 100%; right: 0px; transform: scaleX(-1);\"></img>");

}

function cookieFunction (name, value) {
	return function () {
		Cookies.set(name, value);
		updateSettingLinks();
	}
}

function updateSettingLinks() {
	var settings=$('ul.setting');
	for (var i=0; i<settings.length; i++) {
		var cookie=Cookies.get(settings[i].getAttribute("name"));
		for (var j=0; j<settings[i].childNodes.length; j++){
			if (settings[i].childNodes[j].nodeType==1) {
				if (settings[i].childNodes[j].getAttribute("value")==cookie || cookie===undefined && j==settings[i].childNodes.length-1){
					settings[i].childNodes[j].classList.add("active");
					$(settings[i].childNodes[j]).off("click");
						
				}
				else {
					settings[i].childNodes[j].classList.remove("active");
					var name=settings[i].getAttribute("name");
					var value=settings[i].childNodes[j].getAttribute("value");
					var func=cookieFunction(name, value);
					$(settings[i].childNodes[j]).on("click", func);
				}
			
			}
		}
	}
}

function updateUnits() {
	var values=$('span.value');
	for (var i=0; i<values.length; i++){
		var name=values[i].getAttribute("key");
		var item=round(Cookies.get(name),1);
		$(values[i]).text(item);
	}
}