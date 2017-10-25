var UI = require('ui');
var ajax = require('ajax');
var feature = require('platform/feature');
var Vector2 = require('vector2');
var station;
var dir;
//var minutes = '60';
var varHlColor = '#0055AA';
var times = [];
var status = [];

if (localStorage.getItem(0) === null || localStorage.getItem(1) === undefined){
    localStorage.setItem(0, 'A');
    localStorage.setItem(1, 'A');
} 
if (localStorage.getItem(2) === null || localStorage.getItem(2) === undefined){
    localStorage.setItem(2, 'A');
    localStorage.setItem(3, 'A');
} 


var helpdsp = 'This app displays information for the next three trains'+
    ' towards the chosen destination.\n Choose your favorite stops by long selecting PebblePATH on the main menu. Access these stops quickly by clicking on PebblePATH again.'+
    ' \n\n PebblePATH is not in anyway associated with Port Authority,'+
    ' Port Authority Tran-Hudson, or any subsidiaries. \n\n (C)2015 DJ'+
    ' Levine \n DLevine.us';

// call list of menu items
var direction =  require('mainMenu.json');
//call list of stations
var stations = require('allStations.json');
//This is just for the faves menu
var directionLimited = require('directions.json');

var schedulemenu = new UI.Menu({
  highlightBackgroundColor:feature.color(varHlColor, 'black'),
  status: {
      separator: 'dotted'
  },
  sections: [{
    items: direction
  }]
});

var stationsmenu = new UI.Menu({
  highlightBackgroundColor:feature.color(varHlColor, 'black'),
    sections: [{
      items: stations
  }]
});

var favDirMorn = new UI.Menu({
  highlightBackgroundColor:feature.color(varHlColor, 'black'),
    sections: [{
      title: 'Towards:',
      items: directionLimited
  }]
});

var favDirEve = new UI.Menu({
  highlightBackgroundColor:feature.color(varHlColor, 'black'),
    sections: [{
      title: 'Towards:',
      items: directionLimited
  }]
});

var mornMenu = new UI.Menu({
  highlightBackgroundColor:feature.color(varHlColor, 'black'),
    sections: [{
      title: 'Morning Favorite:',
      items: stations
  }]
});

