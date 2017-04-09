/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var feature = require('platform/feature');
var station;
var dir;
var minutes;//='20';
var varHlColor = feature.color('#0055AA', 'black');
var times = [];
if (localStorage.getItem(1) === null || localStorage.getItem(1) === undefined){
    localStorage.setItem(1, '20');
    minutes = localStorage.getItem(1);
} 
else {minutes = localStorage.getItem(1);}
var helpdsp = 'This app displays information for trains arriving'+
    ' in the time specified in the settings (the default is 20 minutes)'+
    '. \n\n PebblePATH is not in anyway associated with Port Authority,'+
    ' Port Authority Tran-Hudson, or any subsidiaries. \n\n (C)2015 DJ'+
    ' Levine \n DLevine.us';

// Make a list of menu items
var direction = [{
        title: 'Line Summary',
        icon: 'images/PATHicon.png',
        subtitle: 'Choose for details',
        value: 'PebblePath'
      }, {
        title: 'Newark - WTC',
        lineColor: feature.color('#FF0000', 'white'),
        subtitle: 'Newark Penn\nHarrison\nJournal Square\nGrove Street\nExchange Place\nWorld Trade Center', 
        value: 'World Trade Center'
      },{
        title: 'Hoboken - WTC',
        lineColor: feature.color('#00AA55', 'white'),
        subtitle:'Hoboken\nNewport\nExchange Place\nWorld Trade Center',
        value: 'Hoboken'
      },{
        title: 'HOB - 33rd St',
        lineColor: feature.color('#55AAFF', 'white'),
        subtitle: 'Hoboken\nChristopher St\n9th St\n14th St\n23rd St\n33rd St',
        value: '33rd Street',
      },{
        title: 'JSQ - 33rd St',
        lineColor: feature.color('#FFAA00', 'white'),
        subtitle: 'Journal Square\nGrove Street\nNewport\nChristopher St\n9th St\n14th St\n23rd St\n33rd St',
        value: '33rd Street',
      },{
        title: 'Settings',
        subtitle: 'Trains within '+minutes+' min.',
        value: 'Settings'
      },{
        title: 'Help',
        subtitle: '',
        value: 'Help'
      }];

var stations = [{
        title: 'PebblePath',
        icon: 'images/PATHicon.png',
        subtitle: 'Line summary',
        value: 'PebblePath',
        destination:'None'
      }, {
        title: 'Newark Penn',
        subtitle: 'Newark, NJ',
        value:'26733',
        destination:'World Trade Center'
      }, {
        title: 'Harrison',
        subtitle: 'Harrison, NJ',
        value:'26729'
      }, {
        title: 'Journal Square',
        subtitle: 'Jersey City, NJ',
        value:'26731'
      }, {
        title: 'Grove Street',
        subtitle: 'Jersey City, NJ',
        value:'26728'
      }, {
        title: 'Exchange Place',
        subtitle: 'Jersey City, NJ',
        value:'26727'
      }, {
        title: 'World Trade Center',
        subtitle: 'Manhattan, NY',
        value:'26734'
      }, {
        title: 'Hoboken',
        subtitle: 'Hoboken, NJ',
        value:'26730'
      }, {
        title: 'Newport',
        subtitle: 'Jersey City, NJ',
        value:'26732'
      }, {
        title: 'Christopher Street',
        subtitle: 'Manhattan, NY',
        value:'26726'
      }, {
        title: '9th Street',
        subtitle: 'Manhattan, NY',
        value:'26725'
      }, {
        title: '14th Street',
        subtitle: 'Manhattan, NY',
        value:'26722'
      }, {
        title: '23rd Street',
        subtitle: 'Manhattan, NY',
        value:'26723'
      }, {
        title: '33rd Street',
        subtitle: 'Manhattan, NY',
        value:'26724'
      },{
        title: 'Help',
        subtitle: '',
        value: 'Help'
      }
];

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
  highlightBackgroundColor:varHlColor,
  status: {
      separator: 'dotted'
  },
  sections: [{
    items: direction
  }]
});

var settingsmenu = new UI.Menu({
  highlightBackgroundColor:varHlColor,
  sections: [{items: settingsop}]
});

var card = new UI.Card({
  title:'Information',
  subtitle:'Fetching...',
  body:'',
  scrollable: true,
  style: 'large'
});

var Help = new UI.Card({
  title:'Help',
  subtitle:'',
  body: helpdsp,
  scrollable: true,
  style: 'small'
});

var stationsmenu = new UI.Menu({
  highlightBackgroundColor:varHlColor,
    sections: [{
      items: stations
  }]
});

//Kickstart the app!
stationsmenu.show();


// Add a click listener for main menu
schedulemenu.on('select', function(event) {
  var opt;
  console.log("reached select listener");
  opt = direction[event.itemIndex].value;
  if (opt == 'Help'){Help.show();}
  else if(opt=='PebblePath'){}
  else{
    var stopBound = new UI.Card({
    backgroundColor: '#000000',
    titleColor:direction[event.itemIndex].lineColor,
    title: direction[event.itemIndex].title,
    bodyColor:'#FFFFFF',
    body: direction[event.itemIndex].subtitle,
    scrollable: true,
    style: 'small'
    });
    stopBound.show();
  }
});

// Add a click listener for select button click
stationsmenu.on('select', function(event) {
  station = stations[event.itemIndex].value;
  dir = stations[event.itemIndex].destination; //might determine direction by script
  console.log("station is : " + station + "Direction is: " + dir);
  if (station == 'PebblePath'){schedulemenu.show(); console.log("Launch schedule menu");}//quickTime(minutes);
  else if (station == 'Settings'){settingsmenu.show();}
  else if (station == 'Help'){Help.show();}
  else {
  stationTime(station, dir, minutes);
  }
  });

/*Add a click listener for settings button click*/
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
var URL = 'http://dlevine.us/pathdata/pathsched.php?q=' + station + '&dir=' + dir + '&min=' + minutes + '&isApp=true';
  console.log(URL);
var empty = '';
  URL = encodeURI(URL);
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
