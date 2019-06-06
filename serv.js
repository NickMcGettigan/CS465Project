

const express = require('express'); 
const app = express();
const router = express.Router();
let socket = require('socket.io');

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

/* Save Locations:
 * Big Ben
 * https://maps.googleapis.com/maps/api/streetview?size=300x300&location=51.5009153,-0.1247454&fov=90&heading=170&pitch=40&key=
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
 */


// Utilities
function fileread(filename){

    var contents= fs.readFileSync(filename);
    return contents;
}
