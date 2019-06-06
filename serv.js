

const express = require('express'); 
const app = express();
const router = express.Router();
const socket = require('socket.io');
const request = require('request');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

let io = socket(app.listen(8080));

// Read in google key
const fs =require("fs");
const key= fileread("key.txt").toString();
//console.log(key);


// Chat & image refresh
let counter = 30;
let newImgCounter = setInterval(function() {
    counter--;
    //console.log('Counter: ' + counter);
    if (counter == 0) {
        io.sockets.emit('image', {
            'url': ''//WM_URL,                       // TODO: Provide Random URL
        });
        console.log("Emit Image");
        counter = 30;
    }
}, 1000);

io.sockets.on('connection', function(objectSocket) { 
    console.log("Connection"); 
    
    objectSocket.on('disconnect', function() {
        console.log('Disconnected');
    });
    
    objectSocket.on('message', function(objectMessage) {
        io.emit('message', {
            'name': objectMessage.name,
            'message': objectMessage.message,
        })
    });
});


// Hint Info
//https://en.wikipedia.org/w/api.php?action=opensearch&search=arc_de_triomphe&limit=1&format=json
request('https://en.wikipedia.org/w/api.php?action=opensearch&search=big_ben&limit=1&format=json', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(res.body[2]);
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

//app.use('/', router);

console.log('Serving on: http://localhost:8080/login');
//app.listen(process.env.PORT || 8080);



// Image Data
let BB_URL = 'https://maps.googleapis.com/maps/api/streetview?size=600x450&location=51.5009153,-0.1247454&fov=90&heading=170&pitch=40&key=' + key;
let WM_URL = 'https://maps.googleapis.com/maps/api/streetview?size=600x450&location=38.8892703,-77.0393308&fov=40&heading=90&pitch=20&key=' + key;
let CH_URL = 'https://maps.googleapis.com/maps/api/streetview?size=600x450&location=38.8896705,-77.0124246&fov=40&heading=90&pitch=10&key=' + key;
let PSU_URL = 'https://maps.googleapis.com/maps/api/streetview?size=600x450&location=45.509355,-122.6815488&fov=90&heading=120&pitch=20&key=' + key;
let AT_URL = 'https://maps.googleapis.com/maps/api/streetview?size=600x450&location=48.8739843,2.2944872&fov=100&heading=100&pitch=30&key=' + key;
let SOH_URL = 'https://maps.googleapis.com/maps/api/streetview?size=600x450&location=-33.859922,151.2171313&fov=40&heading=335&pitch=2&key=' + key;

/* Save Locations:
 * Big Ben
 * https://maps.googleapis.com/maps/api/streetview?size=300x300&location=51.5009153,-0.1247454&fov=90&heading=170&pitch=40&key=
 * Hint Info : https://en.wikipedia.org/w/api.php?action=opensearch&search=big_ben&limit=1&format=json
 * 
 * 
 * Washington Monument
 * 38.8894309,-77.0395274
 * https://maps.googleapis.com/maps/api/streetview?size=600x450&location=38.8892703,-77.0393308&fov=40&heading=90&pitch=20&key=
 * 
 * Capital Hill
 * 38.8896705,-77.0124246
 * https://maps.googleapis.com/maps/api/streetview?size=600x450&location=38.8896705,-77.0124246&fov=40&heading=90&pitch=10&key=
 * 
 * PSU
 * 45.509355,-122.6815488
 * https://maps.googleapis.com/maps/api/streetview?size=600x450&location=45.509355,-122.6815488&fov=90&heading=120&pitch=20&key=
 * 
 * Arc de Triomphe
 * 48.8739843,2.2944872
 * https://maps.googleapis.com/maps/api/streetview?size=600x450&location=48.8739843,2.2944872&fov=100&heading=100&pitch=30&key=
 * 
 * Sydney Opera House
 * -33.859922,151.2171313
 * https://maps.googleapis.com/maps/api/streetview?size=600x450&location=-33.859922,151.2171313&fov=40&heading=335&pitch=2&key=
 * 
 */


// Utilities

function fileread(filename){

    var contents= fs.readFileSync(filename);
    return contents;
}
