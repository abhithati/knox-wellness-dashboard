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
        // Create map centered on Knox County, Maine
        this.map = L.map(this.containerId).setView(
            CONFIG.MAP_CENTER,
            CONFIG.MAP_ZOOM
        );

        // Add tile layer
        L.tileLayer(CONFIG.MAP_TILES.url, {
            attribution: CONFIG.MAP_TILES.attribution,
            maxZoom: 19
        }).addTo(this.map);

        console.log('Map initialized');
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

        schedule.forEach(stop => {
            // Skip if no coordinates
            if (!stop.lat || !stop.lng) {
                console.warn(`No coordinates for ${stop.location}`);
                return;
            }

            const stopDate = new Date(stop.date);
            stopDate.setHours(0, 0, 0, 0);

            // Determine marker color based on date
            let markerColor;
            let markerStatus;
            
            if (stopDate.getTime() === today.getTime()) {
                markerColor = CONFIG.COLORS.currentStop;
                markerStatus = 'Today';
            } else if (stopDate > today) {
                markerColor = CONFIG.COLORS.upcomingStop;
                markerStatus = 'Upcoming';
            } else {
                markerColor = CONFIG.COLORS.pastStop;
                markerStatus = 'Past';
            }

            // Create custom icon
            const icon = this.createMarkerIcon(markerColor);

            // Create marker
            const marker = L.marker([stop.lat, stop.lng], { icon: icon });

            // Create popup content
            const popupContent = this.createPopupContent(stop, markerStatus);
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
        const servicesHTML = stop.services
            .map(service => `<span class="service-tag">${service}</span>`)
            .join('');

        return `
            <div style="min-width: 200px;">
                <div style="
                    background-color: ${this.getStatusColor(status)};
                    color: white;
                    padding: 4px 8px;
                    margin: -10px -10px 10px -10px;
                    border-radius: 4px 4px 0 0;
                    font-weight: bold;
                    font-size: 12px;
                ">${status}</div>
                
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">
                    ${stop.location}
                </h3>
                
                <p style="margin: 4px 0; font-size: 14px;">
                    <strong>📅 Date:</strong> ${this.formatDate(stop.date)}
                </p>
                
                <p style="margin: 4px 0; font-size: 14px;">
                    <strong>🕐 Time:</strong> ${stop.time}
                </p>
                
                <p style="margin: 4px 0; font-size: 14px;">
                    <strong>📍 Address:</strong> ${stop.address}
                </p>
                
                ${stop.zipCode ? `
                    <p style="margin: 4px 0; font-size: 14px;">
                        <strong>📮 Zip:</strong> ${stop.zipCode}
                    </p>
                ` : ''}
                
                <div style="margin-top: 12px;">
                    <strong style="font-size: 14px;">Services Offered:</strong>
                    <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
                        ${servicesHTML || '<em>No services listed</em>'}
                    </div>
                </div>
                
                ${stop.notes ? `
                    <p style="margin-top: 12px; font-size: 12px; color: #666; font-style: italic;">
                        ${stop.notes}
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
        switch (status) {
            case 'Today':
                return CONFIG.COLORS.success;
            case 'Upcoming':
                return CONFIG.COLORS.primary;
            case 'Past':
                return CONFIG.COLORS.pastStop;
            default:
                return CONFIG.COLORS.secondary;
        }
    }

    /**
     * Format date for display
     * @param {string} dateString
     * @returns {string}
     */
    formatDate(dateString) {
        const date = new Date(dateString);
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
