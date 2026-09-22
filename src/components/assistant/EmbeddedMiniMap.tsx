import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MapData {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  category?: string;
  radiusMeters?: number;
  densityScore?: number;
}

interface EmbeddedMiniMapProps {
  mapData: MapData;
}

export const EmbeddedMiniMap: React.FC<EmbeddedMiniMapProps> = ({ mapData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [mapData.lat, mapData.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc'
    }).addTo(map);

    // Marker
    const markerIcon = L.divIcon({
      className: 'custom-minimap-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background-color: #ef4444;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([mapData.lat, mapData.lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: monospace; font-size: 11px; color: #0f172a;">
          <strong>${mapData.name}</strong><br/>
          Density Score: <b>${mapData.densityScore || 85}/100</b>
        </div>`
      );

    // Circle radius if present
    if (mapData.radiusMeters) {
      L.circle([mapData.lat, mapData.lng], {
        radius: mapData.radiusMeters,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.2,
        weight: 1.5
      }).addTo(map);
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapData]);

  const handleOpenFull = () => {
    navigate(`/hotspots?lat=${mapData.lat}&lng=${mapData.lng}`);
  };

  return (
    <div className="mt-3 rounded-lg border border-red-500/30 bg-slate-950/80 overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-red-500/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-mono font-bold uppercase text-red-300">
            GEOSPATIAL INCIDENT FIX: {mapData.name} ({mapData.city})
          </span>
        </div>
        <button
          onClick={handleOpenFull}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 text-[9px] font-mono transition-colors"
          title="Open in Full Crime Hotspot Map"
        >
          <Maximize2 className="w-2.5 h-2.5" />
          <span>Full Map</span>
        </button>
      </div>

      {/* Mini-map container */}
      <div ref={containerRef} className="w-full h-[180px] bg-slate-950/60" />

      {/* Details bar */}
      <div className="px-3 py-1 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span>Coordinates: {mapData.lat.toFixed(4)}° N, {mapData.lng.toFixed(4)}° E</span>
        <span className="text-red-400 font-bold">
          Density Score: {mapData.densityScore || 85}/100 | Radius: {mapData.radiusMeters || 650}m
        </span>
      </div>
    </div>
  );
};
