/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');
var feature = require('platform/feature');
var Vector2 = require('vector2');
var station;
var dir;
var minutes;//='20';
var varHlColor = '#0055AA';
var times = [];
var dest = [];
var number = 0;
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
        title: 'PebblePATH',
        icon: 'images/PATHicon.png',
        subtitle: '',
        value: ''
      }, {
        title: 'WTC Bound',
        subtitle: 'World Trade Center',
        stops: 'From Newark:\nNewark Penn Station\nHarrison\nJournal Square\nGrove Street\nExchange Place\nWorld Trade Center\n\nFrom Hoboken:\nHoboken\nNewport\nExchange Place\nWorld Trade Center', 
        value: 'World Trade Center'
      }, {
        title: 'Newark Bound',
        subtitle: 'Newark Penn',
        stops: 'From WTC:\nWorld Trade Center\nExchange Place\nGrove Street\nJournal Square\nHarrison\nNewark Penn Station',
        value: 'Newark',
      },{
        title: 'Hoboken Bound',
        subtitle: 'Hoboken Terminal',
        stops:'From 33rd St:\n33rd St\n23rd St\n14th St\n9th St\ Christopher St\nHoboken\n\n From WTC:\nWorld Trade Center\nExchange Place\nNewport\nHoboken',
        value: 'Hoboken'
      },{
        title: '33rd St Bound',
        subtitle: '33rd Street, NY',
        stops: 'From Journal Square:\nJournal Square\nGrove Street\nNewport\nChristopher St\n9th St\n14th St\n 23rd St\n 33rd St\n\nFrom Hoboken:\nNewport\nChristopher St\n9th St\n14th St\n 23rd St\n 33rd St',
        value: '33rd Street',
      },{
        title: 'Settings',
        subtitle: 'Trains within', //'+minutes+' min.',
        value: 'Settings'
      },{
        title: 'Help',
        subtitle: '',
        value: 'Help'
      }];


var stations = [{
        title: 'PebblePATH',
        icon: 'images/PATHicon.png',
        subtitle: '',
        value: ''
      },{
        title: 'Newark Penn',
        subtitle: 'Newark, NJ',
        value:'26733'
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
        title: 'Settings',
        subtitle: 'Trains within '+minutes+' min.',
        value: 'Settings'
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
  highlightBackgroundColor: feature.color(varHlColor, 'black'),
  status: {
      separator: 'dotted',
      backgroundColor: feature.color(varHlColor, 'black'),
      color: 'white'
  },
  sections: [{
    items: direction
  }]
});

var settingsmenu = new UI.Menu({
  highlightBackgroundColor: feature.color(varHlColor, 'black'),
  status: {
      separator: 'dotted',
      backgroundColor: feature.color(varHlColor, 'black'),
      color: 'white'
  },
  sections: [{items: settingsop}]
});

