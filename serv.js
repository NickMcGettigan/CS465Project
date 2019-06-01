

const express = require('express'); 
const app = express();
const router = express.Router();
const socket = require('socket.io');
app.use(express.static('public'));

const io = socket(app.listen(8080));

io.on('connection', function(objectSocket) {
    console.log("connection");
    

});


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

console.log('Serving on port: 8080');
//app.listen(process.env.PORT || 8080);
