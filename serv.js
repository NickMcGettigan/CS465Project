

const express = require('express'); 
const app = express();
const router = express.Router();
const socket = require('socket.io');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const io = socket(app.listen(8080));


// Chat
io.on('connection', function(objectSocket) { 
    console.log("Connection"); //testing
    


});


// Routing
router.get('/login', (req, res) => {
    res.status(200);
    res.sendFile("/public/login.html", { root: '.' });
});

router.post('/game', (req, res) => {
        res.status(200);
        res.sendFile("/public/game.html", { root: '.' });
});

router.use((req, res) => {
    res.status(404);
    res.redirect('/login');
    res.end();
});

app.use('/', router);

console.log('Serving on: http://localhost:8080/login');
//app.listen(process.env.PORT || 8080);


/* Save Locations:
 * Big Ben
 * https://maps.googleapis.com/maps/api/streetview?size=300x300&location=51.5009153,-0.1247454&fov=90&heading=170&pitch=40&key=AIzaSyB86XBXssz8z2rfT-515uECWWeLcYVse1w
 *
 * 
 * 
 * 
 * 
 */