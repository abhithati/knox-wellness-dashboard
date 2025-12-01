/**
 * Map Handler - Manages the interactive map display
 * 
 * This handles the Leaflet map, markers, and census tract overlays
 */

class MapHandler {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.markers = [];
        this.censusTractLayer = null;
        this.init();
    }

    /**
     * Initialize the map
     */
    init() {
        // Create map
        this.map = L.map(this.containerId, {
            minZoom: 8,    
            maxZoom: 17
        }).setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
    
        // Add tile layer
        L.tileLayer(CONFIG.MAP_TILES.url, {
            attribution: CONFIG.MAP_TILES.attribution,
            maxZoom: 19
        }).addTo(this.map);
        
        // Make map globally accessible
        window.map = this.map;
        
        // Setup listener for "View on map" clicks
        this.setupPopupListener();
    }

    /**
     * Listen for requests to open specific marker popup
     */
    setupPopupListener() {
        window.addEventListener('openMarkerPopup', (event) => {
            const location = event.detail;
            
            // Find the marker that matches this location
            this.markers.forEach(marker => {
                const markerLatLng = marker.getLatLng();
                
                // Check if this is the right marker (by comparing coordinates)
                if (Math.abs(markerLatLng.lat - location.lat) < 0.0001 && 
                    Math.abs(markerLatLng.lng - location.lng) < 0.0001) {
                    
                    // Open the popup for this marker
                    marker.openPopup();
                }
            });
        });
    }

    /**
     * Add markers for van stops
     * @param {Array} schedule - Schedule data with locations
     */
    addScheduleMarkers(schedule) {
        // Clear existing markers
        this.clearMarkers();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Group events by location (lat/lng)
        const locationGroups = new Map();
        
        schedule.forEach(stop => {
            // Skip if no coordinates
            if (!stop.lat || !stop.lng) {
                console.warn(`No coordinates for ${stop.name || stop.location}`);
                return;
            }

            // Create a unique key for this location
            const locationKey = `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`;
            
            if (!locationGroups.has(locationKey)) {
                locationGroups.set(locationKey, []);
            }
            locationGroups.get(locationKey).push(stop);
        });

        // Create one marker per location, using the soonest upcoming/current event
        locationGroups.forEach((stops, locationKey) => {
            // Sort by date
            const sortedStops = stops.sort((a, b) => 
                new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00')
            );
            
            // Find the soonest upcoming or current event
            const upcomingStop = sortedStops.find(stop => {
                const stopDate = new Date(stop.date + 'T00:00:00');
                stopDate.setHours(0, 0, 0, 0);
                return stopDate.getTime() >= today.getTime();
            }) || sortedStops[sortedStops.length - 1]; // fallback to most recent if all past

            const stopDate = new Date(upcomingStop.date + 'T00:00:00');
            stopDate.setHours(0, 0, 0, 0);

            // Determine marker color based on date
            let markerColor;
            let markerStatus;
            
            console.log('Comparing dates:', stopDate.getTime(), 'vs', today.getTime(), 'for', upcomingStop.name || upcomingStop.location);
            
            if (stopDate.getTime() === today.getTime()) {
                markerColor = CONFIG.COLORS.currentStop;
                markerStatus = 'Today';
                console.log('✓ Marker is TODAY - should be green:', markerColor);
            } else if (stopDate > today) {
                markerColor = CONFIG.COLORS.upcomingStop;
                markerStatus = 'Upcoming';
                console.log('→ Marker is UPCOMING - should be teal:', markerColor);
            } else {
                markerColor = CONFIG.COLORS.pastStop;
                markerStatus = 'Past';
                console.log('← Marker is PAST - should be gray:', markerColor);
            }

            // Create custom icon
            const icon = this.createMarkerIcon(markerColor);

            // Create marker
            const marker = L.marker([upcomingStop.lat, upcomingStop.lng], { icon: icon });

            // Create popup content
            const popupContent = this.createPopupContent(upcomingStop, markerStatus);
            marker.bindPopup(popupContent);

            // Add to map
            marker.addTo(this.map);
            this.markers.push(marker);
        });

        // Fit map to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    /**
     * Create custom marker icon
     * @param {string} color - Hex color code
     * @returns {L.Icon}
     */
    createMarkerIcon(color) {
        return L.divIcon({
            html: `
                <div style="
                    background-color: ${color};
                    width: 30px;
                    height: 30px;
                    border-radius: 50% 50% 50% 0;
                    border: 3px solid white;
                    transform: rotate(-45deg);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">
                    <div style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transform: rotate(45deg);
                        color: white;
                        font-size: 16px;
                    ">🚐</div>
                </div>
            `,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }

    /**
     * Create popup content for marker
     * @param {Object} stop - Stop data
     * @param {string} status - Stop status
     * @returns {string} - HTML content
     */
    createPopupContent(stop, status) {
        // Get location name (handle both 'name' and 'location' properties)
        const locationName = stop.name || stop.location;
        
        // Find all events at this location
        const allEventsAtLocation = window.sampleVanLocations?.filter(loc => {
            const locName = loc.name || loc.location;
            return locName === locationName && 
                   Math.abs(loc.lat - stop.lat) < 0.0001 && 
                   Math.abs(loc.lng - stop.lng) < 0.0001;
        }) || [stop];
        
        // Sort by date (soonest first)
        const sortedEvents = allEventsAtLocation.sort((a, b) => 
            new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00')
        );
        
        // Get the soonest upcoming or current event
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() >= today.getTime();
        });
        
        // Use the soonest upcoming event, or fall back to the stop data
        const primaryEvent = upcomingEvents[0] || stop;
        const hasMultipleDates = upcomingEvents.length > 1;
        
        // Check if primary event is today
        const primaryEventDate = new Date(primaryEvent.date + 'T00:00:00');
        primaryEventDate.setHours(0, 0, 0, 0);
        const isToday = primaryEventDate.getTime() === today.getTime();
        
        const servicesHTML = (primaryEvent.services || [])
            .map(service => `<span class="service-tag">${service}</span>`)
            .join('');
        
        // Create date label based on whether it's today or not
        const dateLabel = isToday ? 
            `<p style="margin: 4px 0; font-size: 14px;">
                <strong>Today:</strong> ${this.formatDate(primaryEvent.date)}
            </p>` :
            `<p style="margin: 4px 0; font-size: 14px;">
                <strong>Next Date:</strong> ${this.formatDate(primaryEvent.date)}
            </p>`;
        
        // Create additional dates message
        let additionalDatesHTML = '';
        if (hasMultipleDates) {
            const otherDates = upcomingEvents.slice(1).map(event => 
                this.formatDate(event.date)
            ).join(', ');
            additionalDatesHTML = `
                <p style="margin: 8px 0 4px 0; font-size: 13px; color: #00AAAC; font-weight: 600;">
                    Upcoming: ${otherDates}
                </p>
            `;
        }

        return `
            <div style="min-width: 200px;">
                <div style="
                    color: #00AAAC;
                    padding: 4px 8px;
                    margin: -10px -10px 10px -10px;
                    border-radius: 4px 4px 0 0;
                    font-weight: bold;
                    font-size: 12px;
                ">${status}</div>
                
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">
                    ${primaryEvent.name || primaryEvent.location || 'Unknown Location'}
                </h3>
                
                ${dateLabel}
                
                ${additionalDatesHTML}
                
                <p style="margin: 4px 0; font-size: 14px;">
                    <strong>Time:</strong> ${primaryEvent.time || 'TBD'}
                </p>
                
                <p style="margin: 4px 0; font-size: 14px;">
                    <strong>Address:</strong> ${primaryEvent.address || 'Address not available'}
                </p>
                
                ${primaryEvent.zipCode ? `
                    <p style="margin: 4px 0; font-size: 14px;">
                        <strong>Zip:</strong> ${primaryEvent.zipCode}
                    </p>
                ` : ''}
                
                <div style="margin-top: 12px;">
                    <strong style="font-size: 14px;">Services Offered:</strong>
                    <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
                        ${servicesHTML || '<em>No services listed</em>'}
                    </div>
                </div>
                
                ${primaryEvent.notes ? `
                    <p style="margin-top: 12px; font-size: 12px; color: #666; font-style: italic;">
                        ${primaryEvent.notes}
                    </p>
                ` : ''}
            </div>
        `;
    }

    /**
     * Get color for status badge
     * @param {string} status
     * @returns {string} - Color code
     */
    getStatusColor(status) {
        return '#00AAAC'; // Knox Clinic teal for all statuses
    }

    /**
     * Format date for display
     * @param {string} dateString
     * @returns {string}
     */
    formatDate(dateString) {
        // Add 'T00:00:00' to ensure it's parsed as local time, not UTC
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Add census tract overlay
     * @param {Object} geoJSON - Census tract GeoJSON data
     * @param {Array} censusData - Census demographic data
     */
    addCensusTractOverlay(geoJSON, censusData) {
        if (this.censusTractLayer) {
            this.map.removeLayer(this.censusTractLayer);
        }

        // Create a mapping of census tract IDs to data
        const dataMap = new Map();
        censusData.forEach(tract => {
            dataMap.set(tract.Census_Tract, tract);
        });

        // Style function for tracts
        const style = (feature) => {
            const tractId = feature.properties.GEOID || feature.properties.TRACTCE;
            const data = dataMap.get(parseInt(tractId));
            
            // Color based on percentage without insurance
            let fillColor = '#ccc';
            if (data && data.Pct_Wout_Insurance) {
                const pct = data.Pct_Wout_Insurance;
                if (pct > 15) fillColor = '#dc2626'; // Red - high need
                else if (pct > 10) fillColor = '#f59e0b'; // Orange
                else if (pct > 5) fillColor = '#fbbf24'; // Yellow
                else fillColor = '#10b981'; // Green - low need
            }

            return {
                fillColor: fillColor,
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.5
            };
        };

        // Create layer
        this.censusTractLayer = L.geoJSON(geoJSON, {
            style: style,
            onEachFeature: (feature, layer) => {
                const tractId = feature.properties.GEOID || feature.properties.TRACTCE;
                const data = dataMap.get(parseInt(tractId));

                if (data) {
                    layer.bindPopup(this.createTractPopup(data));
                }

                // Highlight on hover
                layer.on({
                    mouseover: (e) => {
                        e.target.setStyle({
                            weight: 3,
                            fillOpacity: 0.7
                        });
                    },
                    mouseout: (e) => {
                        this.censusTractLayer.resetStyle(e.target);
                    }
                });
            }
        }).addTo(this.map);
    }

    /**
     * Create popup for census tract
     * @param {Object} data - Census tract data
     * @returns {string} - HTML content
     */
    createTractPopup(data) {
        return `
            <div style="min-width: 250px;">
                <h3 style="margin: 0 0 12px 0;">${data.Name}</h3>
                
                <p><strong>Median Income:</strong> $${data.Med_Inc?.toLocaleString() || 'N/A'}</p>
                <p><strong>Without Insurance:</strong> ${data.Pct_Wout_Insurance}%</p>
                <p><strong>No Transportation:</strong> ${data.Pct_No_Transport}%</p>
                <p><strong>Food Insecure:</strong> ${data.Pct_Food_Insec}%</p>
                <p><strong>Housing Insecure:</strong> ${data.Pct_Housing_Insec}%</p>
                <p><strong>Mental Distress:</strong> ${data.Pct_Mental_Distress}%</p>
                <p><strong>Median Age:</strong> ${data.Med_Age}</p>
            </div>
        `;
    }

    /**
     * Toggle census tract overlay visibility
     * @param {boolean} show
     */
    toggleCensusTractOverlay(show) {
        if (!this.censusTractLayer) return;

        if (show) {
            this.censusTractLayer.addTo(this.map);
        } else {
            this.map.removeLayer(this.censusTractLayer);
        }
    }

    /**
     * Clear all markers from map
     */
    clearMarkers() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
    }

    /**
     * Resize map (call after container size changes)
     */
    resize() {
        this.map.invalidateSize();
    }

    /**
     * Fly to specific location
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} zoom - Zoom level
     */
    flyTo(lat, lng, zoom = 15) {
        this.map.flyTo([lat, lng], zoom);
    }
}