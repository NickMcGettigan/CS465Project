
const express = require('express'); 
const app = express();
const socket = require('socket.io');
//const location = require('./location.js');
const request = require('request');

const fs =require("fs");
let key;
try{
    key = fileread("key.txt").toString();
}
catch{
    key = process.env.GAPI; // pull key from environment variable if no file is present
}

const raw_data = JSON.parse(fs.readFileSync('./location.json'));
const url_prepend = 'https://maps.googleapis.com/maps/api/streetview?size=800x480';
const url_append = '&key=' + key;
const hint_prepend = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';
const hint_append = '&limit=1&format=json';

const new_Image_Timer = 300;
let connected_clients = 0;
let winner = false;


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

let io = socket(app.listen(process.env.PORT || 8080));
console.log('Serving on: http://localhost:8080/');


// Location refresh
// TODO: Move back to location.js
// Problem: need to wait for a return, callback and promise weren't waiting
let counter = 5;
let location = {
    "name": "",
    "alias" : "",
    "URL" : "",
    "hint" : ""
};
let newImgCounter = setInterval(function() {
    counter--;
    //console.log('Counter: ' + counter);
    if (counter <= 0) {
        var max=(Object.keys(raw_data).length); // max location # + 1  
		var random =Math.floor(Math.random() * (max)); 

		let hint = new Promise((resolve, reject) =>  {
			request(hint_prepend + raw_data[random].hint + hint_append, { json: true }, (err, res, body) => {
				if (err) { return console.log(err); }
                var re_name = new RegExp(raw_data[random].name, "gi");
                var re_alias = new RegExp(raw_data[random].alias, "gi");
                hint_text = res.body[2].toString().replace(re_name,"<This>")
                if (raw_data[random].alias != "") {
                    hint_text.replace(re_alias,"<AKA>");
                }
				resolve(hint_text);
			});
		})

		hint
		.then((hint_text) => {
			location = {
				"name": raw_data[random].name,
				"alias" : raw_data[random].alias,
				"URL" : url_prepend + raw_data[random].URL + url_append,
				"hint" : hint_text
			}
			//console.log(location);
            counter = new_Image_Timer;
            winner = false;
            io.sockets.emit('location', {
                "URL": location.URL,
                "hint": location.hint        
            });
            //return location;
		})
		.catch((err) => {
			console.log("Error: " + err);
		});
    }
}, 1000); // Timer value in milli seconds


// Chat / Messaging
var score_table = [];
// Handle incoming connections, transmit current location
io.sockets.on('connection', function(objectSocket) { 
    connected_clients++;
    objectSocket.emit('location', {
        "URL": location.URL,
        "hint": location.hint        
    });
    
    // client successfully joined, add name to score table and push new table to all clients
    objectSocket.on('join', function(objectdata) {
        var player = {
            'name': objectdata.name,
            'id': objectdata.id,
            'score': 0
        };
        score_table.push(player);
        
        io.sockets.emit('score', {
            'table': build_table(score_table)
        });
    });
    
    // client disconnected, remove from score table and push to all clients
    objectSocket.on('disconnect', function(objectdata) {
        connected_clients--;
        var index = score_table.findIndex(function(obj){return obj.id===objectSocket.id;});
        if (index >= 0) {
            score_table.splice(index,1);
            //TODO: emit new table
            io.sockets.emit('score', {
                'table': build_table(score_table)
            });
        }
    });
    
    // New message, push out to all clients
    // check message for a match to name or alias of current location
    objectSocket.on('message', function(objectMessage) {
        io.sockets.emit('message', {
            'name': objectMessage.name,
            'message': objectMessage.message,
        })
        if ((objectMessage.message.toLowerCase().localeCompare(location.name.toLowerCase()) === 0 
            || objectMessage.message.toLowerCase().localeCompare(location.alias.toLowerCase()) === 0) 
            && winner === false && objectMessage.message.length > 0) {

            winner = true;
            io.emit('message', {
                'name': 'System',
                'message': objectMessage.name + ' wins ' + counter + ' points!',
            })
            var index = score_table.findIndex(function(obj){return obj.name===objectMessage.name;});
            score_table[index].score += counter;
            counter = 5;
            io.sockets.emit('score', {
                'table': build_table(score_table)
            });
        }
    });
});




// Routing
app.get('/login', (req, res) => {
    res.status(200);
    res.sendFile("/public/login.html", { root: '.' });
});

app.post('/game', (req, res) => {
        res.status(200);
        res.sendFile("/public/game.html", { root: '.' });
});

app.use((req, res) => {
    res.status(404);
    res.redirect('/login');
    res.end();
});






// Utilities

function build_table(score_table) {
    var table_string = '';
    table_string += '<table width="200">';
    table_string += '<tr><th>Name</th><th>Score</th></tr>';
    score_table.forEach(element => {
        table_string += '<tr><td>' + element.name + '</td><td>' + element.score + '</td></tr>';
    });
    table_string += '</table>'

    return table_string;
}

function fileread(filename){
    var contents= fs.readFileSync(filename);
    return contents;
}