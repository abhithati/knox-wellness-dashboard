# Knox Wellness Van Dashboard

Interactive dashboard for tracking and visualizing the Knox County mobile wellness van program.

## 🎯 Project Overview

This dashboard helps:
- **Communities** find where and when the wellness van will be available
- **City Partners** track program effectiveness and reach
- **Program Managers** make data-driven decisions about service delivery

## 📊 Features

- Interactive map showing van locations and schedules
- Real-time service tracking and analytics
- Community-facing interface for upcoming stops
- Partner dashboard with exportable reports
- Historical timeline of van impact

## 🏗️ Architecture

### Data Management (Client-Friendly)
We use **Google Sheets** as the data backend so the Knox County team can:
- ✅ Update data without touching code
- ✅ Use familiar spreadsheet interface
- ✅ Collaborate with team members
- ✅ Track version history automatically

### Dashboard (GitHub Pages)
- Static website hosted free on GitHub Pages
- Automatically pulls data from Google Sheets
- Updates in real-time when data changes
- No server costs or maintenance

### Tech Stack
- **Frontend**: HTML, CSS, JavaScript (vanilla or React)
- **Mapping**: Leaflet.js (open source, free)
- **Data Source**: Google Sheets API
- **Hosting**: GitHub Pages
- **Version Control**: Git/GitHub

## 🚀 Setup Instructions

### 1. Set Up Google Sheets Data Source

#### Create Your Data Sheets:
1. Create a new Google Sheet with these tabs:
   - **Van Schedule** (date, time, location, services offered)
   - **Service Tracking** (visits, attendance, services provided)
   - **Census Tract Data** (demographic and health indicators)

2. Make the sheet publicly viewable:
   - File → Share → Change to "Anyone with link can view"
   - Copy the Sheet ID from the URL

3. Enable Google Sheets API (for more advanced features):
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Sheets API
   - Create API credentials (API Key)

### 2. Set Up Your Local Development Environment

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/knox-wellness-dashboard.git
cd knox-wellness-dashboard

# Install dependencies (if using npm)
npm install

# Start local development server
npm start
# OR use Python's built-in server
python3 -m http.server 8000
```

### 3. Configure Data Connection

Edit `config/config.js`:
```javascript
const CONFIG = {
  GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE',
  GOOGLE_API_KEY: 'YOUR_API_KEY_HERE', // Optional, for higher rate limits
  MAP_CENTER: [44.1, -69.1], // Knox County, ME
  MAP_ZOOM: 10
};
```

### 4. Deploy to GitHub Pages

```bash
# Build the project (if needed)
npm run build

# Push to GitHub
git add .
git commit -m "Initial dashboard deployment"
git push origin main

# Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch → Save
```

Your dashboard will be live at: `https://YOUR-USERNAME.github.io/knox-wellness-dashboard/`

## 📝 How Clients Update Data

### For Knox County Team (Non-Technical):

1. **Open your Google Sheet** (bookmark this link!)
2. **Add/Edit data** in the appropriate tab:
   - New van stop? Add a row in "Van Schedule"
   - Record services provided? Add to "Service Tracking"
3. **Save** (automatically saves in Google Sheets)
4. **Refresh the dashboard** - changes appear within 1-2 minutes

### Data Format Examples:

#### Van Schedule Sheet:
| Date | Time | Location | Address | Services | Zip Code |
|------|------|----------|---------|----------|----------|
| 2025-11-15 | 10:00 AM | Camden Library | 55 Main St | Health Screening, Dental | 04843 |

#### Service Tracking Sheet:
| Date | Location | Attendees | Services Provided | Notes |
|------|----------|-----------|-------------------|-------|
| 2025-11-01 | Rockland | 25 | Blood pressure, wellness education | High turnout |

## 🗂️ Project Structure

```
knox-wellness-dashboard/
├── index.html              # Main dashboard page
├── public/
│   ├── community.html      # Community-facing interface
│   ├── partners.html       # Partner analytics dashboard
│   └── assets/
│       ├── css/            # Stylesheets
│       ├── js/             # JavaScript files
│       └── images/         # Icons, logos
├── config/
│   └── config.js           # Configuration settings
├── data/
│   ├── census-tract.json   # Census tract boundaries (GeoJSON)
│   └── sample-data.json    # Sample data for development
├── docs/                   # Documentation
│   ├── CLIENT_GUIDE.md     # Guide for Knox County team
│   └── DEVELOPER_GUIDE.md  # Technical documentation
└── README.md
```

## 🔒 Privacy & Security

- No personally identifiable information (PII) stored in Google Sheets
- HIPAA compliance: No protected health information (PHI)
- Only aggregate statistics and scheduled locations
- Review data before publishing to ensure compliance

## 📈 Future Enhancements

- [ ] Mobile app version
- [ ] SMS notifications for upcoming van stops
- [ ] Integration with city health data systems
- [ ] Predictive analytics for optimal routing
- [ ] Multi-language support
- [ ] Offline mode for areas with limited connectivity

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📞 Support

For questions or issues:
- Technical: Create a GitHub issue
- Content/Data: Contact Knox County Health Department

## 📄 License

[Your chosen license - e.g., MIT]

---

**Built by Scout Labs for Knox County Creative Tech Initiative**
