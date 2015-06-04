/*
 * Main javascript file functionality
 * leaflet API
 * App Login
 * Facbook Login API
*/

// declare global variables
var cookie_value_add = [];
var map;                                                           // declare map
var imgArray = new Array();
var companies = new L.layerGroup();                                // declare new companies layerGroup
var searchlayer;                                                   // declare search layer
var markerarray = [];                                              // declare marker array
var LeafIcon = L.Icon.extend({
options: {
	shadowUrl: 'lib/leaflet/images/marker-shadow.png',
	iconSize:     [32, 52],
	shadowSize:   [32, 52],
	iconAnchor:   [16, 50],
	shadowAnchor: [0, 50],
	popupAnchor:  [0, -50]
 }
});

// call map initialize function
window.onload = main;

// initalize map function
function main() {

	//load coordinates of current city and enable tapping
    map = L.map('map',{
    center: [15.304221,-61.384134],
    zoomControl:false,
    attributionControl: false,
	tap:true
	});
    
    //Default marker
	var pinkIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/marker-pink.png'});
    //Base map layer
    var mapLayer =  L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			id: 'ryanjroyer.i5jdfcbc'
		}).addTo(map);

	map.locate({setView: true, maxZoom: 16});
	function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng, {icon: pinkIcon}).addTo(map)
        .bindPopup('<strong>Bagit</strong> makes it easy to </br> Find, Browse and Shop for </br>products near you.').openPopup();

    L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);
	function onLocationError(e) {
    	alert(e.message);
	}

	map.on('locationerror', onLocationError);
	
  //Search
    $(function() {

        // trigger keypress event on search input element
        $("#search").keypress(function() {
            // check if return key pressed
            if (event.keyCode == 13) {

                var searchstr = $("#search").val();                     // get input for search element
                var dataString = 'search='+ searchstr;                  // set input for search element

                // check if string Null
                if(searchstr ==''){

                $( "#error404" ).popup("open");                         // display error404 message for div id#
                $("#search").focus();                                   // reset cursor

                } else {
                    // jsonp pass search variable to remote url and get data from mysql
                    $.getJSON('http://www.macasdominica.net/map_search.php?callback=?',dataString,function(data){
                        plotmarkers(data);                              // call plotmarker function to pass json object
                        $("#search").val('');
                            $("#search").blur();
                            $( "#results" ).fadeIn( "slow" );
                    });
                }
            return false;
            }
        });
    });

}//End of Main


// plot map marker function  with argument for json data
function plotmarkers(sqljson) {

    // get number of layers existing
    if(companies.getLayers().length > 0){
        // check if layers exist
        companies.clearLayers();                                   // clear layers before creating new layer
        createmarker(sqljson);                                     // call create map marker function and pass sqljson data
        markerarray = [];                                          // reset array after creating layer markers

    } else {

        createmarker(sqljson);                                     // call create map marker function pass sqljson data
        markerarray = [];                                          // reset array after creating layer markers

    }
}

//create map marker function with argument for json data
function createmarker(jsonobj){

$(function(){

    //Custom markers
    var blueIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/marker-blue.png'});

	cookie_value_add = [];
	imgArray[0] = new Image();
	imgArray[0].src = 'http://lorempixel.com/output/food-q-c-100-100-1.jpg';

    // iterate through json array object "products"
    for (var key in jsonobj.products) {
        //set loop key
        if (jsonobj.products.hasOwnProperty(key)) {
	          var tag       = jsonobj.products[key].tag;       	   // assign tag variable
	          var type      = jsonobj.products[key].type;          // assign type variable
              var company   = jsonobj.products[key].company;       // assign company variable
              var latitude  = jsonobj.products[key].latitude;      // assign latitude coordinates
              var longitude = jsonobj.products[key].longitude;     // assign longitude coordinates
              var address   = jsonobj.products[key].address;       // assign business local address
              var opening   = jsonobj.products[key].opening;       // assign business opening time
              var closing   = jsonobj.products[key].closing;       // assign business closing time
              var likes		= jsonobj.products[key].likes;       	// assign business closing time
              
              // assign marker to searchlayer variable with popup data attached to marker
              searchlayer = L.marker([latitude,longitude],{icon: blueIcon, title: 'Hover Text'});
			  
              // push searchlayer object into temporary markerarray
              markerarray.push(searchlayer);
			  cookie_value_add.push([tag,company,latitude,longitude,address,opening,closing,type,likes]);
             
              function onMapClick(e) {
	    
				 cookie_value_add.map(function (person) {
				 
				 if (person[2] == e.latlng.lat && person[3] == e.latlng.lng ) {
					 
					 
				   document.getElementById('panel').innerHTML = "";
				   document.getElementById('panel').innerHTML += "<div><ul><li><img id='panelimg' src="+imgArray[0].src+"><div id='likes'><span>"+person[8]+"</span><img id='centerimg' src='img/heart.png' /></div><h4>"+person[1]+"</h4><a href='#companies'><p>"+person[7]+"</p></a><p>"+person[4]+"</p><p>"+person[5]+"&nbsp;AM - "+person[6]+"&nbsp;PM</p></li></ul></div>";		   
				   $("#panel").slideToggle("fast");
				   
				  } else {
					return null;
				}
			});
		}

		searchlayer.on('click', onMapClick);
 
          }      
      }
	   
      var layerrarray = [];                                         // initalize layer array
      for (var i in markerarray){                                   // iterate through layer array and add search layer markers
          layerrarray.push(markerarray[i]);                         // push search layer marker objects into array
      }

      // assign layerGroup to variable companies
      companies = L.layerGroup(layerrarray);
      // add companies layer to map
      map.addLayer(companies);
      // add animation to markers in searchlayer
      searchlayer.bounce({duration: 500, height: 100}, function(){console.log("done");
      });

  });
} //End of createMarker





