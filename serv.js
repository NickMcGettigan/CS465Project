

const express = require('express'); 
const app = express();
const router = express.Router();

app.use(express.static('public'));

router.get('/login', (req, res) => {
    res.status(200);
    res.sendFile("/public/login.html", { root: '.' });
});

router.post('/game', (req, res) => {
    res.status(200);
    res.sendFile("/public/game.html", { root: '.' });
});

// router.get('/game', (req, res) => {
//     res.write("game");
//     res.end();
// });

router.use((req, res) => {
    res.status(404);
    res.redirect('/login');
    res.end();
});



app.use('/', router);

console.log('Serving on port: 8080');
app.listen(process.env.PORT || 8080);
