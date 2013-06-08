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

	try {
		var currentLocationLatAndLong = new google.maps.LatLng(10.853127,106.626233);
		var mapOptions = {
			zoom : 10,
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
		} else {
			alert("Geocode was not successful for the following reason: "+ status);
		}
	});
	console.log("Exiting getLatLangFromAddress()");
}

function addMarkerForAddress() {
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
	var defaultMapHeight = $('#map').height();
	var mapExtendedHeight = defaultSearchBoxHeight + defaultMapHeight;
	if(searchToggle){
		switch (turnOn) {
		case true:
			searchToggle.find('.ui-btn-text').text('Bật');
				$('#searchBox').show('fast');
//				$('#map').height($('#page1').height()*0.42); 
//				alert(defaultSearchBoxHeight);
//				alert(defaultMapHeight);
				turnOn = false;
			break;
		case false:
			searchToggle.find('.ui-btn-text').text('Tắt');
				$('#searchBox').hide('fast');
//				alert(defaultSearchBoxHeight);
//				alert(defaultMapHeight);
//				$('#map').height($('#page1').height()/2);
			turnOn = true; 
			break;　

		default:
			break;
		}
	}
}


