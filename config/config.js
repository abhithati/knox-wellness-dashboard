/**
 * Knox Wellness Van Dashboard Configuration
 * 
 * UPDATE THESE VALUES TO CONNECT YOUR GOOGLE SHEETS DATA
 */

const CONFIG = {
  // ============================================================================
  // GOOGLE SHEETS SETUP
  // ============================================================================
  
  // Your Google Sheet ID (found in the URL)
  // Example URL: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
  GOOGLE_SHEET_ID: '1wT9gWw_erFcYceaoLfY7oK6WJSrKqLIV40WX31EVUp8',
  
  // Google Sheets API Key (optional - increases rate limits)
  // Get from: https://console.cloud.google.com/apis/credentials
  GOOGLE_API_KEY: 'AIzaSyBWNG1b5R5u_IFJ5EndXaGK_fOd3j4oPaA', // Leave empty to use public sharing
  
  // Sheet names (tabs in your Google Sheet)
  SHEETS: {
    SCHEDULE: 'Van Schedule',
    TRACKING: 'Service Tracking',
    CENSUS: 'Census Tract Data',
    BARRIERS: 'Barriers to Care'
  },

  // ============================================================================
  // MAP SETTINGS
  // ============================================================================
  
  // Default map center (Knox County, Maine)
  MAP_CENTER: [44.1, -69.1],
  
  // Default zoom level
  MAP_ZOOM: 10,
  
  // Map tile layer (use OpenStreetMap or Mapbox)
  MAP_TILES: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },

  // ============================================================================
  // DISPLAY SETTINGS
  // ============================================================================
  
  // Organization name
  ORG_NAME: 'Knox County Health Department',
  
  // Van/Program name
  PROGRAM_NAME: 'Mobile Wellness Van',
  
  // Contact information
  CONTACT: {
    phone: '(555) 123-4567',
    email: 'wellness@knoxcounty.org',
    website: 'https://knoxcounty.org/wellness'
  },

  // ============================================================================
  // DATA REFRESH SETTINGS
  // ============================================================================
  
  // How often to check for data updates (in milliseconds)
  // 300000 ms = 5 minutes
  REFRESH_INTERVAL: 300000,
  
  // Cache data locally for this many minutes
  CACHE_DURATION: 10,

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================
  
  FEATURES: {
    showHistoricalData: true,
    showAnalytics: true,
    allowDataExport: true,
    showCensusTractOverlay: true,
    enableNotifications: false // Future feature
  },

  // ============================================================================
  // COLOR SCHEME
  // ============================================================================
  
  COLORS: {
    primary: '#2563eb',      // Blue
    secondary: '#7c3aed',    // Purple
    success: '#059669',      // Green
    warning: '#d97706',      // Orange
    danger: '#dc2626',       // Red
    
    // Map markers
    currentStop: '#10b981',  // Green for current location
    upcomingStop: '#3b82f6', // Blue for scheduled stops
    pastStop: '#9ca3af'      // Gray for historical
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
