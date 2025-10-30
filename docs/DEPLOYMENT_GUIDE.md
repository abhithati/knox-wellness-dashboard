# Deployment Guide

Complete step-by-step instructions for deploying the Knox Wellness Van Dashboard.

---

## 📋 Prerequisites

- GitHub account
- Google account
- Text editor (VS Code, Sublime, or Notepad++)
- Basic command line knowledge (helpful but not required)

---

## 🚀 Part 1: Google Sheets Setup

### Step 1: Create Your Google Sheet

1. **Create a new Google Sheet:**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Click "Blank" to create a new sheet

2. **Rename the sheet:**
   - Click "Untitled spreadsheet" at the top
   - Name it: "Knox Wellness Van Data"

### Step 2: Set Up Sheet Tabs

Create 4 tabs with these exact names:

#### Tab 1: "Van Schedule"

**Column Headers (Row 1):**
```
Date | Time | Location | Address | Services | Zip Code | Latitude | Longitude | Notes
```

**Sample Data (Row 2):**
```
2025-11-15 | 10:00 AM | Camden Library | 55 Main St, Camden | Health Screening, Dental | 04843 | 44.2098 | -69.0648 | Free blood pressure checks
```

#### Tab 2: "Service Tracking"

**Column Headers:**
```
Date | Location | Attendees | Services Provided | Notes
```

**Sample Data:**
```
2025-11-01 | Rockland Community Center | 25 | Blood pressure checks, Dental screenings | High turnout
```

#### Tab 3: "Census Tract Data"

Copy your existing census tract data here (from Data_by_Census_Tract__1_.xlsx)

#### Tab 4: "Barriers to Care"

Copy your existing barriers data here (from Barriers_To_Care_Cleaned__4___3___2___1_.xlsx)

### Step 3: Make Sheet Public

1. Click the **Share** button (top right)
2. Click **Change to anyone with the link**
3. Set permission to **Viewer**
4. Click **Copy link**
5. **Save this link!** You'll need the Sheet ID from it

The URL looks like:
```
https://docs.google.com/spreadsheets/d/1wT9gWw_erFcYceaoLfY7oK6WJSrKqLIV40WX31EVUp8/edit#gid=0

https://docs.google.com/spreadsheets/d/1wT9gWw_erFcYceaoLfY7oK6WJSrKqLIV40WX31EVUp8/edit?usp=sharing
```

Copy the `SHEET_ID_HERE` part (the long string between `/d/` and `/edit`)

---

## 🗂️ Part 2: GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **+** icon → **New repository**
3. Name it: `knox-wellness-dashboard`
4. Make it **Public**
5. Check **Add a README file**
6. Click **Create repository**

### Step 2: Upload Dashboard Files

**Option A: Using GitHub Web Interface (Easiest)**

1. In your repository, click **Add file** → **Upload files**
2. Drag and drop all the dashboard files you received
3. Click **Commit changes**

**Option B: Using Git Command Line**

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/knox-wellness-dashboard.git
cd knox-wellness-dashboard

# Copy all dashboard files to this directory
# (Copy the files you received into this folder)

# Add, commit, and push
git add .
git commit -m "Initial dashboard deployment"
git push origin main
```

### Step 3: Configure Your Google Sheet ID

1. Open `config/config.js` in your repository
2. Click the **pencil icon** to edit
3. Find this line:
   ```javascript
   GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE',
   ```
4. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID
5. Click **Commit changes**

### Step 4: Enable GitHub Pages

1. Go to your repository **Settings**
2. Scroll to **Pages** (in the left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 2-3 minutes
6. Your dashboard will be live at:
   ```
   https://YOUR-USERNAME.github.io/knox-wellness-dashboard/
   ```

---

## 🧪 Part 3: Testing

### Test Checklist

- [ ] Dashboard loads without errors
- [ ] Map displays correctly
- [ ] Sample data appears on map
- [ ] Schedule list shows entries
- [ ] Statistics display numbers
- [ ] Filters work (try changing date range)
- [ ] Census tract overlay toggles on/off
- [ ] Clicking markers shows popup info

### Add Test Data

1. Add a few test entries to your "Van Schedule" sheet
2. Wait 1-2 minutes
3. Refresh your dashboard
4. Verify new entries appear

---

## 🎨 Part 4: Customization

### Update Organization Information

Edit `config/config.js`:

```javascript
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
```

### Customize Colors

Edit `config/config.js`:

```javascript
COLORS: {
  primary: '#2563eb',      // Main blue color
  secondary: '#7c3aed',    // Purple accent
  success: '#059669',      // Green for success
  warning: '#d97706',      // Orange for warnings
  danger: '#dc2626',       // Red for errors
}
```

### Adjust Map Center

If your service area isn't Knox County, Maine, update:

```javascript
// Default map center [latitude, longitude]
MAP_CENTER: [44.1, -69.1],

