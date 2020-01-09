var id = null;
var firstTime = -1;
var currentCache = 0;

//Locations
var one = {lat: 43.7736521, lon: -79.5048982, desc: "Lassonde"};
var two = {lat: 43.773003, lon: -79.503557, desc: "Vari Hall"};
var three = {lat: 43.7714247, lon: -79.5005375, desc: "Accolade East"};
var four = {lat: 43.7725488, lon: -79.5064078, desc: "Bergeron"};

var caches = new Array();
  caches[0] = one;
  caches[1] = two;
  caches[2] = three;
  caches[3] = four;

function togglegps() {
    var button = document.getElementById("togglegps");
    if (navigator.geolocation) {
        if (id === null) {
            id = navigator.geolocation.watchPosition(showPosition, handleError, {enableHighAccuracy : true, timeout: 1000});
            button.innerHTML = "STOP GPS";
            firstTime = -1;
            console.log("GPS started...");
        } else {
            navigator.geolocation.clearWatch(id);
            id = null;
            button.innerHTML = "START GPS";
            console.log("GPS stopped...");
        }
    } else {
        alert("NO GPS AVAILABLE");
    }
}
//Error 
function handleError(error) {
  var errorstr = "Really unknown error";
    switch (error.code) {
    case error.PERMISSION_DENIED:
        errorstr = "Permission deined";
        break;
    case error.POSITION_UNAVAILABLE:
        errorstr = "Permission unavailable";
        break;
    case error.TIMEOUT:
        errorstr = "Timeout";
        break;
    case error.UNKNOWN_ERROR:
        error = "Unknown error";
        break;
    }
    alert("GPS error " + error);
}

function showPosition(position) {
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");
    var now = document.getElementById("now");
    var debug = document.getElementById("debug");

    latitude.innerHTML = position.coords.latitude;
    longitude.innerHTML = position.coords.longitude;
    if (firstTime < 0) {
      firstTime = position.timestamp;
    }
    now.innerHTML = position.timestamp - firstTime;

    var u = interpolate(201, 584, -79.508355, -79.501057, position.coords.longitude); 
    var v = interpolate(304, 302, 43.772824, 43.774311, position.coords.latitude); 

    //Map height
    if (v < 0) {
        v = 0;
      } else if (v > 470) {
        v = 470;
      }
    //Map width
    if (u < 0) {
      u = 0;
    } else if (u > 710) {
      u = 710;
    }

    debug.innerHTML = "(" + u + ", " + v + ")";
    var me = document.getElementById("me");
    me.style.left = u - (me.offsetWidth / 2);
    me.style.top = v - (me.offsetHeight / 2);
}

function interpolate(u1, u2, gps1, gps2, gps) {
  var result = u1 + (u2 - u1) * (gps - gps1) / (gps2 - gps1);
  return result;
}

//Updates to the next Geolocation
function updateCache() {
  if (currentCache > caches.length) {
     currentCache = 0;
  }
  currentCache++;
  showCache();
}

function showCache() {
  var target_loc = document.getElementById("target");
  var x = interpolate(209, 513, -79.5064078, -79.5005405, caches[currentCache].lon); 
  var y = interpolate(295, 183, 43.7725488, 43.7757161, caches[currentCache].lat); 
  target.style.left = x - (target_loc.offsetWidth / 2);
  target.style.top = y - (target_loc.offsetHeight / 2);

  var description = document.getElementById("tarloc");
  description.innerHTML = "Geocache location: " + caches[currentCache].desc;

}
