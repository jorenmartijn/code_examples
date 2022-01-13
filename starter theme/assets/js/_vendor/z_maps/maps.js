$( document ).ready(function() {
	if ($('.acf-map').length > 0) {
    render_map($('.acf-map'));
	}
});



	function render_map( $el ) {

		// var
		var $markers = $el.find('.marker');

		// vars
		var args = {
			// center		: new google.maps.LatLng(0, 0),
			mapTypeId	: google.maps.MapTypeId.ROADMAP,
			zoom		: 13,
			mapTypeControl: false
		};

		// create map
		var map = new google.maps.Map( $el[0], args);


    map.set('styles', [
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f7f1df"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#d0e3b4"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbd3da"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bde6ab"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffe15f"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efd151"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#cfb2db"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a2daf2"
            }
        ]
    }
]);

		// add a markers reference
		map.markers = [];

		// add markers
		$markers.each(function(){
	    add_marker( $(this), map );
		});
		center_map(map);
    $(window).on("resize load", function() {
      // center map
      center_map(map);
    });
	}


	function add_marker( $marker, map ) {

		// var
		var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

		// create marker
		var icon = {
		 anchor: new google.maps.Point(22, 59),
		 path: "m40.6 11.1c-2-3.3-4.6-6-7.9-7.9-3.3-2-6.9-2.9-10.9-2.9s-7.6 1-10.9 2.9c-3.3 2-6 4.6-7.9 7.9-2 3.3-3 7-3 10.9 0 2.4.3 4.6.9 6.4.6 1.9 1.8 4.1 3.5 6.9 1.2 1.9 3.7 5.6 7.5 11 3.1 4.4 5.6 8 7.6 10.9.5.8 1.3 1.1 2.3 1.1s1.7-.4 2.3-1.1l7.6-10.9c3.8-5.4 6.3-9.1 7.5-11 1.7-2.7 2.9-5 3.5-6.9s.9-4 .9-6.4c-.1-3.9-1.1-7.6-3-10.9zm-12.4 17.3c-1.8 1.8-3.9 2.7-6.4 2.7s-4.6-.9-6.4-2.7-2.7-3.9-2.7-6.4.9-4.6 2.7-6.4 3.9-2.7 6.4-2.7 4.6.9 6.4 2.7 2.7 3.9 2.7 6.4-1 4.6-2.7 6.4z",
		 fillColor: '#05232e',
     fillOpacity: 1,
		 scaledSize: new google.maps.Size(44, 59),
		 size: new google.maps.Size(44, 59)
    }
    
    // create marker
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      draggable: false,
      icon: icon,
    });

		// add to array
		map.markers.push( marker );



		// if marker contains HTML, add it to an infoWindow
		if( $marker.html() )
		{
			// create info window
			var infowindow = new google.maps.InfoWindow({
				content		: $marker.html()
			});

			// show info window when marker is clicked
			google.maps.event.addListener(marker, 'click', function() {

				infowindow.open( map, marker );

			});
		}
	}

	function center_map( map ) {

    // vars
		var bounds = new google.maps.LatLngBounds();

		// loop through all markers and create bounds
		$.each( map.markers, function( i, marker ){
			var latlng = new google.maps.LatLng( marker.position.lat() , marker.position.lng() );
			bounds.extend( latlng );

		});

		// only 1 marker?
		if( map.markers.length > 2 )
		{
			// set center of map
		    map.setCenter( bounds.getCenter() );
		    map.setZoom( 13 );
		}
		else
		{
			// fit to bounds
			map.setCenter( bounds.getCenter() );
			map.setZoom( 13 );
		}

	}
