const express = require('express');
const axios = require('axios');
const cors = require("cors")
const app = express();
const { MongoClient } = require("mongodb");

const connecturi = "mongodb+srv://johnsonlin2001:Aucklandmogel1@cluster0.3b69l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(connecturi);
let db;


app.use(cors());
const PLACES_API_KEY = 'AIzaSyABWuX271CinKRn3VBpNj1VX1h1qrKEHyA'; 


app.get('/', (req, res) => {
  res.send('Radio Nimbus Server');
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
      console.error('Error fetching Places data:', error);
      res.status(500).send('Error fetching Places data');
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
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
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
      
      res.status(201).json({ message: 'Favorite added successfully', data: { city, state,lat, long, _id: result.insertedId } });
  } catch (err) {
      console.error('Error saving favorite:', err);
      res.status(500).json({ error: 'Failed to save favorite' });
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
      console.error('Error deleting favorite:', err);
      res.status(500).json({ error: 'Failed to delete favorite' });
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
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
