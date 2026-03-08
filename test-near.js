const mongoose = require('mongoose');
const Ngo = require('./backend/models/Ngo');
require('dotenv').config({ path: './backend/.env' });

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const lat = 40.75;
  const lng = -73.98;
  const distanceMeters = 10000;

  const nearQuery = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: distanceMeters
      }
    }
  };

  try {
    const ngos = await Ngo.find(nearQuery);
    console.log('Nearby NGOs found:', ngos.length);
    console.log(ngos.map(n => n.name));
  } catch (err) {
    console.error('Query error:', err);
  } finally {
    mongoose.disconnect();
  }
}

test();
