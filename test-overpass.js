const lat = 28.6139; // Default to New Delhi or somewhere for testing
const lng = 77.2090;
const radiusMeters = 10000;

const overpassQuery = `
  [out:json][timeout:25];
  (
    node["amenity"="ngo"](around:${radiusMeters},${lat},${lng});
    way["amenity"="ngo"](around:${radiusMeters},${lat},${lng});
    relation["amenity"="ngo"](around:${radiusMeters},${lat},${lng});
    node["office"="ngo"](around:${radiusMeters},${lat},${lng});
    way["office"="ngo"](around:${radiusMeters},${lat},${lng});
    relation["office"="ngo"](around:${radiusMeters},${lat},${lng});
    node["amenity"="charity"](around:${radiusMeters},${lat},${lng});
    way["amenity"="charity"](around:${radiusMeters},${lat},${lng});
    relation["amenity"="charity"](around:${radiusMeters},${lat},${lng});
    node["office"="charity"](around:${radiusMeters},${lat},${lng});
    way["office"="charity"](around:${radiusMeters},${lat},${lng});
    relation["office"="charity"](around:${radiusMeters},${lat},${lng});
    node["amenity"="food_bank"](around:${radiusMeters},${lat},${lng});
    node["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
    way["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
  );
  out center;
`;

fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: overpassQuery
})
.then(res => res.json())
.then(data => {
  console.log('Results:', data.elements.length);
  if (data.elements.length > 0) {
    console.log(data.elements.slice(0, 3));
  }
})
.catch(console.error);