var stationsmenu = new UI.Menu({
  highlightBackgroundColor: feature.color(varHlColor, 'black'),
  status: {
      separator: 'dotted',
      backgroundColor: feature.color(varHlColor, 'black'),
      color: 'white'
  },
    sections: [{
      items: stations
  }]
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

stationsmenu.show();

// Add a click listener for main menu
schedulemenu.on('select', function(event) {
  dir = direction[event.itemIndex];
  if (dir.title == 'PebblePATH'){console.log("PebblePATH Select");}//Nothing right now
  else if (dir.title == 'Settings'){settingsmenu.show();}
  else if (dir.title == 'Help'){Help.show();}
  else {stationsmenu.show();}
}); //Not currently in use

// Add a long click listener for main menu
stationsmenu.on('longSelect', function(event) {
  station = stations[event.itemIndex];
  if (station.title == 'Help'){Help.show();}
  else if (station.title == 'Settings'){Help.show();}
  else if(station.title =='PebblePATH'){console.log("PebblePATH Long Select");}//Nothing right now
  else{
//     var stopBound = new UI.Card({
//     title: station.subtitle,
//     body: station.stops,
//     scrollable: true,
//     style: 'small'
//     });
//     stopBound.show();
  }
 
});

// Add a click listener for select button click
stationsmenu.on('select', function(event) {
  station = stations[event.itemIndex];
  if (station.title == 'PebblePATH'){console.log("PebblePATH Select");}//Nothing right now
  else if (station.title == 'Settings'){settingsmenu.show();}
  else if (station.title == 'Help'){Help.show();}
  else{
    station = stations[event.itemIndex];
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
var URL = 'http://dlevine.us/pathdata/pathsched.php?q=' + station.value + /*'&dir=' + dir.value + */'&min=' + minutes;// + '&isApp=true';
  console.log(URL);
  URL = encodeURI(URL);
// Make the request
  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      // Success!
      var key;
      dest = [];
      times = [];
    
      for(key in data[0]) { 
        if (data[0].hasOwnProperty(key)){		
            times.push(data[0][key]);
        }
			}
      for(key in data[1]) { 
        if (data[1].hasOwnProperty(key)){		
            dest.push(data[1][key]);
        }
			}
     if(times[0] !== ""){/*times = times.join('\n');*/}
     else{times.push("There are no trains.");} //for returning blank from script
      
      // Show to user
      card.hide();
      createTimeWindow();
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
  );

}

function createTimeWindow(){
        // Create a dynamic window
      var timeWindow = new UI.Window({
        status: {
          separator: 'dotted',
          backgroundColor: feature.color(varHlColor, 'white'),
          color:feature.color('white', 'black'),
        },
        backgroundColor: 'white'
      });
      
      var screenHeight = timeWindow.size().y;
      var screenWidth = timeWindow.size().x;
      var titleArea = screenHeight/5.8;
  
      var titleBar = new UI.Rect({ 
        position: new Vector2(0, 0),
        size: new Vector2(screenWidth, titleArea),
        backgroundColor: 'black'//feature.color('#0000FF', 'black')
      });
      var title = new UI.Text({ 
        text: station.title,
        color: feature.color('#FFDD00', 'white'),
        textAlign: 'center',
        size: new Vector2(screenWidth, titleArea),
        position:new Vector2(0, -3),
        font: 'gothic-24-bold'
      });
      var nextTime = new UI.Text({ 
        text:times[number],
        color: 'black',
        textAlign: 'center',
        size: new Vector2(screenWidth, screenHeight/2),
        position:new Vector2(0, feature.round(screenHeight/4-10, screenHeight/3 - 8)),
        font: 'bitham-42-bold'
      });
      var towardsText = new UI.Text({ 
        text:'Towards:',
        color: 'black',
        textAlign: 'center',
        size: new Vector2(screenWidth, titleArea),
        position:new Vector2(0,  feature.round(screenHeight - titleArea*3 - 5, screenHeight - titleArea*2 + 5)),
        font: 'gothic-18-bold'
      });
      var footerBar = new UI.Rect({ 
        position: new Vector2(0, feature.round(screenHeight-titleArea*2-10, screenHeight-titleArea+1)),
        size: new Vector2(screenWidth, titleArea),
        backgroundColor: 'black'
      });
      var destText = new UI.Text({ 
        text:dest[number],
        color: feature.color('#FFDD00', 'white'),
        textAlign: 'center',
        size: new Vector2(screenWidth, titleArea),
        position:new Vector2(0, feature.round(screenHeight - titleArea*2 - 12, screenHeight - titleArea - 2)),
        font: 'gothic-24-bold'
      });
      var roundFooter = new UI.Rect({ 
        position: new Vector2(0, screenHeight-titleArea-10),
        size: new Vector2(screenWidth, titleArea + 4),
        backgroundColor: feature.color(varHlColor, 'white')
      });//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      timeWindow.add(titleBar);
      timeWindow.add(footerBar);
      timeWindow.add(title);
      timeWindow.add(nextTime);
      timeWindow.add(towardsText);
      timeWindow.add(destText);
      if (feature.round()) {
        timeWindow.add(roundFooter);
        console.log('Round display');
      }
      timeWindow.show();
      timeWindow.on('click', 'up', function() {
        change("up", timeWindow);
      });
      timeWindow.on('click', 'down', function() {
        change("down", timeWindow);
      });
      timeWindow.on('click', 'back', function() {
        change("back", timeWindow);
      });
}

function change(button, window){
  if(button == "up"){if(number !== times.length-1) {number = number + 1;} else{Vibe.vibrate('short');}}
  else if (button == "down"){
    if(number !== 0){number = number - 1;} else{Vibe.vibrate('short');}
  }//number = times.length-1;}}
  else{
    //console.log("reached other button");
    stationsmenu.show();
    number = 0;
    card.hide();
    window.hide();
    return;
  }
  //console.log(button + ' clicked! number = ' + number);
  //stationTime(station, dir, minutes);
  window.hide();
  createTimeWindow();
}