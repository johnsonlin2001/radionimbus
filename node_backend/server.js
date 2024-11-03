const express = require('express');
const axios = require('axios');
const cors = require("cors")
const app = express();


app.use(cors());
const PLACES_API_KEY = 'AIzaSyABWuX271CinKRn3VBpNj1VX1h1qrKEHyA'; // Replace with your API key

// Default route
app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
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

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
