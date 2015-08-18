/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var station;
var dir;
var minutes;//='20';
var newarkbnd = 'World Trade Center\nExchange Place\nGrove Street\nJournal Square\nHarrison\nNewark Penn Station';
var wtcbnd = 'Newark Penn Station\nHarrison\nJournal Square\nGrove Street\nExchange Place\nWorld Trade Center';
var times = [];
if (localStorage.getItem(1) === null || localStorage.getItem(1) === undefined){
    localStorage.setItem(1, '20');
    minutes= localStorage.getItem(1);
} 
else {minutes = localStorage.getItem(1);}
var helpdsp = 'This app displays information for trains arriving'+
    ' in the time specified in the settings (the default is 20 minutes)'+
    '. \n\n PebblePATH is not in anyway associated with Port Authority,'+
    ' Port Authority Tran-Hudson, or any subsidiaries. \n\n (C)2015 DJ'+
    ' Levine \n DLevine.us';

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
      },{
        title: 'Settings',
        subtitle: 'Trains within '+minutes+' min.'
      },{
        title: 'Help',
        subtitle: ''}];

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

var settingsop= [{
          title: '20',
          subtitle: 'Minutes'
      }, {
        title: '30',
        subtitle: 'Minutes'
      }, {
        title: '60',
        subtitle: 'Minutes'
      }, {
        title: '90',
        subtitle: 'Minutes'
     }];

var schedulemenu = new UI.Menu({
  sections: [{
    items: direction
  }]
});

var settingsmenu = new UI.Menu({
  sections: [{
    items: settingsop
  }]
});

var card = new UI.Card({
  title:'Information',
  subtitle:'Fetching...',
  body:'',
  scrollable: true,
  style: 'small'
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
  if (dir == 'PebblePath'){schedulemenu.show();}
  else if (dir == 'Settings'){settingsmenu.show();}
  else if (dir == 'Help'){Help.show();}
  else {stationsmenu.show();}
});

// Add a click listener for select button click
schedulemenu.on('longSelect', function(event) {
  dir = direction[event.itemIndex].title;
  if (dir == 'WTC Bound'){wtcbound.show();}
  else if (dir == 'Newark Bound'){nwkbound.show();}
  else if (dir == 'Help'){Help.show();}
  else {schedulemenu.show();}
});

// Add a click listener for select button click
stationsmenu.on('select', function(event) {
  station = stations[event.itemIndex].title;
  stationTime(station, dir, minutes);
 });

/*Add a click listener for select button click*/
settingsmenu.on('select', function(event) {
  minutes =  settingsop[event.itemIndex].title;
  localStorage.setItem(1, minutes);
  schedulemenu.item(0, 3, { subtitle: 'Trains within '+minutes+' min.' });
  schedulemenu.show();
  settingsmenu.hide();
 });

function stationTime(station,dir,minutes){
// Construct URL
card.show();
var URL = 'http://dlevine.us/pathdata/pathsched.php?q='+station+'&dir='+dir+'&min='+minutes+'&iswatch=true';
// Make the request
  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      // Success!
      var title = 'Scheduled for:';
      var key;
      times = [];
      var empty = "";    
      for(key in data) {
        if (data.hasOwnProperty(key)){		
            times.push(data[key]);
        }
			}
      times = times.join('\n');
      // Show to user
      card.title(title);
      card.subtitle(empty);
      card.body(times);
    },
    function(error) {
      // Failure!
      var title = 'PebblePATH';
      //var empty = '';
      var sub = 'is currently unable to retrieve schedule data.';
      card.title(title);
      card.subtitle(URL);
      card.body(sub);
    }
  );}