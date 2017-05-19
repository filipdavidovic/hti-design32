$(document).ready(function() {
  $('a').on('click', function(e){
    e.preventDefault();
    var pageRef = $(this).attr('href');
    callPage(pageRef);
  });
});

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
		  console.log(containers[i]+" "+value+" "+max+" "+containers[i].childNodes[1]);
		  //value * scaleContainer height * image width / (image height * scaled image width)
		  containers[i].childNodes[1].style.left="calc(50% - "+(value * 150 * 600) / (75 * max) +"px)";
		  //(u * px * 1) / (1 * u) = px
	  }
	  $('.scaleContainer').prepend("<img src=\"arrow_down.svg\" style=\"position: absolute; height: 25px; left: calc(50% - 25px);\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" style=\"position: absolute; height: 100%; left: 0px\"></img>");
	  $('.scaleContainer').append("<img src=\"whiteGradient.svg\" style=\"position: absolute; height: 100%; right: 0px; transform: scaleX(-1);\"></img>");
	
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
