const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

let songs = [];
let uniqueId =0;

//создание прилож-я

var app = express();
//добавление функциональности (Middleware)

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended:true}) );
app.use( express.static('public') );
app.use( cors() );
app.use( fileUpload() );
//роутинг
app.get('/api/songs', function(req, res){
    //http запросы СТАТУСЫ 100-500
    res.status(200).send( songs );
});
app.post('/api/songs', function(req, res){
    const {title, author, time} = req.body;

    req.files.file.mv(
        `${__dirname}/public/files/${req.files.file.name}`,
        function (err) {
        if (err) {
        return res.status(500).send(err)
        }

        const song = {
            title, 
            author, 
            time, 
            id: uniqueId, 
            path:`files/${req.files.file.name}`
        };
        uniqueId++;
        songs.push(song);

        res.status(200).send( song );
        },
        )
});
app.delete('/api/songs/:songId', function (req, res){
    const id = +req.params.songId;
    
    const newSongs = songs.filter(song => song.id !== id);
    songs = newSongs;

    res.status(200).send( songs );
});
//запуск
app.listen(process.event.PORT || 3010);
console.log('Сервер запущен!');