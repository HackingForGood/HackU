iconBase = '/images/'
var icons = {
  0: {
    name: 'Trash',
    icon: iconBase + 'trash.png'
  },
  1: {
    name: 'Compost',
    icon: iconBase + 'Compost.png'
  },
  2: {
    name: 'Recycle',
    icon: iconBase + 'Recycle.png'
  }
};

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [{"color": "#f5f5f5"}]
      },{
        "elementType": "labels.icon",
        "stylers": [{"lightness": 50},
          {"visibility": "simplified"}]
      },{
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#3a3a3a"}]
      },{
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#f5f5f5"}]
      },{
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#bdbdbd"}]
      },{
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{"color": "#eeeeee"}]
      },{
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#757575"}]
      },{
        "featureType": "poi.business",
        "stylers": [{"visibility": "off"}]
      },{
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"color": "#b4e1ad"}]
      },{
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [{"visibility": "off"}]
      },{
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#9e9e9e"}]
      },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{"color": "#ffffff"}]
      },{
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#757575"}]
      },{
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{"color": "#dadada"}]
      },{
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffffff"}]
      },{
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#dadada"}]
      },{
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#616161"}]
      },{
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#9e9e9e"}]
      },{
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{"color": "#e5e5e5"}]
      },{
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{"color": "#eeeeee"}]
      },{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#96c3d6"}]
      },{
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#9e9e9e"}]
      }
    ]
  });
  infoWindow = new google.maps.InfoWindow;

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
		  lat: position.coords.latitude,
		  lng: position.coords.longitude
		};
		var marker = new google.maps.Marker({
		position: pos,
		map: map,
		title: 'You are here.'
		});
		/*infoWindow.setPosition(pos);
		infoWindow.setContent('You are here.');
		infoWindow.open(map);*/
		map.setCenter(pos);
		map.setZoom(16);
	  }, function() {
		handleLocationError(true, infoWindow, map.getCenter());
	  });
	} else {
	  // Browser doesn't support Geolocation
	  handleLocationError(false, infoWindow, map.getCenter());
	}
  var iconBase = '/images/';



  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker']
    },
    markerOptions: {icon: iconBase + 'trash.png'},
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(marker) {
    var lat = marker.overlay.getPosition().lat();
    var lng = marker.overlay.getPosition().lng()
    console.log(lat);
    console.log(lng);
    window.friendlyChat.saveTrash(lat, lng, [1,2,3]);
  });
  window.map = map;
}
  

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
						  'Error: The Geolocation service failed.' :
						  'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
  }
