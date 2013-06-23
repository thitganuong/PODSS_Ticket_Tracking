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
var marker = new google.maps.Marker();
function displayCurrentLocation() {
	console.log("Entering displayCurrentLocation()");
//	createListItem();
	try {
		var currentLocationLatAndLong = new google.maps.LatLng(10.853127,106.626233);// location at Binh Duong
		var mapOptions = {
			zoom : 12,
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
		$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, "Lỗi kết nối mạng. Không thể load được Google Map", !0);
		setTimeout($.mobile.hidePageLoadingMsg, 1500);
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
	marker.setOptions(markerOptions);
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
			addMarker(returnedValue);
			$.mobile.hidePageLoadingMsg();
			createListItem();
		} else {
			$.mobile.hidePageLoadingMsg(); 
			createItemInfo();
			alert("Geocode was not successful for the following reason: "+ status);
		}
	});
	console.log("Exiting getLatLangFromAddress()");
}

function getListStatus(){
	var model;
		if(checkConnection()){
			if($("#address").val().length == 13 ){
					$.mobile.hidePageLoadingMsg();
					$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, "Đang tra mã bưu gửi. Vui lòng chờ.");
					$.ajax({
						   url:'http://192.168.1.13:999/PODSSService.svc/android/getListTrackingPackage?goodAlias='+ $("#address").val(),
						   success: function(result) {
							   this.model = result;
							   $.mobile.hidePageLoadingMsg();
							   if(result.resultState == "Fail"){
								   $.mobile.hidePageLoadingMsg();
									hideCustomerInfo();
									createItemInfo();
									$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, "Không có thông tin mã bưu kiện. Vui lòng kiểm tra lại.", !0);
									setTimeout($.mobile.hidePageLoadingMsg, 2000);
								} else{
									var searchToggle = $('#searchToggle');
									var defaultSearchBoxHeight = $('#searchBox').height();
									
								   searchToggle.find('.ui-btn-text').text('Tắt');
									$('#searchBox').hide('fast');
									$('#map').height($('#map').height() + defaultSearchBoxHeight);
								turnOn = true; 
									
									
								 //set data for sender information
								 $("#se_name").text("Tên: " + this.model.sender.CustomerName);
								 $("#se_address").text("Địa chỉ: " + this.model.sender.CustomerAddress);
								 $("#se_phone").text("Điện thoại: " + this.model.sender.MobilePhone);
								 $("#se_packagenum").text("Số hiệu bưu gửi: " + $("#address").val());
								 
								 //set data for reciever information
								 $("#re_name").text("Tên: " + this.model.receiver.CustomerName);
								 $("#re_address").text("Địa chỉ: " + this.model.receiver.CustomerAddress);
								 $("#re_phone").text("Điện thoại: " + this.model.receiver.MobilePhone);
								 $("#re_weight").text("Khối lượng bưu kiện: " + this.model.Weight + " kg");
								 createListItem(this.model);
								 showCustomerInfo();
								}
						   },
							error: function(result){
								$.mobile.hidePageLoadingMsg();
								hideCustomerInfo();
								createItemInfo();
								$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, "Lỗi kết nối. Vui lòng kiểm tra lại.", !0);
								setTimeout($.mobile.hidePageLoadingMsg, 2000);
							},
						});
				} else{
					var errorMessage = "";
					if($("#address").val().length == 0){
						errorMessage = "Vui lòng nhập mã bưu kiện!";
					} else if($("#address").val().length < 13){
						errorMessage = "Độ dài mã bưu kiện ngắn hơn 13 kí tự. Vui lòng kiểm tra lại.";
					} else{
						errorMessage = "Độ dài mã bưu kiện dài hơn 13 kí tự. Vui lòng kiểm tra lại.";
					}
					$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, errorMessage, !0);
					setTimeout($.mobile.hidePageLoadingMsg, 3000);
					return;
				}
		} else{
			hideCustomerInfo();
			createItemInfo();
		}
}

function hideCustomerInfo(){
	$('#listViewSender').hide();
	$('#listViewReciever').hide();
}

function showCustomerInfo(){
	$('#listViewSender').show();
	$('#listViewReciever').show();
}

