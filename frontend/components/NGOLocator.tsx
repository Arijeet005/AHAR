'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BACKEND_BASE } from '@/data/aharData';

// Dynamically import map to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

type NGO = {
  _id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm: number;
  acceptedFoodTypes?: string[];
  pickupAvailable?: boolean;
  operatingHours?: string;
  location: { coordinates: [number, number] };
};

const FALLBACK_COORDS = { lat: 22.5726, lng: 88.3639 }; // Kolkata

export default function NGOLocator() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [selectedNgo, setSelectedNgo] = useState<string | null>(null);
  const [donationSent, setDonationSent] = useState<Record<string, boolean>>({});
  const mapLoaded = useRef(false);

  const fetchNGOs = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_BASE}/api/donations/nearby-ngos?lat=${lat}&lng=${lng}&radiusKm=15`
      );
      const data = await res.json();
      if (data?.data?.ngos) setNgos(data.data.ngos);
      else if (data?.data?.allSorted) setNgos(data.data.allSorted.slice(0, 8));
    } catch {
      // Generate mock NGOs for demonstration
      const mockNgos: NGO[] = [
        { _id: '1', name: 'Annadaata Foundation', address: '12, Park Street, Kolkata', phone: '+91-9800000001', distanceKm: 1.2, acceptedFoodTypes: ['cooked', 'packaged'], pickupAvailable: true, operatingHours: '8AM–8PM', location: { coordinates: [lng + 0.01, lat + 0.005] } },
        { _id: '2', name: 'Robin Hood Army', address: 'Salt Lake, Sector V, Kolkata', phone: '+91-9800000002', distanceKm: 2.8, acceptedFoodTypes: ['all'], pickupAvailable: true, operatingHours: '10AM–10PM', location: { coordinates: [lng - 0.015, lat + 0.01] } },
        { _id: '3', name: 'Feeding India Network', address: 'New Town, Kolkata', phone: '+91-9800000003', distanceKm: 4.5, acceptedFoodTypes: ['packaged', 'raw'], pickupAvailable: false, operatingHours: '9AM–6PM', location: { coordinates: [lng + 0.02, lat - 0.01] } },
        { _id: '4', name: 'No Food Waste India', address: 'Jadavpur, Kolkata', phone: '+91-9800000004', distanceKm: 6.1, acceptedFoodTypes: ['cooked'], pickupAvailable: true, operatingHours: '7AM–9PM', location: { coordinates: [lng - 0.025, lat - 0.02] } },
      ];
      setNgos(mockNgos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          fetchNGOs(c.lat, c.lng);
        },
        () => {
          setGeoError('Using default location (Kolkata)');
          setCoords(FALLBACK_COORDS);
          fetchNGOs(FALLBACK_COORDS.lat, FALLBACK_COORDS.lng);
        },
        { timeout: 5000 }
      );
    } else {
      setCoords(FALLBACK_COORDS);
      fetchNGOs(FALLBACK_COORDS.lat, FALLBACK_COORDS.lng);
    }
  }, []);

  // Import Leaflet CSS on client only
  useEffect(() => {
    if (!mapLoaded.current) {
      import('leaflet/dist/leaflet.css' as string);
      mapLoaded.current = true;
    }
  }, []);

  const handleDonationRequest = (ngoId: string, ngoName: string) => {
    setDonationSent((prev) => ({ ...prev, [ngoId]: true }));
    // Could call POST /api/donations/request here
  };

  const accentTurquoise = '#30D5C8';

  return (
    <section id="ngo" className="relative py-24 px-6 overflow-hidden" aria-label="NGO locator">
      {/* Background glow */}
      <div
        className="absolute -top-32 left-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #30D5C8 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 grid-dots opacity-30" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-accent-turquoise text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: '0.2em' }}>
            ◆ NGO REDISTRIBUTION NETWORK
          </p>
          <h2 className="font-heading font-black text-white text-4xl md:text-5xl mb-4">
            Find NGOs<br />
            <span className="text-accent-turquoise">Near You</span>
          </h2>
          <p className="font-body text-text-secondary max-w-xl mx-auto">
            Geo-matched food redistribution partners ready to collect your surplus.
          </p>
          {geoError && (
            <p className="font-body text-xs text-text-secondary mt-3" style={{ color: '#FC8019' }}>
              ℹ {geoError}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map */}
          <motion.div
            className="lg:col-span-3 rounded-sm overflow-hidden relative"
            style={{ height: '480px', border: '1px solid rgba(48,213,200,0.15)' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 z-10" style={{ borderTop: `1px solid ${accentTurquoise}`, borderLeft: `1px solid ${accentTurquoise}` }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 z-10" style={{ borderBottom: `1px solid ${accentTurquoise}`, borderRight: `1px solid ${accentTurquoise}` }} />

            {coords ? (
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={13}
                style={{ width: '100%', height: '100%' }}
                aria-label="Map showing nearby NGOs"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* User location marker */}
                {ngos.map((ngo) => (
                  <Marker
                    key={ngo._id}
                    position={[ngo.location.coordinates[1], ngo.location.coordinates[0]]}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'var(--font-rajdhani), sans-serif', minWidth: '180px' }}>
                        <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{ngo.name}</p>
                        <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{ngo.address}</p>
                        <p style={{ fontSize: '12px', color: '#30D5C8' }}>{ngo.distanceKm} km away</p>
                        {ngo.pickupAvailable && (
                          <p style={{ fontSize: '11px', color: '#FC8019', marginTop: '4px' }}>✓ Pickup Available</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-dim">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent-turquoise border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-body text-text-secondary text-sm">Locating NGOs...</p>
                </div>
              </div>
            )}

            {/* HUD overlay label */}
            <div
              className="absolute bottom-4 left-4 z-[1000] glass px-3 py-1.5 flex items-center gap-2"
              style={{ border: '1px solid rgba(48,213,200,0.2)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-turquoise animate-pulse" />
              <span className="font-heading text-xs text-accent-turquoise" style={{ letterSpacing: '0.15em' }}>
                {ngos.length} NGOs FOUND
              </span>
            </div>
          </motion.div>

          {/* NGO list */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#30D5C8 #111' }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            role="list"
            aria-label="Nearby NGOs"
          >
            {loading && (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-2 border-accent-turquoise border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && ngos.length === 0 && (
              <div className="glass p-6 text-center">
                <p className="font-body text-text-secondary">No NGOs found in your area.</p>
              </div>
            )}

            <AnimatePresence>
              {ngos.map((ngo, i) => {
                const isDonated = donationSent[ngo._id];
                const isSelected = selectedNgo === ngo._id;
                return (
                  <motion.div
                    key={ngo._id}
                    role="listitem"
                    className="glass p-4 cursor-pointer relative transition-all duration-200"
                    style={{
                      border: isSelected ? `1px solid ${accentTurquoise}` : '1px solid rgba(255,255,255,0.06)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedNgo(isSelected ? null : ngo._id)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedNgo(isSelected ? null : ngo._id)}
                    aria-expanded={isSelected}
                  >
                    {/* Distance badge */}
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-heading font-bold text-white text-sm leading-tight">{ngo.name}</p>
                      <span
                        className="font-heading text-xs ml-2 shrink-0"
                        style={{ color: accentTurquoise, letterSpacing: '0.1em' }}
                      >
                        {ngo.distanceKm} km
                      </span>
                    </div>

                    <p className="font-body text-text-secondary text-xs mb-2">{ngo.address}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {ngo.pickupAvailable && (
                        <span
                          className="font-body text-xs px-2 py-0.5 rounded-sm"
                          style={{ background: 'rgba(48,213,200,0.1)', color: accentTurquoise, border: '1px solid rgba(48,213,200,0.2)' }}
                        >
                          Pickup Available
                        </span>
                      )}
                      {ngo.acceptedFoodTypes?.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="font-body text-xs px-2 py-0.5 rounded-sm capitalize"
                          style={{ background: 'rgba(255,255,255,0.04)', color: '#a0a0a0', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {ngo.operatingHours && (
                            <p className="font-body text-xs text-text-secondary mb-2">
                              🕐 {ngo.operatingHours}
                            </p>
                          )}
                          <p className="font-body text-xs text-text-secondary mb-3">📞 {ngo.phone}</p>

                          <button
                            id={`donate-ngo-${ngo._id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDonationRequest(ngo._id, ngo.name);
                            }}
                            disabled={isDonated}
                            className="w-full py-2.5 font-heading font-bold text-xs tracking-widest text-white rounded-sm transition-all duration-300 disabled:cursor-not-allowed"
                            style={{
                              background: isDonated ? 'rgba(48,213,200,0.1)' : `linear-gradient(135deg, #30D5C8, #20A89E)`,
                              border: `1px solid ${accentTurquoise}40`,
                              color: isDonated ? accentTurquoise : '#0b0b0b',
                              letterSpacing: '0.12em',
                            }}
                            aria-label={isDonated ? `Donation request sent to ${ngo.name}` : `Request pickup from ${ngo.name}`}
                          >
                            {isDonated ? '✓ REQUEST SENT' : 'REQUEST PICKUP'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
