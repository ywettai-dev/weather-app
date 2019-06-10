require('dotenv').config();
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const weatherAPIKEY = process.env.OPEN_WEATHER_API_KEY;
const port = 3000;


app.listen(process.env.PORT || port, () => console.log(`weather-app starts on ${port}`));

app.set('view engine', 'ejs');
app.use(express.static('public/'));
app.use(bodyParser.urlencoded({
    extended: true
}));


//home route
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPIKEY}`;

    request(url, (err, response, body) => {
        if (err) {
            res.render('index', {
                weather: null,
                error: `Error, please try again`
            });
        } else {
            const weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', {
                    weather: null,
                    error: `Error, please try again`
                });
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}`;
                res.render('index', {
                    weather: weatherText,
                    error: null
                });
            }
        }
    });
});