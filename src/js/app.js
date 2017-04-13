var UI = require('ui');
var ajax = require('ajax');
var feature = require('platform/feature');
var Vector2 = require('vector2');
var station;
var dir;
//var minutes = '60';
var varHlColor = '#0055AA';
var times = [];
// var dest = [];
// var number = 0;
// if (localStorage.getItem(1) === null || localStorage.getItem(1) === undefined){
//     localStorage.setItem(1, '20');
//     minutes = localStorage.getItem(1);
// } 
// else {minutes = localStorage.getItem(1);}
var helpdsp = 'This app displays information for the next three trains'+
    ' towards the chosen destination'+
    '. \n\n PebblePATH is not in anyway associated with Port Authority,'+
    ' Port Authority Tran-Hudson, or any subsidiaries. \n\n (C)2015 DJ'+
    ' Levine \n DLevine.us';

// Make a list of menu items
var direction = [{
        title: 'PebblePath',
        icon: 'images/PATHicon.png',
        subtitle: 'Choose a destination:',
        value: 'quickSchedule'
      }, {
        title: 'WTC Oculus',
        subtitle: 'World Trade Center',
        stops: 'From Newark:\nNewark Penn Station\nHarrison\nJournal Square\nGrove Street\nExchange Place\nWorld Trade Center\n\nFrom Hoboken:\nHoboken\nNewport\nExchange Place\nWorld Trade Center', 
        value: 'World Trade Center'
      }, {
        title: 'JSQ/Newark Penn',
        subtitle: 'Jersey City and Newark',
        stops: 'From WTC:\nWorld Trade Center\nExchange Place\nGrove Street\nJournal Square\nHarrison\nNewark Penn Station',
        value: 'Newark',
      },{
        title: 'Hoboken',
        subtitle: 'Hoboken Terminal',
        stops:'From 33rd St:\n33rd St\n23rd St\n14th St\n9th St\ Christopher St\nHoboken\n\n From WTC:\nWorld Trade Center\nExchange Place\nNewport\nHoboken',
        value: 'Hoboken'
      },{
        title: '33rd St',
        subtitle: '33rd Street, NY',
        stops: 'From Journal Square:\nJournal Square\nGrove Street\nNewport\nChristopher St\n9th St\n14th St\n 23rd St\n 33rd St\n\nFrom Hoboken:\nNewport\nChristopher St\n9th St\n14th St\n 23rd St\n 33rd St',
        value: '33rd Street',
//       },{
//         title: 'Settings',
//         subtitle: 'Trains within '+minutes+' min.',
//         value: 'Settings'
      },{
        title: 'Help',
        subtitle: '',
        value: 'Help'
      }];

var stations = [{
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

schedulemenu.show();

// Add a click listener for main menu
schedulemenu.on('select', function(event) {
  dir = direction[event.itemIndex].value;
  if (dir == 'quickSchedule'){quickSchedule();}
  else if (dir == 'Settings'){settingsmenu.show();}
  else if (dir == 'Help'){Help.show();}
  else {stationsmenu.show();}
});

// Add a long click listener for main menu
schedulemenu.on('longSelect', function(event) {
  dir = direction[event.itemIndex].value;
  if (dir == 'Help'){Help.show();}
  else if(dir=='quickSchedule'){}
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
  //console.log(event.itemIndex);
  if(event.itemIndex >= 7){
    dir = "Journal Square";
  }
  stationTime(station, dir);
 });

/*Add a click listener for settings button click*/
// settingsmenu.on('select', function(event) {
//   minutes =  settingsop[event.itemIndex].title;
//   localStorage.setItem(1, minutes);
//   schedulemenu.item(0, 3, { subtitle: 'Trains within '+minutes+' min.' });
//   schedulemenu.show();
//   settingsmenu.hide();
//  });

function stationTime(station,dir){
// Construct URL
card.show();
var URL = 'http://dlevine.us/pathdata/pathsched_legacy.php?q=' + station.value + '&dir=' + dir + /*'&min=' + minutes +*/ '&isApp=true';
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
      createTimeWindow();
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
        position:new Vector2(0, screenHeight/5 + 7),
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
        position:new Vector2(0,  feature.round(screenHeight - titleArea*3 - 5, screenHeight - titleArea*2 + 10)),
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
        timeWindow.remove(scheduledForText);
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

function quickSchedule(){
  console.log('reached quicktime!');
var d = new Date();
var n = d.getHours();
  
  if (n<12){
    dir='World Trade Center';
    station = stations[1];
  }
  else if(n>12){
    dir='Journal Square';
    station=stations[11];
  }
    else{}
  
    stationTime(station, dir);
}