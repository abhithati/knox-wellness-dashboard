/**
 * Data Service - Handles fetching data from Google Sheets
 * NOW WITH AUTO-GEOCODING!
 */

 class DataService {
    constructor() {
        this.cache = new Map();
        this.geocodeCache = new Map(); // Cache for geocoded addresses
        this.lastUpdate = null;
    }

    /**
     * Build Google Sheets API URL
     */
    buildSheetURL(sheetName) {
        const baseURL = 'https://docs.google.com/spreadsheets/d';
        const sheetId = CONFIG.GOOGLE_SHEET_ID;
        
        if (CONFIG.GOOGLE_API_KEY) {
            return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${CONFIG.GOOGLE_API_KEY}`;
        }
        
        return `${baseURL}/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    }

    /**
     * Fetch data from Google Sheets
     */
    async fetchSheet(sheetName, useCache = true) {
        if (useCache && this.cache.has(sheetName)) {
            const cached = this.cache.get(sheetName);
            const cacheAge = Date.now() - cached.timestamp;
            
            if (cacheAge < CONFIG.CACHE_DURATION * 60 * 1000) {
                console.log(`Using cached data for ${sheetName}`);
                return cached.data;
            }
        }

        try {
            const url = this.buildSheetURL(sheetName);
            console.log(`Fetching data from: ${sheetName}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data;
            
            if (CONFIG.GOOGLE_API_KEY) {
                const json = await response.json();
                data = this.parseGoogleSheetsAPIResponse(json);
            } else {
                const text = await response.text();
                data = this.parseGoogleVisualizationResponse(text);
            }

            this.cache.set(sheetName, {
                data: data,
                timestamp: Date.now()
            });

            this.lastUpdate = new Date();
            return data;

        } catch (error) {
            console.error(`Error fetching ${sheetName}:`, error);
            
            if (this.cache.has(sheetName)) {
                console.log(`Using stale cache for ${sheetName}`);
                return this.cache.get(sheetName).data;
            }
            
            return [];
        }
    }

    /**
     * Parse Google Sheets API response
     */
    parseGoogleSheetsAPIResponse(json) {
        if (!json.values || json.values.length < 2) {
            return [];
        }

        const headers = json.values[0];
        const rows = json.values.slice(1);

        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });
    }

    /**
     * Parse Google Visualization API response
     */
    parseGoogleVisualizationResponse(text) {
        const jsonString = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);

        if (!json.table || !json.table.rows) {
            return [];
        }

        const headers = json.table.cols.map(col => col.label || col.id);
        const rows = json.table.rows;

        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                const cell = row.c[index];
                obj[header] = cell ? (cell.v !== null ? cell.v : '') : '';
            });
            return obj;
        });
    }

    /**
     * GEOCODING: Convert address to coordinates
     * Uses Nominatim (OpenStreetMap) - FREE, no API key needed
     */
    async geocodeAddress(address, city = 'Knox County, Maine') {
        // Check cache first
        const cacheKey = `${address}, ${city}`;
        if (this.geocodeCache.has(cacheKey)) {
            console.log(`Using cached coordinates for: ${address}`);
            return this.geocodeCache.get(cacheKey);
        }

        try {
            // Add delay to respect rate limits (max 1 request per second)
            await this.delay(1000);

            const fullAddress = `${address}, ${city}, USA`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
            
            console.log(`Geocoding: ${address}...`);
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Knox-Wellness-Van-Dashboard'
                }
            });

            if (!response.ok) {
                throw new Error(`Geocoding failed: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const coords = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
                
                // Cache the result
                this.geocodeCache.set(cacheKey, coords);
                console.log(`✓ Geocoded ${address}: ${coords.lat}, ${coords.lng}`);
                
                return coords;
            } else {
                console.warn(`⚠ Could not geocode: ${address}`);
                return null;
            }

        } catch (error) {
            console.error(`Error geocoding ${address}:`, error);
            return null;
        }
    }

    /**
     * Helper: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get van schedule data (WITH AUTO-GEOCODING)
     */
    async getSchedule() {
        const data = await this.fetchSheet(CONFIG.SHEETS.SCHEDULE);
        return await this.processScheduleData(data);
    }

    /**
     * Get service tracking data
     */
    async getTracking() {
        const data = await this.fetchSheet(CONFIG.SHEETS.TRACKING);
        return this.processTrackingData(data);
    }

    /**
     * Get census tract data
     */
    async getCensusData() {
        return await this.fetchSheet(CONFIG.SHEETS.CENSUS);
    }

    /**
     * Process schedule data (WITH AUTO-GEOCODING)
     */
    async processScheduleData(data) {
        const processed = [];

        for (const row of data) {
            const item = {
                date: row.Date || row.date,
                time: row.Time || row.time,
                location: row.Location || row.location,
                address: row.Address || row.address,
                services: this.parseServices(row.Services || row.services),
                zipCode: row['Zip Code'] || row.zipCode || row.zip,
                notes: row.Notes || row.notes || '',
                lat: parseFloat(row.Latitude || row.lat),
                lng: parseFloat(row.Longitude || row.lng || row.lon)
            };

            // If coordinates are missing or invalid, geocode the address
            if (!item.lat || !item.lng || isNaN(item.lat) || isNaN(item.lng)) {
                if (item.address) {
                    console.log(`Missing coordinates for ${item.location}, geocoding...`);
                    const coords = await this.geocodeAddress(item.address);
                    if (coords) {
                        item.lat = coords.lat;
                        item.lng = coords.lng;
                    } else {
                        console.warn(`⚠ Skipping ${item.location} - could not geocode`);
                        continue; // Skip this stop if we can't geocode it
                    }
                } else {
                    console.warn(`⚠ Skipping ${item.location} - no address provided`);
                    continue;
                }
            }

            // Only add stops with valid date, location, and coordinates
            if (item.date && item.location && item.lat && item.lng) {
                processed.push(item);
            }
        }

        return processed;
    }

    /**
     * Process tracking data
     */
    processTrackingData(data) {
        return data.map(row => ({
            date: row.Date || row.date,
            location: row.Location || row.location,
            attendees: parseInt(row.Attendees || row.attendees || 0),
            servicesProvided: this.parseServices(row['Services Provided'] || row.servicesProvided),
            notes: row.Notes || row.notes || ''
        })).filter(item => item.date && item.location);
    }

    /**
     * Parse services string into array
     */
    parseServices(services) {
        if (!services) return [];
        return services.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    /**
     * Get statistics summary
     */
    async getStatistics() {
        const [schedule, tracking] = await Promise.all([
            this.getSchedule(),
            this.getTracking()
        ]);

        const totalStops = tracking.length;
        const totalAttendees = tracking.reduce((sum, item) => sum + item.attendees, 0);
        const totalServices = tracking.reduce((sum, item) => sum + item.servicesProvided.length, 0);
        
        const uniqueLocations = new Set(tracking.map(item => item.location));
        const communitiesReached = uniqueLocations.size;

        return {
            totalStops,
            totalAttendees,
            totalServices,
            communitiesReached
        };
    }

    /**
     * Filter schedule by date range
     */
    filterByDateRange(schedule, range) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return schedule.filter(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);

            switch (range) {
                case 'today':
                    return itemDate.getTime() === today.getTime();
                
                case 'upcoming':
                    return itemDate >= today;
                
                case 'week':
                    const weekEnd = new Date(today);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return itemDate >= today && itemDate <= weekEnd;
                
                case 'month':
                    const monthEnd = new Date(today);
                    monthEnd.setMonth(monthEnd.getMonth() + 1);
                    return itemDate >= today && itemDate <= monthEnd;
                
                case 'all':
                default:
                    return true;
            }
        });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    /**
     * Get last update time
     */
    getLastUpdate() {
        return this.lastUpdate;
    }
}

// Export for use in other files
const dataService = new DataService();