function addMarkerForAddress() {
	checkConnection();
	$.mobile.showPageLoadingMsg("b", "Loading...");
	setTimeout($.mobile.hidePageLoadingMsg, 30000);
	displayCurrentLocation();
	console.log("Entering addMarkerForAddress()");
	var address = $("#address").val();
	console.log($("#address"));
	var latLangForLocation = getLatLangFromAddress(address);
	console.log("Value returned by getLatLangFromAddress " + latLangForLocation);
	addMarker(latLangForLocation, address, address);
	console.log("Exiting addMarkerForAddress()");
}

var turnOn = false;
function toggleSearch(){
	var searchToggle = $('#searchToggle');
	var defaultSearchBoxHeight = $('#searchBox').height();
	if(searchToggle){
		switch (turnOn) {
		case true:
			searchToggle.find('.ui-btn-text').text('Bật');
				$('#searchBox').show('fast');
				$('#map').height($('#map').height() - defaultSearchBoxHeight); 
				turnOn = false;
			break;
		case false:
			searchToggle.find('.ui-btn-text').text('Tắt');
				$('#searchBox').hide('fast');
				$('#map').height($('#map').height() + defaultSearchBoxHeight);
			turnOn = true; 
			break;
		default:
			break;
		}
	}
}

function createListItem(model){
	  var html = '';
	  html += '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child">';
	  	html += "Thông tin bưu gửi";
	  html += '</li>';
	    for (var i = 0; i < model.activity_list.length; i++) {
	    	html += '<li onClick="focusMarkerOnMap(' + model.activity_list[i].PosX + "," + model.activity_list[i].PosY + ')" data-theme="c" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="info" data-iconpos="right" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-btn-up-c">';
	    	    html += '<div class="ui-btn-inner ui-li">';
	    	        html += '<div class="ui-btn-text">';
	    	            html += '<div style="margin-left:5%; float:left">';
	    	            	html+= model.activity_list[i].formatted_date; //TODO: input data here
	    	            html += '</div>';
	    	            html += '<div style="margin-left:4%">';
	    	                html += "."; //TODO: input data here
	    	            html += '</div>';
	    	            html += '<a href="#page1" data-transition="slide" class="ui-link-inherit">';
	    	                html += decodeURIComponent(model.activity_list[i].ActivityAddress); //TODO: input data here
	    	                html +=  '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">';
	    	                	html += model.activity_list[i].StatusN; //TODO: input data here
	    	                html += '</span>';
	    	            html += '</a>';
	    	        html += '</div>';
	    	        html += '<span class="ui-icon ui-icon-info ui-icon-shadow">&nbsp;</span>';
	    	   html += '</div>';
	       html += '</li>';
	    }
	   document.getElementById("listView").innerHTML = html;
}

function createItemInfo(){
	var html = '';
	  html += '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child">';
	  	html += "Thông tin bưu gửi";
	  html += '</li>';
	    	html += '<li data-theme="c" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="info" data-iconpos="right" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-btn-up-c">';
	    	    html += '<div class="ui-btn-inner ui-li">';
	    	        html += '<div class="ui-btn-text">';
	    	            html += '<a href="#page1" data-transition="slide" class="ui-link-inherit">';
	    	                html += "Thông tin bưu gửi chưa có. Vui lòng nhập mã bưu gửi."; //TODO: input data here
	    	            html += '</a>';
	    	        html += '</div>';
	    	        html += '<span class="ui-icon ui-icon-info ui-icon-shadow">&nbsp;</span>';
	    	   html += '</div>';
	       html += '</li>';
	   document.getElementById("listView").innerHTML = html;
}

function focusMarkerOnMap(posX, posY){
	var currentLocationLatAndLong = new google.maps.LatLng(posX,posY);
	displayCurrentLocation();
	addMarker(currentLocationLatAndLong);
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    if(states[networkState] == states[Connection.NONE] ){
    	$.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, "Không có kết nối mạng. Vui lòng kiểm tra lại.", !0);
    	setTimeout($.mobile.hidePageLoadingMsg, 3000); 
    	return false;
    } else{
//    	window.location.reload();
    	return true;
    }
}