var eveMenu = new UI.Menu({
  highlightBackgroundColor:feature.color(varHlColor, 'black'),
    sections: [{
      title: 'Evening Favorite:',
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

schedulemenu.show();

// Add a click listener for main menu
schedulemenu.on('select', function(event) {
  dir = direction[event.itemIndex].value;
  if (dir == 'quickSchedule'){quickScheduleSet();}
  else if (dir == 'Help'){Help.show();}
  //else if (dir == 'Help'){Help.show();}
  else {stationsmenu.show();}
});

// Add a long click listener for main menu
schedulemenu.on('longSelect', function(event) {
  dir = direction[event.itemIndex].value;
  if (dir == 'Help'){Help.show();}
  else if(dir=='quickSchedule'){resetFave();}
  else{
    var stopBound = new UI.Card({
    title: direction[event.itemIndex].subtitle,
    body: direction[event.itemIndex].stops,
    scrollable: true,
    style: 'small'
    });
    stopBound.show();
  }
});

// Add a click listener for select button click
stationsmenu.on('select', function(event) {
  station = stations[event.itemIndex];
  stationTime(station, dir);
 });

function stationTime(station,dir){
// Construct URL
  card.show();
  
if(station.jsq >= "yes" && dir=="Newark"){
    dir = "Journal Square";
  }
  
var URL = 'http://dlevine.us/pathdata/pathsched_legacy.php?q=' + station.value + '&dir=' + dir + '&isApp=true';
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
      //var title = 'Scheduled for:';
      var key;
      times = [];
    
      for(key in data) { 
        if (data.hasOwnProperty(key)){		
            times.push(data[key]);
        }
			}
      //Create the time window for the user++
      createTimeWindow(dir);
    },
    function(error) {
      // Failure!
      var title = 'PebblePATH';
      var sub = 'is currently unable to retrieve schedule data.';
      card.title(title);
      card.subtitle(sub);
      card.body('');
    }
  );
}
/* Don't remember why I kept this
function pathStatus(){
// Construct URL
  card.show();
  
var URL = 'http://dlevine.us/travel/agency_data.php?q=path';
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
      //var title = 'Scheduled for:';
      var key;
      status = [];
    
      for(key in data) { 
        if (data.hasOwnProperty(key)){		
            status.push(data[key]);
        }
			}
      //Create the time window for the user++
      //createTimeWindow(dir);
    },
    function(error) {
      // Failure!
      var title = 'PebblePATH';
      var sub = 'is currently unable to retrieve schedule data.';
      card.title(title);
      card.subtitle(sub);
      card.body('');
    }
  );
}
*/
function createTimeWindow(dir){
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
      var scheduledForText = new UI.Text({ 
        text:'Scheduled for:',
        color: 'black',
        textAlign: 'center',
        size: new Vector2(screenWidth, titleArea),
        position:new Vector2(0, titleArea-2),
        font: 'gothic-14'
      });
      var nextTime = new UI.Text({ 
        text:times[0],
        color: 'black',
        textAlign: 'center',
        size: new Vector2(screenWidth, screenHeight/1.8),
        position:new Vector2(0, feature.round(screenHeight/5 + 2, screenHeight/5 + 7)),
        font: 'bitham-42-bold'
      });
      var laterTimes = new UI.Text({ 
        text:times[1] + '     ' + times[2],
        color: 'black',
        textAlign: 'center',
        size: new Vector2(screenWidth, screenHeight/6),
        position:new Vector2(0, screenHeight/2 + 4),
        font: 'gothic-24-bold'
      });
      var towards;
      if(dir == "Journal Square"){towards="Change for Newark at:";}else{towards="Towards:";}
      var towardsText = new UI.Text({ 
        text:towards,
        color: 'black',
        textAlign: 'center',
        size: new Vector2(screenWidth, titleArea),
        position:new Vector2(0, feature.round(screenHeight - titleArea*3 + 1, screenHeight - titleArea*2 + 10)),
        font: 'gothic-14'
      });
      var footerBar = new UI.Rect({ 
        position: new Vector2(0, feature.round(screenHeight-titleArea*2-10, screenHeight-titleArea+1)),
        size: new Vector2(screenWidth, titleArea),
        backgroundColor: 'black'
      });
      var destText = new UI.Text({ 
        text:dir,
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
      timeWindow.add(scheduledForText);
      timeWindow.add(footerBar);
      timeWindow.add(title);
      timeWindow.add(nextTime);
      timeWindow.add(towardsText);
      timeWindow.add(laterTimes);
      timeWindow.add(destText);
      if (feature.round()) {
        timeWindow.add(roundFooter);
        timeWindow.remove(laterTimes);
        console.log('Round display');
      }
      timeWindow.show();
      card.hide();
      timeWindow.on('click', 'up', function() {
        //up action
      });
      timeWindow.on('click', 'down', function() {
        //down action
      });
//       timeWindow.on('click', 'back', function() {
//         //back action
//       });
}

function resetFave(){
  localStorage.setItem(0, 'A');
  localStorage.setItem(1, 'A');
  localStorage.setItem(2, 'A');
  localStorage.setItem(3, 'A');
  quickScheduleSet();
}

function quickScheduleSet(){
  //console.log('reached quicktime!');
  if (localStorage.getItem(0) == 'A' || localStorage.getItem(2) == 'A'){
    mornMenu.show();
   }
  else{
    //console.log('Retreived:' + localStorage.getItem(0) + ' ' + localStorage.getItem(1) + ' ' +  localStorage.getItem(2) + ' ' + localStorage.getItem(3));
    quickScheduleRun();
  }
  // Add a click listener for select button click 
mornMenu.on('select', function(event) {
    var stationIndex = event.itemIndex;
    localStorage.setItem(0, stationIndex);
    favDirMorn.show();
  });
favDirMorn.on('select', function(event) {
    var dirIndex = directionLimited[event.itemIndex].value;
    localStorage.setItem(1, dirIndex);
    eveMenu.show();
  });
eveMenu.on('select', function(event) {
    var stationIndex = event.itemIndex;
    localStorage.setItem(2, stationIndex);
    favDirEve.show();
  });
favDirEve.on('select', function(event) {
    var dirIndex = directionLimited[event.itemIndex].value;
    localStorage.setItem(3, dirIndex);
    quickScheduleRun();
    mornMenu.hide();
    favDirMorn.hide();
    eveMenu.hide();
    favDirEve.hide();
  });
    //console.log('set to:' + localStorage.getItem(0) + ' ' + localStorage.getItem(1) + ' ' +  localStorage.getItem(2) + ' ' + localStorage.getItem(3));
}

function quickScheduleRun(){
  var d = new Date();
  var n = d.getHours();
  
   if (n < 12){
    dir = localStorage.getItem(1);
    station = stations[localStorage.getItem(0)];
  }
  else if(n >= 12){
    dir = localStorage.getItem(3);
    station = stations[localStorage.getItem(2)];
  }
  else{ console.log(n + ' Error!'); }
    stationTime(station, dir);
}