const express = require('express');
const axios = require('axios');
const cors = require("cors")
const path = require('path');
const app = express();
const { MongoClient } = require("mongodb");

const connecturi = "mongodb+srv://johnsonlin2001:Aucklandmogel1@cluster0.3b69l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(connecturi);
let db;


app.use(cors());
const PLACES_API_KEY = 'AIzaSyABWuX271CinKRn3VBpNj1VX1h1qrKEHyA'; 

app.use(express.static(path.join(__dirname, 'radionimbus', 'browser')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'radionimbus', 'browser', 'index.html'));
});

app.get('/places', async (req, res) => {
    const input = req.query.input || 'Los';
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${PLACES_API_KEY}`
      );
      const cityStateList = response.data.predictions.map((item) => {
        const city = item.terms[0]?.value;  
        const state = item.terms[1]?.value;  
        return { city, state };
      });
  
      res.json(cityStateList);
      
    } catch (error) {
      console.error(error);
    }
  });


app.get("/fetchweatherdata", async (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;



  let apikey= "fCWjETWnRJRgHiOjCyTyE9C9k0ymlCVK";

  try{
  const response = await axios.get(
    `https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover&timesteps=1d&units=imperial&timezone=America/Los_Angeles&apikey=${apikey}`
  );

  const response1 = await axios.get(
    `https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,visibility,cloudCover&timesteps=1h&units=imperial&timezone=America/Los_Angeles&apikey=${apikey}`
  );


  res.json({ daily_data: response.data, hourly_data: response1.data });
  }catch(error){
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded." });
    }

  }

})


app.post('/addfavorites', async (req, res) => {
  try {
      const client = new MongoClient(connecturi);
      const city = req.query.city;

      const state = req.query.state;
      const lat = req.query.lat;
      const long = req.query.long;
      await client.connect();
      db = client.db('RadioNimbus');

      const collection = db.collection('favs');

      const result = await collection.insertOne({ city, state, lat, long });

      await client.close();
      
      res.status(200).json({ message: 'Favorite added!', data: { city, state,lat, long, _id: result.insertedId } });
  } catch (err) {
      console.error(err);
  }
});

app.delete('/deletefavorite', async (req, res) => {
  try {
    const client = new MongoClient(connecturi);
    const city = req.query.city;

    const state = req.query.state;
    await client.connect();
    db = client.db('RadioNimbus');

    const collection = db.collection('favs');
    const result = await collection.deleteOne({ city: city, state: state });

    await client.close();

  } catch (err) {
      console.error(err);
  }
});

app.get('/getfavorites', async (req, res) => {
  try {
    const client = new MongoClient(connecturi);
    await client.connect();
    
    const db = client.db('RadioNimbus');
    const collection = db.collection('favs');

    
    const favorites = await collection.find({}).toArray();
    
    res.status(200).json(favorites); 
    await client.close()
  } catch (err) {
    console.error(err);
  }
});

app.get('/checkfavs', async (req, res) => {
  const city = req.query.city;
  const state = req.query.state; 

  try {
    const client = new MongoClient(connecturi);
    await client.connect();

    const db = client.db('RadioNimbus');
    const collection = db.collection('favs');

    const query = {"city": city, "state": state}; 

    const document = await collection.findOne(query);
    res.status(200).json({exists: document !== null});


  } catch(err){
    console.log(err);
  } finally{
    await client.close();
  }

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'radionimbus', 'browser', 'index.html'));
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});
