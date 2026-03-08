import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Field from '../components/ui/Field';
import PageHeader from '../components/ui/PageHeader';

function DonationLocatorPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [fetching, setFetching] = useState(false);

  const [radiusKm, setRadiusKm] = useState(10);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [status, setStatus] = useState('Waiting for location...');
  const [error, setError] = useState('');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const mapCenter = useMemo(() => currentPosition || { lat: 40.7128, lng: -74.006 }, [currentPosition]);

  // Load Google Maps for rendering only (no Places API needed)
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setLoadError('Failed to initialize Google Maps.');
        }
      }, 500);
    };

    script.onerror = () => setLoadError('Error loading Google Maps script');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 13,
      mapTypeControl: false
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();
  }, [isLoaded, mapCenter]);

  // Handle Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentPosition(coords);
        setStatus(`Live location updated: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(coords);
        }
      },
      () => {
        setError('Location access denied or unavailable.');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch NGOs from Overpass API + plot on Google Map
  const fetchAndPlotNgos = useCallback(async () => {
    if (!currentPosition || !mapInstanceRef.current) return;

    setFetching(true);

    const { lat, lng } = currentPosition;
    const radiusMeters = radiusKm * 1000;

    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["office"="ngo"](around:${radiusMeters},${lat},${lng});
        way["office"="ngo"](around:${radiusMeters},${lat},${lng});
        relation["office"="ngo"](around:${radiusMeters},${lat},${lng});
        node["office"="charity"](around:${radiusMeters},${lat},${lng});
        way["office"="charity"](around:${radiusMeters},${lat},${lng});
        relation["office"="charity"](around:${radiusMeters},${lat},${lng});
        node["amenity"="ngo"](around:${radiusMeters},${lat},${lng});
        node["amenity"="food_bank"](around:${radiusMeters},${lat},${lng});
        node["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
        way["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
        relation["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
        node["amenity"="community_centre"](around:${radiusMeters},${lat},${lng});
        way["amenity"="community_centre"](around:${radiusMeters},${lat},${lng});
        node["social_facility"="food_bank"](around:${radiusMeters},${lat},${lng});
        node["social_facility"="soup_kitchen"](around:${radiusMeters},${lat},${lng});
      );
      out center;
    `;

    try {
      const resp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      });

      if (!resp.ok) throw new Error('Overpass API error');

      const data = await resp.json();

      const earthKm = 6371;
      const toRadians = (v) => (v * Math.PI) / 180;

      const results = data.elements
        .map((el) => {
          const ngoLat = el.lat || el.center?.lat;
          const ngoLng = el.lon || el.center?.lon;
          if (!ngoLat || !ngoLng) return null;

          const dLat = toRadians(ngoLat - lat);
          const dLng = toRadians(ngoLng - lng);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat)) * Math.cos(toRadians(ngoLat)) * Math.sin(dLng / 2) ** 2;
          const distanceKm = Number((earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));

          return {
            _id: el.id.toString(),
            name: el.tags?.name || el.tags?.operator || 'NGO / Community Centre',
            address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || 'Address not listed',
            phone: el.tags?.phone || el.tags?.['contact:phone'] || 'Not listed',
            website: el.tags?.website || el.tags?.['contact:website'] || null,
            openingHours: el.tags?.opening_hours || null,
            lat: ngoLat,
            lng: ngoLng,
            distanceKm
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setNgos(results);
      setError('');

      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // User position marker
      const userMarker = new window.google.maps.Marker({
        position: currentPosition,
        map: mapInstanceRef.current,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        title: 'Your Location'
      });
      markersRef.current.push(userMarker);

      // NGO markers
      results.forEach((ngo) => {
        const m = new window.google.maps.Marker({
          position: { lat: ngo.lat, lng: ngo.lng },
          map: mapInstanceRef.current,
          title: ngo.name
        });

        m.addListener('click', () => {
          infoWindowRef.current.setContent(`
            <div style="color:#111;min-width:200px">
              <strong style="font-size:1rem">${ngo.name}</strong><br/>
              <span style="color:#555;font-size:0.85rem">${ngo.address}</span><br/>
              <span style="color:#555;font-size:0.85rem">📞 ${ngo.phone}</span><br/>
              ${ngo.openingHours ? `<span style="color:#555;font-size:0.85rem">🕐 ${ngo.openingHours}</span><br/>` : ''}
              <strong style="color:#28a745">📍 ${ngo.distanceKm} km away</strong>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, m);
        });

        markersRef.current.push(m);
      });
    } catch (err) {
      setError('Failed to load nearby NGOs. Please try again.');
    } finally {
      setFetching(false);
    }
  }, [currentPosition, radiusKm]);

  // Trigger search when map is ready and we have a position
  useEffect(() => {
    if (!isLoaded || !currentPosition) return;
    const timer = setTimeout(fetchAndPlotNgos, 600);
    return () => clearTimeout(timer);
  }, [isLoaded, currentPosition, radiusKm, fetchAndPlotNgos]);

  if (loadError) {
    return (
      <div className="stack">
        <Alert tone="error">{loadError}</Alert>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="stack">
        <Alert tone="info">Loading maps interface...</Alert>
      </div>
    );
  }

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Redistribution Network"
        title="Nearest NGO Locator"
        description="Route safe surplus to nearby community partners in real time and keep edible food in circulation."
      />

      <Card toned title="Search Radius">
        <div className="form-grid">
          <Field label="Radius (km)" htmlFor="radius-km">
            <input
              id="radius-km"
              type="number"
              min="1"
              max="200"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value) || 10)}
              placeholder="Radius (km)"
            />
          </Field>
        </div>
      </Card>

      <Card title="Live Location Status">
        <Alert tone="info">{status}</Alert>
        {error && <Alert tone="error" ariaLive="assertive">{error}</Alert>}
        {fetching && <Alert tone="info">Searching for nearby NGOs...</Alert>}
      </Card>

      <Card title="Map View">
        <div className="map-wrap" style={{ height: '480px', width: '100%', position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </Card>

      <Card title={`Nearby NGOs ${ngos.length > 0 ? `(${ngos.length} found)` : ''}`}>
        {!fetching && ngos.length === 0 && (
          <p className="empty-state">
            {currentPosition
              ? 'No NGOs found in the selected radius. Try increasing the radius.'
              : 'Waiting for your location...'}
          </p>
        )}
        {ngos.map((ngo) => (
          <div
            className="row"
            key={ngo._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '14px 0',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
              <strong style={{ fontSize: '1rem' }}>{ngo.name}</strong>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>{ngo.address}</span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>📞 {ngo.phone}</span>
              {ngo.openingHours && (
                <span style={{ fontSize: '0.8rem', color: '#888' }}>🕐 {ngo.openingHours}</span>
              )}
              {ngo.website && (
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.82rem', color: '#2563eb' }}
                >
                  🌐 Website
                </a>
              )}
            </div>
            <Badge tone="success">{ngo.distanceKm} km away</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default DonationLocatorPage;