// Default zoom level (higher = more zoomed in)
MAP_ZOOM: 10,
```

---

## 🔐 Part 5: Security & Privacy Setup

### HIPAA Compliance Checklist

- [ ] No patient names in Google Sheet
- [ ] No medical record numbers
- [ ] No specific diagnoses or treatments
- [ ] Only aggregate statistics (counts)
- [ ] Only scheduled locations (not patient addresses)
- [ ] All team members trained on data privacy

### Google Sheet Access Control

**Recommended Settings:**
- **Viewing:** Anyone with link (for dashboard)
- **Editing:** Specific people only (your team)

**To restrict editing:**
1. File → Share → Advanced
2. Under "Who has access," click "Anyone with the link"
3. Change to "Restricted" or "Specific people"
4. Add your team members' emails

---

## 🐛 Troubleshooting

### Dashboard Shows "Loading..." Forever

**Fix:**
1. Check Google Sheet is set to "Anyone with link can view"
2. Verify Sheet ID in `config/config.js` is correct
3. Check browser console for errors (F12 key)

### Map Doesn't Show Markers

**Fix:**
1. Verify latitude/longitude are numbers, not text
2. Check coordinates are in range:
   - Latitude: -90 to 90
   - Longitude: -180 to 180
3. Make sure "Latitude" and "Longitude" column names match exactly

### Census Tract Overlay Not Working

**Expected:** This feature requires additional GeoJSON files that aren't included by default.

**To add:**
1. Download census tract boundaries from [census.gov](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
2. Convert to GeoJSON format
3. Add to `data/census-tract.json`

### "403 Forbidden" or "429 Too Many Requests" Errors

**Fix:**
1. Get a Google API Key:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Sheets API
   - Create credentials (API Key)
2. Add API key to `config/config.js`:
   ```javascript
   GOOGLE_API_KEY: 'YOUR_API_KEY_HERE',
   ```

---

## 📈 Part 6: Going Live

### Pre-Launch Checklist

- [ ] All test data removed
- [ ] Real van schedule added
- [ ] Contact information updated
- [ ] Team trained on updating Google Sheet
- [ ] Privacy policy reviewed
- [ ] Stakeholders notified

### Launch Communication

**Sample Email to Community Partners:**

```
Subject: New Knox Wellness Van Dashboard Now Live!

Hi [Partner Name],

We're excited to announce our new Mobile Wellness Van Dashboard is now live!

🌐 Dashboard Link: https://YOUR-USERNAME.github.io/knox-wellness-dashboard/

This interactive tool allows community members to:
- See where the van will be and when
- View services offered at each stop
- Access real-time schedule updates

The dashboard updates automatically as we add new stops to our schedule.

Please share this link with your community members and let us know if you have any questions!

Best regards,
Knox County Health Department
```

---

## 🔄 Ongoing Maintenance

### Weekly Tasks
- Update van schedule in Google Sheet
- Record attendance and services provided
- Check dashboard displays correctly

### Monthly Tasks
- Review analytics and statistics
- Export monthly report
- Share insights with stakeholders
- Update future schedule (4-6 weeks out)

### Quarterly Tasks
- Review high-need areas
- Assess program reach
- Consider schedule adjustments
- Update census data (if available)

### Annual Tasks
- Refresh census tract data
- Review and update barriers to care data
- Evaluate dashboard effectiveness
- Consider feature enhancements

---

## 🆘 Getting Additional Help

### GitHub Issues
For bugs or feature requests:
1. Go to your repository
2. Click **Issues** tab
3. Click **New Issue**
4. Describe the problem or request

### Community Resources
- **Leaflet.js Docs:** https://leafletjs.com/reference.html
- **Google Sheets API:** https://developers.google.com/sheets/api
- **GitHub Pages:** https://pages.github.com

---

## 🎉 Success!

Your dashboard should now be live and updating automatically from your Google Sheet!

**Next Steps:**
1. Share the dashboard link with your team
2. Train staff on updating the Google Sheet
3. Distribute the link to community members
4. Monitor usage and gather feedback

**Remember:** The power of this dashboard is that anyone on your team can update it just by editing the Google Sheet - no coding required!

---

**Questions? Issues? Feature ideas?**  
Open a GitHub issue or contact the Scout Labs team.
