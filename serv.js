
const express = require('express'); 
const app = express();
//const router = express.Router();
const socket = require('socket.io');
const location = require('./location.js');



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

let io = socket(app.listen(8080));




// Chat & location refresh
let counter = 5;
let newImgCounter = setInterval(function() {
    counter--;
    console.log(counter);
    //console.log('Counter: ' + counter);
    if (counter == 0) {
        new_loc = location.getLocation();
        console.log(new_loc);
        io.sockets.emit('location', {
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


