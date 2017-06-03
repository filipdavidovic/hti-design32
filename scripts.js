

var Conversion = {
	FtoC: function (degrees) {
		return ((degrees - 32) * (5/9));
	},
	CtoF: function (degrees){
		return (degrees * (9/5) + 32);
	},
	
	PtoH: function (kpa) {
		return (kpa / 0.133322387415);
	},
	
	HtoP: function (mmhg) {
		return (mmhg * 0.133322387415);
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
  document.getElementById("dyslexicSheet").disabled=true;
  document.getElementById("highContrastSheet").disabled=true;

  buildLinks();
  setCookieDefaults();
  randomizeImportantValues();
  setInterval(randomizeImportantValues, 30000);
	
 $(document).keypress(function(e) {
    if(e.which == 49) {
          callPage("heart-rate.html");
    } else if(e.which == 50) {
        callPage("temperature.html");
    } else if(e.which == 51) {
        callPage("location.html");
    } else if(e.which == 52) {
        callPage("stress.html");
    } else if(e.which == 53) {
        callPage("sleep.html");
    } else if(e.which == 54) {
        callPage("settings.html");
    } else if(e.which == 48) {
        callPage("landing.html");
    }
});
	
  callPage('landing.html');
});

function setCookieDefaults() {
	
	if (Cookies.get('dyslexic')===undefined){
		Cookies.set('dyslexic', 'no');
	}
	if (Cookies.get("contrast")===undefined){
		Cookies.set("contrast", 'no');
	}
	if (Cookies.get("tempUnit")===undefined){
		Cookies.set("tempUnit", "°c");
	}
	if (Cookies.get("bpUnit")===undefined){
		Cookies.set("mmHg");
	}
	if (Cookies.get("wtemp")===undefined){
		Cookies.set("wtemp", "on");
	}
	if (Cookies.get("wbp")===undefined){
		Cookies.set("wbp", "on");
	}
	if (Cookies.get("ws")==undefined){
		Cookies.set("ws", "on");
	}
}

function randomizeImportantValues() {
	console.log("new values");
	
	Cookies.set('hr', getRandom(80, 120));
	Cookies.set('bp', getRandom(60, 140));
	Cookies.set('bt', getRandom(35, 39));
	Cookies.set('at', getRandom(-10, 40));
	Cookies.set('s', getRandom(0,100));
	
	updateUnits();
	updateGraphs();
	buildWarnings();
	buildLinks(); //buildWarnings breaks links, so I have to rebuild them
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
		buildWarnings();
		buildLinks();
		window.scrollTo(0, 0);
	  
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
		  var unit = undefined;
		  var value = Number(containers[i].getAttribute("value"));
		  if (isNaN(value)){
			  unit = value;
			  value = Cookies.get(containers[i].getAttribute("value"));
		  }
		  var max = Number(containers[i].getAttribute("max"));
		  var scale = Number(containers[i].getAttribute("scale"));
		  if (scale <= 0 || scale==NaN){
			  scale=1;
		  }
		  
		  var toDelete=[];
		  for (var j=0; j<containers[i].childNodes.length; j++){
			  if (containers[i].childNodes[j].nodeType==1) {
				  if (containers[i].childNodes[j].getAttribute("temp")=="True") {
					  toDelete.push(containers[i].childNodes[j]);
				  }
				  else {
					if (unit !== undefined) {
					  
					  //special cases: replacing scales when units are switched
					    if (containers[i].childNodes[j].getAttribute("src")=="temp.svg" &&
					      Cookies.get("tempUnit")==="°f") {
							  containers[i].childNodes[j].setAttribute('src', 'temp_f.svg');
							  max=130;
							  value=Conversion.CtoF(value);
						  }
					    else if (containers[i].childNodes[j].getAttribute("src")=="bpres.svg" &&
						  Cookies.get("bpUnit")==="kPa") {
							  containers[i].childNodes[j].setAttribute('src', "bpres_kpa.svg");
							  max=90;
							  value=Conversion.HtoP(value);
						 }
					}
					
					containers[i].childNodes[j].style.left="calc(50% - "+(value * scale * 150 * 600) / (75 * max) +"px)";
				  }
			  }
		  }
		  for (var j=0; j<toDelete.length; j++){
			  containers[i].removeChild(toDelete[j]);
		  }
	  }
	  $('.scaleContainer').append("<img src=\"arrow_down.svg\" temp=\"True\" style=\"position: absolute; height: 25px; left: calc(50% - 25px);\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" temp=\"True\" style=\"position: absolute; height: 100%; left: 0px\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" temp=\"True\" style=\"position: absolute; height: 100%; right: 0px; transform: scaleX(-1);\"></img>");

}

function cookieFunction (name, value) {
	return function () {
		Cookies.set(name, value);
		updateSettingLinks();
		buildWarnings();
	}
}

function updateSettingLinks() {
	document.getElementById("dyslexicSheet").disabled=Cookies.get("dyslexic")==="no"
	document.getElementById("highContrastSheet").disabled=Cookies.get("contrast")=="no"
	
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
		var item=Cookies.get(name);
		
		//special case for unit conversions
		if (name=="bp" && Cookies.get("bpUnit")==="kPa"){
			item=Conversion.HtoP(item);
		}
		if ((name==="bt" || name==="at") && Cookies.get("tempUnit")=="°f"){
			item=Conversion.CtoF(item);
		}
		
		$(values[i]).text(round(item,1));
	}
	
	var units=$('span.unit'); 
	for (var i=0; i<units.length; i++){
		var name=units[i].getAttribute("key");
		var item=Cookies.get(name);
		$(units[i]).text(item);
	}
}

function buildWarnings() {
	$(".notifications a").remove();
	arr=[{strict: "wtemp", value: Cookies.get("bt"), min: 34.7, strictmin: 36, strictmax: 37.3, max: 38, name:"body temperature", unit:"° C",
			link:"temperature.html"},
		{strict: "wbp", value: Cookies.get("bp"), min: 50, strictmin: 70, strictmax: 110, max: 150, name:"blood pressure", unit:"mmHg",
		    link:"heart-rate.html"} ,
		{strict: "ws", value: Cookies.get("s"), min: 0, strictmin: 0, strictmax: 80, max: 90, name:"stress", unit:"%",
		link: "stress.html"}
		]
	for (var i=0; i<arr.length; i++){
		if (Cookies.get(arr[i].strict)==="strict"){
			if (arr[i].value>arr[i].strictmax){
				$(".notifications").append("<a href=\""+arr[i].link+"\">Your "+arr[i].name+" is above "+arr[i].strictmax+arr[i].unit+"</a>");
			}
			else if (arr[i].value<arr[i].strictmin){
				$(".notifications").append("<a href=\""+arr[i].link+"\">Your "+arr[i].name+" is below "+arr[i].strictmin+arr[i].unit+"</a>");
			}
		}
		else if (Cookies.get(arr[i].strict)==="on") {
			if (arr[i].value>arr[i].max){
				$(".notifications").append("<a href=\"t"+arr[i].link+"\">Your "+arr[i].name+" is above "+arr[i].max+arr[i].unit+"</a>");
			}
			else if (arr[i].value<arr[i].min){
				$(".notifications").append("<a href=\""+arr[i].link+"\">Your "+arr[i].name+" is below "+arr[i].min+arr[i].unit+"</a>");
			}
		}
	}
}

function buildLinks() {
	$('a').off('click');
	$('a').on('click', function(e){
		e.preventDefault();
		var pageRef = $(this).attr('href');
		callPage(pageRef);
	});
}