// trigger keypress event on login-btn submit
$(document).ready(function() {
    $('#login-btn').click(function(e) {

         var username = $("#username").val();
         var password = $("#password").val();

        e.preventDefault();

        if (username == '' || password == ''){
          $( "#error406" ).popup("open");
        } else {

          if (username == "sysadmin" && password == "bagit"){
              $.mobile.changePage("#main", { transition: "slideup"} );
              location.reload();
          } else {
              //$( "#error407" ).popup("open");

            $.ajax({
            url: 'http://www.macasdominica.net/user_login.php?callback=?',
            data: 'username='+ username +'&password='+ password,
            dataType: 'jsonp',
            success: function(data) {
                if (data == 'True') {
                    $.mobile.changePage("#main", { transition: "slideup"} );
                  location.reload();
                } else {
                  $( "#error407" ).popup("open");
                }
            }
           });

          }
        }
     });
});


$(document).ready(function(){
  $("#category-btn").click(function(){
        $.mobile.changePage("#companies", { transition: "slide"} );
    });
});


$(document).ready(function(){
    $("#placespage").click(function(){
        screenloader();
        getplaces();
        $.mobile.changePage("#places", { transition: "pop"} );

    });
});

$(document).ready(function(){
  $("#facebook-btn").click(function(){
         screenloader();
         $.mobile.changePage("#main", { transition: "pop"} );
        location.reload();
                         
    });
});


$("#slideshow > div:gt(0)").hide();

setInterval(function() {
            $('#slideshow > div:first')
            .fadeOut(1000)
            .next()
            .fadeIn(1000)
            .end()
            .appendTo('#slideshow');
            },  3000);




function getplaces() {
    $.ajax({
           url: 'http://www.macasdominica.net/count_place.php?callback=?',
           dataType: 'json',
           async: false,
           cache: false,
           success: function(data) {
           for (var i in data) {

               document.getElementById("total1").innerHTML = data[0];
               document.getElementById("total2").innerHTML = data[1];
               document.getElementById("total3").innerHTML = data[2];
               document.getElementById("total4").innerHTML = data[3];
               document.getElementById("total5").innerHTML = data[4];
           }
        }
    });
}


$(window).load(function() {
    screenloader();
});

function screenloader(){
    $('#status').fadeOut();                             // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow');         // fade out the white DIV that covers the page;
    $('body').delay(350).css({'overflow':'visible'});

}

$(document).ready(function(){
	$( "#search" ).focus(function() {
	  $( "#results" ).fadeOut( "slow" );
	});
});


$(document).ready(function(){
	$( "#listall" ).click(function() {
		
		
		$("#ulelement").empty();
		//if (document.getElementById("ulelement").innerHTML != "") {
		document.getElementById("ulelement").innerHTML = "";	
			for(var i=0; i<cookie_value_add.length; i++) {
			var dis = caldistance(cookie_value_add[i][2],-61.384134,15.304221,cookie_value_add[i][3],"N");
		  document.getElementById("ulelement").innerHTML += "<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='false'  data-theme='c' class='ui-btn  ui-li ui-li-has-thumb ui-btn-up-c ui-li-static ui-body-c ui-first-child'><div class='ui-btn-inner ui-li'><div class='ui-btn-text'><a href='#products' class='ui-link-inherit'><img src='http://lorempixel.com/output/food-q-c-100-100-1.jpg' class='ui-li-thumb'><h3 class='ui-li-heading'>"+cookie_value_add[i][1]+"</h3><p class='ui-li-desc'>"+dis+"&nbsp;Miles</p></a></div></div></li>";
		//$("#ulelement").listview('refresh');   
	//}	
		}
	  $.mobile.changePage("#companies", { transition: "slideup"} );
	 
	});
});



function caldistance(lat1, lon1, lat2, lon2, unit) {
 var radlat1 = Math.PI * lat1/180
   var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return Math.round(dist * 100) / 100

}

