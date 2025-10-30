/**
 * Main Application - Knox Wellness Van Dashboard
 * 
 * Initializes the dashboard and handles user interactions
 */

class DashboardApp {
    constructor() {
        this.mapHandler = null;
        this.currentSchedule = [];
        this.currentFilter = 'upcoming';
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Knox Wellness Van Dashboard...');

        // Initialize map
        this.mapHandler = new MapHandler('map');

        // Set up event listeners
        this.setupEventListeners();

        // Load initial data
        await this.loadData();

        // Set up auto-refresh
        this.setupAutoRefresh();

        console.log('Dashboard initialized successfully');
    }

    /**
     * Set up event listeners for UI controls
     */
    setupEventListeners() {
        // Date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.updateDisplay();
            });
        }

        // Service filter
        const serviceFilter = document.getElementById('serviceFilter');
        if (serviceFilter) {
            serviceFilter.addEventListener('change', () => {
                this.updateDisplay();
            });
        }

        // Census tract toggle
        const censusTractToggle = document.getElementById('showCensusTract');
        if (censusTractToggle) {
            censusTractToggle.addEventListener('change', (e) => {
                this.mapHandler.toggleCensusTractOverlay(e.target.checked);
            });
        }

        // Refresh button
        const refreshButton = document.getElementById('refreshData');
        if (refreshButton) {
            refreshButton.addEventListener('click', async () => {
                refreshButton.disabled = true;
                refreshButton.textContent = '🔄 Refreshing...';
                
                dataService.clearCache();
                await this.loadData();
                
                refreshButton.disabled = false;
                refreshButton.textContent = '🔄 Refresh Data';
            });
        }

        // Export button
        const exportButton = document.getElementById('exportData');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportReport();
            });
        }
    }

    /**
     * Load all data from Google Sheets
     */
    async loadData() {
        try {
            console.log('Loading data from Google Sheets...');

            // Show loading state
            this.showLoadingState();

            // Fetch data in parallel
            const [schedule, tracking, censusData] = await Promise.all([
                dataService.getSchedule(),
                dataService.getTracking(),
                dataService.getCensusData()
            ]);

            console.log(`Loaded ${schedule.length} schedule items`);
            console.log(`Loaded ${tracking.length} tracking records`);
            console.log(`Loaded ${censusData.length} census tracts`);

            // Store schedule
            this.currentSchedule = schedule;

            // Update statistics
            await this.updateStatistics();

            // Update display
            this.updateDisplay();

            // Update last update time
            this.updateLastUpdateTime();

            // Try to load census tract GeoJSON if available
            this.loadCensusTractGeoJSON(censusData);

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please check your configuration and try again.');
        }
    }

    /**
     * Update statistics display
     */
    async updateStatistics() {
        try {
            const stats = await dataService.getStatistics();

            document.getElementById('totalStops').textContent = stats.totalStops.toLocaleString();
            document.getElementById('totalAttendees').textContent = stats.totalAttendees.toLocaleString();
            document.getElementById('totalServices').textContent = stats.totalServices.toLocaleString();
            document.getElementById('communitiesReached').textContent = stats.communitiesReached.toLocaleString();
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    /**
     * Update map and schedule display
     */
    updateDisplay() {
        // Filter schedule based on current filters
        const filtered = this.filterSchedule(this.currentSchedule);

        // Update map markers
        this.mapHandler.addScheduleMarkers(filtered);

        // Update schedule list
        this.renderScheduleList(filtered);
    }

    /**
     * Filter schedule based on current filter settings
     * @param {Array} schedule - Full schedule data
     * @returns {Array} - Filtered schedule
     */
    filterSchedule(schedule) {
        let filtered = [...schedule];

        // Apply date filter
        filtered = dataService.filterByDateRange(filtered, this.currentFilter);

        // Apply service filter
        const serviceFilter = document.getElementById('serviceFilter')?.value;
        if (serviceFilter && serviceFilter !== 'all') {
            filtered = filtered.filter(stop => 
                stop.services.some(service => 
                    service.toLowerCase().includes(serviceFilter.toLowerCase())
                )
            );
        }

        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        return filtered;
    }

    /**
     * Render schedule list
     * @param {Array} schedule - Schedule data to display
     */
    renderScheduleList(schedule) {
        const container = document.getElementById('scheduleList');
        if (!container) return;

        if (schedule.length === 0) {
            container.innerHTML = '<div class="loading">No scheduled stops found for the selected filters.</div>';
            return;
        }

        const html = schedule.map(stop => `
            <div class="schedule-item">
                <div class="schedule-info">
                    <div class="schedule-date">${this.formatDate(stop.date)} at ${stop.time}</div>
                    <div class="schedule-location">${stop.location}</div>
                    <div class="schedule-address">${stop.address}</div>
                    <div class="schedule-services">
                        ${stop.services.map(service => 
                            `<span class="service-tag">${service}</span>`
                        ).join('')}
                    </div>
                    ${stop.notes ? `<div style="margin-top: 8px; font-size: 0.875rem; color: #666;">${stop.notes}</div>` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Load census tract GeoJSON
     * @param {Array} censusData - Census tract data
     */
    async loadCensusTractGeoJSON(censusData) {
        try {
            // Try to load GeoJSON file
            const response = await fetch('./data/census-tract.json');
            if (response.ok) {
                const geoJSON = await response.json();
                this.mapHandler.addCensusTractOverlay(geoJSON, censusData);
                console.log('Census tract overlay loaded');
            }
        } catch (error) {
            console.log('Census tract GeoJSON not available:', error.message);
        }
    }

    /**
     * Set up automatic data refresh
     */
    setupAutoRefresh() {
        if (CONFIG.REFRESH_INTERVAL > 0) {
            setInterval(() => {
                console.log('Auto-refreshing data...');
                this.loadData();
            }, CONFIG.REFRESH_INTERVAL);
        }
    }

    /**
     * Update last update time display
     */
    updateLastUpdateTime() {
        const lastUpdate = dataService.getLastUpdate();
        const element = document.getElementById('lastUpdate');
        
        if (element && lastUpdate) {
            element.textContent = lastUpdate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }
    }

    /**
     * Export data as CSV report
     */
    async exportReport() {
        try {
            const tracking = await dataService.getTracking();
            
            // Create CSV content
            const headers = ['Date', 'Location', 'Attendees', 'Services Provided', 'Notes'];
            const rows = tracking.map(item => [
                item.date,
                item.location,
                item.attendees,
                item.servicesProvided.join('; '),
                item.notes
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `knox-wellness-van-report-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);

            console.log('Report exported successfully');
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to export report. Please try again.');
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
     * Show loading state
     */
    showLoadingState() {
        const scheduleList = document.getElementById('scheduleList');
        if (scheduleList) {
            scheduleList.innerHTML = '<div class="loading">Loading data from Google Sheets...</div>';
        }

        // Show loading in stats
        ['totalStops', 'totalAttendees', 'totalServices', 'communitiesReached'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '...';
        });
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const scheduleList = document.getElementById('scheduleList');
        if (scheduleList) {
            scheduleList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #dc2626;">
                    <h3>⚠️ Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});
