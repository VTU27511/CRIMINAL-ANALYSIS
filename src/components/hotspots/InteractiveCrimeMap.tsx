import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import { CrimeHotspot } from '../../types/crime';

interface InteractiveCrimeMapProps {
  hotspots: CrimeHotspot[];
  selectedHotspot: CrimeHotspot | null;
  onSelectHotspot: (hotspot: CrimeHotspot) => void;
  showHeatmap?: boolean;
  highlightedHotspotId?: string | null;
}

export const InteractiveCrimeMap: React.FC<InteractiveCrimeMapProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  showHeatmap = true,
  highlightedHotspotId = null
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const { isDark } = useTheme();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on India / Delhi as default
    const defaultCenter: [number, number] = [28.6139, 77.2090];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 11,
      zoomControl: false
    });

    // Add custom zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer groups for markers & heat circles
    const heatmapGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    heatmapLayerRef.current = heatmapGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Tile Layer when Theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Standard free OpenStreetMap tiles (no API key required, reliable worldwide)
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abc',
      maxZoom: 19
    }).addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [isDark]);

  // Update Markers & Heatmap Circles
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !heatmapLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    const heatmapGroup = heatmapLayerRef.current;

    markersGroup.clearLayers();
    heatmapGroup.clearLayers();

    const bounds = L.latLngBounds([]);

    hotspots.forEach((h) => {
      if (!h.lat || !h.lng) return;

      const latLng: [number, number] = [h.lat, h.lng];
      bounds.extend(latLng);

      const isSelected = selectedHotspot?.id === h.id || highlightedHotspotId === h.id;

      // Color coding based on risk level
      let color = '#3b82f6'; // Medium
      let glowColor = 'rgba(59, 130, 246, 0.4)';
      if (h.riskLevel === 'CRITICAL') {
        color = '#ef4444';
        glowColor = 'rgba(239, 68, 68, 0.5)';
      } else if (h.riskLevel === 'HIGH') {
        color = '#f59e0b';
        glowColor = 'rgba(245, 158, 11, 0.5)';
      }

      // 1. Heatmap Density Circle (Semi-transparent radial ring)
      if (showHeatmap) {
        const radius = Math.max(400, (h.radiusMeters || 600) * (h.densityScore / 80));
        const circle = L.circle(latLng, {
          radius,
          color,
          fillColor: color,
          fillOpacity: isDark ? 0.25 : 0.20,
          weight: 1.5,
          dashArray: '4, 6'
        });
        heatmapGroup.addLayer(circle);
      }

      // 2. Custom Pulsing SVG Marker
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
          ${isSelected ? `
            <div class="absolute w-12 h-12 rounded-full animate-ping opacity-75" style="background-color: ${glowColor};"></div>
          ` : ''}
          <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
               style="background-color: ${color}; border-color: #ffffff; box-shadow: 0 0 15px ${glowColor};">
            <span style="font-family: monospace; font-size: 10px; font-weight: 900; color: #ffffff;">
              ${h.densityScore}
            </span>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-md pointer-events-none">
            ${h.name.split(' - ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-crime-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(latLng, { icon: customIcon });

      marker.on('click', () => {
        onSelectHotspot(h);
      });

      markersGroup.addLayer(marker);
    });

    // Fly to selected hotspot or fit bounds
    if (selectedHotspot && selectedHotspot.lat && selectedHotspot.lng) {
      mapInstanceRef.current.flyTo([selectedHotspot.lat, selectedHotspot.lng], 13, {
        duration: 0.8
      });
    } else if (bounds.isValid() && hotspots.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [hotspots, selectedHotspot, highlightedHotspotId, showHeatmap, isDark]);

  return (
    <div className="relative w-full h-[620px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] overflow-hidden shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Tactical Legend */}
      <div className="absolute bottom-3 left-3 z-[400] flex flex-wrap items-center gap-2 p-2 rounded-md bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-primary)] shadow-md">
        <span className="font-bold text-[var(--text-muted)] uppercase">Severity:</span>
        <span className="flex items-center gap-1 text-red-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          Critical (90+)
        </span>
        <span className="flex items-center gap-1 text-amber-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          High (80-89)
        </span>
        <span className="flex items-center gap-1 text-blue-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          Medium (&lt;80)
        </span>
      </div>
    </div>
  );
};
