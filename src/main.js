/*
    function displayMap(){
    	console.log("Entering getLocation()");
    	if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
			displayCurrentLocation,
			displayError,
			{ 
				maximumAge: 3000, 
				timeout: 5000, 
				enableHighAccuracy: true 
			});
		}else{
			console.log("Oops, no geolocation support");
		} 
    	console.log("Exiting getLocation()");
    } */
var map;
function displayCurrentLocation() {
	console.log("Entering displayCurrentLocation()");
	createListItem();
	try {
		var currentLocationLatAndLong = new google.maps.LatLng(10.853127,106.626233);
		var mapOptions = {
			zoom : 10,
		    zoomControl: true,
		    zoomControlOptions: {
		        style: google.maps.ZoomControlStyle.SMALL
		      },
		    mapTypeControl: true,
		    mapTypeControlOptions: {
		      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
		    },
			center : currentLocationLatAndLong,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		var mapDiv = document.getElementById("map");
		map = new google.maps.Map(mapDiv, mapOptions);
	} catch (e) {
		console.log("Error occured in ConsultantLocator.displayMap() " + e);
	}
	console.log("Exiting displayCurrentLocation()");
}

function displayError(error) {
	console.log("Entering displayError()");
	var errorType = {
		0 : "Unknown error",
		1 : "Permission denied by user",
		2 : "Position is not available",
		3 : "Request time out"
	};
	var errorMessage = errorType[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + "  " + error.message;
	}
	alert("Error Message " + errorMessage);
	console.log("Exiting displayError()");
}
function addMarker(latLng, title, contentString) {
	console.log("Entering addMarker()");
	var markerOptions = new google.maps.Marker({
		map : map,
		position : latLng,
		title : title,
	    animation: google.maps.Animation.DROP,
		clickable : true
	});
	var marker = new google.maps.Marker(markerOptions);
	var infoWindowOptions = {
		content : contentString,
		position : latLng
	};
	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
	google.maps.event.addListener(marker, "click", function() {
		map.setCenter(marker.getPosition());
		infoWindow.open(map, marker);
	});
	map.setCenter(marker.getPosition());
	console.log("Exiting addMarker()");
}

function getLatLangFromAddress(address) {
	console.log("Entering getLatLangFromAddress()");
	var geocoder = new google.maps.Geocoder();
//	var currentLocationLatAndLong = new google.maps.LatLng(10.822526,106.688945);
//	geocoder.geocode({'latLng': currentLocationLatAndLong}, function(results, status) {
//	    if (status == google.maps.GeocoderStatus.OK) {
//	      if (results[1]) {
//	    	  alert(results[1].formatted_address);
//	      } else {
//	        alert('No results found');
//	      }
//	    } else {
//	      alert('Geocoder failed due to: ' + status);
//	    }
//	  });
	geocoder.geocode({'address' : address}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			var returnedValue = results[0].geometry.location;
			console.log("Address found is " + returnedValue);
//			alert(returnedValue);
			addMarker(returnedValue);
			$.mobile.hidePageLoadingMsg();
		} else {
			$.mobile.hidePageLoadingMsg(); 
			alert("Geocode was not successful for the following reason: "+ status);
		}
	});
	console.log("Exiting getLatLangFromAddress()");
}

function addMarkerForAddress() {
	$.mobile.showPageLoadingMsg("b", "Loading...");
	displayCurrentLocation();
	console.log("Entering addMarkerForAddress()");
	var address = $("#address").val();
	console.log($("#address"));
	var latLangForLocation = getLatLangFromAddress(address);
	console.log("Value returned by getLatLangFromAddress " + latLangForLocation);
	addMarker(latLangForLocation, address, address);
	console.log("Exiting addMarkerForAddress()");
}
//google.maps.event.addDomListener(window, 'load', displayCurrentLocation);
//$('#p1').live('pagecreate', function(e){
//    $("#searchToggle").click(function(e) {
//        alert("hiihihih");
//    });
//});

var turnOn = false;
function test(){
	var searchToggle = $('#searchToggle');
	var defaultSearchBoxHeight = $('#searchBox').height();
	if(searchToggle){
		switch (turnOn) {
		case true:
			searchToggle.find('.ui-btn-text').text('Bật');
				$('#searchBox').show('fast');
//				$('#listView').slideUp('fast',function() {
//					$('#listView').show();
//				  });
//				
				$('#map').height($('#map').height() - defaultSearchBoxHeight); 
				turnOn = false;
			break;
		case false:
			searchToggle.find('.ui-btn-text').text('Tắt');
				$('#searchBox').hide('fast');
//				$('#listView').slideDown('fast',function() {
//					$('#listView').hide();
//				  });
				$('#map').height($('#map').height() + defaultSearchBoxHeight);
			turnOn = true; 
			break;　

		default:
			break;
		}
	}
}

function createListItem(){
	  var html = '';
	  html += '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child">';
	  	html += "Thông tin bưu gửi";
	  html += '</li>';
	    for (var i = 0; i < 10; i++) {
	    	html += '<li onClick="focusMarkerOnMap()" data-theme="c" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="info" data-iconpos="right" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-btn-up-c">';
	    	    html += '<div class="ui-btn-inner ui-li">';
	    	        html += '<div class="ui-btn-text">';
	    	            html += '<div style="margin-left:5%; float:left">';
	    	            	html+= "3:05:00AM"; //TODO: input data here
	    	            html += '</div>';
	    	            	
	    	            html += '<div style="margin-left:4%">';
	    	                html += "~ 5/06/2013"; //TODO: input data here
	    	            html += '</div>';
	    	            
	    	            html += '<a href="#page1" data-transition="slide" class="ui-link-inherit">';
	    	                html += "Nhận hàng tại Cây trâm Gò vấp"; //TODO: input data here
	    	                html +=  '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">';
	    	                	html += "Mới tạo"; //TODO: input data here
	    	                html += '</span>';
	    	            html += '</a>';
	    	        html += '</div>';
	    	        html += '<span class="ui-icon ui-icon-info ui-icon-shadow">&nbsp;</span></div></li>';
	    }
	   document.getElementById("listView").innerHTML = html;
}

function focusMarkerOnMap(){
	var currentLocationLatAndLong = new google.maps.LatLng(10.853127,106.626233);
	addMarker(currentLocationLatAndLong, null, null);
//	alert("hhii");
}


