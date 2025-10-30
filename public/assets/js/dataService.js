/**
 * Data Service - Handles fetching data from Google Sheets
 * 
 * This service connects to Google Sheets and provides methods to retrieve
 * and process van schedule, tracking, and census data.
 */

class DataService {
    constructor() {
        this.cache = new Map();
        this.lastUpdate = null;
    }

    /**
     * Build Google Sheets API URL
     * @param {string} sheetName - Name of the sheet tab
     * @returns {string} - API URL
     */
    buildSheetURL(sheetName) {
        const baseURL = 'https://docs.google.com/spreadsheets/d';
        const sheetId = CONFIG.GOOGLE_SHEET_ID;
        
        // If API key is provided, use Sheets API
        if (CONFIG.GOOGLE_API_KEY) {
            return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${CONFIG.GOOGLE_API_KEY}`;
        }
        
        // Otherwise, use public CSV export
        return `${baseURL}/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    }

    /**
     * Fetch data from Google Sheets
     * @param {string} sheetName - Name of the sheet tab
     * @param {boolean} useCache - Whether to use cached data
     * @returns {Promise<Array>} - Array of row objects
     */
    async fetchSheet(sheetName, useCache = true) {
        // Check cache first
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
                // Parse Sheets API response
                const json = await response.json();
                data = this.parseGoogleSheetsAPIResponse(json);
            } else {
                // Parse Google Visualization API response
                const text = await response.text();
                data = this.parseGoogleVisualizationResponse(text);
            }

            // Cache the data
            this.cache.set(sheetName, {
                data: data,
                timestamp: Date.now()
            });

            this.lastUpdate = new Date();
            return data;

        } catch (error) {
            console.error(`Error fetching ${sheetName}:`, error);
            
            // Return cached data if available, even if expired
            if (this.cache.has(sheetName)) {
                console.log(`Using stale cache for ${sheetName}`);
                return this.cache.get(sheetName).data;
            }
            
            // Return empty array if no cache available
            return [];
        }
    }

    /**
     * Parse Google Sheets API response
     * @param {Object} json - API response
     * @returns {Array} - Parsed data
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
     * @param {string} text - Response text
     * @returns {Array} - Parsed data
     */
    parseGoogleVisualizationResponse(text) {
        // Remove the wrapper to get JSON
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
     * Get van schedule data
     * @returns {Promise<Array>}
     */
    async getSchedule() {
        const data = await this.fetchSheet(CONFIG.SHEETS.SCHEDULE);
        return this.processScheduleData(data);
    }

    /**
     * Get service tracking data
     * @returns {Promise<Array>}
     */
    async getTracking() {
        const data = await this.fetchSheet(CONFIG.SHEETS.TRACKING);
        return this.processTrackingData(data);
    }

    /**
     * Get census tract data
     * @returns {Promise<Array>}
     */
    async getCensusData() {
        return await this.fetchSheet(CONFIG.SHEETS.CENSUS);
    }

    /**
     * Process schedule data
     * @param {Array} data - Raw data
     * @returns {Array} - Processed data
     */
    processScheduleData(data) {
        return data.map(row => ({
            date: row.Date || row.date,
            time: row.Time || row.time,
            location: row.Location || row.location,
            address: row.Address || row.address,
            services: this.parseServices(row.Services || row.services),
            zipCode: row['Zip Code'] || row.zipCode || row.zip,
            notes: row.Notes || row.notes || '',
            lat: parseFloat(row.Latitude || row.lat),
            lng: parseFloat(row.Longitude || row.lng || row.lon)
        })).filter(item => item.date && item.location);
    }

    /**
     * Process tracking data
     * @param {Array} data - Raw data
     * @returns {Array} - Processed data
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
     * @param {string} services - Comma-separated services
     * @returns {Array} - Array of services
     */
    parseServices(services) {
        if (!services) return [];
        return services.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    /**
     * Get statistics summary
     * @returns {Promise<Object>}
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
     * @param {Array} schedule - Schedule data
     * @param {string} range - Date range filter
     * @returns {Array} - Filtered schedule
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
     * @returns {Date|null}
     */
    getLastUpdate() {
        return this.lastUpdate;
    }
}

// Export for use in other files
const dataService = new DataService();
