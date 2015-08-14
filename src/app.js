/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var station;
var dir;
var minutes = 20;
var newarkbnd = 'World Trade Center\nExchange Place\nGrove Street\nJournal Square\nHarrison\nNewark Penn Station';
var wtcbnd = 'Newark Penn Station\nHarrison\nJournal Square\nGrove Street\nExchange Place\nWorld Trade Center';
var helpdsp = 'This app displays information for trains arriving '+minutes+' minutes from the current time. \n\n PebblePATH is not in anyway associated with Port Authority, Port Authority Tran-Hudson, or any subsidiaries. \n\n (C)2015 Doug Levine \n DLevine.us';
/*
  Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
    Pebble.openURL('http://dlevine.us/pathdata/pebbleconfig.html');
});

Pebble.addEventListener("webviewclosed",
  function(e) {
    //Get JSON dictionary
    var configuration = JSON.parse(decodeURIComponent(e.response));
    console.log("Configuration window returned: " + JSON.stringify(configuration));
 
    //Send to Pebble, persist there
    Pebble.sendAppMessage(
      {"KEY_INVERT": configuration.invert},
      function(e) {
        console.log("Sending settings data...");
        minutes = configuration.invert;
      },
      function(e) {
        console.log("Settings feedback failed!");
      }
    );
  }
);
*/
// Make a list of menu items
var direction = [{
        title: 'PebblePath',
        icon: 'images/menu_icon.png',
        subtitle: 'Train Schedule'
      }, {
        title: 'WTC Bound',
        subtitle: 'Nwk, Hrrsn, JSQ, Grove, Exc, WTC'
      }, {
        title: 'Newark Bound',
        subtitle: 'WTC, Exch, Grove, JSQ, Hrrsn, Nwk'
      }, {
        title: 'Help',
        subtitle: ''
      }
                 
];


var stations = [{
        title: 'Newark Penn',
        subtitle: 'Newark, NJ'
      }, {
        title: 'Harrison',
        subtitle: 'Harrison, NJ'
      }, {
        title: 'Journal Square',
        subtitle: 'Jersey City, NJ'
      }, {
        title: 'Grove Street',
        subtitle: 'Jersey City, NJ'
      }, {
        title: 'Exchange Place',
        subtitle: 'Jersey City, NJ'
      }, {
        title: 'World Trade Center',
        subtitle: 'Manhattan, NY'
      }];

var schedulemenu = new UI.Menu({
  sections: [{
    items: direction
  }]
});

var card = new UI.Card({
  title:'Information',
  subtitle:'Fetching...',
  body:''
});

var wtcbound = new UI.Card({
  title:'WTC Bound',
  body: wtcbnd,
  scrollable: true,
  style: 'small'
});

var nwkbound = new UI.Card({
  title:'Newark Bound',
  body: newarkbnd,
  scrollable: true,
  style: 'small'
});

var Help = new UI.Card({
  title:'Help',
  subtitle:'',
  body: helpdsp,
  scrollable: true,
  style: 'small'
});

var stationsmenu = new UI.Menu({
    sections: [{
    items: stations
  }]
});

schedulemenu.show();

// Add a click listener for select button click
schedulemenu.on('select', function(event) {
  dir = direction[event.itemIndex].title;
  if(dir == "PebblePath"){schedulemenu.show();}
  else if(dir == "Help"){Help.show();}
  else{stationsmenu.show();}
});

// Add a click listener for select button click
schedulemenu.on('longSelect', function(event) {
 dir = direction[event.itemIndex].title;
  if(dir == "WTC Bound"){wtcbound.show();}
  else if(dir == "Newark Bound"){nwkbound.show();}
  else if(dir == "Help"){Help.show();}
  else{schedulemenu.show();}
});

// Add a click listener for select button click
stationsmenu.on('select', function(event) {
  station =  stations[event.itemIndex].title;
  card.show();
  stationTime(station, dir, minutes);
 });

function stationTime(station,dir,minutes){
// Construct URL
var cityName = station;
var URL = 'http://dlevine.us/pathdata/pathsched.php?q='+cityName+'&dir='+dir+'&min='+minutes+'&iswatch=true';
var time0;
var time1;
var time2;
// Make the request
  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      // Success!
      
      var title = "Scheduled for:";
      var empty = "";
      time0 = data.time0;
      time1 = data.time1;
      time2 = data.time2;
      if (!!time0) {time0 = data.time0;}
      else{time0='No trains scheduled to arrive in the next '+minutes+' minutes.';}
      if (!!time1) {time1 = data.time1;}
      else{time1='';}
      if (!!time2) {time2 = data.time2;}
      else{time2='';}
  
      // Show to user
      card.title(title);
      card.subtitle(empty);
      card.body(time0+'\n'+time1+'\n'+time2);
    },
    function(error) {
      // Failure!
      var title = 'PebblePATH';
      var empty = '';
      var sub = 'is currently unable to retrieve schedule data.';
      card.title(title);
      card.subtitle(empty);
      card.body(sub);
    }
  );
} 


