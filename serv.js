

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
    console.log('Counter: ' + counter);
    if (counter == 0) {
        io.sockets.emit('image', {
            'url': BBURL,
        });
        console.log("Emit Image");
        counter = 30;
    }
}, 1000);

io.sockets.on('connection', function(objectSocket) { 
    console.log("Connection"); //testing
    
    objectSocket.on('disconnect', function() {
        console.log('Disconnected');
    })
    /*if (counter === 0) {
        objectSocket.emit('image', {
            'source': 'new_stuff',
        });
        console.log("emit image");
        counter = 30;
    }*/
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

let BBURL = 'https://maps.googleapis.com/maps/api/streetview?size=300x300&location=51.5009153,-0.1247454&fov=90&heading=170&pitch=40&key=' + key
/* Save Locations:
 * Big Ben
 * https://maps.googleapis.com/maps/api/streetview?size=300x300&location=51.5009153,-0.1247454&fov=90&heading=170&pitch=40&key=
 *
 * 
 * 
 * 
 * 
 */

function fileread(filename){

    var contents= fs.readFileSync(filename);
    return contents;
}
