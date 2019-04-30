'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

let locationObject;
let weatherArray = [];
const port = process.env.PORT || 3000;
app.use(cors());


function Location (search_query, formatted_query, latitude, longitude){
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}
function Weather (forecast, time){
  this.summary = forecast;
  this.time = new Date(time).toString();
  weatherArray.push(this);
}

app.get('/location', (request, response) => {
  try{
    let dataFile = require('./data/geo.json');
    let search_query = dataFile.results[0].address_components[0].long_name;
    let formatted_query = dataFile.results[0].formatted_address;
    let latitude = dataFile.results[0].geometry.location.lat;
    let longitude = dataFile.results[0].geometry.location.lng;
    locationObject = new Location(search_query, formatted_query, latitude, longitude);
    response.status(200).send(locationObject);
  } catch(error){
    response.status(500).send('There is an error on our end sorry');
  }

});

app.get('/weather', (request, response) => {
  weatherArray = [];
  try {
    let dataFile = require('./data/darksky.json');
    let weatherForecast = dataFile.daily.data;
    for(let i =0; i < weatherForecast.length; i++){
      new Weather(weatherForecast[i].summary, weatherForecast[i].time);
    }
    response.status(200).send(weatherArray);
  } catch(error){
    response.status(500).send('There is an error on our end sorry');
  }
});

app.use('*', (request, response) => response.send('Sorry, that route does not exist.'))

app.listen(port,() => console.log(`Listening on port ${port}`));
